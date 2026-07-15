# ToyPoppo Deployment Guard

This repository branch is dedicated to `toypoppo.kr`.

Before any deploy, confirm:

- `CNAME` is exactly `toypoppo.kr`
- `index.html` is the ToyPoppo home page
- `sitemap.xml` contains only `https://toypoppo.kr/` URLs
- `robots.txt` points to `https://toypoppo.kr/sitemap.xml`
- `ads.txt` contains the ToyPoppo AdSense publisher line
- No wedding, travel, worksheet, or other site content is present

Run:

```powershell
node scripts/validate-toypoppo-deploy.cjs
```

Deploy only after the validation passes.

Recommended long-term fix:

- Move ToyPoppo to a dedicated GitHub repository, for example `hyerankwak/toypoppo`.
- Do not reuse `hyerankwak/my-new-site` for multiple domains.
- Keep `toypoppo.kr` and `www.toypoppo.kr` redirected consistently to the same canonical domain.
