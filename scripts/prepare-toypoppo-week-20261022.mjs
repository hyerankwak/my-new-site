import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import regions from "./content-week-20261022-regions.mjs";
import education from "./content-week-20261022-education.mjs";
import toys from "./content-week-20261022-toys.mjs";
import home from "./content-week-20261022-home.mjs";
import travel from "./content-week-20261022-travel.mjs";
import { productNotes } from "./toypoppo-editorial-week-20261015.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const esc = x => String(x ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const products = {
  "도블 키즈": ["https://link.coupang.com/a/goYZVkzsTA", "https://coupa.ng/coV3LA"],
  "할리갈리 주니어": ["https://link.coupang.com/a/goY1IUDa1Y", "https://coupa.ng/coV3L7"],
  "루미큐브 키즈": ["https://link.coupang.com/a/goY8it3zvo", "https://coupa.ng/coV3NT"],
  "역할놀이 세트": ["https://coupa.ng/coV3PA", "https://coupa.ng/coV3PA"],
  "큰 블록": ["https://link.coupang.com/a/goZfX5ONZA", "https://coupa.ng/coV3P5"],
  "원목 퍼즐": ["https://coupa.ng/coV3RD", "https://coupa.ng/coV3RD"],
  "그림책·사운드북": ["https://coupa.ng/coV3SQ", "https://coupa.ng/coV3SQ"],
  "레고 클래식": ["https://coupa.ng/coX7Jo", "https://coupa.ng/coX7Jo"],
  "레고 프렌즈 입문 세트": ["https://link.coupang.com/a/gsaTPJM51M", "https://coupa.ng/coX7LT"],
  "과학실험 키트": ["https://link.coupang.com/a/gsbblw4AgL", "https://coupa.ng/coX7Wy"],
  "미술·만들기 키트": ["https://link.coupang.com/a/gsbdomnNkG", "https://coupa.ng/coX7XL"],
  "문해력·독서 교구": ["https://link.coupang.com/a/gsbh4g4L36", "https://coupa.ng/coX71y"],
};
const pads = [
  ["엘리하이 키즈", "https://replyalba.com/pt/yqygnqm3LK", "/assets/images/pad-learning/elikids-og.jpg"],
  ["엘리하이 초등", "https://replyalba.com/pt/Kck7mkbVGA", "/assets/images/pad-learning/elihigh-og.jpg"],
  ["온리원 중등", "https://replyalba.com/pt/YKOWhp4rRH", "/assets/images/pad-learning/only1middle-og.jpg"],
  ["밀크T 초등", "https://replyalba.com/pt/UPlKbFjMhf", "/assets/images/pad-learning/milkt-og.jpg"],
  ["엠베스트", "https://replyalba.com/pt/Y87rxj4tUZ", "/assets/images/pad-learning/mbest-og.jpg"],
];
const groupLabels = { region: "지역별 아이와 갈만한 곳", mrt: "가족 체험·예매", education: "패드학습·아이 교육", coupang: "장난감·교구 비교", season: "집에서 하는 가족놀이" };
const groupData = { region: regions, mrt: travel, education, coupang: toys, season: home };
const times = { region: "09:10", mrt: "10:10", education: "11:10", coupang: "12:10", season: "13:10" };
const dates = Array.from({ length: 7 }, (_, i) => `2026-10-${22 + i}`);
const p = x => `<p>${esc(x)}</p>`;
const section = ([heading, ...paragraphs], i) => `<section id="detail-${i}"><h2>${esc(heading)}</h2>${paragraphs.map(p).join("")}</section>`;
const figure = (src, context) => `<figure class="article-figure"><img src="${src}" alt="${esc(context)} 참고 이미지" loading="lazy" decoding="async"><figcaption>토이포포 생성형 이미지입니다. 실제 장소·상품·프로그램의 모습과 다를 수 있습니다.</figcaption></figure>`;
const table = rows => `<div class="comparison-scroll"><table><thead><tr><th scope="col">항목·선택</th><th scope="col">활용·확인 정보</th><th scope="col">주의할 점</th></tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

export const editorialCss = `<style>.article-shell{max-width:1040px;margin:32px auto;padding:0 20px}.readable-article{max-width:920px;margin:auto;padding:40px;box-sizing:border-box;background:#fff;overflow-wrap:break-word}.readable-article h1{font-size:30px;line-height:1.45;letter-spacing:0}.readable-article h2{font-size:23px;line-height:1.5;margin:32px 0 14px;letter-spacing:0}.readable-article h3{font-size:19px;line-height:1.5}.readable-article p,.readable-article li{font-size:17px;line-height:1.9}.article-meta,.disclosure{color:#665d62;font-size:13px!important}.affiliate-notice{padding:14px 16px;border:1px solid #e9c5d2;border-radius:8px;background:#fff8fb;font-size:14px!important}.article-toc{padding:16px 0;border-block:1px solid #dce7e5;margin:24px 0}.article-toc a{display:inline-block;padding:8px 0}.comparison-scroll{overflow-x:auto;max-width:100%;margin:24px 0}.comparison-scroll table{border-collapse:collapse;width:100%;min-width:420px;font-size:15px;line-height:1.7}.comparison-scroll th,.comparison-scroll td{padding:12px;text-align:left;vertical-align:top;border:1px solid #dfe6e3}.comparison-scroll th{background:#eff8f5}.article-figure{max-width:640px;margin:28px auto;border:1px solid #e4dedf;border-radius:8px;overflow:hidden}.article-figure img{display:block;width:100%;height:auto;max-height:440px;object-fit:contain}.article-figure figcaption{padding:10px 14px;font-size:13px;color:#665d62;background:#f7fbfa}.affiliate-card{display:grid;grid-template-columns:180px minmax(0,1fr);gap:20px;border:1px solid #e8cbd5;border-radius:8px;padding:18px;background:#fff;margin:20px 0;text-decoration:none;color:#28252a}.affiliate-card__media img{width:100%;height:170px;display:block;object-fit:contain}.affiliate-card__body{min-width:0;display:flex;flex-direction:column;gap:8px}.affiliate-card__title{font-size:20px;line-height:1.5;text-decoration:underline}.affiliate-card__rating{font-size:19px;font-weight:800;color:#322b2e}.star{color:#b57600}.affiliate-card__price{font-size:19px;font-weight:800}.affiliate-card__button,.product-button{display:flex;justify-content:center;align-items:center;box-sizing:border-box;min-height:56px;padding:12px 16px;margin-top:8px;border-radius:8px;background:#dc3a6a;color:#fff!important;font-size:19px;line-height:1.5;font-weight:800;text-decoration:none;text-align:center}.product-card{display:grid;grid-template-columns:128px minmax(0,1fr);gap:20px;padding:20px 0;border-bottom:1px solid #e1e6e4}.product-card h3{margin:0}.product-frame{display:flex;align-items:flex-start;justify-content:center;padding-top:8px}.product-frame iframe{border:0;width:120px;height:240px}.sources{border-top:1px solid #dfe6e3;padding-top:14px}.sources li{font-size:14px}.article-footer-nav{padding-top:20px}@media(max-width:760px){.article-shell{padding:0 10px;margin-top:16px}.readable-article{padding:24px 16px}.readable-article h1{font-size:25px}.readable-article h2{font-size:21px}.readable-article p,.readable-article li{font-size:16px}.affiliate-card,.product-card{grid-template-columns:minmax(0,1fr);gap:14px;min-width:0}.affiliate-card__media img{height:auto;max-height:260px}.comparison-scroll table{min-width:380px}.product-frame{justify-content:flex-start}.article-figure img{max-height:340px}}</style>`;

function productCards(names) {
  return names.map(name => {
    const [href, iframe] = products[name];
    const [use, caution] = productNotes[name];
    return `<section class="product-card"><div class="product-frame"><iframe src="${iframe}" width="120" height="240" title="${esc(name)} 상품 정보" scrolling="no" loading="lazy" referrerpolicy="unsafe-url"></iframe></div><div><h3>${esc(name)}</h3><p>${esc(use)}</p><p><strong>단점·구매 전 확인</strong> ${esc(caution)}</p><a class="product-button" href="${href}" rel="sponsored nofollow noopener" target="_blank">${esc(name)} 구성·현재 가격 보기</a></div></section>`;
  }).join("");
}
function travelCard(record) {
  return `<a class="affiliate-card" href="${record.href}" rel="sponsored nofollow noopener" target="_blank"><div class="affiliate-card__media"><img src="/assets/images/places/${record.cardImage}" alt="${esc(record.product)} 공식 상품 대표 이미지" loading="lazy"></div><div class="affiliate-card__body"><strong class="affiliate-card__title">${esc(record.product)}</strong><span class="affiliate-card__rating"><span class="star">★</span> ${record.rating} · 후기 ${record.reviews}개</span><span class="affiliate-card__price">${esc(record.price)}</span><span class="affiliate-card__button">일정·가격 확인하기</span></div></a><p class="disclosure">2026년 10월 21일 확인 기준. 가격·평점·후기 수·포함 사항과 취소 조건은 변경될 수 있습니다. 방문 날짜와 인원에 맞는 현재 예매 조건을 확인하세요.</p>`;
}
function padCard(index) {
  const [name, href, image] = pads[index];
  return `<a class="affiliate-card" href="${href}" rel="sponsored nofollow noopener" target="_blank"><div class="affiliate-card__media"><img src="${image}" alt="${name} 체험 안내" loading="lazy"></div><div class="affiliate-card__body"><strong class="affiliate-card__title">${name} 무료체험</strong><span>우리 아이 대상 학년과 학습 구성, 현재 체험 조건을 확인해 보세요.</span><span class="affiliate-card__button">${name} 무료체험 조건 보기</span></div></a>`;
}
function imagesFor(record, slot, index) {
  if (record.photos) return record.photos;
  if (slot === "education") return index === 2 ? ["/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg", "/assets/images/blog/elementary-literacy-home-study-hero.jpg"] : ["/assets/images/blog/elementary-literacy-home-study-hero.jpg", "/assets/images/blog/first-grade-dictation-review-parent.jpg"];
  if (slot === "coupang") {
    if (index === 4) return ["/assets/images/blog/seven-year-old-lego-blocks-family-photo-20260902.jpg", "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg"];
    if ([1,5].includes(index)) return ["/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg", "/assets/images/blog/montessori-table-setting-child.jpg"];
    return ["/assets/images/blog/after-school-board-game-family-photo.jpg", "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg"];
  }
  if (slot === "region") return ["/assets/images/blog/weekend-morning-half-day-family-photo.jpg", "/assets/images/blog/first-grade-read-aloud-retelling-routine-1.png"];
  return ["/assets/images/blog/preschool-toy-cleanup-routine-1.jpg", "/assets/images/blog/preschool-toy-cleanup-routine-2.jpg"];
}
function footerContent(record, slot) {
  if (slot === "mrt") return `<section><h2>방문 날짜와 가족 인원에 맞춰 확인</h2><p>본문의 이용 조건과 우리 가족 일정을 맞췄다면 아래에서 실제 날짜·인원·옵션을 확인하세요. 회차 이름과 포함 범위, 취소 마감은 결제 직전에 다시 확인해야 합니다. 원하는 날짜가 없으면 예약 가능하다고 생각하고 이동하지 마세요.</p>${travelCard(record)}</section>`;
  if (slot === "education") return `<section><h2>무료체험 신청 전에 확인할 조건</h2><p>대상 학년·나이와 이전 체험 이력, 해피콜, 체험 기간의 시작일을 확인하세요. 기기 배송과 반환 방법, 배송비·파손·미반납 조건도 현재 신청 페이지와 상담 안내로 확인해야 합니다. 브랜드가 같아도 캠페인과 선택 상품에 따라 달라질 수 있습니다.</p><p>무료체험과 유료 계약을 구분해 자동 결제 여부, 별도 동의 절차, 월 비용과 약정·교재비·해지 정산을 물어보세요. 답변은 문자나 안내문으로 받아 비교하고, 아이가 실제로 사용할 과목과 부모가 도울 시간을 기준으로 결정합니다. 짧은 체험에서 모든 학습 성과를 예측할 수는 없습니다.</p>${record.pads.map(padCard).join("")}</section>`;
  return `<section><h2>${slot === "coupang" ? "제품별 사용법과 아쉬운 점 비교" : "이 활동에 쓸 도구가 필요하다면"}</h2>${slot !== "coupang" ? '<p>본문의 활동을 먼저 해보고 필요한 역할이 분명할 때 아래 제품을 비교하세요. 외출 필수 준비물은 아니며 이미 가진 도구로 같은 활동을 할 수 있다면 그것부터 활용해도 좋습니다.</p>' : '<p>아래 이름은 비교를 위한 제품·유형입니다. 실제 판매 옵션의 모델과 판본, 구성품은 달라질 수 있으므로 연결 페이지에서 정확한 상품을 확인하세요.</p>'}${productCards(record.products)}</section><section><h2>결제 전 마지막으로 비교할 것</h2><p>정확한 모델·판본과 포함 구성품, 제조사 표시 연령·작은 부품을 확인하고 배송·반품 조건까지 봅니다. 현재 가격과 별점·구매평은 판매 페이지의 실제 선택 옵션을 기준으로 확인하세요. 이 글에서는 확인하지 못한 가격·평점을 만들지 않습니다.</p><p>구매평을 읽을 때는 아이의 사용 나이와 부모 도움, 반복 사용과 부품 상태가 우리 집과 비슷한지 보세요. 오늘 이 도구로 할 놀이 하나와 다음에 꺼낼 시간이 떠오르면 선택을 구체적으로 좁힐 수 있습니다. 학습·발달 효과는 제품 하나로 보장되지 않습니다.</p></section>`;
}
export function renderArticle(record, slot, date, index) {
  const verifiedDate = record.checkedAt || "2026-10-21";
  const [verifiedYear, verifiedMonth, verifiedDay] = verifiedDate.split("-");
  const verifiedLabel = `${verifiedYear}년 ${Number(verifiedMonth)}월 ${Number(verifiedDay)}일`;
  const slug = `${record.slug}-${date.replaceAll("-", "")}`;
  const url = `https://toypoppo.kr/blog/${slug}.html`;
  const description = record.intro.slice(0, 145);
  const photos = imagesFor(record, slot, index);
  const notice = slot === "mrt" ? "이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며 예약 시 일정액의 수수료를 받을 수 있습니다." : slot === "education" ? "이 글에는 교육 서비스 제휴 링크가 포함되어 있으며 신청에 따라 일정액의 수수료를 받을 수 있습니다." : "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
  const sections = record.sections.map(section);
  const sources = [...(record.sources || [])];
  if (slot === "mrt") sources.push([`https://experiences.myrealtrip.com/products/${record.gid}`, "마이리얼트립 해당 상품 상세"]);
  const body = `<p>${esc(record.intro)}</p><p class="affiliate-notice">${notice}</p>${slot === "mrt" ? travelCard(record) : ""}<nav class="article-toc" aria-label="본문 목차"><a href="#compare">한눈에 비교</a> · <a href="#detail-0">자세한 이용·활용 정보</a> · <a href="#faq">자주 묻는 질문</a></nav><section id="compare"><h2>한눈에 비교</h2>${table(record.rows)}</section>${sections[0]}${figure(photos[0], groupLabels[slot])}${sections.slice(1).join("")}${figure(photos[1], "가족 활동과 대화")}${footerContent(record, slot)}<section id="faq"><h2>자주 묻는 질문</h2>${record.faq.map(([q,a])=>`<h3>${esc(q)}</h3>${p(a)}`).join("")}</section>${sources.length ? `<section class="sources"><h2>확인한 안내</h2><ul>${sources.map(([href, label]) => `<li><a href="${href}" rel="noopener" target="_blank">${esc(label)}</a></li>`).join("")}</ul><p class="disclosure">운영·판매 정보는 2026년 10월 21일 확인했으며 방문·신청 전에 현재 안내를 다시 확인하세요. 본문의 시간표와 가정 활동은 별도 표기가 없으면 편집부 제안입니다.</p></section>` : ""}<nav class="article-footer-nav"><a href="/local-info/">지역별 가족 나들이</a> · <a href="/pad-learning/">패드학습 비교</a> · <a href="/blog/">토이포포 전체 글</a></nav>`;
  const ogImage = slot === "mrt" ? `/assets/images/places/${record.cardImage}` : photos[0];
  const json = { "@context":"https://schema.org", "@graph":[
    { "@type":"Article", headline:record.title, description, mainEntityOfPage:url, datePublished:`${date}T${times[slot]}:00+09:00`, dateModified:`${date}T${times[slot]}:00+09:00`, image:`https://toypoppo.kr${ogImage}`, author:{"@type":"Organization",name:"토이포포"},publisher:{"@type":"Organization",name:"토이포포",url:"https://toypoppo.kr"},inLanguage:"ko-KR" },
    { "@type":"BreadcrumbList",itemListElement:[{ "@type":"ListItem",position:1,name:"홈",item:"https://toypoppo.kr/"},{ "@type":"ListItem",position:2,name:"블로그",item:"https://toypoppo.kr/blog/"},{ "@type":"ListItem",position:3,name:record.title,item:url}] },
    { "@type":"FAQPage",mainEntity:record.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}})) },
  ]};
  const reference = readFileSync(join(root,"blog/mapo-sangam-skypark-kids-guide-20261015.html"),"utf8");
  const header = reference.slice(reference.indexOf("<header"),reference.indexOf("</header>")+9);
  const footer = reference.slice(reference.indexOf("<footer"),reference.indexOf("</footer>")+9);
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(record.title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(record.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="https://toypoppo.kr${ogImage}"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="토이포포"><link rel="stylesheet" href="/assets/styles.css">${editorialCss}<script type="application/ld+json">${JSON.stringify(json)}</script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script></head><body>${header}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / ${groupLabels[slot]}</p><h1>${esc(record.title)}</h1><p class="article-meta">${date} · ${groupLabels[slot]}</p>${body}</article></main>${footer}</body></html>`;
  return { html: html.replaceAll("2026년 10월 21일", verifiedLabel), item: { date, slot, title:record.title, description, source:`drafts/toypoppo-prewritten/${slug}.html`, target:`blog/${slug}.html`, url, status:"ready", editorialRevision:verifiedDate, scheduledTime:times[slot], ...(slot === "mrt" ? {affiliateProductId:record.gid,affiliateUrl:record.href,verifiedAt:verifiedDate} : {}) }, body: body.replaceAll("2026년 10월 21일", verifiedLabel) };
}
export function prepareWeek() {
  const queuePath=join(root,"data/toypoppo-prewritten-queue.json");
  const queue=JSON.parse(readFileSync(queuePath,"utf8"));
  const prepared=[];
  for (let index=0;index<dates.length;index++) for(const [slot, records] of Object.entries(groupData)) {
    const existing=queue.items.find(x=>x.date===dates[index]&&x.slot===slot);
    if(existing && existing.status!=="ready") throw Error(`Existing non-ready slot must not be replaced: ${dates[index]} ${slot}`);
    const result=renderArticle(records[index],slot,dates[index],index);
    const text=result.body.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
    for(const match of result.html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) if(!existsSync(join(root,match[1])))throw Error(`Missing asset: ${match[1]}`);
    if(text.length<2000)throw Error(`Short article (${text.length}): ${result.item.title}`);
    if(/\?\?\?|수익형 글|검색 유입이 많은 주제|기준이 먼저입니다|API|商品|訪문/.test(text))throw Error(`Reader-facing wording error: ${result.item.title}`);
    if(queue.items.some(x=>x.status==="published"&&(x.target===result.item.target||x.title===result.item.title)))throw Error(`Duplicate published article: ${result.item.title}`);
    prepared.push({...result,characters:text.length});
  }
  const keep=queue.items.filter(x=>!dates.includes(x.date));
  let order=keep.reduce((m,x)=>Math.max(m,Number(x.order)||0),-1)+1;
  queue.items=[...keep,...prepared.map(({item})=>({...item,order:order++}))];
  const keys=queue.items.map(x=>`${x.date}:${x.slot}`);
  if(new Set(keys).size!==keys.length)throw Error("Duplicate queue day/slot");
  if(process.argv.includes("--check")){console.log(JSON.stringify({articles:prepared.length,minCharacters:Math.min(...prepared.map(x=>x.characters)),lengths:prepared.map(x=>({slot:x.item.slot,title:x.item.title,chars:x.characters}))},null,2));return;}
  mkdirSync(join(root,"logs"),{recursive:true});
  mkdirSync(join(root,"drafts/toypoppo-prewritten"),{recursive:true});
  const backup=join(root,"logs/toypoppo-queue-before-week-20261022.json");
  if(!existsSync(backup))copyFileSync(queuePath,backup);
  for(const result of prepared)writeFileSync(join(root,result.item.source),result.html,"utf8");
  const pendingPath=queuePath+".pending";
  writeFileSync(pendingPath,JSON.stringify(queue,null,2)+"\n","utf8");
  renameSync(pendingPath,queuePath);
  const manifest=prepared.map(({item,characters})=>({...item,characters}));
  writeFileSync(join(root,"data/toypoppo-week-20261022-manifest.json"),JSON.stringify(manifest,null,2)+"\n","utf8");
  console.log(JSON.stringify({stored:prepared.length,start:dates[0],end:dates.at(-1),minCharacters:Math.min(...prepared.map(x=>x.characters)),maxCharacters:Math.max(...prepared.map(x=>x.characters)),times:Object.values(times)},null,2));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))prepareWeek();
