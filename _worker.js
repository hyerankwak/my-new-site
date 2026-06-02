export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/login" && request.method === "POST") return login(request, env);
    if (url.pathname === "/api/logout") return logout();
    if (!env.APP_PASSWORD) return html(setupPage(), 503);
    const ok = await isAuthed(request, env);
    if (!ok) return html(loginPage(), 401);
    return env.ASSETS.fetch(request);
  }
};

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

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
