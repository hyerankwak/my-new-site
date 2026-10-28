import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderArticle } from "./prepare-toypoppo-week-20261022.mjs";
import regions from "./content-week-20261029-regions.mjs";
import travel from "./content-week-20261029-travel.mjs";
import education from "./content-week-20261029-education.mjs";
import toys from "./content-week-20261029-toys.mjs";
import home from "./content-week-20261029-home.mjs";
import examples from "./content-week-20261029-examples.mjs";

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const batch="20261029";
const dates=Array.from({length:7},(_,i)=>new Date(Date.UTC(2026,9,29+i)).toISOString().slice(0,10));
const groups={region:regions,mrt:travel,education,coupang:toys,season:home};
const photoOverrides={
  coupang:{
    2:["rainy-day-home-play-craft.png","seven-year-old-block-play-family-photo.jpg"],
    3:["twenty-four-month-pretend-play-family-photo.jpg","first-grade-read-aloud-retelling-routine-1.png"],
    5:["after-school-board-game-family-photo.jpg","first-grade-board-game-family.png"],
    6:["twenty-four-month-pretend-play-family-photo.jpg","rainy-day-home-play-craft.png"],
  },
  season:{
    0:["after-school-board-game-family-photo.jpg","first-grade-board-game-family.png"],
    1:["first-grade-read-aloud-retelling-routine-1.png","first-grade-read-aloud-retelling-routine-2.png"],
    2:["seven-year-old-block-play-family-photo.jpg","seven-year-old-lego-blocks-family-photo-20260902.jpg"],
    3:["rainy-day-home-play-craft.png","five-year-old-toy-shelf-family-photo.jpg"],
    5:["seven-year-old-lego-blocks-family-photo-20260902.jpg","seven-year-old-block-play-family-photo.jpg"],
    6:["rainy-day-home-play-craft.png","weekend-morning-half-day-family-photo.jpg"],
  },
};
export function prepareWeek(){
  const queuePath=join(root,"data/toypoppo-prewritten-queue.json");
  const queue=JSON.parse(readFileSync(queuePath,"utf8"));
  const prepared=[];
  for(let index=0;index<dates.length;index++)for(const [slot,records] of Object.entries(groups)){
    const current=queue.items.find(x=>x.date===dates[index]&&x.slot===slot);
    if(current&&current.status!=="ready")throw Error(`Refusing to replace non-ready slot ${dates[index]} ${slot}`);
    const record={...records[index],checkedAt:"2026-10-29"};
    if(photoOverrides[slot]?.[index])record.photos=photoOverrides[slot][index].map(name=>`/assets/images/blog/${name}`);
    if(examples[slot])record.sections=[...record.sections,examples[slot][index]];
    if(!record.title||!record.slug||record.sections.length<3||record.faq.length<2)throw Error(`Incomplete article ${slot} ${index}`);
    const rendered=renderArticle(record,slot,dates[index],index);
    const visible=rendered.body.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
    if(visible.length<2200)throw Error(`Short article ${visible.length}: ${record.title}`);
    if(/\?\?\?|수익형 글|기준이 먼저입니다|검색 유입이 많은 주제|API|商品|訪문/.test(visible))throw Error(`Invalid wording ${record.title}`);
    for(const m of rendered.html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))if(!existsSync(join(root,m[1])))throw Error(`Missing image ${m[1]}`);
    if(queue.items.some(x=>x.status==="published"&&(x.title===record.title||x.target===rendered.item.target)))throw Error(`Already published ${record.title}`);
    prepared.push({...rendered,characters:visible.length});
  }
  const keep=queue.items.filter(x=>!dates.includes(x.date));
  let order=keep.reduce((n,x)=>Math.max(n,Number(x.order)||0),-1)+1;
  queue.items=[...keep,...prepared.map(x=>({...x.item,order:order++}))];
  if(new Set(queue.items.map(x=>`${x.date}:${x.slot}`)).size!==queue.items.length)throw Error("Duplicate queue slot");
  const summary={articles:prepared.length,start:dates[0],end:dates.at(-1),minCharacters:Math.min(...prepared.map(x=>x.characters)),maxCharacters:Math.max(...prepared.map(x=>x.characters))};
  if(process.argv.includes("--check")){console.log(JSON.stringify({...summary,lengths:prepared.map(x=>({title:x.item.title,characters:x.characters}))},null,2));return;}
  mkdirSync(join(root,"logs"),{recursive:true});
  mkdirSync(join(root,"drafts/toypoppo-prewritten"),{recursive:true});
  const backup=join(root,`logs/toypoppo-queue-before-week-${batch}.json`);
  if(!existsSync(backup))copyFileSync(queuePath,backup);
  for(const x of prepared)writeFileSync(join(root,x.item.source),x.html,"utf8");
  const pending=queuePath+".pending";
  writeFileSync(pending,JSON.stringify(queue,null,2)+"\n","utf8");
  renameSync(pending,queuePath);
  writeFileSync(join(root,`data/toypoppo-week-${batch}-manifest.json`),JSON.stringify(prepared.map(({item,characters})=>({...item,characters})),null,2)+"\n","utf8");
  console.log(JSON.stringify({...summary,stored:true},null,2));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))prepareWeek();
