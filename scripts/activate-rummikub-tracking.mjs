import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from './coupang-revenue.mjs';

const data = JSON.parse(readFileSync(resolve(root, 'logs/coupang-reports/deeplink-tracking-test.json'), 'utf8'));
const link = data.data?.[0]?.landingUrl;
const subId = 'tprummi1031';
if (data.rCode !== '0' || new URL(link).hostname !== 'link.coupang.com' || new URL(link).searchParams.get('subid') !== subId) throw Error('Unverified tracked link');
const path = resolve(root, 'blog/rummikub-classic-elementary-gift-age-rules-20261031.html');
let html = readFileSync(path, 'utf8');
const escaped = link.replaceAll('&', '&amp;');
let count = 0;
html = html.replace(/href="https:\/\/link\.coupang\.com\/re\/AFFSDP[^\"]+"/g, () => { count++; return `href="${escaped}"`; });
if (count !== 2) throw Error('Expected two reviewed product links');
const mapPath = resolve(root, 'data/coupang-article-tracking.json');
let mapping;
try { mapping = JSON.parse(readFileSync(mapPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; mapping = { articles: [] }; }
if (!mapping.articles.some(a => a.subId === subId)) mapping.articles.push({
  subId, title: '루미큐브 클래식 추천: 초등학생 생일선물로 살 때 연령·규칙·구성 확인',
  url: 'https://toypoppo.kr/blog/rummikub-classic-elementary-gift-age-rules-20261031.html',
  activatedAt: new Date().toISOString(), productId: 4673650342,
});
mapping.articles.find(a => a.subId === subId).affiliateUrl = link;
writeFileSync(path, html, 'utf8');
writeFileSync(mapPath, JSON.stringify(mapping, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ updatedLinks: count, subId, retroactiveAttribution: false }));
