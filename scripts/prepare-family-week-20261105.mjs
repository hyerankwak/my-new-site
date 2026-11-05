import {readFileSync,writeFileSync,existsSync,copyFileSync,renameSync} from 'node:fs';
import {renderArticle} from './prepare-toypoppo-week-20261022.mjs';
import region from './content-family-week-20261105-regions.mjs';
import mrt from './content-family-week-20261105-travel.mjs';
import education from './content-family-week-20261105-education.mjs';
const groups={region,mrt,education},campaign='family-week-20261105';
const queuePath='data/toypoppo-prewritten-queue.json',queue=JSON.parse(readFileSync(queuePath,'utf8'));
const audit=JSON.parse(readFileSync('logs/family-week-reused-20261105-products.json','utf8'));
const B='/assets/images/blog/',P='/assets/images/places/';
const regionPhotos=[
 [B+'aviation-family-reference-20261105.webp',B+'seven-year-old-block-play-family-photo.jpg'],
 [P+'science-museum-guide.webp',P+'daejeon-nexperium-science-class-2.png'],
 [P+'museum-history-guide.webp',B+'twenty-four-month-pretend-play-family-photo.jpg'],
 [P+'children-museum-guide.webp',B+'five-year-old-toy-shelf-family-photo.jpg'],
 [P+'museum-history-guide.webp',B+'seven-year-old-block-play-family-photo.jpg'],
 [P+'seoul-national-museum-docent-kids-1.png',B+'five-year-old-toy-shelf-family-photo.jpg'],
 [B+'rail-family-reference-20261105.webp',B+'seven-year-old-block-play-family-photo.jpg'],
];
const padPhotos=[B+'elementary-online-learning-free-trial-guide-routine.jpg',B+'elementary-online-learning-free-trial-guide-check.jpg'];
const prepared=[];
for(let index=0;index<7;index++)for(const [slot,records] of Object.entries(groups)){
 const date=`2026-11-${String(5+index).padStart(2,'0')}`,record={...records[index],checkedAt:'2026-11-05'};
 const current=queue.items.find(x=>x.date===date&&x.slot===slot);
 if(current&&(current.status!=='ready'||current.campaign!==campaign))throw Error('Refusing to overwrite existing slot '+date+' '+slot);
 if(slot==='region')record.photos=regionPhotos[index];
 if(slot==='education'){
  record.photos=index===1?[B+'elihigh-kids-home-learning-generated.png',B+'first-grade-dictation-review-parent.jpg']:index%2?[...padPhotos].reverse():padPhotos;
  record.sources=record.pads.map(i=>[['https://replyalba.com/pt/yqygnqm3LK','엘리하이 키즈 현재 무료체험 신청 안내'],['https://replyalba.com/pt/Kck7mkbVGA','엘리하이 초등 현재 무료체험 신청 안내'],['https://replyalba.com/pt/YKOWhp4rRH','온리원 중등 현재 무료체험 신청 안내'],['https://replyalba.com/pt/UPlKbFjMhf','밀크T 초등 현재 무료체험 신청 안내'],['https://replyalba.com/pt/Y87rxj4tUZ','엠베스트 현재 무료체험 신청 안내']][i]);
 }
 if(slot==='mrt'){const a=audit.find(a=>a.gid===record.gid);if(!a?.destinationMatched)throw Error('Affiliate destination not verified');record.cardImage=a.cardImage;}
 const result=renderArticle(record,slot,date,index);let html=result.html;
 if(slot==='education'){
  const card=html.match(/<a class="affiliate-card"[\s\S]*?<\/a>/)?.[0];if(!card)throw Error('No pad card');
  html=html.replace(/(<p class="affiliate-notice">[\s\S]*?<\/p>)/,'$1'+card);
  html=html.replace(/(<a href="https:\/\/replyalba\.com\/pt\/[^\"]+" )rel="noopener"/g,'$1rel="sponsored nofollow noopener"');
 }
 if(slot==='mrt')html=html.replaceAll('2026년 11월 5일 확인 기준','2026년 11월 4~5일 확인 기준');
 const text=html.match(/<article\b[\s\S]*?<\/article>/)[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 if(text.length<2900)throw Error('Short article '+text.length+': '+record.title);
 if(/\?\?\?|수익형 글|기준이 먼저입니다|이번에 선정한|product ID|API|MCP/.test(text))throw Error('Internal wording leaked');
 for(const m of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))if(!existsSync('.'+m[1]))throw Error('Missing local asset '+m[1]);
 if(queue.items.some(x=>x.status==='published'&&(x.title===record.title||x.target===result.item.target)))throw Error('Published duplicate');
 prepared.push({html,item:{...result.item,campaign,verifiedAt:'2026-11-05',contentType:slot},characters:text.length});
}
const keep=queue.items.filter(x=>x.campaign!==campaign);
let order=Math.max(...keep.map(x=>Number(x.order)||0),0)+1;
const merged=[...keep,...prepared.map(x=>({...x.item,order:order++}))];
if(new Set(merged.map(x=>x.date+':'+x.slot)).size!==merged.length)throw Error('Duplicate slot');
for(let day=5;day<=11;day++)if(merged.filter(x=>x.date===`2026-11-${String(day).padStart(2,'0')}`).length!==5)throw Error('Missing daily slot');
const summary={articles:21,start:'2026-11-05',end:'2026-11-11',dailyTotal:5,weeklyTotal:35,minCharacters:Math.min(...prepared.map(x=>x.characters)),maxCharacters:Math.max(...prepared.map(x=>x.characters))};
if(process.argv.includes('--check')){console.log(JSON.stringify({...summary,lengths:prepared.map(x=>({title:x.item.title,characters:x.characters}))},null,2));process.exit(0);}
const backup='logs/family-week-20261105-queue-before.json';if(!existsSync(backup))copyFileSync(queuePath,backup);
for(const x of prepared)writeFileSync(x.item.source,x.html,'utf8');
queue.items=merged;writeFileSync(queuePath+'.pending',JSON.stringify(queue,null,2)+'\n');renameSync(queuePath+'.pending',queuePath);
writeFileSync('data/family-week-20261105-manifest.json',JSON.stringify(prepared.map(({item,characters})=>({...item,characters})),null,2)+'\n');
console.log(JSON.stringify({...summary,stored:true}));
