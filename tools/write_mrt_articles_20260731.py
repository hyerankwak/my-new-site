from __future__ import annotations

import html
import json
import re
from pathlib import Path


SITE = "https://toypoppo.kr"
TODAY = "2026-07-31"


ARTICLES = [
    {
        "slug": "jeju-arte-kids-park-family-guide",
        "eyebrow": "JEJU ARTE KIDS PARK",
        "title": "제주 아르떼 키즈파크 아이와 가기 전 체크: 실내 미디어 놀이터 입장권·추천 연령",
        "short_title": "제주 아르떼 키즈파크 아이와 가기 전 체크",
        "description": "제주 아르떼 키즈파크를 아이와 방문하기 전 확인할 추천 연령, 3시간권 이용 팁, 실내 동선, 준비물, 예매 가격과 후기, 집에서 이어갈 미디어 놀이를 정리했습니다.",
        "breadcrumb": "제주 애월 · 실내 키즈파크",
        "product": "제주 아르떼 키즈파크 입장권",
        "affiliate": "https://myrealt.rip/gCdZ40",
        "ticket_img": "/assets/images/places/jeju-arte-kids-park-ticket.jpg",
        "gen_img": "/assets/images/places/jeju-arte-kids-park-generated.png",
        "rating": "4.7",
        "reviews": "30",
        "price": "8,000원~",
        "meta": "제주 · 실내 체험 · 키즈파크",
        "status": "최저가보장제",
        "place": "제주 제주시 애월읍 월각로 929",
        "intro": [
            "제주 여행에서 아이와 함께 갈 실내 장소를 찾을 때 가장 먼저 고민되는 것은 날씨입니다. 비가 오거나 바람이 강한 날, 혹은 한낮 햇볕이 뜨거운 날에는 야외 관광지를 오래 걷기 어렵습니다. 제주 아르떼 키즈파크는 이런 날씨 변수에서 비교적 자유롭고, 아이가 몸을 움직이면서 빛과 색, 소리, 공간을 함께 경험할 수 있는 실내형 체험 장소로 보기 좋습니다.",
            "다만 실내 키즈파크라고 해서 무조건 오래 머물수록 좋은 것은 아닙니다. 아이가 빛과 소리 자극에 민감한 편인지, 낯선 공간에서 적응 시간이 필요한지, 보호자가 중간 휴식을 어떻게 잡을지에 따라 만족도가 달라집니다. 이 글은 제주 아르떼 키즈파크 입장권을 예매하기 전 부모가 확인하면 좋은 기준과 아이와 방문했을 때 활용할 대화, 집에 와서 이어갈 놀이까지 정리한 가이드입니다.",
        ],
        "sections": [
            ("이런 가족에게 잘 맞아요", "제주 여행 중 비 오는 날 실내 일정을 찾는 가족, 미술관처럼 조용하기만 한 공간보다 아이가 직접 움직이며 놀 수 있는 장소를 원하는 가족에게 잘 맞습니다. 영유아보다는 걷고 뛰는 활동이 안정된 유아 후반부터 초등 저학년까지 활용도가 높습니다. 아이가 빛, 색, 바다 생물, 영상, 움직이는 화면에 관심이 많다면 반응이 좋을 가능성이 큽니다."),
            ("방문 전 체크할 기준", "3시간권처럼 이용 시간이 정해져 있다면 입장 직후부터 무리하게 모든 구역을 돌기보다 아이가 오래 머무는 구역을 중심으로 봐야 합니다. 실내 공간은 보호자 입장에서 편하지만, 아이에게는 소리와 빛 자극이 한 번에 들어오는 장소이기도 합니다. 중간에 물을 마시고 쉬는 시간을 넣고, 아이가 특정 구역을 무서워하면 억지로 오래 머물게 하지 않는 편이 좋습니다."),
            ("아이에게 먼저 설명하면 좋은 말", "가기 전에는 ‘빛이랑 색이 움직이는 놀이터에 가 볼 거야’라고 말해 주세요. 아이가 화면을 만져도 되는 곳과 눈으로만 봐야 하는 곳을 구분해야 하므로, 입장 전 ‘손으로 만져도 되는 곳은 엄마 아빠가 알려줄게’라고 짧게 약속하는 것이 좋습니다. 체험 공간에서 뛰고 싶어 하는 아이에게는 ‘사람이 많은 곳에서는 천천히, 넓은 곳에서는 안전하게’라는 기준을 미리 알려주면 현장에서 덜 부딪힙니다."),
        ],
        "questions": [
            "빛이 움직이면 진짜 물고기가 움직이는 것처럼 보이는 이유는 뭘까?",
            "네가 본 색 중 가장 오래 기억날 색은 무엇이었니?",
            "소리가 크면 몸은 어떤 느낌이 들까?",
            "어두운 공간이 무서웠다면 무엇이 있으면 덜 무서울까?",
            "네가 미디어 놀이터를 만든다면 어떤 동물이 나오게 하고 싶니?",
            "그림이 벽에만 있지 않고 바닥까지 이어지면 어떤 기분이 들까?",
            "빛과 그림자는 서로 어떤 관계일까?",
            "오늘 본 장면을 친구에게 설명한다면 어떤 말부터 할래?",
            "집에서도 빛 놀이를 한다면 손전등으로 무엇을 만들어 볼 수 있을까?",
            "가장 오래 머물고 싶었던 공간은 어디였고 이유는 뭐였니?",
        ],
        "missions": ["가장 마음에 드는 색 찾기", "천천히 걸어야 하는 구역 찾기", "바다처럼 보이는 장면 찾기", "빛이 몸에 닿는 느낌 말하기", "사진 찍고 싶은 공간 하나 고르기", "집에서 다시 해보고 싶은 놀이 정하기"],
        "home": "집에 돌아와서는 손전등과 얇은 색종이, 투명 파일을 활용해 작은 빛 놀이를 해보세요. 벽에 빛을 비추고 색종이를 겹쳐 보며 색이 섞이는 모습을 관찰하면 미디어 체험이 단순한 ‘예쁜 화면 보기’에서 색과 빛을 탐색하는 놀이로 이어집니다.",
        "faq": [
            ("제주 아르떼 키즈파크는 몇 살부터 좋나요?", "걷고 뛰는 활동이 안정된 유아 후반부터 초등 저학년까지 추천하기 좋습니다. 빛과 소리 자극에 예민한 아이는 짧게 둘러보는 방식이 더 편할 수 있습니다."),
            ("비 오는 날 일정으로 괜찮나요?", "실내 체험이라 비 오는 날 대안으로 좋습니다. 다만 성수기나 우천 시에는 방문객이 몰릴 수 있으니 입장 시간과 주차, 대기 여부를 예매 페이지에서 확인하세요."),
            ("예매 가격과 후기는 어디 기준인가요?", "마이리얼트립 예매처 표시 기준으로 작성했습니다. 가격, 평점, 후기 수는 변동될 수 있어 결제 전 현재 예매 페이지에서 다시 확인하는 것이 좋습니다."),
            ("아이와 3시간을 모두 채워야 하나요?", "꼭 그럴 필요는 없습니다. 아이가 지치기 전 나오는 일정이 오히려 좋은 기억으로 남습니다. 중간 휴식과 간식 시간을 고려해 움직이세요."),
            ("집에서 이어갈 수 있는 놀이는 무엇인가요?", "손전등 그림자 놀이, 색종이 빛 놀이, 바다 생물 그림 그리기, 오늘 본 색을 이름 붙여 보는 활동이 좋습니다."),
        ],
    },
    {
        "slug": "jeju-forest-play-exploration-kids",
        "eyebrow": "JEJU FOREST PLAY",
        "title": "제주 숲놀이 체험 아이와 가기 전 체크: 절물자연휴양림 숲 탐험대 준비물",
        "short_title": "제주 숲놀이 체험 아이와 가기 전 체크",
        "description": "제주 숲에서 숲놀이를 하는 키즈 체험을 아이와 예약하기 전 확인할 추천 연령, 절물자연휴양림 준비물, 자연 관찰 질문, 숲 미션과 집에서 이어갈 놀이를 정리했습니다.",
        "breadcrumb": "제주 · 숲놀이 체험",
        "product": "제주 숲에서 숲 놀이, 우리는 제주의 아자! 탐험대",
        "affiliate": "https://myrealt.rip/gCdb3f",
        "ticket_img": "/assets/images/places/jeju-forest-exploration-kids-ticket.jpg",
        "gen_img": "/assets/images/places/jeju-forest-exploration-kids-generated.png",
        "rating": "4.9",
        "reviews": "51",
        "price": "35,000원~",
        "meta": "제주 · 자연 체험 · 숲놀이",
        "status": "무료취소",
        "place": "절물자연휴양림",
        "intro": [
            "제주 여행에서 아이가 가장 오래 기억하는 순간은 꼭 유명 관광지 앞에서 찍은 사진만은 아닙니다. 낙엽을 줍고, 나무껍질을 만지고, 작은 벌레가 움직이는 것을 오래 바라본 시간이 더 오래 남을 때가 많습니다. 제주 숲놀이 체험은 그런 자연 관찰의 시간을 부모가 혼자 이끌기 어렵다고 느낄 때 좋은 선택지가 될 수 있습니다.",
            "숲 체험은 아이에게 ‘뛰어노는 시간’이기도 하지만 동시에 관찰력, 기다림, 감각 표현, 생명 존중을 배울 수 있는 시간입니다. 다만 숲길은 날씨와 복장 영향을 크게 받기 때문에 예약 전 준비물을 잘 챙겨야 합니다. 이 글은 절물자연휴양림을 배경으로 진행되는 제주 숲놀이 체험을 아이와 가기 전 확인하면 좋은 점을 부모 관점으로 정리했습니다.",
        ],
        "sections": [
            ("이런 아이에게 추천해요", "흙, 나뭇잎, 돌멩이, 벌레처럼 자연물을 관찰하는 것을 좋아하는 아이에게 잘 맞습니다. 실내 놀이보다 바깥에서 걷고 움직이는 것을 좋아하는 아이, 질문을 많이 하는 초등 저학년 아이, 제주 여행 중 자연을 깊게 경험하게 해주고 싶은 가족에게 특히 좋습니다."),
            ("방문 전 체크할 기준", "숲 체험은 날씨, 신발, 벌레, 화장실 동선이 중요합니다. 샌들이나 미끄러운 신발보다는 발을 잘 잡아주는 운동화가 좋고, 얇은 긴팔이나 모기 기피용품도 도움이 됩니다. 아이가 걷는 시간이 길어지면 지칠 수 있으므로 전후 일정은 여유롭게 잡으세요. 입장료 별도 여부와 집합 장소도 예매 페이지에서 다시 확인해야 합니다."),
            ("아이에게 먼저 설명하면 좋은 말", "‘오늘은 숲에서 정답을 찾는 게 아니라 자세히 보는 연습을 할 거야’라고 말해 주세요. 숲에서는 큰 소리로 뛰기보다 작은 소리를 듣고, 나무와 벌레를 함부로 꺾거나 만지지 않는 약속이 필요합니다. 아이가 무언가를 발견했을 때 부모가 바로 이름을 알려주기보다 ‘어디가 신기해?’라고 먼저 물어보면 관찰력이 더 살아납니다."),
        ],
        "questions": [
            "나뭇잎마다 모양이 다른 이유는 무엇일까?",
            "숲에서 가장 먼저 들린 소리는 무엇이었니?",
            "벌레는 왜 숲에서 살기 좋을까?",
            "마른 나뭇잎과 젖은 나뭇잎은 손으로 만졌을 때 어떻게 다를까?",
            "나무껍질은 왜 울퉁불퉁할까?",
            "우리가 숲에 왔을 때 조심해야 하는 행동은 무엇일까?",
            "숲속에서 동물들이 숨어 있다면 어디에 숨어 있을까?",
            "오늘 주운 자연물 중 집에 가져가지 않고 두고 와야 하는 것은 무엇일까?",
            "네가 숲 안내자가 된다면 가족에게 무엇을 보여주고 싶니?",
            "숲이 사람에게 주는 좋은 점은 무엇일까?",
        ],
        "missions": ["서로 다른 잎 모양 세 가지 찾기", "가장 조용한 장소에서 10초 듣기", "나무껍질 무늬 관찰하기", "흙 냄새 맡고 느낌 말하기", "숲에서 발견한 색 5개 말하기", "집에 돌아와 그리고 싶은 자연물 하나 고르기"],
        "home": "집에 와서는 ‘오늘의 숲 지도’를 그려보세요. 입구, 큰 나무, 쉬었던 곳, 가장 기억나는 자연물을 표시하면 공간 기억과 이야기하기가 함께 자랍니다. 자연물을 실제로 가져오지 않아도 사진을 보고 그림으로 기록하면 충분합니다.",
        "faq": [
            ("제주 숲놀이 체험은 몇 살부터 좋나요?", "걷는 시간이 가능하고 설명을 어느 정도 들을 수 있는 유아 후반부터 초등 저학년까지 좋습니다. 아이의 체력과 날씨를 함께 고려하세요."),
            ("비가 오면 어떻게 하나요?", "숲 체험은 날씨 영향을 받습니다. 비 예보가 있으면 진행 여부와 취소 규정을 예매처에서 반드시 확인하세요."),
            ("준비물은 무엇이 좋나요?", "운동화, 물, 얇은 긴팔, 모자, 벌레 기피용품, 물티슈, 작은 간식이 실용적입니다. 자연물을 담을 봉투는 현장 규칙에 따라 사용하세요."),
            ("숲 체험이 발달에 어떤 도움이 되나요?", "감각 관찰, 어휘 표현, 기다림, 생명 존중, 대근육 활동에 도움이 됩니다. 특히 정답을 듣는 활동보다 직접 보고 말하는 경험이 중요합니다."),
            ("예매 정보는 어디 기준인가요?", "마이리얼트립 예매처 표시 기준입니다. 평점과 후기 수, 가격은 변동될 수 있어 예약 전 현재 페이지를 다시 확인하세요."),
        ],
    },
    {
        "slug": "busan-museum-history-docent-kids",
        "eyebrow": "BUSAN MUSEUM DOCENT",
        "title": "부산박물관 어린이 도슨트 체험 가기 전 체크: 부산 역사 이야기 초등 추천",
        "short_title": "부산박물관 어린이 도슨트 체험 가기 전 체크",
        "description": "부산박물관 어린이 역사 도슨트 체험을 예약하기 전 확인할 추천 연령, 수업 시간, 교재 포함 여부, 아이와 나눌 질문, 전시 미션과 집에서 이어갈 역사 놀이를 정리했습니다.",
        "breadcrumb": "부산 남구 · 박물관 도슨트",
        "product": "부산박물관, 부산을 중심으로 펼쳐지는 역사이야기",
        "affiliate": "https://myrealt.rip/gCddfb",
        "ticket_img": "/assets/images/places/busan-museum-history-kids-ticket.jpg",
        "gen_img": "/assets/images/places/busan-museum-history-kids-generated.png",
        "rating": "5.0",
        "reviews": "1",
        "price": "45,000원~",
        "meta": "부산 · 역사 도슨트 · 초등 추천",
        "status": "예약 가능",
        "place": "국립부산박물관",
        "intro": [
            "부산박물관은 부산의 역사와 생활문화를 아이에게 보여주기 좋은 장소입니다. 하지만 박물관을 그냥 둘러보면 아이는 ‘오래된 물건이 많은 곳’ 정도로만 기억하기 쉽습니다. 어린이 도슨트 체험은 전시물을 하나의 이야기로 연결해 주기 때문에 초등 아이가 지역 역사와 유물을 조금 더 쉽게 이해하는 데 도움이 됩니다.",
            "도슨트 체험을 고를 때는 유명한 장소인지보다 아이가 설명을 듣고 질문할 수 있는 나이인지, 부모가 관람 전후로 어떤 대화를 이어갈 수 있는지가 중요합니다. 이 글은 부산박물관 어린이 역사 도슨트 체험을 예약하기 전 확인할 정보와 아이의 생각하는 힘을 키우는 질문, 집에 돌아와 이어갈 활동까지 정리했습니다.",
        ],
        "sections": [
            ("이런 아이에게 추천해요", "초등 저학년 이상, 특히 사회·역사 단원이 어렵게 느껴지는 아이에게 좋습니다. 유물을 그냥 외우는 방식보다 ‘누가 사용했을까, 왜 만들었을까, 지금과 무엇이 다를까’를 이야기로 풀어 가면 훨씬 오래 기억합니다. 부산 여행 중 교육적인 일정을 하나 넣고 싶은 가족에게도 잘 맞습니다."),
            ("방문 전 체크할 기준", "수업 시간, 집합 장소, 보호자 동반 여부, 교재 포함 여부를 먼저 확인하세요. 예매처 상세 기준으로 교재가 포함되어 있고 개인 경비는 별도입니다. 주말 오전·오후 시간대가 있을 수 있으므로 아이 컨디션이 좋은 시간으로 고르는 것이 좋습니다. 박물관 전시는 조용히 관람해야 하므로 너무 피곤한 일정 뒤에 넣는 것은 피하는 편이 좋습니다."),
            ("아이에게 먼저 설명하면 좋은 말", "가기 전에는 ‘부산이 옛날에는 어떤 모습이었는지 보러 가자’라고 말해 주세요. 역사라는 단어가 부담스럽다면 ‘옛날 사람들이 쓰던 물건을 보고 지금 우리 생활과 비교해 보는 시간’이라고 설명하면 아이가 덜 어렵게 받아들입니다. 정답을 맞히는 체험이 아니라 생각하고 말해 보는 체험이라고 알려주는 것이 좋습니다."),
        ],
        "questions": [
            "이 물건은 누가 가장 많이 사용했을까?",
            "왜 이런 모양으로 만들었을까?",
            "지금 우리 집 물건과 비슷한 점은 무엇일까?",
            "이 물건이 없었다면 옛날 사람들은 어떻게 했을까?",
            "부산이라는 지역은 바다와 어떤 관계가 있을까?",
            "전시물 중 가장 오래 기억하고 싶은 것은 무엇이니?",
            "유물을 만든 사람은 어떤 마음이었을까?",
            "옛날과 지금의 생활 중 더 편해진 것은 무엇일까?",
            "반대로 옛날 방식이 더 좋아 보이는 점도 있을까?",
            "오늘 본 것 중 친구에게 설명해 주고 싶은 것은 무엇이니?",
        ],
        "missions": ["생활도구처럼 보이는 유물 찾기", "바다와 관련 있어 보이는 전시물 찾기", "가장 오래된 물건처럼 보이는 것 고르기", "지금도 쓰는 물건과 닮은 점 찾기", "마음에 드는 유물 하나 그리기", "전시실에서 새로 배운 단어 3개 적기"],
        "home": "집에 돌아와서는 ‘우리 집 박물관’을 만들어 보세요. 숟가락, 오래된 사진, 가족이 아끼는 물건을 하나씩 놓고 아이가 전시 설명문을 써 보는 활동입니다. 유물이란 먼 옛날의 물건만이 아니라 누군가의 생활과 기억이 담긴 물건이라는 관점을 자연스럽게 배울 수 있습니다.",
        "faq": [
            ("부산박물관 도슨트 체험은 몇 학년부터 좋나요?", "초등 저학년 이상에게 추천하기 좋습니다. 다만 설명을 듣는 시간이 있으므로 아이가 조용한 관람 환경을 어느 정도 받아들일 수 있는지 확인하세요."),
            ("부모도 함께 들어가야 하나요?", "상품별 운영 방식이 다를 수 있습니다. 보호자 동반 여부와 집합 방식은 예약 전 예매처 상세 안내를 확인하세요."),
            ("예매 가격과 후기는 어디 기준인가요?", "마이리얼트립 예매처 표시 기준입니다. 평점 5.0, 후기 1개로 확인되었지만 수치는 변동될 수 있습니다."),
            ("박물관을 지루해하는 아이도 괜찮을까요?", "아이에게 전시물을 많이 보게 하기보다 질문 한두 개를 정해 주면 부담이 줄어듭니다. ‘가장 이상한 물건 찾기’처럼 미션형으로 접근해 보세요."),
            ("집에서 이어갈 활동은 무엇이 좋나요?", "전시물 그리기, 가족 물건 설명문 쓰기, 부산 지도에서 바다와 항구 찾기, 오늘 배운 단어로 짧은 이야기 만들기가 좋습니다."),
        ],
    },
]


RELATED = [
    ("/local-info/", "아이와 가볼만한 곳 전체 가이드", "박물관, 과학관, 체험시설을 부모 관점으로 비교해 보세요."),
    ("/development-play/", "발달놀이", "방문 경험을 집에서 놀이로 이어가는 방법을 확인하세요."),
    ("/parent-guide/rainy-day-home-play.html", "비 오는 날 집콕 놀이", "실내 일정이 필요한 날 함께 보기 좋습니다."),
    ("/worksheets/", "엄마표 자료실", "관람 후 기록지와 활동지를 함께 활용해 보세요."),
    ("/#toy-recommendations", "연령별 장난감 추천", "아이 관심사를 집 놀이와 교구로 이어가 보세요."),
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def p(text: str) -> str:
    return f"<p>{esc(text)}</p>"


def json_script(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def article_html(article: dict) -> str:
    url = f"{SITE}/local-info/places/{article['slug']}.html"
    title = f"{article['title']} | 토이포포"
    breadcrumb = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "홈", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "아이와 가볼만한 곳", "item": SITE + "/local-info/"},
            {"@type": "ListItem", "position": 3, "name": article["short_title"], "item": url},
        ],
    }
    faq = {
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in article["faq"]
        ],
    }
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            breadcrumb,
            {
                "@type": "Article",
                "headline": article["title"],
                "description": article["description"],
                "inLanguage": "ko-KR",
                "image": SITE + article["gen_img"],
                "datePublished": TODAY,
                "dateModified": TODAY,
                "author": {"@type": "Organization", "name": "토이포포"},
                "publisher": {"@type": "Organization", "name": "토이포포"},
                "mainEntityOfPage": url,
            },
            faq,
        ],
    }
    questions = "".join(f"<li>{esc(x)}</li>" for x in article["questions"])
    missions = "".join(f"<li>{esc(x)}</li>" for x in article["missions"])
    faq_html = "".join(f"<h3>{esc(q)}</h3>{p(a)}" for q, a in article["faq"])
    related = "".join(
        f'<a href="{href}"><strong>{esc(label)}</strong><span>{esc(desc)}</span></a>'
        for href, label, desc in RELATED
    )
    sections = "".join(f"<h2>{esc(h)}</h2>{p(body)}" for h, body in article["sections"])
    intro = "".join(p(x) for x in article["intro"])
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(article['description'])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(article['description'])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE + article['gen_img']}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{SITE + article['gen_img']}">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/place-guides.css?v=20260731a">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <script type="application/ld+json">{json_script(schema)}</script>
</head>
<body>
  <header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav></header>
  <main class="article-shell"><article class="article-card readable-article">
    <p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">아이와 가볼만한 곳</a> / {esc(article['short_title'])}</p>
    <p class="eyebrow">{esc(article['eyebrow'])}</p>
    <h1>{esc(article['title'])}</h1>
    {intro}
    <a class="ticket-quick-card" href="{article['affiliate']}" target="_blank" rel="sponsored nofollow noopener noreferrer"><span><span class="ticket-quick-card__eyebrow">예매 정보 요약</span><strong class="ticket-quick-card__title">{esc(article['product'])}</strong><span class="ticket-quick-card__facts"><span class="ticket-quick-card__rating"><span class="star">★</span> {article['rating']} · 후기 {article['reviews']}개</span><span class="ticket-quick-card__price">{article['price']}</span></span></span><span class="ticket-quick-card__button">일정·가격 확인하기</span></a>
    <p>이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며 링크를 통해 예약이 이루어질 경우 토이포포가 일정액의 수수료를 받을 수 있습니다. 가격, 평점, 후기 수, 회차, 포함 사항과 환불 규정은 예매처 표시 기준이며 변경될 수 있으므로 결제 전 현재 예매 페이지에서 다시 확인하세요.</p>
    <figure class="place-hero-photo"><img src="{article['gen_img']}" alt="{esc(article['short_title'])} 참고 이미지" loading="eager"><figcaption>토이포포 생성형 이미지입니다.</figcaption></figure>
    <h2>기본 정보</h2>
    <div class="place-fact-grid"><div><strong>장소</strong><span>{esc(article['place'])}</span></div><div><strong>지역</strong><span>{esc(article['breadcrumb'])}</span></div><div><strong>추천 포인트</strong><span>{esc(article['meta'])}</span></div><div><strong>예매처 표시</strong><span>평점 {article['rating']} · 후기 {article['reviews']}개 · {article['price']}</span></div><div><strong>확인할 것</strong><span>이용 시간, 연령 기준, 주차, 취소 규정</span></div><div><strong>부모 기준</strong><span>아이 컨디션과 중간 휴식을 먼저 고려하세요.</span></div></div>
    {sections}
    <section class="summary-box">
      <strong>예매 전 핵심 체크</strong>
      <p>{esc(article['product'])}은 아이와 함께하는 일정인 만큼 가격만 보고 고르기보다 아이의 연령, 이동 시간, 체험 강도, 쉬는 공간, 날씨 영향을 함께 보는 편이 좋습니다. 아래 카드의 일정·가격 확인하기 버튼에서 현재 회차와 조건을 다시 확인하세요.</p>
      <a class="ticket-card ticket-card--deal" href="{article['affiliate']}" target="_blank" rel="sponsored nofollow noopener noreferrer">
        <div class="ticket-card__media"><img src="{article['ticket_img']}" alt="{esc(article['product'])} 예매 대표 이미지" loading="lazy"><span class="ticket-card__status">{esc(article['status'])}</span></div>
        <div class="ticket-card__body"><span class="ticket-card__label">{esc(article['breadcrumb'])}</span><strong class="ticket-card__title">{esc(article['product'])}</strong><span class="ticket-card__rating"><span class="star">★</span> {article['rating']} <span class="count">(후기 {article['reviews']}개)</span></span><span class="ticket-card__price">{article['price']}</span><span class="ticket-card__meta">{esc(article['meta'])}</span><span class="ticket-card__button">일정·가격 확인하기</span></div>
      </a>
      <p class="ticket-card__notice">가격, 평점, 후기 수, 회차, 포함 사항과 환불 규정은 예매처 표시 기준이며 변경될 수 있습니다.</p>
    </section>
    <h2>하브루타 질문: 아이가 생각하게 만드는 관람법</h2>
    <p>하브루타 질문은 아이에게 정답을 맞히게 하는 질문이 아닙니다. 아이가 본 것을 자기 말로 설명하고, 왜 그렇게 생각했는지 말하고, 다른 가능성을 상상하게 만드는 대화 방식입니다. 장소에 도착하기 전 하나, 체험 중 하나, 집에 돌아와 하나 정도만 골라도 충분합니다.</p>
    <div class="mission-card"><h3>아이와 나누기 좋은 질문</h3><ul class="mission-list">{questions}</ul></div>
    <h2>오늘의 미션카드</h2>
    <p>미션은 아이가 체험을 더 능동적으로 보게 만드는 작은 장치입니다. 모두 완성해야 하는 숙제가 아니라, 아이가 직접 보고 고른 것을 기록하게 하는 놀이로 활용하세요.</p>
    <div class="mission-card"><ul class="mission-list">{missions}</ul></div>
    <h2>집에 와서 이어가는 놀이</h2>
    {p(article['home'])}
    <h2>자주 묻는 질문</h2>
    {faq_html}
    <h2>함께 보면 좋은 글</h2>
    <div class="related-grid">{related}</div>
  </article></main>
  <footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드와 우리동네 육아정보를 연결합니다.</p></div><nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">업데이트 정책</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer>
</body>
</html>
"""


def guide_card(article: dict) -> str:
    return (
        f'<a class="learning-guide-card" href="/local-info/places/{article["slug"]}.html">'
        f'<div class="learning-guide-card__media"><img src="{article["ticket_img"]}" alt="{esc(article["short_title"])} 대표 이미지">'
        f'<span class="learning-guide-card__tag">{esc(article["status"])}</span></div>'
        f'<div class="learning-guide-card__body"><strong>{esc(article["short_title"])}</strong>'
        f'<span>{esc(article["description"])}</span><em class="learning-guide-card__cta">가이드 보기</em></div></a>'
    )


def update_index() -> None:
    path = Path("local-info/index.html")
    text = path.read_text(encoding="utf-8")
    for article in ARTICLES:
        old = re.compile(
            rf'<a class="learning-guide-card" href="/local-info/places/{re.escape(article["slug"])}\.html">.*?</a>',
            re.S,
        )
        text = old.sub("", text)
    cards = "\n    ".join(guide_card(a) for a in ARTICLES)
    text = text.replace('<div class="learning-guide-grid">', '<div class="learning-guide-grid">\n    ' + cards + "\n    ", 1)
    path.write_text(text, encoding="utf-8", newline="")


def update_sitemap() -> None:
    path = Path("sitemap.xml")
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"<url><loc>https://toypoppo.kr/local-info/</loc><lastmod>.*?</lastmod>", f"<url><loc>https://toypoppo.kr/local-info/</loc><lastmod>{TODAY}</lastmod>", text)
    for article in ARTICLES:
        loc = f"{SITE}/local-info/places/{article['slug']}.html"
        text = re.sub(rf"\s*<url><loc>{re.escape(loc)}</loc>.*?</url>", "", text)
        entry = f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>0.8</priority></url>\n"
        text = text.replace("</urlset>", entry + "</urlset>")
    path.write_text(text, encoding="utf-8", newline="")


def main() -> None:
    out_dir = Path("local-info/places")
    out_dir.mkdir(parents=True, exist_ok=True)
    for article in ARTICLES:
        (out_dir / f"{article['slug']}.html").write_text(article_html(article), encoding="utf-8", newline="")
    update_index()
    update_sitemap()


if __name__ == "__main__":
    main()
