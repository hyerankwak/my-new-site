import {readFileSync,writeFileSync} from 'node:fs';
const queue=JSON.parse(readFileSync('data/toypoppo-prewritten-queue.json','utf8'));
const urls=[...queue.items.filter(x=>x.date==='2026-11-05'&&x.status==='published').map(x=>x.url),'https://toypoppo.kr/blog/first-grade-math-word-problem-reading.html','https://toypoppo.kr/blog/toddler-throwing-toys.html'];
const results=[];
for(const url of urls){
 let good=false;
 for(let attempt=0;attempt<8;attempt++){
  const response=await fetch(url+'?verify=20261105-a11efdd',{signal:AbortSignal.timeout(20000)}),html=await response.text();
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  good=response.status===200&&!!title&&!title.includes('404');
  if(url.endsWith('/first-grade-math-word-problem-reading.html'))good&&=html.includes('subid=tpmath261105');
  if(url.endsWith('/toddler-throwing-toys.html'))good&&=html.includes('subid=tpthrow261105')&&html.includes('toddler-throwing-soft-ball-20261105.webp');
  if(good){results.push({url,status:response.status,title});break;}
  if(attempt<7)await new Promise(r=>setTimeout(r,10000));
 }
 if(!good)throw Error('Live verification failed: '+url);
}
for(const file of ['/assets/article-affiliate.css','/assets/images/blog/toddler-throwing-soft-ball-20261105.webp','/assets/images/blog/toddler-throwing-calm-boundary-20261105.webp']){const response=await fetch('https://toypoppo.kr'+file);if(!response.ok)throw Error('Missing live asset '+file);}
writeFileSync('logs/live-20261105-verified.json',JSON.stringify({verifiedAt:new Date().toISOString(),results},null,2)+'\n');console.log(JSON.stringify({pages:results.length,assets:3,results},null,2));
