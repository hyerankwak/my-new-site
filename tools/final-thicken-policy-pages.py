from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

COMMON = """<section><h2>토이포포의 공통 운영 기준</h2><p>토이포포의 모든 안내 페이지는 방문자가 사이트의 성격을 이해하고 안심하고 이용할 수 있도록 마련했습니다. 육아 정보 사이트는 글의 양뿐 아니라 운영 목적, 문의 가능 여부, 개인정보 처리, 제휴 고지, 자료 이용 범위가 분명해야 신뢰를 얻을 수 있습니다.</p><p>토이포포는 부모가 아이와 보내는 일상에 실제로 도움이 되는 정보를 우선합니다. 자료나 추천 글을 이용할 때는 아이의 기질과 발달 속도, 가정의 생활 리듬을 함께 고려해 주세요. 사이트의 정보는 부모의 판단을 돕는 참고 자료이며, 건강이나 발달 문제에 대한 전문 상담을 대신하지 않습니다.</p></section>"""

CONTACT_EXTRA = """<section><h2>문의 전 확인하면 좋은 곳</h2><p>장난감 추천이 궁금하다면 월령별 장난감 글을, 집에서 놀아주는 방법이 궁금하다면 발달놀이와 몬테소리 카테고리를 먼저 확인해 주세요. 자료 오류나 PDF 관련 문제는 엄마표 자료실의 해당 페이지 주소를 함께 보내주시면 확인이 빠릅니다.</p><p>지역 정보의 경우 시설 운영시간, 휴관일, 예약 여부는 수시로 바뀔 수 있습니다. 토이포포에 제보해 주시면 확인 후 보완하되, 방문 직전에는 공식 홈페이지나 지도 서비스를 함께 확인하는 것이 가장 안전합니다.</p></section>"""

targets = [
    "author.html",
    "editorial-policy.html",
    "update-policy.html",
    "affiliate-disclosure.html",
    "privacy.html",
    "terms.html",
    "content-plan.html",
    "local-info/data-sources.html",
]

for rel in targets:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    if COMMON not in text:
        text = text.replace("</article></main>", COMMON + "</article></main>")
    path.write_text(text, encoding="utf-8")

contact = ROOT / "contact.html"
text = contact.read_text(encoding="utf-8")
if CONTACT_EXTRA not in text:
    text = text.replace("</article></main>", CONTACT_EXTRA + COMMON + "</article></main>")
contact.write_text(text, encoding="utf-8")

