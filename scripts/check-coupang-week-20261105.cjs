const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/coupang-week-20261105-manifest.json'),'utf8'));
const queue=JSON.parse(fs.readFileSync(path.join(root,'data/toypoppo-prewritten-queue.json'),'utf8'));
const reviewed=JSON.parse(fs.readFileSync(path.join(root,'logs/coupang-week-20261105-reviewed.json'),'utf8'));
if(manifest.length!==14||new Set(manifest.map(x=>x.affiliateSubId)).size!==14)throw Error('Need 14 unique articles/tracking IDs');
const titles=[];
for(const file of fs.readdirSync(path.join(root,'blog'))){if(file.endsWith('.html')){const html=fs.readFileSync(path.join(root,'blog',file),'utf8');const title=html.match(/<title>(.*?)<\/title>/s)?.[1];if(title)titles.push(title);}}
for(const item of manifest){
 const q=queue.items.filter(x=>x.date===item.date&&x.slot===item.slot);
 if(q.length!==1||q[0].status!=='ready'||q[0].source!==item.source)throw Error('Queue mismatch '+item.title);
 if(titles.includes(item.title))throw Error('Duplicate published title');
 const html=fs.readFileSync(path.join(root,item.source),'utf8');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 const article=schema['@graph'].find(n=>n['@type']==='Article');
 if(article.mainEntityOfPage!==item.url||!article.datePublished.includes(item.scheduledTime))throw Error('Canonical/date mismatch');
 if(!html.includes(`rel="canonical" href="${item.url}"`))throw Error('Canonical missing');
 const photos=[...html.matchAll(/<figure[^>]*><img src="([^"]+)"/g)].map(m=>m[1]);
 if(photos.length!==2||new Set(photos.map(src=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,src))).digest('hex'))).size!==2)throw Error('Repeated body image');
 const links=[...html.matchAll(/href="(https:\/\/link\.coupang\.com[^\"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&')));
 if(links.length!==2||links.some(u=>u.searchParams.get('subid')!==item.affiliateSubId||u.searchParams.get('pageKey')!==String(item.affiliateProductId)))throw Error('Untracked/wrong product link');
}
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/__product-review'){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<html><head><style>body{font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:12px}.item{min-width:0;font-size:13px;line-height:1.6}.item img{width:100%;height:180px;object-fit:contain}</style></head><body><div class="grid">'+reviewed.map(r=>`<div class="item"><img src="${r.image}"><b>${r.key}</b><br>${r.name}</div>`).join('')+'</div></body></html>');return;
 }
 const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 let browser;try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const page=await browser.newPage();await page.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
  const results=[];
  for(const item of manifest)for(const width of [360,390,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+'/'+item.source,{waitUntil:'networkidle'});
   await page.locator('article img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.querySelectorAll('article img')].every(i=>i.complete));
   await page.locator('article img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
   const stats=await page.evaluate(()=>{
    const article=document.querySelector('article'),links=[...article.querySelectorAll('a[href*="link.coupang.com"]')];
    const json=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,articleWidth:article.getBoundingClientRect().width,
     imageCount:article.querySelectorAll('img').length,images:[...article.querySelectorAll('img')].every(i=>i.naturalWidth>0),
     nonblank:[...article.querySelectorAll('img')].every(image=>{const c=document.createElement('canvas');c.width=c.height=16;const ctx=c.getContext('2d');ctx.drawImage(image,0,0,16,16);return new Set(ctx.getImageData(0,0,16,16).data).size>=8;}),
     sponsored:links.every(l=>l.rel.includes('sponsored')),buttons:[...article.querySelectorAll('.affiliate-card__button')].every(b=>b.getBoundingClientRect().height>=52&&parseFloat(getComputedStyle(b).fontSize)>=18),
     disclosedFirst:article.innerHTML.indexOf('affiliate-notice')<article.innerHTML.indexOf('class="affiliate-card"'),
     faq:json['@graph'].find(n=>n['@type']==='FAQPage').mainEntity.every(q=>article.textContent.includes(q.name)&&article.textContent.includes(q.acceptedAnswer.text))};
   });
   if(stats.overflow||stats.articleWidth>950||stats.imageCount!==4||!stats.images||!stats.nonblank||!stats.sponsored||!stats.buttons||!stats.disclosedFirst||!stats.faq)throw Error(JSON.stringify({title:item.title,stats}));
   results.push({title:item.title,...stats});
   if([0,8].includes(manifest.indexOf(item))&&width!==360)await page.screenshot({path:path.join(root,`logs/coupang-week-${item.affiliateSubId}-${width}.png`),fullPage:true});
  }
  await page.setViewportSize({width:1700,height:800});await page.goto(origin+'/__product-review',{waitUntil:'networkidle'});await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.screenshot({path:path.join(root,'logs/coupang-week-20261105-products.png'),fullPage:true});
  fs.writeFileSync(path.join(root,'logs/coupang-week-20261105-qa.json'),JSON.stringify({articles:14,viewports:[360,390,1440],failures:0,results},null,2));
  console.log(JSON.stringify({articles:14,viewports:[360,390,1440],checks:results.length,failures:0}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
