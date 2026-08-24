import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://toypoppo.kr";
const BLOG_DIR = path.join(ROOT, "blog");
const OUT = path.join(BLOG_DIR, "index.html");

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripSiteSuffix(title) {
  return title
    .replace(/\s*\|\s*토이포포\s*$/u, "")
    .replace(/\s*-\s*토이포포\s*$/u, "")
    .trim();
}

function textBetween(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function isBrokenKorean(text) {
  return /[�]|[遺珥媛쒖꾩좎]/u.test(text);
}

function readArticle(file) {
  const full = path.join(BLOG_DIR, file);
  const html = fs.readFileSync(full, "utf8");
  let title = stripSiteSuffix(textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  let description = textBetween(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!title || isBrokenKorean(title)) {
    title = stripSiteSuffix(textBetween(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  }
  if (!description || isBrokenKorean(description)) {
    const lead = textBetween(html, /<p[^>]*class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    description = lead || "토이포포에서 정리한 육아·놀이·교육 정보입니다.";
  }
  if (!title || isBrokenKorean(title)) return null;
  const stat = fs.statSync(full);
  return {
    href: `/blog/${file}`,
    title,
    description: description.slice(0, 150),
    mtime: stat.mtimeMs,
  };
}

function card(item) {
  return `<a href="${esc(item.href)}"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></a>`;
}

const articles = fs
  .readdirSync(BLOG_DIR)
  .filter((file) => file.endsWith(".html") && file !== "index.html")
  .map(readArticle)
  .filter(Boolean)
  .sort((a, b) => b.mtime - a.mtime || a.title.localeCompare(b.title, "ko"));

const featured = articles.slice(0, 12);
const sections = [
  ["장난감·교구 추천", articles.filter((i) => /장난감|보드게임|레고|블록|선물|교구/u.test(i.title)).slice(0, 36)],
  ["발달놀이", articles.filter((i) => /발달놀이|말놀이|역할놀이|소근육|대근육|놀이/u.test(i.title)).slice(0, 36)],
  ["초등 학습·문해력", articles.filter((i) => /초등|문해력|독해|받아쓰기|수학|글쓰기|공부|학습/u.test(i.title)).slice(0, 36)],
  ["몬테소리·생활 습관", articles.filter((i) => /몬테소리|정리|환경|루틴|습관/u.test(i.title)).slice(0, 36)],
  ["부모 고민 해결", articles.filter((i) => /방법|괜찮|고르는|체크|가이드|이유/u.test(i.title)).slice(0, 36)],
];

const seen = new Set();
const sectionHtml = sections
  .map(([title, items]) => {
    const unique = items.filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
    if (!unique.length) return "";
    return `<section class="section"><div class="section-head"><div><p class="eyebrow">ToyPoppo Blog</p><h2>${esc(title)}</h2></div><p>부모가 검색하고 다시 확인하기 좋은 글을 주제별로 모았습니다.</p></div><div class="link-grid">${unique.map(card).join("")}</div></section>`;
  })
  .filter(Boolean)
  .join("\n");

const remaining = articles.filter((item) => !seen.has(item.href)).slice(0, 80);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: "토이포포", url: SITE },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "토이포포", publisher: { "@id": `${SITE}/#organization` }, inLanguage: "ko-KR" },
    { "@type": "CollectionPage", name: "토이포포 블로그", description: "육아 고민, 발달놀이, 장난감·교구 추천, 초등 학습 정보를 모아 정리한 블로그입니다.", url: `${SITE}/blog/`, isPartOf: { "@id": `${SITE}/#website` }, inLanguage: "ko-KR" },
  ],
};

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>토이포포 블로그 | 육아·놀이·교육 정보</title>
  <meta name="description" content="토이포포 블로그는 장난감 추천, 발달놀이, 부모 고민, 초등 학습과 몬테소리 정보를 부모가 바로 참고할 수 있게 정리합니다.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${SITE}/blog/">
  <meta property="og:title" content="토이포포 블로그 | 육아·놀이·교육 정보">
  <meta property="og:description" content="부모가 실제로 검색하는 육아·놀이·교육 정보를 주제별로 모았습니다.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}/blog/">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
    <nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav>
  </header>
  <main>
    <section class="hero compact"><p class="eyebrow">ToyPoppo Blog</p><h1>부모가 실제로 다시 찾는 육아·놀이·교육 글</h1><p>토이포포 블로그는 아이 발달, 놀이, 장난감·교구 선택, 초등 학습과 부모 고민을 검색하기 쉽게 정리합니다. 새 글은 최신순으로 먼저 보여주고, 아래에서 주제별로 다시 탐색할 수 있습니다.</p></section>
    <section class="section"><div class="section-head"><div><p class="eyebrow">Recent Updates</p><h2>최근 업데이트</h2></div><p>새로 발행한 글입니다.</p></div><div class="link-grid">${featured.map(card).join("")}</div></section>
    ${sectionHtml}
    <section class="section"><div class="section-head"><div><p class="eyebrow">More Guides</p><h2>더 많은 글</h2></div><p>토이포포에 쌓인 육아·놀이·교육 글을 계속 확인할 수 있습니다.</p></div><div class="link-grid">${remaining.map(card).join("")}</div></section>
  </main>
  <footer class="site-footer">
    <div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 체크리스트를 함께 다루는 부모 정보 플랫폼입니다.</p></div>
    <nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>
</body>
</html>`;

fs.writeFileSync(OUT, html, "utf8");
console.log(`Rebuilt blog index with ${articles.length} articles.`);
