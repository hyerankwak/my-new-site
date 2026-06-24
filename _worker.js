const STATE_KEYS = { cashflow: "cashflow:shared:v1" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/login" && request.method === "POST") return login(request, env);
    if (url.pathname === "/api/logout") return logout();
    if (!env.APP_PASSWORD) return html(setupPage(), 503);

    const ok = await isAuthed(request, env);
    if (!ok) return html(loginPage(), 401);

    if (url.pathname === "/api/cashflow" && request.method === "GET") return getState(env);
    if (url.pathname === "/api/cashflow" && request.method === "POST") return saveState(request, env);
    if (url.pathname === "/api/cashflow/memo" && request.method === "GET") return getMemo(env);
    if (url.pathname === "/api/cashflow/memo" && request.method === "POST") return saveMemo(request, env);

    const response = await env.ASSETS.fetch(request);
    if (url.pathname === "/cashflow.html") return patchCashflow(response);
    return response;
  }
};

function storeFrom(env) { return env.CASHFLOW_STORE || env.CASHFLOW_KV || env.CASHFLOW_DATA; }
function missingStore() { return json({ error: "CASHFLOW_STORE binding missing" }, 501); }

async function getState(env) {
  const store = storeFrom(env);
  if (!store) return missingStore();
  const saved = await store.get(STATE_KEYS.cashflow, "json");
  return json(saved ? { exists: true, ...saved } : { exists: false, rows: [], rules: {}, updatedAt: null });
}

async function saveState(request, env) {
  const store = storeFrom(env);
  if (!store) return missingStore();
  const body = await request.json().catch(() => ({}));
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 50000) : [];
  const rules = body.rules && typeof body.rules === "object" ? body.rules : {};
  const saved = { rows, rules, updatedAt: new Date().toISOString() };
  await store.put(STATE_KEYS.cashflow, JSON.stringify(saved));
  return json({ ok: true, rows: rows.length, updatedAt: saved.updatedAt });
}

async function getMemo(env) {
  const store = storeFrom(env);
  if (!store) return missingStore();
  return json({ memo: await store.get("cashflow:memo:v1") || "" });
}

async function saveMemo(request, env) {
  const store = storeFrom(env);
  if (!store) return missingStore();
  const body = await request.json().catch(() => ({}));
  const memo = String(body.memo || "").slice(0, 20000);
  await store.put("cashflow:memo:v1", memo);
  return json({ ok: true, updatedAt: new Date().toISOString() });
}

async function patchCashflow(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  let body = await response.text();
  body = body.replaceAll("쿠팡 정산", "쿠팡(올라)").replaceAll("쿠팡정산", "쿠팡(올라)");
  const style = `<style id="cf-sync-style">.cloud-sync-box,.summary-period-box{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 16px;padding:14px;border:2px solid #197a55;border-radius:8px;background:#f2fbf6}.cloud-sync-box strong,.summary-period-box strong{display:block;margin-bottom:4px}.cloud-sync-status,.summary-period-box p{color:#66736d;font-size:13px}.summary-period-box label{min-width:220px;margin:0}@media(max-width:720px){.cloud-sync-box,.summary-period-box{display:grid}.summary-period-box label{min-width:0}}</style>`;
  if (!body.includes("cf-sync-style")) body = body.replace("</head>", style + "</head>");
  const cloud = `<section id="cloudSyncBox" class="cloud-sync-box"><div><strong>공용저장</strong><span class="cloud-sync-status" id="cloudSyncStatus">확인 중</span></div><div class="actions"><button class="btn" id="cloudLoadBtn" type="button">공용저장 불러오기</button><button class="btn primary" id="cloudSaveBtn" type="button">이 브라우저 자료를 공용저장</button></div></section>`;
  if (!body.includes("cloudSyncBox")) body = body.replace(/(<p class="notice" id="notice"[\s\S]*?<\/p>)/, "$1" + cloud);
  const summary = `<div id="summaryPeriodBox" class="summary-period-box"><div><strong>분류별 입출금 요약 기간</strong><p>처음은 최근 달입니다. 전체도 선택할 수 있습니다.</p></div><label>요약 달<select id="summaryMonthFilter"><option value="">전체</option></select></label></div>`;
  if (!body.includes("summaryMonthFilter")) body = body.replace(/(<div class="section-title"><h2>분류별 입출금 요약<\/h2>[\s\S]*?<\/div>)/, "$1" + summary);
  return addPatchScript(new Response(body, response));
}

async function addPatchScript(response) {
  let body = await response.text();
  const script = `<script>(function(){
var SETTLE='쿠팡(올라)', loading=false, saving=false, summaryTouched=false;
function q(s){return document.querySelector(s)}function txt(v){return String(v||'')}function compact(v){return txt(v).replace(/\s/g,'').toLowerCase()}function isCoupang(v){var x=compact(v);return x.includes('쿠팡')||x.includes('coupang')||x.includes('올라')||x.includes('olla')}function canon(v){var x=compact(v);if(isCoupang(v))return SETTLE;if(x==='대출'||x==='대출금')return '대출금';return txt(v).trim()}function rowText(r){return [r&&r.category,r&&r.partner,r&&r.description,r&&r.memo,r&&r.account,r&&r.sourceFileName].join(' ')}function rowCat(r){return isCoupang(rowText(r))?SETTLE:canon(r&&r.category||'미분류')}function month(v){return txt(v).slice(0,7)}function accountRows(rows){return (rows||[]).filter(function(r){var c=rowCat(r),t=rowText(r);return !r.sourceType||r.sourceType==='계좌'||c===SETTLE||c==='카드대금'||t.includes('카드대금')||t.includes('결제대금')})}function months(rows){return Array.from(new Set((rows||[]).map(function(r){return month(r&&r.date)}).filter(Boolean))).sort().reverse()}function status(t){var el=q('#cloudSyncStatus');if(el)el.textContent=t}
function ensureSummary(rows){var box=q('#summaryPeriodBox');if(!box){var table=q('#categorySummaryRows')&&q('#categorySummaryRows').closest('.table-wrap');box=document.createElement('div');box.id='summaryPeriodBox';box.className='summary-period-box';box.innerHTML='<div><strong>분류별 입출금 요약 기간</strong><p>처음은 최근 달입니다. 전체도 선택할 수 있습니다.</p></div>';if(table)table.insertAdjacentElement('beforebegin',box)}var sel=q('#summaryMonthFilter');if(!sel&&box){var label=document.createElement('label');label.textContent='요약 달';sel=document.createElement('select');sel.id='summaryMonthFilter';label.appendChild(sel);box.appendChild(label);sel.addEventListener('input',function(){summaryTouched=true;try{render()}catch(e){}})}if(!sel)return;var list=months(accountRows(rows||[])),cur=sel.value;sel.innerHTML='<option value="">전체</option>'+list.map(function(m){return '<option value="'+m+'">'+m+'</option>'}).join('');sel.value=cur&&list.includes(cur)?cur:(summaryTouched?'':(list[0]||''))}
function clean(){try{var changed=false;(transactions||[]).forEach(function(r){var c=rowCat(r);if(r.category!==c){r.category=c;changed=true}});if(changed&&typeof saveRows==='function')saveRows()}catch(e){}try{var cr=false;Object.keys(categoryRules||{}).forEach(function(k){var c=canon(categoryRules[k]);if(categoryRules[k]!==c){categoryRules[k]=c;cr=true}});if(cr&&typeof saveRules==='function')saveRules()}catch(e){}}
async function saveShared(force){try{if(saving)return;saving=true;status('공용저장 중');var res=await fetch('/api/cashflow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({rows:transactions||[],rules:categoryRules||{}})});if(!res.ok)throw new Error('save');status('공용저장 완료 '+((transactions||[]).length).toLocaleString()+'건')}catch(e){status('공용저장 실패')}finally{saving=false}}
async function loadShared(force){try{loading=true;status('공용저장 확인 중');var localCount=(transactions||[]).length;var res=await fetch('/api/cashflow',{cache:'no-store'});if(!res.ok)throw new Error('load');var data=await res.json(),cloudRows=Array.isArray(data.rows)?data.rows:[],cloudRules=data.rules&&typeof data.rules==='object'?data.rules:{};if(data.exists&&(force||cloudRows.length>=localCount)){localStorage.setItem(STORAGE_KEY,JSON.stringify(cloudRows));localStorage.setItem(RULES_KEY,JSON.stringify(cloudRules));transactions=typeof migrateRows==='function'?migrateRows(loadRows()):cloudRows;categoryRules=typeof loadRules==='function'?loadRules():cloudRules;clean();status('공용저장 불러옴 '+transactions.length.toLocaleString()+'건');try{render()}catch(e){}}else if(localCount){await saveShared(true)}else status('공용저장 내역 없음')}catch(e){status('공용저장 연결 안 됨')}finally{loading=false}}
function hook(){var load=q('#cloudLoadBtn'),save=q('#cloudSaveBtn');if(load&&!load.dataset.bound){load.dataset.bound='1';load.addEventListener('click',function(){loadShared(true)})}if(save&&!save.dataset.bound){save.dataset.bound='1';save.addEventListener('click',function(){saveShared(true)})}try{if(typeof canonicalCategory==='function'){var oldCan=canonicalCategory;canonicalCategory=function(v){return canon(oldCan(v))}}}catch(e){}try{if(typeof guessCategory==='function'){var oldGuess=guessCategory;guessCategory=function(v,i,o){return isCoupang(v)?SETTLE:canon(oldGuess(v,i,o))}}}catch(e){}try{if(typeof renderCategorySummary==='function'){var oldSummary=renderCategorySummary;renderCategorySummary=function(rows){rows=accountRows(rows);ensureSummary(rows);var sel=q('#summaryMonthFilter'),m=sel&&sel.value;if(m)rows=rows.filter(function(r){return month(r.date)===m});return oldSummary(rows)}}}catch(e){}try{if(typeof saveRows==='function'){var oldSaveRows=saveRows;saveRows=function(){oldSaveRows();if(!loading)saveShared(false)}}}catch(e){}try{if(typeof saveRules==='function'){var oldSaveRules=saveRules;saveRules=function(){oldSaveRules();if(!loading)saveShared(false)}}}catch(e){}try{var oldRender=render;render=function(){clean();var out=oldRender();ensureSummary(typeof transactions!=='undefined'?transactions:[]);return out}}catch(e){}}
hook();setTimeout(function(){try{render()}catch(e){}},200);setTimeout(function(){loadShared(false)},500);
})();</script>`;
  body = body.includes("</body>") ? body.replace("</body>", script + "</body>") : body + script;
  return new Response(body, { status: response.status, statusText: response.statusText, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

async function login(request, env) {
  if (!env.APP_PASSWORD) return html(setupPage(), 503);
  const form = await request.formData();
  if (String(form.get("password") || "") !== env.APP_PASSWORD) return html(loginPage("비밀번호가 틀렸습니다."), 401);
  return new Response(null, { status: 303, headers: { location: "/", "set-cookie": `rg_auth=${await token(env.APP_PASSWORD)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200` } });
}

function logout() {
  return new Response(null, { status: 303, headers: { location: "/", "set-cookie": "rg_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" } });
}

async function isAuthed(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )rg_auth=([^;]+)/);
  return Boolean(match && match[1] === await token(env.APP_PASSWORD));
}

async function token(password) {
  const data = new TextEncoder().encode(`rocket-growth-order:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loginPage(error = "") {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>로그인</title>${style()}</head><body><form method="post" action="/api/login"><h1>업무 프로그램 로그인</h1><p>공유 비밀번호를 입력하세요.</p>${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}<label>비밀번호<input name="password" type="password" autocomplete="current-password" autofocus></label><button>로그인</button></form></body></html>`;
}

function setupPage() {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>설정 필요</title>${style()}</head><body><main><h1>비밀번호 설정 필요</h1><p>Cloudflare Secret에 아래 값을 추가한 뒤 다시 배포하세요.</p><code>APP_PASSWORD</code></main></body></html>`;
}

function style() {
  return `<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f6f7f3;color:#1c2321;font-family:"Segoe UI",sans-serif}form,main{width:min(430px,calc(100% - 32px));padding:24px;background:#fff;border:1px solid #dfe5df;border-radius:8px;box-shadow:0 12px 28px rgba(28,35,33,.08)}h1{margin:0 0 8px;font-size:28px}p{color:#66736d;line-height:1.5}label{display:grid;gap:8px;color:#66736d}input{height:44px;border:1px solid #dfe5df;border-radius:8px;padding:0 12px;font:inherit}button{width:100%;height:44px;margin-top:14px;border:0;border-radius:8px;background:#197a55;color:white;font:inherit;cursor:pointer}.error{margin:0 0 14px;padding:10px 12px;border-radius:8px;background:#ffe4e4;color:#b53030}code{display:block;padding:12px;background:#f6f7f3;border:1px solid #dfe5df;border-radius:8px}</style>`;
}

function html(body, status = 200) {
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
