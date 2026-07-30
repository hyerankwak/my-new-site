#!/usr/bin/env python3
"""Submit changed ToyPoppo URLs to Naver IndexNow.

The IndexNow key is public by design. This script discovers the key file in the
site root, builds the keyLocation URL, and sends a JSON POST request.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib import error, request


ENDPOINT = "https://searchadvisor.naver.com/indexnow"
DEFAULT_HOST = "toypoppo.kr"
KEY_RE = re.compile(r"^[a-fA-F0-9-]{8,128}$")


def find_site_root() -> Path:
    return Path(__file__).resolve().parents[1]


def find_key(root: Path, host: str) -> tuple[str, str]:
    for path in sorted(root.glob("*.txt")):
        key = path.stem
        if not KEY_RE.fullmatch(key):
            continue
        try:
            content = path.read_text(encoding="utf-8").strip()
        except UnicodeDecodeError:
            continue
        if content == key:
            return key, f"https://{host}/{path.name}"
    raise SystemExit("IndexNow key file was not found in the site root.")


def read_urls(args: argparse.Namespace) -> list[str]:
    values: list[str] = []
    values.extend(args.urls or [])

    if args.from_file:
        path = Path(args.from_file)
        values.extend(
            line.strip()
            for line in path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        )

    seen: set[str] = set()
    urls: list[str] = []
    for value in values:
        url = normalize_url(value, args.host)
        if url not in seen:
            seen.add(url)
            urls.append(url)
    return urls


def normalize_url(value: str, host: str) -> str:
    value = value.strip()
    if value.startswith("/"):
        return f"https://{host}{value}"
    if value.startswith(f"https://{host}/") or value == f"https://{host}":
        return value
    raise SystemExit(f"URL must belong to https://{host}: {value}")


def submit(host: str, key: str, key_location: str, urls: list[str]) -> tuple[int, str]:
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls,
    }
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = request.Request(
        ENDPOINT,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with request.urlopen(req, timeout=30) as res:
            return res.status, res.read().decode("utf-8", errors="replace")
    except error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="*", help="Absolute ToyPoppo URLs or root-relative paths")
    parser.add_argument("--from-file", help="UTF-8 text file containing one URL per line")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = find_site_root()
    key, key_location = find_key(root, args.host)
    urls = read_urls(args)

    if not urls:
        raise SystemExit("No URLs to submit.")
    if len(urls) > 10000:
        raise SystemExit("IndexNow accepts up to 10000 URLs per request.")

    payload_preview = {
        "endpoint": ENDPOINT,
        "host": args.host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls,
    }

    if args.dry_run:
        print(json.dumps(payload_preview, ensure_ascii=False, indent=2))
        return 0

    status, body = submit(args.host, key, key_location, urls)
    print(f"status={status}")
    if body:
        print(body)
    if status in (200, 202):
        return 0
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
