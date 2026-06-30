from __future__ import annotations

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-06-30"


HUBS = {
    "development-play/index.html": {
        "label": "발달놀이",
        "intro": "발달놀이는 아이를 빨리 발달시키기 위한 훈련이 아니라 지금 아이가 관심을 보이는 움직임, 감각, 언어, 손 조작을 부모가 알아차리도록 돕는 생활 놀이입니다.",
        "roadmap": [
            ("6~7개월", "촉감, 거울, 까꿍, 공 굴리기처럼 부모와 눈을 맞추는 짧은 놀이부터 시작합니다.", "/blog/7-month-baby-development-play.html"),
            ("8~9개월", "기어가기 전후의 이동 욕구와 넣고 빼기, 원인 결과 놀이를 연결합니다.", "/blog/9-month-baby-development-play.html"),
            ("10~12개월", "잡고 서기, 생활 모방, 그림책 반응, 손 조작 놀이를 하루 일과 안에 넣습니다.", "/blog/12-month-baby-development-play.html"),
            ("몬테소리 연결", "발달놀이를 낮은 선반, 보물바구니, 장난감 로테이션과 연결하면 반복이 쉬워집니다.", "/montessori/"),
        ],
        "situations": [
            ("아이가 예민한 날", "소리 큰 장난감보다 익숙한 그림책, 천 촉감, 부모 목소리 놀이처럼 예측 가능한 자극을 고릅니다."),
            ("부모가 지친 날", "부모가 많이 움직이지 않아도 되는 공 굴리기, 바구니 넣기, 그림책 한 장 보기로 충분합니다."),
            ("장난감이 많은 집", "한 번에 많이 꺼내지 말고 3~5개만 보이게 두어 아이가 선택하고 반복할 시간을 줍니다."),
            ("외출 전후", "새 놀이보다 평소 하던 놀이를 짧게 반복하면 아이가 전환을 더 편하게 받아들입니다."),
        ],
    },
    "parent-guide/index.html": {
        "label": "부모가이드",
        "intro": "부모가이드는 완벽한 육아법을 제시하기보다 부모가 덜 지치면서 아이의 하루를 안정적으로 이어가도록 돕는 생활형 안내서입니다.",
        "roadmap": [
            ("하루 일과 먼저 보기", "7개월, 8개월, 10개월처럼 월령별 하루 흐름을 보고 우리 집 리듬에 맞게 줄입니다.", "/parent-guide/7-month-daily-routine.html"),
            ("놀이 환경 정리", "장난감 정리와 로테이션을 먼저 정리하면 아이의 집중 시간이 조금씩 안정됩니다.", "/parent-guide/toy-rotation-guide.html"),
            ("그림책과 말놀이", "그림책을 끝까지 읽기보다 아이가 보는 장면에서 짧게 대화하는 법을 확인합니다.", "/parent-guide/how-to-read-picture-books.html"),
            ("부모 번아웃 대응", "부모가 지친 날 가능한 놀이와 주말 계획을 따로 준비하면 지속하기 쉽습니다.", "/parent-guide/parent-burnout-play.html"),
        ],
        "situations": [
            ("아침이 힘든 집", "등원 전 루틴은 선택지를 줄이고 같은 순서를 반복하는 것이 핵심입니다."),
            ("잠자리 전쟁이 있는 집", "잠들기 직전 새 자극을 줄이고 씻기, 책, 인사처럼 같은 흐름을 유지합니다."),
            ("형제가 있는 집", "함께 쓰는 장난감과 각자 쓰는 장난감을 나누면 갈등이 줄어듭니다."),
            ("비 오는 날", "집콕 놀이는 에너지 발산과 차분한 마무리를 한 세트로 구성하면 좋습니다."),
        ],
    },
    "counseling/index.html": {
        "label": "상담소",
        "intro": "상담소는 부모가 검색창에 그대로 입력하는 질문을 모아 불안을 키우지 않는 기준으로 풀어낸 카테고리입니다.",
        "roadmap": [
            ("입에 넣고 던지는 행동", "구강 탐색, 던지기, 물어뜯기처럼 흔한 행동을 발달 과정 안에서 봅니다.", "/counseling/toy-in-mouth.html"),
            ("발달 개인차", "배밀이, 혼자 놀이, 낯가림처럼 개인차가 큰 주제를 무리하게 단정하지 않습니다.", "/counseling/no-crawling-7-month.html"),
            ("장난감 고민", "장난감이 너무 많거나 관심이 없거나 같은 것만 반복하는 상황을 정리합니다.", "/counseling/too-many-toys.html"),
            ("미디어와 책", "TV 노출, 그림책 거부, 책 물어뜯기처럼 부모가 자주 부딪히는 고민을 다룹니다.", "/counseling/screen-time-baby.html"),
        ],
        "situations": [
            ("걱정이 커질 때", "한 번의 행동으로 결론 내리기보다 기간, 빈도, 아이 컨디션을 함께 봅니다."),
            ("전문가 상담이 필요할 때", "부모가 지속적으로 걱정되거나 일상생활에 어려움이 크면 소아청소년과나 발달 전문가 상담을 권합니다."),
            ("주변 말이 흔들릴 때", "또래 비교보다 아이의 이전 모습과 현재 생활 흐름을 기준으로 보는 것이 좋습니다."),
            ("해결책을 찾을 때", "상담소 글 하단의 발달놀이, 부모가이드, 체크리스트로 바로 이어가도록 구성합니다."),
        ],
    },
    "montessori/index.html": {
        "label": "몬테소리",
        "intro": "몬테소리는 교구를 많이 사는 교육이 아니라 아이가 스스로 선택하고 반복하며 생활 속 독립성을 키우도록 환경을 준비하는 철학입니다.",
        "roadmap": [
            ("입문", "몬테소리란 무엇인지와 부모가 가장 많이 오해하는 부분을 먼저 읽습니다.", "/montessori/what-is-montessori.html"),
            ("환경", "낮은 선반, 작은 바구니, 아이 눈높이 정리처럼 집에서 바로 바꿀 수 있는 지점을 봅니다.", "/montessori/prepared-environment.html"),
            ("5대 영역", "일상생활, 감각, 언어, 수학, 문화 영역이 어떻게 이어지는지 확인합니다.", "/montessori/five-areas.html"),
            ("연령별", "6개월부터 48개월까지 발달에 맞는 활동을 무리 없이 고릅니다.", "/montessori/age-6-month.html"),
        ],
        "situations": [
            ("교구 구매 전", "아이의 반복 행동과 집의 정리 환경을 먼저 본 뒤 필요한 물건만 고릅니다."),
            ("집이 좁을 때", "방 전체보다 선반 한 칸, 바구니 두 개, 작은 테이블 하나부터 시작해도 충분합니다."),
            ("아이가 관심 없을 때", "교구가 맞지 않는 것이 아니라 시기, 난이도, 배치가 맞지 않을 수 있습니다."),
            ("부모가 개입하고 싶을 때", "위험하지 않다면 조금 기다리고, 말보다 느린 시범으로 보여주는 편이 좋습니다."),
        ],
    },
    "worksheets/index.html": {
        "label": "엄마표 자료실",
        "intro": "엄마표 자료실은 PDF만 내려받는 공간이 아니라 부모가 주제를 설명하고 아이와 대화하며 활동지를 활용할 수 있도록 만든 교육자료 허브입니다.",
        "roadmap": [
            ("한국사 시작", "고구려, 백제, 신라, 세종대왕, 이순신처럼 인물과 시대를 이야기로 시작합니다.", "/worksheets/goguryeo-worksheet.html"),
            ("언어 자료", "한글 받침, 속담, 사자성어를 짧은 예문과 생활 대화로 연결합니다.", "/worksheets/hangeul-final-consonant-worksheet.html"),
            ("초등 독해", "긴 글을 빨리 푸는 것보다 핵심 문장과 근거 찾기를 먼저 연습합니다.", "/worksheets/elementary-reading-worksheet.html"),
            ("놀이자료", "미로찾기와 색칠 활동은 집중, 방향감, 손 조절을 부담 없이 연습하게 해줍니다.", "/worksheets/maze-printable.html"),
        ],
        "situations": [
            ("처음 시작할 때", "한 장을 다 끝내기보다 부모가 주제 설명을 먼저 읽어주고 한두 문항만 해도 됩니다."),
            ("아이가 싫어할 때", "워크지를 학습지처럼 밀어붙이지 말고 퀴즈나 이야기 대화로 바꿔보세요."),
            ("초등 준비", "정답보다 문장으로 말하기, 이유 설명하기, 다시 읽기를 더 중요하게 봅니다."),
            ("PDF 활용", "출력물은 보조 자료이고 부모의 설명과 대화가 핵심입니다."),
        ],
    },
    "parenting-tools/index.html": {
        "label": "체크리스트",
        "intro": "체크리스트는 부모가 오늘 필요한 준비와 관찰을 빠르게 정리하도록 돕는 실행형 카테고리입니다.",
        "roadmap": [
            ("발달 관찰", "개월별 발달 체크는 진단이 아니라 놀이 방향을 고르는 참고 자료입니다.", "/parenting-tools/development-checklist.html"),
            ("놀이 선택", "오늘의 놀이 체크리스트로 아이 컨디션과 부모 에너지에 맞는 활동을 고릅니다.", "/parenting-tools/today-play.html"),
            ("구매 전 확인", "장난감 선택 체크리스트로 안전성, 사용 기간, 보관 공간을 먼저 봅니다.", "/parenting-tools/toy-selection-guide.html"),
            ("생활 준비", "외출, 어린이집, 예방접종 기록, 엄마표 학습을 상황별로 확인합니다.", "/parenting-tools/outing-checklist.html"),
        ],
        "situations": [
            ("시간이 없을 때", "모든 항목을 보지 말고 오늘 필요한 섹션 하나만 확인해도 됩니다."),
            ("걱정될 때", "체크 결과를 진단처럼 보지 말고 전문가 상담이 필요한지 판단하는 메모로 사용합니다."),
            ("반복 방문", "외출 전, 등원 전, 장난감 구매 전처럼 반복되는 순간에 다시 확인하기 좋습니다."),
            ("관련 글 연결", "체크 후 발달놀이, 상담소, 몬테소리 글로 자연스럽게 이동할 수 있습니다."),
        ],
    },
    "local-info/index.html": {
        "label": "우리동네 육아정보",
        "intro": "우리동네 육아정보는 지역 시설을 단순 검색하는 페이지가 아니라 아이와 실제로 갈 만한 박물관, 미술관, 과학관, 자연사관을 부모 관점에서 살피는 지역 허브입니다.",
        "roadmap": [
            ("지역으로 찾기", "서울, 경기, 인천, 부산 등 지역별로 아이와 갈 만한 장소를 먼저 봅니다.", "/local-info/seoul/"),
            ("박물관", "비 오는 날이나 주말에 갈 수 있는 전시 중심 장소를 확인합니다.", "/local-info/museums.html"),
            ("과학관", "초등 아이와 유아가 함께 가기 좋은 체험형 과학관을 봅니다.", "/local-info/science-museums.html"),
            ("자연사관", "공룡, 동물, 지구, 생태 주제를 좋아하는 아이에게 맞는 장소를 찾습니다.", "/local-info/natural-history-museums.html"),
        ],
        "situations": [
            ("비 오는 날", "실내 동선, 유모차 가능 여부, 휴게 공간을 먼저 확인합니다."),
            ("초등 아이와 갈 때", "체험보다 전시 설명을 읽고 질문하는 시간을 함께 잡으면 좋습니다."),
            ("유아와 갈 때", "관람 시간을 짧게 잡고 중간 휴식이 가능한 장소를 우선합니다."),
            ("방문 전 확인", "운영시간, 예약, 휴관일, 주차는 공식 홈페이지에서 최종 확인합니다."),
        ],
    },
    "blog/index.html": {
        "label": "블로그",
        "intro": "블로그는 토이포포의 최신 육아 정보와 발달놀이, 부모 루틴, 독서 습관을 모아두는 업데이트 공간입니다.",
        "roadmap": [
            ("발달놀이 글", "6개월부터 12개월까지 집에서 할 수 있는 놀이를 월령별로 읽습니다.", "/blog/7-month-baby-development-play.html"),
            ("생활 루틴", "하루 놀이 루틴과 장난감 로테이션처럼 반복되는 생활 주제를 확인합니다.", "/blog/6-month-baby-daily-play-routine.html"),
            ("초등 학습", "독서 습관과 공부 루틴은 초등 부모가 함께 읽기 좋습니다.", "/blog/elementary-reading-habit.html"),
            ("몬테소리", "집에서 하는 몬테소리 놀이와 환경 구성을 블로그 관점으로 연결합니다.", "/blog/montessori-play-at-home.html"),
        ],
        "situations": [
            ("새 글 확인", "최근 업데이트를 통해 사이트가 계속 관리되고 있음을 보여줍니다."),
            ("정보형 글", "상품 추천보다 실제 생활에 도움이 되는 주제를 우선합니다."),
            ("검색 유입", "부모가 실제로 검색하는 문장형 고민을 자연스럽게 다룹니다."),
            ("내부 연결", "블로그에서 상담소, 발달놀이, 체크리스트로 이어지게 구성합니다."),
        ],
    },
}


def section_html(data: dict[str, object]) -> str:
    label = data["label"]
    roadmap = data["roadmap"]
    situations = data["situations"]
    roadmap_html = "".join(
        f'<a href="{href}"><strong>{title}</strong><span>{desc}</span></a>'
        for title, desc, href in roadmap
    )
    situation_html = "".join(
        f"<div><strong>{title}</strong><span>{desc}</span></div>"
        for title, desc in situations
    )
    return f"""
    <section class="section category-depth">
      <div class="section-head"><div><p class="eyebrow">Category Guide</p><h2>{label} 카테고리 읽는 순서</h2></div><p>{data['intro']}</p></div>
      <div class="link-grid">{roadmap_html}</div>
    </section>
    <section class="section category-depth">
      <div class="section-head"><div><p class="eyebrow">Parent Use Cases</p><h2>이럴 때 먼저 보세요</h2></div><p>부모가 실제 생활에서 다시 찾아볼 수 있는 상황별 기준을 정리했습니다.</p></div>
      <div class="quick-grid">{situation_html}</div>
    </section>
    <section class="section category-depth">
      <div class="section-head"><div><p class="eyebrow">Related Flow</p><h2>{label}에서 이어지는 다음 단계</h2></div><p>한 카테고리 안에서 끝나지 않고 토이포포의 다른 자료와 자연스럽게 연결됩니다.</p></div>
      <div class="related-grid">
        <a href="/development-play/"><strong>발달놀이</strong><span>아이 월령과 발달 흐름에 맞는 놀이로 이어집니다.</span></a>
        <a href="/montessori/"><strong>몬테소리</strong><span>집 환경과 반복 활동을 함께 정리합니다.</span></a>
        <a href="/counseling/"><strong>상담소</strong><span>부모가 자주 묻는 고민을 질문형으로 확인합니다.</span></a>
        <a href="/parenting-tools/"><strong>체크리스트</strong><span>읽은 내용을 오늘 바로 확인할 수 있는 표로 바꿉니다.</span></a>
      </div>
    </section>
    <section class="section category-more">
      <div class="section-head"><div><p class="eyebrow">Editorial Standard</p><h2>{label} 콘텐츠 운영 기준</h2></div><p>토이포포는 카테고리 허브가 단순 링크 모음으로 보이지 않도록 각 주제의 사용 맥락과 주의사항을 함께 안내합니다.</p></div>
      <div class="grid two">
        <div class="info-box"><h3>부모의 실제 상황 우선</h3><p>검색 키워드만 보고 글을 묶지 않고, 부모가 언제 이 정보를 다시 찾는지 먼저 생각합니다. 아침 준비, 외출 전, 장난감 구매 전, 아이 행동이 걱정될 때처럼 실제 장면을 기준으로 설명합니다.</p></div>
        <div class="info-box"><h3>아이 비교를 줄이는 표현</h3><p>발달과 육아 정보는 불안을 키우기 쉽기 때문에 단정적인 표현을 피합니다. 아이마다 속도가 다르다는 점을 전제로 두고, 부모가 관찰할 수 있는 변화와 조절할 수 있는 환경을 중심으로 안내합니다.</p></div>
        <div class="info-box"><h3>다음 행동까지 연결</h3><p>카테고리 글을 읽고 끝나는 것이 아니라 체크리스트, 발달놀이, 상담소, 엄마표 자료실로 이동해 바로 적용할 수 있게 내부 링크를 촘촘히 연결합니다.</p></div>
        <div class="info-box"><h3>광고보다 정보 우선</h3><p>상품 추천이 필요한 글에서도 구매 링크보다 발달 단계, 사용 목적, 안전성, 정리 편의성 같은 판단 기준을 먼저 설명합니다. 애드센스 승인 전후에도 정보 비중을 우선합니다.</p></div>
      </div>
    </section>
    <section class="section category-more">
      <div class="section-head"><div><p class="eyebrow">FAQ</p><h2>{label} 카테고리 자주 묻는 질문</h2></div><p>처음 들어온 부모가 카테고리를 어떻게 활용하면 좋은지 짧게 정리했습니다.</p></div>
      <details open><summary>이 카테고리는 어떤 부모에게 가장 도움이 되나요?</summary><p>{data['intro']} 그래서 처음 방문한 부모뿐 아니라 이미 관련 글을 읽은 부모도 상황별로 다시 찾아보기 좋습니다.</p></details>
      <details><summary>글을 어떤 순서로 읽으면 좋나요?</summary><p>상단의 대표 글을 먼저 읽고, 그다음 상황별 추천 섹션에서 우리 집에 가까운 장면을 고르는 방식이 좋습니다. 모든 글을 한 번에 읽기보다 지금 필요한 글 하나를 고르는 것이 더 현실적입니다.</p></details>
      <details><summary>상품 추천 글과 정보 글은 어떻게 구분하나요?</summary><p>토이포포는 상품을 바로 나열하기보다 발달 단계, 사용 목적, 부모의 생활 상황을 먼저 설명합니다. 구매가 필요한 경우에도 왜 필요한지와 주의할 점을 함께 안내합니다.</p></details>
      <details><summary>건강이나 발달 판단도 이 사이트에서 할 수 있나요?</summary><p>아니요. 토이포포는 일반적인 육아 정보를 제공하는 사이트입니다. 건강이나 발달에 대한 걱정이 지속된다면 소아청소년과, 영유아검진, 관련 전문가 상담을 우선해야 합니다.</p></details>
    </section>
"""


def enrich_file(path: Path, data: dict[str, object]) -> None:
    s = path.read_text(encoding="utf-8")
    block = section_html(data)
    if "category-depth" not in s:
        s = s.replace("</main>", block + "\n  </main>", 1)
    elif "category-more" not in s:
        more = block.split('<section class="section category-more">', 1)[1]
        more = '<section class="section category-more">' + more
        s = s.replace("</main>", more + "\n  </main>", 1)
    s = s.replace('"dateModified":"2026-06-27"', f'"dateModified":"{TODAY}"')
    path.write_text(s, encoding="utf-8")


def update_sitemap(paths: list[str]) -> None:
    sitemap = ROOT / "sitemap.xml"
    s = sitemap.read_text(encoding="utf-8")
    for rel in paths:
        url = "https://toypoppo.kr/" + rel.replace("index.html", "").replace("\\", "/")
        pattern = rf"(<loc>{re.escape(url)}</loc><lastmod>)[^<]+(</lastmod>)"
        s = re.sub(pattern, rf"\g<1>{TODAY}\2", s)
    sitemap.write_text(s, encoding="utf-8")


def main() -> None:
    touched = []
    for rel, data in HUBS.items():
        path = ROOT / rel
        if path.exists():
            enrich_file(path, data)
            touched.append(rel)
    update_sitemap(touched)
    print(f"Enriched {len(touched)} category hubs")


if __name__ == "__main__":
    main()
