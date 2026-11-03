import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cachePath = resolve(root, 'logs/coupang-reports/latest.json');
const mappingPath = resolve(root, 'data/coupang-article-tracking.json');
export function kstDay(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).replaceAll('-', '');
}
export function dateOffset(day, amount) {
  const date = new Date(`${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10).replaceAll('-', '');
}
function credentials() {
  const env = {};
  for (const line of readFileSync(resolve(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(COUPANG_ACCESS_KEY|COUPANG_SECRET_KEY)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  if (!env.COUPANG_ACCESS_KEY || !env.COUPANG_SECRET_KEY) throw Error('Coupang credentials missing');
  return env;
}
export function signatureHeader(method, path, query, env, date) {
  const signature = createHmac('sha256', env.COUPANG_SECRET_KEY).update(date + method + path + query).digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${env.COUPANG_ACCESS_KEY}, signed-date=${date}, signature=${signature}`;
}
export async function refreshReports() {
  const env = credentials();
  const endDate = dateOffset(kstDay(), -1);
  const startDate = dateOffset(endDate, -29);
  const reports = {};
  for (const type of ['clicks', 'orders', 'cancels', 'commission']) {
    const path = `/v2/providers/affiliate_open_api/apis/openapi/reports/${type}`;
    const query = new URLSearchParams({ startDate, endDate }).toString();
    const date = new Date().toISOString().replace(/[-:]/g, '').slice(2, 15) + 'Z';
    try {
      const response = await fetch(`https://api-gateway.coupang.com${path}?${query}`, {
        headers: { Authorization: signatureHeader('GET', path, query, env, date) },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const body = await response.json();
      if (body.rCode !== '0' || !Array.isArray(body.data)) throw Error('Invalid reporting response');
      reports[type] = { ok: true, rows: body.data };
    } catch (error) {
      reports[type] = { ok: false, error: error.message.startsWith('HTTP ') ? error.message : 'Report request failed', rows: [] };
    }
    await new Promise(r => setTimeout(r, 1300));
  }
  const cache = { fetchedAt: new Date().toISOString(), startDate, endDate, reports };
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  return cache;
}
export function mappings() {
  if (!existsSync(mappingPath)) return [];
  const records = JSON.parse(readFileSync(mappingPath, 'utf8')).articles;
  if (new Set(records.map(r => r.subId)).size !== records.length) throw Error('Duplicate article tracking IDs');
  for (const record of records) if (!record.subId || !record.activatedAt || new URL(record.url).hostname !== 'toypoppo.kr') throw Error('Invalid article tracking mapping');
  return records.filter(record => !record.pendingPublication || existsSync(resolve(root, '.' + new URL(record.url).pathname)));
}
export function recentArticles(limit = 15) {
  const records = [];
  for (const name of readdirSync(resolve(root, 'blog'))) {
    if (!name.endsWith('.html') || name === 'index.html') continue;
    const html = readFileSync(resolve(root, 'blog', name), 'utf8');
    if (!/link\.coupang\.com|coupa\.ng/.test(html)) continue;
    const date = html.match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1] || '';
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    if (!title || !date) continue;
    records.push({ title, date, url: `https://toypoppo.kr/blog/${name}` });
  }
  return records.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
export function summarize(cache, days = 7, map = mappings(), recent = recentArticles()) {
  if (![7, 30].includes(days)) throw Error('Only 7 or 30 days supported');
  const startDate = dateOffset(cache.endDate, 1 - days);
  const rows = type => cache.reports[type]?.rows.filter(r => r.date >= startDate && r.date <= cache.endDate) || [];
  const available = cache.reports.commission?.ok === true;
  const totals = { clicks: 0, orders: 0, cancels: 0, gmv: 0, commission: 0 };
  const channels = new Map();
  for (const row of rows('commission')) {
    const key = row.subId || '';
    if (!channels.has(key)) channels.set(key, { subId: key, ...totals });
    const channel = channels.get(key);
    for (const [out, input] of [['clicks', 'click'], ['orders', 'order'], ['cancels', 'cancel'], ['gmv', 'gmv'], ['commission', 'commission']]) {
      const amount = Number(row[input] || 0);
      if (!Number.isFinite(amount)) throw Error('Invalid report amount');
      channel[out] += amount;
    }
  }
  for (const row of channels.values()) for (const key of Object.keys(totals)) totals[key] += row[key];
  const articles = map.map(record => {
    const activeDay = kstDay(new Date(record.activatedAt));
    const eligible = rows('commission').filter(r => r.subId === record.subId && r.date >= activeDay);
    return { ...record, status: !available ? 'unavailable' : activeDay > cache.endDate ? 'awaiting-report' : 'tracked',
      reportedRows: eligible.length, commission: available && activeDay <= cache.endDate ? eligible.reduce((s, r) => s + Number(r.commission || 0), 0) : null,
      orders: eligible.reduce((s, r) => s + Number(r.order || 0), 0),
      clicks: eligible.reduce((s, r) => s + Number(r.click || 0), 0) };
  });
  const articleCommission = available ? articles.reduce((s, a) => s + (a.commission || 0), 0) : null;
  const mappedUrls = new Set(map.map(a => a.url));
  return { fetchedAt: cache.fetchedAt, startDate, endDate: cache.endDate, days,
    latestReportedDate: rows('commission').map(r => r.date).sort().at(-1) || null,
    reportStatus: Object.fromEntries(Object.entries(cache.reports).map(([k, r]) => [k, { ok: r.ok, error: r.error }])),
    available, totals: available ? totals : null, articleCommission,
    otherOrUnattributedCommission: available ? totals.commission - articleCommission : null,
    channels: available ? [...channels.values()] : [], articles,
    untrackedArticles: recent.filter(a => !mappedUrls.has(a.url)),
    note: '계정 전체 발생 수익입니다. 최종 정산금이 아니며, 기존 구분 없는 실적은 토이포포 글에 소급 배분하지 않습니다.',
  };
}
export function cachedSummary(days = 7) {
  if (!existsSync(cachePath)) return null;
  return summarize(JSON.parse(readFileSync(cachePath, 'utf8')), days);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const cache = process.argv.includes('--refresh') ? await refreshReports() : JSON.parse(readFileSync(cachePath, 'utf8'));
    const summary = summarize(cache, process.argv.includes('--30') ? 30 : 7);
    console.log(JSON.stringify(summary, null, 2));
    if (!summary.available) process.exitCode = 1;
  } catch { console.error('Unable to read affiliate reports; credentials and raw responses were not printed.'); process.exitCode = 1; }
}
