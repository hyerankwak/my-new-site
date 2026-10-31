import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderArticle } from './prepare-toypoppo-week-20261022.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const research = JSON.parse(readFileSync(resolve(root, 'logs/affiliate-products-latest.json'), 'utf8'));
const product = research.results.find(p => p.productId === 4673650342);
if (!product || !product.name.includes('루미큐브 클래식')) throw Error('Reviewed product is missing');
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const image = '/assets/images/blog/rummikub-classic-coupang-official-20261031.jpg';
if (!existsSync(resolve(root, '.' + image))) throw Error('Official product image missing');
if (new URL(product.affiliateUrl).hostname !== 'link.coupang.com') throw Error('Affiliate host mismatch');
const record = {
  title: '루미큐브 클래식 추천: 초등학생 생일선물로 살 때 연령·규칙·구성 확인',
  slug: 'rummikub-classic-elementary-gift-age-rules',
  checkedAt: '2026-10-31',
  intro: '루미큐브 클래식을 초등학생 생일선물로 고른다면 숫자를 아는지만 보지 마세요. 같은 숫자와 연속된 숫자를 구분하고, 다른 사람이 생각할 동안 기다릴 수 있는지가 더 중요합니다. 가족이 함께 오래 즐길 숫자 보드게임을 찾는 분을 위해 기본 규칙, 처음 알려주는 순서, 클래식과 다른 판본을 혼동하지 않는 구매 방법을 정리했습니다.',
  products: [],
  photos: ['/assets/images/blog/after-school-board-game-family-photo.jpg', '/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg'],
  rows: [
    ['먼저 추천할 가족', '숫자 묶음을 만들고 차례를 기다리는 놀이를 즐기는 초등학생과 보호자', '혼자 하는 퍼즐을 기대한다면 플레이 방식이 다릅니다'],
    ['구매할 판본', '숫자 타일로 진행하는 루미큐브 클래식', '워드·키즈·여행용과 이름 및 구성 확인'],
    ['처음 시작할 때', '같은 수 묶기 → 같은 색 연속 수 → 한 판 진행 순서', '연습 규칙과 정식 게임 규칙을 구분'],
    ['주저할 상황', '승부보다 숫자 모양과 색 구별에 도움이 필요한 경우', '나이만 맞춰 사기보다 현재 놀이 반응 확인'],
  ],
  sections: [
    ['루미큐브 클래식이 잘 맞는 아이, 조금 미뤄도 되는 아이',
      '학교 학년보다 지금 즐기는 놀이를 떠올리면 고르기 쉽습니다. 숫자 카드를 작은 순서대로 놓는 것을 좋아하고, 손에 있는 조각으로 여러 조합을 찾아보는 아이라면 함께 해볼 만합니다. 부모와 번갈아 문제를 내거나 자기가 만든 묶음을 설명하는 놀이를 즐기는지도 살펴보세요. 공식 클래식 규칙의 대상은 7세 이상이지만, 그 표시가 모든 아이에게 같은 난이도를 보장하는 것은 아닙니다.',
      '반대로 아주 짧은 반응 놀이만 찾거나 상대 차례를 기다릴 때 힘들어한다면 첫 선물로 다소 부담스러울 수 있습니다. 타일을 놓기 전에 가능한 조합을 생각해야 하므로 부모가 계속 정답을 대신 골라주면 아이가 구경하는 시간이 길어집니다. 선물 받을 아이와 함께 할 사람이 있는지도 중요합니다. 숫자 공부를 시키기 위한 교재처럼 건네기보다 가족 게임 한 가지를 함께 배운다는 제안이 잘 어울립니다.'],
    ['같은 숫자 묶음과 연속된 숫자, 여기부터 알려주세요',
      '설명할 때는 처음부터 조커와 타일 재배치를 모두 다루지 않아도 됩니다. 먼저 종이에 색을 달리한 숫자를 써서 같은 숫자끼리 모아보고, 같은 색으로 순서가 이어지는 숫자를 찾아보세요. 서로 다른 색의 같은 숫자를 모으는 것과 한 색의 숫자를 이어 놓는 것은 다른 조건이라는 점을 아이가 말로 구분하게 합니다. 이 단계는 게임 전 준비 활동이며 공식 게임의 진행 절차를 바꾼 설명이 아닙니다.',
      '실물로 연습할 때는 보이는 타일 몇 개만 놓고 함께 찾아봅니다. “빨간 4 다음에는 무슨 숫자가 오면 좋을까?”처럼 다음에 필요한 조각을 묻고, 아이가 고르면 왜 그 타일을 골랐는지 들어보세요. 틀렸을 때 바로 답을 옮겨 놓기보다 색과 숫자 중 어느 조건을 다시 봐야 하는지 짚어줍니다. 숫자를 빨리 계산하는 경쟁부터 시작하지 않아도 게임의 핵심을 익힐 수 있습니다.'],
    ['처음 등록할 때 막히면 합계를 함께 적어보세요',
      '정식 규칙에는 처음 타일을 내려놓을 때 자기 받침대에서 만든 유효한 묶음의 합계가 30 이상이어야 하는 조건이 있습니다. 그래서 숫자를 알아도 처음에는 놓을 수 있는 조합을 못 찾을 수 있습니다. 어른 눈에는 간단해 보이더라도 아이에게는 묶음 조건과 합계를 동시에 확인하는 일입니다. 등록이 안 되는 상황을 집중력이 없다는 신호로 단정하지 마세요.',
      '가정에서 연습할 때는 내려놓으려는 숫자들을 별도 종이에 적고 합계를 같이 확인해봅니다. 다만 등록 조건을 생략한 연습을 했다면 정식 게임에서는 다시 원래 조건을 적용한다고 설명하세요. 조커 처리나 이미 놓인 타일의 재구성은 집에 있는 판본 설명서를 펼쳐 확인하는 편이 안전합니다. 영상마다 다른 가족 규칙을 섞으면 다음 게임에서 다툼이 생기기 쉽습니다.'],
    ['첫날은 끝까지 한 판보다 배우는 순서를 나누세요',
      '선물을 뜯은 날 곧바로 모든 규칙을 설명하고 승패까지 내려고 하면 피곤해질 수 있습니다. 첫 만남에는 타일과 받침대를 살펴보고 조합을 만들어보는 정도로 끝내도 좋습니다. 두 번째에는 서로 타일을 보고 도움을 주는 공개 연습을 하고, 조건이 익숙해지면 자기 받침대를 가리고 정식으로 진행하는 식입니다. 이는 아이와 배우기 위한 편집부 제안이며 공식 대회 방식이 아닙니다.',
      '실제 한 판을 시작할 때는 끝낼 기준을 미리 정하세요. 다음 일정이 급하면 중간에 갑자기 치우게 되므로 충분히 앉을 수 있는 때를 고릅니다. 여러 형제가 함께한다면 어른이 어린아이와 한 팀으로 연습할 수도 있지만, 승패 기록과 개인전 결과를 섞지 않는 편이 낫습니다. 부모가 이길 방법을 계속 지시하기보다 아이에게 자기 선택을 해볼 시간을 주는 것이 놀이 경험을 살립니다.'],
    ['클래식·키즈·워드·여행용, 상품 이름을 꼭 구분하세요',
      '검색 결과에 루미큐브가 들어가도 모두 같은 게임은 아닙니다. 숫자 조합 게임인 클래식을 찾다가 글자 판본이나 어린이용 판본, 타일 없이 사용하는 매트만 주문하지 않도록 상품 전체 이름을 읽으세요. 검색 첫 번째 결과가 원하는 판본이라고 볼 수는 없습니다. 이 글의 상품 카드는 “코리아보드게임즈 루미큐브 클래식 보드게임”을 선택해 연결했습니다.',
      '공식 클래식 규칙은 2~4인용 숫자 타일 게임을 설명합니다. 실제 주문할 때는 해당 판매 옵션의 설명서 언어, 타일과 받침대 구성, 상품 상태를 확인하세요. 이미 가지고 있는 제품의 받침대가 불편한 것인지 게임 자체가 어려운 것인지에 따라 재구매 필요성도 달라집니다. 휴대가 목적이라면 케이스 크기와 타일 크기를 실제 상품 상세에서 비교하고, 사진만 보고 다른 판본도 같다고 판단하지 않는 편이 좋습니다.'],
    ['생일선물이라면 아이의 취향과 함께 놀 사람까지 생각하세요',
      '생일선물 예산을 맞출 때 판매가만 비교하면 배송비나 추가 구성 때문에 예상과 달라질 수 있습니다. 결제할 옵션의 최종 금액과 도착 예정일을 확인하고, 중복 선물 여부를 보호자에게 미리 물어보세요. 이미 가족이 같은 판본을 가지고 있다면 다른 종류의 놀이를 고르는 편이 낫습니다. 포장 상태와 반품 가능 조건도 선물 날짜 전에 확인해 두면 선택이 수월해집니다.',
      '루미큐브를 사면 수학 성적이 오른다고 기대하기보다는 같이 앉아 조합을 생각하는 시간을 선물한다고 보는 것이 자연스럽습니다. 순서대로 놓기나 조건을 바꿔 생각하기를 즐길 수 있지만 학습 효과는 아이와 활용 방식에 따라 다릅니다. 빠른 반응과 웃음이 많은 게임을 좋아하는 아이라면 다른 게임과 비교하고, 차분히 생각하며 가족과 여러 번 꺼낼 게임을 찾는다면 클래식을 우선 살펴보세요.'],
  ],
  faq: [
    ['루미큐브 클래식은 몇 살부터 할 수 있나요?', '공식 클래식 규칙은 7세 이상을 대상으로 안내합니다. 실제로는 숫자와 색의 조건을 함께 보고 차례를 기다릴 수 있는지 확인하세요. 판매 옵션의 표시 연령과 안전 안내도 별도로 확인해야 합니다.'],
    ['혼자서 하는 게임인가요?', '공식 클래식 규칙은 2~4인 게임입니다. 혼자 타일 조합을 연습할 수는 있지만 정식 대전과는 다르므로 혼자 완결되는 퍼즐을 원한다면 용도가 맞는지 다시 생각해보세요.'],
    ['클래식과 워드 상품을 같은 것으로 봐도 되나요?', '같은 것으로 보면 안 됩니다. 이 글은 숫자 타일로 진행하는 클래식을 다룹니다. 상품 이름에 루미큐브가 들어 있어도 글자 판본, 어린이용, 액세서리일 수 있으므로 정확한 옵션을 확인하세요.'],
    ['상품 가격과 구매평은 어디에서 확인하나요?', '아래 상품 버튼으로 연결되는 쿠팡 판매 페이지에서 현재 옵션의 가격, 배송 조건과 실제 구매평을 확인하세요. 본문에는 확인되지 않은 별점이나 후기 수를 표시하지 않습니다.'],
  ],
  sources: [['https://rummikub.com/rules/', '루미큐브 공식 규칙 안내']],
};
const card = (label) => `<a class="affiliate-card" href="${esc(product.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank"><div class="affiliate-card__media"><img src="${image}" alt="${esc(product.name)} 쿠팡 파트너스 제공 상품 이미지" width="300" height="300" loading="lazy"></div><div class="affiliate-card__body"><strong class="affiliate-card__title">${esc(product.name)}</strong><span>숫자 타일로 즐기는 클래식 판본 · 구매 옵션의 구성 확인</span><span class="affiliate-card__price">현재 가격·배송 조건은 판매 페이지에서 확인</span><span class="affiliate-card__button">${label}</span></div></a><p class="disclosure">제휴 상품 · 상품명과 대표 이미지는 2026년 10월 31일 조회 기준입니다. 판매 옵션·가격·배송 조건은 변경될 수 있습니다. 대표 이미지는 판매 상품 안내용이며 후기 사진이 아닙니다.</p>`;
const result = renderArticle(record, 'coupang', '2026-10-31', 0);
let html = result.html.replace(/(<p class="affiliate-notice">[\s\S]*?<\/p>)/, '$1' + card('루미큐브 클래식 구성·가격 보기'));
html = html.replace(/<section><h2>제품별 사용법과 아쉬운 점 비교<\/h2>[\s\S]*?(?=<section id="faq">)/, `<section><h2>우리 가족에게 맞는다면 정확한 클래식 판본 확인</h2><p>숫자 조합을 생각하는 게임을 가족과 함께 하고 싶다면 아래에서 클래식 판본의 구성과 현재 판매 조건을 확인해 보세요. 이미 같은 게임이 있거나 혼자 하는 퍼즐을 찾는 경우라면 중복 구매를 피하는 편이 좋습니다.</p>${card('클래식 판본·실제 구매평 확인하기')}</section>`);
html = html.replace(/(<meta property="og:image" content=")[^"]+/, `$1https://toypoppo.kr${image}`);
const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
const schema = JSON.parse(schemaMatch[1]);
schema['@graph'][0].image = `https://toypoppo.kr${image}`;
schema['@graph'][0].datePublished = new Date().toISOString();
schema['@graph'][0].dateModified = schema['@graph'][0].datePublished;
html = html.replace(schemaMatch[0], `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
if (/\?\?\?|수익형 글|API/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) throw Error('Reader-facing wording error');
const target = resolve(root, result.item.target);
writeFileSync(target, html, 'utf8');
const indexPath = resolve(root, 'blog/index.html');
let index = readFileSync(indexPath, 'utf8');
if (!index.includes(`/${result.item.target}`)) {
  if (!index.includes('<div class="link-grid">')) throw Error('Blog grid missing');
  index = index.replace('<div class="link-grid">', `<div class="link-grid"><a href="/${result.item.target}"><strong>${esc(record.title)}</strong><span>${esc(record.intro.slice(0, 130))}</span></a>`);
  writeFileSync(indexPath, index, 'utf8');
}
const sitemapPath = resolve(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes(result.item.url)) {
  sitemap = sitemap.replace('</urlset>', `<url><loc>${result.item.url}</loc><lastmod>2026-10-31</lastmod></url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap, 'utf8');
}
console.log(JSON.stringify({ target: result.item.target, url: result.item.url, title: record.title, productId: product.productId, characters: html.replace(/<[^>]+>/g, '').length }));
