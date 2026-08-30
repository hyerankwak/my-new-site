import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const imagePool = [
  "/assets/images/blog/seongnam-bundang-pangyo-kids-outing-photo.jpg",
  "/assets/images/blog/busan-haeundae-blueline-park-family-photo.jpg",
  "/assets/images/blog/seven-year-old-block-play-family-photo.jpg",
  "/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg",
  "/assets/images/blog/after-school-board-game-family-photo.jpg",
  "/assets/images/blog/songpa-jamsil-kids-outing-family-photo.jpg",
  "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg",
  "/assets/images/blog/weekend-morning-half-day-family-photo.jpg",
];

let globalIndex = 0;
let changedFiles = 0;

for (const file of readdirSync("blog").filter((name) => name.endsWith(".html"))) {
  const filePath = join("blog", file);
  const before = readFileSync(filePath, "utf8");
  let localCount = 0;
  const after = before.replace(/src="data:image\/svg\+xml;base64,[^"]+"/g, () => {
    const image = imagePool[globalIndex % imagePool.length];
    globalIndex += 1;
    localCount += 1;
    return `src="${image}"`;
  });

  if (after !== before) {
    writeFileSync(filePath, after, "utf8");
    changedFiles += 1;
    console.log(`fixed ${file}: ${localCount}`);
  }
}

console.log(`changed files: ${changedFiles}`);
