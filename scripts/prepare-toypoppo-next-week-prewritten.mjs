import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, "drafts", "toypoppo-prewritten");
const queuePath = join(root, "data", "toypoppo-prewritten-queue.json");
mkdirSync(draftDir, { recursive: true });

const startDate = "2026-09-08";
const endDate = "2026-09-14";

const images = {
  play: [
    "/assets/images/blog/first-grade-board-game-family.png",
    "/assets/images/blog/five-year-old-card-play-routine.png",
    "/assets/images/blog/seven-year-old-block-play-family-photo.jpg",
    "/assets/images/blog/after-school-board-game-family-photo.jpg",
    "/assets/images/blog/developmental-toy-selection-guide-hero.jpg",
    "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg",
  ],
  study: [
    "/assets/images/blog/elementary-literacy-home-study-hero.jpg",
    "/assets/images/blog/first-grade-dictation-cover-write.jpg",
    "/assets/images/blog/first-grade-dictation-review-parent.jpg",
    "/assets/images/blog/elementary-online-learning-free-trial-guide-routine.jpg",
    "/assets/images/blog/montessori-prepared-environment-hero.jpg",
  ],
  outing: [
    "/assets/images/places/seoul-lotteworld-aquarium-kids-guide-1.png",
    "/assets/images/places/seodaemun-prison-history-kids-1.png",
    "/assets/images/places/chuncheon-samaksan-cable-car-1.jpg",
    "/assets/images/places/gyeongbokgung-mission-tour-1.jpg",
    "/assets/images/places/busan-f1963-kids-docent-generated-1.jpg",
    "/assets/images/places/jeju-aewol-paint-bubble-kids-1.png",
    "/assets/images/places/yeosu-aquaplanet-kids-guide-1.png",
  ],
};

const products = {
  board6: [
    ["도블 키즈", "https://link.coupang.com/a/goYZVkzsTA", "https://coupa.ng/coV3LA", "5~7세", "그림을 빠르게 비교하는 관찰력", "규칙은 짧고 반응은 빠른 게임을 좋아하는 아이"],
    ["할리갈리 주니어", "https://link.coupang.com/a/goY1IUDa1Y", "https://coupa.ng/coV3L7", "5세 이상", "수 감각과 차례 기다리기", "승패 감정을 가족 안에서 연습해야 하는 아이"],
    ["메모리게임", "https://coupa.ng/coV3Mz", "https://coupa.ng/coV3Mz", "5~7세", "기억력과 집중 유지", "카드 짝 맞추기처럼 반복 놀이를 좋아하는 아이"],
    ["펭귄 얼음깨기", "https://link.coupang.com/a/goY4W9wiOq", "https://coupa.ng/coV3MU", "5세 이상", "손 조절과 긴장 조절", "짧은 시간 안에 웃으며 끝나는 놀이가 필요한 아이"],
    ["루미큐브 키즈", "https://link.coupang.com/a/goY8it3zvo", "https://coupa.ng/coV3NT", "6세 이상", "숫자 배열과 규칙 이해", "숫자 카드를 만지고 순서를 맞추는 아이"],
    ["숫자 보드게임", "https://link.coupang.com/a/goZblXj9l6", "https://coupa.ng/coV3OI", "6세 전후", "연산 전 수 감각", "수학을 문제집보다 놀이로 시작하고 싶은 아이"],
  ],
  toddler: [
    ["역할놀이 세트", "https://coupa.ng/coV3PA", "https://coupa.ng/coV3PA", "24개월 전후", "말놀이와 생활 이해", "인형 먹이기, 병원놀이, 주방놀이를 반복하는 아이"],
    ["큰 블록", "https://link.coupang.com/a/goZfX5ONZA", "https://coupa.ng/coV3P5", "18~36개월", "쌓기와 무너뜨리기", "손으로 크게 잡고 반복 조작하는 놀이를 좋아하는 아이"],
    ["원목 퍼즐", "https://coupa.ng/coV3RD", "https://coupa.ng/coV3RD", "24개월 전후", "모양 인식과 손 조절", "끼우기와 맞추기를 스스로 해보고 싶은 아이"],
    ["아기 그림책 또는 사운드북", "https://coupa.ng/coV3SQ", "https://coupa.ng/coV3SQ", "18~36개월", "어휘 확장과 따라 말하기", "짧은 단어와 소리를 흉내 내기 시작한 아이"],
  ],
  elementary: [
    ["레고 클래식", "https://coupa.ng/coX7Jo", "https://coupa.ng/coX7Jo", "6세 이상", "자유 조립과 공간 구성", "설명서 없이 자기 생각대로 만들고 싶은 아이"],
    ["레고 프렌즈 입문 세트", "https://link.coupang.com/a/gsaTPJM51M", "https://coupa.ng/coX7LT", "6~8세", "상황놀이와 이야기 만들기", "완성 뒤 역할놀이를 이어가는 아이"],
    ["과학실험 키트", "https://link.coupang.com/a/gsbblw4AgL", "https://coupa.ng/coX7Wy", "초등 1~3학년", "관찰력과 원인 결과 이해", "왜 그런지 질문이 많아진 아이"],
    ["미술·만들기 키트", "https://link.coupang.com/a/gsbdomnNkG", "https://coupa.ng/coX7XL", "초등 저학년", "표현력과 완성 경험", "그리기와 만들기를 오래 하는 아이"],
    ["문해력·독서 관련 교구", "https://link.coupang.com/a/gsbh4g4L36", "https://coupa.ng/coX71y", "초등 저학년", "어휘력과 말하기", "읽은 내용을 말로 설명하는 연습이 필요한 아이"],
  ],
};

const mrtItems = [
  ["서울 롯데월드 아쿠아리움 아이와 갈만한 곳: 실내 관람 전 동선 체크", "seoul-lotteworld-aquarium-kids-guide", "서울 롯데월드 아쿠아리움 입장권", "https://myrealt.rip/g1Vaf5", "예매처 확인", "", "", "서울 잠실", "실내 아쿠아리움", "유아·초등 가족", "/assets/images/places/seoul-lotteworld-aquarium-ticket.jpg", ["/assets/images/places/seoul-lotteworld-aquarium-kids-guide-1.png", "/assets/images/places/seoul-lotteworld-aquarium-kids-guide-2.png"]],
  ["춘천 삼악산 케이블카 아이와 타기: 주말 가족 나들이 전 체크할 것", "chuncheon-samaksan-cable-car-kids-guide", "춘천 삼악산 케이블카", "https://myrealt.rip/g1Vd7d", "예매처 확인", "", "", "강원 춘천", "케이블카", "유아·초등 가족", "/assets/images/places/chuncheon-samaksan-cable-car-hero.jpg", ["/assets/images/places/chuncheon-samaksan-cable-car-1.jpg", "/assets/images/places/chuncheon-samaksan-cable-car-2.jpg"]],
  ["경주 국립박물관 아이와 도슨트: 신라 역사 관람을 쉽게 만드는 법", "gyeongju-museum-family-docent-guide", "국립 경주박물관 가족 어린이 도슨트", "https://myrealt.rip/fY9074", "예매처 확인", "4.9", "52", "경북 경주", "박물관 도슨트", "초등 가족", "/assets/images/places/gyeongju-museum-family-tour-ticket.jpg", ["/assets/images/places/gyeongju-museum-family-tour-1.png", "/assets/images/places/gyeongju-museum-family-tour-2.png"]],
  ["부산 F1963 아이와 전시 도슨트: 복합문화공간 관람 전 부모 가이드", "busan-f1963-kids-docent-guide", "부산 F1963 어린이 전시 도슨트", "https://myrealt.rip/fUO3a8", "예매처 확인", "", "", "부산 수영", "전시 도슨트", "초등 가족", "/assets/images/places/busan-f1963-kids-docent-generated-1.jpg", ["/assets/images/places/busan-f1963-kids-docent-generated-2.jpg", "/assets/images/places/busan-f1963-kids-docent-generated-3.jpg"]],
  ["제주 애월 오감 미술체험: 아이와 비오는 날 실내 체험으로 괜찮을까", "jeju-aewol-paint-bubble-kids-guide", "제주 애월 오감체험 퍼포먼스 미술", "https://myrealt.rip/fP465e", "30,000원~", "4.9", "13", "제주 애월", "오감 미술체험", "유아·초등 가족", "/assets/images/places/jeju-aewol-paint-bubble-product-3827459.jpg", ["/assets/images/places/jeju-aewol-paint-bubble-kids-1.png", "/assets/images/places/jeju-aewol-paint-bubble-kids-2.png"]],
  ["여수 아쿠아플라넷 아이와 관람: 실내 여행 코스로 잡기 좋은 이유", "yeosu-aquaplanet-kids-guide", "여수 아쿠아플라넷 입장권", "https://myrealt.rip/fP5Icb", "예매처 확인", "", "", "전남 여수", "아쿠아리움", "유아·초등 가족", "/assets/images/places/yeosu-aquaplanet-ticket.jpg", ["/assets/images/places/yeosu-aquaplanet-kids-guide-1.png", "/assets/images/places/yeosu-aquaplanet-kids-guide-2.png"]],
  ["천안 아이와 공룡 체험: 실내 공룡월드 방문 전 연령별 체크", "cheonan-dinosaur-world-kids-guide", "천안 공룡월드 체험권", "https://myrealt.rip/fULR4d", "예매처 확인", "", "", "충남 천안", "공룡 체험", "유아·초등 가족", "/assets/images/places/cheonan-dinosaur-world-ticket.jpg", ["/assets/images/places/cheonan-dinosaur-world-kids-1.png", "/assets/images/places/cheonan-dinosaur-world-kids-2.png"]],
];

const days = [
  {
    date: "2026-09-08",
    region: ["마포구 아이와 갈만한 곳: 상암·망원 실내외 반나절 코스", "mapo-gu-kids-outing-sangam-mangwon-guide", "마포구는 공원, 도서관, 전시 공간을 짧은 동선으로 묶기 좋아 주말 반나절 코스로 활용하기 좋습니다.", ["월드컵공원", "문화비축기지", "마포중앙도서관", "망원한강공원", "상암 어린이 체험 공간"]],
    education: ["초등 저학년 책 읽기 싫어할 때: 억지 독서 대신 말하기로 시작하는 법", "elementary-kids-hate-reading-speaking-routine", "책 읽기를 싫어하는 아이에게는 분량보다 부모와 나누는 한 문장 대화가 먼저입니다."],
    coupang: ["6세 보드게임 추천 BEST 6: 집중력과 규칙 이해를 키우는 가족게임", "six-year-old-board-games-recommendation-20260908", "6세 아이에게 맞는 보드게임을 관찰력, 수 감각, 순발력, 차례 기다리기 기준으로 정리했습니다.", products.board6],
    season: ["비 오는 주말 아이와 뭐하지: 집콕 놀이와 실내 체험을 나누는 기준", "rainy-weekend-kids-home-indoor-plan", "비 오는 날에는 무조건 실내 체험을 찾기보다 집에서 풀 에너지와 밖에서 쓸 시간을 나눠야 하루가 덜 흔들립니다."],
  },
  {
    date: "2026-09-09",
    region: ["용산구 아이와 갈만한 곳: 박물관·공원·실내 체험 하루 코스", "yongsan-gu-kids-museum-park-guide", "용산은 박물관과 공원 선택지가 가까워 초등 체험학습과 유아 산책을 함께 잡기 좋습니다.", ["국립중앙박물관", "용산가족공원", "전쟁기념관", "어린이박물관", "한강 주변 산책"]],
    education: ["5세 한글 관심 보일 때: 학습지보다 먼저 해볼 집놀이 루틴", "five-year-old-hangeul-interest-home-play", "5세 한글은 쓰기 훈련보다 주변 글자를 발견하고 말로 설명하는 경험에서 자연스럽게 시작됩니다."],
    coupang: ["두돌 장난감 추천 BEST 4: 말놀이와 역할놀이가 시작되는 24개월 선물 기준", "two-year-old-toys-recommendation-20260909", "24개월 아이에게 맞는 역할놀이, 큰 블록, 원목 퍼즐, 그림책·사운드북 선택 기준입니다.", products.toddler],
    season: ["어린이집 하원 후 장난감 싸움 줄이는 법: 30분 놀이 루틴", "after-daycare-toy-fight-routine", "하원 후 장난감 싸움은 장난감 수보다 피곤한 시간대와 선택 방식에서 시작되는 경우가 많습니다."],
  },
  {
    date: "2026-09-10",
    region: ["강서구 아이와 갈만한 곳: 마곡·공항동 실내 나들이 코스", "gangseo-gu-kids-indoor-outing-guide", "강서구는 마곡 실내 공간과 공원, 도서관 동선을 함께 잡으면 날씨 영향을 줄일 수 있습니다.", ["서울식물원", "마곡나루 주변 산책", "강서도서관", "실내 키즈 체험 공간", "공항동 가족 식사 동선"]],
    education: ["초등 1학년 받아쓰기 준비: 틀린 글자보다 소리 듣기가 먼저인 이유", "first-grade-dictation-sound-routine", "초등 1학년 받아쓰기는 많이 쓰는 양보다 소리를 듣고 짧게 다시 말하는 과정이 중요합니다."],
    coupang: ["초등 1학년 보드게임 추천 BEST 5: 문해력·수감각·집중력에 좋은 가족게임", "first-grade-board-games-recommendation-20260910", "초등 1학년에게 맞는 보드게임을 문해력, 수 감각, 규칙 이해, 집중력 기준으로 정리했습니다.", [...products.board6.slice(1), products.elementary[4]]],
    season: ["추석 전 아이 선물 고르기: 장난감보다 오래 쓰는 교구 선택 기준", "chuseok-kids-gift-learning-toy-guide", "명절 선물은 화려한 반응보다 아이가 반복해서 꺼내는 장난감과 교구를 고르는 것이 좋습니다."],
  },
  {
    date: "2026-09-11",
    region: ["분당 아이와 갈만한 곳: 판교·정자동 실내 체험과 공원 코스", "bundang-pangyo-kids-outing-guide", "분당과 판교는 실내 전시, 서점, 공원, 카페 동선을 짧게 잡기 좋아 아이 컨디션에 맞추기 쉽습니다.", ["판교 어린이도서관", "율동공원", "정자동 카페거리", "성남아트센터 주변", "실내 체험 공간"]],
    education: ["7세 수학 준비 놀이: 연산보다 수 감각을 먼저 키우는 방법", "seven-year-old-number-sense-play", "7세 수학 준비는 문제를 빨리 푸는 것보다 수를 나누고 비교하고 설명하는 경험에서 시작됩니다."],
    coupang: ["5세 장난감 추천 BEST 5: 역할놀이·블록·미술놀이를 균형 있게 고르는 법", "five-year-old-toys-recommendation-20260911", "5세 아이에게 맞는 역할놀이, 보드게임, 블록, 미술놀이 키트를 발달 기준으로 정리했습니다.", [products.toddler[0], products.toddler[1], products.board6[0], products.board6[3], products.elementary[3]]],
    season: ["주말 아침 아이와 2시간 보내기: 화면 없이 시작하는 가족 루틴", "weekend-morning-no-screen-family-routine", "주말 아침을 화면으로 시작하면 하루 리듬이 무너지기 쉬워 짧은 놀이와 외출 준비를 나누는 것이 좋습니다."],
  },
  {
    date: "2026-09-12",
    region: ["노원구 아이와 갈만한 곳: 과학관·공원·도서관 가족 코스", "nowon-gu-kids-science-park-guide", "노원구는 과학관과 공원, 도서관을 함께 잡기 좋아 초등 저학년 체험학습형 나들이에 잘 맞습니다.", ["서울시립과학관", "불암산 힐링타운", "중계동 도서관", "노원문화예술회관 주변", "실내 과학 체험 공간"]],
    education: ["초등 저학년 집중력 짧을 때: 10분 놀이 공부로 바꾸는 법", "elementary-short-focus-ten-minute-study-play", "초등 저학년 집중력은 오래 앉아 있는 훈련보다 시작과 끝이 분명한 10분 루틴에서 자랍니다."],
    coupang: ["7세 레고 블록 추천: 초등 입학 전 공간지각력과 집중력을 키우는 조립놀이", "seven-year-old-lego-blocks-recommendation-20260912", "7세 아이에게 맞는 레고 클래식, 레고 프렌즈, 과학 키트, 문해력 교구 선택 기준입니다.", [products.elementary[0], products.elementary[1], products.elementary[2], products.elementary[3], products.elementary[4]]],
    season: ["가을 체험학습 준비법: 아이가 기억하는 나들이로 만드는 질문 12개", "autumn-field-trip-kids-question-guide", "가을 체험학습은 많이 보는 일정보다 아이가 질문하고 기록할 수 있는 작은 목표가 중요합니다."],
  },
  {
    date: "2026-09-13",
    region: ["동탄 아이와 갈만한 곳: 실내 체험·호수공원·도서관 코스", "dongtan-kids-indoor-lake-park-guide", "동탄은 호수공원과 실내 체험, 도서관을 함께 잡으면 유아와 초등 가족 모두 부담이 적습니다.", ["동탄호수공원", "동탄복합문화센터", "어린이도서관", "실내 체험 공간", "가족 식사 동선"]],
    education: ["24개월 말이 느린 아이 놀이: 단어를 재촉하지 않는 언어 자극", "twenty-four-month-late-talker-language-play", "24개월 아이가 말이 적을 때는 단어를 반복시키기보다 생활 장면에서 짧은 말을 붙이는 방식이 좋습니다."],
    coupang: ["24개월 말놀이 장난감 추천: 말문 트이기 전 집에서 쓰기 좋은 놀이도구", "twenty-four-month-language-toys-recommendation-20260913", "24개월 아이의 말놀이에 도움이 되는 역할놀이, 그림책, 사운드북, 퍼즐, 큰 블록 선택 기준입니다.", [products.toddler[3], products.toddler[0], products.toddler[2], products.toddler[1]]],
    season: ["일요일 저녁 아이와 정리 루틴: 월요일 아침 전쟁 줄이는 법", "sunday-evening-kids-cleanup-routine", "일요일 저녁에는 공부를 더 시키기보다 가방, 옷, 장난감, 마음을 함께 정리하는 시간이 필요합니다."],
  },
  {
    date: "2026-09-14",
    region: ["인천 송도 아이와 갈만한 곳: 센트럴파크·실내 체험 코스", "incheon-songdo-kids-central-park-guide", "송도는 넓은 공원과 실내 체험 공간을 함께 잡기 좋아 날씨와 아이 컨디션에 따라 코스를 바꾸기 쉽습니다.", ["송도 센트럴파크", "트리플스트리트", "어린이도서관", "실내 키즈 체험 공간", "해돋이공원"]],
    education: ["형제자매 장난감 싸움 줄이기: 똑같이 나누기보다 순서를 정하는 법", "siblings-toy-fight-sharing-routine", "형제자매 장난감 싸움은 공평하게 나누는 것만으로 해결되지 않아 선택권과 순서 규칙을 함께 정해야 합니다."],
    coupang: ["초등 저학년 생일선물 추천: 오래 쓰는 보드게임·레고·과학키트 고르는 법", "elementary-lower-grade-birthday-gifts-20260914", "초등 1~3학년 생일선물로 오래 쓰기 좋은 보드게임, 레고, 과학실험 키트, 미술 키트, 문해력 교구를 정리했습니다.", [products.board6[4], products.elementary[0], products.elementary[2], products.elementary[3], products.elementary[4]]],
    season: ["초등 방과후 20분 놀이 루틴: 숙제 뒤 화면으로 바로 가지 않는 법", "after-school-twenty-minute-play-routine", "초등 방과후에는 긴 활동보다 숙제 뒤 긴장을 풀고 가족과 연결되는 20분 놀이가 효과적입니다."],
  },
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugDate(slug, date) {
  const suffix = date.replaceAll("-", "");
  return slug.endsWith(suffix) ? slug : `${slug}-${suffix}`;
}

function pickImage(pool, key, offset = 0) {
  const sum = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[(sum + offset) % pool.length];
}

function styleBlock() {
  return `<style>.affiliate-notice{margin:22px 0;padding:14px 16px;border:1px solid #ffd2df;border-radius:12px;background:#fff7fa;color:#6f3d4d;font-size:14px;line-height:1.7}.summary-box,.tip-box{margin:20px 0;padding:18px;border:1px solid #d8eee8;border-radius:14px;background:#f2fffb}.criteria-grid,.place-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.criteria-grid div,.place-grid div{padding:16px;border:1px solid #f1d8e2;border-radius:13px;background:#fffafd}.article-figure{max-width:720px;margin:26px auto;border:1px solid #f1d8e2;border-radius:16px;overflow:hidden;background:#fff}.article-figure img{display:block;width:100%;max-height:520px;object-fit:contain;background:#fff}.article-figure figcaption{padding:10px 14px;color:#766a73;font-size:13px;background:#f5fffb}.product-picks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px 0}.pick-card{display:grid;grid-template-columns:132px 1fr;gap:16px;align-items:start;padding:16px;border:1px solid #f1d8e2;border-radius:14px;background:linear-gradient(135deg,#fffafd,#f5fffb)}.pick-frame{display:grid;place-items:center;min-height:248px;border:1px solid #f0d8e2;border-radius:12px;background:#fff;overflow:hidden}.pick-meta{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.pick-meta span{display:inline-flex;padding:4px 9px;border-radius:999px;background:#fff1f6;color:#c83e72;font-size:12px;font-weight:800}.pick-button,.ticket-card__button{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin-top:10px;border-radius:12px;background:linear-gradient(135deg,#ff4f91,#ff7b61);color:#fff!important;font-weight:950;text-decoration:none;font-size:18px;box-shadow:0 10px 20px rgba(255,79,145,.2)}.ticket-card{display:grid;grid-template-columns:190px 1fr;gap:16px;padding:16px;border:1px solid #ffd2df;border-radius:16px;background:#fff;text-decoration:none;box-shadow:0 10px 24px rgba(112,64,88,.08);margin:24px 0}.ticket-card__media{position:relative;min-height:160px;border-radius:13px;overflow:hidden;background:#fff1f6}.ticket-card__media img{display:block;width:100%;height:160px;object-fit:cover}.ticket-card__status{position:absolute;left:10px;top:10px;padding:5px 10px;border-radius:999px;background:#fff;color:#30242d;font-size:12px;font-weight:900;box-shadow:0 4px 12px rgba(48,36,45,.12)}.ticket-card__body{display:flex;flex-direction:column;gap:6px;min-width:0}.ticket-card__label{font-size:13px;color:#766a73;font-weight:800}.ticket-card__title{font-size:18px;line-height:1.35;color:#30242d;text-decoration:underline;text-underline-offset:2px}.ticket-card__rating{font-weight:900;color:#30242d}.ticket-card__rating .star{color:#f4a000}.ticket-card__rating .count{color:#766a73;font-weight:800}.ticket-card__price{font-size:21px;font-weight:950;color:#30242d}.ticket-card__meta{font-size:13px;color:#766a73}.disclosure{font-size:13px;color:#766a73;line-height:1.7}.mid-products{margin:26px 0;padding:18px;border:1px solid #ffd2df;border-radius:16px;background:#fffafd}.mid-products h2{margin-top:0}@media(max-width:760px){.criteria-grid,.place-grid,.product-picks{grid-template-columns:1fr}.pick-card,.ticket-card{grid-template-columns:1fr}.article-figure img{max-height:420px}.ticket-card__media img{height:190px}.pick-button,.ticket-card__button{font-size:18px}}</style>`;
}

function jsonLd(title, desc, url, date) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: title, description: desc, author: { "@type": "Organization", name: "토이포포" }, publisher: { "@type": "Organization", name: "토이포포", url: "https://toypoppo.kr" }, mainEntityOfPage: url, datePublished: date, dateModified: date, inLanguage: "ko-KR" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: "https://toypoppo.kr/" }, { "@type": "ListItem", position: 2, name: "블로그", item: "https://toypoppo.kr/blog/" }, { "@type": "ListItem", position: 3, name: title, item: url }] },
      { "@type": "FAQPage", mainEntity: ["몇 살부터 활용하기 좋나요?", "처음 시작할 때 가장 중요한 점은 무엇인가요?", "아이가 관심 없어 하면 어떻게 하나요?", "비용을 줄이려면 어떻게 선택해야 하나요?", "부모가 꼭 함께 해야 하나요?"].map((name) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: "아이 나이, 컨디션, 이동 시간, 안전 기준을 함께 고려해 짧게 시작하는 것이 좋습니다." } })) },
    ],
  });
}

function shell({ title, desc, slug, date, category, body }) {
  const url = `https://toypoppo.kr/blog/${slug}.html`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:site_name" content="토이포포"><meta property="og:locale" content="ko_KR"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css">${styleBlock()}<script type="application/ld+json">${jsonLd(title, desc, url, date)}</script></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav></header><main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / ${esc(category)}</p><p class="eyebrow">${esc(category)}</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p>${body}</article></main><footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 아이와 가볼만한 곳을 함께 다루는 부모 정보 플랫폼입니다.</p></div><nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer></body></html>`;
}

function figure(src, alt) {
  return `<figure class="article-figure"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"><figcaption>토이포포 생성형 이미지입니다.</figcaption></figure>`;
}

function related() {
  return `<section><h2>함께 보면 좋은 글</h2><ul><li><a href="/blog/two-year-old-toys-recommendation.html">두돌 장난감 추천</a></li><li><a href="/blog/six-year-old-board-games-recommendation.html">6세 보드게임 추천</a></li><li><a href="/development-play/">월령별 발달놀이</a></li><li><a href="/worksheets/">엄마표 자료실</a></li><li><a href="/local-info/">아이와 가볼만한 곳</a></li><li><a href="/parent-guide/">부모가이드</a></li></ul></section>`;
}

function faq(title) {
  return `<section><h2>FAQ</h2><h3>아이 나이가 조금 어려도 괜찮을까요?</h3><p>${esc(title)}은 표시 연령보다 아이의 체력, 언어 이해, 대기 가능 시간을 함께 보는 것이 좋습니다. 처음에는 짧게 시작하고 아이 반응을 보며 늘리세요.</p><h3>처음 준비할 때 가장 중요한 것은 무엇인가요?</h3><p>많이 준비하는 것보다 오늘의 목적을 하나로 줄이는 것이 중요합니다. 부모가 기준을 잡아야 아이도 덜 피곤합니다.</p><h3>아이가 중간에 싫어하면 어떻게 하나요?</h3><p>끝까지 해내게 하는 것보다 좋은 기억으로 마무리하는 편이 다음 경험으로 이어지기 쉽습니다.</p><h3>비용을 줄이려면 어떻게 고르면 좋나요?</h3><p>한 번 쓰고 끝나는 선택보다 반복 활용이 되는지, 집에서 이어갈 수 있는지, 형제자매가 함께 쓸 수 있는지 확인하세요.</p><h3>부모가 꼭 함께 해야 하나요?</h3><p>처음에는 부모가 짧게 방향을 보여 주고, 이후에는 아이가 자기 방식으로 이어가도록 기다리는 시간이 필요합니다.</p></section>`;
}

function productCards(list, limit = list.length) {
  return `<div class="product-picks">${list.slice(0, limit).map(([name, href, iframe, age, point, fit]) => `<div class="pick-card"><div class="pick-frame"><iframe src="${esc(iframe)}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" title="${esc(name)}"></iframe></div><div><h3>${esc(name)}</h3><p>${esc(point)}을 자연스럽게 경험할 수 있습니다. 새 제품을 오래 설명하기보다 부모가 한 번 보여 주고 아이가 이어 하게 두는 방식이 좋습니다.</p><div class="pick-meta"><span>${esc(age)}</span><span>${esc(point.split("과")[0])}</span><span>추천 후보</span></div><p><strong>이런 아이에게 추천</strong><br>${esc(fit)}</p><p><strong>구매 전 체크</strong><br>사용 연령, 작은 부품, 보관 방식, 부모가 함께할 시간을 확인하세요.</p><a class="pick-button" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener">상품 보러가기</a></div></div>`).join("")}</div>`;
}

function midCoupang(title, list = products.board6.slice(0, 2)) {
  return `<section class="mid-products"><h2>${esc(title)}</h2><p class="disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 아래 상품은 글 주제와 연결되는 놀이·준비물 예시입니다.</p>${productCards(list, 2)}</section>`;
}

function regionPost(day) {
  const [titleBase, baseSlug, desc, places] = day.region;
  const dateSlug = slugDate(baseSlug, day.date);
  const title = `${titleBase} | 2026년 가을 기준`;
  const body = `${figure(pickImage(images.outing, title), `${titleBase} 가족 나들이 이미지`)}<section><h2>이 지역을 아이와 가기 좋은 이유</h2><p>${esc(desc)} 아이와 외출할 때는 유명한 곳을 많이 찍는 것보다 이동을 줄이고, 실내와 야외를 섞고, 아이가 쉴 수 있는 시간을 남기는 편이 만족도가 높습니다.</p><p>특히 유아는 이동과 대기 시간이 길면 장소가 좋아도 금방 지치고, 초등 아이는 단순 산책보다 관찰할 거리와 질문할 거리가 있을 때 기억에 오래 남습니다.</p><div class="summary-box"><strong>핵심 요약</strong><br>오전에는 체험 하나, 오후에는 산책이나 도서관처럼 부담이 낮은 장소 하나만 더하는 구성이 가장 안정적입니다.</div></section><section><h2>추천 동선 후보</h2><div class="place-grid">${places.map((place) => `<div><strong>${esc(place)}</strong><span>아이 컨디션에 따라 체류 시간을 40~90분으로 잡고, 방문 전 휴무와 운영 시간을 확인하세요.</span></div>`).join("")}</div></section>${figure(pickImage(images.outing, title, 2), `${titleBase} 실내외 코스 이미지`)}<section><h2>연령별로 다르게 보는 법</h2><p>3~5세 아이는 장소 설명보다 “찾아보기”가 잘 맞습니다. 색깔, 모양, 소리, 냄새처럼 눈에 보이는 단서를 주면 아이가 스스로 관찰합니다. 6~8세 아이는 왜 이런 공간이 생겼는지, 사람들은 이곳을 어떻게 쓰는지 묻는 질문이 좋습니다.</p><p>초등 저학년은 집에 돌아온 뒤 한 문장 기록을 남기면 나들이가 체험학습으로 이어집니다. “오늘 가장 오래 기억나는 장면은?” 정도면 충분합니다.</p></section>${midCoupang("외출 후 집에서 이어가기 좋은 놀이", [products.board6[0], products.toddler[1]])}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}를 찾는 부모에게 필요한 것은 긴 목록보다 우리 아이에게 맞는 순서입니다. 장소는 하나 줄이고, 질문은 하나 남기고, 집에서 다시 말할 시간을 만들면 검색해서 찾은 정보가 실제 좋은 하루로 이어집니다.</p></section>`;
  return { slot: "region", title, slug: dateSlug, desc, html: shell({ title, desc, slug: dateSlug, date: day.date, category: "지역별 아이와 갈만한 곳", body }) };
}

function educationPost(day) {
  const [titleBase, baseSlug, desc] = day.education;
  const dateSlug = slugDate(baseSlug, day.date);
  const title = `${titleBase} | 2026년 가을 기준`;
  const body = `${figure(pickImage(images.study, title), `${titleBase} 가정 놀이 이미지`)}<section><h2>부모가 먼저 알아야 할 것</h2><p>${esc(desc)} 아이 발달은 한 번에 눈에 보이는 성과보다 매일 비슷한 방식으로 반복되는 경험에서 자랍니다. 그래서 이 시기의 집공부와 발달놀이는 오래 앉히는 것이 아니라 시작과 끝이 편안한 루틴을 만드는 일이 먼저입니다.</p><p>부모가 “해야 할 것”을 늘리면 아이는 부담을 느끼기 쉽습니다. 대신 짧은 활동 하나를 정하고, 아이가 스스로 다시 해보고 싶어 하는 순간을 남겨 주세요.</p></section><section><h2>집에서 바로 해볼 루틴</h2><div class="criteria-grid"><div><strong>1단계 관찰</strong><span>아이가 지금 반복하는 행동을 먼저 봅니다. 던지기, 맞추기, 말 따라 하기, 쌓기에는 모두 이유가 있습니다.</span></div><div><strong>2단계 짧은 제안</strong><span>“이번엔 이렇게 해볼까?” 정도의 제안만 하고 아이가 바꿔 놀 시간을 줍니다.</span></div><div><strong>3단계 말 붙이기</strong><span>정답 설명보다 아이 행동을 문장으로 말해 주세요. “높이 쌓았네”, “다시 해보는구나”처럼 충분합니다.</span></div><div><strong>4단계 마무리</strong><span>정리까지 놀이에 포함하면 다음 날 다시 시작하기 쉬워집니다.</span></div></div></section>${figure(pickImage(images.study, title, 2), `${titleBase} 부모 대화 이미지`)}<section><h2>주의할 점</h2><p>아이 교육 글에서 가장 조심할 부분은 불안을 키우는 표현입니다. 말이 늦다, 집중이 짧다, 책을 싫어한다는 모습이 곧 문제라는 뜻은 아닙니다. 다만 부모가 환경과 방식을 조금 바꾸면 아이가 더 편하게 참여할 수 있습니다.</p><p>발달이 걱정될 정도로 일상생활이 어렵거나 언어, 움직임, 사회성에서 뚜렷한 어려움이 지속된다면 전문가 상담을 함께 고려하세요.</p></section>${midCoupang("집에서 반복하기 좋은 놀이 도구", [products.toddler[2], products.elementary[4]])}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}의 핵심은 빠르게 잘하게 만드는 것이 아니라 아이가 다시 시도할 수 있는 분위기를 만드는 것입니다. 부모의 짧은 말, 기다림, 반복 가능한 환경이 아이에게 가장 오래 남습니다.</p></section>`;
  return { slot: "education", title, slug: dateSlug, desc, html: shell({ title, desc, slug: dateSlug, date: day.date, category: "아이 교육·발달", body }) };
}

function coupangPost(day) {
  const [titleBase, baseSlug, desc, list] = day.coupang;
  const dateSlug = slugDate(baseSlug, day.date);
  const title = `${titleBase} | 2026년 가을 기준`;
  const body = `<div class="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>${figure(pickImage(images.play, title), `${titleBase} 놀이 이미지`)}<section><h2>먼저 선택 기준부터 보세요</h2><p>${esc(desc)} 장난감 추천 글은 제품을 많이 나열하는 것보다 우리 아이가 실제로 어떻게 놀 수 있는지 확인하는 것이 중요합니다. 같은 보드게임이나 블록도 아이 나이, 승패 감정, 손 조절, 부모 참여 시간에 따라 만족도가 달라집니다.</p><p>새 장난감을 고를 때는 유행보다 반복성, 정리 난이도, 형제자매와 함께 쓸 수 있는지, 부모가 짧게 도와줄 수 있는지를 먼저 보세요.</p></section><section><h2>추천 제품 후보</h2>${productCards(list)}</section>${figure(pickImage(images.play, title, 3), `${titleBase} 가족 놀이 이미지`)}<section><h2>실패를 줄이는 구매 전 체크</h2><div class="criteria-grid"><div><strong>표시 연령</strong><span>제품 연령보다 아이의 실제 조작 능력과 작은 부품 위험을 함께 봅니다.</span></div><div><strong>놀이 시간</strong><span>처음에는 10~20분 안에 끝낼 수 있는 구성이 좋습니다.</span></div><div><strong>정리 부담</strong><span>부품 수가 많으면 부모 피로가 커져 장난감이 다시 나오지 않을 수 있습니다.</span></div><div><strong>확장성</strong><span>말놀이, 수놀이, 역할놀이로 이어질 수 있는 제품은 오래 씁니다.</span></div></div></section>${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}을 고를 때 가장 좋은 기준은 “아이가 내일도 다시 꺼낼까?”입니다. 가격보다 반복성, 화려함보다 부모와 나눌 대화, 완성보다 다시 시도할 여지가 있는 제품을 고르면 실패가 줄어듭니다.</p></section>`;
  return { slot: "coupang", title, slug: dateSlug, desc, html: shell({ title, desc, slug: dateSlug, date: day.date, category: "장난감 추천", body }) };
}

function mrtPost(day, index) {
  const [titleBase, baseSlug, product, href, price, rating, reviews, region, type, age, ticketImg, generated] = mrtItems[index];
  const dateSlug = slugDate(baseSlug, day.date);
  const title = `${titleBase} | 2026년 가을 기준`;
  const desc = `${region} ${type}을 아이와 방문하기 전 추천 연령, 동선, 대화 질문, 예매 전 체크 포인트를 정리했습니다.`;
  const ratingText = rating ? `<span class="ticket-card__rating"><span class="star">★</span> ${esc(rating)} <span class="count">(후기 ${esc(reviews)}개)</span></span>` : `<span class="ticket-card__rating">평점·후기수는 예매 페이지에서 확인</span>`;
  const ticket = `<a class="ticket-card" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener noreferrer"><div class="ticket-card__media"><img src="${esc(ticketImg)}" alt="${esc(product)} 예매 대표 이미지" loading="lazy"><span class="ticket-card__status">예매 가능</span></div><div class="ticket-card__body"><span class="ticket-card__label">${esc(region)} · ${esc(type)}</span><strong class="ticket-card__title">${esc(product)}</strong>${ratingText}<span class="ticket-card__price">${esc(price)}</span><span class="ticket-card__meta">${esc(age)} · 회차와 취소 규정 확인</span><span class="ticket-card__button">일정·가격 확인하기</span></div></a><p class="disclosure">가격, 평점, 후기 수, 회차, 포함 사항과 환불 규정은 예매 페이지 표시 기준이며 변경될 수 있습니다. 결제 전 현재 예매 페이지에서 다시 확인하세요.</p>`;
  const body = `<p class="affiliate-notice">이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며, 예약 시 토이포포가 일정액의 수수료를 받을 수 있습니다.</p>${ticket}${figure(generated[0], `${product} 아이와 체험 이미지`)}<section><h2>아이와 가기 전 먼저 볼 기준</h2><p>${esc(region)}에서 ${esc(type)}을 고를 때는 상품명보다 아이가 버틸 수 있는 시간, 이동 난이도, 체험 뒤에 남길 이야기를 먼저 봐야 합니다. 특히 처음 가는 장소라면 “꼭 다 봐야 한다”보다 한 가지 장면을 깊게 보는 편이 좋습니다.</p><p>초등 아이는 해설과 질문이 있을 때 만족도가 높고, 유아는 쉬는 장소와 화장실, 이동 시간이 더 중요합니다. 방문 전 아이에게 오늘의 질문을 하나만 정해 주세요.</p></section><section><h2>아이에게 던지기 좋은 질문</h2><ul><li>오늘 가장 먼저 보고 싶은 것은 무엇일까?</li><li>이 장소는 왜 사람들이 찾아올까?</li><li>네가 설명한다면 어떤 장면을 고를까?</li><li>집에 가서 다시 그려보고 싶은 것은 무엇일까?</li><li>다음에 온다면 무엇을 더 보고 싶을까?</li></ul></section>${figure(generated[1], `${product} 방문 후 활동 이미지`)}<section><h2>예매 전 체크리스트</h2><ul><li>운영일, 시작 시간, 소요 시간, 집결 장소를 확인합니다.</li><li>아이 연령과 체력에 맞는 회차인지 봅니다.</li><li>날씨, 주차, 대중교통, 식사 동선을 함께 확인합니다.</li><li>후기와 평점은 참고하되 우리 아이 성향을 우선합니다.</li><li>취소 규정과 포함·불포함 사항은 결제 직전 다시 확인합니다.</li></ul></section>${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}은 단순한 외출보다 아이가 보고 질문하고 집에서 다시 말할 때 오래 남습니다. 예매 전에는 최신 조건을 확인하고, 방문 뒤에는 아이가 고른 한 장면을 짧게 기록해 보세요.</p></section>`;
  return { slot: "mrt", title, slug: dateSlug, desc, html: shell({ title, desc, slug: dateSlug, date: day.date, category: "마이리얼트립 가족체험", body }) };
}

function seasonPost(day) {
  const [titleBase, baseSlug, desc] = day.season;
  const dateSlug = slugDate(baseSlug, day.date);
  const title = `${titleBase} | 2026년 가을 기준`;
  const body = `${figure(pickImage(images.play, title), `${titleBase} 이미지`)}<section><h2>상황형 글은 기준이 먼저입니다</h2><p>${esc(desc)} 부모가 급하게 검색하는 순간일수록 “어디 갈까”, “뭘 사야 하지”보다 아이 컨디션과 남은 시간을 먼저 봐야 합니다. 그래야 돈을 쓰고도 피곤한 하루가 되는 일을 줄일 수 있습니다.</p><p>토이포포는 상황형 글에서 선택지를 많이 던지기보다, 오늘 바로 판단할 수 있는 기준을 먼저 정리합니다. 기준이 있어야 체험, 장난감, 집놀이를 자연스럽게 고를 수 있습니다.</p></section><section><h2>오늘 바로 쓰는 판단 기준</h2><div class="criteria-grid"><div><strong>아이 에너지</strong><span>몸을 움직이고 싶은 날인지, 조용히 쉬어야 하는 날인지 먼저 봅니다.</span></div><div><strong>부모 체력</strong><span>부모가 지친 날에는 준비와 정리가 쉬운 활동을 고릅니다.</span></div><div><strong>비용</strong><span>체험권이나 장난감은 반복 활용 가능성을 함께 봅니다.</span></div><div><strong>마무리</strong><span>집에 와서 한 문장으로 정리할 수 있으면 아이 기억에 더 오래 남습니다.</span></div></div></section>${midCoupang("상황에 맞춰 함께 볼 만한 놀이 도구", [products.board6[2], products.elementary[3]])}${figure(pickImage(images.play, title, 4), `${titleBase} 가족 루틴 이미지`)}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}의 목적은 하루를 완벽하게 채우는 것이 아니라 아이와 부모 모두 덜 지치게 좋은 기억을 남기는 것입니다. 오늘의 기준을 하나만 정하면 선택이 훨씬 쉬워집니다.</p></section>`;
  return { slot: "season", title, slug: dateSlug, desc, html: shell({ title, desc, slug: dateSlug, date: day.date, category: "시즌·상황별 육아", body }) };
}

const queue = existsSync(queuePath)
  ? JSON.parse(readFileSync(queuePath, "utf8"))
  : { mode: "prewritten-first", note: "자동화는 이 큐에서 날짜와 슬롯이 맞는 완성 원고를 먼저 발행합니다. status가 ready인 글만 발행됩니다.", items: [] };

queue.items = (queue.items || []).filter((item) => item.date < startDate || item.date > endDate || item.status === "published");
let nextOrder = queue.items.reduce((max, item) => Math.max(max, Number(item.order) || 0), -1) + 1;
const created = [];

days.forEach((day, index) => {
  const posts = [regionPost(day), mrtPost(day, index), educationPost(day), coupangPost(day), seasonPost(day)];
  posts.forEach((post) => {
    const source = `drafts/toypoppo-prewritten/${post.slug}.html`;
    const target = `blog/${post.slug}.html`;
    writeFileSync(join(root, source), post.html, "utf8");
    queue.items.push({ order: nextOrder++, date: day.date, slot: post.slot, status: "ready", title: post.title, description: post.desc, source, target, url: `https://toypoppo.kr/${target}` });
    created.push({ date: day.date, slot: post.slot, title: post.title, target });
  });
});

writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
console.log(`Prepared ${created.length} ToyPoppo prewritten articles from ${startDate} to ${endDate}.`);
for (const item of created) {
  console.log(`${item.date} ${item.slot} ${item.target}`);
}
