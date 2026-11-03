import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createDeeplinks } from './affiliate-research.mjs';
import selected from './coupang-week-20261105-products.mjs';

const research=JSON.parse(readFileSync('logs/coupang-week-20261105-research.json','utf8'));
const path='logs/coupang-week-20261105-reviewed.json';
const refreshKey=process.argv.includes('--refresh-key')?process.argv[process.argv.indexOf('--refresh-key')+1]:null;
const reviewed=(existsSync(path)?JSON.parse(readFileSync(path,'utf8')):[]).filter(r=>r.key!==refreshKey);
for(let i=0;i<selected.length;i++){
  const item=selected[i];
  const product=research.results.flatMap(r=>r.products).filter(p=>p.productId===item.id&&p.name.includes(item.match)).sort((a,b)=>a.price-b.price)[0];
  if(!product)throw Error('Reviewed exact product missing: '+item.key);
  const subId='tp261105'+String(i+1).padStart(2,'0');
  const image='/assets/images/blog/coupang-20261105-'+item.key+'.jpg';
  if(!existsSync('.'+image)||item.key===refreshKey){
    if(new URL(product.image).hostname!=='ads-partners.coupang.com')throw Error('Unexpected image host');
    const response=await fetch(product.image,{signal:AbortSignal.timeout(30000)});
    if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Invalid product image');
    writeFileSync('.'+image,Buffer.from(await response.arrayBuffer()));
  }
  if(!reviewed.some(r=>r.key===item.key)){
    const url=new URL(product.affiliateUrl);
    const original=new URL('https://www.coupang.com/vp/products/'+item.id);
    for(const key of ['itemId','vendorItemId']){if(!url.searchParams.get(key))throw Error('Product option missing');original.searchParams.set(key,url.searchParams.get(key));}
    const [link]=await createDeeplinks([original.href],subId);
    reviewed.push({...item,name:product.name,observedPrice:product.price,affiliateUrl:link.landingUrl,image,subId,verifiedAt:new Date().toISOString()});
    writeFileSync(path,JSON.stringify(reviewed,null,2)+'\n');
    await new Promise(r=>setTimeout(r,1600));
  }
}
console.log(JSON.stringify({reviewed:reviewed.length,uniqueTrackingIds:new Set(reviewed.map(r=>r.subId)).size,images:reviewed.filter(r=>existsSync('.'+r.image)).length}));
