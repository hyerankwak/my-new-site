from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]

ADSENSE = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>'

HEADER = """<header class="site-header">
  <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
  <nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav>
</header>"""

FOOTER = """<footer class="site-footer">
  <div><strong>토이포포</strong><p>육아, 놀이, 교육, 부모 고민 해결을 위한 생활형 정보를 제공합니다. 의료·발달 진단을 대체하지 않으며, 아이의 상황에 따라 전문가 상담이 필요할 수 있습니다.</p></div>
  <nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">업데이트 정책</a><a href="/affiliate-disclosure.html">제휴 안내</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의</a></nav>
  <p class="copyright">© 2026 ToyPoppo. All rights reserved.</p>
</footer>"""


def ld_json(title, desc, url, page_type="WebPage"):
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://toypoppo.kr/#organization",
                "name": "토이포포",
                "url": "https://toypoppo.kr",
            },
            {
                "@type": "WebSite",
                "@id": "https://toypoppo.kr/#website",
                "name": "토이포포",
                "url": "https://toypoppo.kr",
                "publisher": {"@id": "https://toypoppo.kr/#organization"},
                "inLanguage": "ko-KR",
            },
            {
                "@type": page_type,
                "@id": f"{url}#webpage",
                "name": title,
                "description": desc,
                "url": url,
                "isPartOf": {"@id": "https://toypoppo.kr/#website"},
                "inLanguage": "ko-KR",
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://toypoppo.kr/"},
                    {"@type": "ListItem", "position": 2, "name": title.split("|")[0].strip(), "item": url},
                ],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def page(title, desc, path, body, robots="index, follow, max-image-preview:large"):
    url = f"https://toypoppo.kr/{path}"
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="robots" content="{robots}">
  <link rel="canonical" href="{url}">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  {ADSENSE}
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">{ld_json(title, desc, url)}</script>
</head>
<body>
{HEADER}
<main class="article-shell"><article class="article-card readable-article">
{body}
</article></main>
{FOOTER}
</body>
</html>
"""


PAGES = {
    "about.html": (
        "토이포포 소개 | 육아·놀이·교육 정보 허브",
        "토이포포의 운영 목적, 콘텐츠 원칙, 추천 기준, 정보 제공 범위를 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 사이트 소개</p>
<p class="eyebrow">ABOUT TOYPOPPO</p>
<h1>토이포포 소개</h1>
<p class="lead">토이포포는 영유아부터 초등학생까지 아이의 발달 단계와 생활 상황에 맞는 놀이, 장난감, 교육 자료, 부모 고민 해결 정보를 정리하는 육아 정보 허브입니다.</p>
<section><h2>운영 목적</h2><p>부모가 검색을 통해 들어왔을 때 바로 실행할 수 있는 정보를 제공하는 것이 토이포포의 첫 번째 목적입니다. 단순히 상품 이름을 나열하기보다 아이가 왜 그 놀이를 좋아하는지, 어떤 발달 자극과 연결되는지, 집에서 어떻게 활용하면 좋은지를 함께 설명합니다.</p><p>토이포포의 콘텐츠는 육아의 정답을 제시하려는 글이 아닙니다. 아이마다 기질, 발달 속도, 생활 환경이 다르기 때문에 부모가 자신의 상황에 맞게 선택할 수 있도록 기준과 예시를 제공합니다.</p></section>
<section><h2>다루는 주제</h2><div class="quick-grid"><div><strong>장난감 추천</strong><span>월령, 나이, 사용 목적, 안전성, 정리 편의성을 함께 고려합니다.</span></div><div><strong>발달놀이</strong><span>집에서 할 수 있는 짧은 놀이와 발달 자극의 이유를 설명합니다.</span></div><div><strong>몬테소리</strong><span>교구보다 환경, 관찰, 독립성, 반복의 의미를 중심으로 안내합니다.</span></div><div><strong>엄마표 자료실</strong><span>출력물만 제공하지 않고 부모 활용법, 쉬운 설명, 퀴즈를 함께 제공합니다.</span></div></div></section>
<section><h2>추천 기준</h2><ul class="check-list"><li>아이의 실제 발달 단계와 흥미에 맞는가</li><li>부모가 준비하고 정리하기에 지나치게 부담스럽지 않은가</li><li>안전하게 반복 사용할 수 있는가</li><li>한 번 쓰고 끝나는 물건보다 활용 범위가 넓은가</li><li>구매가 필요한 경우에도 장점과 주의점을 함께 알 수 있는가</li></ul></section>
<section><h2>정보 이용 시 안내</h2><p>건강, 발달, 교육에 관한 글은 일반적인 참고 정보입니다. 아이의 발달 지연, 건강 문제, 심리적 어려움이 걱정될 때는 소아청소년과, 발달센터, 어린이집·유치원 교사 등 관련 전문가와 상담하는 것이 좋습니다.</p></section>""",
    ),
    "author.html": (
        "작성자 소개 | 토이포포",
        "토이포포 콘텐츠 작성 관점과 검토 기준, 부모 독자를 위한 정보 제공 방식을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 작성자 소개</p>
<p class="eyebrow">AUTHOR</p>
<h1>작성자 소개</h1>
<p class="lead">토이포포는 부모가 실제 생활에서 바로 참고할 수 있는 육아·놀이·교육 정보를 목표로 콘텐츠를 작성합니다.</p>
<section><h2>작성 관점</h2><p>아이 물건을 고르는 일은 단순히 인기 제품을 찾는 일이 아닙니다. 아이가 어떤 움직임을 연습하는지, 어떤 감각을 탐색하는지, 부모가 얼마나 자주 꺼내 줄 수 있는지까지 함께 봐야 합니다. 토이포포는 이런 실제 생활의 기준을 먼저 놓고 글을 구성합니다.</p><p>특정 브랜드나 상품을 무조건 좋다고 말하지 않습니다. 같은 장난감이라도 아이의 월령, 집의 공간, 부모의 정리 부담에 따라 만족도가 달라질 수 있기 때문입니다.</p></section>
<section><h2>검토 방식</h2><ul class="check-list"><li>부모가 검색한 질문에 직접 답하는가</li><li>나이와 발달 단계가 자연스럽게 연결되는가</li><li>활용법과 주의사항이 함께 있는가</li><li>의료·발달 진단처럼 오해될 표현을 피했는가</li><li>관련 글로 다음 행동을 이어갈 수 있는가</li></ul></section>
<section><h2>독자에게 약속하는 점</h2><p>토이포포는 과장된 광고 문구보다 부모가 판단할 수 있는 기준을 우선합니다. 제휴 링크가 포함되는 글에는 고지를 남기고, 정보성 글에서는 상품보다 놀이 방법과 발달 이해를 먼저 설명합니다.</p></section>""",
    ),
    "editorial-policy.html": (
        "편집 원칙 | 토이포포",
        "토이포포의 콘텐츠 작성, 검토, 수정, 제휴 고지 원칙을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 편집 원칙</p>
<p class="eyebrow">EDITORIAL POLICY</p>
<h1>편집 원칙</h1>
<p class="lead">토이포포의 글은 부모가 검색 후 바로 판단하고 실행할 수 있도록 기준, 이유, 주의사항을 함께 담는 것을 원칙으로 합니다.</p>
<section><h2>콘텐츠 작성 기준</h2><p>모든 글은 제목에 맞는 실제 질문에 답해야 합니다. 예를 들어 “7개월 아기 발달놀이”라면 놀이 목록만 나열하지 않고 7개월 무렵의 발달 특징, 부모가 관찰할 점, 놀이가 도움이 되는 이유를 함께 설명합니다.</p><p>제품 추천 글도 상품을 팔기 위한 글로만 구성하지 않습니다. 추천 기준, 구매 전 체크리스트, 아이에게 맞지 않을 수 있는 경우, 대체 놀이를 함께 안내합니다.</p></section>
<section><h2>검토 항목</h2><div class="quick-grid"><div><strong>정확성</strong><span>상식적 육아 정보와 발달 개인차를 함께 고려합니다.</span></div><div><strong>실용성</strong><span>부모가 집에서 바로 해볼 수 있는 방법을 포함합니다.</span></div><div><strong>균형성</strong><span>장점뿐 아니라 주의사항과 맞지 않는 경우도 씁니다.</span></div><div><strong>투명성</strong><span>제휴 링크가 있을 때는 독자가 알 수 있게 표시합니다.</span></div></div></section>
<section><h2>수정과 업데이트</h2><p>콘텐츠의 정보가 오래되었거나 독자가 이해하기 어려운 부분이 발견되면 문장을 보완하고 관련 글을 추가합니다. 공공데이터를 활용한 지역 정보는 공식 출처와 실제 부모 관점 설명을 함께 제공하는 방향으로 관리합니다.</p></section>""",
    ),
    "update-policy.html": (
        "콘텐츠 업데이트 정책 | 토이포포",
        "토이포포의 콘텐츠 보완, 자료 수정, 공공데이터 반영 기준을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 콘텐츠 업데이트 정책</p>
<p class="eyebrow">UPDATE POLICY</p>
<h1>콘텐츠 업데이트 정책</h1>
<p class="lead">토이포포는 오래된 정보가 부모의 선택을 방해하지 않도록 주요 페이지를 주기적으로 점검합니다.</p>
<section><h2>업데이트가 필요한 경우</h2><ul class="check-list"><li>연령별 놀이 설명이 부족하거나 실제 활용 예시가 필요한 경우</li><li>지역 정보의 운영시간, 시설명, 공식 홈페이지가 변경된 경우</li><li>엄마표 자료실에 새 워크지나 PDF가 추가된 경우</li><li>독자가 자주 묻는 질문이 생겨 FAQ 보완이 필요한 경우</li><li>내부 링크가 끊기거나 관련 글 연결이 부족한 경우</li></ul></section>
<section><h2>지역 정보 업데이트</h2><p>우리동네 육아정보는 공공데이터와 공식 홈페이지를 참고하되, 주소와 전화번호만 복사하지 않습니다. 부모가 방문 전에 알아두면 좋은 준비물, 적합 연령, 체류 시간, 비 오는 날 적합도처럼 실제 이용에 가까운 정보를 함께 정리합니다.</p></section>
<section><h2>자료실 업데이트</h2><p>엄마표 자료실은 PDF 파일만 올리는 구조를 피합니다. 주제 설명, 아이에게 설명하는 쉬운 말, 활동 예시, 퀴즈, 관련 글을 함께 보강하여 부모가 출력 전후로 활용할 수 있게 관리합니다.</p></section>""",
    ),
    "affiliate-disclosure.html": (
        "제휴 링크 안내 | 토이포포",
        "토이포포의 제휴 링크 운영 원칙과 광고성 콘텐츠 고지 기준을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 제휴 링크 안내</p>
<p class="eyebrow">AFFILIATE DISCLOSURE</p>
<h1>제휴 링크 안내</h1>
<p class="lead">토이포포는 일부 상품 추천 글에 제휴 링크를 사용할 수 있으며, 제휴 링크가 있는 경우 독자가 알아볼 수 있도록 고지합니다.</p>
<section><h2>운영 원칙</h2><p>제휴 링크는 콘텐츠의 보조 요소입니다. 글의 핵심은 아이의 발달 단계, 사용 목적, 안전성, 부모의 관리 편의성, 가격 대비 활용도 같은 선택 기준을 설명하는 데 있습니다.</p><p>제휴 수익 가능성이 있다는 이유로 특정 상품을 과장해서 표현하지 않습니다. 추천이 필요한 경우에도 장점과 주의사항을 함께 적고, 아이에게 맞지 않을 수 있는 상황을 안내합니다.</p></section>
<section><h2>고지 방식</h2><p>제휴 링크가 포함된 글에는 글 안에서 고지 문구를 확인할 수 있도록 합니다. 제휴 링크가 없는 정보성 글, 상담소 글, 발달놀이 글, 엄마표 자료실 글은 상품 구매보다 정보 활용을 우선합니다.</p></section>
<section><h2>부모가 읽을 때 참고할 점</h2><p>아이 물건은 인기 순위만으로 고르기 어렵습니다. 같은 제품이라도 아이의 발달, 취향, 집의 공간, 부모의 정리 방식에 따라 만족도가 달라집니다. 토이포포의 추천 글은 최종 구매 결정을 대신하지 않고, 비교할 기준을 제공하기 위한 자료입니다.</p></section>""",
    ),
    "privacy.html": (
        "개인정보처리방침 | 토이포포",
        "토이포포의 개인정보 수집 여부, 문의 처리, 외부 서비스 이용, 쿠키 관련 안내입니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 개인정보처리방침</p>
<p class="eyebrow">PRIVACY POLICY</p>
<h1>개인정보처리방침</h1>
<p class="lead">토이포포는 회원가입을 요구하지 않는 정보 제공 사이트입니다. 방문자가 글을 읽거나 자료를 내려받는 과정에서 이름, 주소, 전화번호를 직접 수집하지 않습니다.</p>
<section><h2>수집하는 정보</h2><p>토이포포는 기본적으로 회원 정보를 수집하지 않습니다. 다만 방문자가 문의 메일을 보내는 경우 답변을 위해 이메일 주소와 문의 내용을 확인할 수 있습니다. 이 정보는 문의 응답 목적 외에 사용하지 않습니다.</p></section>
<section><h2>외부 서비스와 쿠키</h2><p>사이트 운영 과정에서 Google AdSense, 검색엔진, 웹 분석 도구와 같은 외부 서비스가 쿠키나 비식별 방문 정보를 사용할 수 있습니다. 방문자는 브라우저 설정을 통해 쿠키 저장을 제한하거나 삭제할 수 있습니다.</p></section>
<section><h2>PDF와 자료 이용</h2><p>엄마표 자료실의 PDF 다운로드는 별도 회원가입 없이 이용할 수 있습니다. 다운로드 과정에서 토이포포가 아이의 이름, 학년, 연락처를 요구하지 않습니다.</p></section>
<section><h2>문의</h2><p>개인정보 관련 문의는 <a href="mailto:contact@toypoppo.kr">contact@toypoppo.kr</a>로 보낼 수 있습니다. 문의 내용은 확인 후 필요한 범위 안에서 답변합니다.</p></section>""",
    ),
    "terms.html": (
        "이용약관 | 토이포포",
        "토이포포 콘텐츠 이용 범위, 책임 제한, 저작권, 외부 링크 이용 기준을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 이용약관</p>
<p class="eyebrow">TERMS</p>
<h1>이용약관</h1>
<p class="lead">토이포포는 육아, 놀이, 교육 정보를 제공하는 사이트입니다. 방문자는 본 약관을 참고하여 콘텐츠를 이용할 수 있습니다.</p>
<section><h2>콘텐츠 이용</h2><p>토이포포의 글과 자료는 개인적인 참고와 가정 내 활용을 목적으로 이용할 수 있습니다. 엄마표 자료실의 PDF는 가정에서 아이와 활동하기 위한 용도로 사용할 수 있으며, 무단 재배포나 상업적 판매는 허용하지 않습니다.</p></section>
<section><h2>정보의 성격</h2><p>사이트의 내용은 일반적인 육아 정보입니다. 의료 진단, 발달 진단, 전문 상담을 대체하지 않습니다. 아이의 건강이나 발달에 걱정이 있는 경우 관련 전문가와 상담해야 합니다.</p></section>
<section><h2>외부 링크</h2><p>토이포포는 공식 홈페이지, 지도, 자료 출처 등 외부 링크를 제공할 수 있습니다. 외부 사이트의 운영 정책, 정보 변경, 서비스 이용에 대해서는 해당 사이트의 기준이 적용됩니다.</p></section>
<section><h2>콘텐츠 변경</h2><p>토이포포는 더 정확하고 유용한 정보를 제공하기 위해 글의 제목, 본문, 내부 링크, 자료 파일을 수정하거나 보완할 수 있습니다.</p></section>""",
    ),
    "contact.html": (
        "문의 | 토이포포",
        "토이포포 콘텐츠 제안, 오류 제보, 제휴 문의를 위한 연락처 안내입니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 문의</p>
<p class="eyebrow">CONTACT</p>
<h1>문의</h1>
<p class="lead">콘텐츠 제안, 오류 제보, 자료 수정 요청, 제휴 관련 문의는 아래 이메일로 보내주세요.</p>
<section><h2>문의 이메일</h2><p><strong>contact@toypoppo.kr</strong></p><p>오류 제보를 보내실 때는 문제가 있는 페이지 주소와 수정이 필요한 내용을 함께 적어주시면 더 정확하게 확인할 수 있습니다.</p></section>
<section><h2>보내주시면 좋은 내용</h2><ul class="check-list"><li>잘못된 링크 또는 열리지 않는 페이지</li><li>지역 정보의 운영시간, 주소, 공식 홈페이지 변경</li><li>엄마표 자료실 PDF 오류 또는 개선 제안</li><li>부모가 자주 궁금해하는 육아 질문 제안</li><li>콘텐츠 제휴 또는 협업 문의</li></ul></section>""",
    ),
    "content-plan.html": (
        "토이포포 콘텐츠 안내 | 육아·놀이·교육 주제",
        "토이포포에서 다루는 장난감 추천, 발달놀이, 상담소, 엄마표 자료실, 몬테소리 콘텐츠의 이용 흐름을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / 콘텐츠 안내</p>
<p class="eyebrow">CONTENT GUIDE</p>
<h1>토이포포 콘텐츠 안내</h1>
<p class="lead">토이포포는 장난감 추천만 모아둔 사이트가 아니라, 부모가 아이의 발달과 생활 고민을 함께 이해할 수 있도록 여러 주제를 연결해 둔 육아 정보 허브입니다.</p>
<section><h2>처음 방문했다면</h2><p>아이의 월령이나 나이를 기준으로 장난감 추천 글을 먼저 읽고, 이어서 발달놀이와 부모 가이드로 넘어가면 좋습니다. 예를 들어 7개월 아기 장난감 추천을 읽었다면 7개월 발달놀이, 장난감 로테이션, 보물바구니 놀이를 함께 보면 실제 활용 방법이 더 선명해집니다.</p></section>
<section><h2>주제별 이용 방법</h2><div class="quick-grid"><div><strong>상담소</strong><span>부모가 자주 검색하는 질문에 답합니다.</span></div><div><strong>부모 가이드</strong><span>하루 일과, 정리, 외출, 그림책 등 생활형 정보를 다룹니다.</span></div><div><strong>엄마표 자료실</strong><span>PDF와 함께 설명, 활용법, 퀴즈를 제공합니다.</span></div><div><strong>우리동네</strong><span>아이와 갈 만한 전시·체험 장소를 부모 관점으로 정리합니다.</span></div></div></section>""",
    ),
    "local-info/data-sources.html": (
        "우리동네 육아정보 출처 안내 | 토이포포",
        "토이포포 우리동네 육아정보에 활용하는 공공데이터와 공식 출처, 부모 관점 보완 기준을 안내합니다.",
        """<p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">우리동네</a> / 출처 안내</p>
<p class="eyebrow">DATA SOURCES</p>
<h1>우리동네 육아정보 출처 안내</h1>
<p class="lead">우리동네 육아정보는 공공데이터와 공식 홈페이지 정보를 바탕으로 하되, 부모가 방문 전 판단할 수 있도록 토이포포의 설명을 함께 더합니다.</p>
<section><h2>활용하는 정보</h2><ul class="check-list"><li>전국 박물관·미술관 정보</li><li>과학관, 자연사관, 어린이 체험 전시 관련 공식 정보</li><li>시설 공식 홈페이지와 지도 서비스</li><li>방문 전 확인이 필요한 운영시간, 예약 여부, 위치 정보</li></ul></section>
<section><h2>토이포포가 보완하는 부분</h2><p>공공데이터는 시설명과 주소를 확인하는 데 유용하지만, 부모가 궁금해하는 정보가 모두 들어 있지는 않습니다. 토이포포는 추천 연령, 비 오는 날 적합도, 평균 체류 시간, 준비물, 방문 후 이어가기 좋은 놀이처럼 실제 부모가 알고 싶은 내용을 함께 정리합니다.</p></section>
<section><h2>방문 전 확인</h2><p>시설 운영시간, 휴관일, 예약 방식은 변경될 수 있습니다. 방문 전에는 반드시 공식 홈페이지나 지도 정보를 한 번 더 확인해 주세요.</p></section>""",
    ),
}


for rel, (title, desc, body) in PAGES.items():
    (ROOT / rel).write_text(page(title, desc, rel, body), encoding="utf-8")


for p in ROOT.rglob("*.html"):
    if ".git" in p.parts or "tmp" in p.parts:
        continue
    s = p.read_text(encoding="utf-8", errors="ignore")
    s = s.replace("애드센스 승인 전후에도 정보 비중을 우선합니다.", "운영 단계와 관계없이 정보 비중을 우선합니다.")
    s = s.replace(
        '<a href="#" rel="sponsored nofollow" class="text-link">상품 보러가기</a>',
        '<span class="text-link text-link--disabled">구매 전 기준 확인</span>',
    )
    s = re.sub(
        r"\s*<p class=\"affiliate-note\">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다\.</p>",
        "",
        s,
    )
    p.write_text(s, encoding="utf-8")


sitemap = ROOT / "sitemap.xml"
if sitemap.exists():
    s = sitemap.read_text(encoding="utf-8")
    s = re.sub(r"\s*<url><loc>https://toypoppo\.kr/local-info/search\.html</loc>.*?</url>", "", s)
    sitemap.write_text(s, encoding="utf-8")

