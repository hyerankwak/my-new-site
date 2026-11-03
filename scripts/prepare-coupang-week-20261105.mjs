import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, renameSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderArticle } from './prepare-toypoppo-week-20261022.mjs';
import first from './content-coupang-week-20261105-a.mjs';
import second from './content-coupang-week-20261105-b.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const records=[...first,...second];
const products=JSON.parse(readFileSync(resolve(root,'logs/coupang-week-20261105-reviewed.json'),'utf8'));
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const p=text=>`<p>${esc(text)}</p>`;
const dates=Array.from({length:7},(_,i)=>new Date(Date.UTC(2026,10,5+i)).toISOString().slice(0,10));
const queuePath=resolve(root,'data/toypoppo-prewritten-queue.json');
const queue=JSON.parse(readFileSync(queuePath,'utf8'));
const trackingPath=resolve(root,'data/coupang-article-tracking.json');
const tracking=JSON.parse(readFileSync(trackingPath,'utf8'));
const boardPhotos=['/assets/images/blog/after-school-board-game-family-photo.jpg','/assets/images/blog/first-grade-board-game-family.png'];
const blockPhotos=['/assets/images/blog/seven-year-old-block-play-family-photo.jpg','/assets/images/blog/seven-year-old-lego-blocks-family-photo-20260902.jpg'];
function card(product,final=false){
  return `<a class="affiliate-card" href="${esc(product.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener"><div class="affiliate-card__media"><img src="${product.image}" width="300" height="300" alt="${esc(product.name)} 판매 상품 대표 이미지" loading="lazy"></div><div class="affiliate-card__body"><strong class="affiliate-card__title">${esc(product.name)}</strong><span>정확한 판본과 포함 구성을 확인한 뒤 선택하세요.</span><span class="affiliate-card__price">현재 가격·배송 조건은 판매 페이지에서 확인</span><span class="affiliate-card__button">${final?'현재 옵션·실제 구매평 확인하기':'상품 구성·현재 가격 보기'}</span></div></a><p class="disclosure">제휴 상품 · 2026년 11월 3일 상품명·대표 이미지 확인 기준입니다. 가격·판매 옵션·배송 조건은 변경될 수 있습니다. 확인되지 않은 별점·후기 수는 표시하지 않았습니다.</p>`;
}
const prepared=[];
for(let i=0;i<records.length;i++){
  const record=records[i];
  const product=products.find(x=>x.key===record.key);
  if(!product||!product.subId)throw Error('Missing reviewed product '+record.key);
  const date=dates[Math.floor(i/2)],slot=i%2?'season':'coupang',time=i%2?'13:10':'12:10';
  const existing=queue.items.find(x=>x.date===date&&x.slot===slot);
  if(existing&&!existing.campaign?.startsWith('coupang-week-20261105'))throw Error('Refusing to overwrite an existing queue slot');
  if(existing&&existing.status!=='ready')throw Error('Refusing to overwrite a published article');
  const fullRecord={...record,checkedAt:'2026-11-03',products:[],
    photos:record.key==='duplo'?['/assets/images/blog/20-month-fine-motor-blocks.jpg','/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg']:
      ['classic','magformers'].includes(record.key)?blockPhotos:i%2?[...boardPhotos].reverse():boardPhotos,
    sections:[...record.sections,record.example],
    faq:[...record.faq,
      [`${product.name}을 선물하기 전에 무엇을 물어보면 좋을까요?`,'같은 판본을 이미 갖고 있는지, 누구와 어느 자리에서 주로 놀지 먼저 물어보세요. 아이가 즐기는 놀이 방식과 포함 구성이 맞는지 확인하면 단순히 연령이나 상자 크기만 보고 고르는 일을 줄일 수 있습니다.'],
      ['구매평과 배송 조건은 어떻게 비교하나요?','연결된 상품의 실제 선택 옵션을 기준으로 봅니다. 사용 나이와 부모 도움, 구성품 상태를 설명한 구매평을 읽고 최종 금액과 배송비, 도착일·반품 조건을 함께 확인하세요. 이 글은 직접 사용한 구매 후기가 아니라 상품 안내와 가정 활용을 정리한 선택 가이드입니다.']],
    sources:[[product.source,'제조사·공식 배급사의 해당 제품 안내 또는 규칙']],
  };
  const rendered=renderArticle(fullRecord,slot,date,i);
  let html=rendered.html;
  const quick=`<section><h2>이런 가정에 먼저 살펴볼 만합니다</h2>${p(record.fit)}<p><strong>다른 선택을 생각할 경우</strong> ${esc(record.skip)}</p></section>`;
  html=html.replace(/(<p class="affiliate-notice">[\s\S]*?<\/p>)/,'$1'+quick+card(product));
  const footer=`<section><h2>우리 집에서 다시 꺼낼 장면을 생각해 보세요</h2>${p(record.fit+'라는 조건이 우리 집과 가까운지 떠올려 보세요. 반대로 '+record.skip)}${p('좋아 보이는 완성 사진 하나만으로 반복해서 즐길 수 있는지는 알기 어렵습니다. 지금 가지고 있는 놀이와 무엇이 다른지, 새 제품으로 해보고 싶은 활동 하나를 먼저 골라 보세요. 이미 비슷한 경험을 충분히 하고 있다면 추가 구매를 미뤄도 괜찮습니다.')}</section><section><h2>정확한 판본과 판매 조건 확인</h2>${p('상품 제목과 선택 옵션이 같은지, 전체 게임이나 세트인지 추가 부품만 있는 상품인지 살펴보세요. 제조사 표시 연령과 구성 목록, 설명서 언어도 확인합니다. 수입 상품은 도착 예정일과 반품 조건이 다를 수 있으므로 선물 날짜 전에 받을 수 있는지 함께 봐야 합니다.')}${p('가격은 판매 옵션과 시점에 따라 바뀌므로 예약 발행일의 금액을 미리 약속하지 않습니다. 아래에서 현재 판매 조건을 보고 우리 가족에게 맞을 때 선택하세요. 별점이나 구매평은 실제 판매 페이지의 해당 옵션에서 확인하며, 높은 평점만으로 아이에게 잘 맞는다고 단정하지 않는 것이 좋습니다.')}${card(product,true)}</section>`;
  html=html.replace(/<section><h2>(?:제품별 사용법과 아쉬운 점 비교|이 활동에 쓸 도구가 필요하다면)<\/h2>[\s\S]*?(?=<section id="faq">)/,footer);
  if(slot==='season')html=html.replaceAll('집에서 하는 가족놀이','장난감·교구 비교');
  html=html.replace(/(<meta property="og:image" content=")[^"]+/,`$1https://toypoppo.kr${product.image}`);
  const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const schema=JSON.parse(match[1]);schema['@graph'][0].image='https://toypoppo.kr'+product.image;
  html=html.replace(match[0],`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  const article=html.match(/<article\b[\s\S]*?<\/article>/)[0];
  const visible=article.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  if(visible.length<3500)throw Error(`Short article ${visible.length}: ${record.key}`);
  if(/\?\?\?|수익형 글|기준이 먼저입니다|product ID|API|MCP|이번에 선정한/.test(visible))throw Error('Reader-facing internal wording');
  for(const m of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))if(!existsSync(resolve(root,'.'+m[1])))throw Error('Missing local asset '+m[1]);
  if(existsSync(resolve(root,rendered.item.target)))throw Error('Already published target '+rendered.item.target);
  const item={...rendered.item,description:record.intro.slice(0,145),scheduledTime:time,contentType:'coupang',campaign:'coupang-week-20261105',affiliateProductId:product.id,affiliateSubId:product.subId,verifiedAt:product.verifiedAt};
  prepared.push({html,item,characters:visible.length,keyword:product.keyword,monthlySearches:product.volume,product});
}
if(prepared.length!==14||new Set(prepared.map(r=>r.product.subId)).size!==14)throw Error('Invalid article count/tracking');
const report={articles:prepared.length,start:dates[0],end:dates.at(-1),minCharacters:Math.min(...prepared.map(r=>r.characters)),maxCharacters:Math.max(...prepared.map(r=>r.characters)),times:['12:10','13:10']};
if(process.argv.includes('--check')){console.log(JSON.stringify({...report,titles:prepared.map(x=>({title:x.item.title,characters:x.characters}))},null,2));process.exit(0);}
mkdirSync(resolve(root,'drafts/toypoppo-prewritten'),{recursive:true});
const backup=resolve(root,'logs/coupang-queue-before-20261105.json');if(!existsSync(backup))copyFileSync(queuePath,backup);
const keep=queue.items.filter(x=>x.campaign!=='coupang-week-20261105');
let order=Math.max(...keep.map(x=>Number(x.order)||0),0)+1;
queue.items=[...keep,...prepared.map(x=>({...x.item,order:order++}))];
if(new Set(queue.items.map(x=>x.date+':'+x.slot)).size!==queue.items.length)throw Error('Duplicate queue slot');
for(const row of prepared){
  writeFileSync(resolve(root,row.item.source),row.html,'utf8');
  const existing=tracking.articles.find(a=>a.subId===row.product.subId);
  if(existing&&existing.url!==row.item.url)throw Error('Tracking collision');
  if(!existing)tracking.articles.push({subId:row.product.subId,title:row.item.title,url:row.item.url,activatedAt:`${row.item.date}T${row.item.scheduledTime}:00+09:00`,productId:row.product.id,pendingPublication:true});
}
writeFileSync(queuePath+'.pending',JSON.stringify(queue,null,2)+'\n','utf8');renameSync(queuePath+'.pending',queuePath);
writeFileSync(trackingPath,JSON.stringify(tracking,null,2)+'\n','utf8');
writeFileSync(resolve(root,'data/coupang-week-20261105-manifest.json'),JSON.stringify(prepared.map(({item,characters,keyword,monthlySearches,product})=>({...item,characters,keyword,monthlySearches,searchCheckedAt:'2026-11-03',officialSource:product.source})),null,2)+'\n');
console.log(JSON.stringify({...report,stored:true}));
