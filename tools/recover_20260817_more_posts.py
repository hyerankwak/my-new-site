from pathlib import Path
import shutil
from html import escape

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-08-17"

IMAGE_SOURCES = {
    "16-month-toddler-stacking-container-play-1.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_eMsQoXolgKPu440KZg5xU0m7.png"),
    "16-month-toddler-stacking-container-play-2.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_ceGHvO9TM3z3pAtqFSkMR8Vv.png"),
    "second-grade-vocabulary-sentence-routine-1.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_dYUXASATe2Jb0mLDy40IVOn0.png"),
    "second-grade-vocabulary-sentence-routine-2.png": Path(r"C:\Users\곽혜란\.codex\generated_images\019fa96e-56a7-7590-bfca-293f655b8505\call_huQzboy5FhrDVe35JnKiIywU.png"),
}


def banner():
    return """<div style="max-width:100%;overflow-x:auto;margin:28px 0 10px" aria-label="쿠팡 고객추천 배너"><script src="https://ads-partners.coupang.com/g.js"></script><script>new PartnersCoupang.G({"id":1016497,"template":"carousel","trackingCode":"AF1560562","subId":"toypoppo1","width":"680","height":"140","tsource":""});</script></div><p class="affiliate-note">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>"""


POSTS = [
    {
        "slug": "16-month-toddler-stacking-container-play",
        "title": "16개월 아기 쌓기·넣고 빼기 놀이 | 손 조절과 문제 해결을 키우는 집콕 루틴",
        "headline": "16개월 아기 쌓기·넣고 빼기 놀이: 손 조절과 문제 해결을 키우는 집콕 루틴",
        "desc": "16개월 아기에게 좋은 블록 쌓기, 컵 포개기, 바구니 넣고 빼기 놀이를 발달 특징, 준비물, 부모 말, 주의사항까지 정리했습니다.",
        "eyebrow": "Toddler Development Play",
        "images": ["16-month-toddler-stacking-container-play-1.png", "16-month-toddler-stacking-container-play-2.png"],
        "body": [
            "<p>16개월 전후 아이는 손에 쥔 물건을 단순히 흔들고 두드리는 단계에서 조금씩 벗어나, 올리고 넣고 빼고 다시 시도하는 놀이에 관심을 보입니다. 블록 두 개를 올렸다가 무너뜨리고, 컵을 포개 보려다 잘 맞지 않으면 방향을 바꾸고, 바구니에 물건을 넣었다가 다시 꺼내며 같은 행동을 반복합니다. 어른 눈에는 단순 반복처럼 보여도 아이에게는 힘 조절, 공간 이해, 원인과 결과를 배우는 중요한 과정입니다.</p>",
            "<p><strong>16개월 아기 쌓기 놀이</strong>는 높게 쌓는 결과보다 시도하는 과정이 핵심입니다. 블록이 무너졌을 때 다시 손을 뻗는지, 컵이 안 들어갈 때 다른 방향으로 돌리는지, 부모에게 도움을 요청하는지 관찰하면 아이의 문제 해결 방식이 보입니다. 부모는 대신 완성해 주기보다 아이가 한 번 더 해 볼 수 있도록 물건 수와 난이도를 조절해야 합니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/16-month-toddler-stacking-container-play-1.png" alt="16개월 아기가 큰 소프트 블록을 조심스럽게 쌓고 부모가 옆에서 지켜보는 모습" width="1200" height="800"><figcaption>블록을 높게 쌓는 것보다 손을 천천히 조절해 올려 보는 경험이 먼저입니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>16개월 손 조절 발달에서 보이는 특징</h2><p>이 시기 아이는 엄지와 손가락을 함께 쓰는 힘이 조금씩 안정됩니다. 큰 물건을 양손으로 들고, 컵을 뒤집고, 블록을 놓는 위치를 조절하려 합니다. 아직 손목 회전과 힘 조절이 완전하지 않아 물건을 세게 내려놓거나 옆으로 밀어 무너뜨리기 쉽습니다. 부모가 “조심해”를 반복하기보다 “천천히 올려 볼까”, “위에 놓아 볼까”처럼 행동을 설명해 주면 아이가 움직임을 말과 연결합니다.</p>",
            "<p>또 하나 중요한 특징은 반복 욕구입니다. 같은 컵을 넣고 빼는 행동을 열 번 넘게 반복하기도 합니다. 부모는 새 놀이를 계속 제공해야 한다고 생각하지만, 반복은 아이가 크기, 방향, 깊이, 소리 변화를 비교하는 방식입니다. 지루해 보인다는 이유로 바로 다른 장난감을 꺼내면 아이의 집중이 끊길 수 있습니다.</p>",
            "<h2>준비물은 단순할수록 좋습니다</h2><p>큰 소프트 블록 3~4개, 크기가 다른 컵 3개, 천 바구니 하나, 큰 고리나 공처럼 삼킴 위험이 없는 물건이면 충분합니다. 소리가 많이 나는 전자 장난감은 아이가 버튼 반응에만 집중할 수 있어 처음에는 빼는 편이 좋습니다. 물건은 바닥에 모두 흩뿌리지 말고 낮은 쟁반이나 바구니 안에 정리해 주세요. 선택지가 적어야 아이가 하나의 행동을 오래 시도합니다.</p>",
            banner(),
            "<h2>집에서 하는 놀이 7가지</h2><h3>1. 두 개만 쌓기</h3><p>블록을 두 개만 꺼내 하나를 바닥에 두고 다른 하나를 위에 올려 봅니다. 세 개 이상은 금방 무너져 좌절할 수 있으므로 처음에는 성공 경험을 작게 만듭니다. 아이가 성공하면 “위에 올렸네”, 무너지면 “무너졌네, 다시 해 볼까”라고 말합니다.</p><h3>2. 컵 포개기</h3><p>크기가 다른 컵을 큰 것부터 작은 것 순서로 포갭니다. 아이가 순서를 몰라도 괜찮습니다. 맞지 않을 때 억지로 끼우는 대신 부모가 컵을 돌리는 동작만 천천히 보여 줍니다.</p><h3>3. 바구니 넣고 빼기</h3><p>큰 물건을 바구니에 넣고 다시 꺼냅니다. 넣었을 때 사라지고 꺼냈을 때 다시 보이는 경험은 대상 영속성과 공간 이해에 도움이 됩니다. “안에”, “밖에”라는 말을 함께 들려주세요.</p><h3>4. 같은 색 모으기</h3><p>색 이름을 외우게 하기보다 같은 색 블록을 옆에 놓아 봅니다. 아이가 다르게 놓아도 바로 고치지 말고 “파란 블록 여기 있네”처럼 부모가 기준을 말로 보여 줍니다.</p><h3>5. 굴러가는 것과 안 굴러가는 것</h3><p>공과 블록을 같이 놓고 굴려 봅니다. 공은 굴러가고 블록은 멈추는 차이를 몸으로 경험합니다. 경사진 곳은 위험할 수 있으므로 평평한 매트 위에서 합니다.</p><h3>6. 소리 비교하기</h3><p>블록을 바구니에 넣는 소리와 컵을 넣는 소리를 비교합니다. 세게 던지는 놀이로 번지지 않도록 “넣어 보자”라는 목표를 유지합니다.</p><h3>7. 마지막 정리 놀이</h3><p>놀이 끝에는 물건을 모두 바구니에 넣으며 마무리합니다. 정리는 훈육이 아니라 넣고 빼기 놀이의 마지막 단계로 다루면 아이가 거부감 없이 참여합니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/16-month-toddler-stacking-container-play-2.png" alt="16개월 아기가 큰 컵을 천 바구니에 넣고 빼며 부모와 놀이하는 모습" loading="lazy" width="1200" height="800"><figcaption>넣고 빼기는 공간 개념과 손 조절을 함께 쓰는 생활형 발달놀이입니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>부모가 조심할 점</h2><p>아이가 쌓은 것을 바로 예쁘게 고쳐 주면 아이는 자기 시도보다 완성 모양에 신경 쓰게 됩니다. 기울어져도 스스로 살펴보게 기다리세요. 작은 블록, 자석 부품, 구슬처럼 삼킴 위험이 있는 물건은 쓰지 않습니다. 형제자매가 있는 집에서는 큰아이 장난감 부품이 바닥에 섞이지 않게 놀이 전 바닥을 먼저 확인해야 합니다.</p>",
            "<h2>요약 체크리스트</h2><aside><ul><li>처음에는 블록 2개, 컵 3개 정도로 시작한다.</li><li>성공보다 다시 시도하는 행동을 본다.</li><li>안에, 밖에, 위에, 아래 같은 위치 말을 반복한다.</li><li>무너지면 실패가 아니라 원인과 결과 경험으로 다룬다.</li><li>작은 부품과 자석 장난감은 제외한다.</li><li>정리는 놀이의 마지막 단계로 연결한다.</li></ul></aside>",
        ],
        "faq": [
            ("16개월 아기가 블록을 못 쌓아도 괜찮나요?", "괜찮습니다. 두 개를 안정적으로 올리는 것도 연습이 필요합니다. 쌓기보다 잡기, 놓기, 다시 시도하기를 먼저 봅니다."),
            ("컵 포개기는 어떤 발달에 도움이 되나요?", "크기 비교, 방향 조절, 손목 회전, 공간 이해에 도움이 됩니다."),
            ("아이가 계속 무너뜨리기만 하면 어떻게 하나요?", "무너뜨리기도 원인과 결과를 배우는 과정입니다. 다만 던지기로 바뀌면 부드러운 블록만 사용하고 거리를 좁혀 주세요."),
            ("몇 분 정도 놀면 좋나요?", "10분 전후면 충분합니다. 아이가 더 집중하면 이어가고 산만해지면 정리 놀이로 마무리합니다."),
            ("장난감을 많이 꺼내야 하나요?", "아니요. 선택지가 많으면 집중이 흐려질 수 있어 3~5개 물건으로 시작하는 편이 좋습니다."),
        ],
        "related": [
            ("/blog/15-month-toddler-language-play-routine.html", "15개월 아기 말놀이", "생활 장면에 말을 붙이는 언어 자극입니다."),
            ("/blog/18-month-toddler-language-development-play.html", "18개월 아기 언어발달 놀이", "한 단어와 몸짓을 연결합니다."),
            ("/blog/20-month-toddler-fine-motor-play.html", "20개월 아기 소근육 놀이", "손 조절을 키우는 놀이입니다."),
            ("/development-play/", "발달놀이", "개월별 발달놀이를 모았습니다."),
            ("/parent-guide/", "부모가이드", "생활 속 육아 루틴입니다."),
        ],
        "closing": "16개월 쌓기와 넣고 빼기 놀이는 장난감이 많아야 가능한 활동이 아닙니다. 적은 물건으로 반복할 시간을 주고, 부모가 행동에 짧은 말을 붙여 주면 손 조절과 문제 해결이 자연스럽게 자랍니다.",
    },
    {
        "slug": "second-grade-vocabulary-sentence-routine",
        "title": "초등 2학년 어휘력 키우는 법 | 낱말 카드와 한 문장 말하기 루틴",
        "headline": "초등 2학년 어휘력 키우는 법: 낱말 카드와 한 문장 말하기 루틴",
        "desc": "초등 2학년 아이가 책은 읽지만 뜻을 설명하기 어려워할 때 집에서 할 수 있는 낱말 분류, 문장 확장, 다시 말하기 루틴입니다.",
        "eyebrow": "Elementary Literacy",
        "images": ["second-grade-vocabulary-sentence-routine-1.png", "second-grade-vocabulary-sentence-routine-2.png"],
        "body": [
            "<p>초등 2학년이 되면 글자는 어느 정도 읽지만 낱말의 뜻을 정확히 설명하지 못해 독해에서 막히는 경우가 많습니다. 문제를 틀린 이유가 집중력 부족처럼 보이지만 실제로는 ‘비슷한 말’, ‘반대말’, ‘상황에 따라 달라지는 뜻’을 충분히 다뤄 보지 못한 경우가 있습니다. 어휘력은 낱말장을 많이 외운다고 바로 좋아지지 않습니다. 아이가 낱말을 자기 경험과 연결하고, 문장 안에서 써 보고, 비슷한 말끼리 묶어 보는 과정이 필요합니다.</p>",
            "<p><strong>초등 2학년 어휘력</strong>은 국어뿐 아니라 수학 문장제, 사회·과학 설명문을 읽는 힘과도 연결됩니다. ‘비교하시오’, ‘까닭을 쓰시오’, ‘알맞은 것’ 같은 표현을 정확히 이해해야 문제의 요구를 파악할 수 있습니다. 집에서는 하루 15분 정도 낱말 카드, 그림 설명, 한 문장 쓰기를 연결하면 부담 없이 어휘를 넓힐 수 있습니다.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/second-grade-vocabulary-sentence-routine-1.png" alt="초등 2학년 아이가 빈 낱말 카드를 분류하고 부모가 옆에서 지켜보는 모습" width="1200" height="800"><figcaption>낱말은 외우기보다 비슷한 뜻, 쓰임, 상황별로 나누어 볼 때 오래 남습니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>초등 2학년 어휘에서 자주 막히는 지점</h2><p>첫째, 일상에서는 아는 말 같지만 글 속에서는 다르게 쓰이는 낱말이 어렵습니다. ‘밝다’는 불빛이 밝다는 뜻도 있고 표정이나 분위기가 밝다는 뜻도 있습니다. 둘째, 설명문에서 쓰는 추상어가 늘어납니다. 원인, 결과, 변화, 특징 같은 말은 여러 글에서 반복되지만 아이가 자기 말로 설명하기 어렵습니다. 셋째, 문제 지시어를 놓칩니다. 고르시오, 쓰시오, 비교하시오를 모두 비슷하게 받아들이면 답을 아는데도 형식이 어긋날 수 있습니다.</p>",
            "<h2>하루 15분 어휘 루틴</h2><h3>1단계: 오늘의 낱말 3개 고르기</h3><p>책이나 교과서에서 아이가 멈춘 낱말 3개만 고릅니다. 모르는 낱말을 모두 적으면 부담이 커집니다. 부모가 어려워 보이는 단어를 고르는 것보다 아이가 읽다가 멈춘 말, 대충 넘어간 말, 설명을 못 한 말을 우선합니다.</p><h3>2단계: 그림이나 경험에 붙이기</h3><p>낱말 뜻을 사전처럼 설명하기 전에 생활 장면을 떠올립니다. ‘관찰’이라면 과학 시간만 떠올리지 말고 “식물이 어제보다 자랐는지 보는 것”, “동생 표정이 바뀌었는지 보는 것”처럼 경험과 연결합니다.</p>",
            banner(),
            "<h3>3단계: 비슷한 말과 다른 말 찾기</h3><p>낱말 카드 세 장을 놓고 비슷한 느낌끼리 묶어 봅니다. 정확한 유의어를 찾는 것이 목표가 아닙니다. 아이가 왜 그렇게 묶었는지 말하게 하는 것이 중요합니다. 부모는 “그렇게 생각한 이유가 있구나”라고 듣고, 필요한 경우에만 더 정확한 표현을 알려 줍니다.</p><h3>4단계: 한 문장으로 쓰기</h3><p>낱말 하나를 골라 짧은 문장을 씁니다. “나는 오늘 식물을 관찰했다”처럼 단순해도 괜찮습니다. 이후 “어떤 식물?”, “무엇이 달라졌어?”를 붙이면 문장이 확장됩니다. 처음부터 긴 글을 요구하지 마세요.</p>",
            '<figure class="article-figure"><img src="/assets/images/blog/second-grade-vocabulary-sentence-routine-2.png" alt="초등 아이가 그림을 보고 설명하고 부모가 빈 카드에 문장을 정리하는 모습" loading="lazy" width="1200" height="800"><figcaption>아이 말에서 시작해 부모가 문장으로 정리해 주면 쓰기 부담이 줄어듭니다. 토이포포 생성형 이미지입니다.</figcaption></figure>',
            "<h2>부모가 바로 써먹는 질문</h2><p>“뜻이 뭐야?”만 묻지 말고 질문을 나누세요. “이 말을 들으면 어떤 장면이 떠올라?”, “비슷한 말을 하나 고르면 뭐가 있을까?”, “반대로 생각하면 어떤 말일까?”, “이 말을 학교에서 언제 쓸 수 있을까?”처럼 묻습니다. 아이가 답을 못 하면 부모가 예시를 하나 주고 다시 선택하게 합니다. 질문은 시험이 아니라 생각을 꺼내는 도구여야 합니다.</p>",
            "<h2>어휘력이 독해로 이어지게 하는 방법</h2><p>낱말만 따로 외우면 글 속에서 쓰지 못할 수 있습니다. 오늘 배운 낱말을 읽은 글에 다시 표시하고, 그 낱말이 문장 전체에서 어떤 역할을 하는지 봅니다. 예를 들어 ‘원인’이라는 말을 배웠다면 글에서 어떤 일이 왜 일어났는지 찾아봅니다. 이렇게 낱말이 문장, 문단, 전체 내용으로 연결될 때 문해력이 자랍니다.</p>",
            "<h2>부모 체크리스트</h2><aside><ul><li>하루 낱말은 3개 이하로 제한한다.</li><li>사전 뜻보다 생활 장면을 먼저 떠올린다.</li><li>비슷한 말, 반대말, 쓰임을 함께 본다.</li><li>긴 글보다 한 문장 쓰기로 마무리한다.</li><li>아이가 설명한 이유를 먼저 듣는다.</li><li>문제 지시어도 어휘로 다룬다.</li><li>읽기와 쓰기를 분리하지 말고 연결한다.</li></ul></aside>",
        ],
        "faq": [
            ("초등 2학년 어휘 공부는 매일 해야 하나요?", "매일 길게 할 필요는 없습니다. 하루 10~15분, 낱말 3개 정도를 꾸준히 다루는 편이 좋습니다."),
            ("사전 찾기를 시켜도 되나요?", "가능하지만 먼저 아이가 장면으로 뜻을 예상하게 한 뒤 사전으로 확인하는 순서가 좋습니다."),
            ("낱말장을 만들어야 하나요?", "낱말장보다 낱말 카드와 한 문장 예시가 더 실용적입니다. 쓰임이 없는 낱말 목록은 금방 잊기 쉽습니다."),
            ("맞춤법도 같이 고쳐야 하나요?", "어휘 활동의 목표가 뜻 이해라면 맞춤법 지적은 최소화하세요. 문장 의미가 먼저입니다."),
            ("어휘력이 부족하면 독해 문제집을 늘려야 하나요?", "문제집 양보다 읽은 글에서 낱말을 다시 말하고 문장으로 써 보는 활동이 먼저 필요합니다."),
        ],
        "related": [
            ("/blog/first-grade-read-aloud-retelling-routine.html", "초등 1학년 소리 내어 읽기", "읽고 말하고 한 문장 쓰는 루틴입니다."),
            ("/blog/elementary-literacy-home-study.html", "초등 문해력 집공부", "읽기 전·중·후 활동을 정리했습니다."),
            ("/blog/second-grade-read-aloud-fluency-routine.html", "초등 2학년 소리 내어 읽기", "정확성과 끊어 읽기를 다룹니다."),
            ("/blog/first-grade-main-idea-literacy-routine.html", "중심 문장 찾기", "짧은 글의 핵심을 찾는 연습입니다."),
            ("/worksheets/", "엄마표 자료실", "학습자료와 활동지를 모았습니다."),
        ],
        "closing": "초등 2학년 어휘력은 낱말을 많이 외우는 방식보다 아이가 직접 설명하고, 묶고, 문장에 넣어 보는 과정에서 자랍니다. 하루 15분의 작은 루틴이 독해와 글쓰기의 바탕을 단단하게 만듭니다.",
    },
]


def article(post):
    imgs = [f"https://toypoppo.kr/assets/images/blog/{x}" for x in post["images"]]
    faq_json = ",".join('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}' % (escape(q), escape(a)) for q, a in post["faq"])
    related = "".join(f'<a href="{href}"><strong>{escape(title)}</strong><span>{escape(desc)}</span></a>' for href, title, desc in post["related"])
    body = "\n      ".join(post["body"])
    faq_html = "".join(f"<h3>{escape(q)}</h3><p>{escape(a)}</p>" for q, a in post["faq"])
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(post["title"])} | 토이포포</title>
  <meta name="description" content="{escape(post["desc"])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://toypoppo.kr/blog/{post["slug"]}.html">
  <meta property="og:title" content="{escape(post["headline"])}">
  <meta property="og:description" content="{escape(post["desc"])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://toypoppo.kr/blog/{post["slug"]}.html">
  <meta property="og:image" content="{imgs[0]}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/assets/styles.css?v=20260815-article-layout1">
  <script type="application/ld+json">{{"@context":"https://schema.org","@graph":[{{"@type":"Article","headline":"{escape(post["headline"])}","description":"{escape(post["desc"])}","image":["{imgs[0]}","{imgs[1]}"],"author":{{"@type":"Organization","name":"토이포포"}},"publisher":{{"@type":"Organization","name":"토이포포","url":"https://toypoppo.kr"}},"mainEntityOfPage":"https://toypoppo.kr/blog/{post["slug"]}.html","datePublished":"{TODAY}","dateModified":"{TODAY}","inLanguage":"ko-KR"}},{{"@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"홈","item":"https://toypoppo.kr/"}},{{"@type":"ListItem","position":2,"name":"블로그","item":"https://toypoppo.kr/blog/"}},{{"@type":"ListItem","position":3,"name":"{escape(post["headline"])}","item":"https://toypoppo.kr/blog/{post["slug"]}.html"}}]}},{{"@type":"FAQPage","mainEntity":[{faq_json}]}}]}}</script>
</head>
<body>
  <header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>부모를 위한 육아·놀이·교육 정보</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/pad-learning/">패드학습</a><a href="/blog/">블로그</a></nav></header>
  <main><article class="article">
      <p class="eyebrow">{escape(post["eyebrow"])}</p>
      <h1>{escape(post["headline"])}</h1>
      {body}
      <h2>자주 묻는 질문</h2>{faq_html}
      {banner()}
      <h2>함께 보면 좋은 글</h2><div class="link-grid">{related}</div>
      <h2>마무리</h2><p>{escape(post["closing"])}</p>
    </article></main>
  <footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 체크리스트를 함께 다루는 부모 정보 플랫폼입니다.</p></div><nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer>
</body>
</html>
"""


def main():
    img_dir = ROOT / "assets" / "images" / "blog"
    img_dir.mkdir(parents=True, exist_ok=True)
    for name, src in IMAGE_SOURCES.items():
        if not src.exists():
            raise FileNotFoundError(src)
        shutil.copy2(src, img_dir / name)
    for post in POSTS:
        (ROOT / "blog" / f"{post['slug']}.html").write_text(article(post), encoding="utf-8", newline="\n")
    blog_index = ROOT / "blog" / "index.html"
    text = blog_index.read_text(encoding="utf-8")
    cards = "".join(f'<a href="/blog/{p["slug"]}.html"><strong>{escape(p["headline"])}</strong><span>{escape(p["desc"])}</span></a>' for p in POSTS)
    if POSTS[0]["slug"] not in text:
        text = text.replace("  <main>\n", f'  <main>\n    <section class="section"><div class="link-grid">{cards}</div></section>\n', 1)
    blog_index.write_text(text, encoding="utf-8", newline="\n")
    sitemap = ROOT / "sitemap.xml"
    s = sitemap.read_text(encoding="utf-8")
    entries = ""
    for p in POSTS:
        loc = f"https://toypoppo.kr/blog/{p['slug']}.html"
        if loc not in s:
            entries += f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n"
    if entries:
        s = s.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries, 1)
    sitemap.write_text(s, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
