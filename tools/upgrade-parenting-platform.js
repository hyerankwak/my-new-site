const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const TODAY = "2026-06-27";
const PUB = "Sat, 27 Jun 2026 00:00:00 +0900";

const nav = [
  ["상담소", "/counseling/"],
  ["부모가이드", "/parent-guide/"],
  ["발달놀이", "/development-play/"],
  ["몬테소리", "/montessori/"],
  ["엄마표 자료실", "/worksheets/"],
  ["육아도구", "/parenting-tools/"],
  ["우리동네 육아정보", "/local-info/"],
  ["AI 육아도우미", "/ai-helper/"],
];

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function outPath(url) {
  const clean = url.replace(/^\//, "");
  return path.join(ROOT, clean.endsWith("/") ? `${clean}index.html` : clean);
}

function write(url, html) {
  const file = outPath(url);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
}

function head({ title, description, url, type = "website", schemaType = "WebPage", section }) {
  const graph = [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
    { "@type": "WebSite", "@id": `${SITE}/#website`, name: "토이포포", url: SITE, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
    schemaType === "Article"
      ? { "@type": "Article", headline: title.replace(" | 토이포포", ""), description, author: { "@type": "Organization", name: "토이포포 편집팀" }, publisher: { "@id": `${SITE}/#organization` }, mainEntityOfPage: `${SITE}${url}`, datePublished: TODAY, dateModified: TODAY, articleSection: section || "육아 정보", inLanguage: "ko-KR" }
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

function header() {
  return `<header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
    <nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모가이드, 엄마표 자료, 우리동네 육아정보, 육아도구를 함께 다루는 부모 정보 플랫폼입니다.</p></div>
    <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">콘텐츠 업데이트 정책</a><a href="/affiliate-disclosure.html">쿠팡파트너스 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>`;
}

function expertNotice() {
  return `<section class="note-box"><strong>전문가 상담 안내</strong><p>이 콘텐츠는 일반적인 육아 정보를 제공하기 위한 자료입니다. 아이의 발달에는 개인차가 있으며 건강 또는 발달에 대한 걱정이 있는 경우 소아청소년과 또는 관련 전문가와 상담하시기 바랍니다.</p></section>`;
}

function relatedLinks() {
  const links = [
    ["/counseling/toy-in-mouth.html", "장난감을 계속 입에 넣는데 괜찮을까요?"],
    ["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법"],
    ["/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이"],
    ["/montessori/prepared-environment.html", "몬테소리 준비된 환경"],
    ["/parenting-tools/today-play.html", "오늘의 놀이 추천"],
  ];
  return `<section><h2>함께 보면 좋은 글</h2><div class="related-grid">${links.map(([href, label]) => `<a href="${href}"><strong>${label}</strong><span>토이포포 안에서 이어서 읽기 좋은 육아 정보입니다.</span></a>`).join("")}</div></section>`;
}

function localInfoIndex() {
  const description = "지역별 어린이집, 육아종합지원센터, 어린이도서관, 박물관, 과학관, 공원, 실내 놀이터를 부모 관점으로 확인하는 토이포포 베타 서비스입니다.";
  const categories = [
    ["어린이집", "입소 전 확인할 운영시간, 통학 거리, 보육 환경 체크"],
    ["육아종합지원센터", "부모교육, 장난감도서관, 놀이 프로그램 확인"],
    ["어린이도서관", "영유아 자료실, 북스타트, 그림책 프로그램"],
    ["박물관·과학관", "비 오는 날 실내 체험과 연령별 관람 팁"],
    ["무료 체험·공연", "가족 행사, 문화센터, 어린이 공연 찾는 기준"],
    ["공원·실내 놀이터", "날씨와 아이 연령에 맞춘 외출 장소 고르기"],
  ];
  return `${head({ title: "우리동네 육아정보 Beta | 토이포포", description, url: "/local-info/" })}
<body>
  ${header()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / 우리동네 육아정보</p>
      <p class="eyebrow">Local Parenting Info Beta</p>
      <h1>우리동네 육아정보 Beta</h1>

      <p class="lead">우리동네 육아정보는 부모가 매번 흩어진 사이트를 찾아다니지 않도록, 어린이집·육아종합지원센터·어린이도서관·박물관·공원·실내 놀이터 같은 정보를 한곳에서 확인하는 베타 서비스입니다. 현재는 공공데이터와 지자체 공식 안내를 연결하기 전 단계로, 부모가 어떤 기준으로 확인해야 하는지와 관련 토이포포 글을 함께 제공합니다.</p>

      <section class="tool-panel"><h2>지역과 목적 선택</h2><label>지역 <select id="localRegion"><option>서울</option><option>경기</option><option>인천</option><option>부산</option><option>대구</option><option>광주</option><option>대전</option><option>세종</option><option>강원</option><option>충청</option><option>전라</option><option>경상</option><option>제주</option></select></label><label>찾는 정보 <select id="localNeed"><option>어린이도서관</option><option>육아종합지원센터</option><option>박물관·과학관</option><option>공원·실내 놀이터</option><option>무료 체험·공연</option><option>어린이집</option></select></label><button class="button primary" id="localBtn" type="button">확인 기준 보기</button><div id="localResult" class="summary-box soft"></div></section>
      <section><h2>제공 예정 정보</h2><div class="link-grid">${categories.map(([title, desc]) => `<a href="/local-info/${title.includes("도서관") ? "kids-library" : title.includes("센터") ? "support-center" : title.includes("박물관") ? "museum-science" : title.includes("체험") ? "family-events" : title.includes("공원") ? "parks-playgrounds" : "daycare"}.html"><strong>${title}</strong><span>${desc}</span></a>`).join("")}</div></section>
      <section><h2>부모가 먼저 확인할 것</h2><p>지역 육아 정보는 운영시간, 휴관일, 예약 방식, 주차 여부, 연령 제한이 자주 바뀝니다. 그래서 토이포포는 단순히 장소명을 나열하기보다 공식 홈페이지 확인 포인트와 아이 연령별 이용 팁을 함께 정리합니다. 예를 들어 8개월 아기라면 공연보다 짧은 체류가 가능한 어린이도서관 영유아실이나 실내 놀이공간이 더 현실적일 수 있습니다.</p><p>또한 같은 박물관이라도 유모차 이동이 편한지, 수유실이 있는지, 아이가 쉬어갈 공간이 있는지에 따라 부모의 만족도가 달라집니다. 베타 기간에는 이러한 부모 관점 체크리스트를 먼저 제공하고, 이후 공식 공공데이터와 연결해 지역별 목록을 확장할 예정입니다.</p></section>
      ${expertNotice()}
      ${relatedLinks()}
    </article>
  </main>
  <script>
    const tips = {
      "어린이도서관": "영유아 자료실, 북스타트 프로그램, 유모차 이동 동선, 수유실 여부를 먼저 확인하세요. 12개월 전후 아이는 긴 프로그램보다 짧은 그림책 탐색 시간이 더 편합니다.",
      "육아종합지원센터": "부모교육, 장난감도서관, 시간제 보육, 놀이체험실 운영 여부를 확인하세요. 예약제인 경우가 많아 공식 홈페이지 공지를 먼저 보는 것이 안전합니다.",
      "박물관·과학관": "관람 시간은 짧게 잡고 유모차 이동, 수유실, 휴게 공간, 소리 큰 전시 여부를 확인하세요. 비 오는 날 실내 대안으로 좋지만 아이 컨디션을 우선하세요.",
      "공원·실내 놀이터": "날씨, 그늘, 화장실, 주차, 바닥재, 영유아 구역 분리 여부를 확인하세요. 미세먼지나 폭염일에는 실내 공간이 더 현실적입니다.",
      "무료 체험·공연": "무료 행사는 예약 마감이 빠릅니다. 연령 제한, 보호자 동반 여부, 공연 시간, 소리와 조명 강도를 함께 확인하세요.",
      "어린이집": "거리와 비용만 보지 말고 보육 철학, 적응 기간, 낮잠 환경, 식단, 소통 방식, 등하원 동선을 함께 확인하세요."
    };
    document.getElementById("localBtn").onclick = () => {
      const region = document.getElementById("localRegion").value;
      const need = document.getElementById("localNeed").value;
      document.getElementById("localResult").innerHTML = "<strong>" + region + " · " + need + " 확인 팁</strong><p>" + tips[need] + "</p><p>베타 기간에는 공식 홈페이지와 지자체 공지를 함께 확인해 주세요.</p>";
    };
  </script>
  ${footer()}
</body>
</html>`;
}

function localCategoryPage({ slug, title, description, tips }) {
  return `${head({ title: `${title} | 우리동네 육아정보 | 토이포포`, description, url: `/local-info/${slug}.html`, schemaType: "Article", section: "우리동네 육아정보" })}
<body>
  ${header()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">우리동네 육아정보</a> / ${esc(title)}</p>
      <p class="eyebrow">Local Guide Beta</p>
      <h1>${esc(title)}</h1>

      <p class="lead">${esc(description)}</p>
      <section><h2>소개</h2><p>${esc(title)} 정보는 부모가 아이와 외출하거나 돌봄 자원을 찾을 때 자주 확인하는 영역입니다. 토이포포는 실시간 목록을 무리하게 보여주기보다, 부모가 공식 정보를 볼 때 놓치기 쉬운 운영시간, 위치, 예약 방식, 아이 연령에 맞는 이용 팁을 먼저 정리합니다.</p></section>
      <section><h2>운영시간 확인법</h2><p>운영시간은 기관과 계절, 방학, 공휴일, 행사 일정에 따라 달라질 수 있습니다. 방문 전 공식 홈페이지나 지자체 공지, 전화 안내를 확인하는 것이 가장 정확합니다. 특히 영유아와 함께 움직일 때는 낮잠 시간과 식사 시간을 피해서 여유 있게 일정을 잡는 편이 좋습니다.</p></section>
      <section><h2>위치와 지도 확인</h2><p>지도에서는 거리뿐 아니라 엘리베이터, 유모차 접근성, 주차 가능 여부, 대중교통 하차 후 걷는 시간을 함께 봐야 합니다. 아이가 어릴수록 이동 시간이 길면 장소 자체보다 이동 과정에서 지치기 쉽습니다.</p></section>
      <section><h2>부모 팁</h2><ul class="check-list">${tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul></section>
      <section><h2>공식 홈페이지에서 확인할 항목</h2><p>첫째, 가장 최근 공지 날짜를 확인해야 합니다. 지역 시설은 방학, 공휴일, 행사, 내부 공사에 따라 운영시간이 달라질 수 있습니다. 둘째, 예약 방식과 취소 규정을 봅니다. 무료 프로그램이라도 사전 예약이 필요한 경우가 많고, 보호자 동반 여부가 정해져 있을 수 있습니다. 셋째, 아이 연령 기준을 확인합니다. 같은 가족 프로그램이라도 영유아 참여가 어려운 경우가 있어 아이가 실제로 머물 수 있는 시간과 환경을 함께 봐야 합니다.</p><p>넷째, 편의시설을 확인합니다. 수유실, 기저귀 교환대, 유모차 보관, 엘리베이터, 주차, 대중교통 접근성은 부모의 피로도를 크게 좌우합니다. 다섯째, 방문 후 집에서 이어갈 활동을 생각해두면 좋습니다. 도서관을 다녀온 날은 그림책 한 권을 다시 읽고, 박물관을 다녀온 날은 본 것을 그림으로 표현하는 식으로 연결하면 외출이 단순한 소비가 아니라 아이의 경험으로 남습니다.</p></section>
      <section><h2>자주 묻는 질문</h2><h3>실시간 장소 목록은 왜 바로 보여주지 않나요?</h3><p>운영시간과 예약 정보가 자주 바뀌기 때문에 부정확한 목록을 보여주는 것보다 공식 확인 기준을 먼저 제공하는 것이 안전합니다. 토이포포는 베타 기간 동안 부모 활용 기준을 먼저 정리하고, 이후 공식 데이터 연결 범위를 넓힐 예정입니다.</p><h3>몇 개월 아기와도 이용할 수 있나요?</h3><p>장소마다 다르지만, 어린 아기일수록 긴 프로그램보다 짧게 머물 수 있는 공간이 좋습니다. 수유와 낮잠 시간을 고려해 30~60분 안에서 움직일 수 있는 곳부터 시작해보세요.</p><h3>비 오는 날에는 어디가 좋나요?</h3><p>영유아는 어린이도서관, 육아종합지원센터 놀이체험실, 조용한 실내 전시가 비교적 편합니다. 다만 소리와 조명이 강한 공간은 아이가 힘들어할 수 있습니다.</p><h3>무료 프로그램은 어떻게 찾나요?</h3><p>지자체 문화행사, 육아종합지원센터, 도서관 공지에서 많이 올라옵니다. 예약 시작일과 연령 제한을 먼저 확인하는 것이 좋습니다.</p><h3>토이포포 지역 정보는 어떤 기준으로 업데이트하나요?</h3><p>부모가 실제 방문 전 확인해야 하는 항목을 중심으로 보강합니다. 운영시간처럼 자주 바뀌는 정보는 공식 홈페이지 확인을 함께 안내합니다.</p></section>
      <section><h2>관련 글</h2><div class="related-grid"><a href="/parent-guide/outing-checklist.html"><strong>외출 준비 체크리스트</strong><span>아이와 나가기 전 빠뜨리기 쉬운 준비물입니다.</span></a><a href="/parenting-tools/outing-checklist.html"><strong>외출 준비 도구</strong><span>상황별 준비물을 체크해보세요.</span></a><a href="/parent-guide/rainy-day-home-play.html"><strong>비 오는 날 집콕 놀이</strong><span>외출이 어려운 날의 실내 대안입니다.</span></a><a href="/parent-guide/how-to-read-picture-books.html"><strong>그림책 읽어주는 방법</strong><span>도서관 방문 전후로 연결하기 좋습니다.</span></a><a href="/blog/7-month-baby-development-play.html"><strong>7개월 발달놀이</strong><span>외출 후 집에서 이어갈 수 있는 놀이입니다.</span></a></div></section>
    </article>
  </main>
  ${footer()}
</body>
</html>`;
}

function toolPage({ url, title, description, intro, body, script = "" }) {
  return `${head({ title: `${title} | 육아도구 | 토이포포`, description, url, schemaType: "Article", section: "육아도구" })}
<body>
  ${header()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/parenting-tools/">육아도구</a> / ${esc(title)}</p>
      <p class="eyebrow">Parenting Tool</p>
      <h1>${esc(title)}</h1>

      <p class="lead">${esc(intro)}</p>
      ${body}
      <section><h2>부모가 실제로 쓰는 방법</h2><p>도구를 사용할 때는 한 번에 모든 항목을 완벽하게 채우려고 하기보다, 오늘 필요한 질문 하나만 해결한다는 마음으로 보는 것이 좋습니다. 예를 들어 예방접종 체크는 다음 접종일을 확정하는 도구가 아니라 병원 방문 전 기록을 정리하는 용도에 가깝습니다. 엄마표 학습 추천도 아이의 수준을 평가하기보다 오늘 어떤 자료를 한 장 골라볼지 결정하는 데 초점을 둡니다.</p><p>아이와 관련된 도구는 결과가 단순할수록 오래 쓰기 좋습니다. 토이포포는 복잡한 점수표를 만들기보다 부모가 바로 행동으로 옮길 수 있는 설명, 관련 글, 주의사항을 함께 제공합니다. 결과가 마음에 들지 않거나 아이 반응이 다르면 언제든 활동을 줄이거나 다른 글로 이동해도 됩니다.</p></section>
      <section><h2>자주 묻는 질문</h2><h3>이 도구 결과를 그대로 따라야 하나요?</h3><p>아닙니다. 결과는 참고용입니다. 아이의 컨디션, 가족 일정, 병원 안내, 어린이집 안내가 더 우선입니다.</p><h3>개인정보를 저장하나요?</h3><p>현재 도구는 입력값을 서버에 저장하지 않는 정적 페이지 방식으로 구성했습니다. 부모가 가볍게 확인할 수 있도록 만든 베타 기능입니다.</p><h3>결과가 우리 아이와 맞지 않으면 어떻게 하나요?</h3><p>아이마다 발달 속도와 관심사가 다릅니다. 결과가 맞지 않으면 관련 글을 참고해 더 쉬운 활동이나 다른 방향을 선택하세요.</p><h3>광고나 구매 링크가 포함되나요?</h3><p>이 도구는 정보 제공을 우선하며 구매 링크를 포함하지 않습니다.</p><h3>언제 업데이트되나요?</h3><p>부모가 자주 찾는 질문과 실제 사용 흐름을 기준으로 도구 설명과 연결 글을 계속 보강할 예정입니다.</p></section>
      <section><h2>활용할 때 주의할 점</h2><p>토이포포의 육아도구는 부모가 오늘의 선택을 쉽게 정리하도록 돕는 참고용 도구입니다. 결과를 정답처럼 보지 말고 아이의 컨디션, 가족 일정, 생활 환경에 맞춰 조절해 주세요. 건강이나 발달에 대한 걱정이 있다면 전문가 상담을 우선해야 합니다.</p></section>
      ${expertNotice()}
      ${relatedLinks()}
    </article>
  </main>
  ${script}
  ${footer()}
</body>
</html>`;
}

function aiHelperPage() {
  const description = "AI 육아도우미 Beta는 자유 채팅이 아니라 발달놀이, 장난감, 워크지, 하루 일과를 입력값에 맞춰 추천하는 토이포포 추천 엔진입니다.";
  return `${head({ title: "AI 육아도우미 Beta | 토이포포", description, url: "/ai-helper/" })}
<body>
  ${header()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / AI 육아도우미</p>
      <p class="eyebrow">Recommendation Engine Beta</p>
      <h1>AI 육아도우미 Beta</h1>

      <p class="lead">AI 육아도우미는 자유 채팅창이 아니라 부모가 바로 사용할 수 있는 추천 엔진 형태로 운영합니다. 현재 베타 버전은 토이포포 내부 콘텐츠와 발달놀이 기준을 바탕으로 오늘 놀이, 장난감 방향, 워크지, 하루 일과를 추천합니다.</p>
      <div class="summary-box"><strong>추천 도구 이용 안내</strong><ul><li>AI가 사이트의 메인이 되지 않도록 정보 콘텐츠를 우선합니다.</li><li>부모가 입력한 값에 맞춘 참고 추천만 제공합니다.</li><li>의료·발달 진단이나 치료 조언은 제공하지 않습니다.</li></ul></div>
      <section class="tool-panel"><h2>AI 발달놀이 추천</h2><label>개월 <select id="playAge"><option>6개월</option><option>7개월</option><option>8개월</option><option>9개월</option><option>10개월</option><option>11개월</option><option>12개월</option></select></label><label>오늘 날씨 <select id="weather"><option>맑음</option><option>비</option><option>더움</option><option>추움</option></select></label><label>놀이 시간 <select id="playTime"><option>5분</option><option>10분</option><option>20분</option></select></label><label>집에 있는 물건 <input id="playItems" placeholder="예: 공, 거울, 천, 컵"></label><button class="button primary" id="playAiBtn" type="button">오늘 놀이 추천</button><div id="playAiResult" class="summary-box soft"></div></section>
      <section class="tool-panel"><h2>AI 장난감 추천</h2><label>개월 <select id="toyAge"><option>6개월</option><option>9개월</option><option>12개월</option><option>24개월</option><option>초등 저학년</option></select></label><label>예산 <select id="budget"><option>1만원대</option><option>2~3만원대</option><option>5만원대</option><option>선물용</option></select></label><label>관심 분야 <select id="interest"><option>소근육</option><option>대근육</option><option>그림책</option><option>역할놀이</option><option>보드게임</option></select></label><button class="button primary" id="toyAiBtn" type="button">추천 방향 보기</button><div id="toyAiResult" class="summary-box soft"></div></section>
      <section class="tool-panel"><h2>AI 워크지 추천</h2><label>나이 <select id="sheetAge"><option>6세</option><option>7세</option><option>초등 1학년</option><option>초등 2학년</option><option>초등 3학년</option></select></label><label>공부 분야 <select id="studyArea"><option>문해력</option><option>속담</option><option>사자성어</option><option>한국사</option><option>독해</option></select></label><button class="button primary" id="sheetAiBtn" type="button">워크지 추천</button><div id="sheetAiResult" class="summary-box soft"></div></section>
      <section class="tool-panel"><h2>AI 하루 육아플래너</h2><label>아이 개월 <select id="planAge"><option>7개월</option><option>10개월</option><option>12개월</option><option>24개월</option><option>5세</option></select></label><label>요일 <select id="dayType"><option>평일</option><option>주말</option></select></label><label>장소 <select id="placeType"><option>실내</option><option>실외</option></select></label><button class="button primary" id="planAiBtn" type="button">오늘 일정 만들기</button><div id="planAiResult" class="summary-box soft"></div></section>
      <section><h2>AI보다 중요한 것</h2><p>토이포포의 AI 기능은 부모의 판단을 대신하지 않습니다. 아이가 피곤해 보이거나 낯선 장소를 힘들어한다면 추천 결과보다 아이의 반응을 먼저 봐야 합니다. 베타 기간에는 추천 결과를 내부 글과 연결해, 부모가 왜 이 놀이가 필요한지 함께 이해할 수 있도록 구성합니다.</p></section>
      ${expertNotice()}
      ${relatedLinks()}
    </article>
  </main>
  <script>
    function set(id, html){ document.getElementById(id).innerHTML = html; }
    document.getElementById("playAiBtn").onclick = () => {
      const age = document.getElementById("playAge").value;
      const weather = document.getElementById("weather").value;
      const time = document.getElementById("playTime").value;
      const items = document.getElementById("playItems").value || "집에 있는 안전한 물건";
      const indoor = weather === "비" || weather === "더움" || weather === "추움";
      set("playAiResult", "<strong>오늘 놀이: " + (indoor ? "실내 감각 탐색 놀이" : "공 굴리기와 까꿍 놀이") + "</strong><p>준비물: " + items + "</p><p>발달 효과: " + age + " 아이가 손을 뻗고, 시선을 따라가고, 반복을 예측하는 데 도움이 됩니다. 놀이 시간은 " + time + " 정도로 짧게 시작하세요.</p><p>관련 글: <a href='/blog/7-month-baby-development-play.html'>7개월 아기 발달놀이</a></p>");
    };
    document.getElementById("toyAiBtn").onclick = () => {
      const age = document.getElementById("toyAge").value;
      const interest = document.getElementById("interest").value;
      const budget = document.getElementById("budget").value;
      set("toyAiResult", "<strong>" + age + " · " + interest + " 중심 추천</strong><p>" + budget + "에서는 한 번 쓰고 끝나는 장난감보다 반복 사용이 가능한 유형을 고르는 편이 좋습니다. 추천 이유는 아이가 직접 조작하고 결과를 확인할 수 있기 때문입니다.</p><p>관련 글: <a href='/posts/6-month-baby-toys.html'>개월별 장난감 추천</a></p>");
    };
    document.getElementById("sheetAiBtn").onclick = () => {
      const age = document.getElementById("sheetAge").value;
      const area = document.getElementById("studyArea").value;
      set("sheetAiResult", "<strong>" + age + " " + area + " 워크지</strong><p>처음에는 한 장을 끝내는 것보다 부모가 예시를 읽어주고 아이가 한두 문항만 스스로 풀어보는 방식이 좋습니다.</p><p>관련 글: <a href='/worksheets/elementary-reading-worksheet.html'>초등 독해 활동지</a></p>");
    };
    document.getElementById("planAiBtn").onclick = () => {
      const age = document.getElementById("planAge").value;
      const day = document.getElementById("dayType").value;
      const place = document.getElementById("placeType").value;
      set("planAiResult", "<strong>" + day + " " + place + " 하루 플랜</strong><p>오전: 짧은 신체놀이 · 점심 전: 그림책 한 권 · 오후: " + (place === "실외" ? "가까운 공원 산책" : "보물바구니 또는 블록 놀이") + " · 저녁: 정리 루틴을 추천합니다.</p><p>오늘 부모팁: " + age + " 아이에게는 새로운 활동보다 예측 가능한 반복이 더 안정적일 수 있습니다.</p>");
    };
  </script>
  ${footer()}
</body>
</html>`;
}

function updateToolsIndex() {
  const p = path.join(ROOT, "parenting-tools", "index.html");
  let html = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  if (!html || !html.includes("예방접종 체크")) {
    const description = "발달 체크리스트, 오늘의 놀이 추천, 장난감 선택 가이드, 외출 준비, 어린이집 준비물, 예방접종 체크, 엄마표 학습 추천을 제공하는 실사용 육아도구입니다.";
    html = `${head({ title: "육아도구 | 토이포포", description, url: "/parenting-tools/" })}
<body>
  ${header()}
  <main>
    <section class="hero compact"><p class="eyebrow">Parenting Tools</p><h1>부모가 바로 쓰는 육아도구</h1><p>정보를 읽고 끝내지 않고, 오늘 바로 체크하고 고를 수 있도록 만든 토이포포의 실사용 도구 모음입니다.</p></section>
    <section class="section"><div class="section-head"><h2>도구 모음</h2><p>아이 월령과 생활 상황에 맞춰 필요한 도구를 선택하세요.</p></div><div class="link-grid">
      <a href="/parenting-tools/development-checklist.html"><strong>개월별 발달 체크리스트</strong><span>6~12개월 발달 모습을 참고용으로 확인합니다.</span></a>
      <a href="/parenting-tools/today-play.html"><strong>오늘의 놀이 추천</strong><span>아이 컨디션에 맞는 놀이를 고릅니다.</span></a>
      <a href="/parenting-tools/toy-selection-guide.html"><strong>장난감 선택 가이드</strong><span>월령과 목적에 맞는 장난감 유형을 봅니다.</span></a>
      <a href="/parenting-tools/outing-checklist.html"><strong>외출 준비 체크리스트</strong><span>짧은 외출과 긴 외출 준비물을 나눠 확인합니다.</span></a>
      <a href="/parenting-tools/daycare-checklist.html"><strong>어린이집 준비물 체크리스트</strong><span>입소 준비물을 빠뜨리지 않게 정리합니다.</span></a>
      <a href="/parenting-tools/vaccination-check.html"><strong>예방접종 체크</strong><span>생년월일 기준으로 접종 확인 포인트를 정리합니다.</span></a>
      <a href="/parenting-tools/home-learning-recommend.html"><strong>엄마표 학습 추천</strong><span>나이와 관심 분야에 맞는 자료실 글을 추천합니다.</span></a>
    </div></section>
  </main>
  ${footer()}
</body>
</html>`;
  }
  fs.writeFileSync(p, html, "utf8");
}

function buildHome() {
  const description = "상담소, 부모가이드, 발달놀이, 몬테소리, 엄마표 자료실, 육아도구, 우리동네 육아정보, AI 육아도우미를 제공하는 대한민국 부모를 위한 육아 정보 플랫폼입니다.";
  const categories = [
    ["💬", "상담소", "/counseling/", "부모가 자주 묻는 고민"],
    ["📚", "부모가이드", "/parent-guide/", "하루 일과와 생활 팁"],
    ["🌱", "발달놀이", "/development-play/", "집에서 바로 하는 놀이"],
    ["🏡", "몬테소리", "/montessori/", "준비된 환경과 반복"],
    ["✏️", "엄마표 자료실", "/worksheets/", "초등 활동지와 활용법"],
    ["✅", "육아도구", "/parenting-tools/", "체크리스트와 선택 도구"],
    ["🗺️", "우리동네 육아정보", "/local-info/", "지역별 육아 자원 Beta"],
    ["✨", "AI 육아도우미", "/ai-helper/", "추천 엔진 Beta"],
  ];
  const sections = [
    ["오늘의 육아팁", "장난감은 많이 꺼내는 것보다 아이가 스스로 고르고 반복할 수 있게 적게 보이는 편이 도움이 됩니다.", [["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법", "집중 시간을 늘리는 정리 방법"], ["/counseling/too-many-toys.html", "장난감이 너무 많으면 안 좋을까요?", "많은 장난감과 집중력의 관계"], ["/parenting-tools/today-play.html", "오늘의 놀이 추천", "아이 컨디션에 맞춰 고르는 놀이"]]],
    ["오늘의 놀이", "개월별 발달놀이 중 부모가 바로 따라 하기 쉬운 글을 연결했습니다.", [["/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이", "촉감·거울·공 굴리기"], ["/montessori/treasure-basket-play.html", "보물바구니 놀이", "생활 물건 감각 탐색"], ["/montessori/everyday-life-play.html", "일상생활 놀이", "물 따르기와 닦기"]]],
    ["오늘의 상담소", "부모가 실제로 검색하는 질문을 불안 조장 없이 정리했습니다.", [["/counseling/toy-in-mouth.html", "장난감을 입에 넣어요", "구강기와 안전 기준"], ["/counseling/no-crawling-7-month.html", "7개월인데 배밀이를 안 해요", "발달 개인차 보기"], ["/counseling/screen-time-baby.html", "TV를 보여줘도 될까요?", "화면 노출 조절"]]],
    ["우리동네 육아정보 Beta", "공공데이터와 지자체 안내를 연결하기 전, 부모가 확인해야 할 기준부터 제공합니다.", [["/local-info/", "지역 선택하기", "우리동네 육아 자원 찾기"], ["/local-info/kids-library.html", "어린이도서관", "영유아실과 그림책 프로그램"], ["/local-info/museum-science.html", "박물관·과학관", "비 오는 날 실내 체험"]]],
    ["오늘의 워크지", "PDF만 제공하지 않고 부모 활용법과 퀴즈를 함께 제공합니다.", [["/worksheets/elementary-reading-worksheet.html", "초등 독해 활동지", "중심 내용 찾기"], ["/worksheets/proverb-worksheet.html", "속담 워크지", "어휘와 문해력"], ["/worksheets/goguryeo-worksheet.html", "고구려 워크지", "초등 한국사 시작"]]],
    ["최근 업데이트", "플랫폼으로 확장하기 위해 새로 보강한 기능과 글입니다.", [["/ai-helper/", "AI 육아도우미 Beta", "추천 엔진형 보조 도구"], ["/parenting-tools/vaccination-check.html", "예방접종 체크", "접종 확인 포인트"], ["/parenting-tools/home-learning-recommend.html", "엄마표 학습 추천", "나이별 자료 추천"]]],
  ];
  return `${head({ title: "토이포포 | 대한민국 부모를 위한 육아 정보 플랫폼", description, url: "/" })}
<body>
  ${header()}
  <main>
    <section class="home-hero">
      <div class="home-hero__copy">
        <p class="eyebrow">ToyPoppo Parenting Platform</p>
        <h1>놀이, 발달, 동네 정보까지 부모의 하루를 가볍게</h1>
        <p>토이포포는 장난감 추천을 넘어 상담소, 부모가이드, 발달놀이, 몬테소리, 엄마표 자료실, 육아도구, 우리동네 육아정보를 연결하는 육아 정보 플랫폼으로 확장하고 있습니다. 정보 콘텐츠를 중심에 두고, AI와 공공데이터 기능은 부모의 선택을 돕는 보조 도구로 운영합니다.</p>

        <div class="hero-actions"><a class="button primary" href="/counseling/">상담소 보기</a><a class="button secondary" href="/local-info/">우리동네 육아정보</a></div>
      </div>
      <div class="home-hero__visual" aria-label="토이포포 육아 플랫폼 카드">
        <div class="burst">BETA<br>육아<br>플랫폼</div>
        <div class="playbook"><span>TOYPOPPO</span><strong>오늘의 육아 노트</strong><small>상담소 · 놀이 · 도구 · 동네 정보</small></div>
        <div class="floating-card card-a">🗺️ 동네 육아정보</div>
        <div class="floating-card card-b">✨ AI 추천 Beta</div>
      </div>
    </section>
    <section class="icon-section" aria-label="토이포포 주요 메뉴">${categories.map(([icon, title, href, desc]) => `<a class="icon-tile" href="${href}"><span>${icon}</span><strong>${title}</strong><small>${desc}</small></a>`).join("")}</section>
    <section class="age-strip"><div><strong>토이포포 베타 방향</strong><span>정보 콘텐츠가 중심이고 AI와 지역 정보는 보조 기능입니다.</span></div><div class="age-pills"><a href="/local-info/"><strong>지역</strong><span>육아정보</span></a><a href="/ai-helper/"><strong>AI</strong><span>추천엔진</span></a><a href="/parenting-tools/"><strong>도구</strong><span>체크리스트</span></a><a href="/worksheets/"><strong>자료</strong><span>워크지</span></a><a href="/development-play/"><strong>놀이</strong><span>발달놀이</span></a><a href="/counseling/"><strong>상담</strong><span>부모고민</span></a></div></section>
    ${sections.map(([title, desc, links]) => `<section class="section"><div class="section-head"><h2>${esc(title)}</h2><p>${esc(desc)}</p></div><div class="link-grid">${links.map(([href, label, text]) => `<a href="${href}"><strong>${esc(label)}</strong><span>${esc(text)}</span></a>`).join("")}</div></section>`).join("\n")}
    <section class="principles"><h2>토이포포 콘텐츠 원칙</h2><ul><li>정보 콘텐츠의 신뢰도와 완성도를 최우선으로 합니다.</li><li>AI 기능은 자유 채팅이 아니라 추천 엔진 형태로만 제공합니다.</li><li>공공데이터는 실제 부모에게 도움이 되는 항목만 공식 정보 기준으로 다룹니다.</li><li>지역 정보는 운영시간과 예약 방식이 바뀔 수 있어 공식 홈페이지 확인을 함께 안내합니다.</li><li>의료·발달 진단을 대체하지 않습니다.</li></ul></section>
  </main>
  ${footer()}
</body>
</html>`;
}

function patchNavAllHtml() {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(path.join(ROOT, dir))) {
      if (name === ".git") continue;
      const rel = path.join(dir, name);
      const full = path.join(ROOT, rel);
      if (fs.statSync(full).isDirectory()) walk(rel);
      else if (name.endsWith(".html")) files.push(rel);
    }
  }
  walk(".");
  const navHtml = `<nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>`;
  for (const rel of files) {
    let html = fs.readFileSync(path.join(ROOT, rel), "utf8");
    html = html.replace(/<nav class="nav" aria-label="[^"]*">[\s\S]*?<\/nav>/, navHtml);
    html = html.replace(/<small>[\s\S]*?<\/small>/, "<small>대한민국 부모를 위한 육아 정보 플랫폼</small>");
    fs.writeFileSync(path.join(ROOT, rel), html, "utf8");
  }
}

function updateSitemapFeeds(urls) {
  const sitemap = path.join(ROOT, "sitemap.xml");
  const set = new Set();
  if (fs.existsSync(sitemap)) {
    const old = fs.readFileSync(sitemap, "utf8");
    for (const m of old.matchAll(/<loc>https:\/\/toypoppo\.kr([^<]+)<\/loc>/g)) set.add(m[1]);
  }
  urls.forEach((u) => set.add(u));
  const sorted = ["/", ...[...set].filter((u) => u !== "/").sort()];
  fs.writeFileSync(sitemap, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><priority>${u === "/" ? "1.0" : u.endsWith("/") ? "0.9" : "0.8"}</priority></url>`).join("\n")}\n</urlset>\n`, "utf8");
  const feedItems = [
    ["우리동네 육아정보 Beta", "/local-info/", "지역별 육아 자원을 부모 관점으로 확인하는 베타 서비스입니다."],
    ["AI 육아도우미 Beta", "/ai-helper/", "발달놀이, 장난감, 워크지, 하루 플랜 추천 엔진입니다."],
    ["예방접종 체크", "/parenting-tools/vaccination-check.html", "생년월일 기준 접종 확인 포인트를 정리하는 도구입니다."],
    ["엄마표 학습 추천", "/parenting-tools/home-learning-recommend.html", "나이와 공부 분야에 맞는 엄마표 자료를 추천합니다."],
  ];
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>토이포포 최신 글</title>\n    <link>${SITE}/</link>\n    <description>육아 상담소, 발달놀이, 부모가이드, 지역 육아정보, 육아도구를 전합니다.</description>\n    <language>ko-KR</language>\n    <lastBuildDate>${PUB}</lastBuildDate>\n${feedItems.map(([title, url, desc]) => `    <item>\n      <title>${esc(title)}</title>\n      <link>${SITE}${url}</link>\n      <guid>${SITE}${url}</guid>\n      <description>${esc(desc)}</description>\n      <pubDate>${PUB}</pubDate>\n    </item>`).join("\n")}\n  </channel>\n</rss>\n`;
  fs.writeFileSync(path.join(ROOT, "rss.xml"), rss, "utf8");
  fs.writeFileSync(path.join(ROOT, "feed.xml"), rss, "utf8");
}

function patchStyles() {
  const p = path.join(ROOT, "assets", "styles.css");
  let css = fs.readFileSync(p, "utf8");
  const add = `.tool-panel input{width:100%;max-width:420px;margin-top:6px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);font:inherit}.beta-badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:8px;background:#fff0f7;color:var(--pink-strong);font-size:12px;font-weight:950}.local-map-box{min-height:180px;border:1px dashed var(--line);border-radius:14px;background:linear-gradient(135deg,#fffafc,#f3fffb);display:grid;place-items:center;color:var(--muted);font-weight:900;text-align:center;padding:18px}`;
  if (!css.includes(".beta-badge")) css += add;
  fs.writeFileSync(p, css, "utf8");
}

function main() {
  write("/local-info/", localInfoIndex());
  const localPages = [
    { slug: "daycare", title: "어린이집 찾기", description: "우리동네 어린이집을 볼 때 거리, 보육 환경, 적응 기간, 소통 방식을 함께 확인하는 부모 가이드입니다.", tips: ["집과의 거리보다 등하원 동선 전체를 봅니다.", "낮잠 공간, 식단, 교사 소통 방식을 확인합니다.", "입소 전 적응 기간 운영 방식을 물어봅니다.", "공식 정보와 현장 상담 내용을 함께 기록합니다."] },
    { slug: "support-center", title: "육아종합지원센터", description: "부모교육, 장난감도서관, 놀이체험실, 시간제 보육을 확인할 때 필요한 기준을 정리했습니다.", tips: ["장난감도서관 대여 규칙과 연체 기준을 확인합니다.", "부모교육은 예약 마감이 빠를 수 있습니다.", "놀이체험실은 월령 제한과 보호자 동반 여부를 봅니다.", "센터별 운영일이 달라 공식 공지를 확인합니다."] },
    { slug: "kids-library", title: "어린이도서관", description: "영유아 자료실, 그림책 프로그램, 북스타트와 도서관 방문 팁을 부모 관점으로 정리했습니다.", tips: ["영유아실 분리 여부를 확인합니다.", "수유실과 유모차 접근성을 봅니다.", "프로그램보다 짧은 그림책 탐색부터 시작합니다.", "아이가 조용히 있기 어려운 날은 체류 시간을 짧게 잡습니다."] },
    { slug: "museum-science", title: "박물관·과학관", description: "비 오는 날 실내 체험으로 좋은 박물관과 과학관을 연령별로 이용할 때 확인할 기준입니다.", tips: ["전시 소리와 조명이 아이에게 부담되지 않는지 봅니다.", "유모차 이동 동선과 휴게 공간을 확인합니다.", "관람 시간은 짧게 계획합니다.", "초등 아이는 관람 후 워크지 활동으로 연결해도 좋습니다."] },
    { slug: "family-events", title: "무료 체험·어린이 공연", description: "가족 행사, 어린이 공연, 무료 체험 프로그램을 고를 때 연령 제한과 예약 방식을 확인하는 가이드입니다.", tips: ["예약 시작일과 취소 규정을 확인합니다.", "연령 제한과 보호자 동반 여부를 봅니다.", "공연 시간은 아이 집중 시간을 넘기지 않게 고릅니다.", "소리와 조명이 강한 공연은 예민한 아이에게 부담이 될 수 있습니다."] },
    { slug: "parks-playgrounds", title: "공원·실내 놀이터", description: "날씨와 아이 연령에 맞춰 공원과 실내 놀이터를 고를 때 필요한 체크 포인트입니다.", tips: ["그늘, 화장실, 수유 공간, 주차를 확인합니다.", "실내 놀이터는 영유아 구역 분리 여부를 봅니다.", "폭염·미세먼지·비 오는 날에는 실내 대안을 준비합니다.", "처음 가는 장소는 짧게 이용하고 아이 반응을 봅니다."] },
  ];
  for (const page of localPages) write(`/local-info/${page.slug}.html`, localCategoryPage(page));
  write("/ai-helper/", aiHelperPage());
  write("/parenting-tools/vaccination-check.html", toolPage({
    url: "/parenting-tools/vaccination-check.html",
    title: "예방접종 체크",
    description: "아이 생년월일과 월령을 기준으로 예방접종 확인 포인트를 정리하는 참고용 육아도구입니다.",
    intro: "예방접종 체크는 접종 일정을 확정하는 도구가 아니라 부모가 다음 진료나 예방접종 도우미 확인 전에 빠뜨린 항목이 없는지 점검하는 참고용 도구입니다.",
    body: `<section class="tool-panel"><h2>월령별 확인 포인트</h2><label>아이 월령 <select id="vaccineAge"><option>0~1개월</option><option>2개월</option><option>4개월</option><option>6개월</option><option>12개월</option><option>15~18개월</option></select></label><button class="button primary" id="vaccineBtn" type="button">확인하기</button><div id="vaccineResult" class="summary-box soft"></div></section><section><h2>공식 확인이 필요한 이유</h2><p>예방접종은 아이의 건강 상태, 이전 접종일, 백신 종류, 병원 안내에 따라 달라질 수 있습니다. 토이포포에서는 부모가 놓치기 쉬운 확인 포인트만 제공하고, 최종 일정은 예방접종도우미 또는 의료기관 안내를 따르도록 안내합니다.</p></section>`,
    script: `<script>const vaccineMap={"0~1개월":"출생 직후와 생후 1개월 전후 접종 기록을 확인하세요. B형간염 등은 병원 기록과 예방접종도우미를 함께 봅니다.","2개월":"2개월 전후에는 여러 기초 접종이 시작될 수 있어 예약일과 아이 컨디션을 함께 확인하세요.","4개월":"이전 접종 후 간격이 맞는지 확인하고, 접종 전 발열이나 컨디션 저하가 있으면 의료진에게 먼저 상담하세요.","6개월":"6개월 전후 접종과 독감 시즌 여부를 함께 확인할 수 있습니다. 정확한 대상 여부는 의료기관 안내가 우선입니다.","12개월":"돌 전후에는 새로운 접종 항목이 늘 수 있어 생일 전후로 접종 기록을 정리해두면 좋습니다.","15~18개월":"추가 접종 시기와 누락 접종 여부를 확인하기 좋은 시기입니다."};document.getElementById("vaccineBtn").onclick=()=>{const age=document.getElementById("vaccineAge").value;document.getElementById("vaccineResult").innerHTML="<strong>"+age+" 확인 포인트</strong><p>"+vaccineMap[age]+"</p><p>최종 일정은 예방접종도우미와 소아청소년과 안내를 확인하세요.</p>"};</script>`,
  }));
  write("/parenting-tools/home-learning-recommend.html", toolPage({
    url: "/parenting-tools/home-learning-recommend.html",
    title: "엄마표 학습 추천",
    description: "아이 나이와 공부 분야에 맞춰 토이포포 엄마표 자료실 글과 활용법을 추천하는 도구입니다.",
    intro: "엄마표 학습 추천은 문제집을 많이 푸는 것보다 아이 수준에 맞는 한 가지 활동을 부모가 어떻게 설명할지 정리해주는 도구입니다.",
    body: `<section class="tool-panel"><h2>학습 자료 추천</h2><label>나이 <select id="learnAge"><option>6세</option><option>7세</option><option>초등 1학년</option><option>초등 2학년</option><option>초등 3학년</option></select></label><label>분야 <select id="learnArea"><option>문해력</option><option>속담</option><option>사자성어</option><option>한국사</option><option>독해</option></select></label><button class="button primary" id="learnBtn" type="button">추천 보기</button><div id="learnResult" class="summary-box soft"></div></section><section><h2>부모 활용법</h2><p>아이에게 처음부터 긴 설명을 하기보다 짧은 이야기와 질문으로 시작하세요. 한 장을 모두 끝내기보다 아이가 스스로 말해본 문장 하나를 기록하는 것이 더 오래 남습니다.</p></section>`,
    script: `<script>const links={문해력:["/worksheets/elementary-reading-worksheet.html","초등 독해 활동지"],속담:["/worksheets/proverb-worksheet.html","속담 워크지"],사자성어:["/worksheets/four-character-idiom-worksheet.html","사자성어 워크지"],한국사:["/worksheets/goguryeo-worksheet.html","고구려 워크지"],독해:["/worksheets/elementary-reading-worksheet.html","초등 독해 활동지"]};document.getElementById("learnBtn").onclick=()=>{const age=document.getElementById("learnAge").value;const area=document.getElementById("learnArea").value;const item=links[area];document.getElementById("learnResult").innerHTML="<strong>"+age+" · "+area+" 추천</strong><p><a href='"+item[0]+"'>"+item[1]+"</a>부터 시작해보세요. 부모가 예시를 한 번 읽어주고 아이가 한두 문항만 직접 말해보게 하면 부담이 적습니다.</p>"};</script>`,
  }));
  updateToolsIndex();
  fs.writeFileSync(path.join(ROOT, "index.html"), buildHome(), "utf8");
  patchNavAllHtml();
  patchStyles();
  updateSitemapFeeds([
    "/local-info/", "/local-info/daycare.html", "/local-info/support-center.html", "/local-info/kids-library.html", "/local-info/museum-science.html", "/local-info/family-events.html", "/local-info/parks-playgrounds.html",
    "/ai-helper/", "/parenting-tools/vaccination-check.html", "/parenting-tools/home-learning-recommend.html",
  ]);
}

main();
