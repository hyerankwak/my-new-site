const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const TODAY = "2026-06-27";
const PUB = "Sat, 27 Jun 2026 00:00:00 +0900";

const nav = [
  ["장난감 추천", "/#months"],
  ["발달놀이", "/development-play/"],
  ["부모 가이드", "/parent-guide/"],
  ["상담소", "/counseling/"],
  ["엄마표 자료실", "/worksheets/"],
  ["몬테소리", "/montessori/"],
  ["육아도구", "/parenting-tools/"],
];

function ensureDir(dir) {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function htmlPath(url) {
  const clean = url.replace(/^\//, "");
  return path.join(ROOT, clean.endsWith("/") ? `${clean}index.html` : clean);
}

function baseHead(title, description, url, type = "article", schemaType = "Article") {
  const graph = [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
    { "@type": "WebSite", "@id": `${SITE}/#website`, name: "토이포포", url: SITE, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
    schemaType === "Article"
      ? { "@type": "Article", headline: title.replace(" | 토이포포", ""), description, author: { "@type": "Organization", name: "토이포포 편집팀" }, publisher: { "@id": `${SITE}/#organization` }, mainEntityOfPage: `${SITE}${url}`, datePublished: TODAY, dateModified: TODAY, inLanguage: "ko-KR" }
      : { "@type": "WebPage", name: title, description, url: `${SITE}${url}`, isPartOf: { "@id": `${SITE}/#website` }, dateModified: TODAY, inLanguage: "ko-KR" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE },
      { "@type": "ListItem", position: 2, name: title.replace(" | 토이포포", ""), item: `${SITE}${url}` },
    ] },
  ];
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${SITE}${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
</head>`;
}

function siteHeader() {
  return `<body>
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 허브</small></span></a>
    <nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `  <footer class="site-footer">
    <div><strong>토이포포</strong><p>장난감, 발달놀이, 부모 고민, 엄마표 자료, 몬테소리 환경을 함께 다루는 육아 정보 허브입니다.</p></div>
    <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">콘텐츠 업데이트 정책</a><a href="/affiliate-disclosure.html">쿠팡파트너스 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function relatedLinks(current = "") {
  const links = [
    ["/counseling/toy-in-mouth.html", "장난감을 계속 입에 넣는데 괜찮을까요?"],
    ["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법"],
    ["/development-play/", "월령별 발달놀이 모음"],
    ["/montessori/prepared-environment.html", "준비된 환경 만들기"],
    ["/parenting-tools/development-checklist.html", "개월별 발달 체크리스트"],
    ["/worksheets/elementary-reading-worksheet.html", "초등 독해 활동지"],
  ].filter(([href]) => href !== current).slice(0, 5);
  return `<section><h2>함께 보면 좋은 글</h2><div class="related-grid">${links.map(([href, label]) => `<a href="${href}"><strong>${esc(label)}</strong><span>토이포포의 관련 육아 정보로 이어집니다.</span></a>`).join("")}</div></section>`;
}

function expertNotice() {
  return `<section class="note-box"><strong>전문가 상담 안내</strong><p>이 콘텐츠는 일반적인 육아 정보를 제공하기 위한 자료입니다. 아이의 발달에는 개인차가 있으며 건강 또는 발달에 대한 걱정이 있는 경우 소아청소년과 또는 관련 전문가와 상담하시기 바랍니다.</p></section>`;
}

function toolPage({ url, title, description, intro, toolHtml, guide, faq }) {
  return `${baseHead(`${title} | 토이포포`, description, url, "article", "Article")}
${siteHeader()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/parenting-tools/">육아도구</a> / ${esc(title)}</p>
      <p class="eyebrow">Parenting Tool</p>
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(intro)}</p>

      <div class="summary-box"><strong>이 도구는 이렇게 사용해요</strong><ul><li>아이 월령과 상황에 맞춰 참고용으로 사용합니다.</li><li>결과를 절대적인 진단으로 보지 않습니다.</li><li>부모가 오늘 바로 실행할 수 있는 작은 행동을 고르는 데 목적이 있습니다.</li></ul></div>
      ${toolHtml}
      <section><h2>활용 방법</h2>${guide.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
      <section><h2>자주 묻는 질문</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>
      ${expertNotice()}
      ${relatedLinks(url)}
    </article>
  </main>
${footer()}`;
}

function trustPage({ url, title, description, body }) {
  return `${baseHead(`${title} | 토이포포`, description, url, "website", "WebPage")}
${siteHeader()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / ${esc(title)}</p>
      <p class="eyebrow">Trust</p>
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(description)}</p>

      ${body}
      ${relatedLinks(url)}
    </article>
  </main>
${footer()}`;
}

const toolPages = [
  {
    url: "/parenting-tools/development-checklist.html",
    title: "개월별 발달 체크리스트",
    description: "6개월부터 12개월까지 아이 발달을 부모가 참고용으로 확인할 수 있는 체크리스트 도구입니다.",
    intro: "아이의 발달은 속도가 모두 다릅니다. 이 체크리스트는 진단이 아니라 오늘 아이가 어떤 놀이와 환경을 필요로 하는지 살피는 참고 도구입니다.",
    toolHtml: `<section class="tool-panel"><h2>발달 체크</h2><label>아이 월령 <select id="ageSelect"><option value="6">6개월</option><option value="7">7개월</option><option value="8">8개월</option><option value="9">9개월</option><option value="10">10개월</option><option value="11">11개월</option><option value="12">12개월</option></select></label><div id="developmentChecklist" class="check-tool"></div></section><script>const data={6:["엎드려 고개를 들고 주변을 봅니다","손을 뻗어 장난감을 잡으려 합니다","소리 나는 방향으로 시선을 돌립니다","거울이나 얼굴 표정에 관심을 보입니다"],7:["앉은 자세에서 손을 뻗습니다","배밀이나 몸 돌리기를 시도합니다","까꿍놀이에 반응합니다","촉감이 다른 물건을 탐색합니다"],8:["버튼을 누르면 결과가 생긴다는 것을 압니다","숨긴 장난감을 찾으려 합니다","컵에 물건을 넣고 빼려 합니다","공을 따라 몸을 움직입니다"],9:["기거나 기려고 시도합니다","엄지와 검지를 쓰려 합니다","숨은 물건을 더 적극적으로 찾습니다","박수나 빠이빠이를 따라 하려 합니다"],10:["잡고 서려는 시도가 늘어납니다","넣고 빼기 놀이를 반복합니다","장난감을 떨어뜨리고 반응을 봅니다","그림책을 직접 넘기려 합니다"],11:["가구를 잡고 옆으로 이동합니다","주세요 같은 간단한 말에 반응합니다","상자 열고 닫기를 좋아합니다","물건 이름을 듣고 쳐다봅니다"],12:["잡고 걷거나 한두 걸음을 시도할 수 있습니다","큰 블록을 쌓고 무너뜨립니다","생활 행동을 흉내 냅니다","짧은 말소리를 따라 하려 합니다"]};function render(){const age=document.getElementById("ageSelect").value;document.getElementById("developmentChecklist").innerHTML=data[age].map((t,i)=>'<label class="tool-check"><input type="checkbox"> '+t+'</label>').join("")+'<p class="mini-summary"><strong>참고:</strong> 체크가 적다고 바로 문제라는 뜻은 아닙니다. 아이 컨디션과 개인차를 함께 보세요.</p>'}document.getElementById("ageSelect").addEventListener("change",render);render();</script>`,
    guide: ["월령을 고른 뒤 아이가 최근 자주 보이는 모습을 체크해보세요. 체크가 많고 적음보다 아이가 어떤 영역에 관심을 보이는지 보는 것이 중요합니다.", "체크가 적은 항목은 훈련 목표가 아니라 놀이 아이디어로 활용하세요. 예를 들어 넣고 빼기가 적다면 컵과 큰 공으로 짧게 놀아볼 수 있습니다."],
    faq: [["체크가 적으면 발달이 늦은 건가요?", "아닙니다. 발달은 개인차가 크므로 체크리스트는 참고용입니다."], ["매일 확인해야 하나요?", "매일보다 2~4주 간격으로 아이 변화 흐름을 보는 편이 좋습니다."], ["정확한 진단이 가능한가요?", "아니요. 진단은 전문가 상담과 영유아검진을 통해 확인해야 합니다."], ["장난감을 새로 사야 하나요?", "대부분 집에 있는 공, 컵, 책, 천으로 시작할 수 있습니다."], ["걱정되면 어떻게 하나요?", "소아청소년과나 영유아검진에서 구체적으로 상담해보세요."]],
  },
  {
    url: "/parenting-tools/today-play.html",
    title: "오늘의 놀이 추천",
    description: "아이 월령과 오늘 컨디션에 맞춰 집에서 바로 할 수 있는 놀이를 추천하는 도구입니다.",
    intro: "매일 새로운 놀이를 고민하기보다 아이의 컨디션에 맞는 작은 놀이 하나를 고르는 것이 더 현실적입니다.",
    toolHtml: `<section class="tool-panel"><h2>놀이 추천 받기</h2><label>월령 <select id="playAge"><option>6~8개월</option><option>9~12개월</option><option>13~24개월</option><option>3~5세</option></select></label><label>오늘 컨디션 <select id="mood"><option>활동적이에요</option><option>차분해요</option><option>조금 예민해요</option><option>부모가 지쳤어요</option></select></label><button class="button primary" id="recommendPlay" type="button">추천 보기</button><div id="playResult" class="summary-box"></div></section><script>const rec={ "6~8개월":{활동적이에요:"공 굴리기와 거울놀이를 짧게 반복해보세요.",차분해요:"부드러운 천 촉감놀이와 그림책 한 장 보기가 좋습니다.",조금예민해요:"조명을 낮추고 부모 목소리로 짧게 까꿍놀이를 해보세요.",부모가지쳤어요:"매트에 함께 누워 소리 나는 장난감을 천천히 흔들어주세요."},"9~12개월":{활동적이에요:"낮은 선반 잡고 이동하기와 컵 넣고 빼기가 잘 맞습니다.",차분해요:"상자 열고 닫기, 물건 이름 찾기를 해보세요.",조금예민해요:"좋아하는 책 한 권과 주세요 놀이처럼 예측 가능한 놀이가 좋습니다.",부모가지쳤어요:"바구니에 큰 블록 담기처럼 앉아서 가능한 놀이를 고르세요."},"13~24개월":{활동적이에요:"터널 통과, 공 던져 담기, 큰 블록 길 만들기가 좋습니다.",차분해요:"스티커 붙이기와 생활 그림책 보기가 좋습니다.",조금예민해요:"역할놀이보다 반복이 쉬운 컵쌓기나 분류놀이가 좋습니다.",부모가지쳤어요:"옆에서 말로 반응만 해도 되는 블록 자유놀이를 추천합니다."},"3~5세":{활동적이에요:"보물찾기, 색깔 미션, 실내 장애물 놀이가 좋습니다.",차분해요:"그림 그리기, 종이접기, 이야기 만들기가 좋습니다.",조금예민해요:"규칙이 단순한 퍼즐이나 그림책 대화가 좋습니다.",부모가지쳤어요:"엄마아빠가 심판만 하는 색깔 찾기 놀이를 해보세요."}};document.getElementById("recommendPlay").onclick=()=>{const a=document.getElementById("playAge").value;const key=document.getElementById("mood").value.replaceAll(" ","").replace("이","").replace("가","");const value=rec[a][key]||"오늘은 짧고 익숙한 놀이 하나만 골라 반복해보세요.";document.getElementById("playResult").innerHTML="<strong>오늘의 추천</strong><p>"+value+"</p>"};</script>`,
    guide: ["놀이 추천은 아이가 오늘 어떤 상태인지 보는 데서 시작합니다. 활동적인 날에는 몸 놀이를, 예민한 날에는 익숙한 반복 놀이를 고르는 편이 좋습니다.", "부모가 지친 날에는 부모가 많이 움직이지 않아도 되는 놀이를 고르는 것이 오래 갑니다."],
    faq: [["추천 놀이를 꼭 해야 하나요?", "아닙니다. 아이 반응에 맞춰 바꿔도 됩니다."], ["하루 몇 가지가 적당한가요?", "한두 가지를 짧게 반복해도 충분합니다."], ["아이가 싫어하면요?", "바로 멈추고 익숙한 놀이로 돌아가세요."], ["준비물이 필요한가요?", "대부분 집에 있는 물건으로 가능합니다."], ["연령이 애매하면요?", "아이의 실제 발달 모습에 가까운 구간을 고르세요."]],
  },
  {
    url: "/parenting-tools/toy-selection-guide.html",
    title: "장난감 선택 가이드",
    description: "아이 연령과 놀이 목적에 맞는 장난감 유형을 고르는 실사용 도구입니다.",
    intro: "장난감은 많이 사는 것보다 지금 아이에게 맞는 놀이 목적을 정하고 고르는 것이 중요합니다.",
    toolHtml: `<section class="tool-panel"><h2>장난감 유형 고르기</h2><label>아이 연령 <select id="toyAge"><option>0~12개월</option><option>13~24개월</option><option>3~5세</option><option>초등 저학년</option></select></label><label>목적 <select id="toyGoal"><option>소근육</option><option>대근육</option><option>언어</option><option>집중력</option><option>창의놀이</option></select></label><button class="button primary" id="toyBtn" type="button">추천 기준 보기</button><div id="toyResult" class="summary-box"></div></section><script>document.getElementById("toyBtn").onclick=()=>{const age=document.getElementById("toyAge").value;const goal=document.getElementById("toyGoal").value;const base={소근육:"넣고 빼기, 끼우기, 큰 블록, 손으로 조작하는 장난감",대근육:"공, 터널, 밀고 끄는 장난감, 균형을 돕는 활동",언어:"생활 그림책, 동물 소리책, 역할놀이 소품",집중력:"퍼즐, 분류놀이, 컵쌓기, 단순 규칙 보드게임",창의놀이:"블록, 미술놀이, 역할놀이, 만들기 재료"}[goal];document.getElementById("toyResult").innerHTML='<strong>'+age+' · '+goal+'</strong><p>'+base+'을 먼저 살펴보세요. 부품 크기, 세척 가능 여부, 아이가 반복할 수 있는 구조인지도 함께 확인하세요.</p>'};</script>`,
    guide: ["장난감 선택은 유행보다 아이의 현재 놀이 행동을 기준으로 잡는 것이 좋습니다.", "같은 연령이라도 아이가 몸을 많이 쓰는지, 손 조작을 좋아하는지, 말놀이에 관심이 있는지에 따라 장난감 유형이 달라집니다."],
    faq: [["비싼 장난감이 더 좋은가요?", "가격보다 반복 사용 가능성과 안전성이 중요합니다."], ["몇 개 정도 꺼내두면 좋나요?", "한 번에 5~6개 정도가 집중하기 쉽습니다."], ["전자 장난감은 안 좋은가요?", "나쁘다기보다 조용한 탐색 장난감과 균형이 필요합니다."], ["성별로 나눠 사야 하나요?", "성별보다 아이 흥미와 발달 단계가 더 중요합니다."], ["쿠팡 링크가 없나요?", "이 도구는 정보 제공을 우선하며 구매 링크를 포함하지 않습니다."]],
  },
  {
    url: "/parenting-tools/daycare-checklist.html",
    title: "어린이집 준비물 체크리스트",
    description: "어린이집 입소 전 준비물을 빠뜨리지 않도록 확인하는 체크리스트 도구입니다.",
    intro: "어린이집 준비는 물건을 많이 사는 것보다 매일 오가는 물건을 정리하기 쉽게 만드는 것이 중요합니다.",
    toolHtml: `<section class="tool-panel"><h2>준비물 체크</h2><div class="check-tool">${["여벌옷 2세트","기저귀 또는 속옷","물티슈","개인 물병","낮잠 이불 또는 담요","식판 또는 수저 세트","칫솔과 양치컵","이름표 스티커","비상 연락처 메모","계절용 겉옷"].map(x=>`<label class="tool-check"><input type="checkbox"> ${x}</label>`).join("")}</div></section>`,
    guide: ["어린이집마다 준비물이 다르므로 원 안내문을 먼저 확인한 뒤 체크리스트를 보조로 사용하세요.", "모든 물건에는 아이 이름을 적어두는 것이 좋습니다. 특히 물병, 겉옷, 양말은 섞이기 쉽습니다."],
    faq: [["이 목록만 준비하면 되나요?", "원마다 다르므로 안내문을 우선 확인해야 합니다."], ["이름표는 꼭 필요할까요?", "분실 방지를 위해 거의 필수에 가깝습니다."], ["여벌옷은 몇 벌이 좋나요?", "초기에는 2세트 정도가 안전합니다."], ["낮잠 이불은 어떤 것이 좋나요?", "세탁이 쉽고 부피가 크지 않은 것이 좋습니다."], ["매일 확인해야 하나요?", "초기에는 매일, 익숙해지면 주 2~3회 점검해도 됩니다."]],
  },
  {
    url: "/parenting-tools/outing-checklist.html",
    title: "외출 준비 체크리스트",
    description: "아이와 외출할 때 꼭 필요한 물건을 상황별로 확인하는 체크리스트 도구입니다.",
    intro: "아이와 외출할 때는 모든 것을 챙기기보다 시간, 장소, 식사 여부에 맞춰 꼭 필요한 것만 고르는 편이 좋습니다.",
    toolHtml: `<section class="tool-panel"><h2>외출 준비 체크</h2><div class="check-tool">${["기저귀 또는 속옷","물티슈와 손수건","물병","간단한 간식","여벌옷","작은 장난감 또는 책","비닐봉투","모자 또는 겉옷","상비약 또는 밴드","유모차/아기띠 확인"].map(x=>`<label class="tool-check"><input type="checkbox"> ${x}</label>`).join("")}</div></section>`,
    guide: ["짧은 외출은 가방을 가볍게, 긴 외출은 식사와 낮잠 변수를 고려해 준비합니다.", "아이가 예민한 편이라면 익숙한 작은 장난감이나 그림책 하나를 챙기는 것이 도움이 됩니다."],
    faq: [["짧은 외출에도 여벌옷이 필요할까요?", "영유아는 예상치 못한 상황이 많아 얇은 여벌 하나가 도움이 됩니다."], ["간식은 꼭 챙겨야 하나요?", "식사 시간과 겹치면 챙기는 편이 좋습니다."], ["장난감은 몇 개가 좋나요?", "하나나 두 개면 충분합니다."], ["유모차와 아기띠 중 무엇이 좋나요?", "장소와 아이 컨디션에 따라 다릅니다."], ["비 오는 날은 무엇을 더 챙기나요?", "여벌 양말, 작은 수건, 방수 가방이 도움이 됩니다."]],
  },
];

const trustPages = [
  {
    url: "/author.html",
    title: "작성자 소개",
    description: "토이포포 콘텐츠를 작성하고 검토하는 편집팀의 기준과 운영 방식을 소개합니다.",
    body: `<section><h2>토이포포 편집팀</h2><p>토이포포는 실제 부모가 검색하는 질문을 중심으로 육아, 놀이, 교육 정보를 정리합니다. 특정 상품을 판매하는 것보다 부모가 오늘 바로 판단할 수 있는 기준을 제공하는 것을 우선합니다.</p><p>콘텐츠는 월령별 발달 특징, 부모의 실제 생활 상황, 안전 기준, 반복 가능한 놀이 환경을 함께 고려해 작성합니다. 의료나 발달 진단 영역은 단정하지 않고 전문가 상담이 필요한 경우를 함께 안내합니다.</p></section><section><h2>작성 기준</h2><ul class="check-list"><li>상품 구매보다 정보와 선택 기준을 먼저 설명합니다.</li><li>아이마다 발달 속도가 다르다는 전제를 유지합니다.</li><li>부모가 바로 적용할 수 있는 구체적인 방법을 담습니다.</li><li>과장된 광고 문구와 단정적인 표현을 피합니다.</li></ul></section>`,
  },
  {
    url: "/affiliate-disclosure.html",
    title: "쿠팡파트너스 안내",
    description: "토이포포의 제휴 링크 운영 원칙과 광고성 콘텐츠 고지 기준을 안내합니다.",
    body: `<section><h2>제휴 링크 운영 원칙</h2><p>토이포포는 향후 일부 상품 추천 글에 쿠팡파트너스 등 제휴 링크를 포함할 수 있습니다. 제휴 링크가 포함된 글에는 방문자가 알아볼 수 있도록 고지 문구를 명확히 표시합니다.</p><p>현재 육아 정보 허브 개편 글과 상담소, 부모 가이드, 발달놀이, 엄마표 자료실, 육아도구 페이지에는 구매 링크를 넣지 않았습니다. 정보성 콘텐츠의 신뢰도와 독립성을 우선합니다.</p></section><section><h2>추천 기준</h2><p>상품을 소개할 때도 가격이나 광고 수익보다 안전성, 사용 기간, 아이 발달 단계, 부모의 관리 편의성을 먼저 고려합니다. 제휴 여부가 콘텐츠의 기본 판단 기준을 바꾸지 않도록 운영합니다.</p></section>`,
  },
  {
    url: "/update-policy.html",
    title: "콘텐츠 업데이트 정책",
    description: "토이포포 콘텐츠의 작성일, 수정일, 검토 기준, 업데이트 방식을 안내합니다.",
    body: `<section><h2>업데이트 원칙</h2><p>토이포포의 육아 정보는 부모가 실제 생활에서 참고할 수 있도록 주기적으로 보완합니다. 월령별 발달놀이, 상담소 글, 부모 가이드, 엄마표 자료실은 검색 유입과 부모 질문을 참고해 내용을 추가하거나 문장을 더 명확하게 다듬습니다.</p><p>발달 및 건강과 관련된 글에는 전문가 상담 안내 문구를 함께 제공합니다. 오래된 정보나 표현이 발견되면 우선순위를 정해 수정합니다.</p></section><section><h2>수정 대상</h2><ul class="check-list"><li>발달 기준이 단정적으로 보이는 문장</li><li>부모가 오해할 수 있는 건강 관련 표현</li><li>내부 링크가 끊긴 페이지</li><li>내용이 짧거나 실제 도움이 부족한 글</li><li>검색 의도와 맞지 않는 제목 또는 설명</li></ul></section>`,
  },
];

function write(url, content) {
  const out = htmlPath(url);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content, "utf8");
}

function buildToolsIndex() {
  const links = toolPages.map((t) => [t.url, t.title, t.description]);
  return `${baseHead("육아도구 | 토이포포", "개월별 발달 체크리스트, 오늘의 놀이 추천, 장난감 선택 가이드, 어린이집 준비물, 외출 준비 체크리스트를 제공하는 실사용 육아도구입니다.", "/parenting-tools/", "website", "WebPage")}
${siteHeader()}
  <main>
    <section class="hero compact"><p class="eyebrow">Parenting Tools</p><h1>부모가 바로 쓰는 육아도구</h1><p>토이포포 육아도구는 단순한 글이 아니라 체크하고 고르고 정리할 수 있는 실사용 도구입니다. 진단이나 정답이 아니라 오늘의 육아를 조금 덜 복잡하게 만드는 참고용 도구로 사용해 주세요.</p></section>
    <section class="section"><div class="section-head"><h2>육아도구 모음</h2><p>아이 월령과 생활 상황에 맞춰 필요한 도구를 선택하세요.</p></div><div class="link-grid">${links.map(([href, title, desc]) => `<a href="${href}"><strong>${esc(title)}</strong><span>${esc(desc)}</span></a>`).join("")}</div></section>
  </main>
${footer()}`;
}

function patchGeneratedHtml() {
  const roots = ["counseling", "parent-guide", "worksheets", "montessori"];
  for (const dir of roots) {
    for (const name of fs.readdirSync(path.join(ROOT, dir))) {
      if (!name.endsWith(".html")) continue;
      const p = path.join(ROOT, dir, name);
      let html = fs.readFileSync(p, "utf8");
      html = html.replace(/<nav class="nav" aria-label="주요 메뉴">[\s\S]*?<\/nav>/, `<nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>`);
      html = html.replace(/<small>.*?<\/small>/, "<small>대한민국 부모를 위한 육아 정보 허브</small>");
      html = html.replace(/<h1>(.*?)<\/h1>/, `<h1>$1</h1>\n`);
      if (!html.includes("전문가 상담 안내")) html = html.replace(/(\s*<section><h2>함께 보면 좋은 글<\/h2>)/, `\n      ${expertNotice()}\n$1`);
      fs.writeFileSync(p, html, "utf8");
    }
  }
  const devFiles = ["blog/6-month-baby-development-play.html", "blog/7-month-baby-development-play.html", "blog/8-month-baby-development-play.html", "blog/9-month-baby-development-play.html", "blog/10-month-baby-development-play.html", "blog/11-month-baby-development-play.html", "blog/12-month-baby-development-play.html"];
  for (const rel of devFiles) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    let html = fs.readFileSync(p, "utf8");
    html = html.replace(/<nav class="nav" aria-label="[^"]*">[\s\S]*?<\/nav>/, `<nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>`);
    if (!html.includes("전문가 상담 안내")) html = html.replace(/(\s*<section>\s*<h2>함께 보면 좋은 글<\/h2>)/, `\n      ${expertNotice()}\n$1`);
    fs.writeFileSync(p, html, "utf8");
  }
}

function buildHome() {
  const toyLinks = [
    ["/posts/6-month-baby-toys.html", "6개월 아기 장난감 추천"],
    ["/posts/7-month-baby-toys.html", "7개월 아기 장난감 추천"],
    ["/posts/8-month-baby-toys.html", "8개월 아기 장난감 추천"],
    ["/posts/9-month-baby-toys.html", "9개월 아기 장난감 추천"],
    ["/posts/10-month-baby-toys.html", "10개월 아기 장난감 추천"],
    ["/posts/11-month-baby-toys.html", "11개월 아기 장난감 추천"],
    ["/posts/12-month-baby-toys.html", "12개월 돌 아기 장난감 추천"],
    ["/posts/two-year-old-gift-guide.html", "두돌 선물 추천"],
    ["/posts/elementary-school-entrance-gift.html", "초등학교 입학선물 추천"],
  ];
  const sections = [
    ["오늘의 육아팁", "아이에게 필요한 것은 많은 자극보다 예측 가능한 하루입니다. 오늘은 장난감을 한 번에 다 꺼내지 말고 5개만 보이게 두세요.", [["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법", "장난감을 줄이지 않고도 새롭게 느끼게 하는 방법"], ["/counseling/too-many-toys.html", "장난감이 너무 많으면 안 좋을까요?", "장난감 수와 집중의 관계를 정리했습니다."], ["/parenting-tools/today-play.html", "오늘의 놀이 추천", "아이 컨디션에 맞는 놀이를 골라보세요."]]],
    ["오늘의 발달놀이", "아이 월령에 맞는 작은 놀이 하나만 골라도 충분합니다.", [["/blog/6-month-baby-development-play.html", "6개월 아기 발달놀이", "뒤집기 이후 손 뻗기와 촉감 탐색"], ["/blog/9-month-baby-development-play.html", "9개월 아기 발달놀이", "기기와 숨은 장난감 찾기"], ["/blog/12-month-baby-development-play.html", "12개월 돌 아기 발달놀이", "걷기 준비와 생활 모방"]]],
    ["최근 업데이트", "새로 보강한 육아 정보 허브 콘텐츠입니다.", [["/parenting-tools/development-checklist.html", "개월별 발달 체크리스트", "6~12개월 발달 참고 도구"], ["/parenting-tools/daycare-checklist.html", "어린이집 준비물 체크리스트", "입소 준비 실사용 도구"], ["/author.html", "작성자 소개", "토이포포 편집팀 기준"]]],
    ["인기 상담소", "부모들이 실제로 검색하는 질문을 모았습니다.", [["/counseling/toy-in-mouth.html", "장난감을 계속 입에 넣는데 괜찮을까요?", "입 탐색과 안전 기준"], ["/counseling/no-crawling-7-month.html", "7개월인데 배밀이를 안 해요", "발달 개인차와 놀이"], ["/counseling/screen-time-baby.html", "TV를 보여줘도 될까요?", "화면 노출 현실 기준"]]],
    ["부모 가이드", "하루 일과와 놀이 환경을 현실적으로 정리했습니다.", [["/parent-guide/7-month-daily-routine.html", "7개월 하루 일과", "수유, 낮잠, 놀이 흐름"], ["/parent-guide/rainy-day-home-play.html", "비오는 날 집콕 놀이", "집에서 에너지 풀기"], ["/parent-guide/how-to-read-picture-books.html", "그림책 읽어주는 방법", "완독보다 함께 보기"]]],
    ["엄마표 자료실", "PDF만이 아니라 설명, 퀴즈, 활용법을 함께 제공합니다.", [["/worksheets/goguryeo-worksheet.html", "고구려 워크지", "초등 한국사 엄마표 자료"], ["/worksheets/proverb-worksheet.html", "속담 워크지", "문해력 어휘 활동"], ["/worksheets/elementary-reading-worksheet.html", "초등 독해 활동지", "중심 내용 찾기"]]],
    ["몬테소리", "교구보다 환경과 반복을 중심으로 설명합니다.", [["/montessori/what-is-montessori.html", "몬테소리란?", "오해 없이 시작하기"], ["/montessori/prepared-environment.html", "준비된 환경", "아이 스스로 꺼내고 정리하기"], ["/montessori/treasure-basket-play.html", "보물바구니 놀이", "생활 물건 감각 탐색"]]],
    ["개월별 장난감", "정보 허브 안에서 장난감 추천은 발달 이해를 돕는 한 영역으로 다룹니다.", toyLinks.map(([href, title]) => [href, title, "월령과 발달 단계에 맞춘 장난감 기준"])],
  ];
  return `${baseHead("토이포포 | 대한민국 부모를 위한 육아 정보 허브", "육아 고민 상담소, 발달놀이, 부모 가이드, 엄마표 자료실, 몬테소리, 육아도구를 제공하는 대한민국 부모를 위한 육아 정보 허브입니다.", "/", "website", "WebPage")}
${siteHeader()}
  <main>
    <section class="hero"><p class="eyebrow">ToyPoppo Parenting Hub</p><h1>장난감보다 먼저, 아이와 부모의 하루를 이해합니다</h1><p>토이포포는 단순 장난감 추천 사이트가 아니라 육아 고민, 발달놀이, 교육 자료, 부모 가이드, 몬테소리 환경, 실사용 육아도구를 함께 제공하는 정보 허브입니다.</p><div class="hero-actions"><a class="button primary" href="/parenting-tools/">육아도구 보기</a><a class="button secondary" href="/counseling/">상담소 보기</a></div></section>
    ${sections.map(([title, desc, links]) => `<section class="section"><div class="section-head"><h2>${esc(title)}</h2><p>${esc(desc)}</p></div><div class="link-grid">${links.map(([href, label, text]) => `<a href="${href}"><strong>${esc(label)}</strong><span>${esc(text)}</span></a>`).join("")}</div></section>`).join("\n")}
    <section class="principles"><h2>토이포포 콘텐츠 원칙</h2><ul><li>실제 육아 생활에 도움이 되는 정보를 우선합니다.</li><li>상품 추천보다 발달 단계, 놀이 목적, 부모의 생활 상황을 먼저 설명합니다.</li><li>건강과 발달에 관한 내용은 일반 정보로 제공하며 전문가 상담을 대체하지 않습니다.</li><li>제휴 링크가 있는 경우 명확히 고지합니다.</li><li>콘텐츠는 주기적으로 점검하고 필요한 내용을 보완합니다.</li></ul></section>
  </main>
${footer()}`;
}

function patchBlogIndex() {
  const p = path.join(ROOT, "blog", "index.html");
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, "utf8");
  html = html.replace(/<nav class="nav" aria-label="[^"]*">[\s\S]*?<\/nav>/, `<nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>`);
  fs.writeFileSync(p, html, "utf8");
}

function updateSitemapAndFeeds() {
  const urls = new Set();
  if (fs.existsSync(path.join(ROOT, "sitemap.xml"))) {
    const old = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
    for (const m of old.matchAll(/<loc>https:\/\/toypoppo\.kr([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  [
    "/author.html", "/affiliate-disclosure.html", "/update-policy.html", "/parenting-tools/",
    ...toolPages.map((t) => t.url),
  ].forEach((u) => urls.add(u));
  const sorted = ["/", "/parenting-tools/", ...[...urls].filter((u) => u !== "/" && u !== "/parenting-tools/").sort()];
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><priority>${u === "/" ? "1.0" : u.endsWith("/") ? "0.9" : "0.8"}</priority></url>`).join("\n")}\n</urlset>\n`, "utf8");
  const feedItems = [
    ...toolPages.map((t) => [t.title, t.url, t.description]),
    ["작성자 소개", "/author.html", "토이포포 편집팀의 콘텐츠 작성 기준입니다."],
    ["콘텐츠 업데이트 정책", "/update-policy.html", "토이포포 콘텐츠 점검과 수정 원칙입니다."],
    ["쿠팡파트너스 안내", "/affiliate-disclosure.html", "토이포포 제휴 링크 고지 기준입니다."],
  ];
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>토이포포 최신 글</title>\n    <link>${SITE}/</link>\n    <description>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료, 몬테소리, 육아도구를 전합니다.</description>\n    <language>ko-KR</language>\n    <lastBuildDate>${PUB}</lastBuildDate>\n${feedItems.map(([title, url, desc]) => `    <item>\n      <title>${esc(title)}</title>\n      <link>${SITE}${url}</link>\n      <guid>${SITE}${url}</guid>\n      <description>${esc(desc)}</description>\n      <pubDate>${PUB}</pubDate>\n    </item>`).join("\n")}\n  </channel>\n</rss>\n`;
  fs.writeFileSync(path.join(ROOT, "rss.xml"), rss, "utf8");
  fs.writeFileSync(path.join(ROOT, "feed.xml"), rss, "utf8");
}

function patchStyles() {
  const p = path.join(ROOT, "assets", "styles.css");
  let css = fs.readFileSync(p, "utf8");
  const add = `.hero.compact{padding-block:clamp(34px,6vw,64px)}.modified-date{display:inline-flex;margin:0 0 18px;padding:6px 10px;border-radius:8px;background:#f3fffb;border:1px solid var(--line);color:var(--muted);font-size:13px;font-weight:800}.tool-panel{margin:24px 0;padding:20px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(135deg,#fffafc,#f3fffb)}.tool-panel label{display:block;margin:10px 0;font-weight:900}.tool-panel select{width:100%;max-width:360px;margin-top:6px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);font:inherit}.check-tool{display:grid;gap:9px;margin:12px 0}.tool-check{padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:700}.tool-check input{margin-right:8px}`;
  if (!css.includes(".tool-panel")) css += add;
  fs.writeFileSync(p, css, "utf8");
}

function main() {
  ensureDir("parenting-tools");
  for (const page of toolPages) write(page.url, toolPage(page));
  write("/parenting-tools/", buildToolsIndex());
  for (const page of trustPages) write(page.url, trustPage(page));
  patchGeneratedHtml();
  patchBlogIndex();
  fs.writeFileSync(path.join(ROOT, "index.html"), buildHome(), "utf8");
  patchStyles();
  updateSitemapAndFeeds();
}

main();
