const regionOrder = ["전국", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "충청", "전라", "강원", "경상", "제주", "기타"];

const fallbackFairs = [
  {
    region: "서울",
    title: "서울 웨딩박람회",
    date: "2026년 3월 예정",
    place: "서울 주요 전시장",
    benefit: "스드메, 웨딩홀, 혼수 상담",
    description: "서울 지역 예비부부를 위한 웨딩 준비 상담 행사입니다.",
    link: "#",
    image: ""
  }
];

let allFairs = [];
let visibleCount = 12;
const loadMore = document.querySelector('#fair-load-more');
const resultCount = document.querySelector('#fair-results-count');
let activeRegion = document.body.dataset.defaultRegion || "전국";
const dataPath = document.body.dataset.dataPath || "data/fairs.json";
const todayKst = getKoreaToday();

const grid = document.querySelector("#fair-grid");
const tabs = document.querySelector("#region-tabs");
const search = document.querySelector("#fair-search");
const empty = document.querySelector("#empty-state");
const sectionTargets = document.querySelectorAll("[data-fair-section]");

async function loadFairs() {
  try {
    const response = await fetch(dataPath, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load fairs.json");
    allFairs = await response.json();
  } catch (error) {
    console.warn("웨딩박람회 데이터를 불러오지 못했습니다.", error);
    allFairs = [];
    return;
  }

  renderTabs();
  renderFairSections();
  renderFairs();
}

function renderTabs() {
  const regions = new Set(getActiveFairs().map((fair) => fair.region || "기타"));
  const ordered = regionOrder.filter((region) => region === "전국" || regions.has(region));
  tabs.innerHTML = ordered.map((region) => {
    const pressed = region === activeRegion ? "true" : "false";
    return `<button class="tab" type="button" aria-pressed="${pressed}" data-region="${region}">${region}</button>`;
  }).join("");
}

function renderFairs() {
  const keyword = normalize(search.value);
  const filtered = getActiveFairs().filter((fair) => {
    const regionMatch = activeRegion === "전국" || fair.region === activeRegion;
    const haystack = normalize([fair.region, fair.title, fair.date, fair.place, fair.benefit, fair.description].join(" "));
    return regionMatch && (!keyword || haystack.includes(keyword));
  });

  filtered.sort((a,b) => getFairSortValue(a)-getFairSortValue(b));
  grid.innerHTML = (loadMore ? filtered.slice(0,visibleCount) : filtered).map(renderFairCard).join("");
  empty.hidden = filtered.length > 0;
  if(loadMore) loadMore.hidden = visibleCount >= filtered.length;
  if(resultCount) resultCount.textContent = `${activeRegion} ${filtered.length}개`;
}

function renderFairSections() {
  sectionTargets.forEach((target) => {
    const type = target.dataset.fairSection;
    const fairs = getCuratedFairs(type);
    if (target.classList.contains("mini-fair-list")) {
      target.innerHTML = fairs.map(renderMiniFair).join("");
      return;
    }
    target.innerHTML = fairs.map(renderFairCard).join("");
  });
}

function getCuratedFairs(type) {
  const withLinks = getActiveFairs().filter((fair) => fair.link && fair.link !== "#");
  if (type === "featured") {
    return [...withLinks].sort((a, b) => getFairSortValue(a) - getFairSortValue(b)).slice(0, 6);
  }
  if (type === "popular") {
    return withLinks
      .filter((fair) => /서울|부산|경기|인천/.test(fair.region || ""))
      .slice(0, 5);
  }
  if (type === "urgent") {
    return [...withLinks]
      .sort((a, b) => getFairSortValue(a) - getFairSortValue(b))
      .slice(0, 5);
  }
  return withLinks.slice(0, 4);
}

function renderMiniFair(fair) {
  const detailUrl = fair.detailUrl ? escapeAttribute(fair.detailUrl) : "";
  const href = detailUrl || escapeAttribute(fair.link || "#");
  return `
    <article class="mini-fair">
      <a href="${href}">
        <strong>${escapeHtml(fair.title || "웨딩박람회")}</strong>
        <span>${escapeHtml(fair.date || "일정 확인")} · ${escapeHtml(fair.region || "전국")}</span>
      </a>
      <a class="mini-cta" href="${escapeAttribute(fair.link || "#")}" target="_blank" rel="sponsored noopener">무료초대권 신청</a>
    </article>
  `;
}

function renderFairCard(fair) {
  const safeTitle = escapeHtml(fair.title || "웨딩박람회");
  const detailUrl = fair.detailUrl ? escapeAttribute(fair.detailUrl) : "";
  const titleHtml = detailUrl
    ? `<a class="fair-title-link" href="${detailUrl}">${safeTitle}</a>`
    : safeTitle;
  const image = fair.image
    ? `<img src="${escapeAttribute(fair.image)}" alt="${safeTitle} 이미지" loading="lazy" onerror="this.remove()">`
    : `<span class="placeholder">${safeTitle}</span>`;

  return `
    <article class="fair-card">
      <div class="fair-image">${image}</div>
      <div class="fair-body">
        <div class="fair-meta">
          <span class="pill">${escapeHtml(fair.region || "전국")}</span>
          <span class="pill">${escapeHtml(fair.category || "웨딩박람회")}</span>
        </div>
        <h3>${titleHtml}</h3>
        <ul class="fair-details">
          <li class="detail-date"><strong>일정</strong><span>${escapeHtml(fair.date || "일정 확인 필요")}</span></li>
          <li class="detail-place"><strong>장소</strong><span>${escapeHtml(fair.place || "장소 확인 필요")}</span></li>
          <li class="detail-benefit"><strong>혜택</strong><span>${escapeHtml(fair.benefit || "사전 신청 혜택 확인")}</span></li>
        </ul>
        ${detailUrl ? `<a class="fair-detail-link" href="${detailUrl}">상세 정보 보기</a>` : ""}
        <a class="fair-cta" href="${escapeAttribute(fair.link || "#")}" target="_blank" rel="sponsored noopener">무료초대권 신청</a>
      </div>
    </article>
  `;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getActiveFairs() {
  return allFairs.filter((fair) => !isExpiredFair(fair));
}

function isExpiredFair(fair) {
  if (fair.status !== "active") return true;
  const range = parseFairDateRange(fair.date);
  if (!range || !range.end) return true;
  return range.end.getTime() < todayKst.getTime();
}

function getFairSortValue(fair) {
  if (fair.startDate) {
    const start = new Date(`${fair.startDate}T00:00:00+09:00`);
    if (!Number.isNaN(start.getTime())) return start.getTime();
  }
  const range = parseFairDateRange(fair.date);
  if (!range || !range.start) return Number.MAX_SAFE_INTEGER;
  return range.start.getTime();
}

function getKoreaToday() {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return new Date(year, month - 1, day);
}

function parseFairDateRange(dateText) {
  const text = String(dateText || "");
  if (!/\d{1,4}\s*\uB144|\d{1,2}\s*\uC6D4/.test(text)) return null;

  const currentYearMatch = text.match(/(\d{4})\s*\uB144/);
  let currentYear = currentYearMatch ? Number(currentYearMatch[1]) : todayKst.getFullYear();
  const dates = text.split("~").map((part) => parseDatePart(part, currentYear)).filter(Boolean);

  if (!dates.length) return null;
  return { start: dates[0], end: dates[dates.length - 1] };
}

function parseDatePart(part, fallbackYear) {
  const text = String(part || "");
  const full = text.match(/(\d{4})\s*\uB144\s*(\d{1,2})\s*\uC6D4\s*(\d{1,2})\s*\uC77C/);
  if (full) return new Date(Number(full[1]), Number(full[2]) - 1, Number(full[3]));

  const monthDay = text.match(/(\d{1,2})\s*\uC6D4\s*(\d{1,2})\s*\uC77C/);
  if (monthDay) return new Date(fallbackYear, Number(monthDay[1]) - 1, Number(monthDay[2]));

  return null;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-region]");
  if (!button) return;
  activeRegion = button.dataset.region;
  visibleCount = 12;
  renderTabs();
  renderFairs();
});

search.addEventListener("input", () => {visibleCount=12;renderFairs();});
loadMore?.addEventListener('click',()=>{visibleCount+=12;renderFairs();});
loadFairs();

