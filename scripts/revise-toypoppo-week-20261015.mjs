import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { productNotes, regionContent, educationContent, seasonContent, sectionsHtml, p, section, table, source } from "./toypoppo-editorial-week-20261015.mjs";
import { travelContent } from "./toypoppo-travel-editorial-20261015.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const queuePath = join(root, "data/toypoppo-prewritten-queue.json");
const queue = JSON.parse(readFileSync(queuePath, "utf8"));
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const products = {
  "도블 키즈": ["https://link.coupang.com/a/goYZVkzsTA", "https://coupa.ng/coV3LA"],
  "할리갈리 주니어": ["https://link.coupang.com/a/goY1IUDa1Y", "https://coupa.ng/coV3L7"],
  "펭귄 얼음깨기": ["https://link.coupang.com/a/goY4W9wiOq", "https://coupa.ng/coV3MU"],
  "루미큐브 키즈": ["https://link.coupang.com/a/goY8it3zvo", "https://coupa.ng/coV3NT"],
  "숫자 보드게임": ["https://link.coupang.com/a/goZblXj9l6", "https://coupa.ng/coV3OI"],
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
const padLinks = [
  ["엘리하이 키즈", "https://replyalba.com/pt/yqygnqm3LK", "/assets/images/pad-learning/elikids-og.jpg"],
  ["엘리하이 초등", "https://replyalba.com/pt/Kck7mkbVGA", "/assets/images/pad-learning/elihigh-og.jpg"],
  ["온리원 중등", "https://replyalba.com/pt/YKOWhp4rRH", "/assets/images/pad-learning/only1middle-og.jpg"],
  ["밀크T 초등", "https://replyalba.com/pt/UPlKbFjMhf", "/assets/images/pad-learning/milkt-og.jpg"],
  ["엠베스트", "https://replyalba.com/pt/Y87rxj4tUZ", "/assets/images/pad-learning/mbest-og.jpg"],
];
const coupangTopics = [
  {
    intro: "초등 저학년 생일선물은 반응이 큰 선물과 실제로 다시 꺼내 쓰는 선물이 다를 수 있습니다. 아이가 좋아하는 놀이, 혼자 할 수 있는 정도, 부모가 도와줄 시간부터 물어보세요. 친척이나 친구 아이에게 주는 선물이라면 이미 가진 제품과 어린 형제자매 유무를 확인하면 중복과 안전 문제를 줄일 수 있습니다.",
    picks: ["루미큐브 키즈", "레고 클래식", "레고 프렌즈 입문 세트", "과학실험 키트", "미술·만들기 키트"],
    rows: [["가족과 규칙 놀이", "루미큐브 키즈", "설명과 정리 시간"], ["자유롭게 만들기", "레고 클래식", "기존 브릭과 세트 구성"], ["이야기·역할놀이", "프렌즈 입문 세트", "혼자 조립 가능한 정도"], ["질문·관찰", "과학실험 키트", "성인 동행·추가 재료"], ["그리기·꾸미기", "미술 키트", "소모 재료·정리 부담"]],
    sections: [["선물 받는 집에 물어볼 네 가지", "이미 가진 세트 번호, 아이가 요즘 반복하는 놀이, 작품을 보관할 공간, 부모가 함께할 시간을 물어보세요. '좋은 교구'라는 넓은 질문보다 '설명서대로 조립하는 것을 좋아하나요?'처럼 행동을 물으면 맞는 제품을 찾기 쉽습니다.", "예산은 본체 가격뿐 아니라 배터리, 소모 재료, 별도 교재가 필요한지 포함해 봅니다. 큰 상자와 많은 조각이 항상 더 좋은 선물은 아닙니다. 교환이 필요할 수 있으니 선물 받은 뒤 바로 포장을 모두 버리지 않도록 구매 옵션과 배송 정보를 남겨 주세요."], ["처음 꺼내는 날의 20분 활용", "제품을 펼친 뒤 부모가 완성해 주기보다 설명서의 첫 활동 하나를 함께 해보세요. 5분은 구성품 살펴보기, 10분은 작은 활동, 마지막 5분은 남길 작품과 정리 위치를 정하는 일정 예시입니다. 아이가 어려워하면 시작 분량을 줄입니다.", "조립은 작은 한 구간, 실험은 설명서의 한 활동, 미술은 색 한 가지처럼 끝이 보이게 만듭니다. 처음부터 생일선물 값을 해야 한다는 기대를 주면 부모와 아이 모두 부담이 커질 수 있습니다."]],
  },
  {
    intro: "7세 레고를 고를 때는 상자에 적힌 조각 수보다 아이가 설명서를 따라 만드는지, 자유롭게 바꾸는지 먼저 보세요. 조립 뒤 인물로 이야기를 하는 아이와 구조물을 계속 고치는 아이에게 맞는 세트가 다릅니다. 아래 추천은 유형 비교이며 연결 상품의 정확한 세트 번호와 표시 연령을 기준으로 구매해야 합니다.",
    picks: ["레고 클래식", "레고 프렌즈 입문 세트"],
    rows: [["자유 조립형", "레고 클래식", "스스로 주제를 정하기 어려울 수 있음"], ["이야기 공간형", "프렌즈 입문 세트", "완성품 보관 공간 필요"], ["기존 큰 블록에서 전환", "작은 브릭 조작부터 확인", "분리 도구·어린 동생 접근 확인"]],
    sections: [["설명서 보기와 손 조작은 다른 능력", "그림 속 부품을 찾을 수 있어도 작은 브릭을 단단히 연결하거나 분리하는 동작은 어려울 수 있습니다. 부모가 대신 전부 조립하기보다 부품을 함께 찾고 아이가 연결하는 식으로 역할을 나눠보세요. 잘 안 빠지는 브릭을 입으로 물어 빼지 않도록 안내합니다.", "표시 연령은 해당 세트에 적용되는 정보입니다. 같은 레고 이름이어도 세트마다 다르므로 일반적인 '7세용' 문구만 보고 판단하지 마세요. 가지고 있는 블록과 연결 규격이 맞는지도 제품 정보로 확인합니다."], ["한 세트를 세 번 다르게 쓰는 놀이", "첫날은 설명서의 작은 구간을 만들고, 둘째 날은 색이나 문 위치를 바꾸고, 셋째 날은 그 공간에서 인물이 무엇을 하는지 이야기해 보세요. 원래 모델을 유지하고 싶은 아이는 분해를 강요하지 말고 주변에 작은 구조물을 추가할 수 있습니다.", "자유 조립이 막막한 아이에게는 '차가 지나갈 문', '인형이 쉬는 의자'처럼 기능 하나를 제안하세요. 결과가 사진과 다르다고 바로 고쳐주기보다 왜 그렇게 만들었는지 들어봅니다. 공간지각력 향상 같은 효과를 제품 하나의 확정 결과로 보장하지 않습니다."], ["부품 수보다 다시 꺼내기 쉬운 보관", "자주 쓰는 브릭과 작은 장식 부품을 분리하면 찾는 시간을 줄일 수 있습니다. 처음부터 색을 모두 나눌 필요는 없고 큰 조각과 작은 조각 두 기준으로 시작해도 됩니다. 작품을 계속 보관한다면 하나를 전시하고 나머지를 어떻게 순환할지 정해 주세요.", "어린 동생이 있는 집은 작은 브릭을 바닥에서 사용하는 시간을 분리합니다. 놀이를 끝낼 때 부모와 함께 떨어진 조각을 확인하고 뚜껑 있는 곳에 보관하세요. 세트 추가 구매는 지금 부족한 모양이 무엇인지 알게 된 뒤 비교하면 중복을 줄일 수 있습니다."]],
  },
  {
    intro: "5세 장난감은 역할놀이, 그림을 살피는 규칙놀이, 손으로 만드는 놀이 중 아이가 자주 하는 행동부터 고르면 활용 장면을 생각하기 쉽습니다. 세 종류를 한 번에 살 필요는 없습니다. 집에 있는 장난감의 빈자리가 어디인지 보고, 부모가 같이 꺼낼 수 있는 한 가지부터 비교해 보세요.",
    picks: ["역할놀이 세트", "도블 키즈", "펭귄 얼음깨기", "미술·만들기 키트", "큰 블록"],
    rows: [["인물 흉내를 좋아함", "역할놀이 세트", "소품 세 개로 짧은 상황"], ["그림 차이를 잘 찾음", "도블 키즈", "처음에는 속도 경쟁 줄이기"], ["몸과 손을 함께 쓰고 싶음", "얼음깨기", "타격 소리·재조립 시간"], ["꾸미는 데 오래 머묾", "미술·만들기 키트", "재료와 정리 조건"], ["쌓고 바꾸기를 반복", "큰 블록", "규격·분리 난이도"]],
    sections: [["요즘 좋아하는 행동을 사흘만 보기", "완성된 장난감 사진보다 아이가 어떻게 노는지 관찰합니다. 인형에게 말을 거는지, 물건을 줄 세우는지, 쌓은 것을 계속 바꾸는지에 따라 필요한 재료가 다릅니다. '교육적인가'라는 질문에 앞서 오늘 이 도구로 무엇을 할지 한 장면을 떠올려 보세요.", "한 번의 매장 반응만으로 오래 쓸 제품이라고 판단하기 어렵습니다. 집에서 이미 반복하는 놀이와 연결되는지, 익숙한 도구에 새 기능 하나를 더하는 수준인지 보면 시행착오를 줄일 수 있습니다."], ["첫 주는 짧게 꺼내고 같은 놀이 반복", "월요일에는 물건 세 개로 가게놀이, 수요일에는 같은 물건으로 소풍놀이처럼 익숙한 도구의 상황을 바꿉니다. 보드게임은 규칙 하나와 연습 한 차례부터 시작하고, 미술은 완성품 한 개 대신 재료 한 가지를 다뤄보세요.", "아이가 혼자 할 부분과 부모가 도와줄 부분을 나눕니다. 부모가 매번 처음부터 끝까지 준비해야 하는 키트라면 우리 집 시간에 맞는지 생각하세요. 처음 반응이 작다고 새 제품을 계속 추가하기보다 놀이 방식과 난이도를 조정해 봅니다."]],
  },
  {
    intro: "24개월 말놀이 장난감은 소리를 내는 기기보다 아이와 보호자가 주고받을 행동이 생기는지 보고 고르세요. 그림책·사운드북, 역할놀이, 퍼즐, 큰 블록은 각각 쓰는 장면이 다릅니다. 어떤 제품도 언어 발달의 개선을 보장하지 않으며, 발달이 걱정되면 검진과 상담을 함께 확인해야 합니다.",
    picks: ["그림책·사운드북", "역할놀이 세트", "원목 퍼즐", "큰 블록"],
    rows: [["버튼·소리 관심", "사운드북", "소리 뒤 그림과 말 연결"], ["어른 행동 흉내", "역할놀이", "주고받기·짧은 말"], ["끼우기 반복", "원목 퍼즐", "조각 크기·실제 난이도"], ["쌓고 무너뜨리기", "큰 블록", "위·아래·더 같은 말"]],
    sections: [["말을 시키기보다 행동에 말을 붙이기", "아이에게 '이게 뭐야?'를 연속으로 묻기보다 블록을 올릴 때 '더 올려', 차가 멈추면 '차 멈춰'처럼 눈앞의 행동을 말해 주세요. 아이가 손짓하면 의미를 받아주고 짧은 말을 덧붙입니다. 따라 말해야 놀이를 이어준다는 조건을 만들지 않습니다.", "장난감이 많으면 대화가 늘어난다고 보장할 수 없습니다. 아이가 관심을 보이는 물건 두세 개로 반복하면서 보호자가 기다리고 반응할 자리를 남기는 편이 활용 장면을 만들기 쉽습니다."], ["제품 상세에서 보는 안전과 유지 비용", "입에 물건을 넣는 아이는 작은 음식 모형, 퍼즐 손잡이, 떨어질 수 있는 부품을 특히 봅니다. 원목이나 큰 블록이라는 이름만으로 안전을 판단하지 말고 해당 상품의 표시 연령과 구성품을 확인하세요. 파손된 조각은 사용하지 않습니다.", "사운드북은 배터리 교체와 음량, 페이지 내구성을 확인합니다. 역할놀이 세트는 아이가 잡기 쉬운 소품이 실제로 몇 개 포함되는지 보고, 부속품을 추가해야 사진 속 놀이가 가능한지 구분하세요. 선택 옵션에 따라 가격과 구성이 달라질 수 있습니다."], ["걱정되는 발달은 제품 구매와 별도로", "CDC의 2세 안내에는 두 단어를 함께 말하는 등의 이정표와 걱정이 있을 때 상담하도록 하는 안내가 있습니다. 사용하는 말과 손짓, 간단한 말 이해, 이름에 대한 반응을 메모해 영유아검진이나 소아청소년과 상담에 가져가세요.", "놀이 도구를 바꾸며 상담을 미루지 마세요. 아래 제품은 보호자와 함께하는 일상 놀이의 선택지입니다. 지금 쓰는 책이나 인형으로 충분히 주고받을 수 있다면 새 상품이 꼭 필요하지는 않습니다."]],
  },
  {
    intro: "초등 가족 보드게임을 고를 때는 숫자를 잘하는지보다 함께할 인원, 읽기 수준, 경쟁에 대한 반응을 먼저 보세요. 빠른 관찰 게임과 패를 차분히 배열하는 게임은 분위기가 다릅니다. 아이가 져도 괜찮은 상태에서 짧게 시작할 수 있는 게임부터 비교하는 편이 다시 꺼내기 쉽습니다.",
    picks: ["할리갈리 주니어", "루미큐브 키즈", "숫자 보드게임", "도블 키즈"],
    rows: [["짧은 관찰·반응", "도블 키즈·할리갈리 주니어", "속도 차이가 큰 형제자매 주의"], ["숫자·패 배열", "루미큐브 키즈", "일반판과 구성·규칙 구분"], ["수량·연산 활동", "숫자 보드게임", "정확한 게임과 규칙을 먼저 확인"]],
    sections: [["한 판의 시간보다 준비와 설명까지 보기", "상자에 표시된 플레이 시간만으로 평일 저녁에 맞는지 알기 어렵습니다. 구성품을 꺼내고 규칙을 다시 읽고 정리하는 시간이 더해집니다. 가족이 처음 하는 날에는 연습까지만 해도 괜찮고, 공식 인원과 규칙은 해당 판본 설명서를 기준으로 봅니다.", "혼자 자주 놀 아이에게 가족 참여가 필요한 게임을 사면 사용 빈도가 낮아질 수 있습니다. 누가 일주일에 언제 함께할지 정한 뒤 비교하세요. 친구가 왔을 때만 쓰는 게임과 매일 짧게 쓰는 게임은 선택 이유가 다릅니다."], ["형제자매가 함께할 때 규칙 바꾸기", "반응 속도가 다른 아이들을 바로 같은 경쟁에 넣지 말고 점수를 세지 않는 연습부터 해봅니다. 그림을 찾으면 이름을 말하거나 차례대로 한 장씩 보는 방식으로 진행할 수 있습니다. 이 방식은 공식 규칙과 다른 가정용 놀이 변형임을 구분합니다.", "아이 몰래 봐주기보다 오늘은 협동으로 할지 경쟁으로 할지 시작 전에 정하세요. 실수했을 때의 처리도 미리 말하고 부모가 같은 규칙을 지킵니다. 화가 나면 한 판을 반드시 끝내기보다 잠시 쉬고 다음에 할 단위를 줄일 수 있습니다."], ["하나를 먼저 사고 확장하기", "첫 게임은 다른 제품과 역할이 겹치는지 확인합니다. 이미 그림 찾기 게임을 잘 쓰고 있다면 또 다른 속도 게임보다 차분한 배열 게임이 다른 경험을 줄 수 있습니다. 반대로 긴 숫자 게임이 잘 안 나온다면 짧은 게임을 비교해 볼 수 있습니다.", "보관할 때 카드와 패를 한 상자에 넣고 누락을 확인하세요. 잃어버린 부품을 어떻게 대체하는지, 추가 구성품이 필요한지 상품 안내를 봅니다. 가격은 할인율보다 실제 옵션 총액과 배송을 기준으로 비교합니다."]],
  },
];

const css = `<style data-editorial-revision="20261015">.readable-article{width:100%;max-width:920px;margin-inline:auto;box-sizing:border-box;padding:clamp(20px,4%,48px);overflow-wrap:break-word}.readable-article p,.readable-article li{font-size:17px;line-height:1.9}.readable-article h1{font-size:30px;line-height:1.4;letter-spacing:0}.readable-article h2{font-size:23px;line-height:1.5;margin:32px 0 14px;letter-spacing:0}.comparison-scroll{max-width:100%;overflow-x:auto;margin:24px 0}.comparison-scroll table{width:100%;border-collapse:collapse;min-width:440px;font-size:15px;line-height:1.7}.comparison-scroll th,.comparison-scroll td{padding:13px;text-align:left;vertical-align:top;border:1px solid #dedede}.comparison-scroll th{background:#edf7f5}.product-picks{grid-template-columns:1fr}.pick-card{background:#fff;border-radius:8px}.pick-card h3{margin-top:0}.pick-button,.ticket-card__button,.pad-card__button{min-height:56px;padding:12px 16px;box-sizing:border-box;line-height:1.5;font-size:19px;letter-spacing:0}.article-figure{max-width:640px}.article-figure img{height:auto;max-height:430px;object-fit:contain}.ticket-card,.pad-card{border-radius:8px}.editorial-summary{padding:16px 0;border-top:2px solid #dcece7;border-bottom:1px solid #dcece7}.article-toc{margin:24px 0}.article-toc a{display:inline-block;padding:8px 0}.mid-products{padding:0;border:0;background:transparent}.ticket-card__status{display:none}@media(max-width:760px){.readable-article{padding:22px 18px}.readable-article h1{font-size:25px}.readable-article p,.readable-article li{font-size:16px}.pick-card,.ticket-card,.pad-card{grid-template-columns:minmax(0,1fr);min-width:0}.ticket-card__media img,.pad-card__media img{height:auto;max-height:270px;object-fit:contain}.comparison-scroll table{min-width:380px}}</style>`;
const disclosure = `<p class="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>`;
const figure = (src, alt) => `<figure class="article-figure"><img src="${src}" alt="${esc(alt)}" loading="lazy"><figcaption>토이포포 생성형 이미지입니다. 실제 장소·상품의 모습과 다를 수 있습니다.</figcaption></figure>`;
function productCards(names) {
  return `<div class="product-picks">${names.map(name => {
    const [href, iframe] = products[name];
    const [use, drawback] = productNotes[name];
    return `<section class="pick-card"><div class="pick-frame"><iframe src="${iframe}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" loading="lazy" title="${esc(name)} 상품 정보"></iframe></div><div><h3>${name}</h3><p>${use}</p><p><strong>단점·확인할 점</strong> ${drawback}</p><a class="pick-button" href="${href}" target="_blank" rel="sponsored nofollow noopener">${name} 구성·현재 가격 보기</a></div></section>`;
  }).join("")}</div>`;
}
function padCard(i) {
  const [name, href, image] = padLinks[i];
  return `<a class="pad-card" href="${href}" target="_blank" rel="sponsored nofollow noopener"><div class="pad-card__media"><img src="${image}" alt="${name} 무료체험 안내" loading="lazy"></div><div class="pad-card__body"><strong class="pad-card__title">${name} 무료체험</strong><span class="pad-card__meta">우리 아이 학년의 학습 구성과 체험 대상부터 확인해 보세요.</span><span class="pad-card__button">${name} 무료체험 조건 보기</span></div></a>`;
}
function ticketCard(record) {
  return `<a class="ticket-card" href="${record.href}" target="_blank" rel="sponsored nofollow noopener"><div class="ticket-card__media"><img src="${record.image}" alt="${esc(record.product)} 대표 이미지" loading="lazy"></div><div class="ticket-card__body"><strong class="ticket-card__title">${record.product}</strong><span class="ticket-card__rating"><span class="star">★</span> ${record.rating} · 후기 ${record.reviews}개</span><span class="ticket-card__price">${record.price}</span><span class="ticket-card__button">일정·가격 확인하기</span></div></a><p class="disclosure">2026년 10월 14일 상품 확인 기준. 가격·평점·후기 수·운영·취소 조건은 변경될 수 있으며 날짜별 예약 가능 여부는 현재 예매 화면에서 확인하세요.</p>`;
}
const faqHtml = faqs => `<section id="article-faq"><h2>자주 묻는 질문</h2>${faqs.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join("")}</section>`;
const usefulLinks = `<section><h2>다음에 함께 읽기</h2><ul><li><a href="/local-info/">지역별 아이와 갈만한 곳</a></li><li><a href="/pad-learning/">패드학습·무료체험 비교</a></li><li><a href="/development-play/">아이 연령별 놀이 아이디어</a></li></ul></section>`;
function padTerms() {
  return section("무료체험 신청 전에 적어둘 조건", "상담 전화에서 대상 연령·학년, 체험 기간을 세는 시작일, 기기 발송과 반납 방법, 왕복 배송비, 미반납·파손 비용을 확인하세요. 브랜드와 캠페인마다 조건이 달라 이 글에서 특정 체험일수나 비용 면제를 일괄 보장하지 않습니다.", "무료체험과 유료 계약을 구분해 물어보세요. 체험 뒤 결제하려면 별도 동의가 필요한지, 자동 결제 여부, 월 비용과 약정, 교재비, 해지 정산을 안내받아 메모합니다. 상담 가능한 연락처를 남기고 내용을 확인한 뒤 결정하면 우리 집에 맞는 선택을 하기 쉽습니다.");
}
function build(item, i) {
  let title = item.title.replace(/ \| 2026년 가을 기준$/, "");
  let record, intro, core, faqs, photos, before = "", after = "", comparison;
  if (item.slot === "mrt") {
    record = travelContent[i]; title = record.title; intro = record.intro;
    item.target = `blog/${record.slug}-${item.date.replaceAll("-", "")}.html`;
    item.url = `https://toypoppo.kr/${item.target}`;
    item.source = `drafts/toypoppo-prewritten/${record.slug}-${item.date.replaceAll("-", "")}.html`;
    before = `<p class="affiliate-notice">이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며 예약 시 일정액의 수수료를 받을 수 있습니다.</p>${ticketCard(record)}`;
    after = `${section("방문 날짜와 인원에 맞는 옵션 확인", "위 차이를 비교한 뒤 우리 가족 일정에 맞는 날짜와 인원을 선택하세요. 상품명, 이용 범위, 취소 마감을 결제 전에 한 번 더 확인하면 잘못된 표를 고르는 일을 줄일 수 있습니다.")}${ticketCard(record)}${source(`https://experiences.myrealtrip.com/products/${record.gid}`, "마이리얼트립 연결 상품 상세")}`;
    if (i === 0) after += source("https://www.bluelinepark.com/", "블루라인파크 운영사 공식 안내");
    photos = record.photos;
  } else if (item.slot === "region") {
    title = ["마포 상암 아이와 갈만한 곳: 하늘공원·평화의공원·문화비축기지 비교", "파주 아이와 갈만한 곳: 지혜의숲·출판도시와 헤이리 코스 비교", "하남 아이와 갈만한 곳: 스타필드·미사경정공원 반나절 코스", "목동 아이와 갈만한 곳: 오목공원·목마교육도서관·안양천 비교", "광명동굴 아이와 가기: 입장료·월요일 휴장·가족 동선"][i];
    record = regionContent[i]; intro = record.lead;
    before = disclosure;
    after = section("나들이 뒤 집에서 이어갈 놀이", "그림이나 구조물에 관심을 보인 아이가 집에서 다시 해볼 수 있는 놀이 예시입니다. 방문 필수 준비물이나 입장에 필요한 구매 품목은 아닙니다. 이미 가진 도구가 있다면 같은 활동에 먼저 활용하세요.") + productCards(i === 4 ? ["큰 블록", "과학실험 키트"] : ["도블 키즈", "큰 블록"]) + source(...record.source);
    photos = ["/assets/images/blog/weekend-morning-half-day-family-photo.jpg", "/assets/images/blog/after-school-board-game-family-photo.jpg"];
  } else if (item.slot === "education") {
    record = educationContent[i]; intro = record.intro;
    before = record.cards.length ? `<p class="affiliate-notice">이 글에는 교육 서비스 제휴 링크가 포함되어 있으며 신청에 따라 일정액의 수수료를 받을 수 있습니다.</p>` : disclosure;
    after = record.cards.length ? `${padTerms()}${section("학년과 필요한 학습에 맞춰 체험 비교", "위 활동으로 아이에게 필요한 도움을 정했다면 같은 과목과 수준의 콘텐츠를 체험해 보세요. 아래 카드에서 현재 신청 대상과 체험 조건을 확인할 수 있습니다.")}${record.cards.map(padCard).join("")}` : productCards(["그림책·사운드북", "역할놀이 세트"]);
    if (record.source) after += source(...record.source);
    photos = i === 3 ? ["/assets/images/blog/15-month-toddler-language-play-routine-1.png", "/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg"] : ["/assets/images/blog/elementary-literacy-home-study-hero.jpg", "/assets/images/blog/first-grade-dictation-review-parent.jpg"];
  } else if (item.slot === "coupang") {
    if (i === 1) title = "7세 레고·블록 추천: 자유 조립과 설명서 조립 비교";
    record = coupangTopics[i]; intro = record.intro; before = disclosure;
    core = sectionsHtml(record) + section("제품별 놀이 방법과 아쉬운 점") + productCards(record.picks);
    after = section("결제 전 선택 옵션을 마지막으로 확인하세요", "위 비교에서 아이와 함께할 놀이가 떠오르는 제품 한두 개를 골라 상세페이지를 확인하세요. 카드의 제품명은 비교용 분류이며 연결 상품의 정확한 모델·판본·구성은 선택 옵션에 따라 달라질 수 있습니다. 제조사 표시 연령과 구성품, 배송과 반품 조건을 확인한 후 구매합니다.", "현재 가격과 구매 후기는 판매 페이지의 실제 선택 옵션을 기준으로 봅니다. 이 글은 가격이나 별점을 임의로 만들지 않습니다. 후기에서는 '좋아요'라는 한마디보다 아이의 사용 나이, 조립 난이도, 부품 상태, 반복 사용 사례가 우리 집과 비슷한지 읽어보세요. 체험 효과나 학습 결과는 제품 하나로 보장되지 않습니다.");
    if (i === 3) after += source("https://www.cdc.gov/act-early/milestones/2-years.html", "CDC 2세 발달 안내");
    if (i === 4) after += source("https://www.amigo-spiele.de/07790", "할리갈리 주니어 제조사 안내");
    photos = i === 1 ? ["/assets/images/blog/seven-year-old-lego-blocks-family-photo-20260902.jpg", "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg"] : ["/assets/images/blog/after-school-board-game-family-photo.jpg", "/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg"];
    record.faq = [["추천 나이만 보고 사도 되나요?", "아이의 조작 능력과 해당 모델의 표시 연령, 작은 부품 조건을 함께 확인하세요."], ["가격과 별점은 어디에서 확인하나요?", "각 상품 카드가 연결하는 판매 페이지의 실제 옵션을 기준으로 확인하세요."], ["처음부터 여러 제품을 사야 하나요?", "이미 가진 도구와 겹치지 않고 반복할 놀이가 떠오르는 한 가지부터 비교할 수 있습니다."]];
  } else {
    record = seasonContent[i]; intro = record.intro; before = disclosure;
    after = section("이 활동에 쓸 놀이 도구 비교", "본문의 활동을 먼저 해보고 필요한 기능이 분명해졌을 때 아래 제품을 비교하세요. 준비와 정리까지 우리 집에서 반복하기 쉬운지, 같은 역할을 하는 물건이 이미 있는지 살펴보면 선택하기 편합니다.") + productCards(record.products);
    photos = ["/assets/images/blog/preschool-toy-cleanup-routine-1.jpg", "/assets/images/blog/preschool-toy-cleanup-routine-2.jpg"];
  }
  comparison = table(["선택·상황", "활용·확인 정보", "주의할 점"], record.rows);
  core ||= sectionsHtml(record);
  faqs = record.faq;
  const split = core.indexOf("</section>") + "</section>".length;
  const body = `${p(intro)}${before}<nav class="article-toc" aria-label="본문 목차"><a href="#article-compare">한눈에 비교</a> · <a href="#article-details">자세한 활용·이용 정보</a> · <a href="#article-faq">자주 묻는 질문</a></nav><section id="article-compare"><h2>한눈에 비교</h2>${comparison}</section><div id="article-details">${core.slice(0, split)}${figure(photos[0], "본문 이해를 돕는 참고 이미지")}${core.slice(split)}</div>${figure(photos[1], "활동과 대화를 돕는 참고 이미지")}${after}${faqHtml(faqs)}${usefulLinks}`;
  return { title, desc: intro.slice(0, 145), body, faqs };
}
export function reviseHtml(item, oldHtml) {
  const i = Number(item.date.slice(-2)) - 15;
  if (i < 0 || i > 4) return oldHtml;
  const { title, desc, body, faqs } = build(item, i);
  let html = oldHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  for (const [attribute, value] of [["description", desc], ["og:title", title], ["og:description", desc], ["og:url", item.url]]) {
    const type = attribute.startsWith("og:") ? "property" : "name";
    html = html.replace(new RegExp(`<meta ${type}="${attribute}" content="[^"]*">`), `<meta ${type}="${attribute}" content="${esc(value)}">`);
  }
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${item.url}">`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, raw) => {
    const data = JSON.parse(raw);
    for (const node of data["@graph"] || []) {
      if (node["@type"] === "Article") Object.assign(node, { headline: title, description: desc, mainEntityOfPage: item.url, dateModified: "2026-10-15" });
      if (node["@type"] === "BreadcrumbList") Object.assign(node.itemListElement.at(-1), { name: title, item: item.url });
      if (node["@type"] === "FAQPage") node.mainEntity = faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }));
    }
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
  html = html.replace(/<style data-editorial-revision="20261015">[\s\S]*?<\/style>/g, "").replace("</head>", `${css}</head>`);
  const begin = html.indexOf('<h1>');
  const end = html.indexOf('</article>', begin);
  if (begin < 0 || end < 0) throw new Error(`Unexpected article markup: ${item.source}`);
  html = html.slice(0, begin) + `<h1>${esc(title)}</h1>${body}` + html.slice(end);
  item.title = title; item.description = desc; item.editorialRevision = "2026-10-15";
  return html;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  mkdirSync(join(root, "logs"), { recursive: true });
  const backup = join(root, "logs/toypoppo-queue-before-editorial-20261015.json");
  if (!existsSync(backup)) copyFileSync(queuePath, backup);
  const pending = queue.items.filter(x => (x.status === "ready" || (process.argv.includes("--update-today") && x.date === "2026-10-15" && x.status === "published")) && x.date >= "2026-10-15" && x.date <= "2026-10-19");
  const report = [];
  for (const item of pending) {
    const original = readFileSync(join(root, item.source), "utf8");
    const html = reviseHtml(item, original);
    writeFileSync(join(root, item.source), html, "utf8");
    if (item.status === "published") writeFileSync(join(root, item.target), html, "utf8");
    const article = html.slice(html.indexOf('<h1>'), html.indexOf('</article>'));
    const text = article.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length < 2000 || /\?\?\?|수익형 글|기준이 먼저입니다|검색 유입이 많은 주제/.test(text)) throw new Error(`Editorial check failed: ${item.title} (${text.length})`);
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) if (!existsSync(join(root, match[1]))) throw new Error(`Missing asset: ${match[1]}`);
    report.push({ date: item.date, slot: item.slot, title: item.title, characters: text.length, url: item.url, source: item.source });
  }
  const keys = queue.items.map(x => `${x.date}:${x.slot}`);
  if (keys.length !== new Set(keys).size) throw new Error("Duplicate day/slot found in queue");
  writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n", "utf8");
  const indexPath = join(root, "blog/index.html");
  let index = readFileSync(indexPath, "utf8");
  for (const item of pending.filter(x => x.status === "published")) {
    const href = `/${item.target}`;
    if (!index.includes(`href="${href}"`)) index = index.replace('<div class="link-grid">', `<div class="link-grid"><a href="${href}"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></a>`);
  }
  writeFileSync(indexPath, index, "utf8");
  writeFileSync(join(root, "logs/toypoppo-editorial-revision-20261015.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ revised: report.length, minCharacters: Math.min(...report.map(x => x.characters)), maxCharacters: Math.max(...report.map(x => x.characters)), report }, null, 2));
}
