import {readFileSync,writeFileSync,existsSync,mkdirSync,realpathSync} from 'node:fs';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function scheduledAt(item){return Date.parse(`${item.date}T${item.scheduledTime}:00+09:00`);}
export function safePath(root,relative,prefix){
 if(typeof relative!=='string'||!relative.startsWith(prefix)||relative.includes('\\'))throw Error('Invalid publication path');
 const p=resolve(root,relative);if(!p.startsWith(resolve(root,prefix)+sep))throw Error('Path escapes publication root');
 if(existsSync(p)&&!realpathSync(p).startsWith(realpathSync(resolve(root,prefix))+sep))throw Error('Symlink escapes publication root');return p;
}
export function validateQueue(root,queue){
 if(queue.version!==1||!Array.isArray(queue.items))throw Error('Invalid GitHub publication queue');
 const targets=new Set(),slots=new Set();
 for(const x of queue.items){
  safePath(root,x.source,'.publication/articles/');safePath(root,x.target,'blog/');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!/^\d\d:\d\d$/.test(x.scheduledTime)||!Number.isFinite(scheduledAt(x)))throw Error('Invalid schedule');
  if(!['ready','published'].includes(x.status)||!x.title||x.url!==`https://toypoppo.kr/${x.target}`)throw Error('Invalid publication record');
  if(targets.has(x.target)||slots.has(x.date+':'+x.scheduledTime))throw Error('Duplicate article or slot');targets.add(x.target);slots.add(x.date+':'+x.scheduledTime);
  const html=readFileSync(safePath(root,x.source,'.publication/articles/'),'utf8');
  if(!html.includes(`href="${x.url}"`)||!html.includes('<article')||!html.includes('application/ld+json'))throw Error('Invalid stored article');
  if(/<meta[^>]+noindex/i.test(html)||html.includes('???'))throw Error('Unpublishable article');
  for(const m of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g))if(!existsSync(resolve(root,'.'+m[1])))throw Error('Missing article asset '+m[1]);
 }
}
export function publicStatus(queue,now){
 const day=date=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date),today=day(now);
 return {version:1,engine:'github-actions',repository:'hyerankwak/my-new-site',updatedAt:now.toISOString(),operationDate:today,
  items:queue.items.map(({source,...x})=>x),todayCount:queue.items.filter(x=>x.status==='published'&&x.publishedAt&&day(new Date(x.publishedAt))===today).length,
  readyCount:queue.items.filter(x=>x.status==='ready').length,workflowUrl:'https://github.com/hyerankwak/my-new-site/actions/workflows/publish-toypoppo.yml'};
}
function save(root,queue,now){writeFileSync(resolve(root,'.publication/queue.json'),JSON.stringify(queue,null,2)+'\n');mkdirSync(resolve(root,'data'),{recursive:true});writeFileSync(resolve(root,'data/toypoppo-publication-status.json'),JSON.stringify(publicStatus(queue,now),null,2)+'\n');}
export function publishDue(root,{now=new Date(),dryRun=false}={}){
 const queue=JSON.parse(readFileSync(resolve(root,'.publication/queue.json'),'utf8'));validateQueue(root,queue);
 const pending=queue.items.filter(x=>x.status==='published'&&!x.verifiedAt);
 const next=queue.items.filter(x=>x.status==='ready'&&scheduledAt(x)<=now.getTime()).sort((a,b)=>scheduledAt(a)-scheduledAt(b))[0];
 const last=queue.items.filter(x=>x.publishedAt).map(x=>Date.parse(x.publishedAt)).sort((a,b)=>b-a)[0];
 const selected=!pending.length&&next&&(!last||now.getTime()-last>=55*60000)?next:null;
 if(dryRun)return {changed:false,total:queue.items.length,ready:queue.items.filter(x=>x.status==='ready').length,due:next?.title??null,needsDeployment:pending.length>0};
 if(selected){
  const target=safePath(root,selected.target,'blog/'),html=readFileSync(safePath(root,selected.source,'.publication/articles/'),'utf8');
  if(existsSync(target)&&readFileSync(target,'utf8')!==html)throw Error('Refusing to replace existing article');
  const indexPath=resolve(root,'blog/index.html'),sitemapPath=resolve(root,'sitemap.xml');let index=readFileSync(indexPath,'utf8'),sitemap=readFileSync(sitemapPath,'utf8');
  if(!index.includes('<div class="link-grid">')||!sitemap.includes('</urlset>'))throw Error('Missing index or sitemap anchor');
  const href='/'+selected.target;
  if(!index.includes(`href="${href}"`))index=index.replace('<div class="link-grid">',`<div class="link-grid"><a href="${href}"><strong>${esc(selected.title)}</strong><span>${esc(selected.description)}</span></a>`);
  if(!sitemap.includes(`<loc>${selected.url}</loc>`))sitemap=sitemap.replace('</urlset>',`  <url><loc>${selected.url}</loc><lastmod>${selected.date}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n</urlset>`);
  writeFileSync(target,html);writeFileSync(indexPath,index);writeFileSync(sitemapPath,sitemap);
  selected.status='published';selected.publishedAt=now.toISOString();selected.verifiedAt=null;selected.runUrl=process.env.GITHUB_RUN_ID?`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`:null;
 }
 save(root,queue,now);return {changed:Boolean(selected)||pending.length>0,published:selected?.url??null,pending:pending.length};
}
export async function verifyPublished(root,{fetcher=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms)),attempts=12}={}){
 const queue=JSON.parse(readFileSync(resolve(root,'.publication/queue.json'),'utf8'));validateQueue(root,queue);
 for(const x of queue.items.filter(x=>x.status==='published'&&!x.verifiedAt)){
  let ok=false;for(let i=0;i<attempts;i++){
   try{const response=await fetcher(x.url+'?publication='+encodeURIComponent(x.publishedAt),{signal:AbortSignal.timeout(20000)}),text=await response.text(),title=text.match(/<title>([\s\S]*?)<\/title>/i)?.[1];if(response.status===200&&title===esc(x.title)){ok=true;break;}}catch{}
   if(i+1<attempts)await sleep(10000);
  }
  if(!ok)throw Error('Live URL/title verification failed: '+x.url);x.verifiedAt=new Date().toISOString();save(root,queue,new Date());
 }
 return {verified:queue.items.filter(x=>x.verifiedAt).length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const root=resolve(here,'..'),result=process.argv.includes('--verify')?await verifyPublished(root):publishDue(root,{dryRun:process.argv.includes('--dry-run')});console.log(JSON.stringify(result));if(process.env.GITHUB_OUTPUT)writeFileSync(process.env.GITHUB_OUTPUT,`changed=${Boolean(result.changed)}\n`,{flag:'a'});}catch(e){console.error(e.message);process.exitCode=1;}
}
