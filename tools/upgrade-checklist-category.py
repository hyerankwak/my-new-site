from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://toypoppo.kr"
TODAY = "2026-06-30"


def write_index() -> None:
    title = "육아 체크리스트"
    description = "발달, 놀이, 장난감 선택, 외출, 어린이집 준비, 예방접종 기록 정리, 엄마표 학습을 부모가 바로 확인할 수 있게 정리한 토이포포 체크리스트 센터입니다."
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Organization", "@id": f"{BASE}/#organization", "name": "토이포포", "url": BASE},
            {"@type": "CollectionPage", "name": title, "description": description, "url": f"{BASE}/parenting-tools/", "dateModified": TODAY, "inLanguage": "ko-KR"},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "홈", "item": BASE},
                {"@type": "ListItem", "position": 2, "name": title, "item": f"{BASE}/parenting-tools/"},
            ]},
        ],
    }
    cards = [
        ("개월별 발달 체크리스트", "6~12개월 아이의 발달 모습을 진단이 아닌 관찰 메모로 확인합니다.", "/parenting-tools/development-checklist.html", "발달 관찰"),
        ("오늘의 놀이 체크리스트", "아이 컨디션, 시간, 공간에 맞춰 오늘 할 수 있는 놀이를 고릅니다.", "/parenting-tools/today-play.html", "놀이 선택"),
        ("장난감 선택 체크리스트", "월령, 놀이 목적, 안전성, 정리 편의성을 기준으로 장난감을 고릅니다.", "/parenting-tools/toy-selection-guide.html", "구매 전 확인"),
        ("외출 준비 체크리스트", "짧은 외출과 긴 외출 준비물을 나눠 빠뜨리기 쉬운 물건을 점검합니다.", "/parenting-tools/outing-checklist.html", "외출 준비"),
        ("어린이집 준비물 체크리스트", "입소 전 이름표, 여벌옷, 위생용품, 적응 준비를 차근차근 확인합니다.", "/parenting-tools/daycare-checklist.html", "기관 생활"),
        ("예방접종 기록 체크리스트", "접종일 확정이 아니라 병원 방문 전 기록과 질문을 정리하는 참고용 체크입니다.", "/parenting-tools/vaccination-check.html", "기록 정리"),
        ("엄마표 학습 체크리스트", "나이와 관심 분야에 맞춰 오늘 활용할 자료실 글과 활동지를 고릅니다.", "/parenting-tools/home-learning-recommend.html", "학습 자료"),
    ]
    card_html = "".join(
        f'<a href="{href}"><span class="badge-soft">{badge}</span><strong>{name}</strong><span>{desc}</span></a>'
        for name, desc, href, badge in cards
    )
    body = f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} | 토이포포</title>
  <meta name="description" content="{description}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{BASE}/parenting-tools/">
  <meta property="og:title" content="{title} | 토이포포">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{BASE}/parenting-tools/">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False, separators=(',', ':'))}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
    <nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav>
  </header>
  <main>
    <section class="hero compact checklist-hero">
      <p class="eyebrow">Parenting Checklist Center</p>
      <h1>읽고 끝나는 정보가 아니라, 오늘 바로 확인하는 육아 체크리스트</h1>
      <p>{description}</p>
      <div class="hero-actions"><a class="button primary" href="/parenting-tools/development-checklist.html">발달 체크하기</a><a class="button secondary" href="/parenting-tools/toy-selection-guide.html">장난감 고르기</a></div>
    </section>

    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Checklist Library</p><h2>상황별 체크리스트</h2></div><p>아이를 평가하기보다 부모가 오늘 준비할 일을 정리하는 데 초점을 둡니다.</p></div>
      <div class="link-grid checklist-grid">{card_html}</div>
    </section>

    <section class="section">
      <div class="section-head"><div><p class="eyebrow">How to Use</p><h2>체크리스트를 쓰는 기준</h2></div><p>토이포포 체크리스트는 진단, 처방, 정답표가 아니라 부모의 관찰과 준비를 돕는 자료입니다.</p></div>
      <div class="grid two">
        <div class="info-box"><h3>관찰용으로 사용</h3><p>발달 체크는 아이를 비교하기 위한 표가 아닙니다. 최근에 자주 보이는 행동을 기록하고 다음 놀이를 고르는 참고 자료로 사용합니다.</p></div>
        <div class="info-box"><h3>준비물은 상황별로 조절</h3><p>외출, 어린이집, 학습 준비물은 가족 상황과 기관 안내에 따라 달라질 수 있습니다. 기본 항목을 확인한 뒤 우리 집에 맞게 줄이거나 더하세요.</p></div>
        <div class="info-box"><h3>건강 정보는 공식 안내 우선</h3><p>예방접종 관련 내용은 기록을 정리하는 참고용입니다. 최종 일정과 접종 여부는 의료기관, 예방접종도우미 등 공식 안내를 확인해야 합니다.</p></div>
        <div class="info-box"><h3>관련 글로 이어서 확인</h3><p>각 체크리스트 하단에는 발달놀이, 몬테소리, 상담소, 엄마표 자료실 글을 연결해 부모가 바로 다음 행동을 고를 수 있게 했습니다.</p></div>
      </div>
    </section>

    <section class="principles"><h2>체크리스트 운영 원칙</h2><ul><li>아이를 평가하거나 불안을 키우는 표현을 피합니다.</li><li>부모가 실제 생활에서 확인할 수 있는 항목을 우선합니다.</li><li>의료·발달 판단이 필요한 내용은 전문가 상담과 공식 정보를 안내합니다.</li><li>구매 링크보다 정보와 준비 기준을 먼저 제공합니다.</li></ul></section>
  </main>
  <footer class="site-footer">
    <div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모가이드, 엄마표 자료, 우리동네 육아정보, 체크리스트를 함께 다루는 부모 정보 플랫폼입니다.</p></div>
    <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">콘텐츠 업데이트 정책</a><a href="/affiliate-disclosure.html">쿠팡파트너스 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav>
    <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
  </footer>
</body>
</html>
"""
    (ROOT / "parenting-tools" / "index.html").write_text(body, encoding="utf-8")


def bulk_rename_labels() -> None:
    for path in ROOT.rglob("*.html"):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        original = text
        text = text.replace(">육아도구<", ">체크리스트<")
        text = text.replace(">?????<", ">체크리스트<")
        text = text.replace(">육아도구</a>", ">체크리스트</a>")
        text = text.replace(">?????</a>", ">체크리스트</a>")
        text = text.replace("/ 육아도구 /", "/ 체크리스트 /")
        text = text.replace("/ ????? /", "/ 체크리스트 /")
        text = text.replace("육아도구를 함께", "체크리스트를 함께")
        text = text.replace("육아도구, 우리동네", "체크리스트, 우리동네")
        text = text.replace("육아도구입니다", "체크리스트입니다")
        text = text.replace("실사용 육아도구", "실사용 체크리스트")
        text = text.replace("토이포포의 육아도구", "토이포포의 체크리스트")
        text = text.replace("Parenting Tool", "Parenting Checklist")
        text = text.replace(" | 육아도구 |", " | 체크리스트 |")
        text = text.replace(" | 육아도구\"", " | 체크리스트\"")
        text = text.replace(" | 육아도구<", " | 체크리스트<")
        text = text.replace("headline\":\"엄마표 학습 추천 | 육아도구\"", "headline\":\"엄마표 학습 추천 | 체크리스트\"")
        text = text.replace("예방접종 체크 | 육아도구", "예방접종 기록 체크리스트")
        text = text.replace("articleSection\":\"육아도구", "articleSection\":\"체크리스트")
        if path.name == "vaccination-check.html":
            text = text.replace("<h1>예방접종 체크</h1>", "<h1>예방접종 기록 체크리스트</h1>")
            text = text.replace("예방접종 체크는 접종 일정을 확정하는 도구가 아니라", "예방접종 기록 체크리스트는 접종 일정을 확정하는 도구가 아니라")
        if text != original:
            path.write_text(text, encoding="utf-8")


def update_sitemap() -> None:
    p = ROOT / "sitemap.xml"
    text = p.read_text(encoding="utf-8")
    text = text.replace("<loc>https://toypoppo.kr/parenting-tools/</loc><lastmod>2026-06-27</lastmod>", "<loc>https://toypoppo.kr/parenting-tools/</loc><lastmod>2026-06-30</lastmod>")
    p.write_text(text, encoding="utf-8")


def main() -> None:
    write_index()
    bulk_rename_labels()
    update_sitemap()
    print("Checklist category upgraded")


if __name__ == "__main__":
    main()
