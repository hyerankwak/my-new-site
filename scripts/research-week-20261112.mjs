import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {keywordResearch,searchProducts} from './affiliate-research.mjs';
const path='logs/research-week-20261112.json';
const data=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{checkedAt:new Date().toISOString(),keywords:[],products:[]};
const queries=['러시아워 주니어','러시아워 보드게임','스킵피티','치킨차차','립프로그 아이스크림카트','넘버블럭스 1 10','플레이도우 케이크 오븐','루빅스 큐브 3x3','클루 보드게임','다빈치코드 보드게임','젝스님트','텀블링몽키','루핑루이','스피드컵스','러시아워','러시아워주니어','플레이도우','우노','캐치스케치','빨간모자 퍼즐'];
if(!data.keywords.length){for(const terms of [['러시아워보드게임','스킵피티','치킨차차','아이스크림카트','넘버블럭스교구'],['플레이도우','루빅스큐브','클루보드게임','다빈치코드보드게임','젝스님트'],['텀블링몽키','루핑루이','스피드컵스','5세보드게임추천','6세보드게임추천']]){data.keywords.push(...await keywordResearch(terms));await new Promise(r=>setTimeout(r,1500));}data.keywords=[...new Map(data.keywords.map(x=>[x.keyword,x])).values()];writeFileSync(path,JSON.stringify(data,null,2)+'\n');}
for(const query of queries){if(data.products.some(x=>x.query===query))continue;const products=await searchProducts(query,6);data.products.push({query,products});writeFileSync(path,JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify({query,products:products.map(({productId,name,price})=>({productId,name,price}))}));await new Promise(r=>setTimeout(r,1500));}
