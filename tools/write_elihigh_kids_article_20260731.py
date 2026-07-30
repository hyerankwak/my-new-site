from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-07-31"
SLUG = "elihigh-kids-smart-learning-free-trial-guide"
URL = f"https://toypoppo.kr/blog/{SLUG}.html"


def ensure_project_images() -> None:
    for src, dest in [
        ("assets/images/blog/elihigh-kids-home-learning-generated.png", "assets/images/blog/elihigh-kids-home-learning-generated.png"),
        ("assets/images/blog/elihigh-kids-routine-generated.png", "assets/images/blog/elihigh-kids-routine-generated.png"),
    ]:
        path = ROOT / src
        if not path.exists():
            raise FileNotFoundError(dest)


def article_json_ld():
    graph = [
        {
            "@type": "Organization",
            "@id": "https://toypoppo.kr/#organization",
            "name": "토이포포",
            "url": "https://toypoppo.kr",
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://toypoppo.kr/"},
                {"@type": "ListItem", "position": 2, "name": "블로그", "item": "https://toypoppo.kr/blog/"},
                {"@type": "ListItem", "position": 3, "name": "엘리하이 키즈 무료체험", "item": URL},
            ],
        },
        {
            "@type": "Article",
            "headline": "엘리하이 키즈 무료체험 신청 전 체크",
            "description": "유아 한글, 수학, 영어 스마트 학습 무료체험을 신청하기 전 부모가 확인하면 좋은 기준을 정리했습니다.",
            "image": "https://toypoppo.kr/assets/images/blog/elihigh-kids-home-learning-generated.png",
            "author": {"@type": "Organization", "name": "토이포포"},
            "publisher": {"@id": "https://toypoppo.kr/#organization"},
            "datePublished": TODAY,
            "dateModified": TODAY,
            "mainEntityOfPage": URL,
            "inLanguage": "ko-KR",
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "엘리하이 키즈 무료체험은 몇 살부터 살펴보면 좋나요?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "아이마다 차이가 있지만 한글, 수 세기, 그림책, 짧은 화면 활동에 관심이 생기는 유아기부터 부모가 함께 체험하며 적합성을 확인해 볼 수 있습니다.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "한글을 아직 모르는 아이도 스마트 학습을 시작해도 되나요?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "글자를 읽는 것보다 소리 듣기, 그림 보고 말하기, 짧은 조작 활동에 흥미를 보이는지 먼저 확인하는 편이 좋습니다.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "무료체험 때 가장 먼저 확인할 것은 무엇인가요?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "가격보다 아이가 스스로 집중하는 시간, 부모가 옆에서 도와야 하는 정도, 체험 후 반복하고 싶어 하는지를 먼저 보세요.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "스마트 학습만으로 한글이나 수학 준비가 충분한가요?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "스마트 학습은 보조 도구로 보는 것이 좋습니다. 그림책 읽기, 말놀이, 블록, 수 세기 놀이 같은 실제 생활 경험과 함께 사용할 때 부담이 줄어듭니다.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "무료체험 신청 전에 조건은 어디서 확인해야 하나요?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "체험 대상, 상담 방식, 기기 발송 여부, 반납 기준, 유료 전환 조건은 신청 페이지에서 직접 확인해야 합니다. 조건은 시기에 따라 바뀔 수 있습니다.",
                    },
                },
            ],
        },
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False)


def build_article() -> str:
    ld = article_json_ld()
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>엘리하이 키즈 무료체험 신청 전 체크 | 유아 한글 수학 영어 스마트 학습 가이드 | 토이포포</title>
  <meta name="description" content="엘리하이 키즈 무료체험을 신청하기 전 유아 한글, 수학, 영어, 북클럽, 창의 사고력 스마트 학습을 부모 관점에서 점검하는 방법을 정리했습니다.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{URL}">
  <meta property="og:title" content="엘리하이 키즈 무료체험 신청 전 체크 | 토이포포">
  <meta property="og:description" content="유아 스마트 학습 무료체험을 신청하기 전 아이에게 맞는지 판단하는 부모 체크리스트입니다.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{URL}">
  <meta property="og:image" content="https://toypoppo.kr/assets/images/blog/elihigh-kids-home-learning-generated.png">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://toypoppo.kr/assets/images/blog/elihigh-kids-home-learning-generated.png">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css">
  <style>
    .article-wrap{{max-width:880px;margin:0 auto;padding:clamp(20px,4vw,46px)}}
    .article-card{{background:#fff;border:1px solid var(--line);border-radius:22px;box-shadow:0 18px 46px rgba(112,64,88,.10);padding:clamp(22px,4vw,42px)}}
    .article-card h1{{font-size:clamp(30px,5vw,48px);line-height:1.18;margin:10px 0 18px;letter-spacing:0}}
    .article-card h2{{margin:44px 0 16px;font-size:clamp(22px,3vw,30px);letter-spacing:0}}
    .article-card h3{{margin:26px 0 10px;font-size:20px;letter-spacing:0}}
    .article-card p,.article-card li{{font-size:17px;line-height:1.9;color:#5f5360}}
    .lead{{font-size:18px!important;color:#413641!important;font-weight:700}}
    .breadcrumb{{font-size:14px;color:var(--muted);margin-bottom:18px}}
    .breadcrumb a{{color:inherit}}
    .article-figure{{margin:24px auto;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 14px 34px rgba(112,64,88,.10)}}
    .article-figure img{{display:block;width:100%;height:auto}}
    .article-figure figcaption{{padding:10px 14px;font-size:13px;color:#786b74;background:#f8fffc}}
    .summary-box,.check-box,.notice-box{{margin:24px 0;padding:20px;border-radius:18px;border:1px solid #f0dce6;background:linear-gradient(135deg,#fff7fb,#f4fffb)}}
    .summary-box strong,.check-box strong{{color:#30242d}}
    .two-col{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:18px 0}}
    .mini-card{{padding:18px;border:1px solid #f0dce6;border-radius:16px;background:#fffafc}}
    .affiliate-card{{margin:30px auto;padding:18px;border:1px solid #f0dce6;border-radius:22px;background:#fff;box-shadow:0 18px 46px rgba(112,64,88,.13);max-width:560px}}
    .affiliate-card img{{display:block;width:100%;border-radius:16px;border:1px solid #f0dce6;background:#fff}}
    .affiliate-card h3{{margin:16px 0 8px;font-size:22px;line-height:1.35}}
    .affiliate-meta{{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}}
    .affiliate-meta span{{padding:6px 10px;border-radius:999px;background:#fff1f7;color:#d84f86;font-size:13px;font-weight:900}}
    .cta-button{{display:flex;align-items:center;justify-content:center;width:100%;min-height:58px;margin:16px 0 10px;border-radius:16px;background:linear-gradient(135deg,#ff4f95,#ff7661);color:#fff!important;font-size:20px;font-weight:950;text-decoration:none;box-shadow:0 14px 28px rgba(255,79,149,.22)}}
    .small-note{{font-size:13px!important;line-height:1.7!important;color:#786b74!important}}
    .related-grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}}
    .related-grid a{{padding:15px;border:1px solid #f0dce6;border-radius:14px;background:#fffafc;text-decoration:none;font-weight:900;color:#30242d}}
    @media(max-width:720px){{.article-wrap{{padding:18px 14px}}.article-card{{padding:22px 18px}}.article-card p,.article-card li{{font-size:16px;line-height:1.82}}.two-col,.related-grid{{grid-template-columns:1fr}}.cta-button{{font-size:18px;min-height:54px}}}}
  </style>
  <script type="application/ld+json">{ld}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a>
    <nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">아이와 가볼만한 곳</a></nav>
  </header>
  <main class="article-wrap">
    <article class="article-card">
      <nav class="breadcrumb" aria-label="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / 엘리하이 키즈 무료체험</nav>
      <p class="eyebrow">Preschool smart learning guide</p>
      <h1>엘리하이 키즈 무료체험 신청 전 체크: 유아 한글·수학·영어 스마트 학습, 우리 아이에게 맞을까?</h1>
      <p class="lead">유아 스마트 학습은 “빨리 시작할수록 좋은 것”이라기보다, 아이가 짧은 시간 동안 즐겁게 따라오고 부모가 생활 루틴 안에서 무리 없이 관리할 수 있을 때 효과가 커집니다. 엘리하이 키즈 무료체험을 살펴본다면 결제 여부보다 먼저 아이의 반응, 집중 시간, 부모의 관리 부담, 화면 학습 뒤 실제 놀이로 이어지는지를 확인하는 편이 좋습니다.</p>

      <figure class="article-figure">
        <img src="/assets/images/blog/elihigh-kids-home-learning-generated.png" alt="부모와 유아가 집에서 스마트 학습과 그림책 놀이를 함께 하는 모습" loading="eager">
        <figcaption>토이포포 생성형 이미지입니다.</figcaption>
      </figure>

      <div class="summary-box">
        <strong>먼저 이렇게 생각해 보세요.</strong>
        <p>무료체험은 “우리 아이가 이 프로그램을 좋아할까?”만 보는 시간이 아닙니다. 아이가 화면을 본 뒤 말로 설명할 수 있는지, 부모가 옆에서 어느 정도 도와야 하는지, 한글·수학·영어 중 어떤 영역에서 흥미가 살아나는지 보는 관찰 기간에 가깝습니다.</p>
      </div>

      <h2>엘리하이 키즈는 어떤 학습으로 볼 수 있을까?</h2>
      <p>제휴 랜딩에서 확인되는 엘리하이 키즈는 메가스터디교육의 유아 스마트 학습 브랜드로, 유아 한글, 유아 영어, 유아 수학, 북클럽, 창의 사고력, 코딩 같은 키워드를 중심으로 안내되고 있습니다. 부모 입장에서는 “학습지”와 “영상 강의” 중간쯤에 있는 도구로 이해하면 쉽습니다. 아이가 직접 화면을 조작하고, 짧은 콘텐츠를 보고, 문제나 활동을 따라 하며, 부모가 옆에서 흐름을 잡아 주는 방식입니다.</p>
      <p>다만 유아기는 아직 손으로 만지고, 몸으로 움직이고, 부모와 말로 주고받는 경험이 훨씬 중요한 시기입니다. 그래서 스마트 학습을 고를 때는 콘텐츠 양보다 아이의 하루 리듬에 자연스럽게 들어가는지를 봐야 합니다. 아무리 프로그램이 좋아도 아이가 피곤한 시간에 억지로 앉히면 학습이 아니라 갈등이 되기 쉽습니다. 반대로 하루 10~15분이라도 아이가 웃으면서 끝내고, 끝난 뒤 책이나 블록, 말놀이로 이어진다면 좋은 보조 도구가 될 수 있습니다.</p>

      <div class="affiliate-card" aria-label="엘리하이 키즈 무료체험 제휴 안내">
        <img src="/assets/images/blog/elihigh-kids-og.jpg" alt="엘리하이 키즈 무료체험 안내 이미지" loading="lazy">
        <h3>엘리하이 키즈 무료체험</h3>
        <div class="affiliate-meta"><span>유아 한글</span><span>유아 수학</span><span>유아 영어</span><span>북클럽</span></div>
        <p>아이의 연령, 현재 관심 영역, 상담 방식, 체험 조건은 신청 페이지에서 최신 내용으로 확인해 주세요.</p>
        <a class="cta-button" href="https://replyalba.com/pt/yqygnqm3LK" rel="sponsored nofollow noopener" target="_blank">무료체험 신청 조건 확인하기</a>
        <p class="small-note">이 글에는 제휴 링크가 포함되어 있으며, 링크를 통해 상담 또는 신청이 이루어질 경우 토이포포가 일정액의 수수료를 받을 수 있습니다. 체험 조건과 제공 내용은 시기에 따라 달라질 수 있습니다.</p>
      </div>

      <h2>무료체험 때 부모가 봐야 할 기준 7가지</h2>
      <div class="two-col">
        <div class="mini-card"><h3>1. 집중 시간이 짧아도 괜찮은가</h3><p>유아는 오래 앉아 있는 능력이 아직 자라는 중입니다. 30분을 채우는 것보다 10분을 기분 좋게 끝내는지가 더 중요합니다.</p></div>
        <div class="mini-card"><h3>2. 아이가 다시 해보고 싶어 하는가</h3><p>무료체험 후 “또 할래”라는 말이 나오면 흥미 신호입니다. 반대로 매번 설득이 필요하면 아직 시기가 이르거나 방식이 맞지 않을 수 있습니다.</p></div>
        <div class="mini-card"><h3>3. 부모가 옆에서 얼마나 도와야 하는가</h3><p>완전히 혼자 하길 기대하기보다, 처음에는 부모가 시작과 마무리를 도와주는 것이 자연스럽습니다. 다만 매 순간 설명해야 한다면 부담이 커질 수 있습니다.</p></div>
        <div class="mini-card"><h3>4. 화면 뒤 실제 놀이로 이어지는가</h3><p>수 세기를 배웠다면 블록을 세어 보고, 글자를 봤다면 냉장고 자석이나 그림책 제목을 찾아보는 식으로 연결되는지 살펴보세요.</p></div>
        <div class="mini-card"><h3>5. 아이 성향과 맞는가</h3><p>노래와 캐릭터에 반응하는 아이도 있고, 차분한 문제 풀이보다 이야기식 활동을 더 좋아하는 아이도 있습니다. 아이 성향이 우선입니다.</p></div>
        <div class="mini-card"><h3>6. 학습 영역이 너무 많지 않은가</h3><p>한글, 수학, 영어를 한 번에 모두 잘하려고 하면 부모도 아이도 지칩니다. 무료체험에서는 아이가 가장 편하게 반응하는 영역을 먼저 찾으세요.</p></div>
        <div class="mini-card"><h3>7. 체험 조건을 분명히 확인했는가</h3><p>상담, 기기 제공, 체험 기간, 반납, 유료 전환 조건은 반드시 신청 페이지와 상담 과정에서 직접 확인해야 합니다.</p></div>
      </div>

      <h2>연령별로 보면 포인트가 달라집니다</h2>
      <p><strong>4세 전후</strong>라면 학습 성과보다 화면 조작, 색과 모양 구분, 짧은 노래, 그림 보고 말하기에 초점을 두는 편이 좋습니다. “오늘 무엇을 배웠어?”보다 “어떤 그림이 제일 재미있었어?”라고 묻는 것이 아이에게 덜 부담스럽습니다.</p>
      <p><strong>5세 전후</strong>에는 한글 소리, 수량감, 간단한 분류 활동에 관심이 생깁니다. 이때도 정답을 빨리 맞히는 것보다 아이가 왜 그렇게 생각했는지 말하게 하는 과정이 중요합니다. 스마트 학습에서 본 그림을 종이에 다시 그리거나, 블록으로 수를 세어 보는 활동을 붙이면 기억이 훨씬 오래 갑니다.</p>
      <p><strong>6~7세 또는 예비초</strong>라면 학습 루틴을 연습하는 용도로 볼 수 있습니다. 매일 같은 시간에 짧게 앉아 보고, 끝나면 스스로 정리하는 흐름을 만들어 보세요. 초등 준비에서 정말 중요한 것은 선행 진도보다 “정해진 시간에 시작하고 끝내는 경험”입니다.</p>

      <figure class="article-figure">
        <img src="/assets/images/blog/elihigh-kids-routine-generated.png" alt="유아 학습 루틴을 위해 책, 블록, 색연필, 태블릿을 함께 준비한 모습" loading="lazy">
        <figcaption>토이포포 생성형 이미지입니다.</figcaption>
      </figure>

      <h2>집에서 이렇게 쓰면 부담이 줄어듭니다</h2>
      <p>유아 스마트 학습을 집에 들일 때 가장 흔한 실수는 처음부터 많이 시키는 것입니다. 아이가 좋아한다고 해서 하루에 여러 과목을 몰아서 하면 며칠 뒤 흥미가 떨어질 수 있습니다. 처음에는 한 영역만 정해 짧게 하고, 끝난 뒤 부모가 한두 문장으로 대화를 이어 주는 정도가 좋습니다.</p>
      <p>예를 들어 한글 콘텐츠를 본 날에는 “오늘 본 글자랑 비슷한 소리를 집에서 찾아볼까?”라고 말해 보세요. 수학 콘텐츠를 본 날에는 간식 접시, 양말, 블록처럼 생활 속 물건을 세어 보면 됩니다. 영어 콘텐츠를 본 날에도 발음을 완벽하게 따라 하게 하기보다 노래 한 구절을 흥얼거리거나 그림카드를 가리키며 말하는 정도면 충분합니다.</p>
      <p>화면 학습 뒤에는 눈과 몸을 쉬게 하는 시간이 필요합니다. 바로 다른 영상을 틀어 주기보다 물 마시기, 색칠하기, 책 한 권 보기, 블록 5개 쌓기처럼 짧은 손놀이를 붙이면 스마트 학습이 생활 속 놀이로 이어집니다.</p>

      <h2>무료체험 전 체크리스트</h2>
      <div class="check-box">
        <ul>
          <li>아이의 평소 집중 시간이 10분 안팎인지, 20분 이상 가능한지 관찰했나요?</li>
          <li>한글, 수학, 영어 중 지금 아이가 가장 흥미를 보이는 영역을 알고 있나요?</li>
          <li>부모가 매일 옆에서 봐줄 수 있는 시간대를 정했나요?</li>
          <li>화면 학습 후 그림책, 블록, 말놀이 같은 오프라인 활동을 붙일 계획이 있나요?</li>
          <li>체험 기간, 상담 방식, 기기 발송, 반납, 유료 전환 조건을 신청 페이지에서 확인했나요?</li>
          <li>아이가 싫어할 때 억지로 끝까지 시키지 않겠다는 기준을 세웠나요?</li>
        </ul>
      </div>

      <h2>이런 아이에게 특히 확인해 볼 만합니다</h2>
      <p>그림책은 좋아하지만 부모가 매일 긴 시간 읽어 주기 어려운 집, 숫자와 모양에 관심이 많은 아이, 노래와 캐릭터가 있으면 집중이 쉬운 아이, 예비초를 앞두고 짧은 학습 루틴을 연습하고 싶은 아이에게는 무료체험이 판단 자료가 될 수 있습니다. 반대로 아직 화면을 보면 지나치게 흥분하거나, 종료할 때마다 크게 힘들어하는 아이는 먼저 화면 규칙부터 잡는 편이 좋습니다.</p>
      <p>부모도 마찬가지입니다. 스마트 학습을 신청해 놓고 “알아서 하겠지”라고 기대하면 실망하기 쉽습니다. 유아기에는 부모가 시작 버튼을 눌러 주고, 중간에 한 번 웃어 주고, 끝난 뒤 “오늘 뭐가 재미있었어?”라고 묻는 작은 개입이 필요합니다. 이 정도의 동반이 가능할 때 무료체험의 의미가 살아납니다.</p>

      <div class="affiliate-card">
        <h3>우리 아이에게 맞는지 먼저 확인해 보기</h3>
        <p>무료체험은 결정보다 관찰에 가깝습니다. 아이 반응과 조건을 확인한 뒤 집의 루틴에 맞는지 판단해 보세요.</p>
        <a class="cta-button" href="https://replyalba.com/pt/yqygnqm3LK" rel="sponsored nofollow noopener" target="_blank">엘리하이 키즈 무료체험 보기</a>
        <p class="small-note">제휴 링크가 포함되어 있습니다. 신청 전 최신 혜택, 상담 방식, 체험 조건은 신청 페이지에서 다시 확인해 주세요.</p>
      </div>

      <h2>자주 묻는 질문</h2>
      <h3>엘리하이 키즈 무료체험은 몇 살부터 살펴보면 좋나요?</h3>
      <p>정해진 답은 없습니다. 다만 아이가 짧은 화면 활동을 보고 따라 할 수 있고, 부모와 간단히 대화가 되는 시기라면 무료체험을 통해 반응을 확인해 볼 수 있습니다.</p>
      <h3>한글을 몰라도 시작할 수 있나요?</h3>
      <p>한글을 읽는 능력보다 그림을 보고 말하기, 소리 듣기, 같은 모양 찾기 같은 기초 반응을 먼저 보세요. 읽기 성과를 급하게 기대하지 않는 것이 좋습니다.</p>
      <h3>스마트 학습을 하면 화면 시간이 너무 늘지 않을까요?</h3>
      <p>가능성이 있습니다. 그래서 시작 전에 하루 사용 시간을 정하고, 학습 뒤에는 책이나 손놀이로 전환하는 규칙이 필요합니다.</p>
      <h3>무료체험 때 가격만 비교하면 되나요?</h3>
      <p>가격도 중요하지만 아이가 실제로 집중하는지, 부모가 관리할 수 있는지, 체험 후 갈등이 생기지 않는지를 함께 봐야 합니다.</p>
      <h3>부모가 계속 옆에 있어야 하나요?</h3>
      <p>유아기에는 처음과 끝을 부모가 잡아 주는 편이 좋습니다. 완전히 혼자 하게 두기보다 짧게 함께 보고 대화로 마무리하는 방식이 안정적입니다.</p>
      <h3>무료체험 조건은 어디서 확인해야 하나요?</h3>
      <p>체험 대상, 제공 내용, 기기 발송 여부, 반납 기준, 유료 전환 조건은 신청 페이지와 상담 과정에서 직접 확인해야 합니다. 시기별로 달라질 수 있습니다.</p>

      <h2>함께 보면 좋은 글</h2>
      <div class="related-grid">
        <a href="/blog/elementary-online-learning-free-trial-guide.html">초등 인강 무료체험 전 체크</a>
        <a href="/blog/elementary-literacy-home-study.html">초등 문해력 키우는 집공부</a>
        <a href="/blog/first-grade-study-habit.html">초등 1학년 공부 습관</a>
        <a href="/blog/five-year-old-language-question-play.html">5세 말놀이 질문법</a>
        <a href="/parenting-tools/">토이포포 체크리스트</a>
        <a href="/worksheets/">엄마표 자료실</a>
      </div>

      <h2>마무리</h2>
      <p>엘리하이 키즈 무료체험을 볼 때 핵심은 “좋은 프로그램인가”보다 “우리 아이의 현재 리듬에 맞는가”입니다. 유아기는 많이 아는 것보다 재미있게 반복하고, 부모와 말로 나누고, 손으로 다시 해보는 경험이 중요합니다. 무료체험을 한다면 아이가 웃으며 시작하고 편하게 끝낼 수 있는지, 화면 뒤 생활 놀이로 이어지는지, 부모가 지속할 수 있는 방식인지 차분히 살펴보세요.</p>
      <p>아이에게 맞는 학습은 부모의 불안을 키우지 않습니다. 오히려 하루 루틴을 조금 더 단순하게 만들고, 아이가 “나도 해봤어”라는 감각을 갖게 도와줍니다. 그 기준으로 무료체험을 본다면 선택이 훨씬 편해질 거예요.</p>
    </article>
  </main>
</body>
</html>
"""


def update_blog_index() -> None:
    path = ROOT / "blog/index.html"
    html = path.read_text(encoding="utf-8")
    new_card = (
        f'<div class="link-grid"><a href="/blog/{SLUG}.html"><strong>엘리하이 키즈 무료체험 전 체크</strong>'
        '<span>유아 한글·수학·영어 스마트 학습을 신청하기 전 부모가 봐야 할 기준입니다.</span></a>'
        '<a href="/blog/elementary-online-learning-free-trial-guide.html"><strong>초등 인강 무료체험 전 체크</strong>'
        '<span>초등 온라인 학습 무료체험을 비교할 때 확인할 기준입니다.</span></a></div>\n      '
    )
    if f'/blog/{SLUG}.html' not in html:
        html = html.replace('<section class="section">\n      ', '<section class="section">\n      ' + new_card, 1)
    path.write_text(html, encoding="utf-8", newline="\n")


def update_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    entry = f'  <url><loc>{URL}</loc><lastmod>{TODAY}</lastmod><priority>0.8</priority></url>\n'
    if URL not in xml:
        xml = xml.replace("</urlset>", entry + "</urlset>")
    xml = re.sub(
        r"(<loc>https://toypoppo\.kr/blog/</loc><lastmod>)[^<]+(</lastmod>)",
        rf"\g<1>{TODAY}\g<2>",
        xml,
    )
    path.write_text(xml, encoding="utf-8", newline="\n")


def main() -> None:
    ensure_project_images()
    out = ROOT / "blog" / f"{SLUG}.html"
    out.write_text(build_article(), encoding="utf-8", newline="\n")
    update_blog_index()
    update_sitemap()
    print(out)


if __name__ == "__main__":
    main()
