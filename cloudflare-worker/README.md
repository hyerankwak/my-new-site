# ToyPoppo public-data proxy

Cloudflare Worker that keeps the data.go.kr service key out of the browser.

1. Apply for `한국문화정보원_한눈에보는문화정보조회서비스` at data.go.kr.
2. Install Wrangler and authenticate with Cloudflare.
3. Store the decoded service key:
   `npx wrangler secret put DATA_GO_KR_SERVICE_KEY`
4. Deploy:
   `npx wrangler deploy`
5. In Cloudflare Workers Routes, attach:
   `toypoppo.kr/api/*`

The browser calls `/api/culture`. The Worker calls the official XML API and
returns a small normalized JSON response.
