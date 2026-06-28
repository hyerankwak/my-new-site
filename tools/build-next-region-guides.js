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
