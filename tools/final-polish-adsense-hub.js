const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const TODAY = "2026-06-27";

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function write(rel, html) {
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, "utf8");
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function head(title, description, url) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
      { "@type": "WebSite", "@id": `${SITE}/#website`, name: "토이포포", url: SITE, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
      {
        "@type": "Article",
        headline: title,
        description,
        author: { "@type": "Organization", name: "토이포포 편집팀" },
        publisher: { "@id": `${SITE}/#organization` },
        mainEntityOfPage: `${SITE}${url}`,
        datePublished: TODAY,
        dateModified: TODAY,
        inLanguage: "ko-KR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE },
          { "@type": "ListItem", position: 2, name: "몬테소리", item: `${SITE}/montessori/` },
          { "@type": "ListItem", position: 3, name: title, item: `${SITE}${url}` },
        ],
      },
    ],
  };
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | 토이포포</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${SITE}${url}">
  <meta property="og:title" content="${esc(title)} | 토이포포">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>`;
}

function montessoriEverydayPage() {
  const title = "몬테소리 일상생활 놀이";
  const description = "비싼 교구 없이 물 따르기, 닦기, 옮기기, 분류하기처럼 집에서 바로 시작하는 몬테소리 일상생활 놀이 방법을 정리했습니다.";
  const url = "/montessori/everyday-life-play.html";
  return `${head(title, description, url)}
<body>
  ${header()}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/montessori/">몬테소리</a> / ${title}</p>
      <p class="eyebrow">Montessori Home</p>
      <h1>${title}: 집안일을 아이의 놀이로 바꾸는 방법</h1>
      <p class="modified-date" data-modified-date="${TODAY}">최종 수정일: ${TODAY}</p>
      <p class="lead">몬테소리 일상생활 놀이는 특별한 교구를 사야 시작할 수 있는 활동이 아닙니다. 아이가 매일 보는 컵, 숟가락, 수건, 작은 바구니, 물통 같은 생활 물건을 이용해 스스로 해보고, 실패하고, 다시 시도하는 시간을 만드는 것이 핵심입니다. 부모 입장에서는 집안일이 조금 느려질 수 있지만, 아이에게는 손 조절, 순서 이해, 집중력, 독립심을 함께 경험하는 소중한 시간이 됩니다.</p>

      <div class="summary-box"><strong>먼저 기억할 점</strong><ul><li>일상생활 놀이는 결과보다 과정이 중요합니다.</li><li>부모가 대신 완성해주기보다 아이가 반복할 시간을 줍니다.</li><li>물, 작은 물건, 도구를 사용할 때는 반드시 가까이에서 지켜봅니다.</li></ul></div>

      <section><h2>몬테소리에서 일상생활을 중요하게 보는 이유</h2><p>몬테소리 교육에서는 아이가 생활 속에서 실제로 쓰이는 물건을 만지고 다루는 경험을 중요하게 봅니다. 장난감은 상상과 탐색을 도와주지만, 일상생활 활동은 아이가 자기 삶에 참여하고 있다는 느낌을 줍니다. 컵에 물을 따르고, 흘린 물을 닦고, 양말을 바구니에 넣는 행동은 어른에게는 작아 보이지만 아이에게는 “내가 할 수 있다”는 감각을 만들어 줍니다.</p><p>특히 영유아기는 손과 눈의 협응, 순서 기억, 힘 조절이 빠르게 자라는 시기입니다. 숟가락으로 콩을 옮기거나, 작은 수건으로 테이블을 닦거나, 집게로 솜공을 집어 옮기는 활동은 겉보기에는 단순하지만 손가락 조절과 집중을 동시에 사용합니다. 초등 전 아이에게도 이런 활동은 자기 물건 정리, 준비물 챙기기, 식사 준비 돕기처럼 생활 습관으로 이어집니다.</p></section>

      <section><h2>추천 기준 5가지</h2><div class="grid"><p class="box"><strong>안전성</strong><br>입에 들어갈 수 있는 작은 부품, 깨지는 유리, 날카로운 도구는 피합니다.</p><p class="box"><strong>실제성</strong><br>아이용 장난감보다 실제 생활에 쓰이는 물건을 안전하게 작게 준비하면 좋습니다.</p><p class="box"><strong>반복성</strong><br>한 번 하고 끝나는 활동보다 여러 번 반복해도 질리지 않는 활동이 좋습니다.</p><p class="box"><strong>정리 편의성</strong><br>작은 쟁반이나 바구니 하나에 준비하고 마무리할 수 있어야 부모도 지속하기 쉽습니다.</p><p class="box"><strong>아이 주도성</strong><br>부모가 설명을 길게 하기보다 아이가 손으로 해보며 이해할 수 있어야 합니다.</p></div></section>

      <section><h2>집에서 바로 하는 일상생활 놀이</h2><h3>물 따르기</h3><p>작은 물병과 낮은 컵을 준비해 물을 조금만 담아줍니다. 처음에는 흘리는 것이 자연스럽습니다. 옆에 작은 수건을 함께 두고 흘린 물을 닦는 과정까지 하나의 활동으로 연결해 주세요. 이 놀이는 손목 조절, 양손 협응, 양 조절을 경험하게 합니다.</p><h3>숟가락으로 옮기기</h3><p>큰 그릇 두 개와 숟가락, 마른 콩이나 큰 폼폼을 준비합니다. 아이가 한쪽 그릇에서 다른 그릇으로 옮기도록 합니다. 아직 어린 아이는 콩 대신 큰 솜공처럼 안전한 재료를 사용합니다. 이 활동은 소근육과 집중력을 함께 사용하게 합니다.</p><h3>수건 접기와 닦기</h3><p>작은 손수건을 반으로 접거나 낮은 테이블을 닦아보게 합니다. 완벽하게 접지 않아도 괜찮습니다. 아이는 손의 방향, 힘 조절, 활동의 시작과 끝을 배웁니다. 몬테소리 관점에서는 환경을 돌보는 경험이 자기 조절과 책임감의 씨앗이 됩니다.</p><h3>바구니 분류하기</h3><p>양말, 작은 천, 나무 블록처럼 안전한 물건을 색이나 종류별로 나눠 바구니에 넣어봅니다. 2~3가지 분류부터 시작하면 충분합니다. 분류 활동은 관찰력, 언어, 수학적 사고의 기초가 됩니다.</p><h3>빨래집게 놀이</h3><p>손힘이 어느 정도 생긴 아이에게는 큰 빨래집게를 바구니 가장자리에 꽂고 빼는 활동이 좋습니다. 다만 손이 집히지 않도록 부드럽고 큰 제품을 사용하고, 아이가 어려워하면 억지로 반복시키지 않습니다.</p><h3>식사 준비 돕기</h3><p>숟가락 놓기, 냅킨 올리기, 자기 컵을 자리로 가져가기처럼 아주 작은 역할을 줍니다. 식사 준비는 가족 생활에 참여하는 경험이라 아이가 놀이보다 더 진지하게 받아들이는 경우도 많습니다.</p></section>

      <section><h2>구매 전 체크리스트</h2><ul class="check-list"><li>도구가 아이 손 크기에 맞는지 확인합니다.</li><li>물이나 작은 재료를 쓰는 활동은 정리 공간까지 미리 정합니다.</li><li>입에 넣을 수 있는 연령이라면 작은 알갱이 재료는 피합니다.</li><li>한 번에 여러 활동을 꺼내기보다 한 가지 활동을 반복하게 합니다.</li><li>부모가 조급해지는 날에는 짧게 끝낼 수 있는 활동만 고릅니다.</li></ul></section>

      <section><h2>실제 선택 시 주의사항</h2><p>일상생활 놀이는 아이가 잘 따라 하는 모습을 보여주기 위한 활동이 아닙니다. 부모가 “이렇게 해야 해”라고 계속 고쳐주면 아이는 활동보다 평가를 먼저 느낄 수 있습니다. 처음에는 흘리고, 떨어뜨리고, 엉뚱한 방식으로 만지는 것이 자연스럽습니다. 대신 위험한 순간에는 짧고 분명하게 멈춰주고, 안전한 범위 안에서는 아이가 스스로 해볼 시간을 남겨두는 것이 좋습니다.</p><p>또 하나 중요한 점은 활동 시간을 길게 잡지 않는 것입니다. 5분만 집중해도 충분합니다. 아이가 흥미를 잃으면 정리로 넘어가고, 다음 날 다시 꺼내면 됩니다. 같은 활동을 여러 날 반복해도 괜찮습니다. 오히려 몬테소리에서는 반복을 통해 손이 익고, 아이가 스스로 질서를 발견한다고 봅니다.</p></section>

      <section><h2>자주 묻는 질문</h2><h3>몇 개월부터 일상생활 놀이를 시작할 수 있나요?</h3><p>앉아서 손을 자유롭게 쓰기 시작하는 시기부터 아주 간단한 옮기기나 닦기 활동을 시도할 수 있습니다. 다만 월령보다 아이가 안전하게 앉아 있을 수 있는지, 입에 넣는 행동이 얼마나 잦은지를 먼저 봅니다.</p><h3>비싼 몬테소리 교구가 꼭 필요한가요?</h3><p>꼭 필요하지 않습니다. 컵, 수건, 바구니, 숟가락처럼 집에 있는 물건으로도 충분히 시작할 수 있습니다. 중요한 것은 물건의 가격보다 아이가 스스로 다룰 수 있는 환경입니다.</p><h3>아이가 계속 흘리기만 하면 중단해야 하나요?</h3><p>조금 흘리는 것은 배움의 일부입니다. 다만 아이가 장난으로 던지거나 위험하게 사용하면 활동을 짧게 마무리하고 다음에 다시 시도하는 편이 좋습니다.</p><h3>하루에 얼마나 해주면 좋나요?</h3><p>하루 5~10분 정도라도 충분합니다. 부모가 부담 없이 반복할 수 있어야 오래 갑니다. 특별한 시간표보다 식사 전후, 목욕 전후처럼 일상 흐름에 붙이는 것이 좋습니다.</p><h3>형제자매가 있으면 어떻게 하나요?</h3><p>각자 역할을 다르게 주면 좋습니다. 큰아이는 냅킨 놓기, 작은아이는 숟가락 놓기처럼 성공하기 쉬운 역할을 나누면 다툼이 줄어듭니다.</p></section>

      <section class="note-box"><strong>전문가 상담 안내</strong><p>이 콘텐츠는 일반적인 육아 정보를 제공하기 위한 자료입니다. 아이의 발달에는 개인차가 있으며 건강 또는 발달에 대한 걱정이 있는 경우 소아청소년과 또는 관련 전문가와 상담하시기 바랍니다.</p></section>

      <section><h2>함께 보면 좋은 글</h2><div class="related-grid"><a href="/montessori/what-is-montessori.html"><strong>몬테소리란?</strong><span>집에서 시작하기 전 기본 개념을 정리했습니다.</span></a><a href="/montessori/prepared-environment.html"><strong>준비된 환경 만들기</strong><span>아이 스스로 꺼내고 정리하는 환경입니다.</span></a><a href="/montessori/treasure-basket-play.html"><strong>보물바구니 놀이</strong><span>생활 물건으로 하는 감각 탐색입니다.</span></a><a href="/parent-guide/toy-rotation-guide.html"><strong>장난감 로테이션</strong><span>적게 꺼내 깊게 놀게 하는 방법입니다.</span></a><a href="/parenting-tools/today-play.html"><strong>오늘의 놀이 추천</strong><span>아이 컨디션에 맞춰 놀이를 골라보세요.</span></a></div></section>
    </article>
  </main>
  ${footer()}
</body>
</html>`;
}

function patchModifiedDateAttributes() {
  const htmlFiles = [];
  function walk(dir) {
    for (const name of fs.readdirSync(path.join(ROOT, dir))) {
      const rel = path.join(dir, name);
      const full = path.join(ROOT, rel);
      if (fs.statSync(full).isDirectory()) walk(rel);
      else if (name.endsWith(".html")) htmlFiles.push(rel);
    }
  }
  for (const dir of ["."]) walk(dir);
  for (const rel of htmlFiles) {
    let html = read(rel);
    html = html.replace(/<p class="modified-date">/g, `<p class="modified-date" data-modified-date="${TODAY}">`);
    html = html.replace(/쿠팡 링크가 없나요\?/g, "구매 링크가 없나요?");
    if (!html.includes("data-modified-date") && html.includes("<h1")) {
      html = html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/, `$1\n      <p class="modified-date" data-modified-date="${TODAY}">최종 수정일: ${TODAY}</p>`);
    }
    write(rel, html);
  }
}

function expertNoticeHtml() {
  return `<section class="note-box"><strong>전문가 상담 안내</strong><p>이 콘텐츠는 일반적인 육아 정보를 제공하기 위한 자료입니다. 아이의 발달에는 개인차가 있으며 건강 또는 발달에 대한 걱정이 있는 경우 소아청소년과 또는 관련 전문가와 상담하시기 바랍니다.</p></section>`;
}

function patchOlderBlogArticles() {
  const blogDir = path.join(ROOT, "blog");
  for (const name of fs.readdirSync(blogDir)) {
    if (!name.endsWith(".html") || name === "index.html") continue;
    const rel = path.join("blog", name);
    let html = read(rel);
    if (!html.includes("전문가 상담 안내") && (html.includes("발달") || html.includes("몬테소리") || html.includes("놀이"))) {
      html = html.replace(/(<section>\s*<h2>함께 보면 좋은 글<\/h2>)/, `${expertNoticeHtml()}\n      $1`);
    }
    write(rel, html);
  }
}

function patchToolPagesDepth() {
  const extra = `<section class="summary-box"><strong>도구를 사용할 때 더 정확하게 보는 법</strong><p>체크 결과는 정답표가 아니라 부모가 아이의 하루를 관찰하기 위한 메모로 사용하는 것이 좋습니다. 같은 월령이라도 수면, 컨디션, 기질, 어린이집 적응 여부에 따라 반응은 크게 달라질 수 있습니다. 오늘 잘 되지 않은 항목을 실패로 보지 말고, 며칠 뒤 다시 시도해볼 놀이 후보로 남겨두세요.</p><p>토이포포의 육아도구는 구매를 유도하기보다 부모가 지금 필요한 행동을 고를 수 있게 돕는 데 목적이 있습니다. 아이가 부담스러워하면 활동을 줄이고, 잘 따라오면 같은 활동을 조금 더 천천히 반복하는 방식이 가장 안정적입니다.</p></section>`;
  for (const name of fs.readdirSync(path.join(ROOT, "parenting-tools"))) {
    if (!name.endsWith(".html") || name === "index.html") continue;
    const rel = path.join("parenting-tools", name);
    let html = read(rel);
    if (!html.includes("도구를 사용할 때 더 정확하게 보는 법")) {
      html = html.replace(/(<section><h2>(?:사용|활용) 방법<\/h2>)/, `${extra}\n      $1`);
    }
    write(rel, html);
  }
}

function patchCategoryIndexDepth() {
  const blocks = {
    "counseling/index.html": `<section class="section"><div class="section-head"><h2>상담소를 읽는 방법</h2><p>상담소 글은 부모가 자주 검색하는 고민을 질문형으로 풀어 쓴 공간입니다. 아이가 장난감을 입에 넣거나, 배밀이를 늦게 시작하거나, 낯가림이 심해지는 상황은 대부분 한 가지 정답으로 설명하기 어렵습니다. 그래서 토이포포는 불안을 키우는 단정 대신 부모가 오늘 확인할 수 있는 기준, 지켜볼 수 있는 변화, 전문가 상담이 필요한 신호를 나눠 정리합니다.</p><p>각 글은 아이의 행동을 문제로 보기보다 발달 과정 안에서 이해하도록 돕는 데 초점을 둡니다. 읽은 뒤에는 관련 부모 가이드나 발달놀이 글로 이동해 실제 생활에서 적용할 수 있는 방법까지 함께 확인해보세요.</p></div></section>`,
    "parent-guide/index.html": `<section class="section"><div class="section-head"><h2>부모 가이드를 활용하는 방법</h2><p>부모 가이드는 하루 일과, 외출 준비, 그림책 읽기, 장난감 정리처럼 실제 생활에서 반복되는 장면을 다룹니다. 육아는 거창한 프로그램보다 매일 반복되는 작은 선택의 영향을 많이 받습니다. 그래서 각 글은 준비물, 시간대, 부모가 지치지 않는 방식, 아이가 거부할 때의 대안을 함께 설명합니다.</p><p>처음부터 모든 방법을 적용하려고 하지 않아도 됩니다. 오늘 필요한 글 하나만 골라 가족의 생활 리듬에 맞게 조금씩 바꿔보는 방식이 가장 오래 갑니다.</p></div></section>`,
    "worksheets/index.html": `<section class="section"><div class="section-head"><h2>엄마표 자료실 활용법</h2><p>엄마표 자료실은 PDF 파일만 내려받는 공간이 아니라, 부모가 아이에게 주제를 어떻게 설명하고 활동으로 연결할지 함께 안내하는 자료실입니다. 역사 인물, 삼국 시대, 속담, 사자성어, 독해 활동은 아이가 외우기만 하면 금방 지루해질 수 있습니다. 토이포포는 짧은 설명, 아이에게 말해주는 예시, 퀴즈와 활동을 함께 넣어 집에서도 부담 없이 시작할 수 있게 구성합니다.</p><p>초등 저학년은 긴 설명보다 이야기와 질문에 잘 반응합니다. 자료를 출력하기 전 먼저 부모 활용법을 읽고, 아이 수준에 맞춰 한두 문제만 골라 시작해보세요.</p></div></section>`,
    "montessori/index.html": `<section class="section"><div class="section-head"><h2>몬테소리를 집에서 시작할 때</h2><p>토이포포의 몬테소리 글은 고가의 교구 목록보다 아이를 관찰하는 방법과 준비된 환경을 중심으로 설명합니다. 아이가 스스로 꺼내고, 반복하고, 정리해보는 경험은 장난감의 종류보다 환경의 단순함과 부모의 기다림에 더 많은 영향을 받습니다.</p><p>처음에는 보물바구니, 장난감 로테이션, 낮은 선반, 일상생활 놀이처럼 집에서 바로 바꿀 수 있는 것부터 시작해도 충분합니다. 중요한 것은 아이가 실패 없이 완벽하게 해내는 것이 아니라, 스스로 시도할 기회를 반복해서 만나는 것입니다.</p></div></section>`,
    "parenting-tools/index.html": `<section class="section"><div class="section-head"><h2>육아도구를 만든 이유</h2><p>육아도구는 부모가 정보를 읽고 끝내지 않고, 오늘 바로 체크하고 선택할 수 있도록 만든 실사용 도구입니다. 개월별 발달 체크리스트, 오늘의 놀이 추천, 장난감 선택 가이드, 어린이집 준비물, 외출 준비 체크리스트는 모두 부모가 자주 반복하는 판단을 조금 더 쉽게 만들기 위한 기능입니다.</p><p>결과를 절대적인 기준으로 보기보다 아이의 컨디션과 가족의 생활 리듬에 맞춰 조절해 주세요. 토이포포는 도구와 글을 함께 연결해 부모가 불필요한 검색을 줄이고 필요한 정보를 한곳에서 확인할 수 있도록 구성합니다.</p></div></section>`,
  };
  for (const [rel, block] of Object.entries(blocks)) {
    let html = read(rel);
    if (!html.includes(block.match(/<h2>(.*?)<\/h2>/)[1])) {
      html = html.replace(/(<section class="section"><div class="section-head"><h2>)/, `${block}\n    $1`);
    }
    write(rel, html);
  }
}

function patchMontessoriIndex() {
  const rel = "montessori/index.html";
  let html = read(rel);
  if (!html.includes("/montessori/everyday-life-play.html")) {
    html = html.replace(
      "</div></section>",
      `<a href="/montessori/everyday-life-play.html"><strong>몬테소리 일상생활 놀이</strong><span>물 따르기, 닦기, 옮기기처럼 집안일을 아이의 놀이로 바꾸는 방법입니다.</span></a></div></section>`
    );
  }
  write(rel, html);
}

function patchSitemap() {
  const rel = "sitemap.xml";
  let xml = read(rel);
  if (!xml.includes(`${SITE}/montessori/everyday-life-play.html`)) {
    xml = xml.replace(
      "</urlset>",
      `  <url><loc>${SITE}/montessori/everyday-life-play.html</loc><lastmod>${TODAY}</lastmod><priority>0.8</priority></url>\n</urlset>`
    );
  }
  write(rel, xml);
}

function patchFeeds() {
  for (const rel of ["rss.xml", "feed.xml"]) {
    let xml = read(rel);
    if (!xml.includes(`${SITE}/montessori/everyday-life-play.html`)) {
      const item = `    <item>
      <title>몬테소리 일상생활 놀이</title>
      <link>${SITE}/montessori/everyday-life-play.html</link>
      <guid>${SITE}/montessori/everyday-life-play.html</guid>
      <description>비싼 교구 없이 집에서 시작하는 몬테소리 일상생활 놀이 방법입니다.</description>
      <pubDate>Sat, 27 Jun 2026 00:00:00 +0900</pubDate>
    </item>\n`;
      xml = xml.replace("  </channel>", `${item}  </channel>`);
    }
    write(rel, xml);
  }
}

function main() {
  write("montessori/everyday-life-play.html", montessoriEverydayPage());
  patchModifiedDateAttributes();
  patchOlderBlogArticles();
  patchToolPagesDepth();
  patchCategoryIndexDepth();
  patchMontessoriIndex();
  patchSitemap();
  patchFeeds();
}

main();
