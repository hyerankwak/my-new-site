import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createDeeplinks} from './affiliate-research.mjs';
import regions from './content-week-20261112-regions.mjs';
const products=JSON.parse(readFileSync('logs/coupang-week-20261112-reviewed.json','utf8'));
const path='logs/region-week-20261112-reviewed.json',records=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):[];
for(let i=0;i<regions.length;i++){
 const r=regions[i];if(records.some(x=>x.slug===r.slug))continue;
 const subId='tp261112r'+(i+1),picks=r.picks.map(key=>products.find(p=>p.key===key));
 if(picks.some(p=>!p))throw Error('Missing reviewed product');
 const originals=picks.map(p=>{const source=new URL(p.affiliateUrl),target=new URL('https://www.coupang.com/vp/products/'+p.id);for(const key of ['itemId','vendorItemId']){const value=source.searchParams.get(key);if(!value)throw Error('Exact product option missing');target.searchParams.set(key,value);}return target.href;});
 const links=await createDeeplinks(originals,subId);
 records.push({slug:r.slug,subId,products:picks.map((p,j)=>({...p,affiliateUrl:links[j].landingUrl,subId}))});writeFileSync(path,JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify({slug:r.slug,subId,products:picks.map(p=>p.key)}));await new Promise(r=>setTimeout(r,1500));
}
