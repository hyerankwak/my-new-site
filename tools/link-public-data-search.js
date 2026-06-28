const fs = require("fs");

const indexPath = "local-info/index.html";
let index = fs.readFileSync(indexPath, "utf8");
const indexNeedle = '<section><h2>제공 예정 정보</h2><div class="link-grid">';
const liveSection = '<section class="summary-box"><p class="eyebrow">LIVE PUBLIC DATA</p><h2>실제 공공데이터로 아이와 갈 곳 찾기</h2><p>지역과 기간을 선택하면 한국문화정보원의 공연·전시·체험 데이터를 실시간으로 조회합니다. 장소, 일정, 요금과 공식 페이지를 한곳에서 확인할 수 있습니다.</p><p><a class="button primary" href="/local-info/search.html">공공데이터 검색 시작 →</a></p></section>\n      ';
const removeMode = process.argv.includes("--remove");

if (removeMode) {
  index = index.replace(liveSection, "");
  fs.writeFileSync(indexPath, index, "utf8");

  const sitemapPath = "sitemap.xml";
  const sitemap = fs.readFileSync(sitemapPath, "utf8").replace(
    /\n  <url><loc>https:\/\/toypoppo\.kr\/local-info\/search\.html<\/loc><lastmod>2026-06-27<\/lastmod><priority>0\.9<\/priority><\/url>/,
    ""
  );
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
  process.exit(0);
}

if (!index.includes("/local-info/search.html")) {
  if (!index.includes(indexNeedle)) throw new Error("Local-info insertion point not found");
  index = index.replace(indexNeedle, liveSection + indexNeedle);
  fs.writeFileSync(indexPath, index, "utf8");
}

const sitemapPath = "sitemap.xml";
let sitemap = fs.readFileSync(sitemapPath, "utf8");
const sitemapNeedle = "  <url><loc>https://toypoppo.kr/local-info/</loc><lastmod>2026-06-27</lastmod><priority>0.9</priority></url>";
if (!sitemap.includes("/local-info/search.html")) {
  sitemap = sitemap.replace(sitemapNeedle, `${sitemapNeedle}
  <url><loc>https://toypoppo.kr/local-info/search.html</loc><lastmod>2026-06-27</lastmod><priority>0.9</priority></url>`);
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
}
