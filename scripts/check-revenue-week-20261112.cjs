const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('data/revenue-week-20261112-manifest.json'),queue=read('data/toypoppo-prewritten-queue.json');
if(manifest.length!==35)throw Error('Expected 35 articles');
for(let d=12;d<=18;d++)if(queue.items.filter(x=>x.date==='2026-11-'+d&&x.status==='ready').length!==5)throw Error('Missing daily slot');
if(new Set(manifest.map(x=>x.url)).size!==35)throw Error('Duplicate target');
for(const item of manifest){
 const q=queue.items.filter(x=>x.date===item.date&&x.slot===item.slot);
 if(q.length!==1||q[0].source!==item.source||q[0].status!=='ready')throw Error('Queue mismatch');
 const html=fs.readFileSync(path.join(root,item.source),'utf8'),schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 if(schema['@graph'].length!==3||schema['@graph'][0].mainEntityOfPage!==item.url||!html.includes(`rel="canonical" href="${item.url}"`))throw Error('Invalid schema/canonical');
 const photos=[...html.matchAll(/<figure[^>]*><img src="([^"]+)"/g)].map(m=>m[1]);
 if(photos.length!==2||new Set(photos.map(p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'))).size!==2)throw Error('Repeated/missing body photos');
 if(item.slot==='mrt'&&!/· 후기 \d+개/.test(html))throw Error('Review data missing');
 if(item.affiliateSubId&&!html.includes('link.coupang.com'))throw Error('Affiliate link missing');
}
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname);
 if(!/^\/(assets\/|drafts\/)/.test(pathname)||!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage();await page.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());const results=[];
 for(const item of manifest)for(const width of [360,390,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+'/'+item.source,{waitUntil:'networkidle'});
  await page.locator('article img').evaluateAll(a=>a.forEach(i=>i.loading='eager'));
  await page.locator('article img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
  const stats=await page.evaluate(()=>{const a=document.querySelector('article'),cards=[...a.querySelectorAll('.affiliate-card')];return {
   overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...a.querySelectorAll('img')].every(i=>i.naturalWidth>0),
   nonblank:[...a.querySelectorAll('img')].every(i=>{const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');x.drawImage(i,0,0,12,12);return new Set(x.getImageData(0,0,12,12).data).size>8;}),
   cardCount:cards.length,sponsored:cards.every(c=>c.rel.includes('sponsored')),
   buttons:[...a.querySelectorAll('.affiliate-card__button')].every(b=>b.getBoundingClientRect().height>=52&&parseFloat(getComputedStyle(b).fontSize)>=18),
   width:a.getBoundingClientRect().width,bodyPhotos:[...a.querySelectorAll('figure img')].every(i=>i.getBoundingClientRect().width<=640&&i.getBoundingClientRect().height<=441),faq:[...a.querySelectorAll('#faq h3')].length};});
  if(stats.overflow||!stats.images||!stats.nonblank||!stats.sponsored||!stats.buttons||stats.width>930||!stats.bodyPhotos||stats.faq<3||stats.cardCount<2)throw Error(JSON.stringify({title:item.title,width,stats}));
  results.push({title:item.title,viewport:width,...stats});
  if(manifest.indexOf(item)<5&&width!==360){
   for(const img of await page.locator('article img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(root,`logs/revenue-week-20261112-${item.slot}-${width}.png`),fullPage:true});
   if(width===390)await page.locator('.affiliate-card').first().screenshot({path:path.join(root,`logs/revenue-week-20261112-${item.slot}-card.png`)});
  }
 }
 fs.writeFileSync(path.join(root,'logs/revenue-week-20261112-qa.json'),JSON.stringify({articles:35,checks:results.length,failures:0,results},null,2));console.log(JSON.stringify({articles:35,checks:results.length,failures:0}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.message);process.exitCode=1});
