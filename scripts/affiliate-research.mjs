import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const line of readFileSync(resolve(root, '.env'), 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if (match) env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
}

async function request(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Official API request failed: HTTP ${response.status}`);
  return response.json();
}

export async function keywordResearch(keywords) {
  const path = '/keywordstool';
  const timestamp = String(Date.now());
  const signature = createHmac('sha256', env.NAVER_SEARCHAD_SECRET_KEY)
    .update(`${timestamp}.GET.${path}`).digest('base64');
  const query = new URLSearchParams({ hintKeywords: keywords.join(','), showDetail: '1' });
  const data = await request(`https://api.searchad.naver.com${path}?${query}`, {
    'X-Timestamp': timestamp, 'X-API-KEY': env.NAVER_SEARCHAD_API_KEY,
    'X-Customer': env.NAVER_SEARCHAD_CUSTOMER_ID, 'X-Signature': signature,
  });
  return (data.keywordList || []).map(row => ({
    keyword: row.relKeyword, monthlyPc: row.monthlyPcQcCnt,
    monthlyMobile: row.monthlyMobileQcCnt, advertisingCompetition: row.compIdx,
  }));
}

export async function searchProducts(keyword, limit = 5) {
  const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search';
  const query = new URLSearchParams({ keyword, limit: String(limit) }).toString();
  const date = new Date().toISOString().replace(/[-:]/g, '').slice(2, 15) + 'Z';
  const signature = createHmac('sha256', env.COUPANG_SECRET_KEY)
    .update(date + 'GET' + path + query).digest('hex');
  const result = await request(`https://api-gateway.coupang.com${path}?${query}`, {
    Authorization: `CEA algorithm=HmacSHA256, access-key=${env.COUPANG_ACCESS_KEY}, signed-date=${date}, signature=${signature}`,
  });
  if (result.rCode !== '0') throw new Error(`Coupang application error: ${result.rCode}`);
  return (result.data?.productData || []).map(p => ({
    productId: p.productId, name: p.productName, price: p.productPrice,
    image: p.productImage, affiliateUrl: p.productUrl, isRocket: p.isRocket,
  }));
}

export async function createDeeplinks(coupangUrls, subId) {
  if (!/^[a-z0-9]{1,20}$/.test(subId) || !coupangUrls.length) throw Error('Invalid article tracking request');
  for (const value of coupangUrls) if (new URL(value).hostname !== 'www.coupang.com') throw Error('Unexpected destination');
  const path = '/v2/providers/affiliate_open_api/apis/openapi/deeplink';
  const date = new Date().toISOString().replace(/[-:]/g, '').slice(2, 15) + 'Z';
  const signature = createHmac('sha256', env.COUPANG_SECRET_KEY).update(date + 'POST' + path).digest('hex');
  const response = await fetch('https://api-gateway.coupang.com' + path, {
    method: 'POST', signal: AbortSignal.timeout(30000),
    headers: { Authorization: `CEA algorithm=HmacSHA256, access-key=${env.COUPANG_ACCESS_KEY}, signed-date=${date}, signature=${signature}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupangUrls, subId }),
  });
  if (!response.ok) throw Error(`Deeplink HTTP ${response.status}`);
  const result = await response.json();
  if (result.rCode !== '0' || result.data?.length !== coupangUrls.length) throw Error('Incomplete tracked links');
  for (const row of result.data) if (new URL(row.landingUrl).hostname !== 'link.coupang.com' || new URL(row.landingUrl).searchParams.get('subid') !== subId) throw Error('Tracking verification failed');
  return result.data;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const mode = process.argv[2];
    const terms = process.argv.slice(3);
    if (!terms.length || !['keywords', 'products'].includes(mode)) throw new Error('Usage: affiliate-research.mjs keywords|products terms...');
    const results = [];
    for (let i = 0; i < terms.length; i += mode === 'keywords' ? 5 : 1) {
      if (i) await new Promise(r => setTimeout(r, 1500));
      results.push(...await (mode === 'keywords' ? keywordResearch(terms.slice(i, i + 5)) : searchProducts(terms[i])));
    }
    const unique = [...new Map(results.map(p => [p.keyword ?? p.productId, p])).values()];
    const output = { checkedAt: new Date().toISOString(), terms, results: unique };
    mkdirSync(resolve(root, 'logs'), { recursive: true });
    writeFileSync(resolve(root, `logs/affiliate-${mode}-latest.json`), JSON.stringify(output, null, 2) + '\n');
    console.log(JSON.stringify({ checkedAt: output.checkedAt, count: unique.length,
      results: mode === 'keywords' ? unique.filter(p => terms.includes(p.keyword))
        : unique.map(({ image, affiliateUrl, ...p }) => ({ ...p, hasImage: !!image, hasAffiliateUrl: !!affiliateUrl })) }, null, 2));
  } catch (error) {
    // Do not log response bodies or headers containing authentication information.
    console.error(error.message);
    process.exitCode = 1;
  }
}
