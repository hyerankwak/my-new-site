const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const articlePath = '/blog/rummikub-classic-elementary-gift-age-rules-20261031.html';
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.jpg': 'image/jpeg' })[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  let browser;
  try {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
    const page = await browser.newPage();
    await page.route('**/*', r => r.request().url().startsWith(origin + '/') ? r.continue() : r.abort());
    const report = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(origin + articlePath, { waitUntil: 'networkidle' });
      await page.locator('article img').evaluateAll(images => images.forEach(i => i.loading = 'eager'));
      await page.waitForFunction(() => [...document.querySelectorAll('article img')].every(i => i.complete));
      const broken = await page.locator('article img').evaluateAll(images => images.filter(i => !i.naturalWidth).map(i => i.getAttribute('src')));
      if (broken.length) throw Error(`Undecodable images: ${JSON.stringify(broken)}`);
      await page.locator('article img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
      const stats = await page.evaluate(() => {
        const article = document.querySelector('article');
        const links = [...article.querySelectorAll('a[href*="link.coupang.com"]')];
        const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
        return {
          width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1,
          articleWidth: article.getBoundingClientRect().width,
          images: [...article.querySelectorAll('img')].every(i => i.naturalWidth > 0),
          links: links.length, sponsored: links.every(a => a.rel.includes('sponsored')),
          buttonSize: [...article.querySelectorAll('.affiliate-card__button')].every(b => b.getBoundingClientRect().height >= 52 && parseFloat(getComputedStyle(b).fontSize) >= 18),
          disclosedFirst: article.innerHTML.indexOf('affiliate-notice') < article.innerHTML.indexOf('class="affiliate-card"'),
          faq: schema['@graph'].find(s => s['@type'] === 'FAQPage').mainEntity.every(q => article.textContent.includes(q.name) && article.textContent.includes(q.acceptedAnswer.text)),
          productPixels: (() => { const image = article.querySelector('.affiliate-card img'); const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d'); x.drawImage(image, 0, 0, 16, 16); return new Set([...x.getImageData(0, 0, 16, 16).data]).size; })(),
        };
      });
      if (stats.overflow || stats.articleWidth > 950 || !stats.images || stats.links !== 2 || !stats.sponsored || !stats.buttonSize || !stats.disclosedFirst || !stats.faq || stats.productPixels < 8) throw Error(JSON.stringify(stats));
      await page.screenshot({ path: path.join(root, `logs/coupang-pilot-${width}.png`), fullPage: true });
      report.push(stats);
    }
    fs.writeFileSync(path.join(root, 'logs/coupang-pilot-qa.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ checked: 1, failures: 0, report }));
  } finally {
    if (browser) await browser.close();
    await new Promise(r => server.close(r));
  }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
