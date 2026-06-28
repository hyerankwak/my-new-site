(() => {
  const form = document.getElementById("cultureSearchForm");
  if (!form) return;

  const status = document.getElementById("apiStatus");
  const section = document.getElementById("resultSection");
  const results = document.getElementById("cultureResults");
  const count = document.getElementById("resultCount");
  const loading = document.getElementById("loadingState");
  const error = document.getElementById("errorState");
  const empty = document.getElementById("emptyState");
  const typeSelect = document.getElementById("dataType");
  const dateFields = [...document.querySelectorAll(".date-field")];
  const API_BASE = "https://toypoppo-public-data.rururubs.workers.dev";
  const SCIENCE_DATA_URL = "/assets/data/science-museums.json?v=20260628b";
  const regionNames = {
    서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
    광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
    경기: "경기도", 강원: "강원", 충북: "충청북도", 충남: "충청남도",
    전북: "전라북도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도", 제주: "제주",
  };
  const environmentPanel = document.getElementById("environmentPanel");
  const weatherSummary = document.getElementById("weatherSummary");
  const airSummary = document.getElementById("airSummary");
  const regionGrid = {
    서울: [60, 127], 부산: [98, 76], 대구: [89, 90], 인천: [55, 124],
    광주: [58, 74], 대전: [67, 100], 울산: [102, 84], 세종: [66, 103],
    경기: [60, 120], 강원: [73, 134], 충북: [69, 107], 충남: [68, 100],
    전북: [63, 89], 전남: [51, 67], 경북: [89, 91], 경남: [91, 77], 제주: [52, 38],
  };

  const today = new Date();
  const afterThreeMonths = new Date(today);
  afterThreeMonths.setMonth(afterThreeMonths.getMonth() + 3);
  const dateValue = (date) => date.toISOString().slice(0, 10);
  document.getElementById("from").value = dateValue(today);
  document.getElementById("to").value = dateValue(afterThreeMonths);

  const text = (value, fallback = "정보 없음") => value && String(value).trim() ? String(value).trim() : fallback;
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);

  function card(item) {
    const officialUrl = safeUrl(item.url);
    const imageUrl = safeUrl(item.image);
    const media = imageUrl
      ? `<img class="culture-card__image" src="${imageUrl}" alt="${text(item.title, "문화행사")} 포스터" loading="lazy" referrerpolicy="no-referrer">`
      : `<div class="culture-card__placeholder" aria-hidden="true">문화<br>행사</div>`;
    return `<article class="culture-card">
      ${media}
      <div>
        <p class="eyebrow">${escapeHtml(text(item.category || item.realm, "공공정보"))}</p>
        <h3>${escapeHtml(text(item.title))}</h3>
        ${item.address ? `<p class="culture-card__meta"><strong>주소</strong> ${escapeHtml(item.address)}</p>` : ""}
        ${item.place ? `<p class="culture-card__meta"><strong>장소</strong> ${escapeHtml(item.place)}</p>` : ""}
        ${item.startDate || item.endDate ? `<p class="culture-card__meta"><strong>기간</strong> ${escapeHtml(text(item.startDate))} ~ ${escapeHtml(text(item.endDate))}</p>` : ""}
        ${item.phone ? `<p class="culture-card__meta"><strong>전화</strong> ${escapeHtml(item.phone)}</p>` : ""}
        ${item.hours ? `<p class="culture-card__meta"><strong>운영</strong> ${escapeHtml(item.hours)}</p>` : ""}
        ${item.closed ? `<p class="culture-card__meta"><strong>휴관</strong> ${escapeHtml(item.closed)}</p>` : ""}
        ${item.fee || item.price ? `<p class="culture-card__meta"><strong>요금</strong> ${escapeHtml(text(item.fee || item.price))}</p>` : ""}
        ${officialUrl ? `<a class="culture-card__link" href="${officialUrl}" target="_blank" rel="noopener noreferrer">공식 정보 확인 →</a>` : ""}
      </div>
    </article>`;
  }

  function syncType() {
    const cultureMode = typeSelect.value === "culture";
    dateFields.forEach((field) => { field.hidden = !cultureMode; });
  }

  async function loadScienceMuseums(params) {
    const response = await fetch(SCIENCE_DATA_URL, { headers: { Accept: "application/json" } });
    const payload = await response.json();
    if (!response.ok) throw new Error("과학관 자료를 불러오지 못했습니다.");

    const sido = String(params.get("sido") || "").trim();
    const sigungu = String(params.get("sigungu") || "").trim();
    const keyword = String(params.get("keyword") || "").trim().toLowerCase();
    const items = (payload.items || []).filter((item) => {
      const haystack = `${item.title} ${item.address}`.toLowerCase();
      return (!sido || item.address.includes(regionNames[sido] || sido))
        && (!sigungu || item.address.includes(sigungu))
        && (!keyword || haystack.includes(keyword));
    });

    return { items, totalCount: items.length, source: payload.source };
  }
  typeSelect.addEventListener("change", syncType);
  syncType();

  function forecastBase() {
    const now = new Date(Date.now() + (9 * 60 * 60 * 1000));
    const slots = [2, 5, 8, 11, 14, 17, 20, 23];
    let hour = slots.filter((slot) => slot <= now.getUTCHours()).pop();
    if (hour === undefined) {
      now.setUTCDate(now.getUTCDate() - 1);
      hour = 23;
    }
    return {
      date: `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`,
      time: `${String(hour).padStart(2, "0")}00`,
    };
  }

  async function loadEnvironment(sido) {
    const grid = regionGrid[sido];
    if (!grid) return;
    environmentPanel.hidden = false;
    weatherSummary.textContent = "확인 중";
    airSummary.textContent = "확인 중";
    const base = forecastBase();
    try {
      const [weatherResponse, airResponse] = await Promise.all([
        fetch(`${API_BASE}/api/forecast?nx=${grid[0]}&ny=${grid[1]}&baseDate=${base.date}&baseTime=${base.time}`),
        fetch(`${API_BASE}/api/air?sido=${encodeURIComponent(sido)}`),
      ]);
      const weather = await weatherResponse.json();
      const air = await airResponse.json();
      const firstTime = weather.items?.[0]?.time;
      const sameTime = (weather.items || []).filter((item) => item.time === firstTime);
      const temperature = sameTime.find((item) => item.category === "TMP")?.value;
      const rain = sameTime.find((item) => item.category === "POP")?.value;
      weatherSummary.textContent = temperature ? `${temperature}℃ · 강수확률 ${rain || "0"}%` : "예보 확인 필요";
      const validAir = (air.items || []).find((item) => item.pm10 && item.pm10 !== "-");
      airSummary.textContent = validAir ? `${validAir.station} PM10 ${validAir.pm10}㎍/㎥` : "측정 정보 확인 필요";
    } catch {
      weatherSummary.textContent = "예보 확인 필요";
      airSummary.textContent = "측정 정보 확인 필요";
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const params = new URLSearchParams(new FormData(form));
    params.set("limit", "20");
    const type = params.get("type");
    const endpoint = type === "culture" ? "culture" : "places";
    loadEnvironment(params.get("sido"));

    section.setAttribute("aria-busy", "true");
    loading.hidden = false;
    error.hidden = true;
    empty.hidden = true;
    results.innerHTML = "";
    count.textContent = "불러오는 중";

    try {
      let payload;
      if (type === "science") {
        payload = await loadScienceMuseums(params);
      } else {
        const response = await fetch(`${API_BASE}/api/${endpoint}?${params.toString()}`, { headers: { Accept: "application/json" } });
        payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "공공데이터를 불러오지 못했습니다.");
      }

      const items = Array.isArray(payload.items) ? payload.items : [];
      status.textContent = "API 연결됨";
      status.classList.remove("is-error");
      count.textContent = `${items.length}개 표시 · 전체 ${payload.totalCount || items.length}개`;
      results.innerHTML = items.map(card).join("");
      empty.hidden = items.length > 0;
      if (!items.length) empty.textContent = "조건에 맞는 결과가 없습니다. 검색 기간이나 검색어를 넓혀 보세요.";
    } catch (err) {
      status.textContent = "연결 확인 필요";
      status.classList.add("is-error");
      error.textContent = `${err.message} 잠시 후 다시 시도하거나 해당 기관의 공식 홈페이지에서 확인해 주세요.`;
      error.hidden = false;
      count.textContent = "검색 실패";
    } finally {
      loading.hidden = true;
      section.setAttribute("aria-busy", "false");
    }
  });
})();
