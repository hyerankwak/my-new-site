# ToyPoppo IndexNow Workflow

IndexNow is used to notify Naver Search Advisor when ToyPoppo pages are created,
updated, or deleted. It does not guarantee indexing, but it can help crawlers
discover changes faster.

## Key file

The public key file is in the site root:

```text
/9f4b7c2e6a1d4f30b8c5e2a9d7f6130c.txt
```

The file content must exactly match the file name without `.txt`.

## Submit updated URLs

From the repository root:

```powershell
python tools/indexnow_submit.py / /blog/ /local-info/
```

Submit absolute URLs:

```powershell
python tools/indexnow_submit.py https://toypoppo.kr/blog/example.html
```

Check the payload without sending:

```powershell
python tools/indexnow_submit.py --dry-run /blog/example.html
```

## When to submit

- New article published
- Existing article substantially updated
- Deleted page now returns 404
- Sitemap changed after a batch update

For deleted pages, submit the deleted page URL after deployment so search engines
can revisit it and see the 404 response.
