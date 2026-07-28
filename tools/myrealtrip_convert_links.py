"""Convert raw MyRealTrip product URLs in HTML files to myrealt.rip links.

Default mode only scans and reports raw product URLs. Use --write to call the
MyRealTrip partner API and replace the raw URLs with affiliate short links.
Set MRT_API_KEY in .env or as an environment variable before using --write.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from myrealtrip_mylink import create_mylink, load_env


RAW_URL_RE = re.compile(r"https://experiences\.myrealtrip\.com/products/[0-9]+(?:\?[^\"'<>\s]*)?")


def add_tracking(url: str, source_file: Path, index: int) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.setdefault("utm_content", f"toypoppo-{source_file.stem}-{index}")
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def extract_short_url(data: object) -> str | None:
    if isinstance(data, str):
        return data if "myrealt.rip/" in data else None
    if isinstance(data, list):
        for item in data:
            found = extract_short_url(item)
            if found:
                return found
    if isinstance(data, dict):
        for key in ("myLink", "mylink", "shortUrl", "short_url", "affiliateUrl", "affiliate_url", "url", "link"):
            value = data.get(key)
            if isinstance(value, str) and "myrealt.rip/" in value:
                return value
        for value in data.values():
            found = extract_short_url(value)
            if found:
                return found
    return None


def scan(root: Path, pattern: str) -> list[tuple[Path, list[str]]]:
    results: list[tuple[Path, list[str]]] = []
    for path in sorted(root.glob(pattern)):
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        urls = sorted(set(RAW_URL_RE.findall(text)))
        if urls:
            results.append((path, urls))
    return results


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Convert MyRealTrip raw product links to affiliate links.")
    parser.add_argument("--root", default=".", help="Site root to scan.")
    parser.add_argument("--glob", default="**/*.html", help="Glob pattern under root.")
    parser.add_argument("--out", default="tmp/myrealtrip-link-map.json", help="Write mapping JSON here.")
    parser.add_argument("--write", action="store_true", help="Call API and replace links in files.")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of raw URLs processed.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    found = scan(root, args.glob)
    raw_items: list[tuple[Path, str]] = []
    for path, urls in found:
        for url in urls:
            raw_items.append((path, url))

    if args.limit:
        raw_items = raw_items[: args.limit]

    if not raw_items:
        print("No raw MyRealTrip product URLs found.")
        return

    print(f"Found {len(raw_items)} raw MyRealTrip URL(s).")
    for path, url in raw_items:
        print(f"- {path.relative_to(root)} :: {url}")

    if not args.write:
        print("Dry run only. Add --write after setting MRT_API_KEY in .env.")
        return

    load_env()
    mapping: dict[str, dict[str, str]] = {}
    for index, (path, raw_url) in enumerate(raw_items, start=1):
        tracked_url = add_tracking(raw_url, path, index)
        response = create_mylink(tracked_url)
        short_url = extract_short_url(response)
        if not short_url:
            raise SystemExit(f"Could not find myrealt.rip link in API response for {raw_url}: {response}")
        mapping[raw_url] = {
            "trackedUrl": tracked_url,
            "affiliateUrl": short_url,
            "file": str(path.relative_to(root)),
        }
        print(f"Converted: {raw_url} -> {short_url}")

    for path, _urls in found:
        text = path.read_text(encoding="utf-8")
        original = text
        for raw_url, item in mapping.items():
            text = text.replace(raw_url, item["affiliateUrl"])
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"Updated {path.relative_to(root)}")

    out_path = root / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {out_path.relative_to(root)}")


if __name__ == "__main__":
    main()
