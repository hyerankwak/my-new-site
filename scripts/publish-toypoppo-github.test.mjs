import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishDue,verifyPublished,validateQueue,publicStatus} from './publish-toypoppo-github.mjs';
function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'toypoppo-publisher-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 for(const d of ['.publication/articles','blog','data'])mkdirSync(join(root,d),{recursive:true});
 writeFileSync(join(root,'blog/index.html'),'<div class="link-grid"></div>');writeFileSync(join(root,'sitemap.xml'),'<urlset></urlset>');
 const items=[0,1].map(i=>({date:'2026-11-26',scheduledTime:`${String(9+i).padStart(2,'0')}:10`,status:'ready',title:'가족 놀이 '+i,description:'선택 안내',source:`.publication/articles/${i}.html`,target:`blog/${i}.html`,url:`https://toypoppo.kr/blog/${i}.html`}));
 for(const x of items)writeFileSync(join(root,x.source),`<link rel="canonical" href="${x.url}"><title>${x.title}</title><article>안내</article><script type="application/ld+json">{}</script>`);
 const queue={version:1,items};writeFileSync(join(root,'.publication/queue.json'),JSON.stringify(queue));return {root,queue};
}
test('future articles never publish and dry runs never change the queue',t=>{const {root}=fixture(t),before=readFileSync(join(root,'.publication/queue.json'),'utf8');assert.equal(publishDue(root,{now:new Date('2026-11-26T00:09:59Z'),dryRun:true}).due,null);assert.equal(readFileSync(join(root,'.publication/queue.json'),'utf8'),before);});
test('publish at most one item; retry an unverified deployment before another item',t=>{const {root}=fixture(t);assert.ok(publishDue(root,{now:new Date('2026-11-26T04:00:00Z')}).published);assert.equal(publishDue(root,{now:new Date('2026-11-26T05:00:00Z')}).published,null);const q=JSON.parse(readFileSync(join(root,'.publication/queue.json'),'utf8'));assert.deepEqual(q.items.map(x=>x.status),['published','ready']);assert.equal(readFileSync(join(root,'sitemap.xml'),'utf8').match(/<url>/g).length,1);});
test('live title and HTTP response must both match before success',async t=>{const {root}=fixture(t);publishDue(root,{now:new Date('2026-11-26T00:10:00Z')});await assert.rejects(verifyPublished(root,{fetcher:async()=>new Response('wrong page',{status:200}),attempts:1}),/verification failed/);await verifyPublished(root,{fetcher:async()=>new Response('<title>가족 놀이 0</title>',{status:200}),attempts:1});const q=JSON.parse(readFileSync(join(root,'.publication/queue.json'),'utf8'));assert.ok(q.items[0].verifiedAt);assert.ok(publishDue(root,{now:new Date('2026-11-26T01:10:00Z')}).published);});
test('reject traversal, duplicates and overwriting unrelated pages',t=>{const {root,queue}=fixture(t);queue.items[0].target='blog/../index.html';assert.throws(()=>validateQueue(root,queue),/Path escapes/);queue.items[0].target='blog/0.html';queue.items[1].target='blog/0.html';assert.throws(()=>validateQueue(root,queue));queue.items[1].target='blog/1.html';writeFileSync(join(root,'blog/0.html'),'unrelated');assert.throws(()=>publishDue(root,{now:new Date('2026-11-26T00:10:00Z')}),/Refusing/);});
test('Korean midnight reporting uses the Korean date',()=>{const s=publicStatus({items:[{status:'published',publishedAt:'2026-11-25T15:20:00Z'}]},new Date('2026-11-25T15:25:00Z'));assert.equal(s.operationDate,'2026-11-26');assert.equal(s.todayCount,1);});
