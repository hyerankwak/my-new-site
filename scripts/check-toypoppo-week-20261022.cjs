const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const batch = process.argv[2] || '20261022';
if(!/^\d{8}$/.test(batch))throw new Error('Invalid week key');
const manifest = JSON.parse(fs.readFileSync(path.join(root,`data/toypoppo-week-${batch}-manifest.json`),'utf8'));
const queue = JSON.parse(fs.readFileSync(path.join(root,'data/toypoppo-prewritten-queue.json'),'utf8'));
const fail = message => {throw new Error(message);};
async function main() {
  if(manifest.length!==35)fail('Expected 35 articles');
  const articles=manifest.map(item=>({...item,html:fs.readFileSync(path.join(root,item.source),'utf8')}));
  for(const item of articles){
    const q=queue.items.filter(q=>q.date===item.date&&q.slot===item.slot);
    if(q.length!==1||q[0].status!=='ready'||q[0].source!==item.source)fail(`Queue mismatch ${item.title}`);
    const schema=JSON.parse(item.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const article=schema['@graph'].find(n=>n['@type']==='Article');
    if(article.mainEntityOfPage!==item.url||!article.datePublished.includes(item.scheduledTime))fail(`Schema mismatch ${item.title}`);
    if(!item.html.includes(`rel="canonical" href="${item.url}"`))fail(`Canonical mismatch ${item.title}`);
    const images=[...item.html.matchAll(/<figure[^>]*><img src="([^"]+)"/g)].map(m=>m[1]);
    if(images.length!==2)fail(`Need two images ${item.title}`);
    const hashes=images.map(src=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,src))).digest('hex'));
    if(new Set(hashes).size!==2)fail(`Duplicate image ${item.title}`);
    if(item.slot==='mrt'&&(!item.html.includes('후기 ')||!item.html.includes(item.affiliateUrl)))fail(`Missing travel details ${item.title}`);
  }
  const server=http.createServer((req,res)=>{
    const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  let browser;
  const report=[];
  try{
    const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
    browser=await chromium.launch({headless:true,...(fs.existsSync(edge)?{executablePath:edge}:{})});
    const page=await browser.newPage();
    await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
    for(const item of articles){
      await page.setViewportSize({width:390,height:844});
      await page.goto(`${origin}/${item.source}`,{waitUntil:'networkidle'});
      await page.locator('article img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
      await page.waitForFunction(()=>[...document.querySelectorAll('article img')].every(i=>i.complete));
      await page.locator('article img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
      const stats=await page.evaluate(()=>{
        const article=document.querySelector('article');
        const schema=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
        const faq=schema['@graph'].find(n=>n['@type']==='FAQPage');
        const aff=[...article.querySelectorAll('a')].filter(a=>/myrealt\.rip|replyalba\.com|coupa\.ng|link\.coupang\.com/.test(a.href));
        const buttons=[...article.querySelectorAll('.affiliate-card__button,.product-button')];
        const blankImages=[...article.querySelectorAll('img')].filter(img=>{const canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,16,16);const pixels=ctx.getImageData(0,0,16,16).data;const colors=new Set();for(let i=0;i<pixels.length;i+=4)colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);return colors.size<8;}).map(i=>i.src);
        return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...article.querySelectorAll('img')].filter(i=>!i.naturalWidth).map(i=>i.src),blankImages,title:document.title,affiliateCount:aff.length,sponsored:aff.every(a=>a.rel.includes('sponsored')),faqMatches:faq.mainEntity.every(q=>article.textContent.includes(q.name)&&article.textContent.includes(q.acceptedAnswer.text)),smallButton:buttons.some(a=>a.getBoundingClientRect().height<52||parseFloat(getComputedStyle(a).fontSize)<18)};
      });
      if(stats.overflow||stats.broken.length||stats.blankImages.length||stats.smallButton||!stats.sponsored||!stats.faqMatches||!stats.affiliateCount||stats.title!==item.title)fail(JSON.stringify({item:item.title,stats}));
      report.push({title:item.title,...stats});
      if(item.date===manifest[0].date&&item.slot==='mrt'){
        await page.locator('.article-figure').first().scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(root,`logs/week-${batch}-mobile-photo.png`)});
        await page.screenshot({path:path.join(root,`logs/week-${batch}-mobile.png`),fullPage:true});
      }
      await page.setViewportSize({width:1440,height:1000});
      const desktop=await page.locator('article').boundingBox();
      if(desktop.width>950||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))fail(`Desktop overflow ${item.title}`);
      if(item.date===manifest[0].date&&item.slot==='coupang')await page.screenshot({path:path.join(root,`logs/week-${batch}-desktop.png`),fullPage:true});
    }
    fs.writeFileSync(path.join(root,`logs/toypoppo-week-${batch}-qa.json`),JSON.stringify({checked:report.length,failures:0,report},null,2));
    console.log(JSON.stringify({checked:report.length,failures:0,imagesPerArticle:2,viewports:[390,1440]}));
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
