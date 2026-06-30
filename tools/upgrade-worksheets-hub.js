const fs = require("fs");
const path = require("path");

const today = "2026-06-30";

const nav = `<header class="site-header"><a class="brand" href="/"><span class="brand-mark">T</span><span><strong>토이포포</strong><small>대한민국 부모를 위한 육아 정보 플랫폼</small></span></a><nav class="nav" aria-label="주요 메뉴"><a class="nav-primary" href="/#toy-recommendations">장난감 추천</a><a href="/development-play/">발달놀이</a><a href="/parent-guide/">부모가이드</a><a href="/counseling/">상담소</a><a href="/montessori/">몬테소리</a><a href="/worksheets/">엄마표 자료실</a><a href="/parenting-tools/">육아도구</a><a href="/local-info/">우리동네</a></nav></header>`;
const footer = `<footer class="site-footer"><div><strong>토이포포</strong><p>육아, 놀이, 교육, 부모 고민 해결을 위한 생활형 정보를 제공합니다. 의료·발달 진단을 대체하지 않으며, 필요한 경우 전문가 상담을 권합니다.</p></div><nav><a href="/about.html">회사소개</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a><a href="/editorial-policy.html">편집 원칙</a><a href="/contact.html">문의</a></nav><p class="copyright">© 2026 ToyPoppo. All rights reserved.</p></footer>`;

const items = [
  {
    slug: "goguryeo-worksheet",
    title: "고구려 워크지",
    category: "한국사 자료",
    age: "초등 3~5학년, 역사 이야기를 처음 접하는 7~9세",
    desc: "고구려의 넓은 영토, 광개토대왕, 장수왕, 벽화와 산성 문화를 아이 눈높이로 정리하는 엄마표 한국사 자료입니다.",
    concept: "고구려는 한반도 북쪽과 만주 지역에서 힘을 키운 나라입니다. 아이에게는 '말을 타고 넓은 땅을 오가던 씩씩한 나라'로 시작하면 좋습니다.",
    easy: "고구려는 옛날 우리 역사 속 나라 중 하나야. 산이 많고 넓은 땅에서 살았고, 나라를 지키기 위해 성도 튼튼하게 만들었어. 광개토대왕은 고구려를 더 넓고 강하게 만든 왕으로 기억하면 돼.",
    activities: ["지도에서 고구려가 있던 북쪽을 손가락으로 짚어보기", "광개토대왕에게 한 문장 편지 쓰기", "고구려 벽화 속 동물을 상상해서 그리기", "산성은 왜 필요했는지 이야기 나누기"],
    quiz: ["고구려는 한반도의 어느 쪽에서 힘을 키웠나요?", "광개토대왕은 어떤 왕으로 기억되나요?", "고구려 사람들이 산성을 만든 까닭은 무엇일까요?", "벽화는 옛사람들의 어떤 모습을 알려줄까요?", "고구려를 한 단어로 표현한다면 무엇인가요?"],
  },
  {
    slug: "baekje-worksheet",
    title: "백제 워크지",
    category: "한국사 자료",
    age: "초등 3~5학년, 문화재와 교류 이야기에 관심 있는 아이",
    desc: "백제의 문화, 무령왕릉, 불교 문화, 일본과의 교류를 이야기와 질문으로 익히는 초등 한국사 활동지입니다.",
    concept: "백제는 아름다운 문화와 활발한 교류로 기억되는 나라입니다. 아이에게는 '다른 나라와 생각과 물건을 주고받던 세련된 나라'라고 설명하면 이해가 쉽습니다.",
    easy: "백제는 예쁜 무늬와 멋진 문화재를 많이 남긴 나라야. 바다를 통해 다른 나라와도 만나고, 좋은 기술과 문화를 주고받았어. 그래서 백제 이야기는 문화재를 보며 시작하면 재미있어.",
    activities: ["무령왕릉에서 발견된 물건 상상하기", "백제 문화재 안내판 한 줄 쓰기", "교류가 왜 필요한지 친구 관계에 빗대어 말하기", "백제 무늬를 보고 나만의 문양 만들기"],
    quiz: ["백제는 어떤 문화로 많이 기억되나요?", "무령왕릉은 우리에게 무엇을 알려줄까요?", "백제가 다른 나라와 교류하면 어떤 점이 좋았을까요?", "문화재를 볼 때 가장 먼저 살펴볼 것은 무엇인가요?", "백제를 소개하는 문장을 하나 써보세요."],
  },
  {
    slug: "silla-worksheet",
    title: "신라 워크지",
    category: "한국사 자료",
    age: "초등 3~5학년, 삼국 통일과 경주 문화에 관심 있는 아이",
    desc: "신라와 통일 신라, 화랑, 불국사와 석굴암을 아이가 이야기로 이해하도록 돕는 엄마표 한국사 자료입니다.",
    concept: "신라는 오랜 시간 힘을 기른 뒤 삼국을 통일한 나라입니다. 경주에 남아 있는 유적을 떠올리며 '오래 버티고 문화를 꽃피운 나라'로 설명하면 좋습니다.",
    easy: "신라는 처음부터 가장 강한 나라는 아니었어. 하지만 오래 노력하고 주변 나라와 힘을 겨루면서 결국 삼국을 통일했어. 경주에 가면 신라 사람들이 남긴 절, 탑, 무덤을 볼 수 있어.",
    activities: ["경주 지도에서 불국사와 첨성대 찾아보기", "화랑에게 필요한 마음가짐 쓰기", "신라 문화재 엽서 만들기", "통일 후 달라졌을 생활 상상하기"],
    quiz: ["신라는 어떤 일을 한 나라로 자주 기억되나요?", "화랑은 어떤 마음가짐이 필요했을까요?", "경주에는 왜 신라 유적이 많을까요?", "불국사 같은 문화재를 보존해야 하는 까닭은 무엇인가요?", "신라를 소개하는 제목을 붙여보세요."],
  },
  {
    slug: "king-sejong-worksheet",
    title: "세종대왕 워크지",
    category: "한국사 자료",
    age: "7세~초등 저학년, 한글과 역사 인물에 관심 있는 아이",
    desc: "세종대왕과 한글 창제, 백성을 생각한 발명과 정책을 아이와 대화하며 익히는 인물 활동지입니다.",
    concept: "세종대왕은 백성이 쉽게 읽고 쓸 수 있도록 한글을 만든 왕입니다. 아이에게는 '사람들이 자기 생각을 글로 쓸 수 있게 도와준 왕'이라고 말하면 좋습니다.",
    easy: "옛날에는 글을 배우기 어려운 사람이 많았어. 세종대왕은 사람들이 더 쉽게 읽고 쓰면 좋겠다고 생각했어. 그래서 우리말을 적을 수 있는 한글을 만들었고, 우리는 지금도 그 글자를 쓰고 있어.",
    activities: ["내 이름의 자음과 모음 찾아보기", "세종대왕에게 감사 편지 쓰기", "한글이 없었다면 불편했을 일 말하기", "내가 왕이라면 만들고 싶은 제도 그리기"],
    quiz: ["세종대왕은 어떤 글자를 만들었나요?", "한글이 생겨서 사람들은 무엇을 더 쉽게 할 수 있었나요?", "세종대왕이 백성을 생각했다는 말은 무슨 뜻일까요?", "자음과 모음은 어떻게 만나 글자가 되나요?", "세종대왕에게 하고 싶은 말을 써보세요."],
  },
  {
    slug: "yi-sun-sin-worksheet",
    title: "이순신 워크지",
    category: "한국사 자료",
    age: "초등 저학년~중학년, 인물 이야기와 책임감 주제에 관심 있는 아이",
    desc: "이순신 장군의 용기, 책임감, 거북선과 임진왜란 이야기를 아이 눈높이 질문으로 풀어보는 활동지입니다.",
    concept: "이순신 장군은 어려운 상황에서도 나라를 지키기 위해 끝까지 책임을 다한 인물입니다. 전쟁의 무서움보다 '포기하지 않는 마음'에 초점을 맞추면 아이가 받아들이기 쉽습니다.",
    easy: "이순신 장군은 바다에서 나라를 지킨 사람이야. 힘든 일이 많았지만 맡은 일을 포기하지 않았어. 그래서 많은 사람이 이순신 장군을 용기 있는 사람으로 기억해.",
    activities: ["거북선의 특징을 보고 나만의 배 그리기", "용기를 낸 경험 한 가지 쓰기", "이순신 장군에게 응원 문장 보내기", "책임감이 필요한 상황 역할놀이하기"],
    quiz: ["이순신 장군은 어디에서 나라를 지켰나요?", "거북선은 왜 특별한 배로 알려져 있나요?", "용기와 무모함은 어떻게 다를까요?", "이순신 장군이 포기하지 않은 까닭은 무엇일까요?", "내가 맡은 일을 끝까지 한 경험을 써보세요."],
  },
  {
    slug: "proverb-worksheet",
    title: "속담 워크지",
    category: "속담·사자성어",
    age: "7세~초등 저학년, 문해력과 생활 어휘를 늘리고 싶은 아이",
    desc: "생활 속 상황으로 속담 뜻을 이해하고, 짧은 이야기 만들기까지 이어가는 초등 문해력 활동지입니다.",
    concept: "속담은 옛사람들의 경험과 지혜가 짧은 문장에 담긴 말입니다. 아이가 뜻만 외우면 금방 잊기 때문에 실제 상황과 연결하는 것이 중요합니다.",
    easy: "속담은 긴 이야기를 짧고 재미있게 말하는 방법이야. 예를 들어 '가는 말이 고와야 오는 말이 곱다'는 내가 예쁘게 말하면 상대도 예쁘게 말하기 쉽다는 뜻이야.",
    activities: ["오늘 있었던 일에 어울리는 속담 찾기", "속담 그림 카드 만들기", "속담의 앞부분만 보고 뒷부분 맞히기", "속담으로 짧은 만화 그리기"],
    quiz: ["가는 말이 고와야 오는 말이 곱다는 무슨 뜻인가요?", "티끌 모아 태산은 어떤 상황에서 쓸 수 있나요?", "속담을 외우기보다 상황으로 익히면 좋은 까닭은 무엇인가요?", "오늘 내 생활에 어울리는 속담을 하나 골라보세요.", "새로운 속담을 하나 만들어보세요."],
  },
  {
    slug: "four-character-idiom-worksheet",
    title: "사자성어 워크지",
    category: "속담·사자성어",
    age: "초등 2~5학년, 어휘력과 표현력을 넓히고 싶은 아이",
    desc: "사자성어를 뜻과 한자 암기만으로 끝내지 않고 상황, 이야기, 짧은 글쓰기로 익히는 엄마표 어휘 자료입니다.",
    concept: "사자성어는 네 글자 안에 상황과 교훈이 담긴 표현입니다. 처음에는 한자를 모두 외우기보다 어떤 상황에서 쓰는 말인지 아는 것이 더 중요합니다.",
    easy: "사자성어는 네 글자로 된 짧은 표현이야. '일석이조'는 돌 하나로 새 두 마리를 잡는다는 뜻인데, 한 가지 일을 해서 좋은 결과가 두 가지 생겼을 때 쓸 수 있어.",
    activities: ["사자성어와 어울리는 생활 장면 찾기", "오늘 하루를 사자성어 하나로 표현하기", "네 칸 만화로 뜻 설명하기", "비슷한 뜻과 반대 뜻 말 찾아보기"],
    quiz: ["일석이조는 어떤 상황에서 쓰나요?", "작심삼일은 어떤 마음을 말하나요?", "사자성어를 상황과 함께 익히면 왜 좋을까요?", "오늘 배운 사자성어로 한 문장을 만들어보세요.", "내가 자주 겪는 일을 사자성어로 표현해보세요."],
  },
  {
    slug: "elementary-reading-worksheet",
    title: "초등 독해 활동지",
    category: "독해 자료",
    age: "초등 1~3학년, 글을 읽고 중심 내용을 찾는 연습이 필요한 아이",
    desc: "짧은 글을 읽고 중심 문장, 핵심 낱말, 내 생각 쓰기까지 이어가는 초등 독해 엄마표 활동지입니다.",
    concept: "독해는 글을 빨리 읽는 기술이 아니라 중요한 내용을 찾아 자기 말로 설명하는 힘입니다. 아이가 문제를 많이 푸는 것보다 한 글을 깊게 이해하는 경험이 중요합니다.",
    easy: "독해는 글 속에서 중요한 이야기를 찾는 일이야. 글을 다 읽은 뒤 '그래서 이 글은 무슨 말을 하고 싶었지?'라고 생각해보면 중심 내용을 찾는 데 도움이 돼.",
    activities: ["글에서 가장 중요한 문장 밑줄 긋기", "처음-가운데-끝으로 내용 나누기", "모르는 낱말 뜻을 문장 속에서 추측하기", "읽은 뒤 내 생각 한 문장 쓰기"],
    quiz: ["글에서 중심 내용은 무엇인가요?", "가장 중요한 낱말 세 개를 고르면 무엇인가요?", "글쓴이가 말하고 싶은 것은 무엇일까요?", "내가 주인공이라면 어떻게 했을까요?", "이 글에 어울리는 제목을 다시 붙여보세요."],
  },
  {
    slug: "hangeul-final-consonant-worksheet",
    title: "한글 받침 워크지",
    category: "한글 자료",
    age: "6~8세, 받침 읽기와 쓰기를 헷갈리는 아이",
    desc: "받침이 있는 낱말을 소리 내어 읽고, 그림과 문장 속에서 자연스럽게 익히는 유아·초등 입문 한글 자료입니다.",
    concept: "받침은 글자의 아래에 붙어 소리를 마무리해주는 자음입니다. 아이가 받침을 어려워하는 것은 자연스러운 과정이므로 낱말과 그림, 입모양을 함께 사용하면 좋습니다.",
    easy: "받침은 글자 아래에 붙어서 소리를 끝내주는 친구야. '강'에서 ㄱ은 아래에 있으니까 받침이야. 받침이 있으면 소리가 조금 단단하게 끝나는 느낌이 나.",
    activities: ["받침 있는 낱말과 없는 낱말 분류하기", "입으로 천천히 소리 내며 끝소리 느끼기", "그림을 보고 받침 낱말 찾기", "받침 낱말로 짧은 문장 만들기"],
    quiz: ["강, 나무, 집 중 받침이 있는 낱말은 무엇인가요?", "'손'의 받침은 어떤 자음인가요?", "받침을 읽을 때 천천히 소리 내면 좋은 까닭은 무엇인가요?", "ㄱ 받침이 들어간 낱말을 하나 말해보세요.", "내 이름에는 받침이 있나요?"],
  },
  {
    slug: "maze-printable",
    title: "미로찾기 프린트",
    category: "미로찾기",
    age: "5~8세, 연필 잡기와 집중 시간을 늘리고 싶은 아이",
    desc: "길을 따라가며 눈과 손의 협응, 방향 감각, 문제 해결력을 자연스럽게 연습하는 유아·초등 미로찾기 자료입니다.",
    concept: "미로찾기는 단순한 놀이처럼 보이지만 아이가 눈으로 길을 예측하고 손으로 선을 조절하는 활동입니다. 정답을 빨리 찾는 것보다 멈추고 다시 생각하는 경험이 더 중요합니다.",
    easy: "미로찾기는 출발점에서 도착점까지 길을 찾는 놀이야. 막힌 길을 만나도 실패가 아니야. 다시 돌아가서 다른 길을 찾으면 돼. 그래서 미로는 생각하는 힘을 길러줘.",
    activities: ["손가락으로 먼저 길 찾아보기", "연필로 천천히 선 긋기", "막힌 길에 작은 표시하기", "내가 직접 미로를 만들어 부모에게 풀어보게 하기"],
    quiz: ["미로에서 막힌 길을 만나면 어떻게 해야 하나요?", "손가락으로 먼저 따라가면 어떤 점이 좋을까요?", "미로찾기는 어떤 힘을 길러줄까요?", "내가 만든 미로에는 어떤 그림을 넣고 싶나요?", "끝까지 해낸 뒤 어떤 기분이 들었나요?"],
  },
];

const bySlug = Object.fromEntries(items.map((item) => [item.slug, item]));

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function related(current) {
  const preferred = [
    "goguryeo-worksheet", "baekje-worksheet", "silla-worksheet", "king-sejong-worksheet",
    "yi-sun-sin-worksheet", "proverb-worksheet", "four-character-idiom-worksheet",
    "elementary-reading-worksheet", "hangeul-final-consonant-worksheet", "maze-printable",
  ].filter((slug) => slug !== current.slug).slice(0, 5);
  return preferred.map((slug) => {
    const item = bySlug[slug];
    return `<a href="/worksheets/${item.slug}.html"><strong>${esc(item.title)}</strong><span>${esc(item.category)} · ${esc(item.desc)}</span></a>`;
  }).join("");
}

function faq(item) {
  const questions = [
    ["몇 살부터 사용할 수 있나요?", `${item.title}는 ${item.age}에게 가장 잘 맞습니다. 다만 나이보다 중요한 것은 아이가 주제에 흥미를 보이는지입니다. 처음에는 한 장을 모두 끝내려고 하지 말고, 부모가 설명을 읽어주고 아이가 한두 문항만 직접 해보는 방식으로 시작해도 충분합니다.`],
    ["PDF만 출력해서 풀리면 되나요?", "출력물만 주고 혼자 풀게 하면 자료의 효과가 줄어듭니다. 아이가 모르는 단어를 만났을 때 부모가 한 문장으로 풀어주고, 활동 후에는 아이가 자기 말로 설명하게 해주세요. 토이포포 자료실은 다운로드보다 대화와 활용법을 더 중요하게 봅니다."],
    ["아이가 쓰기를 싫어하면 어떻게 하나요?", "쓰기 양을 줄이고 말하기나 그림 활동으로 먼저 바꾸세요. 아이가 내용을 이해한 뒤 마지막에 단어 하나, 문장 하나만 적어도 됩니다. 억지로 많이 쓰게 하면 자료 자체를 싫어할 수 있으니 짧고 기분 좋게 끝내는 편이 좋습니다."],
    ["하루에 얼마나 하면 좋나요?", "유아와 초등 저학년은 10~15분 정도가 적당합니다. 집중이 잘 되는 날은 조금 더 이어가도 되지만, 매일 오래 하는 것보다 짧게 자주 반복하는 편이 부담이 적습니다. 아이가 질문을 시작하면 그날의 목표는 이미 충분히 달성한 것입니다."],
    ["정답을 꼭 맞혀야 하나요?", "정답보다 아이가 왜 그렇게 생각했는지 말하는 과정이 더 중요합니다. 특히 역사, 속담, 독해 자료는 하나의 정답을 외우는 것보다 맥락을 이해하는 힘을 키우는 자료입니다. 틀린 답이 나와도 바로 고치기보다 다시 읽고 생각할 시간을 주세요."],
  ];
  return questions.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("");
}

function worksheetPage(item) {
  const description = `${item.desc} 부모 활용법, 쉬운 설명, 활동 예시, 퀴즈와 PDF 다운로드 영역을 함께 제공합니다.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: item.title, description, mainEntityOfPage: `https://toypoppo.kr/worksheets/${item.slug}.html`, dateModified: today, author: { "@type": "Organization", name: "토이포포" }, publisher: { "@type": "Organization", name: "토이포포" }, inLanguage: "ko-KR" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://toypoppo.kr/" },
        { "@type": "ListItem", position: 2, name: "엄마표 자료실", item: "https://toypoppo.kr/worksheets/" },
        { "@type": "ListItem", position: 3, name: item.title, item: `https://toypoppo.kr/worksheets/${item.slug}.html` },
      ] },
    ],
  };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.title)} | 엄마표 자료실 | 토이포포</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://toypoppo.kr/worksheets/${item.slug}.html"><meta property="og:title" content="${esc(item.title)} | 토이포포"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="https://toypoppo.kr/worksheets/${item.slug}.html"><meta property="og:site_name" content="토이포포"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body>${nav}<main class="article-shell"><article class="article-card readable-article"><p class="breadcrumb"><a href="/">홈</a> / <a href="/worksheets/">엄마표 자료실</a> / ${esc(item.title)}</p><p class="eyebrow">${esc(item.category)}</p><h1>${esc(item.title)}</h1><p class="lead">${esc(item.desc)} PDF를 내려받기 전에 부모가 어떻게 설명하고 어떤 질문으로 이어갈지 먼저 읽을 수 있게 구성했습니다.</p>
<section><h2>이 자료는 어떤 아이에게 좋은가</h2><p>${esc(item.age)}에게 좋습니다. 학교 진도보다 아이가 주제를 낯설어하지 않게 만드는 것이 먼저입니다. 특히 집에서 엄마표 학습을 시작할 때는 '오늘 한 장 끝내기'보다 '오늘 한 가지를 말해보기'가 훨씬 오래 남습니다. 아이가 읽기와 쓰기에 자신이 없더라도 부모가 먼저 이야기로 열어주면 부담이 줄어듭니다.</p><div class="summary-box"><strong>이렇게 시작해 보세요</strong><ul><li>자료를 바로 풀기 전에 제목을 보고 아이가 아는 것을 먼저 말하게 합니다.</li><li>모르는 단어는 사전식 설명보다 생활 장면에 빗대어 풀어줍니다.</li><li>정답 확인보다 아이가 자기 말로 설명하는 시간을 더 길게 둡니다.</li></ul></div></section>
<section><h2>주제 설명</h2><p>${esc(item.concept)} 이 자료는 단순 암기를 목표로 하지 않습니다. 아이가 배경을 알고, 낱말을 이해하고, 짧은 질문에 자기 생각을 붙이는 것을 목표로 합니다. 그래서 부모가 먼저 주제를 한두 문장으로 말해준 뒤 활동지로 넘어가면 아이가 훨씬 편안하게 받아들입니다.</p><p>엄마표 자료를 사용할 때 가장 흔한 실수는 문제를 많이 풀수록 공부가 잘 된다고 생각하는 것입니다. 하지만 유아와 초등 저학년은 한 문제를 깊게 이야기하는 경험이 더 중요합니다. 예를 들어 아이가 답을 짧게 말했더라도 "왜 그렇게 생각했어?"라고 한 번 더 물어보면 독해, 표현, 사고력이 함께 자랍니다.</p></section>
<section><h2>부모가 활용하는 방법</h2><p>첫째, 자료를 출력하기 전 부모가 먼저 전체 흐름을 훑어보세요. 아이가 모를 만한 단어를 미리 표시해두면 설명이 훨씬 자연스러워집니다. 둘째, 아이에게 모든 문제를 한 번에 시키지 말고 읽기, 말하기, 쓰기, 그림 활동 중 하나만 골라 시작하세요. 셋째, 아이가 지루해하기 전에 끝내는 것이 좋습니다. 좋은 기억으로 끝난 자료는 다음에 다시 꺼내기 쉽습니다.</p><p>활동을 마친 뒤에는 결과물을 냉장고나 책상 옆에 붙여두세요. 아이는 자신이 해낸 것을 다시 보며 주제를 반복해서 떠올립니다. 특히 한국사와 어휘 자료는 한 번에 외우기 어렵기 때문에 며칠 뒤 같은 질문을 가볍게 다시 던지는 방식이 효과적입니다.</p></section>
<section><h2>아이에게 설명하는 쉬운 말</h2><p>${esc(item.easy)}</p><p>설명은 길수록 좋은 것이 아닙니다. 아이가 고개를 끄덕이면 바로 활동으로 넘어가고, 아이가 질문하면 그때 한 문장씩 더해 주세요. 부모가 완벽하게 설명하려고 하면 말이 길어지고, 아이는 핵심을 놓치기 쉽습니다. 짧은 말, 쉬운 예시, 아이가 아는 경험이 가장 좋은 설명입니다.</p></section>
<section><h2>활동 예시</h2><div class="quick-grid">${item.activities.map((activity, index) => `<div><strong>활동 ${index + 1}</strong><span>${esc(activity)}</span></div>`).join("")}</div><p>활동은 순서대로 모두 할 필요가 없습니다. 아이가 좋아하는 방식 하나만 골라도 충분합니다. 쓰기를 싫어하는 아이는 말하기와 그림으로, 말하기를 어려워하는 아이는 선택형 질문으로 시작하면 됩니다.</p></section>
<section><h2>퀴즈</h2><ol>${item.quiz.map((q) => `<li>${esc(q)}</li>`).join("")}</ol><p>퀴즈를 낼 때는 바로 정답을 요구하지 말고, 아이가 자료에서 힌트를 찾게 해주세요. 답을 맞힌 뒤에는 "어디를 보고 그렇게 생각했어?"라고 물어보면 읽은 내용을 근거로 말하는 연습이 됩니다.</p></section>
<section id="download"><h2>PDF 다운로드</h2><p>인쇄용 PDF는 자료 구성과 가독성을 점검한 뒤 순차적으로 연결합니다. 현재는 부모 활용법과 활동 예시를 먼저 공개하며, PDF가 연결되면 같은 페이지에서 내려받을 수 있게 업데이트합니다.</p><div class="summary-box"><strong>다운로드 전 안내</strong><p>PDF만 풀고 끝내기보다, 위의 쉬운 설명과 퀴즈를 함께 사용해 주세요. 토이포포 엄마표 자료실은 출력물보다 부모와 아이의 대화를 더 중요하게 생각합니다.</p><p><a class="button primary" href="#" aria-disabled="true">PDF 다운로드 준비 중</a></p></div></section>
<section><h2>자주 묻는 질문</h2>${faq(item)}</section>
<section><h2>함께 보면 좋은 글</h2><div class="related-grid">${related(item)}</div></section>
<section class="source-note"><h2>최종 업데이트 날짜</h2><p>${today}</p><p>아이의 수준과 흥미에는 개인차가 있습니다. 자료가 너무 쉽거나 어렵게 느껴지면 문제 수를 줄이고 부모 설명을 더해 조절해 주세요.</p></section></article></main>${footer}</body></html>`;
}

function mainPage() {
  const categories = [
    ["한국사 자료", ["goguryeo-worksheet", "baekje-worksheet", "silla-worksheet", "king-sejong-worksheet", "yi-sun-sin-worksheet"]],
    ["한글 자료", ["hangeul-final-consonant-worksheet"]],
    ["초등 독해", ["elementary-reading-worksheet"]],
    ["속담·사자성어", ["proverb-worksheet", "four-character-idiom-worksheet"]],
    ["유아 놀이자료", ["maze-printable"]],
  ];
  const card = (slug) => {
    const item = bySlug[slug];
    return `<a href="/worksheets/${item.slug}.html"><strong>${esc(item.title)}</strong><span>${esc(item.desc)}</span></a>`;
  };
  const allLinks = items.map((item) => card(item.slug)).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "엄마표 자료실",
    description: "한국사, 한글, 독해, 속담, 사자성어, 수학 놀이, 색칠공부, 미로찾기와 초등 활동지를 부모 활용법과 함께 제공하는 토이포포 교육자료 허브입니다.",
    url: "https://toypoppo.kr/worksheets/",
    dateModified: today,
    inLanguage: "ko-KR",
  };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>엄마표 자료실 | 한국사 한글 독해 워크지 허브 | 토이포포</title><meta name="description" content="한국사, 한글, 독해, 속담, 사자성어, 수학 놀이, 색칠공부, 미로찾기와 초등 활동지를 부모 활용법과 함께 제공하는 엄마표 교육자료 허브입니다."><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://toypoppo.kr/worksheets/"><meta property="og:title" content="엄마표 자료실 | 토이포포"><meta property="og:description" content="PDF만 제공하지 않고 부모 설명법, 활동 예시, 퀴즈까지 함께 제공하는 엄마표 학습자료 허브입니다."><meta property="og:type" content="website"><meta property="og:url" content="https://toypoppo.kr/worksheets/"><meta property="og:site_name" content="토이포포"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675052661212934" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body>${nav}<main><section class="hero compact"><p class="eyebrow">TOYPOPPO WORKSHEETS</p><h1>엄마표 자료실</h1><p>자료만 던져주는 공간이 아니라, 부모가 아이에게 어떻게 설명하고 어떤 질문으로 이어갈지 함께 안내하는 교육자료 허브입니다.</p></section>
<section class="section"><div class="section-head"><h2>오늘의 워크지</h2><p>오늘 하나만 고른다면, 읽고 말하고 짧게 써볼 수 있는 자료부터 시작해 보세요.</p></div><div class="link-grid">${["elementary-reading-worksheet", "hangeul-final-consonant-worksheet", "maze-printable"].map(card).join("")}</div></section>
<section class="section"><div class="section-head"><h2>인기 자료</h2><p>부모들이 저장해두고 반복해서 쓰기 좋은 기초 자료입니다.</p></div><div class="link-grid">${["king-sejong-worksheet", "yi-sun-sin-worksheet", "proverb-worksheet", "four-character-idiom-worksheet"].map(card).join("")}</div></section>
${categories.map(([title, slugs]) => `<section class="section"><div class="section-head"><h2>${esc(title)}</h2><p>${esc(title)}를 아이 수준에 맞게 설명하고 활동으로 연결할 수 있게 정리했습니다.</p></div><div class="link-grid">${slugs.map(card).join("")}</div></section>`).join("")}
<section class="section"><div class="section-head"><h2>수학 놀이</h2><p>수 세기, 분류, 규칙 찾기, 도형 놀이 자료를 순차적으로 추가할 예정입니다. 현재는 미로찾기와 독해 활동처럼 사고 과정을 설명하는 자료부터 제공합니다.</p></div><div class="link-grid">${card("maze-printable")}${card("elementary-reading-worksheet")}</div></section>
<section class="section"><div class="section-head"><h2>색칠공부</h2><p>색칠공부는 단순 그림 자료가 아니라 관찰, 색 이름, 손 조절을 함께 연습하는 방향으로 준비합니다. 관련 자료는 최근 업데이트에 순차적으로 추가됩니다.</p></div><div class="link-grid">${card("maze-printable")}${card("hangeul-final-consonant-worksheet")}</div></section>
<section class="section"><div class="section-head"><h2>초등 활동지</h2><p>한국사, 어휘, 독해를 초등 저학년 눈높이로 묶었습니다.</p></div><div class="link-grid">${allLinks}</div></section>
<section class="section"><div class="section-head"><h2>최근 업데이트</h2><p>새 자료와 보강된 설명을 한눈에 확인하세요.</p></div><div class="link-grid">${items.slice(-5).reverse().map((item) => `<a href="/worksheets/${item.slug}.html"><strong>${esc(item.title)}</strong><span>최종 업데이트 ${today} · ${esc(item.category)}</span></a>`).join("")}</div></section></main>${footer}</body></html>`;
}

function updateSitemap() {
  const file = "sitemap.xml";
  let xml = fs.readFileSync(file, "utf8");
  const urls = ["/worksheets/", ...items.map((item) => `/worksheets/${item.slug}.html`)];
  urls.forEach((url) => {
    const full = `https://toypoppo.kr${url}`;
    const entry = `  <url><loc>${full}</loc><lastmod>${today}</lastmod><priority>${url === "/worksheets/" ? "0.9" : "0.8"}</priority></url>`;
    const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`  <url><loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>`);
    if (xml.includes(full)) xml = xml.replace(re, entry);
    else xml = xml.replace("</urlset>", `${entry}\n</urlset>`);
  });
  fs.writeFileSync(file, xml, "utf8");
}

function main() {
  fs.mkdirSync("worksheets", { recursive: true });
  fs.writeFileSync(path.join("worksheets", "index.html"), mainPage(), "utf8");
  items.forEach((item) => fs.writeFileSync(path.join("worksheets", `${item.slug}.html`), worksheetPage(item), "utf8"));
  updateSitemap();
}

main();
