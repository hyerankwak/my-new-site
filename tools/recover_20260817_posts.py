from pathlib import Path
import shutil
from html import escape

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-08-17"

IMAGE_SOURCES = {
    "15-month-toddler-language-play-routine-1.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_M82r5sehW4m67KM7jaYFCFOE.png"),
    "15-month-toddler-language-play-routine-2.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_6thIGYJd4H3TuIZv25VfVwg1.png"),
    "first-grade-read-aloud-retelling-routine-1.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_KO4Tv159j8QySNp3nvsSLAgf.png"),
    "first-grade-read-aloud-retelling-routine-2.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_Wl9DxYIsxIjoKctlOSQDdfXH.png"),
}


def coupang_banner():
    return """<div style="max-width:100%;overflow-x:auto;margin:28px 0 10px" aria-label="쿠팡 고객추천 배너"><script src="https://ads-partners.coupang.com/g.js"></script><script>new PartnersCoupang.G({"id":1016497,"template":"carousel","trackingCode":"AF1560562","subId":"toypoppo1","width":"680","height":"140","tsource":""});</script></div><p class="affiliate-note">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>"""


def article_html(post):
    image_urls = [f"https://toypoppo.kr/assets/images/blog/{img}" for img in post["images"]]
    faq_entities = ",".join(
        '{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}'
        % (escape(q), escape(a))
        for q, a in post["faq"]
    )
    related_links = "\n".join(
        f'<a href="{href}"><strong>{escape(title)}</strong><span>{escape(desc)}</span></a>'
        for href, title, desc in post["related"]
    )
    body = "\n".join(post["body"])
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(post["title"])} | 토이포포</title>
  <meta name="description" content="{escape(post["description"])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://toypoppo.kr/blog/{post["slug"]}.html">
  <meta property="og:title" content="{escape(post["og_title"])}">
  <meta property="og:description" content="{escape(post["description"])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://toypoppo.kr/blog/{post["slug"]}.html">
  <meta property="og:image" content="{image_urls[0]}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css?v=20260815-article-layout1">
  <script type="application/ld+json">{{"@context":"https://schema.org","@graph":[{{"@type":"Article","headline":"{escape(post["headline"])}","description":"{escape(post["description"])}","image":["{image_urls[0]}","{image_urls[1]}"],"author":{{"@type":"Organization","name":"토이포포"}},"publisher":{{"@type":"Organization","name":"토이포포","url":"https://toypoppo.kr"}},"mainEntityOfPage":"https://toypoppo.kr/blog/{post["slug"]}.html","datePublished":"{TODAY}","dateModified":"{TODAY}","inLanguage":"ko-KR"}},{{"@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"홈","item":"https://toypoppo.kr/"}},{{"@type":"ListItem","position":2,"name":"블로그","item":"https://toypoppo.kr/blog/"}},{{"@type":"ListItem","position":3,"name":"{escape(post["breadcrumb"])}","item":"https://toypoppo.kr/blog/{post["slug"]}.html"}}]}},{{"@type":"FAQPage","mainEntity":[{faq_entities}]}}]}}</script>
</head>
<body>
  <header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>부모를 위한 육아·놀이·교육 정보</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/pad-learning/">패드학습</a><a href="/blog/">블로그</a></nav></header>
  <main>
    <article class="article">
      <p class="eyebrow">{escape(post["eyebrow"])}</p>
      <h1>{escape(post["headline"])}</h1>
      {body}
      <h2>자주 묻는 질문</h2>
      {''.join(f'<h3>{escape(q)}</h3><p>{escape(a)}</p>' for q, a in post["faq"])}
      {coupang_banner()}
      <h2>함께 보면 좋은 글</h2>
      <div class="link-grid">{related_links}</div>
      <h2>마무리</h2>
      <p>{escape(post["closing"])}</p>
    </article>
  </main>
  <footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 체크리스트를 함께 다루는 부모 정보 플랫폼입니다.</p></div><nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer>
</body>
</html>
"""


POSTS = [
    {
        "slug": "15-month-toddler-language-play-routine",
        "title": "15개월 아기 말놀이 방법 | 아직 말이 적을 때 집에서 하는 언어 자극",
        "og_title": "15개월 아기 말놀이 방법 | 집에서 하는 언어 자극 루틴",
        "headline": "15개월 아기 말놀이 방법: 아직 말이 적을 때 집에서 하는 언어 자극",
        "breadcrumb": "15개월 아기 말놀이",
        "eyebrow": "Toddler Language Play",
        "description": "15개월 아기가 아직 말이 적을 때 부모가 집에서 할 수 있는 그림책, 사물 이름, 의성어, 선택 질문, 몸짓 말놀이 루틴을 정리했습니다.",
        "images": ["15-month-toddler-language-play-routine-1.png", "15-month-toddler-language-play-routine-2.png"],
        "body": [
            "<p>15개월 전후의 아이는 말로 표현하는 단어보다 알아듣는 말과 몸짓이 먼저 늘어나는 시기입니다. 부모 입장에서는 또래가 엄마, 아빠, 까까를 말한다는 이야기를 들으면 조급해지기 쉽지만, 이 시기 언어 발달은 단어 수만으로 판단하기 어렵습니다. 이름을 부르면 돌아보는지, 익숙한 물건을 가져오는지, 손가락으로 가리키거나 고개를 흔드는지, 의성어를 듣고 동작으로 반응하는지를 함께 봐야 합니다.</p>",
            "<p>집에서 하는 <strong>15개월 아기 말놀이</strong>는 단어를 반복해서 따라 하게 만드는 시간이 아닙니다. 아이가 이미 보고 만지는 생활 장면에 짧은 말을 붙이고, 아이가 반응할 시간을 기다리고, 같은 말을 같은 상황에서 안정적으로 들려주는 과정입니다. 하루 종일 말을 걸 필요도 없습니다. 오히려 짧고 분명한 말, 반복되는 순서, 아이가 선택할 수 있는 작은 장면이 더 도움이 됩니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/15-month-toddler-language-play-routine-1.png" alt="15개월 아기와 부모가 낮은 테이블에서 그림 카드와 책으로 말놀이를 하는 모습" width="1200" height="800"><figcaption>아이에게 정답을 묻기보다 사물과 행동에 짧은 말을 붙여 주는 장면입니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>15개월 언어 발달에서 먼저 보는 신호</h2><p>말이 늦어 보일 때 부모가 먼저 확인할 것은 단어를 몇 개 말하느냐보다 의사소통 의도가 있는지입니다. 원하는 물건을 손으로 가리키거나, 부모 손을 끌고 가거나, 싫을 때 고개를 돌리는 행동은 모두 중요한 표현입니다. 말소리가 아직 분명하지 않아도 같은 상황에서 비슷한 소리를 내거나, 동물 그림을 보고 멍멍 소리에 웃고 반응한다면 언어 이해와 모방의 기반이 자라고 있는 것입니다.</p><p>반대로 이름을 불러도 거의 반응이 없거나, 눈맞춤과 공동주의가 매우 적거나, 소리에 대한 반응이 일정하지 않다면 놀이만 늘리기보다 소아청소년과나 발달 상담을 통해 청력과 전반 발달을 확인하는 편이 좋습니다. 토이포포의 말놀이는 일반적인 가정 놀이 정보이며 진단을 대신하지 않습니다.</p>",
            "<h2>말을 늘리는 부모 말의 기준</h2><p>15개월 아이에게는 긴 설명보다 두세 단어 문장이 적절합니다. “이건 노란색 자동차야, 바퀴가 네 개 있고 굴러가네”보다 처음에는 “자동차 간다”, “빨간 컵”, “물 마셔”처럼 짧게 말합니다. 아이가 바라보는 물건을 따라가며 말해야 귀에 남습니다. 부모가 고른 낱말을 계속 들려주는 것보다 아이 관심 위에 말을 얹는 방식이 좋습니다.</p><p>또한 같은 상황에서는 같은 표현을 쓰는 것이 도움이 됩니다. 매번 다른 말로 설명하면 어른에게는 풍부해 보여도 아이에게는 신호가 흐려질 수 있습니다. 식사 전에는 “맘마 먹자”, 외출 전에는 “신발 신자”, 책을 펼칠 때는 “책 볼까?”처럼 반복되는 말이 생활 속 단서가 됩니다.</p>",
            "<h2>집에서 바로 하는 말놀이 8가지</h2><h3>1. 사물 이름 붙이기</h3><p>아이 앞에 컵, 공, 책처럼 익숙한 물건 두세 개만 둡니다. 부모가 “컵”, “공”을 말하고 아이가 보거나 만지면 바로 반응합니다. “맞아, 컵이야”처럼 짧게 확인합니다. 테스트하듯 “이게 뭐야?”를 반복하지 않는 것이 핵심입니다.</p><h3>2. 의성어 놀이</h3><p>강아지, 자동차, 물, 문 같은 생활 소리부터 시작합니다. 멍멍, 빵빵, 졸졸, 똑똑처럼 입모양이 단순한 소리는 아이가 흉내 내기 좋습니다. 정확한 발음보다 소리를 내 보려는 시도를 인정합니다.</p><h3>3. 선택 질문</h3><p>“사과 먹을래, 바나나 먹을래?”처럼 두 가지 선택지를 보여 줍니다. 아이가 손을 뻗거나 바라보면 부모가 대신 말해 줍니다. “바나나 골랐네.” 이 과정은 말하기 전에 선택과 의도를 표현하는 연습이 됩니다.</p><h3>4. 그림책 한 장 말놀이</h3><p>책을 처음부터 끝까지 읽으려 하지 말고 한 장면만 오래 봅니다. “곰 잔다”, “아기 웃어”, “공 어디?”처럼 그림 속 행동을 짧게 말합니다. 아이가 책장을 넘기면 다시 따라갑니다.</p>",
            coupang_banner(),
            "<h3>5. 몸짓 따라 말하기</h3><p>빠이빠이, 주세요, 더, 안아처럼 몸짓과 말이 함께 있는 표현은 15개월 아이에게 이해하기 쉽습니다. 몸짓을 강요하지 말고 부모가 먼저 매번 같은 말과 손동작을 보여 주세요.</p><h3>6. 숨은 물건 찾기</h3><p>손수건 아래 컵을 숨기고 “컵 어디?”라고 말합니다. 아이가 들추면 “컵 찾았다”라고 합니다. 이 놀이는 대상 영속성과 언어 이해를 함께 자극합니다.</p><h3>7. 행동 말 붙이기</h3><p>아이를 들어 올릴 때 “올라간다”, 내려놓을 때 “내려간다”, 공을 굴릴 때 “굴러간다”라고 말합니다. 동사는 생활 속 움직임과 연결될 때 가장 잘 익습니다.</p><h3>8. 기다리는 대화</h3><p>부모가 한 문장을 말한 뒤 3초 기다립니다. 아이가 소리, 표정, 손짓으로 반응하면 대화가 이어진 것입니다. 빈틈 없이 말을 채우면 아이가 끼어들 시간이 줄어듭니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/15-month-toddler-language-play-routine-2.png" alt="부모가 동물 모형과 그림책으로 15개월 아기에게 의성어 놀이를 해 주는 모습" loading="lazy" width="1200" height="800"><figcaption>동물 소리와 사물 이름은 그림책, 모형, 몸짓을 함께 쓸 때 아이가 이해하기 쉽습니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>하루 루틴에 넣는 방법</h2><p>말놀이는 시간을 따로 길게 빼지 않아도 됩니다. 아침 기저귀 갈 때 신체 이름을 말하고, 식사 때 컵과 숟가락 이름을 말하고, 산책 전 신발과 모자 이름을 말하면 충분합니다. 중요한 것은 부모가 피곤한 날에도 유지할 수 있을 만큼 작게 시작하는 것입니다. 하루 세 번, 3분씩만 반복해도 아이에게는 안정적인 언어 환경이 됩니다.</p><p>아이가 따라 말하지 않는다고 바로 다른 놀이로 바꾸지 마세요. 15개월 아이는 듣고 저장한 뒤 며칠 또는 몇 주 뒤 비슷한 소리로 꺼내기도 합니다. 부모가 할 일은 단어를 많이 쏟아붓는 것이 아니라 아이가 이해할 수 있는 장면을 반복해서 제공하는 것입니다.</p>",
            "<h2>부모 체크리스트</h2><aside><ul><li>아이 관심을 먼저 보고 그 위에 말을 붙인다.</li><li>한 번에 물건을 많이 꺼내지 않는다.</li><li>질문보다 짧은 설명을 먼저 한다.</li><li>정확한 발음보다 반응과 시도를 본다.</li><li>생활 루틴마다 같은 말을 반복한다.</li><li>이름 반응, 눈맞춤, 손가락 가리키기를 함께 관찰한다.</li><li>걱정이 지속되면 전문가 상담을 미루지 않는다.</li></ul></aside>",
        ],
        "faq": [
            ("15개월인데 말을 거의 안 해도 괜찮나요?", "아이마다 차이가 있습니다. 단어 수만 보지 말고 이름 반응, 손짓, 원하는 것을 표현하는 행동, 소리 모방을 함께 보세요. 걱정이 지속되면 전문가 상담이 필요합니다."),
            ("말을 따라 하게 계속 시켜도 되나요?", "반복 요구는 부담이 될 수 있습니다. 부모가 먼저 짧게 말하고 아이가 반응할 시간을 주는 편이 좋습니다."),
            ("그림책을 끝까지 안 보는데 괜찮나요?", "괜찮습니다. 15개월에는 한 장면을 오래 보거나 책장을 넘기는 행동 자체가 탐색입니다."),
            ("영상으로 단어를 배우게 해도 되나요?", "이 시기에는 실제 사람과 주고받는 말, 몸짓, 표정이 더 중요합니다. 영상은 부모와 함께 짧게 보는 보조 수단 정도로 제한하세요."),
            ("어떤 장난감이 말놀이에 좋나요?", "소리가 많은 전자 장난감보다 부모가 말을 붙일 수 있는 그림책, 공, 컵, 동물 모형, 인형처럼 단순한 물건이 좋습니다."),
        ],
        "related": [
            ("/blog/18-month-toddler-language-development-play.html", "18개월 아기 언어발달 놀이", "한 단어와 몸짓을 생활 대화로 잇는 말놀이입니다."),
            ("/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이", "거울놀이와 공 굴리기로 상호작용을 키웁니다."),
            ("/blog/baby-puts-toys-in-mouth.html", "아기가 장난감을 입에 넣는 이유", "구강 탐색과 안전 기준을 정리했습니다."),
            ("/development-play/", "발달놀이", "개월별 놀이 글을 모아 볼 수 있습니다."),
            ("/parent-guide/", "부모가이드", "일상 속 육아 루틴을 정리합니다."),
        ],
        "closing": "15개월 말놀이는 특별한 교재보다 부모가 같은 장면에서 같은 말을 안정적으로 들려주는 과정입니다. 아이가 말하지 않아도 바라보고, 가리키고, 몸짓으로 답한다면 이미 대화의 기초가 자라고 있습니다.",
    },
    {
        "slug": "first-grade-read-aloud-retelling-routine",
        "title": "초등 1학년 소리 내어 읽기 방법 | 읽고 말하고 한 문장 쓰는 20분 루틴",
        "og_title": "초등 1학년 소리 내어 읽기 방법 | 20분 문해력 루틴",
        "headline": "초등 1학년 소리 내어 읽기 방법: 읽고 말하고 한 문장 쓰는 20분 루틴",
        "breadcrumb": "초등 1학년 소리 내어 읽기",
        "eyebrow": "Elementary Literacy",
        "description": "초등 1학년이 글을 더듬어 읽을 때 부모가 집에서 할 수 있는 소리 내어 읽기, 다시 말하기, 한 문장 쓰기 20분 문해력 루틴입니다.",
        "images": ["first-grade-read-aloud-retelling-routine-1.png", "first-grade-read-aloud-retelling-routine-2.png"],
        "body": [
            "<p>초등 1학년 아이가 책을 읽을 때 자꾸 멈추거나 글자를 빠뜨리면 부모는 바로 더 많이 읽혀야 한다고 생각하기 쉽습니다. 하지만 읽기 초반에는 속도보다 정확히 보고, 소리로 내고, 뜻을 붙잡는 과정이 더 중요합니다. 아이가 한 줄을 더듬어 읽는 것은 게으른 태도가 아니라 글자, 소리, 의미를 동시에 처리하는 데 아직 에너지가 많이 드는 상태일 수 있습니다.</p>",
            "<p><strong>초등 1학년 소리 내어 읽기</strong>는 단순히 큰 소리로 책을 읽히는 훈련이 아닙니다. 읽기 전 제목과 그림을 보고 예상하고, 읽는 중에는 모르는 낱말을 표시하고, 읽은 뒤에는 자기 말로 다시 말하고, 마지막에 한 문장만 써 보는 흐름이 필요합니다. 이 네 단계가 연결되면 아이는 글자를 읽는 수준을 넘어 내용을 이해하고 표현하는 힘을 기릅니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/first-grade-read-aloud-retelling-routine-1.png" alt="초등 1학년 아이가 부모 옆에서 공책에 한 문장을 쓰며 읽기 루틴을 하는 모습" width="1200" height="800"><figcaption>읽기는 문제집을 많이 푸는 것보다 짧은 글을 정확히 읽고 자기 말로 바꾸는 연습이 중요합니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>초등 1학년 읽기에서 흔히 보이는 어려움</h2><p>첫째, 글자는 읽지만 내용이 남지 않는 경우가 있습니다. 아이가 한 글자씩 힘겹게 소리 내느라 문장 전체의 뜻을 놓치는 것입니다. 둘째, 조사나 받침을 자주 빼고 읽습니다. 이는 대충 읽어서라기보다 눈으로 훑는 속도와 입으로 말하는 속도가 아직 맞지 않기 때문입니다. 셋째, 긴 문장을 한 번에 읽으려다 숨이 차거나 끝을 흐립니다. 이때는 문장을 짧은 의미 단위로 끊어 읽는 경험이 필요합니다.</p><p>부모가 바로 지적만 하면 아이는 읽기를 틀리는 시간으로 기억합니다. “다시 읽어”보다 “여기에서 잠깐 쉬어 보자”, “누가 무엇을 했는지만 찾아보자”처럼 과제를 작게 나누면 부담이 줄어듭니다.</p>",
            "<h2>20분 루틴 전체 흐름</h2><h3>1단계: 읽기 전 3분, 제목과 그림 보기</h3><p>책이나 짧은 지문을 펼친 뒤 바로 읽히지 않습니다. 제목, 그림, 첫 문장만 보고 무슨 이야기일지 말하게 합니다. 정답을 맞히는 시간이 아니라 배경 지식을 깨우는 시간입니다. 아이가 “모르겠어”라고 하면 부모가 두 가지 선택지를 줍니다. “동물 이야기 같아, 아니면 친구 이야기 같아?”처럼 선택을 좁히면 대답이 쉬워집니다.</p><h3>2단계: 소리 내어 읽기 7분</h3><p>한 번에 긴 분량을 읽히지 않습니다. 1학년은 한 문단 또는 한쪽만 읽어도 충분합니다. 아이가 멈추면 바로 대신 읽지 말고 3초 기다립니다. 그래도 어려워하면 첫소리나 앞뒤 문맥을 알려 줍니다. 틀린 글자는 모든 것을 즉시 고치지 말고 뜻이 크게 달라지는 부분 위주로 짚습니다.</p>",
            coupang_banner(),
            "<h3>3단계: 다시 말하기 5분</h3><p>읽은 뒤 “무슨 내용이야?”라고 크게 묻지 말고 세 질문으로 나눕니다. 누가 나왔는지, 무슨 일이 있었는지, 그래서 어떻게 되었는지를 묻습니다. 아이 대답이 짧아도 부모가 문장으로 다듬어 다시 들려주면 됩니다. 다시 말하기는 독후감의 전 단계입니다.</p><h3>4단계: 한 문장 쓰기 5분</h3><p>마지막에는 긴 독서록을 쓰지 않습니다. “나는 ○○가 재미있었다”, “○○가 왜 그랬는지 궁금했다”처럼 한 문장만 씁니다. 맞춤법을 모두 고치기보다 문장의 뜻이 전달되는지 먼저 봅니다. 글씨가 느린 아이에게는 부모가 아이 말을 받아 적고 아이가 핵심 낱말 하나만 써도 됩니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/first-grade-read-aloud-retelling-routine-2.png" alt="초등 아이가 그림책을 소리 내어 읽고 부모가 빈 카드에 내용을 정리하는 모습" loading="lazy" width="1200" height="800"><figcaption>다시 말하기는 줄거리 암기가 아니라 누가, 무엇을, 왜 했는지 자기 말로 정리하는 과정입니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>부모가 쓰면 좋은 말</h2><p>“빨리 읽어”보다 “여기까지 정확히 읽어 보자”가 좋습니다. “왜 또 틀렸어?”보다 “이 낱말은 받침까지 같이 보자”가 낫습니다. 읽기 자신감은 부모의 반응에서 크게 달라집니다. 틀린 부분을 고치더라도 먼저 아이가 끝까지 읽은 노력을 인정하고, 한 번에 한 가지 기준만 고쳐야 합니다.</p><p>소리 내어 읽기 중간에는 아이가 뜻을 놓치지 않도록 짧은 확인 질문을 넣습니다. “지금 누가 말했지?”, “왜 문을 열었을까?”처럼 이야기 흐름을 붙잡는 질문이 좋습니다. 질문이 너무 많으면 읽기 흐름이 끊기므로 한 문단에 한두 개면 충분합니다.</p>",
            "<h2>수준에 맞는 글 고르는 기준</h2><p>처음에는 아이가 80% 이상 읽을 수 있는 글을 고릅니다. 모르는 낱말이 너무 많으면 읽기 시간이 낱말 풀이로 바뀝니다. 그림책, 교과서 짧은 지문, 생활 안내문, 동시처럼 짧고 장면이 분명한 글이 좋습니다. 아이가 좋아하는 주제라면 같은 책을 여러 번 읽어도 괜찮습니다. 반복 읽기는 속도와 억양을 안정시키는 데 도움이 됩니다.</p><p>문해력은 긴 글을 빨리 읽는 힘만 뜻하지 않습니다. 짧은 글을 읽고 핵심을 말하고, 자기 생각을 한 문장으로 쓰는 과정이 쌓여야 합니다. 방학이나 학기 중 모두 하루 20분이면 충분하고, 매일 같은 시간에 짧게 하는 편이 주말에 몰아서 하는 것보다 효과적입니다.</p>",
            "<h2>부모 체크리스트</h2><aside><ul><li>읽기 전 제목과 그림으로 예상한다.</li><li>한 번에 한 문단 또는 한쪽만 읽는다.</li><li>틀린 글자를 모두 즉시 지적하지 않는다.</li><li>읽은 뒤 누가, 무엇을, 어떻게 되었는지를 말한다.</li><li>마지막 쓰기는 한 문장으로 끝낸다.</li><li>속도보다 정확도와 이해를 먼저 본다.</li><li>아이가 힘들어하면 부모가 번갈아 읽는다.</li></ul></aside>",
        ],
        "faq": [
            ("초등 1학년은 하루에 얼마나 읽으면 좋나요?", "처음에는 15~20분이면 충분합니다. 분량보다 매일 짧게 읽고 말하고 쓰는 흐름이 중요합니다."),
            ("아이가 읽기를 싫어하면 어떻게 하나요?", "부모와 번갈아 읽거나 한 문장만 아이가 읽게 하세요. 실패 경험을 줄이는 것이 먼저입니다."),
            ("틀린 글자는 바로 고쳐야 하나요?", "뜻이 크게 달라지는 부분과 반복되는 오류 위주로 고칩니다. 모든 오류를 즉시 지적하면 읽기 흐름이 끊깁니다."),
            ("독서록을 매일 써야 하나요?", "긴 독서록보다 한 문장 기록이 낫습니다. 아이 말 한 문장을 부모가 받아 적어도 좋은 시작입니다."),
            ("패드학습이나 앱으로 읽기 연습을 해도 되나요?", "보조로는 가능하지만 부모와 주고받는 다시 말하기와 한 문장 쓰기를 함께 해야 이해력이 자랍니다."),
        ],
        "related": [
            ("/blog/first-grade-main-idea-literacy-routine.html", "초등 1학년 중심 문장 찾기", "짧은 글의 전체와 세부를 비교합니다."),
            ("/blog/first-grade-summer-reading-log-routine.html", "초등 1학년 독서록 쓰는 법", "말하기에서 쓰기로 넘어가는 루틴입니다."),
            ("/blog/elementary-literacy-home-study.html", "초등 문해력 집공부 실천법", "읽기 전·중·후 활동을 정리했습니다."),
            ("/blog/first-grade-dictation-wrong-words-review.html", "초등 1학년 받아쓰기 오답 복습", "틀린 낱말을 다시 익히는 방법입니다."),
            ("/pad-learning/", "패드학습 가이드", "유아·초등 온라인 학습 기준을 모았습니다."),
        ],
        "closing": "초등 1학년 읽기는 빨리 많이 읽히는 것보다 짧은 글을 정확히 읽고, 자기 말로 다시 말하고, 한 문장으로 남기는 과정이 중요합니다. 20분 루틴을 작게 유지하면 읽기는 부담이 아니라 매일 반복 가능한 생활 습관이 됩니다.",
    },
]


def copy_images():
    dest = ROOT / "assets" / "images" / "blog"
    dest.mkdir(parents=True, exist_ok=True)
    for filename, src in IMAGE_SOURCES.items():
        if not src.exists():
            raise FileNotFoundError(src)
        shutil.copy2(src, dest / filename)


def write_posts():
    for post in POSTS:
        (ROOT / "blog" / f"{post['slug']}.html").write_text(article_html(post), encoding="utf-8", newline="\n")


def update_blog_index():
    path = ROOT / "blog" / "index.html"
    text = path.read_text(encoding="utf-8")
    marker = "  <main>\n"
    cards = "".join(
        f'<a href="/blog/{post["slug"]}.html"><strong>{escape(post["headline"])}</strong><span>{escape(post["description"])}</span></a>'
        for post in POSTS
    )
    block = f'    <section class="section"><div class="link-grid">{cards}</div></section>\n'
    if POSTS[0]["slug"] not in text:
        text = text.replace(marker, marker + block, 1)
    text = text.replace("<lastmod>2026-08-14</lastmod>", f"<lastmod>{TODAY}</lastmod>", 1)
    path.write_text(text, encoding="utf-8", newline="\n")


def update_sitemap():
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    entries = ""
    for post in POSTS:
        loc = f"https://toypoppo.kr/blog/{post['slug']}.html"
        if loc not in text:
            entries += f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n"
    if entries:
        text = text.replace("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n", "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + entries, 1)
    text = text.replace("<loc>https://toypoppo.kr/blog/</loc>\n    <lastmod>2026-08-14</lastmod>", f"<loc>https://toypoppo.kr/blog/</loc>\n    <lastmod>{TODAY}</lastmod>")
    path.write_text(text, encoding="utf-8", newline="\n")


def main():
    copy_images()
    write_posts()
    update_blog_index()
    update_sitemap()


if __name__ == "__main__":
    main()
