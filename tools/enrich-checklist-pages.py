from __future__ import annotations

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-06-30"


COMMON_RELATED = """
<section>
  <h2>체크 후 함께 보면 좋은 흐름</h2>
  <div class="quick-grid">
    <div><strong>발달놀이로 연결</strong><span>체크한 항목 중 아이가 어려워한 부분은 훈련이 아니라 놀이 주제로 바꿔 접근합니다.</span></div>
    <div><strong>몬테소리 환경으로 연결</strong><span>아이 손이 닿는 위치, 물건 개수, 정리 동선을 조정하면 같은 활동도 훨씬 안정적으로 이어집니다.</span></div>
    <div><strong>상담소 글로 연결</strong><span>입에 넣기, 낯가림, 혼자 놀이, 장난감 거부처럼 걱정되는 행동은 상담소 글에서 따로 확인합니다.</span></div>
    <div><strong>엄마표 자료실로 연결</strong><span>유아와 초등 아이는 체크 후 한 장짜리 활동지나 그림책 대화로 자연스럽게 이어갈 수 있습니다.</span></div>
  </div>
</section>
"""


DATA: dict[str, dict[str, str]] = {
    "development-checklist.html": {
        "title": "개월별 발달 체크리스트",
        "why": "발달 체크리스트는 아이를 빠르게 판단하기 위한 표가 아니라 부모가 아이의 변화를 놓치지 않기 위한 관찰 도구입니다. 같은 8개월이라도 어떤 아이는 기는 동작이 빠르고, 어떤 아이는 앉아서 손 조작을 오래 할 수 있습니다. 중요한 것은 또래와 비교하는 일이 아니라 지난달보다 어떤 행동이 늘었는지, 어떤 상황에서 아이가 편안해지는지 보는 것입니다.",
        "before": "체크하기 전에는 아이가 졸리거나 배고프지 않은 시간인지 먼저 봅니다. 컨디션이 좋지 않은 날에는 평소 하던 행동도 덜 보일 수 있습니다. 한 번 체크한 결과로 결론을 내리지 말고 2~4주 간격으로 같은 항목을 다시 보며 흐름을 기록하세요.",
        "tips": "체크가 적은 영역은 바로 걱정하기보다 놀이 환경을 바꿔볼 지점으로 삼습니다. 예를 들어 손 조작 항목이 적다면 작은 부품을 사기보다 큰 컵, 천 공, 부드러운 블록처럼 안전한 물건으로 넣고 빼기 놀이를 해볼 수 있습니다.",
    },
    "today-play.html": {
        "title": "오늘의 놀이 체크리스트",
        "why": "오늘의 놀이 체크리스트는 부모가 매일 새로운 놀이를 찾아 헤매지 않도록 돕는 자료입니다. 아이에게 필요한 것은 대단한 준비물이 아니라 지금 컨디션에 맞는 작은 반복입니다. 활동적인 날에는 몸을 쓰는 놀이가 잘 맞고, 예민한 날에는 익숙한 그림책이나 촉감놀이처럼 예측 가능한 놀이가 안정감을 줍니다.",
        "before": "놀이를 고르기 전에는 부모의 에너지도 함께 확인해야 합니다. 부모가 지친 날에 복잡한 미술놀이나 정리가 어려운 활동을 고르면 금방 부담이 됩니다. 그런 날은 공 굴리기, 책 한 권 읽기, 색깔 찾기처럼 부모가 옆에서 반응만 해도 되는 놀이가 더 현실적입니다.",
        "tips": "놀이가 잘 되지 않을 때는 시간을 줄여보세요. 20분 놀이보다 5분 놀이를 편안하게 끝내는 편이 다음 놀이로 이어지기 쉽습니다. 아이가 거부하면 실패가 아니라 오늘은 다른 자극이 필요한 날이라는 신호로 보면 됩니다.",
    },
    "toy-selection-guide.html": {
        "title": "장난감 선택 체크리스트",
        "why": "장난감 선택 체크리스트는 유행하는 제품을 고르기보다 아이의 현재 놀이 행동을 기준으로 선택하도록 돕습니다. 같은 월령이라도 어떤 아이는 몸을 크게 움직이는 놀이를 좋아하고, 어떤 아이는 작은 조작을 오래 반복합니다. 장난감은 아이의 관심과 집의 생활 방식에 맞아야 오래 쓰입니다.",
        "before": "구매 전에는 부품 크기, 세척 가능 여부, 소리 크기, 보관 공간, 형제와 함께 쓸 때의 안전성을 확인하세요. 특히 영유아는 입에 넣는 행동이 자연스럽기 때문에 작은 부품과 쉽게 벗겨지는 코팅은 피하는 것이 좋습니다.",
        "tips": "장난감은 한 번에 많이 꺼내두기보다 5~6개 정도만 보이게 두고 반응을 보는 것이 좋습니다. 아이가 같은 장난감을 반복한다면 지루한 것이 아니라 그 장난감에서 아직 배울 것이 남아 있다는 뜻일 수 있습니다.",
    },
    "outing-checklist.html": {
        "title": "외출 준비 체크리스트",
        "why": "외출 준비 체크리스트는 가방을 무겁게 만드는 표가 아니라 상황에 맞춰 꼭 필요한 물건을 고르는 기준입니다. 짧은 산책, 병원 방문, 장거리 이동, 실내 체험 시설은 필요한 준비물이 다릅니다. 모든 물건을 챙기려 하면 부모도 지치고 실제로 필요한 물건을 찾기 어려워집니다.",
        "before": "외출 전에는 이동 시간, 식사와 낮잠 시간, 수유나 화장실 가능 여부, 주차와 유모차 사용 가능 여부를 먼저 확인합니다. 아이가 예민한 편이라면 새로운 장난감보다 익숙한 손수건이나 작은 책 하나가 더 안정적일 수 있습니다.",
        "tips": "가방은 기본 파우치와 상황별 파우치로 나누면 편합니다. 기본 파우치에는 물티슈, 여벌, 비닐봉투를 넣고, 상황별 파우치에는 간식, 상비약, 방수용품처럼 그날 필요한 물건만 더합니다.",
    },
    "daycare-checklist.html": {
        "title": "어린이집 준비물 체크리스트",
        "why": "어린이집 준비물 체크리스트는 물건을 빠뜨리지 않기 위한 목록이면서 아이가 새로운 환경에 적응하도록 돕는 준비 과정입니다. 이름표, 여벌옷, 낮잠 이불처럼 눈에 보이는 준비물도 중요하지만 아이가 자기 물건을 알아보고 안정감을 느끼는 것도 중요합니다.",
        "before": "기관마다 필요한 준비물이 다르므로 어린이집 안내문을 가장 먼저 확인해야 합니다. 토이포포 체크리스트는 기본 흐름을 정리한 자료이고, 실제 준비는 담임 교사 안내와 기관 규정을 우선합니다.",
        "tips": "입소 전에는 물건을 한꺼번에 사기보다 첫 주에 꼭 필요한 것부터 준비하세요. 아이가 좋아하는 그림이나 색으로 이름표를 통일하면 자기 물건을 찾는 데 도움이 됩니다. 여벌옷은 예쁜 옷보다 입고 벗기 쉬운 옷이 좋습니다.",
    },
    "vaccination-check.html": {
        "title": "예방접종 기록 체크리스트",
        "why": "예방접종 기록 체크리스트는 접종 일정을 대신 계산하거나 확정하는 도구가 아닙니다. 부모가 병원 방문 전 접종 기록, 아이 컨디션, 궁금한 질문을 정리하도록 돕는 참고 자료입니다. 실제 접종 여부와 일정은 의료기관과 공식 예방접종 안내를 확인해야 합니다.",
        "before": "확인 전에는 아기수첩, 병원 앱, 예방접종도우미 기록을 함께 준비하세요. 이전 접종일과 백신 종류, 접종 후 반응을 적어두면 진료실에서 질문하기가 훨씬 쉬워집니다.",
        "tips": "접종 당일에는 발열, 컨디션 저하, 최근 복용 약, 이전 접종 후 특이 반응을 의료진에게 먼저 이야기하세요. 체크리스트는 부모가 질문을 잊지 않기 위한 메모일 뿐, 의학적 판단을 대신하지 않습니다.",
    },
    "home-learning-recommend.html": {
        "title": "엄마표 학습 체크리스트",
        "why": "엄마표 학습 체크리스트는 문제를 많이 푸는 계획표가 아니라 오늘 아이와 어떤 대화를 나눌지 고르는 자료입니다. 유아와 초등 저학년은 한 장을 끝내는 것보다 주제를 이해하고 자기 말로 설명해보는 시간이 더 중요합니다.",
        "before": "학습 전에는 아이가 피곤하지 않은지, 오늘 집중할 수 있는 시간이 어느 정도인지 먼저 봅니다. 10분만 가능한 날에는 한 문항만 해도 괜찮습니다. 부모가 욕심을 내면 자료가 좋은 날에도 아이가 학습을 부담으로 느낄 수 있습니다.",
        "tips": "워크지를 사용할 때는 부모가 먼저 짧게 이야기로 열어주세요. 예를 들어 고구려 워크지는 '넓은 땅을 지키던 나라'처럼 한 문장으로 시작하고, 아이가 기억한 단어를 말하게 하면 자연스럽습니다.",
    },
}


FAQ = """
<section>
  <h2>부모들이 자주 묻는 질문</h2>
  <details open><summary>체크리스트 결과가 적게 나오면 문제가 있는 건가요?</summary><p>아닙니다. 체크리스트는 진단표가 아니라 관찰을 돕는 자료입니다. 아이의 컨디션, 수면, 낯선 환경, 부모의 질문 방식에 따라 결과가 달라질 수 있습니다.</p></details>
  <details><summary>얼마나 자주 확인하면 좋나요?</summary><p>발달과 놀이 관련 항목은 매일 보기보다 2~4주 간격으로 흐름을 보는 편이 좋습니다. 준비물 체크리스트는 외출이나 입소처럼 실제 상황이 있을 때마다 사용하면 충분합니다.</p></details>
  <details><summary>체크가 안 된 항목은 바로 연습해야 하나요?</summary><p>바로 훈련처럼 접근하지 않는 것이 좋습니다. 아이가 부담을 느끼지 않도록 놀이, 생활 참여, 환경 조정으로 자연스럽게 경험을 늘려주세요.</p></details>
  <details><summary>아이 월령과 실제 발달이 다르면 어느 쪽을 따라야 하나요?</summary><p>월령은 참고 기준이고 실제 아이의 모습이 더 중요합니다. 아이가 편안하게 할 수 있는 단계에서 시작해 조금씩 확장하는 것이 좋습니다.</p></details>
  <details><summary>전문가 상담이 필요한 경우도 있나요?</summary><p>부모가 지속적으로 걱정되는 부분이 있거나 영유아검진에서 상담을 권유받았다면 소아청소년과, 발달 전문가, 기관 교사와 구체적으로 상의하는 것이 좋습니다.</p></details>
</section>
"""


def enrichment_html(data: dict[str, str]) -> str:
    return f"""
<section class="summary-box soft">
  <strong>{data['title']}를 자세히 안내하는 이유</strong>
  <p>{data['why']}</p>
</section>
<section>
  <h2>사용 전 먼저 확인할 것</h2>
  <p>{data['before']}</p>
  <div class="quick-grid">
    <div><strong>아이 컨디션</strong><span>졸림, 배고픔, 낯선 장소, 감기 기운이 있으면 평소와 다른 반응이 나올 수 있습니다.</span></div>
    <div><strong>부모의 여유</strong><span>체크리스트는 부모를 몰아붙이는 표가 아닙니다. 오늘 가능한 만큼만 확인해도 충분합니다.</span></div>
    <div><strong>생활 환경</strong><span>집 구조, 어린이집 안내, 외출 장소, 가족 일정에 맞춰 항목을 줄이거나 바꿔도 됩니다.</span></div>
    <div><strong>공식 안내</strong><span>건강, 예방접종, 발달 판단은 공식 안내와 전문가 상담을 우선합니다.</span></div>
  </div>
</section>
<section>
  <h2>상황별 활용 예시</h2>
  <p>아침에는 오늘 꼭 필요한 항목만 빠르게 확인하고, 낮에는 아이 반응을 관찰하고, 저녁에는 다음에 다시 시도할 항목을 한두 개만 메모해보세요. 체크리스트를 완성하는 것보다 부모가 아이를 더 잘 이해하게 되는 것이 핵심입니다.</p>
  <p>{data['tips']}</p>
</section>
<section>
  <h2>얇은 체크가 아니라 기록으로 남기는 방법</h2>
  <p>체크 후에는 결과를 점수처럼 남기지 말고 짧은 문장으로 적어보세요. “공 굴리기를 3번 따라왔다”, “외출 전 간식이 필요했다”, “어린이집 낮잠 이불을 낯설어했다”처럼 실제 장면을 기록하면 다음 선택이 훨씬 쉬워집니다.</p>
  <p>이런 기록은 부모에게도 도움이 됩니다. 매번 새로 고민하지 않아도 우리 아이가 편안해지는 패턴, 자주 필요한 준비물, 잘 맞는 놀이 시간을 알 수 있기 때문입니다.</p>
</section>
{COMMON_RELATED}
{FAQ}
"""


def clean_existing_generic_faq(s: str) -> str:
    # Keep the original interactive tool and related links, but replace shallow FAQ sections.
    s = re.sub(r"<section><h2>자주 묻는 질문</h2>.*?</section>", "", s, flags=re.S)
    return s


def enrich_page(path: Path, data: dict[str, str]) -> None:
    s = path.read_text(encoding="utf-8")
    s = re.sub(
        r'(<section class="summary-box soft">\s*<strong>).*?(</strong>)',
        rf"\g<1>{data['title']}를 자세히 안내하는 이유\2",
        s,
        count=1,
        flags=re.S,
    )
    s = s.replace("를 얇게 쓰지 않는 이유", "를 자세히 안내하는 이유")
    if "체크리스트를 얇게 쓰지 않는 이유" in s:
        s = s.replace("체크리스트를 얇게 쓰지 않는 이유", "체크리스트를 자세히 안내하는 이유")
    if "사용 전 먼저 확인할 것" in s and "부모들이 자주 묻는 질문" in s:
        path.write_text(s, encoding="utf-8")
        return
    s = s.replace('dateModified":"2026-06-27"', f'dateModified":"{TODAY}"')
    s = s.replace("체크리스트 도구입니다", "체크리스트입니다")
    s = s.replace("추천하는 도구입니다", "추천하는 체크리스트입니다")
    s = clean_existing_generic_faq(s)
    marker = '<section class="note-box"><strong>전문가 상담 안내</strong>'
    if marker in s:
        s = s.replace(marker, enrichment_html(data) + "\n      " + marker, 1)
    else:
        s = s.replace("</article>", enrichment_html(data) + "\n    </article>", 1)
    path.write_text(s, encoding="utf-8")


def enrich_index() -> None:
    path = ROOT / "parenting-tools" / "index.html"
    s = path.read_text(encoding="utf-8")
    extra = """
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Use Cases</p><h2>부모가 실제로 다시 찾는 순간</h2></div><p>체크리스트는 한 번 읽고 끝나는 글보다 반복 방문 가능성이 높습니다.</p></div>
      <div class="quick-grid">
        <div><strong>외출 10분 전</strong><span>기저귀, 물티슈, 여벌옷, 물병처럼 빠뜨리기 쉬운 항목을 빠르게 확인합니다.</span></div>
        <div><strong>장난감 구매 전</strong><span>유행 제품을 바로 고르기 전에 월령, 놀이 목적, 보관 공간, 안전 기준을 점검합니다.</span></div>
        <div><strong>어린이집 입소 전</strong><span>기관 안내문을 기준으로 이름표, 여벌, 낮잠 준비물, 적응 준비를 나눠 확인합니다.</span></div>
        <div><strong>놀이가 막힐 때</strong><span>오늘 컨디션에 맞춰 몸놀이, 조용한 놀이, 부모가 지친 날 가능한 놀이를 고릅니다.</span></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Quality Standard</p><h2>체크리스트 작성 기준</h2></div><p>토이포포는 단순 목록이 아니라 부모가 판단 기준을 이해하도록 설명을 함께 제공합니다.</p></div>
      <p>체크리스트 페이지는 항목만 나열하면 금방 얇아 보일 수 있습니다. 그래서 각 글에는 왜 확인해야 하는지, 사용 전 무엇을 봐야 하는지, 상황별로 어떻게 조절하는지, 체크 후 어떤 관련 글로 이어지면 좋은지를 함께 넣었습니다.</p>
      <p>특히 발달과 건강에 가까운 주제는 확정적으로 말하지 않습니다. 발달 체크는 관찰용이며, 예방접종 기록 체크리스트는 접종 일정을 확정하는 기능이 아니라 병원 방문 전 질문을 정리하는 용도입니다. 이런 안전한 표현은 부모에게도, 검색엔진과 광고 심사에도 더 신뢰감 있는 구조를 만듭니다.</p>
    </section>
"""
    if "부모가 실제로 다시 찾는 순간" not in s:
        s = s.replace('<section class="principles"><h2>체크리스트 운영 원칙</h2>', extra + '\n    <section class="principles"><h2>체크리스트 운영 원칙</h2>', 1)
    if "체크리스트가 사이트 가치에 도움이 되는 이유" in s:
        path.write_text(s, encoding="utf-8")
        return
    block = """
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Editorial Value</p><h2>체크리스트가 사이트 가치에 도움이 되는 이유</h2></div><p>단순한 버튼형 도구가 아니라 부모가 상황을 정리하고 다음 글로 이동할 수 있는 정보 허브로 설계했습니다.</p></div>
      <div class="grid two">
        <div class="info-box"><h3>정보를 행동으로 바꿈</h3><p>발달놀이, 몬테소리, 부모 가이드 글을 읽은 뒤 실제로 무엇을 확인해야 하는지 체크리스트로 정리합니다.</p></div>
        <div class="info-box"><h3>재방문 이유를 만듦</h3><p>외출, 어린이집, 놀이 선택처럼 반복되는 상황에서 부모가 다시 들어와 확인할 수 있습니다.</p></div>
        <div class="info-box"><h3>얇은 계산기형 페이지를 피함</h3><p>각 체크리스트에는 사용 기준, 주의사항, FAQ, 관련 글을 함께 넣어 정보성 페이지로 구성합니다.</p></div>
        <div class="info-box"><h3>안전한 표현 유지</h3><p>건강과 발달 영역은 진단처럼 말하지 않고 공식 안내와 전문가 상담을 우선하도록 안내합니다.</p></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Use Cases</p><h2>부모가 실제로 다시 찾는 순간</h2></div><p>체크리스트는 한 번 읽고 끝나는 글보다 반복 방문 가능성이 높습니다.</p></div>
      <div class="quick-grid">
        <div><strong>외출 10분 전</strong><span>기저귀, 물티슈, 여벌옷, 물병처럼 빠뜨리기 쉬운 항목을 빠르게 확인합니다.</span></div>
        <div><strong>장난감 구매 전</strong><span>유행 제품을 바로 고르기 전에 월령, 놀이 목적, 보관 공간, 안전 기준을 점검합니다.</span></div>
        <div><strong>어린이집 입소 전</strong><span>기관 안내문을 기준으로 이름표, 여벌, 낮잠 준비물, 적응 준비를 나눠 확인합니다.</span></div>
        <div><strong>놀이가 막힐 때</strong><span>오늘 컨디션에 맞춰 몸놀이, 조용한 놀이, 부모가 지친 날 가능한 놀이를 고릅니다.</span></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Quality Standard</p><h2>체크리스트 작성 기준</h2></div><p>토이포포는 단순 목록이 아니라 부모가 판단 기준을 이해하도록 설명을 함께 제공합니다.</p></div>
      <p>체크리스트 페이지는 항목만 나열하면 금방 얇아 보일 수 있습니다. 그래서 각 글에는 왜 확인해야 하는지, 사용 전 무엇을 봐야 하는지, 상황별로 어떻게 조절하는지, 체크 후 어떤 관련 글로 이어지면 좋은지를 함께 넣었습니다.</p>
      <p>특히 발달과 건강에 가까운 주제는 확정적으로 말하지 않습니다. 발달 체크는 관찰용이며, 예방접종 기록 체크리스트는 접종 일정을 확정하는 기능이 아니라 병원 방문 전 질문을 정리하는 용도입니다. 이런 안전한 표현은 부모에게도, 검색엔진과 광고 심사에도 더 신뢰감 있는 구조를 만듭니다.</p>
    </section>
"""
    s = s.replace('<section class="principles"><h2>체크리스트 운영 원칙</h2>', block + '\n    <section class="principles"><h2>체크리스트 운영 원칙</h2>', 1)
    path.write_text(s, encoding="utf-8")


def update_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"(<loc>https://toypoppo\.kr/parenting-tools/[^<]*</loc><lastmod>)[^<]+(</lastmod>)", rf"\g<1>{TODAY}\2", s)
    path.write_text(s, encoding="utf-8")


def main() -> None:
    for filename, data in DATA.items():
        enrich_page(ROOT / "parenting-tools" / filename, data)
    enrich_index()
    update_sitemap()
    print("Enriched checklist pages")


if __name__ == "__main__":
    main()
