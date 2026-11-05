import {readFileSync,writeFileSync} from 'node:fs';
const jobs=[
 {key:'math',file:'first-grade-math-word-problem-reading.html',image:'/assets/blog/math-word-problem-reading.webp'},
 {key:'throwing',file:'toddler-throwing-toys.html',image:'/assets/images/blog/toddler-throwing-soft-ball-20261105.webp'},
];
const products=JSON.parse(readFileSync('logs/existing-articles-20261105-products.json','utf8'));
const path='data/coupang-article-tracking.json',tracking=JSON.parse(readFileSync(path,'utf8'));
for(const job of jobs){
 const file='blog/'+job.file,p=products.find(p=>p.key===job.key);let html=readFileSync(file,'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)[1];
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,start,value,end)=>{
  const schema=JSON.parse(value),article=schema['@graph']?.find(n=>n['@type']==='Article')||(schema['@type']==='Article'?schema:null);
  if(article){article.dateModified='2026-11-05';article.image='https://toypoppo.kr'+job.image;}
  return start+JSON.stringify(schema)+end;
 });
 if(!html.includes('property="og:image"'))html=html.replace('</head>',`<meta property="og:image" content="https://toypoppo.kr${job.image}">\n</head>`);
 writeFileSync(file,html,'utf8');
 const url='https://toypoppo.kr/blog/'+job.file,old=tracking.articles.find(a=>a.subId===p.subId);
 if(old&&old.url!==url)throw Error('Tracking collision');
 if(!old)tracking.articles.push({subId:p.subId,title,url,activatedAt:'2026-11-05T17:10:00+09:00',productId:p.productId,affiliateUrl:p.affiliateUrl});
}
writeFileSync(path,JSON.stringify(tracking,null,2)+'\n','utf8');
console.log('Updated two article metadata records and independent tracking mappings');
