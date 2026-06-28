const fs = require("fs");
const path = require("path");

const oldNav = '<nav class="nav" aria-label="주요 메뉴"><a href="/counseling/">상담소</a><a href="/parent-guide/">부모가이드</a><a href="/development-play/">발달놀이</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">육아도구</a><a href="/local-info/">우리동네 육아정보</a><a href="/ai-helper/">AI 육아도우미</a></nav>';
const newNav = '<nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">육아도구</a><a href="/local-info/">우리동네</a></nav>';

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.name.endsWith(".html") ? [target] : [];
  });
}

let changed = 0;
for (const file of htmlFiles(".")) {
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes(oldNav)) continue;
  fs.writeFileSync(file, source.replace(oldNav, newNav), "utf8");
  changed += 1;
}

console.log(`Updated toy navigation on ${changed} pages.`);
