import {readFileSync,writeFileSync,existsSync,copyFileSync,renameSync} from 'node:fs';
import {renderArticle} from './prepare-toypoppo-week-20261022.mjs';
import regions from './content-week-20261112-regions.mjs';
import travel from './content-week-20261112-travel.mjs';
import education from './content-week-20261112-education.mjs';
import first from './content-coupang-week-20261112-a.mjs';
import second from './content-coupang-week-20261112-b.mjs';
import productSpecs from './coupang-week-20261112-products.mjs';
const campaign='revenue-week-20261112',dateAt=i=>'2026-11-'+String(12+i).padStart(2,'0');
const queuePath='data/toypoppo-prewritten-queue.json',queue=JSON.parse(readFileSync(queuePath,'utf8'));
const trackingPath='data/coupang-article-tracking.json',tracking=JSON.parse(readFileSync(trackingPath,'utf8'));
const products=JSON.parse(readFileSync('logs/coupang-week-20261112-reviewed.json','utf8')).map(p=>({...p,...productSpecs.find(s=>s.key===p.key)}));
const regionLinks=JSON.parse(readFileSync('logs/region-week-20261112-reviewed.json','utf8'));
const mrt=JSON.parse(readFileSync('logs/mrt-week-20261112-reviewed.json','utf8'));
const toys=[...first,...second],B='/assets/images/blog/',P='/assets/images/places/';
const board=[B+'after-school-board-game-family-photo.jpg',B+'first-grade-board-game-family.png'];
const pad=[B+'elementary-online-learning-free-trial-guide-routine.jpg',B+'elementary-online-learning-free-trial-guide-check.jpg'];
const science=[P+'science-museum-guide.webp',P+'daejeon-nexperium-science-class-2.png'];
const regionPhotos=[science,[P+'daejeon-nexperium-science-class-1.png',P+'science-museum-guide.webp'],[P+'children-museum-guide.webp',B+'twenty-four-month-pretend-play-family-photo.jpg'],[P+'science-museum-guide.webp',B+'elementary-literacy-home-study-hero.jpg'],[P+'museum-history-guide.webp',B+'week-20261112-clay-play.webp'],[B+'weekend-morning-half-day-family-photo.jpg',B+'first-grade-dictation-review-parent.jpg'],[P+'daejeon-nexperium-science-class-3.png',P+'science-museum-guide.webp']];
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const paragraph=x=>`<p>${esc(x)}</p>`;
function card(p,reason,last=false){return `<a class="affiliate-card" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener"><div class="affiliate-card__media"><img src="${p.image}" width="300" height="300" alt="${esc(p.name)} 판매 상품 대표 이미지" loading="lazy"></div><div class="affiliate-card__body"><strong class="affiliate-card__title">${esc(p.name)}</strong><span>${esc(reason)}</span><span class="affiliate-card__price">조회 당시 ${Number(p.observedPrice).toLocaleString('ko-KR')}원</span><span class="affiliate-card__button">${last?'실제 구매평·선택 옵션 보기':'상품 구성·현재 가격 확인하기'}</span></div></a><p class="disclosure">2026년 11월 9일 공식 상품 검색 확인 기준입니다. 현재 가격·옵션·배송 조건은 달라질 수 있습니다. 제공되지 않은 별점·구매평 수는 만들지 않았으며 판매 페이지의 실제 옵션에서 확인하세요. 생성형 본문 사진과 판매 상품 대표 이미지는 다릅니다.</p>`;}
function toyPhotos(key,index){if(key==='doh')return [B+'week-20261112-clay-play.webp',B+'week-20261112-clay-storage.webp'];if(key==='icecream')return [B+'week-20261112-icecream-roleplay.webp',B+'twenty-four-month-pretend-play-family-photo.jpg'];if(key==='rubiks')return [B+'week-20261112-cube.webp',B+'elementary-literacy-home-study-hero.jpg'];if(key==='numberblocks')return [B+'seven-year-old-block-play-family-photo.jpg','/assets/blog/math-word-problem-reading.webp'];return index%2?[...board].reverse():board;}
const prepared=[];
for(let day=0;day<7;day++)for(const slot of ['region','mrt','education','coupang','season']){
 const date=dateAt(day),toyIndex=day*2+(slot==='season'?1:0);let record,tracked=[],contentType=slot;
 if(slot==='region'){record={...regions[day],products:[],photos:regionPhotos[day]};tracked=regionLinks.find(x=>x.slug===record.slug)?.products||[];if(tracked.length!==2)throw Error('Region links missing');}
 else if(slot==='mrt'){if(!mrt[day]?.destinationVerified)throw Error('MRT destination not verified');record={...travel[day],...mrt[day]};}
 else if(slot==='education'){record={...education[day],photos:day===0?[B+'elihigh-kids-home-learning-generated.png',B+'first-grade-dictation-review-parent.jpg']:day%2?[...pad].reverse():pad};}
 else {record={...toys[toyIndex],products:[],photos:toyPhotos(toys[toyIndex].key,toyIndex)};tracked=[products.find(p=>p.key===record.key)];if(!tracked[0])throw Error('Toy product missing');record.sections=[...record.sections,record.example];contentType='coupang';}
 if(contentType==='coupang')record.sources=[[tracked[0].source,'제품 안내·규칙 확인 자료']];
 record.checkedAt='2026-11-09';
 const existing=queue.items.find(x=>x.date===date&&x.slot===slot);
 if(existing&&(existing.campaign!==campaign||existing.status!=='ready'))throw Error('Refusing to replace existing day/slot '+date+' '+slot);
 const rendered=renderArticle(record,slot,date,day);let html=rendered.html.replaceAll('2026년 10월 21일 확인','2026년 11월 9일 확인');
 if(slot==='region'){
  html=html.replace(/(<section id="detail-1">[\s\S]*?<\/section>)/,'$1'+card(tracked[0],'관람에 필수인 물건이 아닌 가정용 가족놀이 선택입니다. 실제 제품 표시 연령과 구성을 확인하세요.'));
  html=html.replace(/<section><h2>이 활동에 쓸 도구가 필요하다면<\/h2>[\s\S]*?(?=<section id="faq">)/,`<section><h2>가정에서 이어갈 놀이를 찾는다면</h2>${paragraph('아래는 별도의 가족놀이 선택 예시입니다. 이 장소가 사용하는 공식 교구나 입장권 구성품이 아니며, 구매하지 않아도 관람과 본문의 가정 활동을 할 수 있습니다. 실제 함께할 인원과 표시 연령, 작은 부품·언어·판본을 확인하고 반복해 쓸 장면이 있을 때 비교하세요.')}${card(tracked[1],'선택한 판본의 규칙·구성·현재 구매평을 확인하고 우리 가족에게 맞을 때 고르세요.',true)}</section>`);
 }
 else if(contentType==='coupang'){
  const p=tracked[0];html=html.replace(/(<p class="affiliate-notice">[\s\S]*?<\/p>)/,'$1'+`<section><h2>이런 가정에 먼저 살펴볼 만합니다</h2>${paragraph(record.fit)}<p><strong>다른 선택을 생각할 경우</strong> ${esc(record.skip)}</p></section>`+card(p,'정확한 판본과 선택 옵션을 맞춰 확인하세요.'));
  html=html.replace(/<section><h2>(?:제품별 사용법과 아쉬운 점 비교|이 활동에 쓸 도구가 필요하다면)<\/h2>[\s\S]*?(?=<section id="faq">)/,`<section><h2>반복해서 꺼낼 장면을 생각해 보세요</h2>${paragraph(record.fit+'이라는 조건이 우리 집과 가까운지 봅니다. '+record.skip)}${paragraph('이미 가진 놀이와 무엇이 다른지, 누구와 어느 자리에서 다시 할지를 떠올려 보세요. 현재 제품이 필요한 이유가 분명하지 않다면 추가 구매를 미뤄도 괜찮습니다. 다른 가족의 높은 평가만으로 우리 아이의 흥미와 학습 결과를 보장할 수는 없습니다.')}</section><section><h2>정확한 구성과 현재 판매 조건 확인</h2>${paragraph('전체 게임인지 확장·추가 부품인지, 한 개 또는 여러 개 묶음인지 상품명과 실제 옵션을 대조하세요. 제조사 표시 연령·작은 부품·설명서 언어·건전지 등 준비 조건과 배송일·반품 조건을 함께 봅니다. 수입·판본 차이와 동생의 접근도 고려해야 합니다.')}${paragraph('구매평은 실제 선택 옵션을 기준으로 읽습니다. 사용 나이와 가족 인원, 부모 도움과 반복 사용·부품 상태를 설명한 경험을 비교하세요. 이 글은 직접 사용한 후기가 아니라 확인한 상품 정보와 가정 활용을 바탕으로 작성한 선택 가이드입니다.')}${card(p,'우리 가족의 놀이 방식에 맞는 경우 현재 옵션·가격과 실제 구매평을 비교하세요.',true)}</section>`);
  html=html.replaceAll('집에서 하는 가족놀이','장난감·교구 비교');
  html=html.replace(/(<meta property="og:image" content=")[^"]+/,`$1https://toypoppo.kr${p.image}`);
  const match=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s),schema=JSON.parse(match[1]);schema['@graph'][0].image='https://toypoppo.kr'+p.image;html=html.replace(match[0],`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  html=html.replace('제조사·공식 배급사의 해당 제품 안내 또는 규칙','제품 안내·규칙 확인 자료');
 }
 else if(slot==='education'){
  const firstCard=html.match(/<a class="affiliate-card"[\s\S]*?<\/a>/)?.[0];if(!firstCard)throw Error('Pad card missing');
  html=html.replace(/(<p class="affiliate-notice">[\s\S]*?<\/p>)/,'$1'+firstCard).replaceAll('무료체험 조건 보기','무료체험 알아보기');
 }
 html=html.replaceAll('상품 구성·현재 가격 확인하기','현재 가격·구성 보기').replaceAll('실제 구매평·선택 옵션 보기','구매평·선택 옵션 보기');
 const article=html.match(/<article\b[\s\S]*?<\/article>/)[0],visible=article.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 if(visible.length<2900)throw Error('Short article '+visible.length+' '+record.title);
 if(/\?\?\?|수익형 글|기준이 먼저입니다|이번에 선정한|product ID|API|MCP/.test(visible))throw Error('Internal wording');
 for(const m of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))if(!existsSync('.'+m[1]))throw Error('Missing asset '+m[1]);
 if(queue.items.some(x=>x.status==='published'&&(x.title===record.title||x.target===rendered.item.target))||existsSync(rendered.item.target))throw Error('Published duplicate');
 const item={...rendered.item,campaign,contentType,verifiedAt:'2026-11-09',...(tracked.length?{affiliateSubId:tracked[0].subId,affiliateProductIds:tracked.map(p=>p.id)}:{})};
 prepared.push({html,item,characters:visible.length,tracked,keyword:tracked.length===1?tracked[0].keyword:null,searchVolume:tracked.length===1?tracked[0].volume:null});
}
const keep=queue.items.filter(x=>x.campaign!==campaign);let order=Math.max(...keep.map(x=>Number(x.order)||0),0)+1;
const merged=[...keep,...prepared.map(x=>({...x.item,order:order++}))];
if(prepared.length!==35||new Set(merged.map(x=>x.date+':'+x.slot)).size!==merged.length)throw Error('Duplicate/missing slot');
for(let d=0;d<7;d++)if(merged.filter(x=>x.date===dateAt(d)).length!==5)throw Error('Incomplete day');
const ids=prepared.filter(x=>x.tracked.length).map(x=>x.tracked[0].subId);if(new Set(ids).size!==21)throw Error('Need 21 unique article tracking IDs');
const report={articles:35,start:dateAt(0),end:dateAt(6),minCharacters:Math.min(...prepared.map(x=>x.characters)),maxCharacters:Math.max(...prepared.map(x=>x.characters)),trackingIds:ids.length};
if(process.argv.includes('--check')){console.log(JSON.stringify({...report,lengths:prepared.map(x=>({title:x.item.title,chars:x.characters}))},null,2));process.exit(0);}
const backup='logs/queue-before-revenue-week-20261112.json';if(!existsSync(backup))copyFileSync(queuePath,backup);
for(const r of prepared){writeFileSync(r.item.source,r.html,'utf8');if(r.tracked.length){const subId=r.tracked[0].subId,old=tracking.articles.find(x=>x.subId===subId);if(old&&old.url!==r.item.url)throw Error('Tracking collision');if(!old)tracking.articles.push({subId,title:r.item.title,url:r.item.url,activatedAt:r.item.date+'T'+r.item.scheduledTime+':00+09:00',productIds:r.tracked.map(p=>p.id),pendingPublication:true});}}
queue.items=merged;writeFileSync(queuePath+'.pending',JSON.stringify(queue,null,2)+'\n');renameSync(queuePath+'.pending',queuePath);
writeFileSync(trackingPath,JSON.stringify(tracking,null,2)+'\n');
writeFileSync('data/revenue-week-20261112-manifest.json',JSON.stringify(prepared.map(({item,characters,keyword,searchVolume})=>({...item,characters,keyword,searchVolume,searchCheckedAt:keyword?'2026-11-09':undefined})),null,2)+'\n');
console.log(JSON.stringify({...report,stored:true}));
