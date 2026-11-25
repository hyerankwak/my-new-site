import {cpSync,mkdirSync,readdirSync} from 'node:fs';
import {resolve,basename,extname} from 'node:path';
const root=process.cwd(),out=resolve(root,'_site');
const excluded=new Set(['_site','scripts','logs','tmp','drafts','data','node_modules','cloudflare-worker','tools']);
mkdirSync(out,{recursive:true});
for(const entry of readdirSync(root,{withFileTypes:true})){if(entry.name.startsWith('.')||excluded.has(entry.name))continue;if(entry.isFile()&&entry.name!=='CNAME'&&!['.html','.xml','.txt','.ico','.webmanifest','.css','.js'].includes(extname(entry.name)))continue;cpSync(resolve(root,entry.name),resolve(out,entry.name),{recursive:true,filter:src=>!basename(src).startsWith('.')});}
mkdirSync(resolve(out,'data'),{recursive:true});
cpSync(resolve(root,'data/toypoppo-publication-status.json'),resolve(out,'data/toypoppo-publication-status.json'));
console.log('Staged public site without stored drafts, keys or tracking records.');
