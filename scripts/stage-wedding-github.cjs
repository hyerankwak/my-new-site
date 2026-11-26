const fs=require('node:fs'),path=require('node:path');
const root=process.env.WEDDING_SITE_ROOT||path.resolve(__dirname,'..');
const dest=path.join(root,'_site');
const allowed=new Set(['assets','fair','honeymoon','magazine','region','reports']);
const extension=/\.(html|css|js|json|svg|png|jpe?g|webp|gif|ico|woff2?|xml|txt|webmanifest|pdf)$/i;
function copy(src,to,top=false){for(const e of fs.readdirSync(src,{withFileTypes:true})){const from=path.join(src,e.name),out=path.join(to,e.name);if(e.isDirectory()){if(top&&!allowed.has(e.name)&&e.name!=='data')continue;if(e.name.startsWith('.'))continue;fs.mkdirSync(out,{recursive:true});copy(from,out);}else{if(top&&!extension.test(e.name)&&!['_headers','_redirects','_worker.js'].includes(e.name))continue;if(e.name.startsWith('.')||/\.(env|pem|key)$/i.test(e.name))continue;if(from.includes(path.sep+'data'+path.sep)&&!['fairs.json','wedding-publication-status.json'].includes(e.name))continue;if(!top&&!extension.test(e.name))continue;fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(from,out);}}}
fs.mkdirSync(dest,{recursive:true});copy(root,dest,true);
console.log('Public site staged without unpublished drafts or credentials');
