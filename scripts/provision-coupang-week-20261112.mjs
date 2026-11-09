import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createDeeplinks} from './affiliate-research.mjs';
import selected from './coupang-week-20261112-products.mjs';
import sharp from 'sharp';
const research=JSON.parse(readFileSync('logs/research-week-20261112.json','utf8'));
const extra=JSON.parse(readFileSync('logs/affiliate-keywords-latest.json','utf8'));
const keywords=[...research.keywords,...extra.results];
const path='logs/coupang-week-20261112-reviewed.json',reviewed=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):[];
for(let i=0;i<selected.length;i++){
 const s=selected[i];if(reviewed.some(x=>x.key===s.key))continue;
 const p=research.products.flatMap(x=>x.products).filter(p=>p.productId===s.id&&p.name.includes(s.match)).sort((a,b)=>a.price-b.price)[0];
 if(!p)throw Error('Exact product not found '+s.key);
 const u=new URL(p.affiliateUrl),original=new URL('https://www.coupang.com/vp/products/'+p.productId);
 for(const key of ['itemId','vendorItemId']){const value=u.searchParams.get(key);if(!value)throw Error('Missing exact option');original.searchParams.set(key,value);}
 const subId='tp261112'+String(i+1).padStart(2,'0'),[link]=await createDeeplinks([original.href],subId);
 const image='/assets/images/blog/coupang-20261112-'+s.key+'.jpg',response=await fetch(p.image);
 if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Invalid image');writeFileSync('.'+image,await sharp(Buffer.from(await response.arrayBuffer())).resize({width:800,height:800,fit:'inside',withoutEnlargement:true}).jpeg({quality:86,mozjpeg:true}).toBuffer());
 const volume=keywords.find(k=>k.keyword===s.keyword);
 reviewed.push({...s,name:p.name,observedPrice:p.price,affiliateUrl:link.landingUrl,image,subId,verifiedAt:'2026-11-09',volume:volume?{pc:volume.monthlyPc,mobile:volume.monthlyMobile}:null});
 writeFileSync(path,JSON.stringify(reviewed,null,2)+'\n');console.log(JSON.stringify({key:s.key,name:p.name,subId}));await new Promise(r=>setTimeout(r,1600));
}
