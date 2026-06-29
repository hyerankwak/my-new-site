const fs = require("fs");
const path = require("path");

const today = "2026-06-30";

const regions = [
  ["seoul", "서울", "수도권 대표 전시와 어린이 체험을 짧은 이동으로 묶기 좋은 지역"],
  ["gyeonggi", "경기", "어린이박물관, 과학관, 자연사관을 가족 일정으로 고르기 좋은 지역"],
  ["incheon", "인천", "바다와 역사, 과학 체험을 함께 볼 수 있는 지역"],
  ["busan", "부산", "해양·과학·미술 전시를 아이 관심사에 맞춰 고르기 좋은 지역"],
  ["daegu", "대구", "과학관과 미술관, 생활사 전시를 도심 동선으로 묶기 좋은 지역"],
  ["gwangju", "광주", "예술 전시와 과학 체험을 균형 있게 접하기 좋은 지역"],
  ["daejeon", "대전", "국립 과학관과 연구·자연사 전시가 강한 지역"],
  ["ulsan", "울산", "산업·생태·해양 주제를 아이 눈높이로 연결하기 좋은 지역"],
  ["sejong", "세종", "국립 어린이 전시와 생활사 전시를 조용히 둘러보기 좋은 지역"],
  ["gangwon", "강원", "자연사, 산림, 역사 전시를 여행 일정과 함께 보기 좋은 지역"],
  ["chungbuk", "충북", "인쇄문화, 과학 체험, 지역 박물관을 실내 일정으로 잡기 좋은 지역"],
  ["chungnam", "충남", "역사·독립·해양생물·천문 과학 체험을 넓게 고를 수 있는 지역"],
  ["jeonbuk", "전북", "역사박물관, 미술관, 천문·과학 체험을 가족 나들이로 묶기 좋은 지역"],
  ["jeonnam", "전남", "자연사, 우주, 해양 생물 전시가 강한 지역"],
  ["gyeongbuk", "경북", "역사와 과학, 자연사 주제를 초등 학습과 연결하기 좋은 지역"],
  ["gyeongnam", "경남", "공룡, 항공우주, 미술 전시처럼 아이 관심사가 뚜렷한 지역"],
  ["jeju", "제주", "자연사, 항공우주, 미술 전시를 여행 동선에 넣기 좋은 지역"],
];

const places = [
  ["서울", "박물관", "국립중앙박물관", "서울 용산구 서빙고로 137", "유모차 동선과 어린이박물관 예약을 함께 확인하면 만족도가 높습니다."],
  ["서울", "박물관", "국립민속박물관 어린이박물관", "서울 종로구 삼청로 37", "생활문화와 전통 놀이를 아이 눈높이로 접하기 좋습니다."],
  ["서울", "박물관", "서울공예박물관", "서울 종로구 율곡로3길 4", "만들기와 재료 관찰을 좋아하는 아이에게 잘 맞습니다."],
  ["서울", "미술관", "국립현대미술관 서울", "서울 종로구 삼청로 30", "전시 난이도가 다양하므로 짧게 볼 전시를 미리 골라 가세요."],
  ["서울", "미술관", "서울시립미술관", "서울 중구 덕수궁길 61", "초등 아이는 작품 하나를 고르고 이유를 말해보는 방식이 좋습니다."],
  ["서울", "과학관", "국립어린이과학관", "서울 종로구 창경궁로 215", "체험 회차와 예약 여부를 먼저 확인해야 헛걸음을 줄일 수 있습니다."],
  ["서울", "자연사관", "서대문자연사박물관", "서울 서대문구 연희로32길 51", "공룡과 지구, 생물에 관심이 생긴 아이에게 반응이 좋습니다."],

  ["경기", "과학관", "국립과천과학관", "경기 과천시 상하벌로 110", "하루에 다 보기보다 어린이탐구체험관이나 천체관처럼 한 구역을 정하세요."],
  ["경기", "박물관", "경기도어린이박물관", "경기 용인시 기흥구 상갈로 6", "영유아부터 유아까지 직접 만지는 전시가 많아 첫 박물관으로 좋습니다."],
  ["경기", "박물관", "고양어린이박물관", "경기 고양시 덕양구 화중로 26", "실내 체험형 전시가 많아 날씨 영향을 덜 받습니다."],
  ["경기", "미술관", "백남준아트센터", "경기 용인시 기흥구 백남준로 10", "소리와 영상 전시가 있어 민감한 아이는 짧게 관람하세요."],
  ["경기", "미술관", "현대어린이책미술관", "경기 성남시 분당구 판교역로146번길 20", "그림책과 미술을 함께 좋아하는 아이에게 좋습니다."],
  ["경기", "자연사관", "우석헌자연사박물관", "경기 남양주시 진접읍 금강로 1095", "광물과 화석 관찰을 좋아하는 초등 아이에게 특히 좋습니다."],
  ["경기", "미술관", "호암미술관", "경기 용인시 처인구 포곡읍 에버랜드로562번길 38", "정원 산책과 전시를 함께 묶기 좋지만 예약과 이동 동선을 확인하세요."],

  ["인천", "과학관", "인천어린이과학관", "인천 계양구 방축로 21", "어린이 전용 과학관이라 조작 체험을 좋아하는 아이에게 좋습니다."],
  ["인천", "박물관", "국립세계문자박물관", "인천 연수구 센트럴로 217", "문자와 언어에 관심이 생긴 유아·초등 아이에게 좋습니다."],
  ["인천", "박물관", "인천광역시립박물관", "인천 연수구 청량로160번길 26", "지역 역사와 생활 문화를 짧게 보기 좋습니다."],
  ["인천", "미술관", "인천아트플랫폼", "인천 중구 제물량로218번길 3", "전시와 근대거리 산책을 함께 묶을 수 있습니다."],
  ["인천", "자연사관", "강화자연사박물관", "인천 강화군 하점면 강화대로 994-33", "강화역사박물관과 가까워 하루 코스를 만들기 좋습니다."],
  ["인천", "박물관", "소래역사관", "인천 남동구 아암대로 1605", "기차와 항구 이야기를 좋아하는 아이에게 짧은 관람지로 좋습니다."],

  ["부산", "과학관", "국립부산과학관", "부산 기장군 기장읍 동부산관광6로 59", "자동차·우주·에너지 체험처럼 아이가 직접 조작할 전시가 많습니다."],
  ["부산", "박물관", "국립해양박물관", "부산 영도구 해양로301번길 45", "바다 생물과 배에 관심 있는 아이가 오래 머무르기 좋습니다."],
  ["부산", "박물관", "부산박물관", "부산 남구 유엔평화로 63", "역사 전시는 초등 아이와 보기 좋고 유아는 짧게 잡는 편이 좋습니다."],
  ["부산", "미술관", "부산현대미술관", "부산 사하구 낙동남로 1191", "넓은 전시장이라 한 전시만 고르고 이동 거리를 줄이세요."],
  ["부산", "미술관", "부산시립미술관", "부산 해운대구 APEC로 58", "어린이 체험 프로그램이 있는 날을 확인하면 좋습니다."],
  ["부산", "과학관", "국립수산과학관", "부산 기장군 기장읍 기장해안로 216", "바다와 수산 생물을 함께 이야기하기 좋습니다."],

  ["대구", "과학관", "국립대구과학관", "대구 달성군 유가읍 테크노대로6길 20", "유아부터 초등까지 체험 수준을 나눠 보기 좋습니다."],
  ["대구", "과학관", "국립대구기상과학관", "대구 동구 효동로2길 10", "날씨와 구름, 바람 이야기를 실생활과 연결하기 좋습니다."],
  ["대구", "미술관", "대구미술관", "대구 수성구 미술관로 40", "전시와 야외 공간을 함께 이용하기 좋지만 이동 동선을 미리 보세요."],
  ["대구", "박물관", "국립대구박물관", "대구 수성구 청호로 321", "역사 유물을 처음 접하는 초등 아이에게 좋습니다."],
  ["대구", "박물관", "대구섬유박물관", "대구 동구 팔공로 227", "옷감과 산업 이야기를 촉감·생활 주제로 풀기 좋습니다."],
  ["대구", "박물관", "대구교육박물관", "대구 북구 대동로1길 40", "부모 세대 학교 이야기를 아이와 나누기 좋습니다."],

  ["광주", "과학관", "국립광주과학관", "광주 북구 첨단과기로 235", "우주와 빛, 과학 체험을 넓게 볼 수 있어 가족 방문이 많습니다."],
  ["광주", "박물관", "국립광주박물관", "광주 북구 하서로 110", "호남 역사와 문화를 초등 아이와 차분히 보기 좋습니다."],
  ["광주", "미술관", "광주시립미술관", "광주 북구 하서로 52", "어린이갤러리나 교육 프로그램 일정을 확인해 보세요."],
  ["광주", "미술관", "광주비엔날레전시관", "광주 북구 비엔날레로 111", "시기별 전시 성격이 달라 방문 전 전시 내용을 확인하세요."],
  ["광주", "박물관", "국립아시아문화전당 어린이문화원", "광주 동구 문화전당로 38", "아이 전용 체험과 공연이 많아 사전 예약 확인이 중요합니다."],
  ["광주", "박물관", "광주김치박물관", "광주 남구 김치로 60", "음식 문화와 발효 이야기를 쉽게 풀기 좋습니다."],

  ["대전", "과학관", "국립중앙과학관", "대전 유성구 대덕대로 481", "과학관 대표 코스로, 아이 연령에 맞는 전시관을 골라 보세요."],
  ["대전", "자연사관", "천연기념물센터", "대전 서구 유등로 927", "동물과 식물, 자연유산을 좋아하는 아이에게 좋습니다."],
  ["대전", "자연사관", "지질박물관", "대전 유성구 과학로 124", "공룡과 암석, 지구과학 관심을 키우기 좋습니다."],
  ["대전", "박물관", "화폐박물관", "대전 유성구 과학로 80-67", "돈과 경제 이야기를 초등 아이와 쉽게 시작할 수 있습니다."],
  ["대전", "박물관", "대전시립박물관", "대전 유성구 도안대로 398", "지역 역사와 기획전시를 짧게 보기 좋습니다."],
  ["대전", "미술관", "대전시립미술관", "대전 서구 둔산대로 155", "전시와 주변 문화시설을 함께 묶기 좋습니다."],

  ["울산", "박물관", "울산박물관", "울산 남구 두왕로 277", "울산 역사와 산업 이야기를 한 번에 보기 좋습니다."],
  ["울산", "미술관", "울산시립미술관", "울산 중구 미술관길 72", "미디어아트 전시가 있어 아이 반응을 보며 짧게 관람하세요."],
  ["울산", "과학관", "울산과학관", "울산 남구 남부순환도로 111", "체험과 관찰 중심으로 반나절 실내 일정에 좋습니다."],
  ["울산", "박물관", "장생포고래박물관", "울산 남구 장생포고래로 244", "고래와 바다 이야기를 좋아하는 아이에게 반응이 좋습니다."],
  ["울산", "박물관", "울산대곡박물관", "울산 울주군 두동면 서하천전로 257", "역사와 자연 동선을 함께 잡을 때 좋습니다."],

  ["세종", "박물관", "국립어린이박물관", "세종특별자치시 어울누리로 130", "어린이 전용 전시라 예약과 회차 확인이 중요합니다."],
  ["세종", "박물관", "대통령기록관", "세종특별자치시 다솜로 250", "초등 아이와 기록, 역사, 민주주의 이야기를 시작하기 좋습니다."],
  ["세종", "박물관", "국립조세박물관", "세종특별자치시 국세청로 8-14", "돈과 세금 이야기를 초등 눈높이로 가볍게 접할 수 있습니다."],
  ["세종", "박물관", "세종시립민속박물관", "세종특별자치시 전의면 금사길 75", "생활사와 옛 물건을 천천히 관찰하기 좋습니다."],

  ["강원", "박물관", "국립춘천박물관", "강원 춘천시 우석로 70", "강원 역사와 문화를 초등 아이와 보기 좋습니다."],
  ["강원", "미술관", "뮤지엄 산", "강원 원주시 지정면 오크밸리2길 260", "전시와 건축, 산책을 함께 즐기지만 동선이 길어 시간을 넉넉히 잡으세요."],
  ["강원", "미술관", "강릉시립미술관", "강원 강릉시 화부산로40번길 46", "강릉 여행 중 짧은 실내 일정으로 넣기 좋습니다."],
  ["강원", "자연사관", "태백고생대자연사박물관", "강원 태백시 태백로 2249", "화석과 지질, 공룡 관심이 있는 아이에게 좋습니다."],
  ["강원", "박물관", "정선아리랑박물관", "강원 정선군 정선읍 애산로 51", "소리와 지역 이야기를 함께 들려주기 좋습니다."],
  ["강원", "박물관", "삼탄아트마인", "강원 정선군 고한읍 함백산로 1445-44", "공간 자체가 독특해 초등 아이와 사진·관찰 활동으로 좋습니다."],

  ["충북", "박물관", "국립청주박물관", "충북 청주시 상당구 명암로 143", "어린이박물관 운영 여부와 회차를 확인하면 좋습니다."],
  ["충북", "박물관", "청주고인쇄박물관", "충북 청주시 흥덕구 직지대로 713", "직지와 인쇄문화 이야기를 초등 학습과 연결하기 좋습니다."],
  ["충북", "미술관", "청주시립미술관", "충북 청주시 서원구 충렬로18번길 50", "도심 실내 전시로 짧게 방문하기 좋습니다."],
  ["충북", "과학관", "충청북도자연과학교육원", "충북 청주시 상당구 대성로 150", "과학 체험 프로그램 운영 여부를 먼저 확인하세요."],
  ["충북", "과학관", "별새꽃돌과학관", "충북 제천시 봉양읍 옥전4길 45", "천문과 자연 관찰에 관심 있는 아이에게 좋습니다."],
  ["충북", "박물관", "충주고구려비전시관", "충북 충주시 중앙탑면 감노로 2319", "역사 학습을 시작한 초등 아이와 보기 좋습니다."],

  ["충남", "박물관", "독립기념관", "충남 천안시 동남구 목천읍 독립기념관로 1", "초등 아이와 역사 이야기를 시작하기 좋은 대표 장소입니다."],
  ["충남", "박물관", "국립공주박물관", "충남 공주시 관광단지길 34", "백제 역사와 유물을 아이 눈높이로 연결하기 좋습니다."],
  ["충남", "과학관", "아산장영실과학관", "충남 아산시 실옥로 222", "장영실과 발명 이야기를 과학 체험과 묶기 좋습니다."],
  ["충남", "과학관", "천안홍대용과학관", "충남 천안시 동남구 수신면 장산서길 113", "천문 관측과 우주 이야기에 관심 있는 아이에게 좋습니다."],
  ["충남", "자연사관", "계룡산자연사박물관", "충남 공주시 반포면 임금봉길 49-25", "공룡과 자연사 전시를 좋아하는 아이에게 반응이 좋습니다."],
  ["충남", "자연사관", "국립해양생물자원관 씨큐리움", "충남 서천군 장항읍 장산로101번길 75", "해양 생물 전시가 풍부해 가족 방문 만족도가 높습니다."],

  ["전북", "박물관", "국립전주박물관", "전북 전주시 완산구 쑥고개로 249", "전주 여행과 함께 역사 전시를 짧게 넣기 좋습니다."],
  ["전북", "미술관", "전북도립미술관", "전북 완주군 구이면 모악산길 111-6", "자연 동선과 전시를 함께 묶을 수 있습니다."],
  ["전북", "박물관", "전주역사박물관", "전북 전주시 완산구 쑥고개로 259", "전주 지역 이야기를 초등 아이와 보기 좋습니다."],
  ["전북", "박물관", "국립익산박물관", "전북 익산시 금마면 미륵사지로 362", "백제와 미륵사지 이야기를 실제 장소와 연결하기 좋습니다."],
  ["전북", "과학관", "무주반디별천문과학관", "전북 무주군 설천면 무설로 1324", "밤하늘과 별 이야기를 좋아하는 아이에게 좋습니다."],
  ["전북", "과학관", "정읍첨단과학관", "전북 정읍시 첨단과학로 507", "과학 체험과 전시를 짧게 둘러보기 좋습니다."],

  ["전남", "박물관", "국립나주박물관", "전남 나주시 반남면 고분로 747", "영산강 유역 역사와 유물을 차분히 보기 좋습니다."],
  ["전남", "미술관", "전남도립미술관", "전남 광양시 광양읍 순광로 660", "지역 대표 미술관으로 전시 일정을 확인하고 가면 좋습니다."],
  ["전남", "자연사관", "목포자연사박물관", "전남 목포시 남농로 135", "공룡과 자연사 전시가 있어 아이 반응이 좋은 편입니다."],
  ["전남", "과학관", "목포어린이바다과학관", "전남 목포시 삼학로92번길 98", "바다와 과학을 함께 이야기하기 좋습니다."],
  ["전남", "과학관", "나로우주센터 우주과학관", "전남 고흥군 봉래면 하반로 490", "우주와 로켓을 좋아하는 아이에게 특별한 목적지가 됩니다."],
  ["전남", "자연사관", "해남공룡박물관", "전남 해남군 황산면 공룡박물관길 234", "공룡을 좋아하는 유아·초등 아이에게 강한 목적지입니다."],

  ["경북", "박물관", "국립경주박물관", "경북 경주시 일정로 186", "신라 역사와 어린이박물관을 함께 보기 좋습니다."],
  ["경북", "미술관", "경주솔거미술관", "경북 경주시 경감로 614", "경주 여행 중 전시와 산책을 함께 묶기 좋습니다."],
  ["경북", "미술관", "포항시립미술관", "경북 포항시 북구 환호공원길 10", "전시와 주변 공원 동선을 함께 고려하세요."],
  ["경북", "박물관", "문경석탄박물관", "경북 문경시 가은읍 왕능길 112", "광산과 에너지 이야기를 체험형으로 접하기 좋습니다."],
  ["경북", "과학관", "영천최무선과학관", "경북 영천시 금호읍 창산길 100-29", "과학과 역사 인물을 함께 배울 수 있습니다."],
  ["경북", "과학관", "김천녹색미래과학관", "경북 김천시 혁신6로 31", "기후와 미래 과학 이야기를 쉽게 시작하기 좋습니다."],

  ["경남", "박물관", "국립진주박물관", "경남 진주시 남강로 626-35", "진주성과 함께 역사 전시를 짧게 보기 좋습니다."],
  ["경남", "미술관", "경남도립미술관", "경남 창원시 의창구 용지로 296", "도심 실내 전시로 초등 아이와 보기 좋습니다."],
  ["경남", "미술관", "클레이아크김해미술관", "경남 김해시 진례면 진례로 275-51", "흙과 도자, 건축을 함께 관찰하기 좋습니다."],
  ["경남", "과학관", "창원과학체험관", "경남 창원시 성산구 충혼로72번길 16", "조작 체험을 좋아하는 유아·초등에게 좋습니다."],
  ["경남", "과학관", "사천항공우주박물관", "경남 사천시 사남면 공단1로 78", "비행기와 우주에 관심 있는 아이에게 강한 목적지입니다."],
  ["경남", "자연사관", "고성공룡박물관", "경남 고성군 하이면 자란만로 618", "공룡 발자국과 자연사를 함께 볼 수 있습니다."],

  ["제주", "박물관", "국립제주박물관", "제주 제주시 일주동로 17", "제주 역사와 문화를 여행 중 차분히 보기 좋습니다."],
  ["제주", "미술관", "제주도립미술관", "제주 제주시 1100로 2894-78", "비 오는 날이나 더운 날 실내 전시로 좋습니다."],
  ["제주", "미술관", "제주현대미술관", "제주 제주시 한경면 저지14길 35", "저지문화예술인마을과 함께 둘러보기 좋습니다."],
  ["제주", "과학관", "제주항공우주박물관", "제주 서귀포시 안덕면 녹차분재로 218", "항공기와 우주 전시가 커서 초등 아이에게 반응이 좋습니다."],
  ["제주", "자연사관", "제주민속자연사박물관", "제주 제주시 삼성로 40", "제주의 자연과 생활문화를 한 번에 보기 좋습니다."],
  ["제주", "과학관", "제주별빛누리공원", "제주 제주시 선돌목동길 60", "천문 체험은 운영 시간과 날씨를 반드시 확인하세요."],
];

const slugs = Object.fromEntries(regions.map(([slug, name]) => [name, slug]));
const regionIntro = Object.fromEntries(regions.map(([slug, name, desc]) => [name, desc]));
const kindLabels = {
  "박물관": "박물관",
  "미술관": "미술관",
  "과학관": "과학관",
  "자연사관": "자연사관·생태관",
};
const kindIcons = { "박물관": "🏛", "미술관": "🎨", "과학관": "🔬", "자연사관": "🦕" };

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mapUrl(name, address) {
  return `https://map.kakao.com/?q=${encodeURIComponent(`${name} ${address}`)}`;
}

function header(active = "우리동네") {
  return `<header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">육아도구</a><a href="/local-info/">${active}</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드와 우리동네 육아정보를 연결합니다.</p></div><nav><a href="/about.html">사이트 소개</a><a href="/author.html">작성자 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/update-policy.html">업데이트 정책</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer>`;
}

function relatedLinks(region) {
  return `<h2>함께 보면 좋은 글</h2><div class="related-grid"><a href="/local-info/museum-science.html"><strong>박물관·미술관·과학관 고르는 법</strong><span>아이 연령별로 관람 피로도를 줄이는 방법입니다.</span></a><a href="/parent-guide/rainy-day-home-play.html"><strong>비 오는 날 집콕 놀이</strong><span>전시 방문이 어려운 날의 대안입니다.</span></a><a href="/worksheets/"><strong>엄마표 자료실</strong><span>전시 경험을 활동지와 기록으로 이어갑니다.</span></a><a href="/development-play/"><strong>발달놀이</strong><span>보고 만진 경험을 집 놀이로 연결합니다.</span></a><a href="/#toy-recommendations"><strong>연령별 장난감 추천</strong><span>아이 관심사를 놀이로 확장합니다.</span></a></div>`;
}

function regionPage(regionName) {
  const slug = slugs[regionName];
  const items = places.filter((place) => place[0] === regionName);
  const grouped = Object.keys(kindLabels)
    .map((kind) => [kind, items.filter((place) => place[1] === kind)])
    .filter(([, list]) => list.length);
  const title = `${regionName} 아이와 갈 만한 박물관·미술관·과학관 | 토이포포`;
  const description = `${regionName}에서 아이와 실제로 많이 찾는 박물관, 미술관, 과학관, 자연사관을 부모 관점의 방문 팁과 함께 정리했습니다.`;
  const placeSection = `<section class="real-place-section" data-region-places="true"><h2>${regionName}에서 실제로 갈 만한 대표 전시·체험 장소</h2><p>${regionName} 지역에서 가족 방문 수요가 높고 아이와 목적 있게 다녀오기 좋은 박물관·미술관·과학관·자연사관을 중심으로 골랐습니다. 운영시간, 휴관일, 예약, 주차와 체험 회차는 바뀔 수 있으므로 출발 전 공식 안내를 다시 확인하세요.</p>${grouped.map(([kind, list]) => `<h3>${kindIcons[kind]} ${kindLabels[kind]}</h3><div class="related-grid">${list.map(([, , name, address, tip]) => `<a href="${mapUrl(name, address)}" target="_blank" rel="noopener noreferrer"><strong>${esc(name)}</strong><span>${esc(address)}<br>${esc(tip)}</span></a>`).join("")}</div>`).join("")}<div class="summary-box"><strong>부모 팁</strong><p>처음 가는 장소는 전시 전체를 보려 하기보다 아이가 오래 보는 전시 2~3개에 집중하세요. 전시 관람 뒤에는 아이가 기억한 것 하나를 그림, 블록, 역할놀이, 짧은 기록으로 이어가면 외출이 놀이와 학습으로 자연스럽게 남습니다.</p></div></section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${regionName} 아이와 갈 만한 박물관·미술관·과학관`,
    description,
    mainEntityOfPage: `https://toypoppo.kr/local-info/${slug}/`,
    dateModified: today,
    publisher: { "@type": "Organization", name: "토이포포" },
  };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://toypoppo.kr/local-info/${slug}/"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="https://toypoppo.kr/local-info/${slug}/"><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body>${header()}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">우리동네 육아정보</a> / ${regionName}</p><p class="eyebrow">LOCAL CULTURE GUIDE</p><h1>${regionName} 아이와 갈 만한 박물관·미술관·과학관</h1><p class="lead">${regionName}은 ${regionIntro[regionName]}입니다. 토이포포는 주소만 많은 목록보다 부모가 실제로 목적지를 고르기 쉬운 대표 장소를 우선 정리합니다.</p><div class="summary-box"><strong>${regionName} 전시 나들이 기준</strong><ul><li>영유아는 체류시간 60~90분 안팎, 유모차 이동과 휴식 공간을 먼저 봅니다.</li><li>유아는 버튼을 누르거나 만져보는 체험형 전시가 있는지 확인합니다.</li><li>초등 아이는 관람 전 주제 하나를 정하고 돌아온 뒤 기록이나 활동지로 이어가면 좋습니다.</li></ul></div><h2>연령별 추천 방식</h2><div class="quick-grid"><div><strong>0~12개월</strong><span>조용하고 동선이 짧은 전시, 수유·휴식 공간을 우선합니다.</span></div><div><strong>1~2세</strong><span>만지고 걷고 반복해서 볼 수 있는 체험을 고릅니다.</span></div><div><strong>3~5세</strong><span>공룡, 우주, 동물, 탈것처럼 관심사가 분명한 장소가 좋습니다.</span></div><div><strong>초등</strong><span>역사·과학·미술 주제를 질문과 기록으로 확장합니다.</span></div></div>${placeSection}${relatedLinks(regionName)}</article></main>${footer()}</body></html>`;
}

function mainPage() {
  const regionLinks = regions.map(([slug, name, desc]) => `<a href="/local-info/${slug}/"><strong>${name} 아이와 갈 만한 곳</strong><span>${desc}</span></a>`).join("");
  const categoryCards = [
    ["박물관", "🏛", "역사·생활문화·어린이 체험", "museum"],
    ["미술관", "🎨", "그림, 색, 공간을 경험하는 전시", "art"],
    ["과학관", "🔬", "우주·로봇·기상·에너지 체험", "science"],
    ["자연사관", "🦕", "공룡·화석·동물·생태 전시", "natural"],
  ].map(([label, icon, desc, key], index) => `<button ${index === 0 ? 'class="is-active"' : ""} type="button" data-need="${label}" data-kind="${key}"><span>${icon}</span><strong>${label}</strong><small>${desc}</small></button>`).join("");
  const featured = places.filter(([, , name]) => [
    "국립중앙박물관", "국립과천과학관", "국립부산과학관", "국립중앙과학관", "서대문자연사박물관", "제주항공우주박물관"
  ].includes(name)).map(([region, kind, name, address, tip]) => `<a href="${mapUrl(name, address)}" target="_blank" rel="noopener noreferrer"><strong>${name}</strong><span>${region} · ${kind}<br>${tip}</span></a>`).join("");
  const description = "전국 박물관, 미술관, 과학관, 자연사관 중 아이와 실제로 많이 찾는 대표 장소를 부모 관점으로 정리했습니다.";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: "우리동네 육아정보", url: "https://toypoppo.kr/local-info/", description, inLanguage: "ko-KR" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://toypoppo.kr/" },
        { "@type": "ListItem", position: 2, name: "우리동네 육아정보", item: "https://toypoppo.kr/local-info/" },
      ] },
    ],
  };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>우리동네 아이와 갈 만한 박물관·미술관·과학관 | 토이포포</title><meta name="description" content="${description}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://toypoppo.kr/local-info/"><meta property="og:title" content="우리동네 아이와 갈 만한 박물관·미술관·과학관 | 토이포포"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="https://toypoppo.kr/local-info/"><meta property="og:site_name" content="토이포포"><meta property="og:locale" content="ko_KR"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/local-info-map.css?v=20260630a"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body>${header()}<main class="local-hub"><section class="local-hero"><div><p class="eyebrow">LOCAL CULTURE GUIDE</p><h1>아이와 갈 만한 전시·체험 장소</h1><p>부모들이 실제로 많이 찾는 박물관·미술관·과학관·자연사관을 중심으로 정리했습니다. 지역을 고르고 아이 관심사에 맞는 장소를 찾아보세요.</p><div class="hero-actions"><a class="button primary" href="#regionBrowse">지역 선택</a><button class="button secondary" id="heroCurrent" type="button">내 주변</button><a class="button secondary" href="/local-info/search.html">상세 검색</a></div></div><div class="local-hero__map" aria-hidden="true"><span class="pin pin-a">🏛</span><span class="pin pin-b">🔬</span><span class="pin pin-c">🎨</span><strong>오늘은 어떤 전시를 볼까?</strong><small>박물관 · 미술관 · 과학관 · 자연사관</small></div></section><section class="local-section"><div class="local-section__head"><div><p class="eyebrow">POPULAR PICKS</p><h2>가족 방문이 많은 대표 장소</h2></div><p>전국에서 아이와 방문 수요가 높은 대표 장소를 먼저 보여드립니다.</p></div><div class="related-grid">${featured}</div></section><section class="local-section" id="regionBrowse"><div class="local-section__head"><div><p class="eyebrow">BROWSE BY REGION</p><h2>지역으로 찾기</h2></div><p>시·도를 선택하면 지도와 지역별 추천 글로 이어집니다.</p></div><div class="region-chips" id="regionChips" role="group" aria-label="지역 선택">${regions.map(([slug, name], index) => `<button ${index === 0 ? 'class="is-active"' : ""} type="button" data-region="${name}">${name}</button>`).join("")}</div><div class="region-detail"><label for="localRegion">선택 지역</label><select id="localRegion">${regions.map(([, name]) => `<option>${name}</option>`).join("")}</select><label for="localDistrict">시군구</label><input id="localDistrict" type="search" placeholder="예: 종로구, 과천시 (선택)"><button class="button primary" id="localBtn" type="button">지도 보기</button></div></section><section class="local-section"><div class="local-section__head"><div><p class="eyebrow">CATEGORIES</p><h2>관심사별로 찾기</h2></div><p>아이의 현재 관심사에 맞춰 전시 유형을 고르세요.</p></div><div class="local-category-grid" id="categoryGrid">${categoryCards}</div><select id="localNeed" class="visually-hidden" aria-label="찾는 시설"><option>박물관</option><option>미술관</option><option>과학관</option><option>자연사관</option></select></section><section class="today-picker"><div class="local-section__head"><div><p class="eyebrow">TODAY PICK</p><h2>오늘 아이랑 어디 가지?</h2></div><p>상황에 맞는 전시 유형을 빠르게 고릅니다.</p></div><div class="today-actions" id="todayActions"><button type="button" data-preset="today">오늘 추천</button><button type="button" data-preset="rain">비 오는 날</button><button type="button" data-preset="weekend">주말 추천</button><button type="button" data-preset="free">비용 부담 적게</button><button type="button" data-preset="indoor">실내 추천</button><button type="button" data-preset="elementary">초등 추천</button></div><div class="today-result" id="todayResult"><strong>오늘의 기본 추천</strong><p>처음 방문이라면 체험 회차가 분명한 과학관이나 어린이 전시가 있는 박물관을 고르면 실패 확률이 낮습니다.</p></div></section><section class="local-section"><div class="local-section__head"><div><p class="eyebrow">FIND YOUR FIT</p><h2>아이 연령과 방문 조건</h2></div><p>연령을 선택하면 결과 카드의 부모 팁이 달라집니다.</p></div><div class="filter-row" id="ageFilters" role="group" aria-label="아이 연령"><button class="is-active" type="button" data-age="baby">0~12개월</button><button type="button" data-age="toddler">1~2세</button><button type="button" data-age="preschool">3~4세</button><button type="button" data-age="kindergarten">5~7세</button><button type="button" data-age="elementary">초등</button></div><div class="check-conditions" id="conditionFilters"><label><input type="checkbox" value="주차"> 주차</label><label><input type="checkbox" value="수유실"> 수유실</label><label><input type="checkbox" value="기저귀교환대"> 기저귀교환대</label><label><input type="checkbox" value="유모차"> 유모차</label><label><input type="checkbox" value="예약"> 예약 여부</label><label><input type="checkbox" value="주말운영"> 주말 운영</label></div><p class="condition-note" id="conditionNote">편의시설은 변경될 수 있어 방문 전 공식 홈페이지에서 다시 확인하도록 표시합니다.</p></section><section class="map-panel" aria-labelledby="mapTitle"><div class="map-panel__head"><div><p class="eyebrow">MAP & LIST</p><h2 id="mapTitle">지도와 목록으로 한눈에 보기</h2><p id="mapIntro">서울 박물관을 찾고 있습니다.</p></div><button class="map-current" id="mapCurrent" type="button">내 주변 찾기</button></div><div class="map-split"><div><div id="localMap" class="local-map" aria-label="우리동네 전시·체험 장소 지도"></div><div class="map-state"><span id="mapState">지도를 준비하고 있습니다.</span><small>위치 정보: Kakao Maps</small></div></div><div class="map-list-column"><div class="list-heading"><strong id="listHeading">검색 결과</strong><a href="/local-info/search.html">상세 검색</a></div><div id="mapPlaceList" class="map-place-list"></div></div></div></section><section class="local-section"><div class="local-section__head"><div><p class="eyebrow">REGIONAL GUIDES</p><h2>지역별 부모 가이드</h2></div><p>주소 나열이 아니라 실제 갈 만한 대표 장소와 방문 팁을 함께 정리했습니다.</p></div><div class="link-grid">${regionLinks}</div></section><section class="source-note"><h2>정보 이용 안내</h2><p>토이포포의 장소 추천은 공공데이터, 공식 기관 목록, 지도 검색에서 확인되는 대표 시설을 바탕으로 부모 관점에서 재정리한 큐레이션입니다. 운영시간, 휴관일, 예약, 요금, 편의시설은 바뀔 수 있으므로 방문 전 시설 공식 홈페이지 또는 지도 최신 정보를 확인해 주세요.</p><p><a class="text-link" href="/local-info/data-sources.html">사용 데이터와 제공기관 보기 →</a></p></section></main>${footer()}<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=3fa350c084c36848cbaadf42c19bcfcb&libraries=services&autoload=false&v=20260630"></script><script src="/assets/local-info-map.js?v=20260630-culture1"></script></body></html>`;
}

function categoryPage(kind, slug, title, description) {
  const kinds = Array.isArray(kind) ? kind : [kind];
  const items = places.filter((place) => kinds.includes(place[1]));
  const grouped = regions
    .map(([, name]) => [name, items.filter((place) => place[0] === name)])
    .filter(([, list]) => list.length);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 토이포포</title><meta name="description" content="${description}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://toypoppo.kr/local-info/${slug}.html"><meta property="og:title" content="${title} | 토이포포"><meta property="og:description" content="${description}"><meta property="og:type" content="article"><meta property="og:url" content="https://toypoppo.kr/local-info/${slug}.html"><link rel="stylesheet" href="/assets/styles.css"></head><body>${header()}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">우리동네 육아정보</a> / ${title}</p><p class="eyebrow">CATEGORY GUIDE</p><h1>${title}</h1><p class="lead">${description} 전시 성격과 아이 연령이 맞는지, 예약과 이동 동선이 현실적인지 함께 확인해 주세요.</p><div class="summary-box"><strong>방문 전 체크</strong><ul><li>오늘 운영 여부와 휴관일을 확인합니다.</li><li>어린이 체험은 회차 예약과 보호자 동반 조건을 봅니다.</li><li>처음 방문은 60~120분 정도로 짧게 잡는 편이 좋습니다.</li></ul></div>${grouped.map(([region, list]) => `<h2>${region}</h2><div class="related-grid">${list.map(([, , name, address, tip]) => `<a href="${mapUrl(name, address)}" target="_blank" rel="noopener noreferrer"><strong>${esc(name)}</strong><span>${esc(address)}<br>${esc(tip)}</span></a>`).join("")}</div>`).join("")}${relatedLinks("전국")}</article></main>${footer()}</body></html>`;
}

function updateSitemap() {
  const sitemapPath = "sitemap.xml";
  let sitemap = fs.readFileSync(sitemapPath, "utf8");
  sitemap = sitemap
    .replace(/\n  <url><loc>https:\/\/toypoppo\.kr\/local-info\/kids-library\.html<\/loc>[\s\S]*?<\/url>/, "")
    .replace(/\n  <url><loc>https:\/\/toypoppo\.kr\/local-info\/parks-playgrounds\.html<\/loc>[\s\S]*?<\/url>/, "");
  const urls = [
    "museum-science.html",
    "museums.html",
    "art-museums.html",
    "science-museums.html",
    "natural-history-museums.html",
  ];
  urls.forEach((url) => {
    const full = `https://toypoppo.kr/local-info/${url}`;
    const entry = `  <url><loc>${full}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`;
    const re = new RegExp(`  <url><loc>${full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/loc>[\\s\\S]*?<\\/url>`);
    if (sitemap.includes(full)) sitemap = sitemap.replace(re, entry);
    else sitemap = sitemap.replace("</urlset>", `${entry}\n</urlset>`);
  });
  regions.forEach(([slug]) => {
    const full = `https://toypoppo.kr/local-info/${slug}/`;
    const re = new RegExp(`(<url><loc>${full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/loc><lastmod>)[^<]+(<\\/lastmod>)`);
    sitemap = sitemap.replace(re, `$1${today}$2`);
  });
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
}

function updateSearchPage() {
  const file = "local-info/search.html";
  let html = fs.readFileSync(file, "utf8");
  html = html
    .replace("공공데이터를 이용해 지역별 도서관, 박물관, 공원, 어린이놀이터, 공연, 축제, 관광지와 휴양림을 검색합니다.", "공공데이터와 큐레이션 데이터를 이용해 지역별 박물관, 미술관, 과학관, 자연사관을 검색합니다.")
    .replace("공공데이터를 바탕으로 우리동네 도서관, 박물관, 공원, 놀이터와 가족 행사를 찾아보세요.", "공공데이터와 큐레이션 데이터를 바탕으로 우리동네 박물관, 미술관, 과학관, 자연사관을 찾아보세요.")
    .replace(/우리동네 도서관, 박물관·미술관, 도시공원, 어린이놀이시설, 공연과 축제를 찾습니다\./, "우리동네 박물관·미술관·과학관·자연사관을 찾습니다.")
    .replace(/<select id="dataType" name="type" required>[\s\S]*?<\/select>/, `<select id="dataType" name="type" required>
              <option value="museum">박물관</option>
              <option value="art">미술관</option>
              <option value="science">과학관</option>
              <option value="natural">자연사관</option>
            </select>`)
    .replace("검색 결과가 많으면 시·군·구나 검색어를 함께 입력해 보세요. 문화행사를 선택한 경우에만 날짜 조건을 사용합니다.", "검색 결과가 많으면 시·군·구나 검색어를 함께 입력해 보세요. 운영시간과 예약은 시설 공식 안내를 확인해 주세요.")
    .replace("공공데이터포털 전국 표준데이터, 행정안전부 어린이놀이시설정보서비스, 한국문화정보원 한눈에보는문화정보조회서비스, 기상청 단기예보, 한국환경공단 에어코리아.", "공공데이터포털 전국 박물관미술관정보표준데이터, 국립중앙과학관 연계 과학관 목록, Kakao Maps 장소 검색, 기상청 단기예보, 한국환경공단 에어코리아.");
  fs.writeFileSync(file, html, "utf8");
}

function main() {
  const data = {
    updatedAt: today,
    description: "아이와 실제로 많이 찾는 박물관, 미술관, 과학관, 자연사관 큐레이션",
    items: places.map(([region, kind, title, address, tip]) => ({
      region, kind, title, address, tip, category: kindLabels[kind],
      searchUrl: mapUrl(title, address),
    })),
  };
  fs.mkdirSync("assets/data", { recursive: true });
  fs.writeFileSync("assets/data/family-culture-places.json", JSON.stringify(data, null, 2), "utf8");
  fs.writeFileSync("local-info/index.html", mainPage(), "utf8");
  regions.forEach(([, region]) => {
    const slug = slugs[region];
    fs.mkdirSync(path.join("local-info", slug), { recursive: true });
    fs.writeFileSync(path.join("local-info", slug, "index.html"), regionPage(region), "utf8");
  });
  fs.writeFileSync("local-info/museum-science.html", categoryPage(["박물관", "미술관", "과학관", "자연사관"], "museum-science", "아이와 가기 좋은 박물관·미술관·과학관", "전국 대표 박물관, 미술관, 과학관, 자연사관을 아이 연령과 방문 목적에 맞춰 고르는 기준을 정리했습니다."), "utf8");
  fs.writeFileSync("local-info/museums.html", categoryPage("박물관", "museums", "아이와 가기 좋은 박물관", "역사, 생활문화, 어린이 체험을 중심으로 가족 방문에 적합한 박물관을 정리했습니다."), "utf8");
  fs.writeFileSync("local-info/art-museums.html", categoryPage("미술관", "art-museums", "아이와 가기 좋은 미술관", "그림, 색, 공간, 미디어 전시를 아이와 부담 없이 경험할 수 있는 대표 미술관을 정리했습니다."), "utf8");
  fs.writeFileSync("local-info/science-museums.html", categoryPage("과학관", "science-museums", "아이와 가기 좋은 과학관", "우주, 로봇, 기상, 에너지, 항공 체험을 할 수 있는 대표 과학관을 정리했습니다."), "utf8");
  fs.writeFileSync("local-info/natural-history-museums.html", categoryPage("자연사관", "natural-history-museums", "아이와 가기 좋은 자연사관", "공룡, 화석, 생물, 해양, 자연사를 아이와 관찰하기 좋은 대표 자연사관을 정리했습니다."), "utf8");
  ["local-info/kids-library.html", "local-info/parks-playgrounds.html"].forEach((file) => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
  updateSearchPage();
  updateSitemap();
}

main();
