const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const TODAY = "2026-06-27";

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const nav = [
  ["장난감 추천", "/#months"],
  ["발달놀이", "/development-play/"],
  ["부모 가이드", "/parent-guide/"],
  ["상담소", "/counseling/"],
  ["엄마표 자료실", "/worksheets/"],
  ["몬테소리", "/montessori/"],
  ["육아도구", "/parenting-tools/"],
];

function baseHead() {
  const title = "토이포포 | 대한민국 부모를 위한 육아 정보 허브";
  const description = "월령별 장난감 추천, 발달놀이, 부모 상담소, 몬테소리, 엄마표 자료실, 육아도구를 제공하는 대한민국 부모를 위한 육아 정보 허브입니다.";
  const graph = [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
    { "@type": "WebSite", "@id": `${SITE}/#website`, name: "토이포포", url: SITE, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
    { "@type": "WebPage", name: title, description, url: `${SITE}/`, isPartOf: { "@id": `${SITE}/#website` }, dateModified: TODAY, inLanguage: "ko-KR" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: SITE }] },
  ];
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${SITE}/">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}/">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
</head>`;
}

function header() {
  return `<header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 허브</small></span></a>
    <nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div><strong>토이포포</strong><p>장난감, 발달놀이, 부모 고민, 엄마표 자료, 몬테소리 환경을 함께 다루는 육아 정보 허브입니다.</p></div>
    <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">콘텐츠 업데이트 정책</a><a href="/affiliate-disclosure.html">쿠팡파트너스 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>`;
}

function cardGrid(items) {
  return `<div class="link-grid">${items.map(([href, title, desc]) => `<a href="${href}"><strong>${esc(title)}</strong><span>${esc(desc)}</span></a>`).join("")}</div>`;
}

function home() {
  const categories = [
    ["🧸", "장난감 추천", "/#months", "개월·나이별 선택 기준"],
    ["🌱", "발달놀이", "/development-play/", "집에서 바로 하는 놀이"],
    ["💬", "상담소", "/counseling/", "부모가 자주 묻는 고민"],
    ["📚", "부모 가이드", "/parent-guide/", "하루 일과와 생활 팁"],
    ["✏️", "엄마표 자료실", "/worksheets/", "초등 활동지와 활용법"],
    ["🏡", "몬테소리", "/montessori/", "준비된 환경과 반복"],
    ["✅", "육아도구", "/parenting-tools/", "체크리스트와 선택 도구"],
    ["🎁", "선물 추천", "/posts/two-year-old-gift-guide.html", "생일·입학·어린이날"],
  ];
  const ages = [
    ["0세", "6~12개월", "/posts/6-month-baby-toys.html"],
    ["1세", "13~23개월", "/posts/13-month-toddler-toys.html"],
    ["2세", "두돌 전후", "/posts/24-month-toddler-toys.html"],
    ["3~5세", "유아 놀이", "/posts/five-year-old-gift-guide.html"],
    ["6~7세", "입학 전 놀이", "/posts/six-year-old-toys-guide.html"],
    ["초등", "학용품·교구", "/posts/elementary-grade-1-recommendations.html"],
  ];
  const popular = [
    ["/posts/two-year-old-gift-guide.html", "두돌 선물 추천", "역할놀이, 블록, 그림책처럼 오래 쓰는 선물 기준"],
    ["/posts/elementary-school-entrance-gift.html", "초등학교 입학선물", "가방, 필통, 문해력 교재를 고를 때 보는 기준"],
    ["/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이", "촉감, 거울, 공 굴리기, 보물바구니 놀이"],
    ["/counseling/toy-in-mouth.html", "장난감을 입에 넣어요", "구강기 탐색과 안전하게 지켜볼 기준"],
    ["/montessori/everyday-life-play.html", "몬테소리 일상생활 놀이", "물 따르기, 닦기, 옮기기를 놀이로 바꾸기"],
    ["/parenting-tools/development-checklist.html", "개월별 발달 체크리스트", "6~12개월 발달 모습을 참고용으로 확인"],
  ];
  const sections = [
    ["오늘의 육아팁", "장난감은 많이 꺼내는 것보다 아이가 스스로 고르고 반복할 수 있게 적게 보이는 편이 도움이 됩니다.", [
      ["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법", "꺼내두는 장난감 수를 줄이고 집중 시간을 늘리는 방법"],
      ["/counseling/too-many-toys.html", "장난감이 너무 많으면 안 좋을까요?", "많은 장난감과 집중력의 관계를 부모 관점에서 정리"],
      ["/parenting-tools/today-play.html", "오늘의 놀이 추천", "아이 컨디션에 맞춰 오늘 할 놀이를 고르는 도구"],
    ]],
    ["발달놀이 바로가기", "개월별 글은 같은 형식 반복이 아니라 그 시기 발달 포인트에 맞춰 다르게 구성했습니다.", [
      ["/blog/6-month-baby-development-play.html", "6개월 발달놀이", "뒤집기 이후 손 뻗기와 촉감 탐색"],
      ["/blog/9-month-baby-development-play.html", "9개월 발달놀이", "기기, 숨은 물건 찾기, 원인과 결과"],
      ["/blog/12-month-baby-development-play.html", "12개월 발달놀이", "걷기 준비와 생활 모방 놀이"],
    ]],
    ["부모가 많이 찾는 상담소", "불안을 키우지 않도록 발달 개인차, 지켜볼 신호, 상담이 필요한 경우를 나눠 설명합니다.", [
      ["/counseling/no-crawling-7-month.html", "7개월인데 배밀이를 안 해요", "배밀이·기기 발달을 지켜보는 기준"],
      ["/counseling/screen-time-baby.html", "TV를 보여줘도 될까요?", "화면 노출을 현실적으로 조절하는 방법"],
      ["/counseling/doesnt-like-books.html", "그림책을 안 좋아해요", "읽히기보다 함께 보는 방식으로 바꾸기"],
    ]],
    ["엄마표 자료실", "PDF만 제공하지 않고 부모 활용법, 설명 예시, 퀴즈와 활동까지 함께 제공합니다.", [
      ["/worksheets/goguryeo-worksheet.html", "고구려 워크지", "초등 한국사 첫 활동지"],
      ["/worksheets/proverb-worksheet.html", "속담 워크지", "문해력과 어휘를 함께 다루는 활동"],
      ["/worksheets/elementary-reading-worksheet.html", "초등 독해 활동지", "중심 내용 찾기와 생각 쓰기"],
    ]],
    ["몬테소리", "비싼 교구보다 관찰, 환경, 반복, 아이의 자발성을 먼저 봅니다.", [
      ["/montessori/what-is-montessori.html", "몬테소리란?", "집에서 오해 없이 시작하는 기본 개념"],
      ["/montessori/prepared-environment.html", "준비된 환경 만들기", "아이 스스로 꺼내고 정리하는 공간"],
      ["/montessori/treasure-basket-play.html", "보물바구니 놀이", "생활 물건으로 하는 감각 탐색"],
    ]],
  ];
  const monthLinks = [
    ["/posts/6-month-baby-toys.html", "6개월 아기 장난감", "촉감·거울·공 굴리기"],
    ["/posts/7-month-baby-toys.html", "7개월 아기 장난감", "배밀이와 손 조작"],
    ["/posts/8-month-baby-toys.html", "8개월 아기 장난감", "버튼·소리·숨은 물건"],
    ["/posts/9-month-baby-toys.html", "9개월 아기 장난감", "기기와 원인 결과"],
    ["/posts/10-month-baby-toys.html", "10개월 아기 장난감", "쌓고 넣고 빼기"],
    ["/posts/11-month-baby-toys.html", "11개월 아기 장난감", "잡고 서기와 조작"],
    ["/posts/12-month-baby-toys.html", "12개월 돌 아기 장난감", "걷기 준비와 모방"],
    ["/posts/24-month-toddler-toys.html", "24개월 두돌 장난감", "역할놀이와 이야기"],
    ["/posts/elementary-grade-1-recommendations.html", "초등 1학년 추천템", "학용품·교구·취미"],
  ];
  return `${baseHead()}
<body>
  ${header()}
  <main>
    <section class="home-hero">
      <div class="home-hero__copy">
        <p class="eyebrow">ToyPoppo Parenting Hub</p>
        <h1>우리 아이 월령에 맞는 놀이와 장난감, 한눈에 찾아요</h1>
        <p>토이포포는 장난감만 추천하지 않습니다. 발달 단계, 놀이 방법, 부모 고민, 몬테소리 환경, 초등 자료까지 함께 정리해 부모가 저장하고 다시 찾아볼 수 있는 육아 정보 허브를 지향합니다.</p>

        <div class="hero-actions"><a class="button primary" href="/development-play/">발달놀이 보기</a><a class="button secondary" href="/parenting-tools/">육아도구 보기</a></div>
      </div>
      <div class="home-hero__visual" aria-label="토이포포 육아 정보 카드">
        <div class="burst">오늘<br>놀이<br>추천</div>
        <div class="playbook"><span>TOYPOPPO</span><strong>월령별 놀이 노트</strong><small>발달 · 장난감 · 부모 가이드</small></div>
        <div class="floating-card card-a">🧸 장난감 기준</div>
        <div class="floating-card card-b">🌱 발달놀이</div>
      </div>
    </section>

    <section class="icon-section" aria-label="토이포포 주요 카테고리">
      ${categories.map(([icon, title, href, desc]) => `<a class="icon-tile" href="${href}"><span>${icon}</span><strong>${title}</strong><small>${desc}</small></a>`).join("")}
    </section>

    <section class="age-strip" aria-label="연령별 바로가기">
      <div><strong>연령별로 보기</strong><span>아이 나이에 맞는 글로 바로 이동하세요.</span></div>
      <div class="age-pills">${ages.map(([age, label, href]) => `<a href="${href}"><strong>${age}</strong><span>${label}</span></a>`).join("")}</div>
    </section>

    <section class="section featured-section">
      <div class="section-head"><h2>인기 추천 글</h2><p>처음 방문한 부모가 가장 많이 필요로 하는 글을 먼저 모았습니다.</p></div>
      ${cardGrid(popular)}
    </section>

    ${sections.map(([title, desc, links]) => `<section class="section"><div class="section-head"><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>${cardGrid(links)}</section>`).join("\n")}

    <section class="section" id="months"><div class="section-head"><h2>개월별 장난감 추천</h2><p>상품보다 먼저 발달 특징과 놀이 목적을 보고 고를 수 있게 정리했습니다.</p></div>${cardGrid(monthLinks)}</section>

    <section class="principles"><h2>토이포포 콘텐츠 원칙</h2><ul><li>실제 육아 생활에 도움이 되는 정보를 우선 제공합니다.</li><li>발달 단계와 사용 목적을 함께 고려합니다.</li><li>상품 추천 시 장점과 주의점을 함께 안내합니다.</li><li>제휴 링크가 있는 경우 명확히 고지합니다.</li><li>의료·발달 진단을 대체하지 않습니다.</li></ul></section>
  </main>
  ${footer()}
</body>
</html>`;
}

function patchStyles() {
  const file = path.join(ROOT, "assets", "styles.css");
  let css = fs.readFileSync(file, "utf8");
  const add = `
.home-hero{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:28px;align-items:center;padding:clamp(34px,7vw,82px) clamp(18px,5vw,72px);background:linear-gradient(135deg,#fff7fb 0%,#fff 42%,#eafbf6 100%);overflow:hidden}.home-hero:before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle,#ffd7e8 1.5px,transparent 1.5px),radial-gradient(circle,#b8efe1 1.5px,transparent 1.5px);background-size:36px 36px;background-position:0 0,18px 18px;opacity:.32;pointer-events:none}.home-hero__copy,.home-hero__visual{position:relative;z-index:1}.home-hero h1{max-width:780px;margin:8px 0 14px;font-size:clamp(34px,5.5vw,64px);line-height:1.08;letter-spacing:0}.home-hero p{max-width:720px;color:var(--muted);font-size:18px;line-height:1.78}.home-hero__visual{min-height:340px;border-radius:24px;background:linear-gradient(145deg,#fff,#fff0f7);border:1px solid var(--line);box-shadow:0 24px 52px rgba(112,64,88,.14)}.playbook{position:absolute;right:34px;top:54px;width:min(72%,360px);min-height:218px;padding:32px 28px;border-radius:18px;background:linear-gradient(135deg,#8d61d8,#ff73aa);color:#fff;box-shadow:0 18px 36px rgba(119,74,158,.24);transform:rotate(7deg)}.playbook span{font-size:12px;font-weight:950;letter-spacing:.12em;opacity:.82}.playbook strong{display:block;margin-top:28px;font-size:30px;line-height:1.15}.playbook small{display:block;margin-top:18px;font-weight:800}.burst{position:absolute;left:36px;top:38px;display:grid;place-items:center;width:128px;height:128px;border-radius:34% 66% 43% 57%;background:#ff3d93;color:#fff;font-size:24px;line-height:1.05;font-weight:950;text-align:center;transform:rotate(-10deg);box-shadow:0 14px 28px rgba(232,79,138,.24)}.floating-card{position:absolute;padding:12px 16px;border-radius:14px;background:#fff;border:1px solid var(--line);box-shadow:0 14px 28px rgba(112,64,88,.12);font-weight:950}.card-a{left:54px;bottom:62px}.card-b{right:54px;bottom:38px}.icon-section{width:min(1120px,calc(100% - 32px));margin:-22px auto 34px;position:relative;z-index:2;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 18px 42px rgba(112,64,88,.1)}.icon-tile{display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;padding:14px;border-radius:14px;text-decoration:none;background:linear-gradient(135deg,#fffafc,#f4fffb);border:1px solid transparent}.icon-tile:hover{border-color:#f4b8d0;transform:translateY(-1px)}.icon-tile span{grid-row:1/3;display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#fff1f7;font-size:24px}.icon-tile strong{font-size:16px}.icon-tile small{color:var(--muted);line-height:1.4}.age-strip{width:min(1120px,calc(100% - 32px));margin:0 auto 34px;padding:18px;border-radius:16px;background:#30242d;color:#fff;display:grid;grid-template-columns:190px 1fr;gap:18px;align-items:center}.age-strip span{display:block;color:#f8dce9;font-size:13px;margin-top:4px}.age-pills{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.age-pills a{padding:12px 10px;border-radius:12px;background:#fff;color:var(--ink);text-decoration:none;text-align:center}.age-pills a strong{display:block;font-size:17px}.age-pills a span{color:var(--muted)}.featured-section{border-width:2px;border-color:#f6bdd5}@media(max-width:900px){.home-hero{grid-template-columns:1fr}.home-hero__visual{min-height:300px}.icon-section{grid-template-columns:repeat(2,1fr)}.age-strip{grid-template-columns:1fr}.age-pills{grid-template-columns:repeat(3,1fr)}}@media(max-width:560px){.home-hero h1{font-size:34px}.home-hero__visual{min-height:260px}.playbook{right:18px;top:54px;width:72%;min-height:176px;padding:24px 20px}.playbook strong{font-size:23px}.burst{width:104px;height:104px;font-size:20px;left:18px}.floating-card{font-size:13px}.icon-section{grid-template-columns:1fr}.age-pills{grid-template-columns:repeat(2,1fr)}}`;
  if (!css.includes(".home-hero")) css += add;
  fs.writeFileSync(file, css, "utf8");
}

fs.writeFileSync(path.join(ROOT, "index.html"), home(), "utf8");
patchStyles();
