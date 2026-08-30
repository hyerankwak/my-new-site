import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, "drafts", "toypoppo-prewritten");
const queuePath = join(root, "data", "toypoppo-prewritten-queue.json");

mkdirSync(draftDir, { recursive: true });

const commonLinks = [
  ["/blog/two-year-old-toys-recommendation.html", "두돌 장난감 추천"],
  ["/blog/six-year-old-board-games-recommendation.html", "6세 보드게임 추천"],
  ["/blog/developmental-toy-selection-guide.html", "발달 장난감 고르는 기준"],
  ["/blog/toy-rotation-four-week-plan-ages-3-5.html", "장난감 로테이션 4주표"],
  ["/development-play/", "월령별 발달놀이"],
  ["/montessori/", "몬테소리 가이드"],
  ["/worksheets/", "엄마표 자료실"],
  ["/local-info/", "아이와 가볼만한 곳"]
];

const products = [
  ["도블 키즈", "https://link.coupang.com/a/goYZVkzsTA", "https://coupa.ng/coV3LA", "5~7세", "관찰력, 순발력, 집중력", "그림을 빠르게 찾는 놀이가 가능한 아이"],
  ["할리갈리 주니어", "https://link.coupang.com/a/goY1IUDa1Y", "https://coupa.ng/coV3L7", "5세 이상", "수 감각, 반응속도, 차례 기다리기", "가족과 규칙 놀이를 시작하는 아이"],
  ["메모리게임", "https://coupa.ng/coV3Mz", "https://coupa.ng/coV3Mz", "5~7세", "기억력, 관찰력, 집중 유지", "카드 찾기와 짝 맞추기를 좋아하는 아이"],
  ["펭귄 얼음깨기", "https://link.coupang.com/a/goY4W9wiOq", "https://coupa.ng/coV3MU", "5세 이상", "손 조절, 규칙 이해, 긴장 조절", "간단한 차례 놀이를 좋아하는 아이"],
  ["루미큐브 키즈", "https://link.coupang.com/a/goY8it3zvo", "https://coupa.ng/coV3NT", "6세 이상", "숫자 배열, 규칙 이해, 전략적 사고", "숫자 카드를 만지고 배열하는 놀이에 관심 있는 아이"],
  ["숫자 보드게임", "https://link.coupang.com/a/goZblXj9l6", "https://coupa.ng/coV3OI", "6세 전후", "숫자 감각, 연산 준비, 규칙 놀이", "수학을 문제집보다 놀이로 시작하고 싶은 아이"],
  ["역할놀이 세트", "https://coupa.ng/coV3PA", "https://coupa.ng/coV3PA", "24개월 전후", "말놀이, 상상놀이, 생활 이해", "인형 먹이기와 병원놀이를 반복하는 아이"],
  ["큰 블록", "https://link.coupang.com/a/goZfX5ONZA", "https://coupa.ng/coV3P5", "18~36개월", "구성력, 손 조절, 반복 놀이", "쌓고 무너뜨리는 놀이를 좋아하는 아이"],
  ["원목 퍼즐", "https://coupa.ng/coV3RD", "https://coupa.ng/coV3RD", "24개월 전후", "손 조절, 모양 인식, 문제 해결", "맞추기와 끼우기 놀이에 관심이 생긴 아이"],
  ["아기 그림책 또는 사운드북", "https://coupa.ng/coV3SQ", "https://coupa.ng/coV3SQ", "18~36개월", "어휘 확장, 따라 말하기, 집중 듣기", "짧은 단어와 소리를 따라 하는 아이"],
  ["레고 클래식", "https://coupa.ng/coX7Jo", "https://coupa.ng/coX7Jo", "6세 이상", "창의 구성, 색 분류, 자유 조립", "설명서 없이도 만들기를 해보고 싶은 아이"],
  ["레고 프렌즈 입문 세트", "https://link.coupang.com/a/gsaTPJM51M", "https://coupa.ng/coX7LT", "6~8세", "상황놀이, 구성력, 표현력", "완성 후 이야기 놀이를 이어가는 아이"],
  ["과학실험 키트", "https://link.coupang.com/a/gsbblw4AgL", "https://coupa.ng/coX7Wy", "초등 1~3학년", "관찰력, 원인과 결과, 탐구심", "왜 그런지 묻는 질문이 늘어난 아이"],
  ["미술·만들기 키트", "https://link.coupang.com/a/gsbdomnNkG", "https://coupa.ng/coX7XL", "초등 저학년", "표현력, 완성 경험, 소근육", "그리기와 만들기를 오래 하는 아이"],
  ["문해력·독서 관련 교구", "https://link.coupang.com/a/gsbh4g4L36", "https://coupa.ng/coX71y", "초등 저학년", "어휘력, 읽기 흥미, 말하기", "책 내용을 말로 설명하는 연습이 필요한 아이"]
];

const mrt = [
  ["서울 아이와 박물관 도슨트 추천: 서대문형무소 역사관람 전 알아둘 이야기", "seodaemun-history-museum-docent-kids-guide", "서대문형무소 역사관체험 도슨트 투어", "https://myrealt.rip/g1Vaf5", "24,900원", "5.0", "38", "서울 서대문", "역사 도슨트", "초등 추천"],
  ["경주 아이와 야간투어 추천: 첨성대·동궁과 월지를 해설로 보는 법", "gyeongju-night-history-tour-kids-guide", "경주 첨성대 동궁과 월지 해설 야경 투어", "https://myrealt.rip/fY8t06", "예매처 확인", "5.0", "49", "경북 경주", "야간 역사투어", "초등 가족"],
  ["부산 해운대 아이와 가볼만한 곳: 블루라인파크와 해변 산책 코스", "busan-haeundae-blueline-park-kids-guide", "부산 해운대 블루라인파크", "https://myrealt.rip/faLFc0", "예매처 확인", "4.7", "516", "부산 해운대", "해변 코스", "유아·초등 가족"],
  ["부산 요트투어 아이와 타도 괜찮을까: 광안리 야경 전 체크할 것", "busan-gwangalli-yacht-tour-family-guide", "부산요트투어 해운대 광안리 더베이101 퍼블릭", "https://myrealt.rip/faLO47", "예매처 확인", "5.0", "80", "부산", "요트 체험", "초등 이상 권장"],
  ["제주 쇠소깍 배낚시 체험: 아이와 2시간 낚시 전 준비물과 멀미 체크", "jeju-soesokkak-fishing-kids-guide", "제주의 강태공은 나야나, 쇠소깍 배낚시 체험 2시간", "https://myrealt.rip/fkdicc", "예매처 확인", "4.8", "209", "제주 서귀포", "배낚시 체험", "초등 가족"],
  ["대전 아이와 실내 가볼만한 곳: 엑스포아쿠아리움 사이언스 나이트 캠프", "daejeon-expo-aquarium-science-night-camp-guide", "대전 엑스포아쿠아리움 사이언스 나이트 캠프", "https://myrealt.rip/fKEI9e", "예매처 확인", "4.9", "232", "대전", "아쿠아리움 캠프", "유아·초등 가족"],
  ["강화도 아이와 숲체험 추천: 트리하우스 공방 체험 전 알아둘 것", "ganghwa-treehouse-forest-workshop-kids-guide", "돌아자씨 트리하우스 숲체험&공방체험", "https://myrealt.rip/erRf45", "120,000원", "5.0", "566", "인천 강화", "숲·공방 체험", "유아·초등 가족"]
];

const days = [
  { date: "2026-08-31", region: ["중랑구 아이와 갈만한 곳: 실내 전시·공원·도서관 하루 코스", "jungnang-gu-kids-indoor-outing-guide", "중랑구에서 아이와 하루를 보내려면 이동 시간을 줄이고 실내와 야외를 섞는 구성이 좋습니다."], education: ["5세 집중력 놀이 루틴: 장난감 없이도 15분 몰입하는 방법", "five-year-old-focus-play-no-toy-routine", "5세 아이의 집중력은 오래 앉아 있는 시간이 아니라 한 가지 활동을 스스로 이어가는 힘에서 시작됩니다."], coupang: ["초등 1학년 보드게임 추천 BEST 5: 문해력·수감각·집중력을 키우는 가족게임", "first-grade-board-games-recommendation", "초등 1학년에게 맞는 보드게임을 문해력, 수감각, 규칙 이해, 집중력 기준으로 정리했습니다.", [0,1,2,4,5]], season: ["비오는 날 아이와 집콕 놀이 12가지: 유아부터 초등까지 지루하지 않게 보내는 법", "rainy-day-kids-home-play-guide", "비 오는 날에는 에너지를 풀 활동과 차분히 마무리하는 활동을 함께 준비해야 하루가 덜 흔들립니다."] },
  { date: "2026-09-01", region: ["송파구 아이와 갈만한 곳: 잠실·석촌호수·실내 체험 코스", "songpa-gu-kids-outing-jamsil-guide", "송파구는 실내외 동선 선택지가 많아 아이 나이와 날씨에 맞춘 반나절 코스로 나누기 좋습니다."], education: ["24개월 역할놀이 시작법: 말과 생활 이해를 잇는 15분 루틴", "twenty-four-month-pretend-play-language-routine", "24개월 역할놀이는 말이 많은 아이만 하는 활동이 아니라 생활 장면을 자기 방식으로 다시 이해하는 과정입니다."], coupang: ["5세 장난감 추천 BEST 5: 역할놀이·자석블록·미술놀이를 균형 있게 고르는 법", "five-year-old-toys-recommendation", "5세 아이에게 맞는 자석블록, 역할놀이, 유아 보드게임, 미술놀이 키트, 레고 듀플로 선택 기준을 정리했습니다.", [6,10,13,2,3]], season: ["초등 방과후 집에서 하는 보드게임 루틴: 숙제 후 20분 가족놀이", "after-school-board-game-family-routine", "초등 저학년은 숙제 뒤 바로 화면으로 넘어가기보다 짧은 가족놀이로 하루를 정리하면 좋습니다."] },
  { date: "2026-09-02", region: ["성남 아이와 갈만한 곳: 판교·분당 실내외 체험 코스", "seongnam-bundang-pangyo-kids-outing-guide", "성남과 분당·판교는 교통, 전시, 도서관, 공원 동선을 묶기 좋아 주말 가족 코스로 활용하기 좋습니다."], education: ["초등 저학년 문해력 키우는 집공부 방법: 읽고 말하고 한 문장 쓰기", "elementary-lower-literacy-home-routine", "초등 저학년 문해력은 문제집 양보다 읽은 내용을 자기 말로 설명하는 경험에서 자랍니다."], coupang: ["7세 레고 블록 추천: 초등 입학 전 집중력과 공간지각력을 키우는 조립놀이", "seven-year-old-lego-blocks-recommendation", "7세 아이에게 맞는 레고 클래식, 레고 시티, 레고 프렌즈, 자석블록, 소형 조립 블록 선택 기준입니다.", [10,11,12,14,5]], season: ["주말 오전 아이와 뭐하지: 짧게 다녀오는 반나절 놀이 코스 짜는 법", "weekend-morning-kids-half-day-plan", "주말 오전은 욕심내지 않고 한 가지 목적만 정하면 외출 피로와 부모 스트레스를 줄일 수 있습니다."] },
  { date: "2026-09-03", region: ["고양시 아이와 갈만한 곳: 일산 실내 전시와 호수공원 코스", "goyang-ilsan-kids-outing-guide", "고양·일산은 실내 전시와 넓은 공원 동선을 함께 잡기 좋아 유아와 초등 가족 모두 활용하기 쉽습니다."], education: ["7개월 아기 기기 연습 놀이: 억지로 밀지 않고 움직임을 돕는 방법", "seven-month-crawling-practice-play", "7개월 아기의 기기 준비는 빨리 앞으로 나아가는 것보다 몸을 돌리고 팔로 버티는 경험부터 시작됩니다."], coupang: ["24개월 말놀이 장난감 추천: 말문 트이기 전 집에서 쓰기 좋은 놀이도구", "twenty-four-month-language-toys-recommendation", "24개월 아이 말놀이에 도움이 되는 사운드북, 낱말카드, 역할놀이 세트, 동물 피규어, 전화기 장난감 선택 기준입니다.", [9,6,8,7,13]], season: ["가을 나들이 전 아이 준비물 체크: 많이 챙기지 않고 실패 줄이는 법", "autumn-family-outing-kids-check-guide", "가을 가족 나들이는 준비물이 많을수록 편한 것이 아니라 아이 컨디션과 동선을 먼저 보는 편이 좋습니다."] },
  { date: "2026-09-04", region: ["수원 아이와 갈만한 곳: 화성·박물관·실내 체험 하루 코스", "suwon-kids-history-museum-outing-guide", "수원은 역사 장소와 실내 전시를 묶으면 초등 아이에게 체험학습형 나들이가 되기 좋습니다."], education: ["몬테소리 장난감 꼭 사야 할까: 집에 있는 물건으로 시작하는 법", "montessori-toys-need-or-not-home-guide", "몬테소리는 교구를 사는 교육이 아니라 아이가 스스로 해볼 수 있게 환경을 정리하는 관점입니다."], coupang: ["초등 저학년 생일선물 추천: 오래 쓰는 보드게임·레고·과학키트 고르는 법", "elementary-lower-grade-birthday-gifts", "초등 1~3학년 생일선물로 오래 쓰기 좋은 보드게임, 레고, 과학실험 키트, 미술 키트, 문해력 교구 선택 기준을 정리했습니다.", [0,10,12,13,14]], season: ["어린이집 하원 후 30분 놀이: 부모가 지친 날에도 가능한 루틴", "after-daycare-30-minute-play-routine", "하원 후 놀이는 길게 놀아주는 것보다 아이가 긴장을 풀고 하루를 마무리하는 흐름을 만드는 것이 중요합니다."] },
  { date: "2026-09-05", region: ["강남구 아이와 갈만한 곳: 실내 전시·도서관·키즈 코스 정리", "gangnam-gu-kids-indoor-outing-guide", "강남구 아이 동선은 대중교통과 주차, 실내 대기 시간을 함께 고려해야 만족도가 높습니다."], education: ["보드게임이 아이 발달에 좋은 이유: 규칙·집중력·감정조절을 키우는 가족놀이", "board-games-child-development-benefits", "보드게임이 아이의 규칙 이해, 집중력, 수감각, 언어 표현, 감정조절에 어떤 도움을 주는지 부모 관점으로 정리했습니다."], coupang: ["6세 보드게임 추천 BEST 6: 규칙 이해와 집중력을 키우는 가족게임", "six-year-old-board-games-weekend-picks", "6세 아이가 가족과 함께 시작하기 좋은 보드게임을 규칙 이해, 수감각, 관찰력, 감정 조절 기준으로 정리했습니다.", [0,1,2,3,4,5]], season: ["초등 저학년 일요일 저녁 루틴: 월요일 전쟁 줄이는 준비법", "sunday-evening-elementary-routine", "일요일 저녁 루틴은 공부를 더 시키는 시간이 아니라 월요일 아침을 덜 흔들리게 만드는 생활 정리입니다."] },
  { date: "2026-09-06", region: ["부산 아이와 갈만한 곳: 해운대·광안리 가족 체험 코스", "busan-kids-family-outing-course-guide", "부산 가족 나들이는 바다 풍경만 보지 말고 아이 연령에 맞는 체험과 휴식 동선을 함께 잡아야 합니다."], education: ["초등 1학년 공부 습관 잡는 법: 매일 20분만 흔들리지 않게", "first-grade-study-habit-20-minute-routine", "초등 1학년 공부 습관은 오래 앉히는 것이 아니라 같은 시간에 짧게 시작하고 끝내는 경험에서 만들어집니다."], coupang: ["초등 입학 전 교구 추천: 수감각·문해력·집중력 도구 고르는 법", "before-elementary-learning-tools-guide", "초등 입학 전 아이에게 필요한 교구를 수감각, 문해력, 집중력, 손 조절 기준으로 정리했습니다.", [5,14,2,12,13]], season: ["가족 보드게임의 날 만드는 법: 주말마다 다시 꺼내는 놀이 습관", "family-board-game-day-routine", "가족 보드게임은 특별한 날만 하는 이벤트보다 같은 요일에 짧게 반복할 때 아이가 더 안정적으로 즐깁니다."] }
];

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function jsonLd(title, slug, date, desc) {
  const url = `https://toypoppo.kr/blog/${slug}.html`;
  return JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Article","headline":title,"description":desc,"author":{"@type":"Organization","name":"토이포포"},"publisher":{"@type":"Organization","name":"토이포포","url":"https://toypoppo.kr"},"mainEntityOfPage":url,"datePublished":date,"dateModified":date,"inLanguage":"ko-KR"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://toypoppo.kr/"},{"@type":"ListItem","position":2,"name":"블로그","item":"https://toypoppo.kr/blog/"},{"@type":"ListItem","position":3,"name":title,"item":url}]},{"@type":"FAQPage","mainEntity":["몇 살부터 활용하기 좋나요?","처음 시작할 때 가장 중요한 점은 무엇인가요?","아이가 관심 없어 하면 어떻게 하나요?","비용을 줄이려면 어떻게 선택해야 하나요?","부모가 꼭 함께 해야 하나요?"].map((q)=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":"아이 나이, 컨디션, 이동 시간, 안전 기준을 함께 고려해 짧게 시작하는 것이 좋습니다."}}))}]});
}

function styles() {
  return `<style>.affiliate-notice{margin:22px 0;padding:14px 16px;border:1px solid #ffd2df;border-radius:12px;background:#fff7fa;color:#6f3d4d;font-size:14px;line-height:1.7}.summary-box,.tip-box{margin:20px 0;padding:18px;border:1px solid #d8eee8;border-radius:14px;background:#f2fffb}.criteria-grid,.place-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.criteria-grid div,.place-grid div{padding:16px;border:1px solid #f1d8e2;border-radius:13px;background:#fffafd}.article-figure{max-width:720px;margin:26px auto;border:1px solid #f1d8e2;border-radius:16px;overflow:hidden;background:#fff}.article-figure img{display:block;width:100%;max-height:520px;object-fit:contain;background:#fff}.article-figure figcaption{padding:10px 14px;color:#766a73;font-size:13px;background:#f5fffb}.product-picks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px 0}.pick-card{display:grid;grid-template-columns:132px 1fr;gap:16px;align-items:start;padding:16px;border:1px solid #f1d8e2;border-radius:14px;background:linear-gradient(135deg,#fffafd,#f5fffb)}.pick-frame{display:grid;place-items:center;min-height:248px;border:1px solid #f0d8e2;border-radius:12px;background:#fff;overflow:hidden}.pick-meta{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.pick-meta span{display:inline-flex;padding:4px 9px;border-radius:999px;background:#fff1f6;color:#c83e72;font-size:12px;font-weight:800}.pick-button,.ticket-button{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:48px;margin-top:10px;border-radius:11px;background:linear-gradient(135deg,#ff4f91,#ff7b61);color:#fff!important;font-weight:900;text-decoration:none;font-size:17px}.ticket-card{display:grid;grid-template-columns:180px 1fr;gap:16px;padding:16px;border:1px solid #ffd2df;border-radius:16px;background:#fff;text-decoration:none;box-shadow:0 10px 24px rgba(112,64,88,.08)}.ticket-card__media{position:relative;min-height:150px;border-radius:13px;overflow:hidden;background:#fff1f6}.ticket-card__media img{display:block;width:100%;height:150px;object-fit:cover}.ticket-card__status{position:absolute;left:10px;top:10px;padding:5px 10px;border-radius:999px;background:#fff;color:#30242d;font-size:12px;font-weight:900;box-shadow:0 4px 12px rgba(48,36,45,.12)}.ticket-card__body{display:flex;flex-direction:column;gap:6px;min-width:0}.ticket-card__label{font-size:13px;color:#766a73;font-weight:800}.ticket-card__title{font-size:17px;line-height:1.35;color:#30242d;text-decoration:underline;text-underline-offset:2px}.ticket-card__rating{font-weight:900;color:#30242d}.ticket-card__rating .star{color:#f4a000}.ticket-card__rating .count{color:#766a73;font-weight:800}.ticket-card__price{font-size:20px;font-weight:950;color:#30242d}.ticket-card__meta{font-size:13px;color:#766a73}.ticket-card__button{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin-top:8px;border-radius:12px;background:linear-gradient(135deg,#ff4f91,#ff7b61);color:#fff!important;font-weight:950;text-decoration:none;font-size:18px;box-shadow:0 10px 20px rgba(255,79,145,.22)}.rating{color:#f4a000;font-weight:900}.price{font-size:20px;font-weight:950;color:#30242d}@media(max-width:760px){.criteria-grid,.place-grid,.product-picks{grid-template-columns:1fr}.pick-card,.ticket-card{grid-template-columns:1fr}.article-figure img{max-height:420px}.pick-button,.ticket-button{font-size:18px}.ticket-card__media img{height:190px}}</style>`;
}

function header(title, slug, date, desc) {
  const url = `https://toypoppo.kr/blog/${slug}.html`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:site_name" content="토이포포"><meta property="og:locale" content="ko_KR"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css">${styles()}<script type="application/ld+json">${jsonLd(title, slug, date, desc)}</script></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 아이와 가볼만한 곳을 함께 다루는 부모 정보 플랫폼입니다.</p></div><nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer></body></html>`;
}

function figure(label, hint) {
  const imagePool = [
    "/assets/images/blog/seongnam-bundang-pangyo-kids-outing-photo.jpg",
    "/assets/images/blog/busan-haeundae-blueline-park-family-photo.jpg",
    "/assets/images/blog/seven-year-old-block-play-family-photo.jpg",
    "/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg",
    "/assets/images/blog/after-school-board-game-family-photo.jpg",
    "/assets/images/blog/songpa-jamsil-kids-outing-family-photo.jpg",
    "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg",
    "/assets/images/blog/weekend-morning-half-day-family-photo.jpg"
  ];
  const key = `${label} ${hint}`;
  const index = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0) % imagePool.length;
  const src = imagePool[index];
  return `<figure class="article-figure"><img src="${src}" alt="${esc(label)} 참고 이미지" loading="lazy"><figcaption>토이포포 생성형 이미지입니다.</figcaption></figure>`;
}

function related() {
  return `<section><h2>함께 보면 좋은 글</h2><ul>${commonLinks.slice(0, 6).map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul></section>`;
}

function faq(title) {
  return `<section><h2>FAQ</h2>${["몇 살부터 활용하기 좋나요?","처음 시작할 때 가장 중요한 점은 무엇인가요?","아이가 관심 없어 하면 어떻게 하나요?","비용을 줄이려면 어떻게 선택해야 하나요?","부모가 꼭 함께 해야 하나요?"].map((q) => `<h3>${esc(q)}</h3><p>${esc(title)}은 아이의 현재 관심과 컨디션을 함께 보며 시작하는 것이 좋습니다. 처음에는 짧고 쉬운 방식으로 경험하게 하고, 아이가 다시 찾는지 관찰한 뒤 다음 단계로 넓히세요.</p>`).join("")}</section>`;
}

function infoHtml(title, slug, date, desc, category) {
  return `${header(title, slug, date, desc)}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / ${esc(category)}</p><p class="eyebrow">${esc(category)}</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p>${figure(category, desc)}<section><h2>먼저 기준을 정해야 하는 이유</h2><p>부모가 가장 많이 놓치는 부분은 ‘좋은 곳’이나 ‘좋은 놀이’를 먼저 찾는 것입니다. 실제로는 우리 아이의 나이, 오늘의 컨디션, 이동 시간, 부모의 체력, 마무리 루틴이 더 중요합니다. 같은 장소와 같은 놀이도 낮잠 전후에 따라 완전히 다르게 느껴질 수 있습니다.</p><p>그래서 토이포포 글은 단순 추천 목록보다 부모가 바로 판단할 수 있는 기준을 먼저 정리합니다. 기준이 있으면 광고 문구나 후기 숫자에 흔들리지 않고 우리 집에 맞는 선택을 할 수 있습니다.</p><div class="summary-box"><strong>핵심 요약</strong><br>오늘 한 가지 목적만 정하세요. 많이 보는 것보다 아이가 하나를 오래 기억하는 경험이 더 중요합니다.</div></section><section><h2>실제로 적용하는 방법</h2><div class="criteria-grid"><div><strong>연령</strong><span>영유아는 이동과 휴식, 초등은 질문과 기록을 더 중요하게 봅니다.</span></div><div><strong>시간</strong><span>처음 경험은 60~90분 안에 끝나는 구성이 실패가 적습니다.</span></div><div><strong>부모 말</strong><span>설명보다 “무엇이 보였어?” 같은 짧은 질문이 좋습니다.</span></div><div><strong>마무리</strong><span>집에 와서 그림, 한 문장, 스티커 기록으로 이어가면 기억에 남습니다.</span></div></div></section>${figure("활동 예시", "아이와 관찰하고 대화하는 장면")}<section><h2>부모 체크리스트</h2><ul><li>오늘 아이에게 남기고 싶은 경험을 한 문장으로 정합니다.</li><li>이동 시간과 대기 시간을 합쳐 아이가 버틸 수 있는지 봅니다.</li><li>간식, 물, 여벌 옷, 휴식 장소를 미리 확인합니다.</li><li>아이가 지루해하면 끝까지 밀지 않고 핵심 하나만 보고 나옵니다.</li><li>집에 와서 오늘 기억난 장면을 말하거나 그리게 합니다.</li></ul></section>${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(title)}의 핵심은 더 많이 하는 것이 아니라 아이가 이해할 수 있는 크기로 줄이는 것입니다. 부모가 기준을 잡고 짧게 반복하면 외출, 놀이, 학습 모두 아이에게 안정적인 경험으로 남습니다.</p></section></article></main>${footer()}`;
}

function coupangHtml(title, slug, date, desc, indexes) {
  const cards = indexes.map((i) => products[i % products.length]).map(([name, href, iframe, age, point, fit]) => `<div class="pick-card"><div class="pick-frame"><iframe src="${esc(iframe)}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" title="${esc(name)}"></iframe></div><div><h3>${esc(name)}</h3><p>${esc(point)}을 자연스럽게 경험할 수 있습니다. 한 번에 오래 하게 하기보다 짧게 성공하는 경험부터 시작하세요.</p><div class="pick-meta"><span>${esc(age)}</span><span>${esc(point.split(",")[0])}</span><span>추천 후보</span></div><p><strong>이런 아이에게 추천</strong><br>${esc(fit)}</p><p><strong>주의할 점</strong><br>작은 부품, 사용 연령, 정리 방법을 먼저 확인하세요.</p><a class="pick-button" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener">상품 보러가기</a></div></div>`).join("");
  return `${header(title, slug, date, desc)}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / 장난감 추천</p><p class="eyebrow">Coupang toy guide</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)} 제품을 먼저 보기보다 아이의 현재 발달과 놀이 습관을 기준으로 확인하세요.</p><div class="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>${figure("장난감 선택 기준", desc)}<section><h2>이 시기에 필요한 놀이 기준</h2><p>장난감 추천 글에서 가장 중요한 것은 상품 개수보다 선택 기준입니다. 아이가 지금 무엇을 반복하는지, 어떤 활동에서 오래 머무는지, 부모가 어느 정도 함께할 수 있는지에 따라 좋은 제품은 달라집니다.</p><p>특히 영유아는 안전성과 반복성이 먼저이고, 유아와 초등 저학년은 규칙 이해, 말로 설명하기, 가족과 함께하는 지속성이 중요합니다.</p></section><section><h2>구매 전 확인할 5가지</h2><div class="criteria-grid"><div><strong>사용 연령</strong><span>표시 연령과 아이의 실제 조작 능력을 함께 봅니다.</span></div><div><strong>반복성</strong><span>한 번 완성하고 끝나는지, 여러 방식으로 다시 놀 수 있는지 확인합니다.</span></div><div><strong>정리</strong><span>부품 수와 보관 방법은 부모 피로도와 바로 연결됩니다.</span></div><div><strong>확장성</strong><span>말놀이, 수놀이, 역할놀이로 이어질 여지가 있는지 봅니다.</span></div></div></section><section><h2>추천 제품 후보</h2><p>제품을 고를 때는 인기 순위보다 아이가 어떤 방식으로 놀 수 있는지, 부모가 어떻게 확장해 줄 수 있는지를 먼저 보세요.</p><div class="product-picks">${cards}</div></section>${related()}${faq(title)}<section><h2>마무리</h2><p>좋은 장난감은 아이가 다시 꺼내 자기 방식으로 바꿔 노는 장난감입니다. 가격이나 유행보다 아이의 반복 행동과 부모가 함께할 수 있는 시간을 기준으로 고르면 실패가 줄어듭니다.</p></section></article></main>${footer()}`;
}

function mrtHtml(item, date) {
  const [title, slug, product, href, price, rating, reviews, region, type, age] = item;
  const desc = `${region} ${type}을 아이와 방문하기 전 추천 연령, 대화 질문, 준비물, 예매 전 체크 포인트를 정리했습니다.`;
  const ticketImages = {
    "seodaemun-history-museum-docent-kids-guide": "/assets/images/places/seodaemun-prison-history-kids-ticket.jpg",
    "gyeongju-night-history-tour-kids-guide": "/assets/images/places/gyeongju-night-history-tour-ticket.jpg",
    "busan-haeundae-blueline-park-kids-guide": "/assets/images/places/busan-haeundae-blueline-park-ticket.jpg",
    "busan-gwangalli-yacht-tour-family-guide": "/assets/images/places/busan-yachtda-public-tour-ticket.jpg",
    "jeju-soesokkak-fishing-kids-guide": "/assets/images/places/jeju-soesokkak-fishing-experience-ticket.jpg",
    "daejeon-expo-aquarium-science-night-camp-guide": "/assets/images/places/daejeon-aquarium-night-camp-ticket.jpg",
    "ganghwa-treehouse-forest-workshop-kids-guide": "/assets/images/places/ganghwa-tom-treehouse-forest-workshop-hero.webp"
  };
  const ticketImg = ticketImages[slug] ?? `/assets/images/places/${slug.replace(/-kids-guide$/, "").replace(/-family-guide$/, "")}-ticket.jpg`;
  const ticketCard = `<a class="ticket-card ticket-card--deal" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener noreferrer"><div class="ticket-card__media"><img src="${esc(ticketImg)}" alt="${esc(product)} 예매 대표 이미지" loading="lazy"><span class="ticket-card__status">예매 가능</span></div><div class="ticket-card__body"><span class="ticket-card__label">${esc(region)} · ${esc(type)}</span><strong class="ticket-card__title">${esc(product)}</strong><span class="ticket-card__rating"><span class="star">★</span> ${esc(rating)} <span class="count">(후기 ${esc(reviews)}개)</span></span><span class="ticket-card__price">${esc(price)}</span><span class="ticket-card__meta">${esc(age)} · 방문 전 조건 확인</span><span class="ticket-card__button">일정·가격 확인하기</span></div></a>`;
  return `${header(title, slug, date, desc)}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/local-info/">아이와 가볼만한 곳</a> / ${esc(region)}</p><p class="eyebrow">Family place guide</p><h1>${esc(title)}</h1><p class="lead">${esc(region)}에서 아이와 체험을 고를 때는 장소명보다 아이가 무엇을 보고, 어떤 질문을 하고, 집에 와서 어떤 활동으로 이어갈 수 있는지를 먼저 보면 좋습니다.</p><p class="affiliate-notice">이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며, 예약 시 토이포포가 일정액의 수수료를 받을 수 있습니다.</p>${ticketCard}${figure(region, product)}<section><h2>가기 전 아이에게 해주면 좋은 말</h2><p>가기 전에는 설명을 길게 하기보다 오늘의 질문을 하나만 정하세요. “오늘은 무엇이 가장 오래 기억날까?”, “왜 이런 장소가 생겼을까?”, “내가 그 시대 사람이라면 무엇이 궁금했을까?”처럼 답이 하나가 아닌 질문이 좋습니다.</p><p>이런 질문은 아이가 관람을 수동적으로 따라가는 대신 스스로 찾고 비교하게 만듭니다. 초등 아이에게는 짧은 기록지를 주고, 유아에게는 그림 하나를 골라 말하게 하면 충분합니다.</p></section><section><h2>하브루타 질문 10가지</h2><ul><li>이 장소에서 가장 먼저 보고 싶은 것은 무엇일까?</li><li>왜 사람들이 이곳을 찾아올까?</li><li>옛날 사람과 지금 우리의 생활은 무엇이 다를까?</li><li>너라면 이 장면을 어떻게 설명할까?</li><li>가장 신기한 물건이나 풍경은 무엇일까?</li><li>이곳을 만든 사람은 어떤 마음이었을까?</li><li>집에 와서 다시 해보고 싶은 활동은 무엇일까?</li><li>친구에게 한 가지만 소개한다면 무엇을 말할까?</li><li>오늘 새로 알게 된 단어는 무엇일까?</li><li>다음에 다시 온다면 무엇을 더 보고 싶을까?</li></ul></section>${figure("관람 후 활동", "집에서 그림과 한 문장 기록으로 이어가기")}<section><h2>방문 전 체크</h2><ul><li>가격, 일정, 회차, 취소 규정은 예매 페이지에서 최신 정보로 확인합니다.</li><li>아이 연령과 체류 시간을 먼저 정하고 무리한 일정을 피합니다.</li><li>비 오는 날, 주차, 화장실, 간식 가능 여부를 확인합니다.</li><li>후기와 평점은 참고만 하고 아이 컨디션을 우선합니다.</li></ul></section>${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(title)}은 단순한 외출이 아니라 아이가 보고, 질문하고, 집에서 다시 표현하는 활동으로 이어질 때 가치가 커집니다. 예매 전에는 현재 가격과 조건을 확인하고, 방문 후에는 아이가 기억한 한 장면을 꼭 남겨 보세요.</p></section></article></main>${footer()}`;
}

const items = [];

let order = 0;
for (let i = 0; i < days.length; i++) {
  const day = days[i];
  const entries = [
    ["region", ...day.region, infoHtml(day.region[0], day.region[1], day.date, day.region[2], "지역별 아이와 갈만한 곳")],
    ["mrt", mrt[i][0], mrt[i][1], `${mrt[i][7]} 아이와 체험 전 확인할 정보와 대화 질문을 정리했습니다.`, mrtHtml(mrt[i], day.date)],
    ["education", ...day.education, infoHtml(day.education[0], day.education[1], day.date, day.education[2], "아이 교육·발달")],
    ["coupang", ...day.coupang.slice(0, 3), coupangHtml(day.coupang[0], day.coupang[1], day.date, day.coupang[2], day.coupang[3])],
    ["season", ...day.season, infoHtml(day.season[0], day.season[1], day.date, day.season[2], "시즌·상황별 육아")]
  ];
  for (const [slot, title, slug, desc, html] of entries) {
    const finalSlug = `${slug}-${day.date.replaceAll("-", "")}`;
    const displayTitle = title.includes("2026년") ? title : `${title} | 2026년 가을 기준`;
    const finalHtml = html
      .replaceAll(`${slug}.html`, `${finalSlug}.html`)
      .replaceAll(esc(title), esc(displayTitle));
    const source = `drafts/toypoppo-prewritten/${finalSlug}.html`;
    writeFileSync(join(root, source), finalHtml, "utf8");
    items.push({ order: order++, date: day.date, slot, status: "ready", title: displayTitle, description: desc, source, target: `blog/${finalSlug}.html` });
  }
}

writeFileSync(queuePath, `${JSON.stringify({ mode: "prewritten-first", note: "자동화는 이 큐에서 날짜와 슬롯이 맞는 완성 원고를 먼저 발행합니다. status가 ready인 글만 발행됩니다.", items }, null, 2)}\n`, "utf8");
console.log(`Prepared ${items.length} ready items for 7 days.`);
