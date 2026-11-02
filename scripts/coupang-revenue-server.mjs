import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { timingSafeEqual } from 'node:crypto';
import { resolve } from 'node:path';
import { root, cachedSummary, refreshReports } from './coupang-revenue.mjs';

const adminRoot = resolve(root, '../travel-admin-dashboard');
const password = readFileSync(resolve(adminRoot, '.admin-password.txt'), 'utf8').trim();
if (!password) throw Error('Existing admin password is required');
const port = Number(process.env.COUPANG_REVENUE_PORT || 4189);
let refreshing = false;
let lastRefresh = 0;
const send = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  const expected = Buffer.from(`admin:${password}`);
  const supplied = Buffer.from((req.headers.authorization || '').replace(/^Basic /, ''), 'base64');
  if (!req.headers.authorization?.startsWith('Basic ') || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="ToyPoppo private revenue"' }); res.end('Authentication required'); return;
  }
  if (req.headers.host !== `127.0.0.1:${port}` && req.headers.host !== `localhost:${port}`) { send(res, 403, { error: 'Invalid host' }); return; }
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(readFileSync(resolve(adminRoot, 'coupang-revenue.html'))); return;
  }
  if (url.pathname !== '/api/report' || !['GET', 'POST'].includes(req.method)) { send(res, 404, { error: 'Not found' }); return; }
  const days = Number(url.searchParams.get('days') || 7);
  if (![7, 30].includes(days)) { send(res, 400, { error: '기간은 7일 또는 30일이어야 합니다.' }); return; }
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (origin !== `http://127.0.0.1:${port}` && origin !== `http://localhost:${port}`) { send(res, 403, { error: 'Same-origin refresh required' }); return; }
    if (refreshing || Date.now() - lastRefresh < 60000) { send(res, 429, { error: '갱신 중이거나 직전 갱신 후 1분이 지나지 않았습니다.' }); return; }
    refreshing = true;
    try { await refreshReports(); lastRefresh = Date.now(); }
    catch { send(res, 502, { error: '쿠팡 실적 조회에 실패했습니다.' }); return; }
    finally { refreshing = false; }
  }
  try { const data = cachedSummary(days); if (!data) send(res, 404, { error: '저장된 실적이 없습니다. 실적 갱신을 눌러주세요.' }); else send(res, 200, data); }
  catch { send(res, 500, { error: '저장된 실적을 읽지 못했습니다.' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`Private revenue dashboard: http://127.0.0.1:${port}`));
