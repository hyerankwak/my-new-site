import {writeFileSync,existsSync} from 'node:fs';
import records from './content-family-week-20261105-travel.mjs';
const imageUpdates={
 '3827798':'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/04/K9WP/QQsghvCKOd.jpg',
 '6118036':'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2026/09/22/IvGZ/SDe1PrCoh1.jpg',
 '6114788':'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2026/06/11/mPDA/Ks4M5WTTpl.jpg',
 '6117778':'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2026/10/06/3ceT/5HeODffM4p.jpg',
 '3880366':'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/25/5H7z/32qjFCW7RU.jpg',
};
const audit=[];
for(const r of records){
 let url=r.href,trail=[];
 for(let i=0;i<6;i++){
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});trail.push({url,status:response.status});
  const location=response.headers.get('location');if(!location)break;url=new URL(location,url).href;
 }
 const decoded=decodeURIComponent(decodeURIComponent(url));
 const matching=decoded.includes(r.gid)||trail.some(t=>decodeURIComponent(t.url).includes(r.gid));
 if(!matching)throw Error('Affiliate destination could not be verified for '+r.gid);
 let cardImage=r.cardImage;
 if(imageUpdates[r.gid]){cardImage='family-reused-20261105-'+r.gid+'.jpg';const file='assets/images/places/'+cardImage;if(!existsSync(file)){const response=await fetch(imageUpdates[r.gid]);if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Invalid official thumbnail');writeFileSync(file,Buffer.from(await response.arrayBuffer()));}}
 audit.push({gid:r.gid,href:r.href,rating:r.rating,reviews:r.reviews,price:r.price,cardImage,verifiedAt:'2026-11-05',destinationMatched:matching,officialImageSource:imageUpdates[r.gid]||'Existing official product thumbnail'});
 writeFileSync('logs/family-week-reused-20261105-products.json',JSON.stringify(audit,null,2)+'\n');
 console.log(JSON.stringify({gid:r.gid,destinationMatched:matching,cardImage}));
}
