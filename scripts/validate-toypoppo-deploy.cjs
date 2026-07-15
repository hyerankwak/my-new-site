const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function readText(file) {
  const target = path.join(root, file);
  return fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
}

const checks = [];
function requireCheck(condition, message) {
  checks.push({ condition, message });
}

const cname = readText("CNAME").trim();
const index = readText("index.html");
const robots = readText("robots.txt");
const sitemap = readText("sitemap.xml");
const ads = readText("ads.txt");

requireCheck(cname === "toypoppo.kr", "CNAME must be exactly toypoppo.kr");
requireCheck(index.includes("토이포포") || index.includes("ToyPoppo"), "index.html must be the ToyPoppo home page");
requireCheck(!index.includes("wedding-guide.co.kr"), "index.html must not contain wedding-guide.co.kr");
requireCheck(!index.includes("웨딩박람회"), "index.html must not contain wedding fair content");
requireCheck(sitemap.includes("https://toypoppo.kr/"), "sitemap.xml must contain toypoppo.kr URLs");
requireCheck(!sitemap.includes("wedding-guide.co.kr"), "sitemap.xml must not contain wedding-guide.co.kr");
requireCheck(robots.includes("User-agent: *"), "robots.txt must exist and include User-agent: *");
requireCheck(robots.includes("Sitemap: https://toypoppo.kr/sitemap.xml"), "robots.txt must point to ToyPoppo sitemap");
requireCheck(ads.includes("google.com, pub-4675052661212934, DIRECT"), "ads.txt must include the ToyPoppo AdSense publisher line");

const failed = checks.filter((check) => !check.condition);

if (failed.length) {
  console.error("ToyPoppo deploy validation failed:");
  for (const check of failed) {
    console.error(`- ${check.message}`);
  }
  process.exit(1);
}

console.log("ToyPoppo deploy validation passed.");
