import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, "drafts", "toypoppo-prewritten");
const queuePath = join(root, "data", "toypoppo-prewritten-queue.json");
mkdirSync(draftDir, { recursive: true });

const startDate = "2026-09-16";
const endDate = "2026-09-22";

const blogImages = [
  "/assets/images/blog/after-school-board-game-family-photo.jpg",
  "/assets/images/blog/seven-year-old-block-play-family-photo.jpg",
  "/assets/images/blog/five-year-old-toy-shelf-family-photo.jpg",
  "/assets/images/blog/twenty-four-month-pretend-play-family-photo.jpg",
  "/assets/images/blog/weekend-morning-half-day-family-photo.jpg",
  "/assets/images/blog/elementary-literacy-home-study-hero.jpg",
  "/assets/images/blog/first-grade-dictation-cover-write.jpg",
  "/assets/images/blog/first-grade-dictation-review-parent.jpg",
  "/assets/images/blog/preschool-toy-cleanup-routine-1.jpg",
  "/assets/images/blog/preschool-toy-cleanup-routine-2.jpg",
  "/assets/images/blog/montessori-prepared-environment-hero.jpg",
  "/assets/images/blog/montessori-prepared-environment-shelf.jpg",
];

const placeImages = [
  "/assets/images/places/seoul-lotteworld-aquarium-kids-guide-1.png",
  "/assets/images/places/busan-sealife-kids-1.png",
  "/assets/images/places/gyeongju-golden-crown-kids-1.png",
  "/assets/images/places/jeju-soesokkak-fishing-experience-generated-1.jpg",
  "/assets/images/places/gangneung-runningman-muse-generated-1.jpg",
  "/assets/images/places/jeju-aewol-kids-weaving-1.png",
  "/assets/images/places/hongcheon-alpaca-world-generated-1.jpg",
  "/assets/images/places/suwon-hwaseong-history-kids-1.png",
];

const products = {
  board: [
    ["도블 키즈", "https://link.coupang.com/a/goYZVkzsTA", "https://coupa.ng/coV3LA", "5~7세", "관찰력", "그림을 빠르게 비교하며 짧게 몰입하는 아이"],
    ["할리갈리 주니어", "https://link.coupang.com/a/goY1IUDa1Y", "https://coupa.ng/coV3L7", "5세 이상", "수 감각", "승패 감정과 차례 기다리기를 연습할 아이"],
    ["펭귄 얼음깨기", "https://link.coupang.com/a/goY4W9wiOq", "https://coupa.ng/coV3MU", "5세 이상", "손 조절", "짧고 웃긴 가족 놀이가 필요한 아이"],
    ["루미큐브 키즈", "https://link.coupang.com/a/goY8it3zvo", "https://coupa.ng/coV3NT", "6세 이상", "숫자 배열", "숫자와 규칙을 놀이로 익히고 싶은 아이"],
    ["숫자 보드게임", "https://link.coupang.com/a/goZblXj9l6", "https://coupa.ng/coV3OI", "6세 전후", "연산 전 수 감각", "문제집 전 수놀이가 필요한 아이"],
  ],
  toddler: [
    ["역할놀이 세트", "https://coupa.ng/coV3PA", "https://coupa.ng/coV3PA", "24개월 전후", "말놀이", "인형 먹이기와 병원놀이를 반복하는 아이"],
    ["큰 블록", "https://link.coupang.com/a/goZfX5ONZA", "https://coupa.ng/coV3P5", "18~36개월", "쌓기", "쌓고 무너뜨리기를 좋아하는 아이"],
    ["원목 퍼즐", "https://coupa.ng/coV3RD", "https://coupa.ng/coV3RD", "24개월 전후", "손 조절", "끼우고 맞추는 놀이를 좋아하는 아이"],
    ["그림책·사운드북", "https://coupa.ng/coV3SQ", "https://coupa.ng/coV3SQ", "18~36개월", "어휘", "소리와 짧은 단어를 따라 하는 아이"],
  ],
  elementary: [
    ["레고 클래식", "https://coupa.ng/coX7Jo", "https://coupa.ng/coX7Jo", "6세 이상", "공간 구성", "자기 생각대로 만들고 싶은 아이"],
    ["레고 프렌즈 입문 세트", "https://link.coupang.com/a/gsaTPJM51M", "https://coupa.ng/coX7LT", "6~8세", "이야기 만들기", "완성 뒤 역할놀이까지 이어가는 아이"],
    ["과학실험 키트", "https://link.coupang.com/a/gsbblw4AgL", "https://coupa.ng/coX7Wy", "초등 1~3학년", "관찰력", "왜 그런지 질문이 많은 아이"],
    ["미술·만들기 키트", "https://link.coupang.com/a/gsbdomnNkG", "https://coupa.ng/coX7XL", "초등 저학년", "표현력", "그리기와 만들기를 오래 하는 아이"],
    ["문해력·독서 교구", "https://link.coupang.com/a/gsbh4g4L36", "https://coupa.ng/coX71y", "초등 저학년", "어휘력", "읽은 내용을 말로 설명하는 연습이 필요한 아이"],
  ],
};

const padLinks = [
  ["엘리하이 키즈 무료체험", "https://replyalba.com/pt/yqygnqm3LK", "/assets/images/pad-learning/elikids-og.jpg", "유아 스마트학습", "무료체험 전 아이 집중 시간과 해피콜, 기기 발송 조건을 확인하세요."],
  ["엘리하이 초등 무료체험", "https://replyalba.com/pt/Kck7mkbVGA", "/assets/images/pad-learning/elihigh-og.jpg", "초등 인강·패드학습", "국어·수학·영어 중 아이가 가장 반응하는 과목부터 확인하세요."],
  ["온리원 키즈 무료체험", "https://replyalba.com/pt/RBREVlKdwv", "/assets/images/pad-learning/only1-kids-og.jpg", "유아 패드학습", "놀이형 콘텐츠와 부모 관리 부담을 함께 확인하세요."],
  ["온리원 초등 무료체험", "https://replyalba.com/pt/UFCXLn3CMD", "/assets/images/pad-learning/only1ele-og.jpg", "초등 패드학습", "학습 리포트와 화면 시간 규칙을 먼저 정해두세요."],
  ["밀크T 초등 무료체험", "https://replyalba.com/pt/UPlKbFjMhf", "/assets/images/pad-learning/milkt-og.jpg", "초등 스마트학습", "체험기기 발송, 반납, 유료 전환 조건을 신청 페이지에서 확인하세요."],
  ["온리원 중등 무료체험", "https://replyalba.com/pt/YKOWhp4rRH", "/assets/images/pad-learning/only1middle-og.jpg", "중등 내신", "초등 고학년에서 중등으로 넘어가는 시기라면 학습량을 먼저 비교하세요."],
  ["엠베스트 무료체험", "https://replyalba.com/pt/Y87rxj4tUZ", "/assets/images/pad-learning/mbest-og.jpg", "중등 인강", "과목별 강의 스타일과 아이의 자기주도 가능 시간을 확인하세요."],
];

const mrtItems = [
  ["제주 쇠소깍 배낚시 체험 아이와 가기 전 체크: 2시간 낚시 멀미와 준비물", "jeju-soesokkak-fishing-kids-guide", "제주의 강태공은 나야나, 쇠소깍 배낚시 체험 2시간", "https://myrealt.rip/fkdicc", "예매처 확인", "4.8", "209", "제주 서귀포", "배낚시 체험", "/assets/images/places/jeju-soesokkak-fishing-experience-ticket.jpg", ["/assets/images/places/jeju-soesokkak-fishing-experience-generated-1.jpg", "/assets/images/places/jeju-soesokkak-fishing-experience-generated-2.jpg"]],
  ["부산 해운대 블루라인파크 아이와 타기: 바다열차 전 좌석·시간 체크", "busan-haeundae-blueline-kids-guide", "부산 해운대 블루라인파크", "https://myrealt.rip/faLFc0", "예매처 확인", "4.7", "516", "부산 해운대", "해변 열차", "/assets/images/places/busan-haeundae-blueline-park-ticket.jpg", ["/assets/images/places/busan-haeundae-blueline-park-generated-1.png", "/assets/images/places/busan-haeundae-blueline-park-generated-2.png"]],
  ["부산 요트투어 아이와 괜찮을까: 광안리 더베이101 퍼블릭 탑승 전 체크", "busan-yacht-public-family-guide", "부산요트투어 해운대 광안리 더베이101 요트다 퍼블릭", "https://myrealt.rip/faLO47", "예매처 확인", "5.0", "80", "부산 광안리", "요트투어", "/assets/images/places/busan-yachtda-public-tour-ticket.jpg", ["/assets/images/places/busan-yachtda-public-tour-generated-1.png", "/assets/images/places/busan-yachtda-public-tour-generated-2.png"]],
  ["부산 벡스코 상상체험 키즈월드 방문 전 체크: 실내 대형 놀이 체험", "busan-bexco-sangsang-kids-world-guide", "부산 벡스코 상상체험 키즈월드", "https://myrealt.rip/faLs50", "예매처 확인", "4.7", "12", "부산 해운대", "실내 놀이 체험", "/assets/images/places/busan-bexco-sangsang-kids-world-ticket.jpg", ["/assets/images/places/busan-bexco-sangsang-kids-world-generated-1.jpg", "/assets/images/places/busan-bexco-sangsang-kids-world-generated-2.jpg"]],
  ["경주 첨성대·동궁과 월지 야경투어 아이와 가기 전 보는 부모 가이드", "gyeongju-night-cheomseongdae-family-guide", "경주 첨성대 동궁과 월지 해설 야경 투어", "https://myrealt.rip/fY8t06", "예매처 확인", "5.0", "49", "경북 경주", "역사 야경투어", "/assets/images/places/gyeongju-daereungwon-night-tour-ticket.jpg", ["/assets/images/places/gyeongju-night-history-tour-1.png", "/assets/images/places/gyeongju-night-history-tour-2.png"]],
  ["강릉 런닝맨 체험관 아이와 실내 여행: 활동 많은 아이에게 맞을까", "gangneung-runningman-kids-indoor-guide", "강릉 런닝맨 뮤지엄 체험", "https://myrealt.rip/fUOI99", "예매처 확인", "", "", "강원 강릉", "실내 체험", "/assets/images/places/gangneung-runningman-muse-ticket-hero.jpg", ["/assets/images/places/gangneung-runningman-muse-generated-1.jpg", "/assets/images/places/gangneung-runningman-muse-generated-2.jpg"]],
  ["홍천 알파카월드 아이와 가기 전 체크: 동물 먹이주기와 산책 동선", "hongcheon-alpaca-world-kids-guide", "홍천 알파카월드 입장권", "https://myrealt.rip/fP6G56", "예매처 확인", "", "", "강원 홍천", "동물 체험", "/assets/images/places/hongcheon-alpaca-world-ticket.jpg", ["/assets/images/places/hongcheon-alpaca-world-generated-1.jpg", "/assets/images/places/hongcheon-alpaca-world-generated-2.jpg"]],
];

const days = [
  { date: "2026-09-16", region: ["강남구 아이와 갈만한 곳: 코엑스·도서관·실내 체험 반나절 코스", "gangnam-coex-kids-indoor-guide", "강남 코엑스 주변은 비 오는 날에도 이동 부담을 줄이기 좋아 실내형 가족 코스로 검색 수요가 높습니다.", ["별마당도서관", "코엑스 아쿠아리움 주변", "봉은사 산책", "실내 키즈 체험", "가족 식사 동선"]], education: ["유아 패드학습 무료체험 전 체크: 5세·6세 아이에게 맞는 기준", "preschool-pad-learning-free-trial-check", "유아 패드학습은 브랜드보다 화면 시간, 부모 동행, 한글·수학 우선순위를 먼저 봐야 합니다."], coupang: ["6세 보드게임 추천: 도블·할리갈리·루미큐브 키즈 고르는 기준", "six-year-old-board-games-affiliate-guide", "6세 보드게임은 규칙이 짧고 반복 플레이가 쉬운 제품부터 시작하는 것이 좋습니다.", products.board], season: ["비 오는 날 서울 아이와 갈만한 실내 코스: 돈 쓰기 전 먼저 볼 기준", "rainy-day-seoul-kids-indoor-course", "비 오는 날 실내 체험은 가까운 동선과 아이 체력, 예약 여부를 먼저 보면 실패가 줄어듭니다."] },
  { date: "2026-09-17", region: ["성동구 아이와 갈만한 곳: 서울숲·성수 실내외 가족 코스", "seongdong-seoulforest-seongsu-kids-guide", "성동구는 서울숲 산책과 성수 실내 공간을 묶기 좋아 유아와 초등 가족 모두 활용하기 좋습니다.", ["서울숲", "성수 실내 체험", "어린이 도서관", "뚝섬 한강공원", "가족 카페 동선"]], education: ["초등 패드학습 무료체험 비교 전 체크: 엘리하이·온리원·밀크T 보기 전", "elementary-pad-learning-free-trial-check", "초등 패드학습은 강의 수보다 아이가 매일 20분 이어갈 수 있는 구조인지 확인해야 합니다."], coupang: ["두돌 장난감 추천: 말놀이·블록·퍼즐 선물 실패 줄이는 법", "two-year-old-toys-affiliate-guide", "24개월 장난감은 말놀이와 손 조절, 반복성을 기준으로 고르면 오래 씁니다.", products.toddler], season: ["가을 주말 아이와 뭐하지: 반나절 체험과 집놀이를 나누는 법", "autumn-weekend-kids-half-day-plan", "주말 계획은 체험 하나와 회복 시간 하나만 잡아도 아이 만족도가 올라갑니다."] },
  { date: "2026-09-18", region: ["부천 아이와 갈만한 곳: 만화박물관·공원·실내 체험 코스", "bucheon-kids-comics-museum-outing-guide", "부천은 만화·상상력 콘텐츠와 공원 동선을 함께 잡기 좋아 초등 저학년 검색 유입에 잘 맞습니다.", ["한국만화박물관", "상동호수공원", "실내 체험 공간", "어린이 도서관", "가족 식사 동선"]], education: ["초등 1학년 문해력 루틴: 책 싫어하는 아이를 말하기로 여는 법", "first-grade-literacy-speaking-routine", "초등 문해력은 책을 오래 읽히기보다 읽은 내용을 자기 말로 설명하는 경험에서 시작됩니다."], coupang: ["초등 저학년 생일선물 추천: 보드게임·레고·과학키트 수익형 가이드", "elementary-birthday-gift-affiliate-guide", "초등 생일선물은 한 번 반응보다 반복 활용, 정리 부담, 형제자매 사용 가능성을 함께 봐야 합니다.", [products.board[3], ...products.elementary]], season: ["하원 후 30분 장난감 싸움 줄이기: 새 장난감보다 순서가 먼저", "after-daycare-toy-fight-thirty-minute-routine", "하원 후 장난감 싸움은 피곤한 시간대와 선택 방식이 겹칠 때 더 자주 생깁니다."] },
  { date: "2026-09-19", region: ["파주 아이와 갈만한 곳: 출판도시·헤이리·실내 체험 코스", "paju-bookcity-heyri-kids-guide", "파주는 책, 전시, 만들기 체험을 묶기 좋아 부모 검색 의도가 뚜렷한 지역형 글로 좋습니다.", ["파주출판도시", "헤이리 예술마을", "어린이 책방", "실내 만들기 체험", "가족 식사 동선"]], education: ["중등 인강 무료체험 전 체크: 초등 고학년 부모가 먼저 볼 것", "middle-school-online-learning-free-trial-check", "초등 고학년에서 중등으로 넘어갈 때는 강의량보다 아이가 스스로 듣고 정리할 수 있는 시간이 중요합니다."], coupang: ["7세 레고·블록 추천: 초등 입학 전 공간지각력 키우는 조립놀이", "seven-year-old-lego-block-affiliate-guide", "7세 조립놀이는 완성보다 설명서 읽기, 분류, 다시 만들기 경험을 함께 봐야 합니다.", products.elementary], season: ["아이와 체험학습 후 집에서 하는 한 문장 기록법", "kids-field-trip-one-sentence-record", "체험학습은 다녀온 뒤 한 문장으로 말하고 그리는 시간이 있어야 검색한 정보가 학습으로 이어집니다."] },
  { date: "2026-09-20", region: ["하남 아이와 갈만한 곳: 미사·스타필드·한강공원 가족 코스", "hanam-misa-starfield-kids-guide", "하남은 실내 쇼핑몰과 한강공원 동선을 날씨에 따라 바꾸기 쉬워 가족 나들이 수요가 꾸준합니다.", ["스타필드 하남", "미사경정공원", "한강 산책", "어린이 도서관", "실내 체험 공간"]], education: ["5세 한글 공부 시작 전: 학습지보다 먼저 해야 할 글자놀이", "five-year-old-hangeul-before-workbook", "5세 한글은 쓰기 훈련보다 생활 속 글자를 발견하고 말로 설명하는 놀이가 먼저입니다."], coupang: ["5세 장난감 추천: 역할놀이·보드게임·미술놀이 균형 있게 고르기", "five-year-old-toys-affiliate-guide", "5세 장난감은 역할놀이, 규칙놀이, 만들기 활동을 균형 있게 섞으면 활용도가 높습니다.", [products.toddler[0], products.board[0], products.board[2], products.elementary[3], products.toddler[1]]], season: ["일요일 저녁 아이와 정리 루틴: 월요일 아침을 편하게 만드는 법", "sunday-evening-kids-school-ready-routine", "일요일 저녁은 공부를 더 시키기보다 가방과 마음을 함께 정리하는 시간이 필요합니다."] },
  { date: "2026-09-21", region: ["양천구 아이와 갈만한 곳: 목동·오목교 실내 체험과 공원 코스", "yangcheon-mokdong-kids-indoor-guide", "양천구는 도서관, 공원, 실내 체험 동선이 가까워 평일 오후와 주말 반나절 글에 잘 맞습니다.", ["목동 실내 체험", "오목공원", "어린이 도서관", "안양천 산책", "가족 식사 동선"]], education: ["24개월 말이 느린 아이 놀이: 말문 트이기 전 부모 말걸기", "twenty-four-month-language-parent-talk", "24개월 언어 자극은 단어를 따라 하게 시키는 것보다 생활 장면에 짧은 말을 붙이는 방식이 좋습니다."], coupang: ["24개월 말놀이 장난감 추천: 사운드북·역할놀이·퍼즐 고르는 법", "twenty-four-month-language-toys-affiliate-guide", "24개월 말놀이 장난감은 소리, 그림, 역할놀이를 아이가 반복할 수 있는지 먼저 봐야 합니다.", [products.toddler[3], products.toddler[0], products.toddler[2], products.toddler[1]]], season: ["맞벌이 부모 주말 놀이 루틴: 준비물 적고 만족도 높은 2시간 계획", "working-parents-weekend-play-routine", "바쁜 부모일수록 거창한 외출보다 준비가 적고 반복 가능한 2시간 놀이 계획이 오래 갑니다."] },
  { date: "2026-09-22", region: ["광명 아이와 갈만한 곳: 동굴·도서관·실내 체험 하루 코스", "gwangmyeong-kids-cave-library-guide", "광명은 광명동굴처럼 목적이 분명한 장소와 실내 휴식 동선을 함께 잡기 좋아 검색 전환이 좋습니다.", ["광명동굴", "어린이 도서관", "실내 체험 공간", "철산 상권 가족 식사", "공원 산책"]], education: ["초등 저학년 집중력 짧을 때: 10분 놀이공부로 바꾸는 법", "elementary-short-focus-play-study-routine", "초등 저학년 집중력은 오래 앉히는 훈련보다 시작과 끝이 분명한 10분 루틴에서 자랍니다."], coupang: ["초등 보드게임 추천: 가족이 같이 오래 하는 게임 고르는 법", "elementary-family-board-games-affiliate-guide", "초등 보드게임은 승패보다 설명하기, 기다리기, 전략 세우기를 경험할 수 있는지 봐야 합니다.", [products.board[1], products.board[3], products.board[4], products.elementary[4], products.board[0]]], season: ["가을 나들이 전 아이 컨디션 체크: 많이 보는 일정보다 덜 지치는 코스", "autumn-outing-kids-condition-check", "가을 나들이는 장소 수를 늘리기보다 아이 컨디션에 맞춰 쉬는 지점을 먼저 정해야 만족도가 높습니다."] },
];

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function pick(list, key, offset = 0) {
  const sum = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return list[(sum + offset) % list.length];
}

function datedSlug(slug, date) {
  return `${slug}-${date.replaceAll("-", "")}`;
}

function styleBlock() {
  return `<style>.affiliate-notice{margin:22px 0;padding:14px 16px;border:1px solid #ffd2df;border-radius:12px;background:#fff7fa;color:#6f3d4d;font-size:14px;line-height:1.7}.revenue-box,.summary-box{margin:20px 0;padding:18px;border:1px solid #d8eee8;border-radius:14px;background:#f2fffb}.criteria-grid,.place-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.criteria-grid div,.place-grid div{padding:16px;border:1px solid #f1d8e2;border-radius:13px;background:#fffafd}.article-figure{max-width:720px;margin:26px auto;border:1px solid #f1d8e2;border-radius:16px;overflow:hidden;background:#fff}.article-figure img{display:block;width:100%;max-height:500px;object-fit:contain;background:#fff}.article-figure figcaption{padding:10px 14px;color:#766a73;font-size:13px;background:#f5fffb}.product-picks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px 0}.pick-card{display:grid;grid-template-columns:132px 1fr;gap:16px;align-items:start;padding:16px;border:1px solid #f1d8e2;border-radius:14px;background:linear-gradient(135deg,#fffafd,#f5fffb)}.pick-frame{display:grid;place-items:center;min-height:248px;border:1px solid #f0d8e2;border-radius:12px;background:#fff;overflow:hidden}.pick-meta{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.pick-meta span{display:inline-flex;padding:4px 9px;border-radius:999px;background:#fff1f6;color:#c83e72;font-size:12px;font-weight:800}.pick-button,.ticket-card__button,.pad-card__button{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin-top:10px;border-radius:12px;background:linear-gradient(135deg,#ff4f91,#ff7b61);color:#fff!important;font-weight:950;text-decoration:none;font-size:18px;box-shadow:0 10px 20px rgba(255,79,145,.2)}.ticket-card,.pad-card{display:grid;grid-template-columns:210px 1fr;gap:16px;padding:16px;border:1px solid #ffd2df;border-radius:16px;background:#fff;text-decoration:none;box-shadow:0 10px 24px rgba(112,64,88,.08);margin:24px 0}.ticket-card__media,.pad-card__media{position:relative;min-height:160px;border-radius:13px;overflow:hidden;background:#fff1f6}.ticket-card__media img,.pad-card__media img{display:block;width:100%;height:170px;object-fit:cover}.ticket-card__status{position:absolute;left:10px;top:10px;padding:5px 10px;border-radius:999px;background:#fff;color:#30242d;font-size:12px;font-weight:900;box-shadow:0 4px 12px rgba(48,36,45,.12)}.ticket-card__body,.pad-card__body{display:flex;flex-direction:column;gap:6px;min-width:0}.ticket-card__label,.pad-card__label{font-size:13px;color:#766a73;font-weight:800}.ticket-card__title,.pad-card__title{font-size:19px;line-height:1.35;color:#30242d;text-decoration:underline;text-underline-offset:2px}.ticket-card__rating{font-weight:900;color:#30242d}.ticket-card__rating .star{color:#f4a000}.ticket-card__rating .count{color:#766a73;font-weight:800}.ticket-card__price{font-size:21px;font-weight:950;color:#30242d}.ticket-card__meta,.pad-card__meta,.disclosure{font-size:13px;color:#766a73;line-height:1.7}.mid-products{margin:26px 0;padding:18px;border:1px solid #ffd2df;border-radius:16px;background:#fffafd}.mid-products h2{margin-top:0}@media(max-width:760px){.criteria-grid,.place-grid,.product-picks{grid-template-columns:1fr}.pick-card,.ticket-card,.pad-card{grid-template-columns:1fr}.article-figure img{max-height:420px}.ticket-card__media img,.pad-card__media img{height:190px}.pick-button,.ticket-card__button,.pad-card__button{font-size:18px}}</style>`;
}

function shell({ title, desc, slug, date, category, body }) {
  const url = `https://toypoppo.kr/blog/${slug}.html`;
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: title, description: desc, author: { "@type": "Organization", name: "토이포포" }, publisher: { "@type": "Organization", name: "토이포포", url: "https://toypoppo.kr" }, mainEntityOfPage: url, datePublished: date, dateModified: date, inLanguage: "ko-KR" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: "https://toypoppo.kr/" }, { "@type": "ListItem", position: 2, name: "블로그", item: "https://toypoppo.kr/blog/" }, { "@type": "ListItem", position: 3, name: title, item: url }] },
      { "@type": "FAQPage", mainEntity: ["처음 시작할 때 가장 중요한 점은 무엇인가요?", "비용을 줄이려면 어떻게 고르면 좋나요?", "아이가 관심 없어 하면 어떻게 하나요?", "부모가 꼭 함께 해야 하나요?", "구매나 예매 전 무엇을 확인해야 하나요?"].map((name) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: "아이 나이, 컨디션, 이용 조건, 환불 또는 반납 조건을 함께 확인하고 짧게 시작하는 것이 좋습니다." } })) },
    ],
  };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${esc(url)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="${esc(url)}"><meta property="og:site_name" content="토이포포"><meta property="og:locale" content="ko_KR"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css">${styleBlock()}<script type="application/ld+json">${JSON.stringify(json)}</script></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">체크리스트</a><a href="/local-info/">우리동네</a><a href="/pad-learning/">패드학습</a></nav></header><main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">블로그</a> / ${esc(category)}</p><p class="eyebrow">${esc(category)}</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p>${body}</article></main><footer class="site-footer"><div><strong>토이포포</strong><p>육아 고민, 발달놀이, 부모 가이드, 엄마표 자료와 아이와 가볼만한 곳을 함께 다루는 부모 정보 플랫폼입니다.</p></div><nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer></body></html>`;
}

function figure(src, alt) {
  return `<figure class="article-figure"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"><figcaption>토이포포 생성형 이미지입니다.</figcaption></figure>`;
}

function related() {
  return `<section><h2>함께 보면 좋은 글</h2><ul><li><a href="/pad-learning/">패드학습 무료체험 가이드</a></li><li><a href="/local-info/">아이와 가볼만한 곳</a></li><li><a href="/development-play/">월령별 발달놀이</a></li><li><a href="/worksheets/">엄마표 자료실</a></li><li><a href="/parent-guide/">부모가이드</a></li></ul></section>`;
}

function productCards(list, limit = list.length) {
  return `<div class="product-picks">${list.slice(0, limit).map(([name, href, iframe, age, point, fit]) => `<div class="pick-card"><div class="pick-frame"><iframe src="${esc(iframe)}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" title="${esc(name)}"></iframe></div><div><h3>${esc(name)}</h3><p>${esc(point)}을 자연스럽게 경험할 수 있는 후보입니다. 제품명보다 우리 아이가 반복해서 꺼낼 놀이인지 먼저 보세요.</p><div class="pick-meta"><span>${esc(age)}</span><span>${esc(point)}</span><span>추천 후보</span></div><p><strong>이런 아이에게 추천</strong><br>${esc(fit)}</p><p><strong>구매 전 체크</strong><br>사용 연령, 작은 부품, 보관 방식, 부모가 함께할 시간을 확인하세요.</p><a class="pick-button" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener">상품 보러가기</a></div></div>`).join("")}</div>`;
}

function midCoupang(title, list = products.board.slice(0, 2)) {
  return `<section class="mid-products"><h2>${esc(title)}</h2><p class="disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 아래 상품은 글 주제와 연결되는 놀이·교구 예시입니다.</p>${productCards(list, 2)}</section>`;
}

function padCard(index) {
  const [name, href, image, label, note] = padLinks[index % padLinks.length];
  return `<a class="pad-card" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener"><div class="pad-card__media"><img src="${esc(image)}" alt="${esc(name)} 안내 이미지" loading="lazy"></div><div class="pad-card__body"><span class="pad-card__label">${esc(label)}</span><strong class="pad-card__title">${esc(name)}</strong><span class="pad-card__meta">${esc(note)}</span><span class="pad-card__button">무료체험 조건 확인하기</span></div></a><p class="disclosure">무료체험 대상, 해피콜, 체험기기 발송, 반납 조건, 유료 전환 여부는 신청 페이지에서 직접 확인하세요.</p>`;
}

function mrtCard(index) {
  const [titleBase, slug, product, href, price, rating, reviews, region, type, ticketImg, generated] = mrtItems[index % mrtItems.length];
  const ratingText = rating ? `<span class="ticket-card__rating"><span class="star">★</span> ${esc(rating)} <span class="count">(후기 ${esc(reviews)}개)</span></span>` : `<span class="ticket-card__rating">평점·후기수는 예매 페이지에서 확인</span>`;
  return { titleBase, slug, product, href, region, type, generated, card: `<a class="ticket-card" href="${esc(href)}" target="_blank" rel="sponsored nofollow noopener noreferrer"><div class="ticket-card__media"><img src="${esc(ticketImg)}" alt="${esc(product)} 예매 대표 이미지" loading="lazy"><span class="ticket-card__status">예매 가능</span></div><div class="ticket-card__body"><span class="ticket-card__label">${esc(region)} · ${esc(type)}</span><strong class="ticket-card__title">${esc(product)}</strong>${ratingText}<span class="ticket-card__price">${esc(price)}</span><span class="ticket-card__meta">가족 추천 · 회차와 취소 규정 확인</span><span class="ticket-card__button">일정·가격 확인하기</span></div></a><p class="disclosure">가격, 평점, 후기 수, 회차, 포함 사항과 환불 규정은 예매 페이지 표시 기준이며 변경될 수 있습니다. 결제 전 현재 예매 페이지에서 다시 확인하세요.</p>` };
}

function faq(title) {
  return `<section><h2>FAQ</h2><h3>아이 나이가 조금 어려도 괜찮을까요?</h3><p>${esc(title)}은 표시 연령보다 아이의 체력, 언어 이해, 대기 가능 시간을 함께 보는 것이 좋습니다.</p><h3>비용을 줄이려면 어떻게 선택해야 하나요?</h3><p>한 번 쓰고 끝나는 선택보다 반복 활용이 되는지, 집에서 이어갈 수 있는지, 형제자매가 함께 쓸 수 있는지 확인하세요.</p><h3>아이가 관심 없어 하면 어떻게 하나요?</h3><p>끝까지 해내게 하기보다 좋은 기억으로 마무리하는 편이 다음 경험으로 이어지기 쉽습니다.</p></section>`;
}

function makeRegion(day) {
  const [titleBase, baseSlug, desc, places] = day.region;
  const title = `${titleBase} | 2026년 가을 기준`;
  const slug = datedSlug(baseSlug, day.date);
  const body = `${figure(pick(placeImages, title), `${titleBase} 가족 나들이 이미지`)}<section><h2>왜 이 코스가 검색할 만한 가치가 있나요?</h2><p>${esc(desc)} 아이와 외출할 때는 유명한 장소를 많이 찍는 것보다 이동을 줄이고, 실내와 야외를 섞고, 쉬는 지점을 남기는 편이 만족도가 높습니다.</p><p>유아는 화장실과 식사 동선, 초등 아이는 관찰할 거리와 질문할 거리가 중요합니다. 오늘의 목적을 하나만 정하면 부모도 아이도 덜 지칩니다.</p></section><section><h2>추천 장소 후보</h2><div class="place-grid">${places.map((place) => `<div><strong>${esc(place)}</strong><span>방문 전 운영 시간, 예약 여부, 주차와 휴무를 확인하세요.</span></div>`).join("")}</div></section>${midCoupang("외출 후 집에서 이어가기 좋은 놀이", [products.board[0], products.toddler[1]])}${figure(pick(placeImages, title, 2), `${titleBase} 실내외 코스 이미지`)}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}를 찾는 부모에게 필요한 것은 긴 목록보다 우리 아이에게 맞는 순서입니다. 장소는 하나 줄이고 질문은 하나 남기면 좋은 하루로 이어집니다.</p></section>`;
  return { slot: "region", title, slug, desc, html: shell({ title, desc, slug, date: day.date, category: "지역별 아이와 갈만한 곳", body }) };
}

function makeMrt(day, index) {
  const item = mrtCard(index);
  const title = `${item.titleBase} | 2026년 가을 기준`;
  const slug = datedSlug(item.slug, day.date);
  const desc = `${item.region} ${item.type}을 아이와 방문하기 전 추천 연령, 동선, 대화 질문, 예매 전 체크 포인트를 정리했습니다.`;
  const body = `<p class="affiliate-notice">이 글에는 마이리얼트립 제휴 링크가 포함되어 있으며, 예약 시 토이포포가 일정액의 수수료를 받을 수 있습니다.</p>${item.card}${figure(item.generated[0], `${item.product} 아이와 체험 이미지`)}<section><h2>아이와 가기 전 먼저 볼 기준</h2><p>${esc(item.region)}에서 ${esc(item.type)}을 고를 때는 상품명보다 아이가 버틸 수 있는 시간, 이동 난이도, 체험 뒤에 남길 이야기를 먼저 봐야 합니다. 처음 가는 장소라면 “꼭 다 봐야 한다”보다 한 가지 장면을 깊게 보는 편이 좋습니다.</p><p>방문 전 아이에게 오늘의 질문을 하나만 정해 주세요. 집에 와서 다시 말할 장면이 생기면 체험 만족도가 올라갑니다.</p></section><section><h2>예매 전 체크리스트</h2><ul><li>운영일, 시작 시간, 소요 시간, 집결 장소를 확인합니다.</li><li>아이 연령과 체력에 맞는 회차인지 봅니다.</li><li>날씨, 주차, 대중교통, 식사 동선을 함께 확인합니다.</li><li>후기와 평점은 참고하되 우리 아이 성향을 우선합니다.</li><li>취소 규정과 포함·불포함 사항은 결제 직전 다시 확인합니다.</li></ul></section>${figure(item.generated[1], `${item.product} 방문 후 활동 이미지`)}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(item.titleBase)}은 단순한 외출보다 아이가 보고 질문하고 집에서 다시 말할 때 오래 남습니다. 예매 전에는 최신 조건을 확인하고, 방문 뒤에는 아이가 고른 한 장면을 짧게 기록해 보세요.</p></section>`;
  return { slot: "mrt", title, slug, desc, html: shell({ title, desc, slug, date: day.date, category: "마이리얼트립 가족체험", body }) };
}

function makeEducation(day, index) {
  const [titleBase, baseSlug, desc] = day.education;
  const title = `${titleBase} | 2026년 가을 기준`;
  const slug = datedSlug(baseSlug, day.date);
  const body = `${figure(pick(blogImages, title), `${titleBase} 가정 루틴 이미지`)}<section><h2>부모가 먼저 볼 기준</h2><p>${esc(desc)} 아이 교육은 상품이나 학습량보다 매일 이어갈 수 있는 환경이 먼저입니다. 무료체험이나 교구를 신청하기 전에도 아이가 실제로 앉아 있을 수 있는 시간, 부모가 옆에서 봐줄 수 있는 시간, 화면 사용 규칙을 먼저 정해야 합니다.</p><p>검색 유입이 많은 주제일수록 불안을 키우기 쉽습니다. 토이포포는 “빨리 시키기”보다 아이에게 맞는 시작선을 잡는 쪽으로 정리합니다.</p></section>${padCard(index)}<section><h2>집에서 바로 확인할 것</h2><div class="criteria-grid"><div><strong>시간</strong><span>처음에는 10~20분 안에 끝나는지 봅니다.</span></div><div><strong>반응</strong><span>아이가 스스로 다시 해보고 싶어 하는 콘텐츠인지 봅니다.</span></div><div><strong>부모 부담</strong><span>매일 옆에서 관리해야 하는 정도를 확인합니다.</span></div><div><strong>조건</strong><span>무료체험, 해피콜, 기기 발송과 반납 조건을 직접 확인합니다.</span></div></div></section>${figure(pick(blogImages, title, 3), `${titleBase} 부모 대화 이미지`)}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}의 핵심은 빨리 시작하는 것이 아니라 우리 집에서 지속 가능한 방식을 찾는 것입니다. 체험 신청 전 조건을 확인하고, 아이가 편하게 반응하는 영역부터 작게 시작하세요.</p></section>`;
  return { slot: "education", title, slug, desc, html: shell({ title, desc, slug, date: day.date, category: "패드학습·아이 교육", body }) };
}

function makeCoupang(day) {
  const [titleBase, baseSlug, desc, list] = day.coupang;
  const title = `${titleBase} | 2026년 가을 기준`;
  const slug = datedSlug(baseSlug, day.date);
  const body = `<div class="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>${figure(pick(blogImages, title), `${titleBase} 놀이 이미지`)}<section><h2>먼저 선택 기준부터 보세요</h2><p>${esc(desc)} 장난감 추천 글은 제품을 많이 나열하는 것보다 우리 아이가 실제로 어떻게 놀 수 있는지 확인하는 것이 중요합니다. 같은 보드게임이나 블록도 아이 나이, 승패 감정, 손 조절, 부모 참여 시간에 따라 만족도가 달라집니다.</p><p>새 장난감을 고를 때는 유행보다 반복성, 정리 난이도, 형제자매와 함께 쓸 수 있는지, 부모가 짧게 도와줄 수 있는지를 먼저 보세요.</p></section><section><h2>추천 제품 후보</h2>${productCards(list)}</section>${figure(pick(blogImages, title, 4), `${titleBase} 가족 놀이 이미지`)}<section><h2>실패를 줄이는 구매 전 체크</h2><div class="criteria-grid"><div><strong>표시 연령</strong><span>제품 연령보다 아이의 실제 조작 능력과 작은 부품 위험을 함께 봅니다.</span></div><div><strong>놀이 시간</strong><span>처음에는 10~20분 안에 끝낼 수 있는 구성이 좋습니다.</span></div><div><strong>정리 부담</strong><span>부품 수가 많으면 부모 피로가 커져 다시 꺼내기 어렵습니다.</span></div><div><strong>확장성</strong><span>말놀이, 수놀이, 역할놀이로 이어질 수 있는 제품은 오래 씁니다.</span></div></div></section>${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}을 고를 때 가장 좋은 기준은 “아이가 내일도 다시 꺼낼까?”입니다. 가격보다 반복성, 화려함보다 부모와 나눌 대화, 완성보다 다시 시도할 여지가 있는 제품을 고르면 실패가 줄어듭니다.</p></section>`;
  return { slot: "coupang", title, slug, desc, html: shell({ title, desc, slug, date: day.date, category: "장난감 추천", body }) };
}

function makeSeason(day) {
  const [titleBase, baseSlug, desc] = day.season;
  const title = `${titleBase} | 2026년 가을 기준`;
  const slug = datedSlug(baseSlug, day.date);
  const body = `${figure(pick(blogImages, title), `${titleBase} 이미지`)}<section><h2>상황형 글은 기준이 먼저입니다</h2><p>${esc(desc)} 부모가 급하게 검색하는 순간일수록 “어디 갈까”, “뭘 사야 하지”보다 아이 컨디션과 남은 시간을 먼저 봐야 합니다. 그래야 돈을 쓰고도 피곤한 하루가 되는 일을 줄일 수 있습니다.</p><p>토이포포는 선택지를 많이 던지기보다 오늘 바로 판단할 수 있는 기준을 먼저 정리합니다.</p></section><section><h2>오늘 바로 쓰는 판단 기준</h2><div class="criteria-grid"><div><strong>아이 에너지</strong><span>몸을 움직이고 싶은 날인지, 조용히 쉬어야 하는 날인지 먼저 봅니다.</span></div><div><strong>부모 체력</strong><span>부모가 지친 날에는 준비와 정리가 쉬운 활동을 고릅니다.</span></div><div><strong>비용</strong><span>체험권이나 장난감은 반복 활용 가능성을 함께 봅니다.</span></div><div><strong>마무리</strong><span>집에 와서 한 문장으로 정리할 수 있으면 아이 기억에 오래 남습니다.</span></div></div></section>${midCoupang("상황에 맞춰 함께 볼 만한 놀이 도구", [products.board[2], products.elementary[3]])}${figure(pick(blogImages, title, 5), `${titleBase} 가족 루틴 이미지`)}${related()}${faq(title)}<section><h2>마무리</h2><p>${esc(titleBase)}의 목적은 하루를 완벽하게 채우는 것이 아니라 아이와 부모 모두 덜 지치게 좋은 기억을 남기는 것입니다. 오늘의 기준을 하나만 정하면 선택이 훨씬 쉬워집니다.</p></section>`;
  return { slot: "season", title, slug, desc, html: shell({ title, desc, slug, date: day.date, category: "시즌·상황별 육아", body }) };
}

const queue = existsSync(queuePath)
  ? JSON.parse(readFileSync(queuePath, "utf8"))
  : { mode: "prewritten-first", note: "자동화는 이 큐에서 날짜와 슬롯이 맞는 완성 원고를 먼저 발행합니다. status가 ready인 글만 발행됩니다.", items: [] };

queue.items = (queue.items || []).filter((item) => item.date < startDate || item.date > endDate || item.status === "published");
let nextOrder = queue.items.reduce((max, item) => Math.max(max, Number(item.order) || 0), -1) + 1;
const created = [];

days.forEach((day, index) => {
  const posts = [makeRegion(day), makeMrt(day, index), makeEducation(day, index), makeCoupang(day), makeSeason(day)];
  posts.forEach((post) => {
    const source = `drafts/toypoppo-prewritten/${post.slug}.html`;
    const target = `blog/${post.slug}.html`;
    writeFileSync(join(root, source), post.html, "utf8");
    queue.items.push({ order: nextOrder++, date: day.date, slot: post.slot, status: "ready", title: post.title, description: post.desc, source, target, url: `https://toypoppo.kr/${target}` });
    created.push({ date: day.date, slot: post.slot, title: post.title, target });
  });
});

writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
console.log(`Prepared ${created.length} ToyPoppo revenue articles from ${startDate} to ${endDate}.`);
for (const item of created) console.log(`${item.date} ${item.slot} ${item.target}`);
