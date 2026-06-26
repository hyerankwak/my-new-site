const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const TODAY = "2026-06-26";
const PUB = "Fri, 26 Jun 2026 00:00:00 +0900";

const nav = [
  ["홈", "/"],
  ["상담소", "/counseling/"],
  ["부모 가이드", "/parent-guide/"],
  ["엄마표 자료실", "/worksheets/"],
  ["발달놀이", "/development-play/"],
  ["몬테소리", "/montessori/"],
  ["월령별 장난감", "/#months"],
  ["블로그", "/blog/"],
  ["문의", "/contact.html"],
];

const commonLinks = [
  ["/counseling/toy-in-mouth.html", "장난감을 계속 입에 넣는데 괜찮을까요?"],
  ["/parent-guide/toy-rotation-guide.html", "장난감 로테이션 하는 법"],
  ["/development-play/", "월령별 발달놀이 모음"],
  ["/montessori/prepared-environment.html", "준비된 환경 만들기"],
  ["/worksheets/elementary-reading-worksheet.html", "초등 독해 활동지"],
];

function ensureDir(dir) {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function filePath(url) {
  const clean = url.replace(/^\//, "");
  return path.join(ROOT, clean.endsWith("/") ? clean + "index.html" : clean);
}

function header(title, description, url, type = "article") {
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
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "토이포포", publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
      type === "article"
        ? { "@type": "Article", headline: title.replace(" | 토이포포", ""), description, author: { "@type": "Organization", name: "토이포포" }, publisher: { "@id": `${SITE}/#organization` }, mainEntityOfPage: `${SITE}${url}`, datePublished: TODAY, dateModified: TODAY, inLanguage: "ko-KR" }
        : { "@type": "CollectionPage", name: title, description, url: `${SITE}${url}`, isPartOf: { "@id": `${SITE}/#website` }, inLanguage: "ko-KR" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE },
        { "@type": "ListItem", position: 2, name: title.replace(" | 토이포포", ""), item: `${SITE}${url}` },
      ] }
    ]
  })}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>육아·놀이·교육 정보 허브</small></span></a>
    <nav class="nav" aria-label="주요 메뉴">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `  <footer class="site-footer">
    <div><strong>토이포포</strong><p>육아, 놀이, 교육, 부모 고민 해결을 위한 생활형 정보를 제공합니다. 의료·발달 진단을 대체하지 않으며, 필요한 경우 전문가 상담을 권합니다.</p></div>
    <nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function relatedHtml(currentUrl, pool, extra = []) {
  const links = [...extra, ...pool, ...commonLinks]
    .filter(([href]) => href !== currentUrl)
    .filter((item, index, arr) => arr.findIndex(([href]) => href === item[0]) === index)
    .slice(0, 6);
  return `<section><h2>함께 보면 좋은 글</h2><div class="related-grid">${links.map(([href, label]) => `<a href="${href}"><strong>${esc(label)}</strong><span>같은 고민을 이어서 정리한 토이포포 글입니다.</span></a>`).join("")}</div></section>`;
}

function faqHtml(topic, questions) {
  return `<section><h2>자주 묻는 질문</h2>${questions.slice(0, 5).map((q, i) => `<h3>${esc(q)}</h3><p>${faqAnswer(topic, i)}</p>`).join("")}</section>`;
}

function faqAnswer(topic, i) {
  const answers = [
    `${topic}은 아이마다 차이가 큽니다. 한두 번의 모습만으로 판단하기보다 며칠 동안 반복되는 패턴, 아이의 컨디션, 수면과 식사 흐름을 함께 보는 편이 좋습니다.`,
    `바로 교정하려 하기보다 위험 요소를 먼저 줄이고, 아이가 왜 그런 행동을 반복하는지 관찰해보세요. 발달 과정에서 자연스럽게 나타나는 행동인 경우도 많습니다.`,
    `집에서 해볼 수 있는 방법은 환경을 단순하게 만들고 같은 시간대에 짧게 반복하는 것입니다. 길게 설명하기보다 부모가 먼저 보여주고 기다리는 방식이 좋습니다.`,
    `걱정이 오래가거나 일상생활에 영향을 줄 정도라면 소아청소년과, 영유아검진, 발달 상담을 활용하는 것이 좋습니다. 인터넷 글은 참고 자료로만 사용하는 편이 안전합니다.`,
    `장난감이나 교구를 새로 사기 전에 집에 있는 물건으로 비슷한 경험을 만들어볼 수 있습니다. 아이가 실제로 흥미를 보이는지 확인한 뒤 필요한 것을 고르는 편이 낭비가 적습니다.`,
  ];
  return answers[i % answers.length];
}

function articleShell(item, categoryLabel, body, pool) {
  const title = `${item.title} | 토이포포`;
  const desc = item.description;
  return `${header(title, desc, item.url)}
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="${item.categoryUrl}">${categoryLabel}</a> / ${esc(item.title)}</p>
      <p class="eyebrow">${esc(categoryLabel)}</p>
      <h1>${esc(item.title)}</h1>
      ${body}
      ${relatedHtml(item.url, pool, item.related || [])}
    </article>
  </main>
${footer()}`;
}

function counselingBody(item) {
  const situation = item.situation || "부모가 자주 마주하는 생활 속 고민";
  const action = item.action || "아이의 행동을 관찰하고 환경을 조절하는 것";
  return `<p class="lead">${esc(item.description)} 이 글은 정답을 단정하기보다 부모가 집에서 먼저 확인할 부분과 전문가 상담이 필요한 신호를 나누어 정리했습니다.</p>
  <div class="summary-box"><strong>먼저 기억할 점</strong><ul><li>한 번의 행동보다 반복되는 패턴을 봅니다.</li><li>아이의 월령, 수면, 식사, 컨디션을 함께 살핍니다.</li><li>위험한 행동은 즉시 환경부터 정리합니다.</li></ul></div>
  <section><h2>왜 이런 고민이 생길까요?</h2><p>${esc(situation)}은 실제 육아에서 흔하게 마주치는 장면입니다. 아이는 말로 설명하기 전에 몸과 행동으로 먼저 표현합니다. 그래서 부모 눈에는 갑자기 문제가 생긴 것처럼 보이지만, 아이 입장에서는 세상을 탐색하거나 불편함을 표현하는 자연스러운 방식일 수 있습니다.</p><p>다만 모든 행동을 발달 과정이라고 넘기면 놓치는 부분도 있습니다. 같은 행동이 너무 강하게 반복되거나, 먹고 자는 흐름이 함께 무너지거나, 아이가 힘들어 보인다면 더 세심하게 봐야 합니다. 토이포포 상담소 글은 부모가 처음 확인할 기준을 잡는 데 초점을 둡니다.</p></section>
  <section><h2>집에서 먼저 확인할 것</h2><div class="quick-grid"><div><strong>반복 빈도</strong><span>하루 중 언제, 어떤 상황에서 자주 나타나는지 봅니다.</span></div><div><strong>아이 컨디션</strong><span>졸림, 배고픔, 낯선 환경, 과자극 여부를 함께 확인합니다.</span></div><div><strong>환경 요인</strong><span>장난감 수, 소음, 화면 노출, 부모 반응을 살펴봅니다.</span></div><div><strong>안전 문제</strong><span>삼킴, 낙상, 충돌 위험은 먼저 제거합니다.</span></div></div></section>
  <section><h2>부모가 바로 해볼 수 있는 방법</h2><p>${esc(action)}이 가장 현실적인 첫 단계입니다. 아이에게 긴 설명을 하기보다 부모가 먼저 행동을 보여주고, 아이가 따라올 시간을 주는 편이 좋습니다. 특히 영유아는 말보다 환경 변화에 더 잘 반응합니다.</p><p>예를 들어 장난감이 너무 많아 산만해 보인다면 한 번에 보이는 장난감을 줄여봅니다. 그림책을 싫어한다면 책을 읽게 하려고 애쓰기보다 아이가 좋아하는 그림 한 장에서 짧게 머물러봅니다. 낯가림이 심하다면 낯선 사람에게 바로 안기게 하기보다 부모 품에서 관찰할 시간을 줍니다.</p></section>
  <section><h2>하루 동안 관찰하는 방법</h2><p>이 고민을 해결하려고 바로 새로운 장난감이나 교육법을 찾기보다, 하루 정도는 기록하듯 관찰해보는 것이 도움이 됩니다. 언제 시작되는지, 누구와 있을 때 심해지는지, 배고픔이나 졸림과 연결되는지, 부모가 어떤 반응을 했을 때 더 길어지는지를 짧게 메모해보세요. 문제 행동처럼 보이던 모습이 사실은 피곤할 때만 나타나는 신호일 수도 있고, 반대로 특정 상황에서 계속 반복되는 패턴일 수도 있습니다.</p><p>관찰할 때 중요한 것은 아이를 평가하지 않는 태도입니다. “왜 또 이러지?”보다 “어떤 상황에서 이 행동이 나오는 걸까?”라고 바라보면 부모의 대응이 훨씬 차분해집니다. 아이에게 필요한 것은 완벽한 해결책보다 안정적인 어른의 반응인 경우가 많습니다.</p></section>
  <section><h2>주의해서 볼 신호</h2><ul class="check-list"><li>아이의 행동 때문에 식사, 수면, 외출이 계속 어려워지는 경우</li><li>부모가 환경을 조절해도 불안이나 거부가 점점 강해지는 경우</li><li>또래와 비교하기보다 이전의 아이 모습과 비교했을 때 급격한 변화가 있는 경우</li><li>삼킴, 낙상, 호흡, 안전과 관련된 위험이 반복되는 경우</li></ul></section>
  <section><h2>토이포포식 정리</h2><p>부모의 고민은 대부분 “내가 너무 예민한 걸까?”와 “그냥 둬도 되는 걸까?” 사이에 있습니다. ${esc(item.title)} 역시 단정적으로 답하기보다 아이의 전체 흐름을 보는 것이 중요합니다. 오늘 할 일은 큰 결론을 내리는 것이 아니라, 아이가 어떤 상황에서 편안해지고 어떤 상황에서 어려워지는지 조금 더 정확히 보는 것입니다.</p></section>
  ${faqHtml(item.title, item.faq)}`;
}

function guideBody(item) {
  return `<p class="lead">${esc(item.description)} 하루가 늘 계획대로 흘러가지는 않지만, 부모가 기준을 하나 갖고 있으면 아이도 어른도 덜 지칩니다.</p>
  <div class="summary-box"><strong>이 가이드의 핵심</strong><ul><li>완벽한 루틴보다 반복 가능한 흐름을 우선합니다.</li><li>아이의 컨디션에 따라 시간을 줄이고 늘립니다.</li><li>놀이, 식사, 수면, 정리를 한 덩어리로 봅니다.</li></ul></div>
  <section><h2>이 시기에 중요한 점</h2><p>${esc(item.focus)} 부모 가이드는 아이를 더 많이 가르치는 방법이 아니라, 일상 안에서 아이가 안정적으로 반복할 수 있는 구조를 만드는 데 목적이 있습니다. 같은 시간, 같은 순서, 비슷한 환경은 아이에게 예측 가능성을 줍니다.</p><p>아이마다 기질이 다르기 때문에 한 가지 방법이 모두에게 맞지는 않습니다. 활동적인 아이는 몸을 쓰는 놀이가 먼저 필요할 수 있고, 예민한 아이는 전환 시간을 넉넉히 주는 편이 좋습니다. 중요한 것은 부모가 아이를 관찰하며 조절하는 것입니다.</p></section>
  <section><h2>집에서 적용하는 방법</h2><ol class="check-list"><li>하루 중 가장 안정적인 시간대를 찾습니다.</li><li>처음에는 10분 안에 끝나는 작은 활동으로 시작합니다.</li><li>아이 반응이 좋으면 같은 활동을 며칠 반복합니다.</li><li>잘 되지 않은 날도 실패로 보지 않고 다음 날 다시 조절합니다.</li></ol></section>
  <section><h2>실제 예시</h2><div class="quick-grid"><div><strong>아침</strong><span>기상 후 씻기, 짧은 책 보기, 몸 쓰기 놀이</span></div><div><strong>낮</strong><span>식사와 낮잠 사이에 손 조작 또는 집콕 놀이</span></div><div><strong>저녁</strong><span>장난감 정리, 목욕, 조용한 그림책</span></div><div><strong>주말</strong><span>외출 전 준비물을 줄이고 동선을 단순화</span></div></div></section>
  <section><h2>부모가 놓치기 쉬운 부분</h2><p>가이드를 만들다 보면 부모가 스스로를 너무 몰아붙이기 쉽습니다. 하지만 육아 루틴은 매일 지키는 시간표가 아니라 흔들렸을 때 돌아올 수 있는 기준입니다. 아이가 아프거나 낮잠이 틀어진 날은 계획을 줄이는 것이 맞습니다.</p><p>또 하나 중요한 점은 장난감이나 자료가 많을수록 좋은 것이 아니라는 점입니다. 아이가 한 가지 활동에 충분히 머물 수 있게 선택지를 줄여주는 것이 오히려 집중에 도움이 됩니다.</p></section>
  <section><h2>실패하지 않게 시작하는 요령</h2><p>처음부터 모든 것을 바꾸려고 하면 부모도 아이도 금방 지칩니다. 오늘은 한 가지 시간대만 고르세요. 예를 들어 아침 준비가 힘들다면 아침 루틴만, 장난감 정리가 힘들다면 저녁 정리만 바꾸는 식입니다. 작은 변화가 며칠 유지되면 그다음 단계를 붙이는 편이 오래 갑니다.</p><p>아이에게도 예고가 필요합니다. “이제 정리하고 목욕하자”, “책 한 권 보고 불 끄자”처럼 같은 말을 반복하면 아이는 다음 상황을 예측하기 시작합니다. 예측할 수 있는 하루는 아이의 떼쓰기와 부모의 잔소리를 함께 줄여줍니다.</p></section>
  <section><h2>우리 집에 맞게 바꾸는 법</h2><p>다른 집에서 잘 되는 방법이 우리 집에 그대로 맞지 않을 수 있습니다. 아이의 낮잠 시간, 부모의 근무 시간, 형제자매 유무, 집 구조에 따라 같은 가이드도 다르게 적용해야 합니다. 그래서 이 글은 정답표가 아니라 조절 가능한 기준으로 보는 것이 좋습니다.</p><p>일주일 정도 적용해본 뒤 아이가 더 편안해졌는지, 부모의 부담이 줄었는지, 반복하기 쉬운지 확인해보세요. 세 가지 중 하나라도 좋아졌다면 그 방식은 우리 집에 어느 정도 맞는 방법입니다. 반대로 계속 힘들다면 활동을 줄이거나 시간대를 바꾸면 됩니다.</p></section>
  ${faqHtml(item.title, item.faq)}`;
}

function worksheetBody(item) {
  return `<p class="lead">${esc(item.description)} 단순히 PDF만 내려받는 페이지가 아니라, 부모가 아이에게 어떻게 설명하고 어떤 질문으로 확장할 수 있는지 함께 정리했습니다.</p>
  <div class="summary-box"><strong>활용 포인트</strong><ul><li>처음에는 정답보다 이야기를 나누는 시간을 우선합니다.</li><li>초등 저학년은 그림, 말하기, 짧은 쓰기를 섞어 진행합니다.</li><li>자료는 한 번에 끝내기보다 10~15분씩 나누어 사용합니다.</li></ul></div>
  <section><h2>주제 설명</h2><p>${esc(item.topicText)} 이 주제는 아이가 역사, 언어, 독해를 부담 없이 접하기 좋습니다. 부모가 먼저 배경을 짧게 이야기해주면 아이는 낯선 단어를 외우기보다 상황으로 이해할 수 있습니다.</p></section>
  <section><h2>부모 활용법</h2><p>자료를 시작하기 전 “오늘은 무엇을 외울까?”보다 “이 사람은 어떤 선택을 했을까?”, “이 시대 사람들은 왜 그렇게 살았을까?”처럼 이야기형 질문을 던져보세요. 아이가 짧게라도 자기 말로 답하면 그 답을 바탕으로 활동지를 이어갑니다.</p><p>쓰기 활동을 싫어하는 아이는 말로 먼저 답하게 하고, 부모가 한 문장을 받아 적어준 뒤 아이가 중요한 단어만 써도 됩니다. 학습 자료는 아이의 자신감을 꺾지 않는 방식으로 사용하는 것이 오래 갑니다.</p></section>
  <section><h2>아이에게 설명하는 방법</h2><p>${esc(item.childText)} 어려운 용어는 한 번에 많이 설명하지 말고, 아이가 아는 생활 장면과 연결해 주세요. 예를 들어 왕, 나라, 전쟁, 약속, 지혜 같은 단어를 가족, 학교, 친구 관계에 빗대어 설명하면 이해가 쉬워집니다.</p></section>
  <section><h2>퀴즈 또는 활동 예시</h2><div class="quick-grid"><div><strong>생각 질문</strong><span>${esc(item.quiz1)}</span></div><div><strong>짧은 쓰기</strong><span>${esc(item.quiz2)}</span></div><div><strong>그림 활동</strong><span>오늘 배운 장면을 한 컷으로 그려봅니다.</span></div><div><strong>말하기</strong><span>가장 기억에 남는 단어를 하나 고르고 이유를 말합니다.</span></div></div></section>
  <section><h2>수업처럼 보이지 않게 진행하는 팁</h2><p>엄마표 자료는 학교 숙제처럼 시작하면 아이가 금방 부담을 느낄 수 있습니다. 먼저 짧은 이야기를 들려주고, 아이가 궁금해하는 단어를 하나 골라 대화한 뒤 활동지로 넘어가세요. 특히 역사나 어휘 자료는 배경을 모르면 단순 암기가 되기 쉽습니다. 부모가 한두 문장으로 맥락을 만들어주면 아이가 훨씬 편하게 받아들입니다.</p><p>정답을 모두 채우는 것보다 아이가 자기 말로 설명하는 경험이 더 중요합니다. 한 문제를 깊게 이야기하고 끝내도 괜찮습니다. 자료를 다 끝내지 못했다면 다음 날 이어서 해도 됩니다. 엄마표 자료실의 목표는 진도보다 아이가 “나도 생각해서 말할 수 있다”는 감각을 얻는 데 있습니다.</p></section>
  <section><h2>확장 활동 아이디어</h2><p>활동지를 풀고 끝내기보다 말하기, 그림, 짧은 글쓰기로 한 번 더 확장하면 자료의 활용도가 높아집니다. 아이가 기억한 단어를 포스트잇에 쓰고 냉장고에 붙이거나, 오늘 배운 인물과 관련된 장면을 가족에게 설명하게 해보세요. 이런 활동은 부담스럽지 않으면서도 복습 효과가 있습니다.</p><p>초등 저학년이라면 부모가 질문을 읽어주고 아이가 말로 답한 뒤 핵심 단어만 쓰게 해도 충분합니다. 고학년이라면 답을 쓴 뒤 “왜 그렇게 생각했는지” 한 문장을 더 붙여보게 하세요. 같은 자료라도 아이 수준에 맞춰 난이도를 조절할 수 있습니다.</p></section>
  <section id="download"><h2>PDF 다운로드</h2><p>현재 자료실은 애드센스 승인 전 정보성 콘텐츠를 우선 보강하는 단계입니다. PDF 파일은 순차적으로 연결할 예정이며, 아래 버튼은 자료 위치를 표시하는 준비 링크입니다.</p><p><a class="button primary" href="#" aria-disabled="true">PDF 다운로드 준비 중</a></p></section>
  ${faqHtml(item.title, item.faq)}`;
}

function developmentBody(item) {
  return `<p class="lead">${esc(item.description)} 이 글은 발달을 앞당기는 훈련이 아니라, 아이가 지금 할 수 있는 움직임과 탐색을 안전하게 반복하도록 돕는 집 놀이를 정리했습니다.</p>
  <div class="summary-box"><strong>핵심 정리</strong><ul><li>아이의 현재 움직임을 기준으로 놀이를 고릅니다.</li><li>한 번에 오래보다 짧게 여러 번 반복합니다.</li><li>발달 차이는 크므로 비교보다 관찰을 우선합니다.</li></ul></div>
  <section><h2>${esc(item.age)} 발달 포인트</h2><p>${esc(item.point)} 이 시기에는 눈에 보이는 결과보다 아이가 시도하는 과정이 중요합니다. 손을 뻗고, 몸을 돌리고, 소리를 따라 하고, 같은 놀이를 반복하는 과정에서 아이는 자기 몸과 주변 세계를 배워갑니다.</p></section>
  <section><h2>집에서 해볼 놀이</h2>${item.plays.map((p) => `<div class="play-card"><h3>${esc(p)}</h3><div class="mini-summary"><strong>핵심:</strong> ${esc(item.playCore)}</div><p><strong>준비물</strong>: 집에 있는 안전한 생활 물건, 매트, 큰 장난감</p><p><strong>놀이 방법</strong>: 부모가 먼저 천천히 보여주고 아이가 따라오기를 기다립니다. 아이가 다른 방식으로 탐색해도 바로 고치지 말고, 위험하지 않다면 그 흐름을 따라가 주세요.</p><p><strong>발달에 도움이 되는 이유</strong>: 이 놀이는 몸 조절, 손 사용, 시선 집중, 부모와의 상호작용을 자연스럽게 연결합니다.</p><p><strong>주의할 점</strong>: 작은 부품, 긴 끈, 깨지는 물건은 피하고 아이가 피곤해하면 바로 멈춥니다.</p></div>`).join("")}</section>
  ${faqHtml(item.title, item.faq)}`;
}

function montessoriBody(item) {
  return `<p class="lead">${esc(item.description)} 몬테소리는 특정 브랜드 교구를 사는 일이 아니라, 아이가 스스로 선택하고 반복할 수 있는 환경을 만들어주는 관점에 가깝습니다.</p>
  <div class="summary-box"><strong>먼저 알면 좋은 점</strong><ul><li>비싼 교구보다 준비된 환경이 먼저입니다.</li><li>아이의 손이 닿는 곳에 적은 물건을 정돈합니다.</li><li>부모는 많이 설명하기보다 관찰하고 기다립니다.</li></ul></div>
  <section><h2>왜 중요한가요?</h2><p>${esc(item.why)} 아이는 어른의 설명보다 직접 만지고 움직이며 더 많이 배웁니다. 몬테소리식 접근은 아이가 스스로 해볼 수 있는 기회를 생활 안에 배치하는 데 도움이 됩니다.</p></section>
  <section><h2>집에서 시작하는 방법</h2><ol class="check-list"><li>한 공간에 장난감 5~6개만 보이게 둡니다.</li><li>아이가 직접 꺼내고 넣을 수 있는 낮은 바구니를 사용합니다.</li><li>부모가 먼저 한 번 보여주고 아이의 방식을 기다립니다.</li><li>잘 되지 않아도 바로 고치지 않고 반복할 시간을 줍니다.</li></ol></section>
  <section><h2>부모가 주의할 점</h2><p>몬테소리를 완벽한 규칙처럼 적용하려고 하면 오히려 부모가 지칩니다. 집에서는 아이와 부모가 편하게 유지할 수 있는 정도가 가장 좋습니다. 정돈된 환경, 반복 가능한 활동, 아이의 선택을 존중하는 태도만으로도 충분히 시작할 수 있습니다.</p></section>
  <section><h2>생활 속 적용 예시</h2><p>아침에는 아이가 자주 쓰는 컵과 수건을 낮은 곳에 두고, 놀이 시간에는 바구니 하나에 같은 목적의 물건만 담아둡니다. 저녁에는 장난감을 모두 꺼내두기보다 내일 다시 볼 몇 가지만 남겨둡니다. 이런 작은 정돈이 아이에게는 “내가 꺼낼 수 있고, 다시 놓을 수 있다”는 경험이 됩니다.</p><p>부모가 할 일은 아이를 계속 가르치는 것이 아니라 환경을 조금씩 손보는 것입니다. 아이가 한 물건에 오래 머문다면 그 시간을 방해하지 않고 기다립니다. 반복이 지루해 보여도 아이에게는 숙달의 과정일 수 있습니다. 몬테소리의 힘은 특별한 교구보다 이런 일상적인 반복에서 더 분명하게 나타납니다.</p></section>
  <section><h2>처음 시작할 때 흔한 오해</h2><p>몬테소리를 시작한다고 해서 집을 모두 원목 교구로 채울 필요는 없습니다. 오히려 아이가 실제로 쓰는 물건, 안전하게 만질 수 있는 생활 도구, 부모가 꾸준히 유지할 수 있는 정리 방식이 더 중요합니다. 사진처럼 완벽한 공간보다 매일 다시 돌아올 수 있는 단순한 공간이 아이에게 더 도움이 됩니다.</p></section>
  <section><h2>연령별로 다르게 보는 법</h2><p>영아에게는 감각 탐색과 손으로 조작하는 경험이 먼저입니다. 천, 컵, 공, 바구니처럼 단순한 물건을 만지고 반복하는 시간이 좋습니다. 돌 이후에는 생활 모방이 늘어나기 때문에 숟가락, 작은 수건, 낮은 선반처럼 실제 생활을 닮은 활동이 잘 맞습니다.</p><p>유아가 되면 스스로 고르고 마무리하는 경험이 더 중요해집니다. 색깔이나 모양을 맞추는 활동, 간단한 분류, 식물 돌보기, 책 정리처럼 아이가 결과를 볼 수 있는 활동을 넣어보세요. 핵심은 아이의 나이에 맞게 활동을 작게 쪼개고, 성공할 수 있는 환경을 준비하는 것입니다.</p></section>
  <section><h2>부모가 지치지 않게 유지하는 기준</h2><p>몬테소리 환경은 부모가 매일 유지할 수 있어야 의미가 있습니다. 정리 시간이 너무 오래 걸리거나, 아이가 만지면 안 되는 물건이 많아 계속 말려야 한다면 오래가기 어렵습니다. 처음에는 작은 바구니 하나, 낮은 선반 한 칸, 책 몇 권 정도로 시작해도 충분합니다.</p></section>
  ${faqHtml(item.title, item.faq)}`;
}

const counseling = [
  ["toy-in-mouth", "장난감을 계속 입에 넣는데 괜찮을까요?", "입으로 탐색하는 시기와 위험 신호, 장난감 위생 관리 기준을 정리했습니다.", "영유아는 손보다 입으로 먼저 물건을 확인하는 시기가 있습니다", "입에 넣어도 안전한 물건과 치워야 할 물건을 나누는 것"],
  ["no-crawling-7-month", "7개월인데 배밀이를 안 해요", "7개월 아기 배밀이 개인차와 집에서 도울 수 있는 놀이를 정리했습니다.", "배밀이와 기기는 아이마다 시작 시기가 다릅니다", "엎드려 노는 시간을 짧게 자주 만들어주는 것"],
  ["too-many-toys", "장난감이 너무 많으면 안 좋을까요?", "장난감이 많을 때 집중이 짧아지는 이유와 정리 기준을 안내합니다.", "선택지가 너무 많으면 아이가 한 가지 놀이에 머물기 어려울 수 있습니다", "한 번에 보이는 장난감 수를 줄이고 로테이션하는 것"],
  ["need-montessori-toys", "몬테소리 장난감 꼭 필요할까요?", "몬테소리 장난감 구매 전 부모가 먼저 알아야 할 기준을 정리했습니다.", "몬테소리는 교구보다 환경과 관찰에서 시작됩니다", "생활 물건으로 비슷한 경험을 먼저 만들어보는 것"],
  ["first-birthday-gift-budget", "돌 선물 얼마가 적당할까요?", "돌 선물 예산을 정할 때 관계, 실용성, 사용 기간을 함께 보는 방법입니다.", "첫돌 선물은 가격보다 실제 사용 기간과 부모 부담이 중요합니다", "관계와 예산을 정한 뒤 오래 쓰는 품목을 고르는 것"],
  ["lego-start-age", "레고는 몇 살부터 가능한가요?", "레고 시작 연령과 듀플로, 클래식, 작은 부품 안전 기준을 정리했습니다.", "레고는 부품 크기와 아이의 손 조작 능력을 함께 봐야 합니다", "연령 표시와 삼킴 위험을 먼저 확인하는 것"],
  ["doesnt-like-books", "그림책을 안 좋아해요", "그림책을 거부하는 아이에게 부모가 해볼 수 있는 접근법입니다.", "책을 싫어하는 것처럼 보여도 방식이 맞지 않을 수 있습니다", "읽어주기보다 그림 한 장에서 짧게 머무는 것"],
  ["stranger-anxiety", "낯가림이 심해요", "낯가림이 심한 아이를 억지로 적응시키지 않는 방법을 정리했습니다.", "낯가림은 익숙한 사람과 낯선 사람을 구분하는 발달 신호일 수 있습니다", "부모 품에서 관찰할 시간을 충분히 주는 것"],
  ["screen-time-baby", "TV를 보여줘도 될까요?", "영유아 화면 노출을 고민하는 부모를 위한 현실적인 기준입니다.", "화면은 부모에게 잠깐의 숨을 주지만 아이에게는 강한 자극일 수 있습니다", "시간, 상황, 대체 놀이를 함께 정하는 것"],
  ["short-independent-play", "혼자 노는 시간이 너무 짧아요", "혼자 놀이 시간이 짧은 아이에게 필요한 환경과 부모 반응을 정리했습니다.", "혼자 놀이는 타고나는 기질과 환경의 영향을 함께 받습니다", "부모가 바로 개입하지 않고 가까이에서 기다리는 것"],
  ["throws-toys", "장난감을 자꾸 던져요", "던지기 행동을 안전한 놀이로 바꾸는 방법을 안내합니다.", "던지기는 원인과 결과를 확인하는 탐색 행동일 수 있습니다", "던져도 되는 물건과 안 되는 물건을 나누는 것"],
  ["hits-parent", "아기가 엄마를 때려요", "때리는 행동을 혼내기 전에 살펴볼 발달적 이유와 대응법입니다.", "말보다 몸으로 표현하는 시기에는 치는 행동이 나타날 수 있습니다", "손을 부드럽게 막고 대체 표현을 보여주는 것"],
  ["doesnt-share-toys", "장난감을 나눠주지 않아요", "소유 개념이 생기는 시기의 장난감 나누기 고민을 정리했습니다.", "나누기는 사회성 이전에 소유감과 안정감이 필요합니다", "억지로 빼앗기보다 차례를 짧게 경험시키는 것"],
  ["toy-battery-noise", "소리나는 장난감이 너무 많아도 괜찮을까요?", "전자 장난감과 조용한 놀이의 균형을 잡는 방법입니다.", "강한 소리와 빛은 아이의 흥미를 끌지만 깊은 탐색을 줄일 수 있습니다", "소리 장난감 시간을 정하고 조용한 장난감을 섞는 것"],
  ["not-interested-in-toys", "장난감에 관심이 없어요", "장난감보다 생활 물건을 좋아하는 아이에게 맞는 놀이법입니다.", "아이에게는 장난감보다 실제 생활 물건이 더 흥미로울 수 있습니다", "안전한 생활 물건을 놀이 재료로 바꾸는 것"],
  ["same-toy-repeat", "같은 장난감만 계속 가지고 놀아요", "반복 놀이를 어떻게 봐야 하는지 부모 관점으로 정리했습니다.", "반복은 지루함이 아니라 숙달 과정일 수 있습니다", "좋아하는 놀이를 확장해주는 것"],
  ["play-after-daycare", "어린이집 다녀오면 어떻게 놀아줘야 할까요?", "하원 후 지친 아이와 부모가 무리 없이 노는 방법입니다.", "하원 후 아이는 새 자극보다 안정이 먼저 필요할 수 있습니다", "조용한 놀이와 몸 놀이를 아이 상태에 맞게 고르는 것"],
  ["toy-cleaning", "아기 장난감 세척은 얼마나 자주 해야 하나요?", "장난감 재질별 세척 주기와 위생 기준을 정리했습니다.", "입에 넣는 장난감과 바닥 장난감은 관리 기준이 다릅니다", "재질별로 세척 방법을 나누는 것"],
  ["bites-books", "그림책을 자꾸 물어뜯어요", "책을 물어뜯는 아이에게 보드북과 읽기 환경을 조절하는 법입니다.", "입 탐색 시기에는 책도 장난감처럼 탐색 대상이 됩니다", "튼튼한 책을 주고 읽기 시간을 짧게 잡는 것"],
  ["no-interest-montessori", "몬테소리 교구에 관심이 없어요", "교구보다 아이 흥미를 먼저 보는 몬테소리 접근법입니다.", "교구가 좋아도 아이의 현재 관심과 맞지 않으면 오래 놀지 않을 수 있습니다", "교구 목적보다 아이가 실제로 하는 행동을 관찰하는 것"],
].map(([slug, title, description, situation, action]) => ({
  slug, title, description, situation, action,
  url: `/counseling/${slug}.html`,
  categoryUrl: "/counseling/",
  faq: ["이 행동은 정상인가요?", "언제까지 지켜봐도 되나요?", "집에서 어떻게 도와주면 좋을까요?", "전문가 상담은 언제 필요할까요?", "장난감을 새로 사야 할까요?"],
}));

const guides = [
  ["7-month-daily-routine", "7개월 아기 하루 일과 예시", "수유, 낮잠, 발달놀이를 무리 없이 연결하는 7개월 하루 흐름입니다.", "7개월에는 깨어 있는 시간이 길어지고 짧은 놀이 반복이 중요합니다."],
  ["8-month-daily-routine", "8개월 아기 하루 일과 예시", "기기 전후의 탐색 욕구를 고려한 8개월 하루 일과입니다.", "8개월에는 이동 욕구와 손 조작 놀이가 함께 늘어납니다."],
  ["10-month-play-guide", "10개월 아기 놀아주는 방법", "잡고 서기와 넣고 빼기를 좋아하는 10개월 아기를 위한 놀이법입니다.", "10개월에는 몸을 세우고 손으로 결과를 만드는 놀이가 잘 맞습니다."],
  ["two-year-focus-play", "두돌 아이 집중력 놀이", "두돌 아이가 짧게라도 몰입할 수 있는 놀이 환경과 활동입니다.", "두돌에는 긴 집중보다 짧은 몰입을 반복하는 것이 현실적입니다."],
  ["rainy-day-home-play", "비오는 날 집콕 놀이", "비 오는 날 집에서 에너지를 풀고 차분히 마무리하는 놀이 흐름입니다.", "집콕 날에는 몸 놀이와 조용한 놀이를 번갈아 배치하면 좋습니다."],
  ["toy-organization-method", "장난감 정리 방법", "아이도 부모도 덜 지치는 장난감 정리 기준입니다.", "정리는 수납장이 아니라 보이는 장난감 수를 줄이는 데서 시작합니다."],
  ["toy-rotation-guide", "장난감 로테이션 하는 법", "장난감을 줄이지 않고도 새롭게 느끼게 하는 순환 정리법입니다.", "로테이션은 아이의 집중과 부모의 정리 부담을 함께 줄입니다."],
  ["how-to-read-picture-books", "그림책 읽어주는 방법", "그림책을 끝까지 읽지 않아도 되는 현실적인 읽기 방법입니다.", "영유아 그림책은 완독보다 함께 보는 경험이 중요합니다."],
  ["outing-checklist", "외출 준비 체크리스트", "아이와 외출할 때 꼭 챙길 것과 줄여도 되는 것을 정리했습니다.", "외출 준비는 물건을 많이 챙기는 것보다 상황별 우선순위가 중요합니다."],
  ["playroom-environment", "아이방 놀이 환경 만들기", "아이 스스로 꺼내고 정리하기 쉬운 놀이 공간 기준입니다.", "아이방은 예쁜 인테리어보다 안전과 독립성이 먼저입니다."],
  ["morning-routine", "아이 아침 루틴 만드는 법", "등원 전 울고 지치는 시간을 줄이는 아침 루틴입니다.", "아침은 설명보다 순서가 보이는 환경이 도움이 됩니다."],
  ["bedtime-routine", "잠자리 루틴 만드는 법", "잠들기 전 과자극을 줄이고 안정감을 주는 저녁 흐름입니다.", "잠자리 루틴은 매일 같은 신호를 반복하는 것이 핵심입니다."],
  ["meal-time-play", "식사 전후 놀이 방법", "식사 시간을 방해하지 않으면서 손과 감각을 쓰는 놀이입니다.", "식사 전후에는 강한 자극보다 짧고 정돈된 활동이 좋습니다."],
  ["sibling-play", "형제자매 함께 노는 방법", "나이 차이가 있는 아이들이 안전하게 함께 노는 방법입니다.", "함께 놀이는 같은 장난감보다 각자 역할이 있을 때 편합니다."],
  ["car-trip-play", "차 안에서 하는 놀이", "장거리 이동 중 화면 없이 해볼 수 있는 말놀이와 관찰놀이입니다.", "차 안 놀이는 준비물이 적고 반복 가능한 것이 좋습니다."],
  ["sensory-play-home", "집에서 하는 촉감놀이", "밀가루 없이도 안전하게 시작하는 촉감놀이 기준입니다.", "촉감놀이는 재료보다 아이의 수용 정도를 먼저 봐야 합니다."],
  ["parent-burnout-play", "부모가 지쳤을 때 가능한 놀이", "부모 에너지가 낮은 날에도 가능한 현실적인 놀이입니다.", "부모가 지친 날은 앉아서 하는 짧은 놀이가 필요합니다."],
  ["grandparent-play-guide", "조부모와 함께하는 놀이 가이드", "조부모가 아이와 안전하게 놀아줄 때 필요한 기준입니다.", "세대가 다른 양육자에게는 간단한 원칙 공유가 중요합니다."],
  ["weekend-play-plan", "주말 놀이 계획 세우는 법", "외출과 집놀이를 무리 없이 섞는 주말 놀이 계획입니다.", "주말은 큰 일정 하나와 쉬는 시간을 함께 넣어야 덜 지칩니다."],
  ["no-toy-play", "장난감 없이 노는 방법", "집에 있는 생활 물건과 몸으로 하는 놀이 아이디어입니다.", "장난감이 없어도 아이는 사람, 공간, 소리로 충분히 놉니다."],
].map(([slug, title, description, focus]) => ({
  slug, title, description, focus,
  url: `/parent-guide/${slug}.html`,
  categoryUrl: "/parent-guide/",
  faq: ["매일 해야 하나요?", "아이가 싫어하면 어떻게 하나요?", "준비물이 꼭 필요한가요?", "몇 분 정도 하면 좋나요?", "형제자매가 있어도 가능한가요?"],
}));

const worksheets = [
  ["goguryeo-worksheet", "고구려 워크지", "초등 아이와 고구려를 이야기와 퀴즈로 익히는 엄마표 자료입니다.", "고구려는 넓은 영토와 씩씩한 기상으로 기억되는 나라입니다.", "고구려는 옛날 한반도 북쪽과 만주 지역에서 힘을 키운 나라라고 설명해 주세요.", "고구려가 강한 나라가 될 수 있었던 이유는 무엇일까요?", "광개토대왕에게 한 문장을 써본다면?"],
  ["baekje-worksheet", "백제 워크지", "백제의 문화와 교류를 아이 눈높이로 정리한 엄마표 자료입니다.", "백제는 아름다운 문화와 바다를 통한 교류가 돋보이는 나라입니다.", "백제는 다른 나라와 물건과 문화를 주고받은 나라라고 설명해 주세요.", "백제 사람들이 다른 나라와 교류하며 얻은 것은 무엇일까요?", "백제 문화재를 소개하는 문장을 써보세요."],
  ["silla-worksheet", "신라 워크지", "신라와 통일 신라를 쉽게 이해하는 초등 한국사 활동지입니다.", "신라는 삼국을 통일한 역사로 자주 등장하는 나라입니다.", "신라는 오랜 시간 힘을 기르고 결국 삼국을 통일한 나라라고 말해 주세요.", "신라가 삼국을 통일하며 달라진 점은 무엇일까요?", "화랑에게 필요한 마음가짐을 써보세요."],
  ["king-sejong-worksheet", "세종대왕 워크지", "세종대왕과 한글 창제를 아이와 함께 생각해보는 자료입니다.", "세종대왕은 백성을 생각해 한글을 만든 왕으로 알려져 있습니다.", "세종대왕은 사람들이 쉽게 읽고 쓰도록 한글을 만든 왕이라고 설명해 주세요.", "한글이 생겨서 사람들의 생활은 어떻게 달라졌을까요?", "세종대왕에게 감사 편지를 써보세요."],
  ["yi-sun-sin-worksheet", "이순신 워크지", "이순신 장군의 용기와 책임감을 다루는 초등 활동지입니다.", "이순신 장군은 어려운 상황에서도 나라를 지키기 위해 노력한 인물입니다.", "이순신 장군은 포기하지 않고 바다에서 나라를 지킨 사람이라고 설명해 주세요.", "이순신 장군이 끝까지 포기하지 않은 이유는 무엇일까요?", "내가 용기를 낸 경험을 써보세요."],
  ["proverb-worksheet", "속담 워크지", "초등 문해력에 도움이 되는 쉬운 속담 활동지입니다.", "속담은 옛사람들의 지혜가 짧은 문장에 담긴 말입니다.", "속담은 긴 이야기를 짧고 재미있는 말로 표현한 것이라고 설명해 주세요.", "가는 말이 고와야 오는 말이 곱다는 무슨 뜻일까요?", "오늘 배운 속담으로 짧은 이야기를 만들어보세요."],
  ["four-character-idiom-worksheet", "사자성어 워크지", "사자성어를 뜻과 상황으로 익히는 초등 어휘 자료입니다.", "사자성어는 네 글자로 된 표현 안에 뜻과 이야기가 담긴 말입니다.", "사자성어는 네 글자 힌트처럼 상황을 표현하는 말이라고 설명해 주세요.", "일석이조는 어떤 상황에서 쓸 수 있을까요?", "내 하루를 사자성어 하나로 표현해보세요."],
  ["elementary-reading-worksheet", "초등 독해 활동지", "짧은 글을 읽고 핵심을 찾는 초등 독해 엄마표 자료입니다.", "독해는 글을 빨리 읽는 것이 아니라 중요한 내용을 찾아 이해하는 힘입니다.", "독해는 글 속에서 중심 생각을 찾는 활동이라고 설명해 주세요.", "글에서 가장 중요한 문장은 무엇이었나요?", "읽은 내용을 세 문장으로 줄여보세요."],
].map(([slug, title, description, topicText, childText, quiz1, quiz2]) => ({
  slug, title, description, topicText, childText, quiz1, quiz2,
  url: `/worksheets/${slug}.html`,
  categoryUrl: "/worksheets/",
  faq: ["몇 학년부터 사용할 수 있나요?", "PDF만 풀리면 되나요?", "아이가 쓰기를 싫어하면 어떻게 하나요?", "하루에 얼마나 하면 좋나요?", "정답을 꼭 맞혀야 하나요?"],
}));

const development = [{
  slug: "6-month-baby-development-play",
  title: "6개월 아기 발달놀이, 집에서 쉽게 하는 방법",
  age: "6개월",
  description: "6개월 아기 발달놀이를 뒤집기, 앉기 준비, 손 뻗기, 촉감 탐색 중심으로 정리했습니다.",
  point: "6개월에는 뒤집기 이후 몸을 돌리고 손을 뻗어 물건을 잡으려는 시도가 늘어납니다.",
  playCore: "몸을 돌리고 손을 뻗는 경험을 안전하게 반복합니다.",
  plays: ["엎드려 장난감 보기", "거울 보며 표정 따라 하기", "부드러운 천 촉감놀이", "딸랑이 방향 찾기", "공 굴려 시선 따라가기", "그림책 한 장 보기"],
  url: "/blog/6-month-baby-development-play.html",
  categoryUrl: "/development-play/",
  faq: ["6개월에 꼭 앉아야 하나요?", "터미타임을 싫어하면 어떻게 하나요?", "하루 몇 분 놀아주면 좋나요?", "장난감을 입에 넣어도 되나요?", "발달놀이를 많이 하면 빨라지나요?"],
}];

const existingDevelopmentLinks = [
  ["/blog/6-month-baby-development-play.html", "6개월 아기 발달놀이"],
  ["/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이"],
  ["/blog/8-month-baby-development-play.html", "8개월 아기 발달놀이"],
  ["/blog/9-month-baby-development-play.html", "9개월 아기 발달놀이"],
  ["/blog/10-month-baby-development-play.html", "10개월 아기 발달놀이"],
  ["/blog/11-month-baby-development-play.html", "11개월 아기 발달놀이"],
  ["/blog/12-month-baby-development-play.html", "12개월 돌 아기 발달놀이"],
];

const montessori = [
  ["what-is-montessori", "몬테소리란?", "몬테소리 교육을 집에서 오해 없이 시작하기 위한 기본 개념입니다.", "몬테소리는 아이를 조용히 앉혀두는 방식이 아니라 스스로 배우는 힘을 존중하는 관점입니다."],
  ["treasure-basket-play", "보물바구니 놀이", "영유아가 생활 물건을 안전하게 탐색하는 보물바구니 놀이 방법입니다.", "보물바구니는 아이가 물건의 촉감, 무게, 소리, 모양을 직접 비교하게 해줍니다."],
  ["toy-rotation", "장난감 로테이션", "몬테소리 관점에서 장난감을 적게 보이게 하고 깊게 놀게 하는 방법입니다.", "로테이션은 장난감을 숨기는 것이 아니라 아이가 다시 발견하게 만드는 환경 정리입니다."],
  ["prepared-environment", "준비된 환경 만들기", "아이 스스로 꺼내고 정리할 수 있는 몬테소리식 환경 만들기입니다.", "준비된 환경은 아이 키, 손이 닿는 위치, 안전한 동선을 고려한 공간입니다."],
  ["montessori-home-play", "집에서 하는 몬테소리 놀이", "비싼 교구 없이 집에서 바로 시작하는 몬테소리 놀이 예시입니다.", "집에서 하는 몬테소리는 생활 물건을 아이가 직접 만지고 반복하는 데서 시작합니다."],
].map(([slug, title, description, why]) => ({
  slug, title, description, why,
  url: `/montessori/${slug}.html`,
  categoryUrl: "/montessori/",
  faq: ["교구를 꼭 사야 하나요?", "몇 개월부터 가능한가요?", "집이 좁아도 가능한가요?", "아이가 관심 없어 하면 어떻게 하나요?", "부모가 꼭 옆에 있어야 하나요?"],
}));

const allArticles = [
  ...counseling.map((i) => ({ ...i, group: "상담소" })),
  ...guides.map((i) => ({ ...i, group: "부모 가이드" })),
  ...worksheets.map((i) => ({ ...i, group: "엄마표 자료실" })),
  ...development.map((i) => ({ ...i, group: "발달놀이" })),
  ...montessori.map((i) => ({ ...i, group: "몬테소리" })),
];

const pools = {
  counseling: counseling.map((i) => [i.url, i.title]),
  guides: guides.map((i) => [i.url, i.title]),
  worksheets: worksheets.map((i) => [i.url, i.title]),
  development: existingDevelopmentLinks,
  montessori: montessori.map((i) => [i.url, i.title]),
};

function writeArticle(item, html) {
  const out = filePath(item.url);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, "utf8");
}

function collectionPage(url, title, description, groups) {
  const cards = groups.map((section) => `<section class="section"><div class="section-head"><h2>${esc(section.title)}</h2><p>${esc(section.desc)}</p></div><div class="link-grid">${section.links.map(([href, label, desc]) => `<a href="${href}"><strong>${esc(label)}</strong><span>${esc(desc || "부모가 바로 참고할 수 있는 생활형 정보입니다.")}</span></a>`).join("")}</div></section>`).join("\n");
  return `${header(`${title} | 토이포포`, description, url, "website")}
  <main>
    <section class="hero compact"><p class="eyebrow">ToyPoppo Hub</p><h1>${esc(title)}</h1><p>${esc(description)}</p></section>
    ${cards}
  </main>
${footer()}`;
}

function buildIndex() {
  const recent = [
    ["/blog/12-month-baby-development-play.html", "12개월 돌 아기 발달놀이", "걷기 준비와 생활 모방 놀이"],
    ["/blog/11-month-baby-development-play.html", "11개월 아기 발달놀이", "잡고 서기와 주세요 놀이"],
    ["/blog/10-month-baby-development-play.html", "10개월 아기 발달놀이", "넣고 빼기와 잡고 서기"],
    ...counseling.slice(0, 3).map((i) => [i.url, i.title, i.description]),
    ...guides.slice(0, 2).map((i) => [i.url, i.title, i.description]),
    ...worksheets.slice(0, 2).map((i) => [i.url, i.title, i.description]),
  ];
  return `${header("토이포포 | 육아 놀이 교육 정보 허브", "토이포포는 육아 고민 상담소, 부모 가이드, 엄마표 자료실, 발달놀이, 몬테소리 정보를 제공하는 육아 정보 허브입니다.", "/", "website")}
  <main>
    <section class="hero"><p class="eyebrow">ToyPoppo Parenting Hub</p><h1>육아 고민부터 발달놀이와 엄마표 교육까지, 한곳에서 정리해요</h1><p>토이포포는 장난감 추천을 넘어 아이의 발달, 놀이 환경, 부모 고민, 엄마표 자료를 함께 다루는 육아·놀이·교육 정보 허브입니다. 광고보다 정보, 상품보다 실제 생활에 도움이 되는 기준을 먼저 정리합니다.</p><div class="hero-actions"><a class="button primary" href="/counseling/">상담소 보기</a><a class="button secondary" href="/development-play/">발달놀이 보기</a></div></section>
    <section class="section"><div class="section-head"><h2>최근 업데이트</h2><p>새로 정리한 육아 정보와 자료를 모았습니다.</p></div><div class="link-grid">${recent.map(([href, label, desc]) => `<a href="${href}"><strong>${esc(label)}</strong><span>${esc(desc)}</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>인기 상담소</h2><p>부모가 실제로 검색하는 질문을 기준으로 정리했습니다.</p></div><div class="link-grid">${counseling.slice(0, 10).map((i) => `<a href="${i.url}"><strong>${esc(i.title)}</strong><span>${esc(i.description)}</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>부모 가이드</h2><p>하루 일과, 놀이 환경, 정리와 외출 준비를 현실적으로 다룹니다.</p></div><div class="link-grid">${guides.slice(0, 10).map((i) => `<a href="${i.url}"><strong>${esc(i.title)}</strong><span>${esc(i.description)}</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>엄마표 자료실</h2><p>PDF 준비 링크와 함께 설명, 활용법, 퀴즈 예시를 제공합니다.</p></div><div class="link-grid">${worksheets.map((i) => `<a href="${i.url}"><strong>${esc(i.title)}</strong><span>${esc(i.description)}</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>발달놀이</h2><p>6개월부터 12개월까지 월령별로 집에서 할 수 있는 놀이를 정리했습니다.</p></div><div class="link-grid">${existingDevelopmentLinks.map(([href, label]) => `<a href="${href}"><strong>${esc(label)}</strong><span>월령별 발달 특징과 집에서 하는 놀이를 정리했습니다.</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>몬테소리</h2><p>교구 구매보다 환경, 관찰, 반복을 중심으로 설명합니다.</p></div><div class="link-grid">${montessori.map((i) => `<a href="${i.url}"><strong>${esc(i.title)}</strong><span>${esc(i.description)}</span></a>`).join("")}</div></section>
    <section class="principles"><h2>토이포포 콘텐츠 원칙</h2><ul><li>실제 육아 생활에 도움이 되는 정보를 우선합니다.</li><li>아이의 발달 단계와 부모의 생활 상황을 함께 고려합니다.</li><li>상품 추천보다 정보 제공과 선택 기준을 먼저 안내합니다.</li><li>제휴 링크가 있는 경우 명확히 고지하며, 정보 허브 글에는 구매 링크를 넣지 않습니다.</li><li>의료·발달 진단을 대체하지 않으며 필요한 경우 전문가 상담을 권합니다.</li></ul></section>
  </main>
${footer()}`;
}

function blogIndex() {
  const links = [
    ["/blog/12-month-baby-development-play.html", "12개월 돌 아기 발달놀이, 집에서 쉽게 하는 방법", "걷기 준비와 생활 모방 놀이를 정리했습니다."],
    ["/blog/11-month-baby-development-play.html", "11개월 아기 발달놀이, 집에서 쉽게 하는 방법", "잡고 서기와 주세요 놀이를 생활 속에서 이어갑니다."],
    ["/blog/10-month-baby-development-play.html", "10개월 아기 발달놀이, 집에서 쉽게 하는 방법", "잡고 서기와 넣고 빼기 놀이를 정리했습니다."],
    ["/blog/9-month-baby-development-play.html", "9개월 아기 발달놀이, 집에서 쉽게 하는 방법", "기기와 숨은 장난감 찾기 놀이를 정리했습니다."],
    ["/blog/8-month-baby-development-play.html", "8개월 아기 발달놀이, 집에서 쉽게 하는 방법", "버튼놀이와 컵 넣고 빼기를 정리했습니다."],
    ["/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이, 집에서 쉽게 하는 방법", "촉감놀이와 보물바구니 놀이를 정리했습니다."],
    ["/blog/6-month-baby-development-play.html", "6개월 아기 발달놀이, 집에서 쉽게 하는 방법", "뒤집기 이후 손 뻗기와 촉감 탐색을 정리했습니다."],
    ...counseling.slice(0, 8).map((i) => [i.url, i.title, i.description]),
    ...guides.slice(0, 6).map((i) => [i.url, i.title, i.description]),
  ];
  return collectionPage("/blog/", "토이포포 블로그", "육아 고민, 발달놀이, 몬테소리, 부모 가이드, 엄마표 자료를 한곳에서 모아보는 블로그입니다.", [{ title: "최신 글", desc: "새로 발행한 정보성 글입니다.", links }]);
}

function sitemap() {
  const urls = [
    ["/", "1.0"],
    ["/counseling/", "0.9"],
    ["/parent-guide/", "0.9"],
    ["/worksheets/", "0.9"],
    ["/development-play/", "0.9"],
    ["/montessori/", "0.9"],
    ["/blog/", "0.9"],
    ...allArticles.map((i) => [i.url, "0.85"]),
    ...existingDevelopmentLinks.filter(([href]) => !allArticles.some((i) => i.url === href)).map(([href]) => [href, "0.9"]),
  ];
  const old = fs.existsSync(path.join(ROOT, "sitemap.xml")) ? fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8") : "";
  const oldUrls = [...old.matchAll(/<loc>https:\/\/toypoppo\.kr([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of oldUrls) if (!urls.some(([u]) => u === url)) urls.push([url, "0.7"]);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([url, priority]) => `  <url><loc>${SITE}${url}</loc><lastmod>${TODAY}</lastmod><priority>${priority}</priority></url>`).join("\n")}\n</urlset>\n`;
}

function rss() {
  const items = [
    ...development.map((i) => [i.title, i.url, i.description]),
    ...counseling.slice(0, 10).map((i) => [i.title, i.url, i.description]),
    ...guides.slice(0, 8).map((i) => [i.title, i.url, i.description]),
    ...worksheets.slice(0, 5).map((i) => [i.title, i.url, i.description]),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>토이포포 최신 글</title>\n    <link>${SITE}/</link>\n    <description>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료를 전합니다.</description>\n    <language>ko-KR</language>\n    <lastBuildDate>${PUB}</lastBuildDate>\n${items.map(([title, url, desc]) => `    <item>\n      <title>${esc(title)}</title>\n      <link>${SITE}${url}</link>\n      <guid>${SITE}${url}</guid>\n      <description>${esc(desc)}</description>\n      <pubDate>${PUB}</pubDate>\n    </item>`).join("\n")}\n  </channel>\n</rss>\n`;
}

function main() {
  ["counseling", "parent-guide", "worksheets", "development-play", "montessori", "blog", "tools"].forEach(ensureDir);

  for (const item of counseling) writeArticle(item, articleShell(item, "상담소", counselingBody(item), pools.counseling));
  for (const item of guides) writeArticle(item, articleShell(item, "부모 가이드", guideBody(item), pools.guides));
  for (const item of worksheets) writeArticle(item, articleShell(item, "엄마표 자료실", worksheetBody(item), pools.worksheets));
  for (const item of development) writeArticle(item, articleShell(item, "발달놀이", developmentBody(item), pools.development));
  for (const item of montessori) writeArticle(item, articleShell(item, "몬테소리", montessoriBody(item), pools.montessori));

  fs.writeFileSync(filePath("/counseling/"), collectionPage("/counseling/", "토이포포 상담소", "부모가 실제로 검색하는 육아 고민을 질문과 답변 중심으로 정리했습니다.", [{ title: "상담소 글", desc: "생활 속 고민을 먼저 확인할 수 있는 기준으로 정리했습니다.", links: counseling.map((i) => [i.url, i.title, i.description]) }]), "utf8");
  fs.writeFileSync(filePath("/parent-guide/"), collectionPage("/parent-guide/", "부모 가이드", "하루 일과, 놀이 환경, 정리, 외출, 그림책처럼 부모가 바로 적용할 수 있는 가이드입니다.", [{ title: "부모 가이드 글", desc: "아이와 부모가 덜 지치는 생활형 방법을 모았습니다.", links: guides.map((i) => [i.url, i.title, i.description]) }]), "utf8");
  fs.writeFileSync(filePath("/worksheets/"), collectionPage("/worksheets/", "엄마표 자료실", "초등 역사, 어휘, 독해를 부모가 집에서 설명하고 활용할 수 있게 만든 자료실입니다.", [{ title: "엄마표 자료", desc: "주제 설명, 활용법, 퀴즈 예시, PDF 준비 링크를 함께 제공합니다.", links: worksheets.map((i) => [i.url, i.title, i.description]) }]), "utf8");
  fs.writeFileSync(filePath("/development-play/"), collectionPage("/development-play/", "월령별 발달놀이", "6개월부터 12개월까지 집에서 쉽게 할 수 있는 아기 발달놀이를 모았습니다.", [{ title: "발달놀이 글", desc: "월령별 발달 특징과 놀이 방법을 연결했습니다.", links: existingDevelopmentLinks.map(([href, label]) => [href, label, "집에서 할 수 있는 월령별 발달놀이입니다."]) }]), "utf8");
  fs.writeFileSync(filePath("/montessori/"), collectionPage("/montessori/", "몬테소리", "집에서 시작하는 몬테소리 환경, 보물바구니, 장난감 로테이션, 준비된 환경을 정리했습니다.", [{ title: "몬테소리 글", desc: "교구보다 환경과 관찰을 중심으로 설명합니다.", links: montessori.map((i) => [i.url, i.title, i.description]) }]), "utf8");

  fs.writeFileSync(path.join(ROOT, "index.html"), buildIndex(), "utf8");
  fs.writeFileSync(filePath("/blog/"), blogIndex(), "utf8");
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap(), "utf8");
  fs.writeFileSync(path.join(ROOT, "rss.xml"), rss(), "utf8");
  fs.writeFileSync(path.join(ROOT, "feed.xml"), rss(), "utf8");
}

main();
