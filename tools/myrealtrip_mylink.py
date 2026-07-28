"""Create MyRealTrip myrealt.rip affiliate short links.

Set MRT_API_KEY in .env or as an environment variable before running.
Example:
  python tools/myrealtrip_mylink.py "https://experiences.myrealtrip.com/products/6082857?utm_content=toypoppo-top"
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib import request


API_URL = "https://partner-ext-api.myrealtrip.com/v1/mylink"


def load_env() -> None:
    env_path = Path(".env")
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def create_mylink(target_url: str) -> dict:
    api_key = os.environ.get("MRT_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("MRT_API_KEY is missing. Create .env with MRT_API_KEY=... and run again.")

    body = json.dumps({"targetUrl": target_url}, ensure_ascii=False).encode("utf-8")
    req = request.Request(
        API_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    with request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Create a MyRealTrip short affiliate link.")
    parser.add_argument("target_url")
    parser.add_argument("--out", help="Write response JSON to file.")
    args = parser.parse_args()

    load_env()
    data = create_mylink(args.target_url)
    text = json.dumps(data, ensure_ascii=False, indent=2)
    if args.out:
        Path(args.out).write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
