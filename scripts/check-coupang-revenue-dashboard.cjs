const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const password = fs.readFileSync(path.resolve(root, '../travel-admin-dashboard/.admin-password.txt'), 'utf8').trim();
const origin = 'http://127.0.0.1:4189';
const headers = { Authorization: 'Basic ' + Buffer.from('admin:' + password).toString('base64') };
(async () => {
  assert.equal((await fetch(origin + '/api/report')).status, 401);
  assert.equal((await fetch(origin + '/api/report?days=999', { headers })).status, 400);
  assert.equal((await fetch(origin + '/api/report', { method: 'POST', headers: { ...headers, Origin: 'https://example.com' } })).status, 403);
  assert.equal((await fetch(origin + '/.env', { headers })).status, 404);
  assert.equal((await fetch(origin + '/logs/coupang-reports/latest.json', { headers })).status, 404);
  const report = await (await fetch(origin + '/api/report?days=7', { headers })).json();
  assert.equal(report.available, true);
  assert.equal(JSON.stringify(report).includes('orderId'), false);
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  try {
    const context = await browser.newContext({ httpCredentials: { username: 'admin', password } });
    const page = await context.newPage();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(origin, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.getElementById('account').textContent.includes('원'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      assert.match(await page.locator('#article').textContent(), /집계 대기/);
      await page.selectOption('#period', '30');
      await page.waitForFunction(() => document.getElementById('status').textContent.includes('2026.10.03'));
      await page.selectOption('#period', '7');
      await page.waitForFunction(() => document.getElementById('status').textContent.includes('2026.10.26'));
      const download = page.waitForEvent('download');
      await page.click('#csv');
      assert.match((await download).suggestedFilename(), /toypoppo-coupang/);
      await page.screenshot({ path: path.join(root, `logs/coupang-revenue-${width}.png`), fullPage: true });
    }
    console.log(JSON.stringify({ authentication: 'passed', privateFiles: 'blocked', csrf: 'blocked', csv: 'passed', viewports: [390, 1440] }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e.name + ': ' + e.message); process.exitCode = 1; });
