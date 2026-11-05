import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {searchProducts,createDeeplinks} from './affiliate-research.mjs';
const out='logs/existing-articles-20261105-products.json';
const records=existsSync(out)?JSON.parse(readFileSync(out,'utf8')):[];
for(const spec of [
 {key:'math',query:'수모형 연결큐브',id:7145839339,subId:'tpmath261105'},
 {key:'throwing',query:'유아 헝겊책',id:6342551928,subId:'tpthrow261105'},
]){
 if(records.some(p=>p.key===spec.key))continue;
 const results=await searchProducts(spec.query,10),p=results.find(p=>p.productId===spec.id);
 if(!p)throw Error('Reviewed product not found: '+spec.key);
 const original=new URL(p.affiliateUrl);
 const destination=original.hostname==='www.coupang.com'?original.href:'https://www.coupang.com/vp/products/'+p.productId;
 const links=await createDeeplinks([destination],spec.subId);
 const response=await fetch(p.image);if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Invalid product image');
 const file='/assets/images/blog/existing-20261105-'+spec.key+'-product.jpg';
 writeFileSync(resolve('.'+file),Buffer.from(await response.arrayBuffer()));
 records.push({...spec,...p,affiliateUrl:links[0].landingUrl,image:file,checkedAt:'2026-11-05'});
 writeFileSync(out,JSON.stringify(records,null,2)+'\n');
 console.log(JSON.stringify({key:spec.key,name:p.name,id:p.productId,subId:spec.subId}));
 await new Promise(r=>setTimeout(r,1600));
}
