import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve} from 'node:path';
const repo='hyerankwak/my-new-site',native=resolve(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git');
const exe=existsSync(resolve(native,'cmd/git.exe'))?resolve(native,'cmd/git.exe'):'git';
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never',GIT_EXEC_PATH:resolve(native,'mingw64/bin'),PATH:resolve(native,'mingw64/bin')+';'+process.env.PATH};
function git(args,options={}){const r=spawnSync(exe,args,{env,encoding:'utf8',timeout:60000,...options});if(r.status!==0)throw Error('Git '+args[0]+' failed: '+(r.stderr||'unavailable').slice(0,300));return r.stdout.trim();}
async function request(path,options={}){const r=await fetch('https://api.github.com/repos/'+repo+path,{...options,headers:{'User-Agent':'ToyPoppo-Publisher','Accept':'application/vnd.github+json',...options.headers},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('GitHub API HTTP '+r.status);return r.status===204?null:r.json();}
try{
 const action=process.argv[2];
 if(action==='install'){
  git(['fetch','origin','main']);const parent=git(['rev-parse','origin/main']),index=resolve('logs/toypoppo-main-'+Date.now()+'.index'),indexEnv={...env,GIT_INDEX_FILE:index};
  try{git(['read-tree',parent],{env:indexEnv});for(const name of ['publish-toypoppo.yml','pages.yml']){const file='.github/workflows/'+name,hash=git(['hash-object','-w',file]);git(['update-index','--add','--cacheinfo','100644',hash,file],{env:indexEnv});}
   const tree=git(['write-tree'],{env:indexEnv}),baseTree=git(['rev-parse',parent+'^{tree}']);if(tree===baseTree){console.log(JSON.stringify({installed:true,changed:false,commit:parent}));}
   else{const commit=git(['commit-tree',tree,'-p',parent,'-m','Enable PC-independent ToyPoppo scheduled publication']);git(['push','origin',commit+':refs/heads/main']);console.log(JSON.stringify({installed:true,changed:true,commit}));}
  }finally{if(existsSync(index))unlinkSync(index);}
 }else if(action==='status'){
  const [runs,workflow]=await Promise.all([request('/actions/workflows/publish-toypoppo.yml/runs?per_page=3'),request('/actions/workflows/publish-toypoppo.yml')]);
  console.log(JSON.stringify({workflow:{state:workflow.state,path:workflow.path,url:workflow.html_url},runs:runs.workflow_runs.map(x=>({id:x.id,event:x.event,status:x.status,conclusion:x.conclusion,createdAt:x.created_at,url:x.html_url}))},null,2));
 }else throw Error('Use install or status');
}catch(e){console.error(e.message);process.exitCode=1;}
