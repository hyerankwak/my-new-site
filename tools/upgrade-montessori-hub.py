from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://toypoppo.kr"
TODAY = "2026-06-30"


NAV = """
<header class="site-header">
  <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
  <nav class="nav" aria-label="주요 메뉴">
    <a class="nav-primary" href="/#toy-recommendations">장난감 추천</a>
    <a href="/development-play/">발달놀이</a>
    <a href="/parent-guide/">부모가이드</a>
    <a href="/counseling/">상담소</a>
    <a href="/montessori/">몬테소리</a>
    <a href="/worksheets/">엄마표 자료실</a>
    <a href="/parenting-tools/">육아도구</a>
    <a href="/local-info/">우리동네</a>
  </nav>
</header>
""".strip()


FOOTER = """
<footer class="site-footer">
  <div><strong>토이포포</strong><p>장난감 추천을 넘어 발달놀이, 부모가이드, 몬테소리, 엄마표 자료실을 함께 제공하는 육아 정보 허브입니다.</p></div>
  <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">업데이트 정책</a><a href="/affiliate-disclosure.html">제휴 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의</a></nav>
  <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
</footer>
""".strip()


CORE_LINKS = [
    ("/montessori/what-is-montessori.html", "몬테소리란?"),
    ("/montessori/philosophy.html", "몬테소리 교육 철학"),
    ("/montessori/prepared-environment.html", "준비된 환경 만들기"),
    ("/montessori/sensitive-periods.html", "민감기 이해하기"),
    ("/montessori/five-areas.html", "몬테소리 5대 영역"),
    ("/montessori/age-12-month.html", "12개월 몬테소리"),
    ("/montessori/treasure-basket-play.html", "보물바구니 놀이"),
    ("/montessori/toy-rotation.html", "장난감 로테이션"),
]


REFERENCE_LINKS = [
    ("Association Montessori Internationale", "https://montessori-ami.org/"),
    ("American Montessori Society", "https://amshq.org/"),
    ("국가건강정보포털 영유아 발달 정보", "https://health.kdca.go.kr/"),
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def meta_description(text: str, limit: int = 155) -> str:
    clean = " ".join(text.split())
    return clean[: limit - 1] + "…" if len(clean) > limit else clean


def page_shell(title: str, description: str, canonical: str, body: str, article: bool = True) -> str:
    schema_type = "Article" if article else "CollectionPage"
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{BASE}/#organization",
                "name": "토이포포",
                "url": BASE,
            },
            {
                "@type": schema_type,
                "headline" if article else "name": title,
                "description": description,
                "url": canonical,
                "author": {"@type": "Organization", "name": "토이포포"},
                "publisher": {"@id": f"{BASE}/#organization"},
                "datePublished": TODAY,
                "dateModified": TODAY,
                "inLanguage": "ko-KR",
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "홈", "item": BASE},
                    {"@type": "ListItem", "position": 2, "name": "몬테소리", "item": f"{BASE}/montessori/"},
                    {"@type": "ListItem", "position": 3, "name": title, "item": canonical},
                ],
            },
        ],
    }
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)} | 토이포포</title>
  <meta name="description" content="{esc(meta_description(description))}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{esc(canonical)}">
  <meta property="og:title" content="{esc(title)} | 토이포포">
  <meta property="og:description" content="{esc(meta_description(description))}">
  <meta property="og:type" content="{'article' if article else 'website'}">
  <meta property="og:url" content="{esc(canonical)}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False, separators=(',', ':'))}</script>
</head>
<body>
  {NAV}
  {body}
  {FOOTER}
</body>
</html>
"""


def related_grid(current_slug: str = "") -> str:
    links = [item for item in CORE_LINKS if current_slug not in item[0]][:5]
    cards = "".join(
        f'<a href="{href}"><strong>{esc(label)}</strong><span>몬테소리 철학과 집에서 실천하는 방법을 함께 읽어보세요.</span></a>'
        for href, label in links
    )
    return f'<div class="related-grid">{cards}</div>'


def faq_html(topic: str) -> str:
    faqs = [
        ("몬테소리는 몇 살부터 시작해도 되나요?", "몬테소리는 특정 나이에 맞춰 시작하는 프로그램이라기보다 아이를 관찰하고 환경을 조정하는 방식입니다. 아기가 물건을 보고 손을 뻗는 시기부터는 안전한 물건을 적게 꺼내두고 스스로 탐색하게 하는 것만으로도 충분히 시작할 수 있습니다."),
        ("비싼 몬테소리 교구를 꼭 사야 하나요?", "꼭 필요하지 않습니다. 물 따르기, 양말 짝 맞추기, 낮은 선반 정리, 숟가락 옮기기처럼 집에 있는 생활용품으로도 몬테소리의 핵심인 독립성, 질서감, 집중을 연습할 수 있습니다."),
        ("아이가 금방 싫증 내면 실패한 건가요?", "아닙니다. 아이가 짧게 만지고 떠나는 것도 관찰 자료입니다. 너무 어렵거나, 너무 쉽거나, 주변 자극이 많을 수 있으니 물건 수를 줄이고 다시 제안해보세요."),
        ("부모가 어디까지 도와줘야 하나요?", "위험한 상황은 막아야 하지만, 가능한 부분은 아이가 직접 하도록 기다려주는 것이 좋습니다. 대신 처음에는 천천히 시범을 보이고 말보다 손동작으로 보여주는 편이 도움이 됩니다."),
        ("몬테소리와 일반 놀이의 차이는 무엇인가요?", "몬테소리는 결과물보다 과정, 선택, 반복, 정리, 실제 생활과의 연결을 중요하게 봅니다. 같은 블록 놀이도 아이가 스스로 고르고, 집중하고, 다시 제자리에 놓는 흐름이 있으면 몬테소리적 실천에 가까워집니다."),
    ]
    return f'<section><h2>자주 묻는 질문</h2><p class="mini-summary">{esc(topic)}을 집에서 적용할 때 부모가 자주 헷갈리는 부분을 정리했습니다.</p>' + "".join(
        f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs
    ) + "</section>"


def references_html() -> str:
    items = "".join(f'<li><a href="{href}" target="_blank" rel="noopener">{esc(name)}</a></li>' for name, href in REFERENCE_LINKS)
    return f"""<section>
  <h2>참고 문헌과 확인 자료</h2>
  <p>토이포포의 몬테소리 글은 특정 교구 구매를 유도하기보다, 국제 몬테소리 기관의 기본 철학과 국내 부모가 집에서 활용하기 쉬운 생활 관찰을 함께 정리합니다.</p>
  <ul class="check-list">{items}</ul>
</section>"""


def advisory_html() -> str:
    return """<section class="note-box soft">
  <strong>발달 관련 안내</strong>
  <p>이 콘텐츠는 일반적인 육아 정보를 제공하기 위한 자료입니다. 아이의 발달에는 개인차가 있으며, 건강 또는 발달에 대한 걱정이 있는 경우 소아청소년과 또는 관련 전문가와 상담하시기 바랍니다.</p>
</section>"""


def article_page(slug: str, title: str, intro: str, sections: list[tuple[str, list[str]]], toys: list[str] | None = None) -> None:
    canonical = f"{BASE}/montessori/{slug}.html"
    body_sections = [
        '<main class="article-shell"><article class="article-card readable-article montessori-article">',
        f'<p class="breadcrumb"><a href="/">홈</a> / <a href="/montessori/">몬테소리</a> / {esc(title)}</p>',
        '<p class="eyebrow">Montessori Guide</p>',
        f"<h1>{esc(title)}</h1>",
        f'<p class="modified-date">최종 업데이트: {TODAY}</p>',
        f'<p class="lead">{esc(intro)}</p>',
        '<div class="summary-box"><strong>먼저 기억할 점</strong><ul><li>몬테소리는 교구보다 아이를 관찰하는 태도에서 시작합니다.</li><li>집에서는 물건을 많이 꺼내기보다 적게, 보기 좋게, 아이 손이 닿는 위치에 둡니다.</li><li>부모의 역할은 대신 해주는 사람이 아니라 안전하게 시범을 보이고 기다리는 사람입니다.</li></ul></div>',
    ]
    for heading, paragraphs in sections:
        body_sections.append(f"<section><h2>{esc(heading)}</h2>")
        for p in paragraphs:
            body_sections.append(f"<p>{esc(p)}</p>")
        body_sections.append("</section>")
    if toys:
        cards = "".join(
            f'<div class="product-card"><div class="thumb">◌</div><div><h3>{esc(t)}</h3><p>{esc(t)}은 아이가 스스로 선택하고 반복하기 쉬운 형태인지, 정리가 쉬운지, 현재 발달 단계와 연결되는지를 먼저 확인합니다. 상품명보다 사용 맥락을 먼저 보는 것이 토이포포의 추천 기준입니다.</p><a href="/posts/montessori-toys-guide.html" class="text-link">관련 장난감 기준 보기</a></div></div>'
            for t in toys[:4]
        )
        body_sections.append(f'<section><h2>관련 장난감과 교구를 고를 때</h2><div class="grid two">{cards}</div></section>')
    body_sections.extend([
        '<section><h2>함께 보면 좋은 글</h2>',
        related_grid(slug),
        "</section>",
        faq_html(title),
        references_html(),
        advisory_html(),
        "</article></main>",
    ])
    (ROOT / "montessori" / f"{slug}.html").write_text(
        page_shell(title, intro, canonical, "\n".join(body_sections)),
        encoding="utf-8",
    )


COMMON_PARAGRAPHS = {
    "observe": "몬테소리에서 관찰은 평가가 아니라 이해에 가깝습니다. 아이가 무엇을 오래 만지는지, 어떤 순서로 반복하는지, 언제 짜증을 내는지를 보면 지금 필요한 환경이 보입니다. 부모가 미리 정답을 정해두면 아이의 관심을 놓치기 쉽습니다.",
    "environment": "집에서의 준비된 환경은 거창한 교실을 뜻하지 않습니다. 아이가 직접 꺼낼 수 있는 낮은 선반, 한눈에 보이는 바구니, 스스로 닦을 수 있는 작은 천, 끝나면 되돌려놓을 자리가 있으면 충분합니다.",
    "independence": "독립성은 혼자 두는 것이 아니라 아이가 할 수 있는 부분을 아이에게 돌려주는 일입니다. 양말을 고르게 하기, 물컵을 잡게 하기, 흘린 물을 함께 닦기처럼 작은 선택이 쌓이면 아이는 '내가 해볼 수 있다'는 감각을 얻습니다.",
    "repeat": "아이는 어른이 보기엔 단순한 행동을 여러 번 반복합니다. 같은 공을 굴리고, 같은 컵에 물을 따르고, 같은 책장을 넘기는 반복 속에서 손의 힘, 예측, 질서감, 집중 시간이 자랍니다.",
}


def make_pages() -> list[str]:
    montessori_dir = ROOT / "montessori"
    montessori_dir.mkdir(exist_ok=True)
    pages: list[str] = []

    index_description = "몬테소리란 무엇인지부터 준비된 환경, 민감기, 5대 영역, 연령별 실천법, 부모 가이드까지 집에서 따라 할 수 있게 정리한 토이포포 몬테소리 교육 허브입니다."
    hub_cards = [
        ("처음 시작하기", "몬테소리란 무엇인지, 일반 교육과 무엇이 다른지 차분히 읽어보세요.", "/montessori/what-is-montessori.html"),
        ("교육 철학", "존중, 관찰, 기다림, 독립, 반복, 실수할 자유를 생활 사례로 이해합니다.", "/montessori/philosophy.html"),
        ("준비된 환경", "낮은 선반, 작은 테이블, 정리 흐름, 장난감 배치를 집 구조에 맞춰 봅니다.", "/montessori/prepared-environment.html"),
        ("민감기", "질서감, 언어, 움직임, 감각, 사회성 민감기를 부모 관점으로 정리합니다.", "/montessori/sensitive-periods.html"),
        ("5대 영역", "일상생활, 감각, 언어, 수학, 문화 영역이 어떻게 연결되는지 봅니다.", "/montessori/five-areas.html"),
        ("연령별 몬테소리", "6개월부터 48개월까지 발달 특징과 활동을 나눠 확인합니다.", "/montessori/age-6-month.html"),
        ("집에서 실천하기", "보물바구니, 로테이션, 주방놀이, 청소놀이처럼 오늘 바로 할 수 있는 활동입니다.", "/montessori/treasure-basket-play.html"),
        ("부모 가이드", "기다리기, 도와주지 않기, 관찰하기처럼 부모 태도를 구체적으로 다룹니다.", "/montessori/waiting-parent-guide.html"),
        ("추천 도서", "몬테소리 입문서, 부모 교육서, 그림책을 읽는 순서대로 정리합니다.", "/montessori/montessori-books.html"),
        ("FAQ", "부모들이 가장 많이 묻는 질문 20가지를 한곳에 모았습니다.", "/montessori/faq.html"),
    ]
    hub_html = "".join(f'<a href="{href}"><strong>{esc(title)}</strong><span>{esc(desc)}</span></a>' for title, desc, href in hub_cards)
    body = f"""
<main>
  <section class="hero montessori-hero">
    <p class="eyebrow">Montessori at Home</p>
    <h1>몬테소리는 교구가 아니라 아이를 존중하는 생활 방식입니다</h1>
    <p>{esc(index_description)}</p>
    <div class="hero-actions"><a class="button primary" href="/montessori/what-is-montessori.html">처음부터 읽기</a><a class="button secondary" href="/montessori/prepared-environment.html">집 환경 만들기</a></div>
  </section>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">Start Here</p><h2>몬테소리 시작 지도</h2></div><p>처음 읽는 부모도 순서대로 따라올 수 있게 핵심 주제를 묶었습니다.</p></div>
    <div class="link-grid">{hub_html}</div>
  </section>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">Five Areas</p><h2>몬테소리 5대 영역</h2></div><p>교구 이름보다 각 영역이 아이의 어떤 생활 능력과 연결되는지 먼저 봅니다.</p></div>
    <div class="link-grid">
      <a href="/montessori/practical-life.html"><strong>일상생활 영역</strong><span>물 따르기, 닦기, 쓸기, 옮기기, 옷 입기, 식탁 차리기</span></a>
      <a href="/montessori/sensorial-area.html"><strong>감각 영역</strong><span>촉감, 색, 소리, 무게, 크기, 온도, 냄새를 섬세하게 구분하기</span></a>
      <a href="/montessori/language-area.html"><strong>언어 영역</strong><span>사물 이름, 그림책, 이야기하기, 읽기와 쓰기 준비</span></a>
      <a href="/montessori/math-area.html"><strong>수학 영역</strong><span>수량감, 분류, 순서, 패턴, 비교, 숫자와 도형</span></a>
      <a href="/montessori/cultural-area.html"><strong>문화 영역</strong><span>동물, 식물, 계절, 날씨, 지도, 한국사와 세계 이해</span></a>
      <a href="/montessori/sensitive-periods.html"><strong>민감기</strong><span>아이가 특정 활동에 강하게 끌리는 시기를 부모가 돕는 방법</span></a>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">Age Guide</p><h2>연령별 몬테소리</h2></div><p>월령과 나이에 따라 환경, 활동, 주의점이 달라집니다.</p></div>
    <div class="toy-month-grid">
      {''.join(f'<a href="/montessori/age-{age}.html"><strong>{label}</strong><span>{desc}</span></a>' for age, label, desc in [
        ("6-month","6개월","감각 탐색과 안정된 반복"),("7-month","7개월","보물바구니와 손 탐색"),("8-month","8개월","기어가기와 원인 결과"),("9-month","9개월","집중과 소근육"),("10-month","10개월","넣고 빼기"),("11-month","11개월","잡고 서기와 옮기기"),("12-month","12개월","첫 독립성"),("18-month","18개월","생활놀이와 언어"),("24-month","24개월","질서감과 역할놀이"),("36-month","36개월","분류와 선택"),("48-month","48개월","문화·수학 확장")
      ])}
    </div>
  </section>
  <section class="principles"><h2>토이포포 몬테소리 콘텐츠 원칙</h2><ul><li>교구 구매보다 아이 관찰과 환경 구성을 먼저 설명합니다.</li><li>발달 단계와 가정의 실제 생활 흐름을 함께 고려합니다.</li><li>부모가 오늘 바로 따라 할 수 있는 활동으로 풀어 씁니다.</li><li>건강과 발달 진단을 대체하지 않으며, 걱정되는 경우 전문가 상담을 권합니다.</li></ul></section>
</main>
"""
    (montessori_dir / "index.html").write_text(page_shell("몬테소리 교육 가이드", index_description, f"{BASE}/montessori/", body, article=False), encoding="utf-8")
    pages.append("/montessori/")

    core_articles = [
        ("what-is-montessori", "몬테소리란? 부모가 처음 읽는 입문 가이드", "몬테소리는 아이를 통제하는 교육법이 아니라 스스로 배우려는 힘을 존중하는 교육 철학입니다. 집에서 시작할 때는 교구 이름보다 아이의 선택, 반복, 정리, 독립성을 먼저 이해하는 것이 중요합니다.", [
            ("몬테소리를 만든 사람과 배경", ["마리아 몬테소리는 아이가 스스로 배우는 능력을 가진 존재라고 보았습니다. 어른이 지식을 밀어 넣는 방식보다 아이가 손으로 만지고 반복하며 이해하는 과정을 중요하게 여겼습니다.", COMMON_PARAGRAPHS["observe"]]),
            ("일반 교육과 다른 점", ["몬테소리에서는 부모가 계속 설명하고 평가하기보다 아이가 직접 선택하고 시도할 시간을 줍니다. 틀렸을 때 바로 고쳐주기보다 아이가 다시 해볼 수 있는 환경을 만드는 것이 핵심입니다.", COMMON_PARAGRAPHS["repeat"]]),
            ("부모가 가장 많이 오해하는 것", ["몬테소리라는 이름이 붙은 교구를 많이 사면 되는 것으로 생각하기 쉽지만, 실제 핵심은 환경과 태도입니다. 컵, 숟가락, 작은 수건, 낮은 바구니도 충분히 좋은 시작이 됩니다.", COMMON_PARAGRAPHS["environment"]]),
        ], ["보물바구니", "낮은 선반", "실생활 도구", "그림책"]),
        ("philosophy", "몬테소리 교육 철학: 존중, 관찰, 기다림, 독립", "몬테소리 철학은 아이를 작은 어른으로 대하자는 뜻이 아닙니다. 아이의 속도를 존중하고, 할 수 있는 일을 빼앗지 않으며, 실수할 자유 속에서 배움을 경험하게 하는 태도입니다.", [
            ("존중과 관찰", ["존중은 아이에게 모든 것을 허용한다는 뜻이 아닙니다. 아이가 왜 그 행동을 반복하는지 먼저 보고, 위험하지 않은 범위에서 탐색을 이어갈 수 있게 공간을 조정하는 일입니다.", COMMON_PARAGRAPHS["observe"]]),
            ("기다림과 실수할 자유", ["아이가 양말을 신다가 실패해도 바로 신겨주지 않고, 필요한 만큼 시간을 주는 것이 기다림입니다. 실수는 혼날 일이 아니라 몸으로 배움을 정리하는 과정입니다.", COMMON_PARAGRAPHS["independence"]]),
            ("집중과 반복", ["아이의 집중은 조용히 앉아 있는 모습으로만 나타나지 않습니다. 컵을 계속 쌓고 무너뜨리거나 같은 책을 반복해서 보는 것도 집중의 한 형태입니다.", COMMON_PARAGRAPHS["repeat"]]),
        ], ["끼우기 교구", "분류 바구니", "생활 도구", "정리 바구니"]),
        ("prepared-environment", "집에서 만드는 몬테소리 준비된 환경", "준비된 환경은 아이가 직접 보고, 고르고, 사용하고, 정리할 수 있게 만든 생활 공간입니다. 큰 비용보다 아이 눈높이, 물건 수, 정리 동선이 더 중요합니다.", [
            ("낮은 선반과 아이 높이", ["아이 손이 닿는 곳에 4~6가지 활동만 놓아두면 선택이 쉬워집니다. 물건이 많으면 풍성해 보이지만 실제로는 집중을 방해할 수 있습니다.", COMMON_PARAGRAPHS["environment"]]),
            ("작은 테이블과 생활용품", ["작은 테이블은 미술, 퍼즐, 옮기기 활동의 기준점이 됩니다. 아이가 자기 자리를 경험하면 활동을 시작하고 끝내는 감각도 함께 자랍니다.", COMMON_PARAGRAPHS["independence"]]),
            ("정리하는 방법", ["정리는 부모가 뒤에서 몰래 하는 일이 아니라 활동의 일부입니다. 바구니마다 한 가지 활동만 담고, 사진 라벨을 붙이면 아이가 되돌려놓기 쉽습니다.", "처음에는 부모가 천천히 한 번 보여주고, 다음에는 아이 손을 잡아 함께 해보며, 익숙해지면 말없이 기다려주는 순서가 좋습니다."]),
        ], ["낮은 선반", "작은 테이블", "정리 바구니", "사진 라벨"]),
        ("sensitive-periods", "몬테소리 민감기: 아이가 강하게 끌리는 시기 이해하기", "민감기는 아이가 특정 자극이나 활동에 유난히 관심을 보이는 시기입니다. 부모가 이를 알아차리면 억지 학습이 아니라 자연스러운 흥미를 따라 환경을 준비할 수 있습니다.", [
            ("질서감 민감기", ["물건의 자리가 바뀌면 싫어하거나 같은 순서를 고집하는 모습은 단순한 고집이 아니라 질서감이 자라는 과정일 수 있습니다. 일정한 자리, 예측 가능한 순서가 아이를 안정시킵니다.", COMMON_PARAGRAPHS["environment"]]),
            ("언어와 움직임 민감기", ["같은 말을 반복하거나 사물 이름을 계속 묻는 시기에는 짧고 정확한 언어가 도움이 됩니다. 움직임 민감기에는 기어가기, 옮기기, 밀기처럼 몸을 쓰는 활동을 안전하게 열어주는 것이 좋습니다.", COMMON_PARAGRAPHS["repeat"]]),
            ("작은 것과 감각에 대한 관심", ["먼지, 단추, 작은 그림처럼 어른에게 사소해 보이는 것을 오래 보는 시기가 있습니다. 위험한 작은 물건은 치우되, 안전한 분류 활동과 촉감 활동으로 관심을 이어갈 수 있습니다."]),
        ], ["감각 바구니", "그림카드", "분류 교구", "소근육 도구"]),
        ("five-areas", "몬테소리 5대 영역 한눈에 보기", "몬테소리 5대 영역은 일상생활, 감각, 언어, 수학, 문화입니다. 영역은 따로 떨어져 있지 않고 아이가 생활 속에서 몸, 감각, 말, 생각을 연결하도록 돕습니다.", [
            ("일상생활과 감각", ["일상생활 영역은 물 따르기, 닦기, 옮기기처럼 실제 생활 능력을 다룹니다. 감각 영역은 색, 소리, 무게, 크기, 질감의 차이를 섬세하게 느끼는 경험입니다.", COMMON_PARAGRAPHS["independence"]]),
            ("언어와 수학", ["언어 영역은 그림책만 뜻하지 않습니다. 사물 이름을 정확히 말하고, 아이의 말을 기다리고, 경험을 짧은 문장으로 연결하는 모든 순간이 언어 준비입니다. 수학은 숫자 암기보다 분류, 순서, 비교에서 시작합니다."]),
            ("문화 영역", ["문화 영역은 나라 이름을 외우는 과목이 아니라 동물, 식물, 계절, 날씨, 지도, 역사처럼 아이가 세상을 넓게 이해하는 길입니다. 산책과 그림책, 워크지를 함께 연결하면 자연스럽습니다."]),
        ], ["분류 교구", "숫자 퍼즐", "그림카드", "자연 관찰 도구"]),
    ]
    for slug, title, intro, sections, toys in core_articles:
        article_page(slug, title, intro, sections, toys)
        pages.append(f"/montessori/{slug}.html")

    area_pages = [
        ("practical-life", "몬테소리 일상생활 영역: 물 따르기부터 식탁 차리기까지", "일상생활 영역은 아이가 자기 몸과 주변 환경을 돌보는 힘을 키우는 영역입니다. 물 따르기, 닦기, 쓸기, 옮기기처럼 단순해 보이는 활동이 독립성과 집중의 기초가 됩니다.", ["물 따르기", "닦기와 쓸기", "신발 신기와 옷 개기", "식탁 차리기"]),
        ("sensorial-area", "몬테소리 감각 영역: 촉감, 색, 소리, 크기를 섬세하게 느끼기", "감각 영역은 아이가 세상을 구분하고 이해하는 첫 언어입니다. 촉감, 색깔, 소리, 무게, 길이, 크기, 온도, 냄새를 비교하며 사고의 기초를 만듭니다.", ["촉감판", "색 분류", "소리통", "크기 비교"]),
        ("language-area", "몬테소리 언어 영역: 말하기, 읽기, 쓰기의 준비", "언어 영역은 글자를 빨리 가르치는 것이 아니라 아이가 경험을 말로 연결하고, 사물 이름을 알고, 이야기를 듣고 표현하는 과정을 충분히 쌓는 일입니다.", ["그림카드", "사물 이름 놀이", "그림책", "모래 글자"]),
        ("math-area", "몬테소리 수학 영역: 수량감과 패턴을 생활 속에서 익히기", "수학 영역은 숫자 암기보다 수량감, 분류, 순서, 패턴, 비교에서 시작합니다. 컵을 크기대로 놓고, 블록을 색별로 모으는 활동도 수학 준비가 됩니다.", ["분류 바구니", "숫자 카드", "패턴 블록", "도형 퍼즐"]),
        ("cultural-area", "몬테소리 문화 영역: 동물, 식물, 계절, 지도, 한국사로 넓어지는 세상", "문화 영역은 아이가 자기 주변을 넘어 자연과 사회를 이해하도록 돕습니다. 동물, 식물, 계절, 날씨, 우주, 지도, 한국사를 생활 경험과 연결해 주세요.", ["동물 카드", "식물 키우기", "지도 퍼즐", "한국사 워크지"]),
    ]
    for slug, title, intro, activities in area_pages:
        sections = [
            ("이 영역이 중요한 이유", [intro, COMMON_PARAGRAPHS["observe"], COMMON_PARAGRAPHS["repeat"]]),
            ("집에서 시작하는 방법", [f"{', '.join(activities[:2])}처럼 집에 이미 있는 물건을 활용하면 부담 없이 시작할 수 있습니다. 활동은 한 번에 하나씩 꺼내고, 아이가 끝낸 뒤 제자리에 놓는 흐름까지 보여주세요.", COMMON_PARAGRAPHS["environment"]]),
            ("부모가 주의할 점", ["몬테소리 활동은 결과물을 빨리 만드는 시간이 아닙니다. 아이가 천천히 손을 쓰고, 중간에 멈추고, 다시 시도하는 과정을 지켜보는 것이 더 중요합니다.", "활동이 너무 어렵다면 단계를 줄이고, 너무 쉽다면 도구 수를 조금 늘리는 식으로 조절하세요."]),
        ]
        article_page(slug, title, intro, sections, activities)
        pages.append(f"/montessori/{slug}.html")

    age_data = [
        ("age-6-month", "6개월 몬테소리: 감각 탐색과 안정된 반복", "6개월 아기는 손을 뻗고, 입으로 확인하고, 익숙한 사람의 목소리와 표정을 통해 세상을 배웁니다. 이 시기의 몬테소리는 많은 장난감보다 안전한 감각 경험과 안정된 반복이 중심입니다.", ["헝겊책", "부드러운 촉감 천", "안전 거울", "가벼운 공"]),
        ("age-7-month", "7개월 몬테소리: 보물바구니와 손 탐색", "7개월 무렵에는 앉아서 손으로 만지고 돌리고 두드리는 탐색이 늘어납니다. 보물바구니처럼 안전한 생활 물건을 적게 담아 스스로 고르게 하는 활동이 잘 맞습니다.", ["보물바구니", "나무 링", "촉감볼", "거울"]),
        ("age-8-month", "8개월 몬테소리: 이동 욕구와 원인 결과 놀이", "8개월 아기는 몸을 움직여 원하는 것에 다가가고, 누르면 소리가 나거나 굴리면 움직이는 원인 결과에 관심을 보입니다. 안전한 이동 공간과 단순한 반복 장난감이 좋습니다.", ["굴러가는 공", "소리통", "낮은 터널", "원인결과 상자"]),
        ("age-9-month", "9개월 몬테소리: 소근육과 집중을 키우는 놀이", "9개월에는 손가락을 더 섬세하게 쓰기 시작하고, 넣고 빼기 전 단계의 탐색이 늘어납니다. 작은 부품은 피하되 잡기 쉬운 물건으로 손의 협응을 도와주세요.", ["큰 링", "말랑 블록", "큰 컵", "촉감 바구니"]),
        ("age-10-month", "10개월 몬테소리: 넣고 빼기, 열고 닫기", "10개월 아기는 물건을 넣었다 빼고, 문을 열고 닫고, 같은 행동을 반복하며 결과를 확인합니다. 단순한 구조의 바구니와 상자가 좋은 교구가 됩니다.", ["넣고 빼기 상자", "컵쌓기", "뚜껑 있는 통", "큰 블록"]),
        ("age-11-month", "11개월 몬테소리: 잡고 서기와 옮기기", "11개월은 잡고 서기, 옮기기, 밀고 당기기 같은 대근육 활동이 많아집니다. 환경은 넓고 단순하게, 활동은 아이가 안전하게 반복할 수 있게 준비합니다.", ["밀기 장난감", "낮은 바구니", "천 공", "잡기 쉬운 책"]),
        ("age-12-month", "12개월 몬테소리: 첫 독립성을 돕는 생활놀이", "12개월 전후에는 '내가 해볼래'라는 욕구가 조금씩 보입니다. 먹기, 닦기, 넣기, 가져오기 같은 생활 참여가 몬테소리 활동의 좋은 출발점입니다.", ["작은 컵", "닦기 천", "그림책", "끼우기 링"]),
        ("age-18-month", "18개월 몬테소리: 언어와 생활놀이가 커지는 시기", "18개월 무렵에는 말귀가 늘고 모방이 활발해집니다. 쓸기, 닦기, 물주기, 옷 넣기처럼 실제 생활을 흉내 내는 활동이 집중력을 키웁니다.", ["작은 빗자루", "물뿌리개", "분류 바구니", "첫 퍼즐"]),
        ("age-24-month", "24개월 몬테소리: 질서감과 역할놀이를 연결하기", "24개월 두돌 아이는 순서, 자리, 역할에 관심이 커집니다. 주방놀이, 병원놀이, 책 정리처럼 생활 질서가 있는 활동이 잘 맞습니다.", ["역할놀이 도구", "큰 퍼즐", "생활 그림책", "분류 상자"]),
        ("age-36-month", "36개월 몬테소리: 분류, 선택, 긴 집중의 시작", "36개월에는 색, 모양, 크기, 용도에 따라 분류하는 힘이 자랍니다. 아이가 선택하고 마무리하는 시간이 길어질 수 있으니 방해하지 않는 환경이 중요합니다.", ["분류 카드", "도형 퍼즐", "가위 입문", "숫자 놀이"]),
        ("age-48-month", "48개월 몬테소리: 문화와 수학으로 넓어지는 관심", "48개월에는 왜 그런지 묻고, 규칙 있는 활동과 이야기 확장을 즐깁니다. 동물, 지도, 계절, 숫자, 패턴을 생활과 연결하면 깊은 탐구로 이어집니다.", ["지도 퍼즐", "자연 관찰", "숫자 교구", "한국사 워크지"]),
    ]
    for slug, title, intro, toys in age_data:
        sections = [
            ("발달 특징", [intro, "이 시기의 아이는 같은 활동을 여러 번 반복하면서 몸의 조절과 예측 능력을 키웁니다. 부모가 보기엔 단순해 보여도 아이에게는 손, 눈, 몸, 감각을 맞추는 중요한 연습입니다."]),
            ("추천 환경", [COMMON_PARAGRAPHS["environment"], "활동은 한 바구니에 하나씩 담고, 아이가 직접 꺼내고 넣을 수 있는 높이에 둡니다. 너무 많은 물건보다 익숙한 물건 몇 가지가 집중에 유리합니다."]),
            ("추천 활동", [f"{', '.join(toys[:3])}을 활용해 짧고 반복 가능한 활동을 만들어보세요. 부모가 먼저 천천히 보여준 뒤 아이가 따라 하지 않아도 잠시 기다려주는 것이 좋습니다.", COMMON_PARAGRAPHS["repeat"]]),
            ("주의사항", ["입에 넣는 시기에는 작은 부품, 벗겨지는 코팅, 끈이 긴 물건을 피합니다. 아이가 피곤하거나 배고플 때는 활동보다 안정과 휴식이 먼저입니다."]),
        ]
        article_page(slug, title, intro, sections, toys)
        pages.append(f"/montessori/{slug}.html")

    practice_pages = [
        ("treasure-basket-play", "몬테소리 보물바구니 놀이: 생활 물건으로 감각을 여는 방법", "보물바구니는 아기에게 안전한 생활 물건을 담아 스스로 탐색하게 하는 몬테소리식 감각 놀이입니다. 비싼 교구보다 다양한 질감과 무게, 소리를 경험하는 것이 핵심입니다.", ["나무 숟가락", "천 조각", "스테인리스 컵", "실리콘 컵"]),
        ("toy-rotation", "몬테소리 장난감 로테이션: 적게 꺼내 오래 노는 정리법", "장난감 로테이션은 장난감을 많이 사는 대신 일부만 꺼내두고 주기적으로 바꾸는 방법입니다. 아이의 집중을 돕고 부모의 정리 부담도 줄입니다.", ["낮은 선반", "분류 바구니", "사진 라벨", "보관 상자"]),
        ("montessori-home-play", "집에서 하는 몬테소리 놀이: 교구 없이 시작하는 하루 활동", "집에서 하는 몬테소리 놀이는 특별한 교구보다 생활 흐름 안에서 시작됩니다. 물 따르기, 빨래 넣기, 책 고르기, 식물 물주기처럼 아이가 참여할 수 있는 작은 일이 좋은 활동입니다.", ["작은 컵", "수건", "바구니", "그림책"]),
        ("everyday-life-play", "몬테소리 일상생활 놀이: 물 따르기, 닦기, 옮기기", "일상생활 놀이는 아이가 자기 몸과 집을 돌보는 감각을 키우는 활동입니다. 실제 생활과 연결되어 있어 아이가 놀이가 끝난 뒤에도 의미를 기억하기 쉽습니다.", ["물 따르기 컵", "작은 천", "집게", "쟁반"]),
        ("kitchen-play", "몬테소리 주방놀이: 씻기, 담기, 섞기부터 시작하기", "주방은 아이가 실제 생활을 배울 수 있는 좋은 공간입니다. 안전을 확보한 뒤 씻기, 담기, 섞기처럼 작은 역할을 맡기면 독립성과 질서감이 자랍니다.", ["작은 볼", "나무 주걱", "채소 모형", "앞치마"]),
        ("cleaning-play", "몬테소리 청소놀이: 흘린 물을 함께 닦는 법", "청소놀이는 혼내는 대신 회복하는 경험을 알려줍니다. 흘린 물을 닦고, 먼지를 털고, 작은 빗자루를 쓰는 과정에서 책임감과 몸 조절이 자랍니다.", ["작은 빗자루", "걸레", "스프레이 병", "정리 바구니"]),
        ("cooking-play", "몬테소리 요리놀이: 안전하게 참여하는 준비 활동", "요리놀이는 감각, 순서, 언어, 수학이 한 번에 연결되는 활동입니다. 재료를 씻고, 나누고, 담는 과정만으로도 아이는 많은 것을 배웁니다.", ["계량컵", "작은 집게", "안전 칼", "도마"]),
        ("nature-walk", "몬테소리 산책: 자연 관찰을 놀이로 바꾸는 방법", "산책은 문화 영역과 감각 영역을 자연스럽게 연결합니다. 잎의 모양, 돌의 무게, 바람의 느낌, 계절의 변화를 천천히 관찰하게 해주세요.", ["자연 관찰통", "돋보기", "그림카드", "작은 가방"]),
        ("plant-care", "몬테소리 식물 키우기: 물주기와 관찰 습관 만들기", "식물 키우기는 생명을 돌보는 경험입니다. 물을 너무 많이 주면 안 된다는 점, 매일 조금씩 자란다는 점을 통해 기다림과 책임감을 배웁니다.", ["물뿌리개", "작은 화분", "관찰 카드", "스티커 달력"]),
    ]
    for slug, title, intro, toys in practice_pages:
        sections = [
            ("놀이 준비", [intro, "처음에는 물건 수를 줄이고, 부모가 먼저 천천히 시범을 보입니다. 아이가 따라 하지 않아도 바로 설명을 늘리지 말고 손으로 만질 시간을 주세요."]),
            ("놀이 방법", [f"{', '.join(toys[:2])}을 한 쟁반이나 바구니에 담아 아이가 직접 선택하게 합니다. 활동이 끝나면 함께 제자리에 놓고, 다음 활동으로 넘어갑니다.", COMMON_PARAGRAPHS["independence"]]),
            ("몬테소리 관점에서 보는 의미", [COMMON_PARAGRAPHS["repeat"], "이 활동의 목적은 결과물이 아니라 아이가 손을 조절하고 순서를 예측하며 스스로 해냈다는 감각을 얻는 것입니다."]),
            ("부모가 실천할 때 주의할 점", ["아이가 어지르거나 느리게 해도 바로 빼앗지 마세요. 위험하지 않다면 끝까지 경험하게 두고, 위험한 도구는 대체 도구로 바꾸면 됩니다."]),
        ]
        article_page(slug, title, intro, sections, toys)
        pages.append(f"/montessori/{slug}.html")

    parent_pages = [
        ("waiting-parent-guide", "몬테소리 부모 가이드: 아이를 기다리는 방법", "아이를 기다리는 일은 아무것도 하지 않는 것이 아닙니다. 부모가 개입하고 싶은 순간을 알아차리고, 아이가 스스로 해볼 시간을 안전하게 지켜주는 적극적인 태도입니다."),
        ("independence-parent-guide", "혼자 하게 두는 법: 몬테소리 독립성 키우기", "독립성은 아이를 방치하는 것이 아니라 할 수 있는 일을 아이에게 돌려주는 것입니다. 부모가 조금 느린 시간을 견딜 때 아이는 자기 힘을 경험합니다."),
        ("observe-not-praise", "칭찬보다 관찰: 몬테소리식 말 걸기", "몬테소리에서는 과한 칭찬보다 아이가 한 행동을 구체적으로 말해주는 관찰 언어를 중요하게 봅니다. 아이는 평가보다 자기 행동을 인식하는 힘을 얻습니다."),
        ("too-many-toys-montessori", "장난감이 많으면 좋을까? 몬테소리 관점의 정리 기준", "장난감이 많을수록 아이가 오래 노는 것은 아닙니다. 선택지가 너무 많으면 고르기 어렵고, 활동의 시작과 끝이 흐려질 수 있습니다."),
        ("expensive-materials", "비싼 몬테소리 교구가 꼭 필요할까?", "몬테소리 교구는 아름답고 체계적이지만 모든 가정이 반드시 갖춰야 하는 것은 아닙니다. 핵심은 아이의 발달 욕구와 생활 속 실천입니다."),
    ]
    for slug, title, intro in parent_pages:
        sections = [
            ("부모가 먼저 바꿔야 할 관점", [intro, COMMON_PARAGRAPHS["observe"], COMMON_PARAGRAPHS["independence"]]),
            ("집에서 바로 적용하는 방법", ["오늘은 한 가지 상황만 정해보세요. 신발 신기, 물컵 잡기, 책 고르기처럼 아이가 자주 마주치는 장면 하나에서 부모의 손을 조금 늦추는 것으로 충분합니다.", COMMON_PARAGRAPHS["environment"]]),
            ("실패처럼 보이는 순간 다루기", ["아이가 울거나 던지거나 거절할 때는 활동을 밀어붙이지 않습니다. 피곤함, 어려움, 배고픔, 과한 자극을 먼저 살피고 다음에 다시 제안해도 늦지 않습니다."]),
        ]
        article_page(slug, title, intro, sections, ["정리 바구니", "사진 라벨", "생활 도구", "그림책"])
        pages.append(f"/montessori/{slug}.html")

    article_page("montessori-books", "몬테소리 추천 도서: 부모가 먼저 읽기 좋은 책 고르는 법", "몬테소리 도서는 교구 사용법만 알려주는 책보다 아이를 바라보는 관점, 준비된 환경, 부모의 언어를 다루는 책부터 읽는 것이 좋습니다. 그림책과 육아서를 함께 연결하면 실천이 쉬워집니다.", [
        ("입문서는 어떤 기준으로 고를까", ["처음에는 이론이 너무 어려운 책보다 생활 사례가 많은 책이 좋습니다. 관찰, 기다림, 환경 구성, 일상생활 활동이 구체적으로 설명된 책을 우선으로 보세요."]),
        ("부모 교육서와 그림책 연결", ["부모 교육서는 부모의 태도를 바꾸는 데 도움을 주고, 그림책은 아이와 대화하는 재료가 됩니다. 책을 읽은 뒤 집에서 할 수 있는 생활 활동 하나로 연결하면 좋습니다."]),
        ("책을 읽고 바로 실천하는 방법", ["책 내용을 모두 실천하려고 하면 오래가지 않습니다. 한 주에 한 가지, 예를 들어 낮은 선반 정리나 물 따르기 활동처럼 작은 실천을 정해보세요."]),
    ], ["입문서", "부모 교육서", "그림책", "활동 카드"])
    pages.append("/montessori/montessori-books.html")

    # FAQ page with 20 questions
    faq_items = [
        ("몬테소리는 몇 살부터 시작하나요?", "태어나자마자 교구를 준비해야 한다는 뜻은 아닙니다. 아기가 손을 뻗고, 소리를 듣고, 익숙한 사람의 표정을 바라보는 순간부터 부모가 환경을 단순하게 정리하고 아이의 반응을 기다리는 방식으로 시작할 수 있습니다."),
        ("몬테소리 교구를 꼭 사야 하나요?", "꼭 그렇지 않습니다. 컵, 수건, 바구니, 숟가락, 양말처럼 집에 있는 물건도 충분히 좋은 활동 재료가 됩니다. 교구를 산다면 먼저 아이가 어떤 행동을 반복하는지 관찰한 뒤 필요한 것만 선택하는 편이 좋습니다."),
        ("집이 좁아도 준비된 환경을 만들 수 있나요?", "가능합니다. 방 전체를 바꾸기보다 거실 한쪽, 낮은 선반 한 칸, 작은 바구니 두세 개부터 시작하세요. 아이가 직접 꺼내고 다시 놓을 수 있는 작은 영역이 있으면 준비된 환경의 기본은 갖춰집니다."),
        ("장난감은 몇 개만 꺼내두면 좋나요?", "정답은 없지만 처음에는 4~6개 정도가 적당합니다. 아이가 고르기 어려워하거나 금방 흩트리기만 한다면 개수를 줄이고, 한 가지 활동에 오래 머문다면 비슷한 난이도의 활동을 하나씩 바꿔보세요."),
        ("아이가 정리를 안 하면 어떻게 하나요?", "정리는 훈계보다 반복 시범이 효과적입니다. 부모가 먼저 천천히 제자리에 놓는 모습을 보여주고, 아이 손에 하나만 쥐여 함께 놓아보세요. 처음부터 완벽한 정리를 기대하지 않는 것이 좋습니다."),
        ("칭찬을 하지 말아야 하나요?", "칭찬을 완전히 금지하라는 뜻은 아닙니다. 다만 '잘했어'만 반복하기보다 '네가 컵을 끝까지 들고 왔네', '블록을 크기대로 놓았네'처럼 아이가 한 행동을 구체적으로 말해주면 자기 인식에 도움이 됩니다."),
        ("아이가 활동을 거부하면 어떻게 하나요?", "거부는 실패가 아니라 정보입니다. 활동이 너무 어렵거나, 이미 피곤하거나, 관심사가 다른 곳에 있을 수 있습니다. 억지로 앉히지 말고 며칠 뒤 더 단순한 형태로 다시 제안해보세요."),
        ("어린이집을 다녀도 집에서 몬테소리를 할 수 있나요?", "가능합니다. 집에서는 거창한 수업보다 생활 참여가 더 좋습니다. 신발 정리, 손 씻기, 물컵 놓기, 책 고르기처럼 하루에 반복되는 장면에서 아이가 할 수 있는 몫을 만들어주세요."),
        ("영상 시청과 몬테소리는 맞지 않나요?", "몬테소리는 실제 손과 몸을 사용하는 경험을 중요하게 봅니다. 영상이 반드시 금지라는 뜻보다, 어린 시기에는 화면보다 만지고 움직이고 대화하는 시간이 중심이 되도록 조절하는 것이 좋습니다."),
        ("형제가 있으면 어떻게 환경을 나누나요?", "나이가 다른 형제가 있다면 작은 부품은 높은 곳에 두고, 함께 써도 되는 바구니와 각자 쓰는 바구니를 나눕니다. 큰아이에게 작은아이를 통제하게 하기보다 부모가 안전 기준을 분명히 정해주는 편이 좋습니다."),
        ("보물바구니는 언제까지 하나요?", "정해진 종료 시점은 없습니다. 아이가 물건을 입으로만 확인하던 시기를 지나 두드리고, 넣고, 비교하기 시작하면 구성물을 바꾸어 확장할 수 있습니다. 18개월 이후에는 분류 바구니나 생활놀이로 자연스럽게 넘어갑니다."),
        ("민감기를 놓치면 늦나요?", "늦었다고 볼 필요는 없습니다. 민감기는 부모를 불안하게 만드는 체크리스트가 아니라 아이가 무엇에 끌리는지 알아차리는 관찰 도구입니다. 지금 보이는 관심부터 도와주면 충분합니다."),
        ("일상생활 영역은 왜 중요한가요?", "일상생활 영역은 손의 힘, 순서 기억, 집중, 독립성을 한 번에 다룹니다. 물 따르기나 닦기처럼 단순한 활동은 아이가 실제 생활에 참여한다는 자부심을 느끼게 해줍니다."),
        ("수학 영역은 언제 시작하나요?", "숫자를 읽는 것보다 먼저 분류, 비교, 순서, 많고 적음의 감각이 시작됩니다. 컵을 크기대로 놓고, 블록을 색별로 모으고, 양말을 짝 맞추는 활동이 초기 수학 경험입니다."),
        ("문화 영역은 어렵지 않나요?", "어렵게 시작할 필요가 없습니다. 오늘 날씨를 말하고, 산책에서 본 나뭇잎을 관찰하고, 동물 그림책을 읽는 것도 문화 영역입니다. 아이의 실제 경험과 연결하면 부담이 줄어듭니다."),
        ("비싼 원목교구가 더 좋은가요?", "원목교구가 아름답고 오래 쓰기 좋은 경우는 있지만 가격이 교육 효과를 보장하지는 않습니다. 아이가 스스로 선택하고 반복할 수 있는지, 안전한지, 정리하기 쉬운지가 더 중요합니다."),
        ("아이가 계속 입에 넣으면 어떻게 하나요?", "구강 탐색은 어린 시기에 자연스러운 행동입니다. 다만 작은 부품, 벗겨지는 코팅, 긴 끈은 피하고 세척 가능한 큰 물건 위주로 준비하세요. 입에 넣는 행동이 심하게 지속되거나 걱정된다면 전문가와 상담하는 것이 좋습니다."),
        ("부모가 계속 같이 놀아줘야 하나요?", "처음에는 시범과 안정감이 필요하지만, 항상 옆에서 놀이를 주도할 필요는 없습니다. 아이가 몰입하면 부모는 말을 줄이고 지켜보는 것도 중요한 도움입니다."),
        ("혼자 놀이 시간이 짧아도 괜찮나요?", "괜찮습니다. 월령이 어릴수록 혼자 놀이 시간은 짧습니다. 2분이라도 스스로 보고 만진 시간이 있었다면 그 경험을 인정하고, 다음에는 같은 활동을 조금 더 안정된 환경에서 제안해보세요."),
        ("몬테소리와 놀이중심 교육은 다른가요?", "둘은 대립되는 개념이라기보다 강조점이 다릅니다. 몬테소리는 준비된 환경, 선택, 반복, 정리, 실제 생활과의 연결을 더 분명히 다룹니다. 집에서는 두 관점을 자연스럽게 섞어도 괜찮습니다."),
    ]
    faq_body = [
        '<main class="article-shell"><article class="article-card readable-article montessori-article">',
        '<p class="breadcrumb"><a href="/">홈</a> / <a href="/montessori/">몬테소리</a> / FAQ</p>',
        '<p class="eyebrow">Montessori FAQ</p><h1>몬테소리 자주 묻는 질문 20가지</h1>',
        f'<p class="modified-date">최종 업데이트: {TODAY}</p>',
        '<p class="lead">몬테소리를 처음 접하는 부모가 가장 많이 묻는 질문을 교구 구매가 아니라 집에서 실천하는 관점으로 정리했습니다.</p>',
    ]
    for i, (q, answer) in enumerate(faq_items, 1):
        faq_body.append(f"<details {'open' if i == 1 else ''}><summary>{esc(q)}</summary><p>{esc(answer)}</p></details>")
    faq_body.extend(['<section><h2>관련 글 추천</h2>', related_grid("faq"), "</section>", references_html(), advisory_html(), "</article></main>"])
    (montessori_dir / "faq.html").write_text(page_shell("몬테소리 FAQ 20가지", "몬테소리 시작 나이, 교구 구매, 준비된 환경, 장난감 개수, 민감기, 부모의 개입 기준 등 부모가 자주 묻는 질문을 정리했습니다.", f"{BASE}/montessori/faq.html", "\n".join(faq_body)), encoding="utf-8")
    pages.append("/montessori/faq.html")

    return pages


def update_sitemap(paths: list[str]) -> None:
    sitemap_path = ROOT / "sitemap.xml"
    text = sitemap_path.read_text(encoding="utf-8")
    existing = set()
    for line in text.splitlines():
        if "<loc>" in line:
            start = line.find("<loc>") + 5
            end = line.find("</loc>")
            existing.add(line[start:end].strip())
    additions = []
    for path in paths:
        loc = f"{BASE}{path}"
        if loc not in existing:
            priority = "0.9" if path == "/montessori/" else "0.8"
            additions.append(f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>{priority}</priority></url>")
    if additions:
        text = text.replace("</urlset>", "\n".join(additions) + "\n</urlset>")
        sitemap_path.write_text(text, encoding="utf-8")


def main() -> None:
    pages = make_pages()
    update_sitemap(pages)
    print(f"Generated {len(pages)} Montessori pages")


if __name__ == "__main__":
    main()
