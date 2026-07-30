from __future__ import annotations

import html
import json
from pathlib import Path


SITE = "https://toypoppo.kr"
TODAY = "2026-07-30"


ARTICLES = [
    {
        "slug": "seoulland-kids-daypass-guide",
        "eyebrow": "SEOUL FAMILY PARK",
        "title": "서울랜드 어린이 종일권 아이와 가기 전 알아둘 것: 키 제한·동선·준비물 체크",
        "short_title": "서울랜드 어린이 종일권 아이와 가기 전 체크",
        "description": "서울랜드 어린이 종일권을 아이와 이용하기 전 확인할 추천 연령, 키 제한, 하루 동선, 준비물, 가격, 평점과 후기, 집에서 이어갈 놀이까지 정리했습니다.",
        "breadcrumb": "경기 과천 · 놀이공원",
        "product": "서울랜드 어린이 종일이용권",
        "affiliate": "https://myrealt.rip/g8VBba",
        "ticket_img": "/assets/images/places/seoulland-kids-daypass-ticket.jpg",
        "gen_img": "/assets/images/places/seoulland-kids-daypass-generated.jpg",
        "rating": "4.9",
        "reviews": "172",
        "price": "28,900원~",
        "meta": "과천 · 어린이 종일권 · 가족 나들이",
        "status": "즉시 확정",
        "facts": [
            ("장소", "서울랜드"),
            ("지역", "경기 과천"),
            ("추천 연령", "유아 후반~초등"),
            ("이용 방식", "종일권"),
            ("확인 포인트", "키 제한, 공연 시간, 휴식 동선"),
            ("예매 정보", "가격·후기는 예매 페이지 기준"),
        ],
        "intro": [
            "서울랜드는 아이와 하루를 보내기 좋은 대표 놀이공원입니다. 다만 어린아이와 방문할 때는 놀이기구를 많이 타는 것보다 아이의 키, 체력, 대기 시간, 쉬는 공간을 먼저 고려해야 만족도가 높습니다. 종일권을 예매했다면 ‘본전을 뽑아야 한다’는 마음으로 움직이기 쉽지만, 유아와 초등 저학년에게는 놀이기구 사이사이에 간식, 산책, 공연 관람을 섞어 주는 일정이 더 현실적입니다.",
            "이 글은 서울랜드 어린이 종일권을 아이와 이용하기 전 부모가 확인하면 좋은 기준을 정리한 가이드입니다. 가격과 평점, 후기 수는 예매처 표시 기준이며 시점에 따라 달라질 수 있습니다. 실제 방문 전에는 운영일, 기상 상황, 공연 시간표, 키 제한을 다시 확인하는 것이 좋습니다.",
        ],
        "sections": [
            ("이런 가족에게 맞습니다", "유아 후반부터 초등 저학년까지 놀이공원 첫 경험을 해보고 싶은 가족에게 잘 맞습니다. 아이가 캐릭터, 회전목마, 기차, 자동차 놀이기구를 좋아한다면 만족도가 높습니다. 반대로 소음에 민감하거나 줄 서는 시간을 힘들어하는 아이는 오전 짧은 코스와 공연 관람 위주로 계획하는 편이 낫습니다."),
            ("방문 전 체크할 기준", "첫째, 아이 키 제한을 먼저 봐야 합니다. 둘째, 낮잠이 남아 있는 아이는 오후 늦게 무리하지 않도록 합니다. 셋째, 주말에는 인기 놀이기구 대기 시간이 길 수 있으니 ‘꼭 탈 것 3개’만 정해 두는 것이 좋습니다. 넷째, 여름에는 물놀이와 그늘, 겨울에는 실내 휴식 공간을 먼저 확인하세요. 다섯째, 부모 한 명이 짐을 들고 계속 이동해야 하므로 짐은 최대한 작게 줄이는 것이 좋습니다."),
            ("아이에게 먼저 설명하면 좋은 말", "가기 전에는 ‘오늘은 놀이기구를 모두 타는 날’이 아니라 ‘재미있는 장소를 둘러보고 네가 좋아하는 것을 찾아보는 날’이라고 말해 주세요. 아이가 기다리는 시간을 힘들어하면 ‘줄을 서는 것도 놀이공원 약속이야. 기다리는 동안 다음에 탈 것을 골라보자’처럼 규칙을 짧게 알려주면 도움이 됩니다."),
        ],
        "questions": [
            "왜 놀이기구마다 탈 수 있는 키가 다를까?",
            "네가 가장 먼저 타고 싶은 것은 무엇이고 이유는 뭘까?",
            "빠른 놀이기구와 천천히 움직이는 놀이기구는 느낌이 어떻게 다를까?",
            "기다리는 동안 지루하지 않게 할 수 있는 방법은 무엇일까?",
            "오늘 본 색깔 중 가장 기억에 남는 색은 무엇일까?",
            "놀이공원에서 일하는 사람들은 어떤 일을 할까?",
            "집에 놀이공원을 만든다면 어떤 구역을 만들고 싶니?",
            "친구와 함께 왔다면 어떤 놀이기구를 추천하고 싶니?",
            "무서웠지만 해본 일이 있다면 어떤 기분이 들었니?",
            "오늘 하루 중 다시 하고 싶은 순간은 언제였니?",
        ],
        "missions": ["키 제한 표시 찾아보기", "가장 천천히 움직이는 놀이기구 찾기", "쉬는 장소 세 곳 표시하기", "오늘 가장 좋았던 소리 기억하기", "다음에 오면 타고 싶은 것 적기", "가족이 함께 찍을 장소 고르기"],
        "home": "집에 돌아와서는 종이컵과 블록으로 작은 놀이공원을 만들어 보세요. 아이가 직접 입구, 매표소, 쉬는 공간, 놀이기구를 정하면 공간 구성력과 이야기 만들기가 함께 자랍니다. ‘기다리는 줄’을 만들고 차례를 지키는 놀이를 하면 사회적 규칙을 자연스럽게 다시 익힐 수 있습니다.",
        "faq": [
            ("서울랜드 어린이 종일권은 몇 살부터 좋나요?", "유아 후반부터 초등 저학년까지 이용하기 좋습니다. 다만 아이 키와 성향에 따라 탈 수 있는 놀이기구가 달라지므로 방문 전 제한 기준을 확인하세요."),
            ("하루 종일 있어야 아깝지 않나요?", "어린아이와는 오래 머무는 것보다 무리하지 않는 동선이 중요합니다. 오전 입장 후 점심 전후로 쉬는 시간을 넣으면 만족도가 높습니다."),
            ("비 오는 날에도 갈 수 있나요?", "운영 상황과 야외 놀이기구 운행 여부가 달라질 수 있습니다. 비 예보가 있다면 실내 공연, 식사 공간, 환불 규정을 먼저 확인하세요."),
            ("아이와 갈 때 꼭 챙길 것은 무엇인가요?", "물, 간단한 간식, 여벌 옷, 얇은 겉옷, 보조배터리, 작은 비닐봉투가 실용적입니다."),
            ("예매 가격과 후기는 어디서 확인하나요?", "본문의 일정·가격 확인하기 버튼을 누르면 예매 페이지에서 현재 가격, 평점, 후기 수, 사용 조건을 확인할 수 있습니다."),
        ],
    },
    {
        "slug": "jeju-volcanic-pottery-kids-class",
        "eyebrow": "JEJU POTTERY CLASS",
        "title": "제주 도자기 만들기 체험 아이와 가기 전 체크: 표선 실내 공방 가족 코스",
        "short_title": "제주 도자기 만들기 아이와 가기 전 체크",
        "description": "제주 화산 송이 도자기 만들기 체험을 아이와 가기 전 확인할 추천 연령, 공방 위치, 소요 시간, 선택 옵션, 가격과 후기, 집에서 이어갈 감각 놀이를 정리했습니다.",
        "breadcrumb": "제주 표선 · 만들기 체험",
        "product": "제주 화산 송이로 만드는 나만의 도자기 만들기",
        "affiliate": "https://myrealt.rip/g8ar42",
        "ticket_img": "/assets/images/places/jeju-volcanic-pottery-kids-ticket.jpg",
        "gen_img": "/assets/images/places/jeju-volcanic-pottery-kids-generated.jpg",
        "rating": "4.8",
        "reviews": "223",
        "price": "18,000원~",
        "meta": "제주 · 실내 공방 · 만들기 체험",
        "status": "예약 가능",
        "facts": [
            ("장소", "성지도예 공방"),
            ("지역", "제주 서귀포 표선"),
            ("추천 연령", "5세 이상~초등"),
            ("운영", "09:00~18:00 기준"),
            ("활동", "컵·머그·접시·동물 만들기"),
            ("확인 포인트", "택배비, 추가 장식 비용"),
        ],
        "intro": [
            "제주 여행에서 아이와 실내 체험을 하나 넣고 싶다면 도자기 만들기는 날씨 영향을 덜 받고, 손으로 만지고 눌러 보는 시간이 길어 만족도가 높은 편입니다. 특히 화산 송이를 활용한 도자기 체험은 제주라는 지역성과 만들기 활동이 자연스럽게 연결됩니다. 아이에게는 ‘제주 흙으로 내 물건을 만든다’는 경험 자체가 여행 기억으로 남습니다.",
            "도자기 체험은 결과물이 바로 완성되는 놀이가 아니라 굽고 배송받는 과정이 있을 수 있습니다. 그래서 예약 전에는 체험 옵션, 추가 비용, 완성품 수령 방식, 아이가 직접 할 수 있는 범위를 확인하는 것이 좋습니다. 이 글은 제주 도자기 만들기 체험을 가족 일정에 넣기 전 부모가 확인할 내용을 정리했습니다.",
        ],
        "sections": [
            ("이런 가족에게 맞습니다", "비 오는 날 제주 실내 체험을 찾는 가족, 아이가 만들기와 촉감놀이를 좋아하는 가족, 여행 기념품을 직접 만들고 싶은 가족에게 맞습니다. 초등 아이는 형태를 계획하고 꾸미는 활동까지 즐길 수 있고, 유아는 흙을 만지고 누르는 감각 경험 자체에 집중할 수 있습니다."),
            ("방문 전 체크할 기준", "첫째, 선택 가능한 작품 종류를 확인하세요. 둘째, 완성품을 현장에서 바로 가져가는지 배송받는지 봐야 합니다. 셋째, 상감 장식이나 택배비처럼 현장에서 추가될 수 있는 비용을 확인하세요. 넷째, 아이가 오래 앉아 있는 것을 힘들어하면 간단한 작품을 고르는 편이 좋습니다. 다섯째, 옷에 흙이 묻을 수 있으니 편한 복장을 권합니다."),
            ("아이에게 먼저 설명하면 좋은 말", "가기 전에는 ‘예쁜 작품을 완벽하게 만드는 시간’이 아니라 ‘흙이 손에서 어떻게 변하는지 느껴보는 시간’이라고 말해 주세요. 결과물이 조금 삐뚤어져도 괜찮습니다. 아이가 만든 모양 안에는 그날의 손힘, 집중, 선택이 그대로 남습니다."),
        ],
        "questions": [
            "흙은 왜 물을 만나면 부드러워질까?",
            "네가 만든 컵은 누가 쓰면 좋을까?",
            "동그란 모양과 납작한 모양은 손 느낌이 어떻게 다를까?",
            "제주 화산 송이는 보통 흙과 무엇이 다르게 느껴질까?",
            "그릇은 왜 굽는 과정이 필요할까?",
            "색을 하나만 고른다면 어떤 색을 쓰고 싶니?",
            "실수한 부분을 새 모양으로 바꾼다면 무엇이 될까?",
            "집에서 쓰는 그릇 중 가장 만들기 어려워 보이는 것은 무엇일까?",
            "도자기를 오래 쓰려면 어떻게 다뤄야 할까?",
            "오늘 만든 작품 이름을 붙인다면 뭐라고 부르고 싶니?",
        ],
        "missions": ["가장 부드러운 흙 느낌 말하기", "손가락 자국 남겨보기", "동그라미와 선무늬 넣기", "내 작품 이름 정하기", "제주에서 본 자연 색 하나 넣기", "완성품을 어디에 쓸지 정하기"],
        "home": "집에서는 밀가루 반죽이나 점토로 다시 만들기를 이어갈 수 있습니다. 컵, 접시, 동물처럼 실생활 사물을 만들고 ‘무엇을 담을지’까지 이야기하면 단순 미술놀이가 생활 언어와 상상놀이로 확장됩니다. 완성품이 도착하면 아이와 함께 체험 날을 다시 떠올리며 짧은 기록을 남겨 보세요.",
        "faq": [
            ("제주 도자기 만들기는 몇 살부터 좋나요?", "보호자 도움을 받는다면 유아도 가능하지만, 스스로 형태를 만들고 꾸미는 경험은 5세 이상부터 더 잘 즐기는 편입니다."),
            ("완성품은 바로 가져갈 수 있나요?", "도자기는 굽는 과정이 필요할 수 있습니다. 현장 수령인지 배송인지, 배송비가 있는지 예약 전 확인하세요."),
            ("비 오는 날 제주 일정으로 괜찮나요?", "실내 공방 체험이라 비 오는 날 대안 일정으로 좋습니다. 다만 이동 거리와 주차 가능 여부는 미리 확인해야 합니다."),
            ("아이 옷은 어떻게 입히면 좋나요?", "흙이나 물감이 묻어도 되는 편한 옷이 좋습니다. 밝은 색 외출복보다는 활동복을 권합니다."),
            ("체험 가격은 변동될 수 있나요?", "옵션, 장식, 배송 조건에 따라 달라질 수 있습니다. 현재 가격과 포함 사항은 예약 페이지에서 다시 확인하세요."),
        ],
    },
    {
        "slug": "busan-seomyeon-kids-bracelet-class",
        "eyebrow": "BUSAN KIDS CLASS",
        "title": "부산 서면 키즈 팔찌 만들기 아이와 가기 전 체크: 원데이 클래스 준비물·가격·후기",
        "short_title": "부산 서면 키즈 팔찌 만들기 아이와 가기 전 체크",
        "description": "부산 서면 키즈 팔찌 만들기 원데이 클래스를 아이와 가기 전 확인할 추천 연령, 위치, 소요 시간, 가격, 후기, 부모가 도와줄 범위와 집 활동을 정리했습니다.",
        "breadcrumb": "부산 서면 · 만들기 클래스",
        "product": "부산 서면 원데이 키즈 팔찌 만들기 클래스",
        "affiliate": "https://myrealt.rip/g8ije5",
        "ticket_img": "/assets/images/places/busan-kids-bracelet-class-ticket.jpg",
        "gen_img": "/assets/images/places/busan-kids-bracelet-class-generated.jpg",
        "rating": "5.0",
        "reviews": "1",
        "price": "50,000원~",
        "meta": "부산 · 키즈 클래스 · 소근육 활동",
        "status": "예약 가능",
        "facts": [
            ("장소", "프랑꼬아트랩 부산서면점"),
            ("지역", "부산 서면"),
            ("추천 연령", "유아 후반~초등"),
            ("운영", "금·토·일·월·화 기준"),
            ("활동", "비즈 선택, 패턴 만들기, 팔찌 완성"),
            ("확인 포인트", "회차 시간, 보호자 동반, 재료 구성"),
        ],
        "intro": [
            "부산 서면에서 아이와 짧고 집중도 있는 실내 체험을 찾는다면 팔찌 만들기 원데이 클래스가 좋은 선택지가 될 수 있습니다. 팔찌 만들기는 단순 꾸미기처럼 보이지만 실제로는 색 고르기, 순서 정하기, 손가락으로 작은 재료를 집기, 완성 후 착용하기까지 여러 발달 요소가 들어 있습니다.",
            "특히 유아 후반과 초등 저학년 아이에게는 ‘내가 고른 재료가 하나의 결과물이 되는 경험’이 중요합니다. 완성품을 바로 착용할 수 있어 성취감이 빠르게 느껴지고, 부모와 함께 색의 조합이나 패턴을 이야기하기 좋습니다. 이 글은 부산 서면 키즈 팔찌 만들기를 예약하기 전 확인할 기준과 아이와 나눌 질문을 정리했습니다.",
        ],
        "sections": [
            ("이런 가족에게 맞습니다", "부산 여행 중 비 오는 날 실내 일정을 찾는 가족, 아이가 꾸미기와 만들기를 좋아하는 가족, 긴 체험보다 짧고 완성감 있는 활동을 원하는 가족에게 맞습니다. 초등 아이는 스스로 디자인을 계획할 수 있고, 유아는 부모 도움을 받아 색 선택과 끼우기 활동을 즐길 수 있습니다."),
            ("방문 전 체크할 기준", "첫째, 아이가 작은 재료를 안전하게 다룰 수 있는지 확인하세요. 둘째, 보호자 동반과 대기 가능 여부를 봐야 합니다. 셋째, 회차 시간이 아이 식사나 낮잠 시간과 겹치지 않는지 확인하세요. 넷째, 완성품 크기 조절이 가능한지 살펴보세요. 다섯째, 아이가 선택 시간이 길어지는 편이라면 미리 좋아하는 색 두세 가지를 정해 가면 좋습니다."),
            ("아이에게 먼저 설명하면 좋은 말", "팔찌 만들기는 ‘예쁘게만 만드는 시간’이 아니라 ‘색과 순서를 스스로 고르는 시간’입니다. 아이에게 ‘네가 고른 색에는 이유가 있을 거야. 어떤 느낌으로 만들고 싶어?’라고 물어보면 선택을 말로 설명하는 연습이 됩니다."),
        ],
        "questions": [
            "첫 번째 비즈는 어떤 색으로 시작하고 싶니?",
            "반복되는 무늬를 만들려면 어떤 순서가 좋을까?",
            "밝은 색과 어두운 색을 같이 놓으면 어떤 느낌이 날까?",
            "친구에게 선물한다면 어떤 색을 고르고 싶니?",
            "팔찌 이름을 붙인다면 뭐라고 부를까?",
            "작은 구슬을 끼울 때 손은 어떻게 움직였니?",
            "중간에 마음이 바뀌면 어떻게 고칠 수 있을까?",
            "같은 재료로 목걸이를 만든다면 무엇이 달라질까?",
            "완성한 팔찌를 언제 차고 싶니?",
            "오늘 가장 어려웠던 부분과 가장 재미있었던 부분은 무엇이었니?",
        ],
        "missions": ["좋아하는 색 3개 고르기", "반복 패턴 하나 만들기", "선물할 사람 정하기", "완성품 이름 붙이기", "가장 작은 재료 조심히 집기", "집에 와서 같은 패턴 그려보기"],
        "home": "집에서는 큰 구슬, 빨대 조각, 종이 고리로 패턴 놀이를 이어갈 수 있습니다. ‘빨강-노랑-빨강-노랑’처럼 반복 규칙을 만들고 아이가 다음 색을 예측하게 해보세요. 초등 아이는 팔찌 디자인을 종이에 먼저 그린 뒤 실제로 만드는 순서로 확장하면 계획력과 표현력이 함께 자랍니다.",
        "faq": [
            ("부산 키즈 팔찌 만들기는 몇 살부터 좋나요?", "작은 재료를 다루는 활동이라 유아 후반부터 초등 저학년에게 특히 좋습니다. 유아는 보호자 도움이 필요할 수 있습니다."),
            ("부모가 함께 들어가야 하나요?", "클래스 운영 방식에 따라 다를 수 있습니다. 보호자 동반, 대기 공간, 촬영 가능 여부는 예약 전 확인하세요."),
            ("비 오는 날 부산 일정으로 괜찮나요?", "실내 클래스라 날씨 영향을 적게 받습니다. 서면 주변 식사나 카페 일정과 함께 묶기 좋습니다."),
            ("아이에게 어떤 발달 자극이 되나요?", "색 선택, 순서 만들기, 작은 재료 집기, 완성품 설명하기가 소근육과 계획력, 언어 표현에 도움이 됩니다."),
            ("가격과 후기가 적어도 괜찮나요?", "후기 수가 적은 상품은 장소, 운영 시간, 포함 재료, 환불 규정을 더 꼼꼼히 확인하는 편이 안전합니다."),
        ],
    },
]


RELATED = [
    ("/local-info/", "아이와 가볼만한 곳 전체 보기"),
    ("/blog/7-month-baby-development-play.html", "7개월 아기 발달놀이"),
    ("/montessori/toy-rotation.html", "장난감 로테이션 방법"),
    ("/parent-guide/rainy-day-home-play.html", "비 오는 날 집콕 놀이"),
    ("/worksheets/", "엄마표 자료실"),
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def json_ld(article: dict) -> str:
    url = f"{SITE}/local-info/places/{article['slug']}.html"
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "홈", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": "아이와 가볼만한 곳", "item": f"{SITE}/local-info/"},
                    {"@type": "ListItem", "position": 3, "name": article["short_title"], "item": url},
                ],
            },
            {
                "@type": "Article",
                "headline": article["title"],
                "description": article["description"],
                "inLanguage": "ko-KR",
                "image": f"{SITE}{article['ticket_img']}",
                "datePublished": TODAY,
                "dateModified": TODAY,
                "author": {"@type": "Organization", "name": "토이포포"},
                "publisher": {"@type": "Organization", "name": "토이포포"},
                "mainEntityOfPage": url,
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in article["faq"]
                ],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False)


def ticket_card(article: dict) -> str:
    return f'''<a class="ticket-card ticket-card--deal" href="{article['affiliate']}" target="_blank" rel="sponsored nofollow noopener noreferrer">
  <div class="ticket-card__media">
    <img src="{article['ticket_img']}" alt="{esc(article['product'])} 대표 이미지" loading="lazy">
    <span class="ticket-card__status">{esc(article['status'])}</span>
  </div>
  <div class="ticket-card__body">
    <strong class="ticket-card__title">{esc(article['product'])}</strong>
    <span class="ticket-card__rating"><span class="star">★</span> {article['rating']} <span class="count">후기 {article['reviews']}개</span></span>
    <span class="ticket-card__price">{article['price']}</span>
    <span class="ticket-card__meta">{esc(article['meta'])}</span>
    <span class="ticket-card__button">일정·가격 확인하기</span>
  </div>
</a>'''


def render(article: dict) -> str:
    url = f"{SITE}/local-info/places/{article['slug']}.html"
    facts = "\n".join(f"<div><strong>{esc(k)}</strong><span>{esc(v)}</span></div>" for k, v in article["facts"])
    intros = "\n".join(f"<p>{esc(p)}</p>" for p in article["intro"])
    sections = "\n".join(f"<h2>{esc(h)}</h2><p>{esc(p)}</p>" for h, p in article["sections"])
    questions = "\n".join(f"<li>{esc(q)}</li>" for q in article["questions"])
    missions = "\n".join(f"<li>□ {esc(m)}</li>" for m in article["missions"])
    faq = "\n".join(f"<h3>{esc(q)}</h3><p>{esc(a)}</p>" for q, a in article["faq"])
    related = "\n".join(f'<a href="{href}">{esc(text)}</a>' for href, text in RELATED)
    return f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(article['title'])} | 토이포포</title>
  <meta name="description" content="{esc(article['description'])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <meta property="og:title" content="{esc(article['title'])} | 토이포포">
  <meta property="og:description" content="{esc(article['description'])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}{article['ticket_img']}">
  <meta property="og:site_name" content="토이포포">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/place-guides.css?v=20260730-mrt3">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script>
  <script type="application/ld+json">{json_ld(article)}</script>
</head>
<body>
  <header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav></header>
  <main class="article-shell">
    <article class="article-card readable-article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">아이와 가볼만한 곳</a> / {esc(article['breadcrumb'])}</p>
      <p class="eyebrow">{esc(article['eyebrow'])}</p>
      <h1>{esc(article['title'])}</h1>
      <p class="lead">{esc(article['description'])}</p>
      <a class="ticket-quick-card" href="{article['affiliate']}" target="_blank" rel="sponsored nofollow noopener noreferrer"><span><span class="ticket-quick-card__eyebrow">예매 정보 요약</span><strong class="ticket-quick-card__title">{esc(article['product'])}</strong><span class="ticket-quick-card__facts"><span class="ticket-quick-card__rating"><span class="star">★</span> {article['rating']} · 후기 {article['reviews']}개</span><span class="ticket-quick-card__price">{article['price']}</span></span></span><span class="ticket-quick-card__button">일정·가격 확인하기</span></a>
      {intros}

      <figure class="place-hero-photo">
        <img src="{article['ticket_img']}" alt="{esc(article['product'])} 마이리얼트립 대표 이미지" loading="eager">
        <figcaption>마이리얼트립 상품 대표 이미지입니다. 가격, 일정, 포함 사항은 예매처에서 다시 확인하세요.</figcaption>
      </figure>

      <h2>기본 정보 한눈에 보기</h2>
      <div class="place-fact-grid">{facts}</div>

      {sections}

      <figure class="place-hero-photo">
        <img src="{article['gen_img']}" alt="{esc(article['short_title'])} 토이포포 참고 이미지" loading="lazy">
        <figcaption>토이포포 생성형 이미지입니다.</figcaption>
      </figure>

      <section class="summary-box">
        <strong>예매 전 핵심 체크</strong>
        <p>가격, 평점, 후기 수, 회차, 포함 사항과 환불 규정은 예매처 표시 기준이며 변경될 수 있습니다. 결제 전 현재 예매 페이지에서 다시 확인하세요.</p>
        {ticket_card(article)}
      </section>

      <h2>하브루타 질문: 왜 하면 좋을까?</h2>
      <p>체험 장소에서 아이에게 질문을 던지는 이유는 정답을 맞히게 하려는 것이 아닙니다. 아이가 본 것, 느낀 것, 궁금한 것을 자기 말로 정리하게 하려는 목적입니다. 질문을 잘 던지면 같은 장소를 다녀와도 단순 나들이가 아니라 관찰력, 표현력, 사고력을 쓰는 경험이 됩니다.</p>
      <ol>{questions}</ol>

      <section class="mission-card">
        <h2>오늘의 미션 카드</h2>
        <p>아이에게 전부 시키기보다 두세 개만 골라 주세요. 체크하는 행동 자체가 관찰 목표를 만들어 줍니다.</p>
        <ul class="mission-list">{missions}</ul>
      </section>

      <h2>집에 와서 이어갈 활동</h2>
      <p>{esc(article['home'])}</p>

      <section class="source-note">
        <h2>제휴 링크 안내</h2>
        <p>이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며 링크를 통해 예약이 이루어질 경우 토이포포가 일정액의 수수료를 받을 수 있습니다. 본문은 부모가 아이와 체험을 준비할 때 필요한 정보 제공을 우선으로 작성했습니다.</p>
      </section>

      <h2>함께 보면 좋은 글</h2>
      <div class="related-links">{related}</div>

      <h2>자주 묻는 질문</h2>
      {faq}

      <h2>마무리</h2>
      <p>아이와 체험 장소를 고를 때 가장 중요한 기준은 유명한 곳인지보다 우리 아이가 오늘 무리 없이 즐길 수 있는지입니다. 예매 전에는 가격과 회차, 환불 규정, 이동 시간을 확인하고, 방문 후에는 아이가 기억하는 한 장면을 다시 이야기해 주세요. 그 과정까지 이어질 때 하루 나들이가 아이의 경험으로 남습니다.</p>
    </article>
  </main>
  <footer class="site-footer"><div><strong>토이포포</strong><p>대한민국 부모를 위한 육아·놀이·교육 정보 플랫폼</p></div><nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의</a></nav></footer>
</body>
</html>
'''


def main() -> None:
    outdir = Path("local-info/places")
    outdir.mkdir(parents=True, exist_ok=True)
    for article in ARTICLES:
        (outdir / f"{article['slug']}.html").write_text(render(article), encoding="utf-8")

    index_path = Path("local-info/index.html")
    index = index_path.read_text(encoding="utf-8")
    start = index.find('<a class="learning-guide-card" href="/local-info/places/seoulland-kids-daypass-guide.html"')
    if start != -1:
        end_marker = '<a class="learning-guide-card" href="/local-info/places/seoul-night-city-tour-bus-kids.html"'
        end = index.find(end_marker, start)
        if end != -1:
            index = index[:start] + index[end:]
    cards = "\n".join(
        f'''    <a class="learning-guide-card" href="/local-info/places/{article['slug']}.html"><div class="learning-guide-card__media"><img src="{article['ticket_img']}" alt="{esc(article['short_title'])} 대표 이미지"><span class="learning-guide-card__tag">{esc(article['breadcrumb'].split('·')[-1].strip())}</span></div><div class="learning-guide-card__body"><strong>{esc(article['short_title'])}</strong><span>{esc(article['description'])}</span><em class="learning-guide-card__cta">가이드 보기</em></div></a>'''
        for article in ARTICLES
    )
    marker = '  <div class="learning-guide-grid">\n'
    if ARTICLES[0]["slug"] not in index:
        index = index.replace(marker, marker + cards + "\n", 1)
    index_path.write_text(index, encoding="utf-8")

    sitemap_path = Path("sitemap.xml")
    sitemap = sitemap_path.read_text(encoding="utf-8")
    for article in ARTICLES:
        loc = f"{SITE}/local-info/places/{article['slug']}.html"
        if loc not in sitemap:
            sitemap = sitemap.replace(
                "</urlset>",
                f'  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>0.8</priority></url>\n</urlset>',
            )
    sitemap_path.write_text(sitemap, encoding="utf-8")


if __name__ == "__main__":
    main()
