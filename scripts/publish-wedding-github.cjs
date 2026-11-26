const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=process.env.WEDDING_SITE_ROOT||path.resolve(__dirname,'..');
const file=path.join(root,'.publication/queue.json');
const now=process.env.WEDDING_NOW||new Date().toISOString();
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
const queue=JSON.parse(fs.readFileSync(file,'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safe(rel){const p=path.resolve(root,rel);if(!p.startsWith(path.resolve(root)+path.sep))throw Error('Unsafe queue path');return p;}
function hash(data){return crypto.createHash('sha256').update(data).digest('hex');}
function save(){fs.writeFileSync(file,JSON.stringify(queue,null,2));}
function check(){
 const paths=new Set();
 for(const item of queue.items){
  if(paths.has(item.outputPath))throw Error('Duplicate destination');paths.add(item.outputPath);
  const html=fs.readFileSync(safe(item.draftPath),'utf8');
  if(hash(html)!==item.sha256)throw Error('Draft hash mismatch');
  if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('Expected one H1');
  if(!html.includes(item.affiliateUrl)||!html.includes('수수료'))throw Error('Affiliate disclosure or link missing');
  if(!/^https:\/\/(www\.)?replyalba\.com\/pt\//.test(item.affiliateUrl))throw Error('Invalid affiliate destination');
  if(item.eventEnd<item.scheduledAt.slice(0,10))throw Error('Fair expired before its slot');
  if(/�|\?{4}|장소 확인 필요/.test(html))throw Error('Broken or placeholder content');
 }
}
function status(){
 const data={engine:'github-actions',updatedAt:now,items:queue.items.map(({workingTitle,canonical,scheduledAt,status,publishedAt,lastError})=>({title:workingTitle,url:canonical,scheduledAt,status,publishedAt,lastError}))};
 fs.mkdirSync(path.join(root,'data'),{recursive:true});
 fs.writeFileSync(path.join(root,'data/wedding-publication-status.json'),JSON.stringify(data,null,2));
 const rows=data.items.map(i=>`<tr><td>${esc(i.scheduledAt.slice(0,10))}</td><td>${esc(({approved:'예약됨',prepared:'배포 확인 중',published:'발행·접속 확인',failed:'확인 필요'})[i.status]||i.status)}</td><td>${esc(i.title)}<br><a href="${esc(i.url)}">${esc(i.url)}</a></td></tr>`).join('');
 fs.mkdirSync(path.join(root,'reports'),{recursive:true});
 fs.writeFileSync(path.join(root,'reports/wedding-github-publication.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>웨딩가이드 발행 현황</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:24px auto;padding:16px}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{padding:12px;border:1px solid #ddd;text-align:left;overflow-wrap:anywhere}td:first-child{width:110px}td:nth-child(2){width:120px}@media(max-width:600px){td,th{display:block;width:100%!important;box-sizing:border-box}tr{display:block;margin-bottom:16px}}</style><h1>웨딩가이드 발행 현황</h1><p>예약 글과 실제 배포·접속이 확인된 글을 구분합니다. 검색 색인을 보장하는 표시는 아닙니다.</p><table><tbody>${rows}</tbody></table></html>`);
}
function prepare(item){
 const html=fs.readFileSync(safe(item.draftPath),'utf8'),out=safe(item.outputPath);
 if(fs.existsSync(out)&&hash(fs.readFileSync(out))!==item.sha256)throw Error('Destination already contains different content');
 fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);
 const home=path.join(root,'index.html');let text=fs.readFileSync(home,'utf8');
 const marker='<!-- github-published-start -->',end='<!-- github-published-end -->';
 const published=queue.items.filter(x=>x.status==='published'||x.id===item.id);
 const section=`${marker}<section style="max-width:1120px;margin:24px auto;padding:16px"><h2>최신 웨딩박람회 준비 글</h2><ul>${published.map(x=>`<li><a href="/${esc(x.outputPath.replace(/\.html$/,''))}">${esc(x.workingTitle)}</a></li>`).join('')}</ul></section>${end}`;
 text=text.includes(marker)?text.replace(/<!-- github-published-start -->[\s\S]*?<!-- github-published-end -->/,section):text.replace('</main>',section+'</main>');
 if(!text.includes(marker))throw Error('Homepage insertion failed');fs.writeFileSync(home,text);
 const sm=path.join(root,'sitemap.xml');let xml=fs.readFileSync(sm,'utf8');
 if(!xml.includes(`<loc>${item.canonical}</loc>`))xml=xml.replace('</urlset>',`<url><loc>${item.canonical}</loc><lastmod>${today}</lastmod></url></urlset>`);fs.writeFileSync(sm,xml);
 for(const name of ['rss.xml','feed.xml']){const f=path.join(root,name);if(!fs.existsSync(f))continue;let feed=fs.readFileSync(f,'utf8');if(!feed.includes(`<guid>${item.canonical}</guid>`))feed=feed.replace('</channel>',`<item><title>${esc(item.workingTitle)}</title><link>${item.canonical}</link><guid>${item.canonical}</guid><pubDate>${new Date(item.scheduledAt).toUTCString()}</pubDate></item></channel>`);fs.writeFileSync(f,feed);}
 item.status='prepared';item.preparedAt=now;save();status();
}
async function verify(){
 for(const item of queue.items.filter(x=>x.status==='prepared')){
  let last;
  for(let n=0;n<6;n++){
   try{const response=await fetch(item.canonical+'?verify='+Date.now(),{signal:AbortSignal.timeout(20000)});const html=await response.text();if(response.status!==200||!html.includes(item.workingTitle)||!html.includes(item.affiliateUrl))throw Error('Live content not verified');item.status='published';item.publishedAt=now;delete item.lastError;last=null;break;}catch(e){last=e;await new Promise(r=>setTimeout(r,10000));}
  }
  if(last){item.lastError=last.message;save();status();throw last;}
 }
 save();status();console.log('Deployment and live URL verification passed');
}
async function main(){
 check();
 if(process.argv.includes('--verify'))return verify();
 if(process.argv.includes('--check')){status();console.log(JSON.stringify({validated:queue.items.length,today,remaining:queue.items.filter(x=>x.status!=='published').length}));return;}
 const item=queue.items.find(x=>x.status==='prepared')||queue.items.find(x=>x.status==='approved'&&new Date(x.scheduledAt)<=new Date(now)&&x.eventEnd>=today);
 if(!item){console.log('No due nonexpired article');if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'changed=false\n');return;}
 prepare(item);if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'changed=true\n');console.log(JSON.stringify({prepared:item.canonical,status:'awaiting-deployment-verification'}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
