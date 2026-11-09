import {writeFileSync,existsSync} from 'node:fs';
import selected from './mrt-week-20261112-products.mjs';
const audit=[];
for(const r of selected){
 let url=r.href,verified=false;
 for(let i=0;i<7;i++){const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});if(decodeURIComponent(decodeURIComponent(url)).includes(r.gid))verified=true;const location=response.headers.get('location');if(!location)break;url=new URL(location,url).href;}
 if(!verified)throw Error('Affiliate destination mismatch '+r.gid);
 if(r.imageSource&&!existsSync('assets/images/places/'+r.cardImage)){const response=await fetch(r.imageSource);if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Thumbnail failed');writeFileSync('assets/images/places/'+r.cardImage,Buffer.from(await response.arrayBuffer()));}
 audit.push({...r,destinationVerified:true});writeFileSync('logs/mrt-week-20261112-reviewed.json',JSON.stringify(audit,null,2)+'\n');console.log(JSON.stringify({gid:r.gid,verified:true,rating:r.rating,reviews:r.reviews}));
}
