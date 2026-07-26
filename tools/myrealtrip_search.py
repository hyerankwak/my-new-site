"""Search MyRealTrip products for ToyPoppo article candidates.

This uses MyRealTrip's public MCP endpoint for product discovery. It does not
create affiliate links; use tools/myrealtrip_mylink.py for that after setting
MRT_API_KEY in .env or the environment.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client


MCP_URL = "https://mcp-servers.myrealtrip.com/mcp"


@dataclass
class Candidate:
    title: str
    url: str
    image: str = ""
    rating: str = ""
    reviews: str = ""
    price: str = ""
    badges: str = ""
    toy_poppo_angle: str = ""


def _load_json_from_tool(result: Any) -> dict[str, Any]:
    for item in getattr(result, "content", []) or []:
        if getattr(item, "type", "") == "text":
            text = getattr(item, "text", "")
            if text.strip().startswith("{"):
                return json.loads(text)
    dumped = result.model_dump(mode="json")
    for item in dumped.get("content", []):
        text = item.get("text", "")
        if text.strip().startswith("{"):
            return json.loads(text)
    return {}


def _walk(node: Any):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from _walk(value)
    elif isinstance(node, list):
        for value in node:
            yield from _walk(value)


def _text_values(node: Any) -> list[str]:
    values: list[str] = []
    for child in _walk(node):
        if child.get("type") == "Text" and isinstance(child.get("value"), str):
            values.append(child["value"].strip())
        if child.get("type") == "Badge" and isinstance(child.get("label"), str):
            values.append(child["label"].strip())
    return [value for value in values if value]


def _first_url(node: Any) -> str:
    for child in _walk(node):
        url = child.get("url")
        if isinstance(url, str) and url.startswith("http"):
            return url
        target = (((child.get("payload") or {}).get("target") or {}).get("url"))
        if isinstance(target, str) and target.startswith("http"):
            return target
    return ""


def _first_image(node: Any) -> str:
    for child in _walk(node):
        if child.get("type") == "Image":
            src = child.get("src", "")
            if isinstance(src, str) and src.startswith("http"):
                return src
    return ""


def _parse_candidate(item: dict[str, Any]) -> Candidate | None:
    values = _text_values(item)
    title = next((v for v in values if not v.startswith("⭐") and not re.search(r"원~?$", v) and v != "예약하기"), "")
    if not title:
        return None

    rating = ""
    reviews = ""
    price = ""
    badges: list[str] = []
    for value in values:
        if value.startswith("⭐"):
            match = re.search(r"([0-9.]+)\s*\(([^)]+)\)", value)
            if match:
                rating = match.group(1)
                reviews = match.group(2)
        elif "원" in value:
            price = value
        elif value not in {title, "예약하기"}:
            badges.append(value)

    angle = "아이와 방문 전 준비물, 대기 시간, 안전, 관찰 질문을 묶은 가족 체험 가이드로 확장하기 좋습니다."
    if any(word in title for word in ["아쿠아", "수족관", "해양", "바다", "낚시", "요트"]):
        angle = "바다 생물 관찰, 멀미·안전 준비, 집에서 이어가는 해양 놀이로 풀기 좋습니다."
    elif any(word in title for word in ["박물관", "궁", "역사", "도슨트", "투어"]):
        angle = "가기 전 이야기, 하브루타 질문, 미션카드, 집 활동자료로 교육형 글을 만들기 좋습니다."
    elif any(word in title for word in ["키즈", "체험", "공방", "클래스"]):
        angle = "연령별 참여 포인트, 아이 컨디션 관리, 체험 후 놀이 확장으로 구성하기 좋습니다."

    return Candidate(
        title=title,
        url=_first_url(item),
        image=_first_image(item),
        rating=rating,
        reviews=reviews,
        price=price,
        badges=" · ".join(dict.fromkeys(badges)),
        toy_poppo_angle=angle,
    )


def _parse_candidates(payload: dict[str, Any]) -> list[Candidate]:
    items = [
        node for node in _walk(payload)
        if node.get("type") == "ListViewItem"
    ]
    candidates: list[Candidate] = []
    for item in items:
        candidate = _parse_candidate(item)
        if candidate and candidate.url:
            candidates.append(candidate)
    return candidates


async def search_tnas(query: str, per_page: int) -> list[Candidate]:
    async with streamablehttp_client(MCP_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool("searchTnas", {"query": query, "perPage": per_page})
            return _parse_candidates(_load_json_from_tool(result))


def filter_candidates(candidates: list[Candidate], include: list[str], exclude: list[str]) -> list[Candidate]:
    filtered: list[Candidate] = []
    for candidate in candidates:
        haystack = " ".join(asdict(candidate).values())
        if include and not all(term in haystack for term in include):
            continue
        if exclude and any(term in haystack for term in exclude):
            continue
        filtered.append(candidate)
    return filtered


def print_markdown(candidates: list[Candidate]) -> None:
    for idx, candidate in enumerate(candidates, 1):
        print(f"{idx}. {candidate.title}")
        print(f"   - URL: {candidate.url}")
        if candidate.image:
            print(f"   - image: {candidate.image}")
        facts = []
        if candidate.rating:
            facts.append(f"평점 {candidate.rating}")
        if candidate.reviews:
            facts.append(f"후기 {candidate.reviews}")
        if candidate.price:
            facts.append(candidate.price)
        if candidate.badges:
            facts.append(candidate.badges)
        if facts:
            print(f"   - 정보: {' / '.join(facts)}")
        print(f"   - 토이포포 각도: {candidate.toy_poppo_angle}")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Search MyRealTrip TNA products.")
    parser.add_argument("query", help="Korean search query, e.g. '제주 아이와 체험'")
    parser.add_argument("--per-page", type=int, default=10)
    parser.add_argument("--include", action="append", default=[], help="Must include term. Can repeat.")
    parser.add_argument("--exclude", action="append", default=[], help="Exclude term. Can repeat.")
    parser.add_argument("--json", action="store_true", help="Print JSON instead of markdown.")
    parser.add_argument("--out", help="Write JSON result to a file.")
    args = parser.parse_args()

    candidates = asyncio.run(search_tnas(args.query, args.per_page))
    candidates = filter_candidates(candidates, args.include, args.exclude)
    data = [asdict(candidate) for candidate in candidates]

    if args.out:
        Path(args.out).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        print_markdown(candidates)


if __name__ == "__main__":
    main()
