const fs = require("fs");
const path = require("path");

const regions = [
  {
    slug: "gwangju", name: "광주", theme: "문화예술·도서관·공원",
    lead: "광주는 도심 안에서 도서관, 전시와 공원을 비교적 짧은 동선으로 묶기 좋습니다. 아이와 외출할 때는 많은 프로그램을 채우기보다 오전에 실내 한 곳, 오후에 가까운 공원처럼 리듬을 단순하게 잡아보세요.",
    focus: "그림과 음악을 어렵게 설명하기보다 아이가 고른 색, 표정과 소리를 함께 말해보세요. 3세 전에는 짧은 감상과 자유로운 움직임이 충분하고, 5세 이후에는 마음에 든 작품 하나를 그림으로 다시 표현해볼 수 있습니다.",
    checks: ["공연과 전시는 대상 연령과 관람 시간을 확인합니다.", "영유아는 조명이 어둡거나 소리가 큰 공간에서 반응을 살핍니다.", "도심 공원은 주차보다 대중교통 동선이 편한지 비교합니다."],
    need: "어린이 박물관", age: "preschool",
  },
  {
    slug: "ulsan", name: "울산", theme: "생태공원·과학관·박물관",
    lead: "울산은 강과 바다, 생태공원과 산업·과학 체험을 함께 접하기 좋습니다. 야외 공간은 넓어 보이는 거리보다 실제 입구와 주차장, 화장실 사이의 이동을 먼저 확인해야 영유아와 편하게 다녀올 수 있습니다.",
    focus: "자연과 산업 시설을 본 뒤에는 정답을 설명하기보다 움직임을 관찰하게 해주세요. 물이 흐르는 방향, 큰 기계의 모양, 새가 머무는 위치처럼 아이가 발견한 것을 말로 받아주면 현장 경험이 오래갑니다.",
    checks: ["해안과 강변은 바람과 체감온도를 확인합니다.", "넓은 공원은 그늘과 화장실 위치를 먼저 봅니다.", "과학 체험은 아이가 직접 조작할 수 있는 연령인지 확인합니다."],
    need: "어린이 공원", age: "toddler",
  },
  {
    slug: "sejong", name: "세종", theme: "도서관·도시공원·가족체험",
    lead: "세종은 생활권 안에서 도서관과 공원을 연결하기 좋은 도시입니다. 멀리 이동하지 않아도 짧은 산책, 그림책과 놀이터를 한 일정으로 묶을 수 있어 낮잠 시간이 일정한 영유아 가족에게 특히 편합니다.",
    focus: "도서관에서 읽은 책의 장면을 공원에서 찾아보거나, 산책 중 본 나무와 새를 다시 책에서 찾는 식으로 실내외 경험을 연결해 보세요. 거창한 학습보다 같은 대상을 다른 장소에서 다시 만나는 경험이 중요합니다.",
    checks: ["도서관 프로그램은 예약 시작일과 보호자 동반 여부를 봅니다.", "호수와 물가 산책에서는 안전선을 지킵니다.", "자전거와 보행 동선이 분리되어 있는지 확인합니다."],
    need: "어린이도서관", age: "baby",
  },
  {
    slug: "gangwon", name: "강원", theme: "숲·자연·박물관",
    lead: "강원은 숲과 자연 체험 선택지가 많지만 지역 간 이동 시간이 길고 날씨 변화가 빠릅니다. 하루에 여러 시군을 오가기보다 숙소나 집에서 가까운 한 권역을 정하고 자연 한 곳과 실내 한 곳만 준비하는 편이 좋습니다.",
    focus: "숲에서는 많은 이름을 외우게 하기보다 냄새, 바람, 바닥의 감촉을 느끼게 해주세요. 자연물을 함부로 채집하지 않고 사진이나 그림으로 남기면 집에서도 색 찾기와 분류 놀이로 이어갈 수 있습니다.",
    checks: ["산간 지역은 출발 전 기온과 강수, 도로 상황을 확인합니다.", "영유아는 경사가 완만하고 짧은 동선을 선택합니다.", "야외 일정 옆에 가까운 박물관이나 도서관을 저장합니다."],
    need: "어린이 공원", age: "kindergarten",
  },
  {
    slug: "chungbuk", name: "충북", theme: "호수·과학관·생태공원",
    lead: "충북은 호수와 생태공원, 과학 체험을 함께 찾기 좋지만 시군 사이 이동이 길 수 있습니다. 한 지역 안에서 야외 한 곳과 가까운 실내 한 곳을 묶어 아이가 차 안에서 지치지 않도록 계획하세요.",
    focus: "물과 숲을 볼 때 이름을 많이 알려주기보다 색, 소리와 움직임을 관찰하게 해주세요. 돌아온 뒤 공 굴리기나 물의 흐름 놀이로 경험을 이어갈 수 있습니다.",
    checks: ["호수 주변은 난간과 보행 안전을 확인합니다.", "산간 지역은 기온과 도로 상황을 살핍니다.", "체험시설은 운영 회차와 예약 여부를 봅니다."],
    need: "어린이 과학관", age: "preschool",
  },
  {
    slug: "chungnam", name: "충남", theme: "바다·역사·가족체험",
    lead: "충남은 서해안과 역사 체험을 한 권역에서 만날 수 있습니다. 갯벌과 바다 일정은 물때와 날씨 영향을 많이 받으므로 무리하게 고정하지 말고 가까운 박물관이나 도서관을 대안으로 준비하세요.",
    focus: "바다와 역사 유적에서는 아이가 직접 발견한 모양과 흔적을 이야기하게 해주세요. 자연물을 가져오기보다 사진과 그림으로 남기는 습관도 함께 알려줄 수 있습니다.",
    checks: ["해안 방문 전 물때와 출입 통제를 확인합니다.", "갯벌 체험은 씻을 곳과 여벌 옷을 준비합니다.", "역사시설은 유모차 이동과 경사를 확인합니다."],
    need: "어린이 박물관", age: "kindergarten",
  },
  {
    slug: "jeonbuk", name: "전북", theme: "전통문화·박물관·공원",
    lead: "전북은 전통문화와 역사, 넓은 공원을 연결하기 좋습니다. 한옥과 유적지는 바닥이 고르지 않은 곳이 있어 영유아와 갈 때는 유모차 동선과 쉬어갈 공간부터 확인하는 편이 좋습니다.",
    focus: "전통문화를 설명할 때 어려운 용어보다 집, 옷, 음식과 놀이처럼 아이 일상과 닿는 부분에서 시작하세요. 본 무늬를 블록이나 그림으로 다시 만드는 활동도 좋습니다.",
    checks: ["한옥과 유적지의 돌길·계단을 확인합니다.", "체험 프로그램은 연령과 보호자 동반 여부를 봅니다.", "여름에는 그늘과 휴식 공간을 먼저 찾습니다."],
    need: "어린이 박물관", age: "preschool",
  },
  {
    slug: "jeonnam", name: "전남", theme: "바다·숲·생태체험",
    lead: "전남은 바다와 섬, 숲과 생태 체험이 다양하지만 이동 거리가 길고 기상 변화의 영향을 받습니다. 하루에 여러 장소를 채우기보다 숙소나 집 가까운 한 지역에서 천천히 경험하세요.",
    focus: "영유아는 모래, 나뭇잎과 바람 같은 감각을 짧게 경험하는 것만으로 충분합니다. 큰 아이는 관찰한 생물을 그림이나 분류 놀이로 이어가되 채집 규정을 지켜주세요.",
    checks: ["배편과 섬 일정은 결항 가능성을 확인합니다.", "해안은 바람과 햇빛을 함께 대비합니다.", "숲길은 경사와 화장실 거리를 확인합니다."],
    need: "어린이 공원", age: "toddler",
  },
  {
    slug: "gyeongbuk", name: "경북", theme: "역사유적·박물관·자연",
    lead: "경북은 역사 유적과 박물관, 자연 공간이 넓게 흩어져 있습니다. 아이와 갈 때는 유명 장소의 수보다 이동 시간을 줄이고 한 가지 시대나 주제에 집중하는 편이 기억에 오래 남습니다.",
    focus: "유적에서는 정답을 외우게 하기보다 옛사람은 어디서 자고 무엇을 먹었을지 상상하게 해주세요. 초등 아이는 지도에서 이동 경로를 직접 찾아보는 활동도 할 수 있습니다.",
    checks: ["야외 유적의 그늘과 휴식 공간을 확인합니다.", "지역 간 이동 시간을 실제 교통 기준으로 봅니다.", "박물관 휴관일과 어린이 체험 운영일을 확인합니다."],
    need: "어린이 박물관", age: "elementary",
  },
  {
    slug: "gyeongnam", name: "경남", theme: "바다·과학체험·도시공원",
    lead: "경남은 해안과 도시공원, 과학·항공 체험까지 선택 폭이 넓습니다. 지역 사이 거리가 있어 아이 관심사 하나를 중심으로 권역을 좁히고, 귀가 시간의 교통 상황까지 포함해 계획하세요.",
    focus: "탈것과 기계에 관심이 있는 아이에게는 크기, 움직임과 쓰임을 비교하게 해주세요. 영유아는 넓은 전시보다 안전하게 걷고 쉬는 공간이 있는지가 더 중요합니다.",
    checks: ["해안과 야외시설은 강풍 여부를 확인합니다.", "대형 체험시설은 회차와 대기 시간을 봅니다.", "주말 귀가 정체와 휴게 시간을 고려합니다."],
    need: "어린이 과학관", age: "kindergarten",
  },
];

const nav = '<header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">육아도구</a><a href="/local-info/">우리동네</a></nav></header>';

for (const region of regions) {
  const directory = path.join("local-info", region.slug);
  fs.mkdirSync(directory, { recursive: true });
  const checks = region.checks.map((item) => `<li>${item}</li>`).join("");
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${region.name} 아이와 갈 만한 곳 | ${region.theme} 가이드</title><meta name="description" content="${region.name}에서 아이와 갈 만한 ${region.theme}을 연령, 이동과 날씨 기준으로 고르는 부모 가이드입니다."><link rel="canonical" href="https://toypoppo.kr/local-info/${region.slug}/"><meta property="og:title" content="${region.name} 아이와 갈 만한 곳 | 토이포포"><meta property="og:description" content="${region.name}의 육아 장소를 부모 관점으로 찾아보세요."><meta property="og:type" content="article"><meta property="og:url" content="https://toypoppo.kr/local-info/${region.slug}/"><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${region.name} 아이와 갈 만한 곳","mainEntityOfPage":"https://toypoppo.kr/local-info/${region.slug}/","publisher":{"@type":"Organization","name":"토이포포"}}</script></head><body>${nav}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">우리동네 육아정보</a> / ${region.name}</p><p class="eyebrow">LOCAL GUIDE</p><h1>${region.name} 아이와 갈 만한 곳: ${region.theme}</h1><p class="lead">${region.lead}</p><div class="summary-box"><strong>${region.name} 외출 전 확인</strong><ul>${checks}</ul></div><h2>아이의 속도로 경험하기</h2><p>${region.focus}</p><p><a class="button primary" href="/local-info/?region=${encodeURIComponent(region.name)}&need=${encodeURIComponent(region.need)}&age=${region.age}#mapTitle">${region.name} 장소 지도 보기</a></p><h2>연령별 이용 팁</h2><div class="quick-grid"><div><strong>0~12개월</strong><span>낮잠과 수유 사이에 60분 안팎으로 짧게 방문합니다.</span></div><div><strong>1~2세</strong><span>걷고 만지는 탐색을 중심으로 안전 동선을 살핍니다.</span></div><div><strong>3~4세</strong><span>직접 고르고 조작할 기회를 충분히 줍니다.</span></div><div><strong>5세~초등</strong><span>관찰 주제를 정하고 그림이나 기록으로 이어갑니다.</span></div></div><h2>방문 후 집에서 이어가기</h2><p>현장에서 본 것을 모두 설명하려 하지 말고 아이가 먼저 말한 대상 하나를 골라 그림책, 블록, 그림이나 역할놀이로 이어가 보세요. 장소 방문이 단순한 외출을 넘어 아이의 반복 놀이로 남습니다.</p><h2>함께 보면 좋은 글</h2><div class="related-grid"><a href="/parent-guide/outing-checklist.html"><strong>외출 준비 체크리스트</strong><span>연령별 준비물을 확인합니다.</span></a><a href="/development-play/"><strong>발달놀이</strong><span>외출 경험을 집 놀이로 잇습니다.</span></a><a href="/#toy-recommendations"><strong>장난감 추천</strong><span>아이 관심사에 맞는 놀이를 찾습니다.</span></a><a href="/local-info/search.html"><strong>공공데이터 상세 검색</strong><span>지역 시설을 직접 비교합니다.</span></a></div></article></main><footer class="site-footer"><strong>토이포포</strong><nav><a href="/about.html">사이트 소개</a><a href="/editorial-policy.html">편집 원칙</a><a href="/privacy.html">개인정보처리방침</a><a href="/contact.html">문의하기</a></nav></footer></body></html>`;
  fs.writeFileSync(path.join(directory, "index.html"), html, "utf8");
}

console.log(`Created ${regions.length} regional guides.`);
