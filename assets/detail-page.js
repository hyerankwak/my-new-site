(function () {
  const main = document.querySelector("main");
  const hero = document.querySelector(".region-hero");
  const details = document.querySelector(".fair-details");
  const cta = document.querySelector(".region-hero .button.primary");

  if (!main || !hero || !details) return;

  document.body.classList.add("detail-page");

  const title = document.querySelector("h1")?.textContent.trim() || document.title.replace(/\s*\|.*$/, "");
  const rows = Array.from(details.querySelectorAll("li")).map((row) => ({
    key: row.querySelector("strong")?.textContent.trim() || "",
    value: row.querySelector("span")?.textContent.trim() || "",
    cls: row.className || ""
  }));
  const date = rows.find((row) => row.cls.includes("date"))?.value || "";
  const place = rows.find((row) => row.cls.includes("place"))?.value || "";
  const benefit = rows.find((row) => row.cls.includes("benefit"))?.value || "";
  const ctaHref = cta?.href || "#";
  const ogImage = document.querySelector('meta[property="og:image"]')?.content || "";
  if (ogImage) {
    hero.style.setProperty("--detail-og-image", `url("${ogImage.replace(/"/g, "%22")}")`);
  }

  const summary = document.createElement("aside");
  summary.className = "detail-sticky-summary";
  summary.innerHTML = `
    <a class="summary-title" href="#top">${escapeHtml(title)}</a>
    <div class="summary-chip summary-date"><strong>일정</strong><span>${escapeHtml(date)}</span></div>
    <div class="summary-chip summary-place"><strong>장소</strong><span>${escapeHtml(place)}</span></div>
    <div class="summary-chip summary-benefit"><strong>혜택</strong><span>${escapeHtml(benefit)}</span></div>
    <a class="summary-cta" href="${ctaHref}" target="_blank" rel="sponsored noopener">무료초대권 신청</a>
  `;
  document.querySelector(".site-header")?.after(summary);

  const media = buildMediaSection(title, ogImage);
  hero.after(media);

  const guide = buildGuideSection(title, place, benefit);
  const cards = document.querySelector(".cards-three");
  if (cards) {
    cards.after(guide);
  } else {
    main.append(guide);
  }

  guide.after(buildPlannerDeepDive(title, place, benefit));
  guide.after(buildPlannerTables(title, place, benefit));

  enhanceDetailRows();

  function buildMediaSection(pageTitle, image) {
    const section = document.createElement("section");
    section.className = "section detail-media-section";

    const candidates = imageCandidates(image);
    const preview = candidates
      .slice(0, 12)
      .map((src, index) => `
        <figure class="detail-photo ${index === 0 ? "is-large" : ""}">
          <img src="${src}" alt="${escapeHtml(pageTitle)} 이미지 ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}" onerror="this.closest('figure').remove()">
        </figure>
      `)
      .join("");

    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">이미지</p>
        <h2>행사 이미지</h2>
      </div>
      <div class="detail-photo-grid">${preview}</div>
    `;
    return section;
  }

  function buildGuideSection(pageTitle, placeText, benefitText) {
    const region = inferRegion(placeText);
    const category = inferCategory(pageTitle, benefitText);
    const mainItems = category === "honeymoon"
      ? ["희망 여행지와 출발 가능일", "항공 포함 여부와 리조트 등급", "자유일정·패키지·올인클루시브 차이", "예약금, 취소료, 환율 적용 기준"]
      : category === "honsu"
        ? ["신혼집 평형과 입주 예정일", "침대·소파·식탁·가전 필수 품목", "배송·설치 가능일과 추가비", "AS 기간과 교환·취소 조건"]
        : ["예식 희망 월과 보증 인원", "웨딩홀 식대·대관료·주차 조건", "스드메 원본·드레스 추가금", "혼수·허니문 상담 우선순위"];
    const section = document.createElement("section");
    section.className = "section detail-rich-guide";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">체크포인트</p>
        <h2>웨딩플래너 방문 전 체크</h2>
        <p>박람회는 많이 둘러보는 것보다, 같은 기준으로 질문하고 비교하는 것이 훨씬 중요합니다. 아래 항목을 미리 정리해가면 상담 시간이 짧아지고 불필요한 옵션을 줄이기 좋습니다.</p>
      </div>
      <div class="detail-guide-layout">
        <article class="detail-guide-panel">
          <h3>상담 전에 정리할 것</h3>
          <ul>
            ${mainItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
        <article class="detail-guide-panel accent">
          <h3>신청 혜택</h3>
          <p>${escapeHtml(benefitText || "무료초대권 신청 및 웨딩 상담 혜택")}</p>
          <p class="small-note">혜택은 신청 페이지와 현장 운영 상황에 따라 달라질 수 있으니, 방문 전 최종 조건을 한 번 더 확인하는 것이 좋습니다.</p>
          <a class="button primary" href="${ctaHref}" target="_blank" rel="sponsored noopener">무료초대권 신청</a>
        </article>
        <article class="detail-guide-panel">
          <h3>${escapeHtml(region)} 방문 동선</h3>
          <p>주말 박람회는 상담 대기가 생길 수 있습니다. 오전 방문은 비교적 여유롭고, 오후 방문은 상담 부스가 붐빌 수 있으니 주차와 이동 시간을 넉넉히 잡아두세요.</p>
          <ul>
            <li>방문 1일 전: 초대권 신청 완료 여부 확인</li>
            <li>방문 당일: 예식 예정일, 예산, 하객 수 메모 준비</li>
            <li>상담 후: 받은 견적을 사진으로 보관하고 항목별 비교</li>
          </ul>
        </article>
        <article class="detail-guide-panel">
          <h3>계약 전 확인</h3>
          <ul>
            <li>포함·불포함 항목</li>
            <li>계약금, 환불, 날짜 변경 조건</li>
            <li>혜택 유효기간과 중복 적용 여부</li>
            <li>최종 견적 비교</li>
          </ul>
        </article>
      </div>
    `;
    return section;
  }

  function buildPlannerTables(pageTitle, placeText, benefitText) {
    const category = inferCategory(pageTitle, benefitText);
    const section = document.createElement("section");
    section.className = "section planner-table-section";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">비교표</p>
        <h2>상담 항목별 비교 기준</h2>
        <p>현장에서 받은 견적은 말로만 기억하면 헷갈리기 쉽습니다. 아래 기준으로 메모하면 집에 돌아와서도 어떤 조건이 실제로 유리한지 판단하기 좋습니다.</p>
      </div>
      <div class="planner-table-wrap">
        <table class="planner-table">
          <thead>
            <tr>
              <th>상담 항목</th>
              <th>꼭 물어볼 질문</th>
              <th>비교 기준</th>
              <th>주의할 점</th>
            </tr>
          </thead>
          <tbody>
            ${comparisonRows(category).map((row) => `
              <tr>
                <th>${escapeHtml(row[0])}</th>
                <td>${escapeHtml(row[1])}</td>
                <td>${escapeHtml(row[2])}</td>
                <td>${escapeHtml(row[3])}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="planner-mini-grid">
        <article>
          <h3>방문 전 준비물</h3>
          <ul>
            <li>예식 예정 월, 희망 요일, 예상 하객 수</li>
            <li>대략적인 결혼 예산과 우선순위</li>
            <li>마음에 드는 웨딩 사진, 드레스, 메이크업 이미지</li>
            <li>상담 후 비교할 수 있는 메모 앱 또는 노트</li>
          </ul>
        </article>
        <article>
          <h3>상담 후 정리법</h3>
          <ul>
            <li>업체명, 담당자, 견적 유효기간을 기록</li>
            <li>현장 혜택과 기본 견적을 분리해서 적기</li>
            <li>계약금, 잔금, 환불 조건을 별도로 표시</li>
            <li>당일 계약 압박이 있으면 하루 더 비교 후 결정</li>
          </ul>
        </article>
      </div>
    `;
    return section;
  }

  function buildPlannerDeepDive(pageTitle, placeText, benefitText) {
    const category = inferCategory(pageTitle, benefitText);
    const section = document.createElement("section");
    section.className = "section planner-deep-section";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">Planner Note</p>
        <h2>실제로 도움이 되는 방문 전략</h2>
        <p>${escapeHtml(plannerIntro(category))}</p>
      </div>
      <div class="planner-deep-grid">
        ${deepCards(category).map((card) => `
          <article>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.text)}</p>
          </article>
        `).join("")}
      </div>
      <div class="planner-faq">
        <h3>자주 묻는 질문</h3>
        ${faqItems(category).map((item, index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary>${escapeHtml(item.q)}</summary>
            <p>${escapeHtml(item.a)}</p>
          </details>
        `).join("")}
      </div>
    `;
    return section;
  }

  function imageCandidates(image) {
    if (!image) return [];
    const clean = image.replace(/^http:\/\//, "https://");
    const idx = clean.lastIndexOf("/img/");
    if (idx === -1) return [clean];

    const base = clean.slice(0, idx + 5);
    const names = [
      clean.slice(idx + 5),
      "main.png",
      "main.jpg",
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "01_01.jpg",
      "01_02.jpg",
      "02_01.jpg",
      "02_02.jpg",
      "pc_img_01.jpg",
      "pc_img_02.jpg",
      "bg1.jpg",
      "bg2.jpg",
      "map.png"
    ];
    return Array.from(new Set(names.filter(Boolean).map((name) => base + name)));
  }

  function enhanceDetailRows() {
    details.classList.add("detail-info-board");
    details.querySelector(".detail-date strong")?.setAttribute("aria-label", "행사 일정");
    details.querySelector(".detail-place strong")?.setAttribute("aria-label", "행사 장소");
    details.querySelector(".detail-benefit strong")?.setAttribute("aria-label", "신청 혜택");
  }

  function inferRegion(text) {
    if (!text) return "박람회";
    const match = text.match(/(서울|부산|인천|대구|광주|대전|수원|일산|동탄|김해|강릉|원주|천안|광명|제주|경기|충북|충남|경남|강원)/);
    return match ? match[1] : "박람회";
  }

  function inferCategory(pageTitle, benefitText) {
    const text = `${pageTitle} ${benefitText}`;
    if (/허니문|신혼여행/.test(text)) return "honeymoon";
    if (/혼수|가전|가구|리빙/.test(text)) return "honsu";
    if (/웨딩홀/.test(text)) return "hall";
    return "wedding";
  }

  function comparisonRows(category) {
    if (category === "honeymoon") {
      return [
        ["여행지", "우기·건기, 비행시간, 경유 횟수는 어떻게 되나요?", "이동 피로도와 체류 시간", "저렴한 상품일수록 경유 시간이 길 수 있습니다."],
        ["숙소", "객실 등급, 조식, 리조트 혜택이 포함인가요?", "객실 타입과 포함 서비스", "사진과 실제 객실 등급명을 함께 확인하세요."],
        ["패키지", "가이드 일정, 자유시간, 선택관광은 어떻게 되나요?", "자유일정 비율", "선택관광 비용이 별도인지 확인하세요."],
        ["계약", "환율, 취소료, 항공 발권 시점은 언제인가요?", "취소·변경 조건", "항공 발권 후에는 변경 비용이 커질 수 있습니다."]
      ];
    }
    if (category === "honsu") {
      return [
        ["가구", "사이즈 변경, 컬러 변경, 배송일 지정이 가능한가요?", "집 구조와 실제 치수", "전시장 크기와 집 크기는 체감이 다릅니다."],
        ["가전", "설치비, 이전 설치, AS 기간이 포함인가요?", "최종 결제금액", "카드 혜택과 현장 할인 중복 여부를 확인하세요."],
        ["패키지", "세트 구매 시 빠지는 품목은 없나요?", "필수 품목만 구성", "필요 없는 품목이 포함되면 오히려 비쌀 수 있습니다."],
        ["배송", "입주일에 맞춰 분할 배송이 가능한가요?", "배송·설치 일정", "엘리베이터, 사다리차 비용을 미리 확인하세요."]
      ];
    }
    return [
      ["웨딩홀", "식대, 대관료, 보증 인원, 주차 조건은 어떻게 되나요?", "총 예상 비용", "최소 보증 인원과 날짜 변경 조건을 확인하세요."],
      ["스드메", "원본, 수정본, 드레스 추가금, 헬퍼비가 포함인가요?", "포함 항목", "저렴한 견적은 필수 항목이 빠져 있을 수 있습니다."],
      ["혼수", "가전·가구 혜택과 배송 일정은 어떻게 되나요?", "실제 구매 필요성", "사은품보다 최종 결제금액이 중요합니다."],
      ["허니문", "항공, 숙소, 일정, 여행자보험이 포함인가요?", "총 여행 비용", "환율과 취소료 기준을 반드시 확인하세요."]
    ];
  }

  function plannerIntro(category) {
    if (category === "honeymoon") {
      return "허니문 상담은 예쁜 여행지만 고르는 자리가 아니라, 출발 가능일과 예산 안에서 가장 덜 피곤하고 만족도 높은 일정을 찾는 과정입니다. 항공과 숙소 조건을 따로 떼어 비교해보세요.";
    }
    if (category === "honsu") {
      return "혼수 상담은 할인율보다 실제 집에 들어갈 품목과 설치 일정이 중요합니다. 입주일, 집 평형, 필요한 가구 리스트를 기준으로 상담하면 불필요한 구매를 크게 줄일 수 있습니다.";
    }
    return "웨딩박람회는 결혼 준비의 방향을 빠르게 잡는 자리입니다. 단, 당일 분위기에 휩쓸려 바로 계약하기보다 견적을 항목별로 나눠 비교하면 훨씬 안정적으로 결정할 수 있습니다.";
  }

  function deepCards(category) {
    if (category === "honeymoon") {
      return [
        { title: "예산은 총액으로 보기", text: "항공, 숙소, 식비, 액티비티, 쇼핑, 현지 교통비를 나눠 보세요. 패키지 가격만 낮아도 현지 추가비가 크면 총액은 올라갑니다." },
        { title: "체류 시간을 확인", text: "5박 7일 상품이라도 밤 비행과 긴 경유가 있으면 실제 휴양 시간은 줄어듭니다. 도착·출발 시간을 꼭 확인하세요." },
        { title: "성향을 먼저 정하기", text: "휴양형, 관광형, 액티비티형 중 어떤 여행이 맞는지 정하면 목적지가 훨씬 좁혀집니다." },
        { title: "계약 조건 체크", text: "항공 발권 후 취소료, 리조트 변경 가능 여부, 환율 적용 기준은 계약 전 반드시 확인해야 합니다." }
      ];
    }
    if (category === "honsu") {
      return [
        { title: "집 도면을 가져가기", text: "가구는 예쁜 것보다 집에 맞는지가 먼저입니다. 방 크기, 콘센트 위치, 엘리베이터 규격을 알면 상담 정확도가 올라갑니다." },
        { title: "필수와 선택 분리", text: "침대, 냉장고, 세탁기처럼 바로 필요한 품목과 나중에 사도 되는 품목을 나누면 초기 비용을 줄일 수 있습니다." },
        { title: "배송일 역산", text: "입주청소, 이사, 가전 설치 순서가 꼬이면 일정이 밀립니다. 배송 가능일과 설치 시간을 먼저 확인하세요." },
        { title: "AS 조건 확인", text: "가격이 비슷하다면 AS 기간, 교환 조건, 설치 후 하자 처리 방식이 더 중요한 비교 기준이 됩니다." }
      ];
    }
    return [
      { title: "첫 상담은 기준 잡기", text: "처음부터 계약을 목표로 하기보다 예산, 지역, 구성의 기준을 잡는다고 생각하면 상담이 훨씬 편해집니다." },
      { title: "견적은 항목별로", text: "총액만 비교하면 어떤 부분이 비싼지 알기 어렵습니다. 웨딩홀, 스드메, 혼수, 허니문을 나눠 기록하세요." },
      { title: "현장 혜택은 조건 확인", text: "오늘만 가능하다는 혜택도 적용 조건이 있을 수 있습니다. 유효기간, 중복 할인, 계약금 환불 여부를 확인하세요." },
      { title: "상담 후 바로 정리", text: "집에 돌아와 24시간 안에 견적과 느낌을 정리하세요. 시간이 지나면 업체별 장단점이 쉽게 섞입니다." }
    ];
  }

  function faqItems(category) {
    if (category === "honeymoon") {
      return [
        { q: "허니문은 언제 상담받는 것이 좋나요?", a: "예식 6개월 전부터 알아보면 항공과 숙소 선택지가 넓습니다. 인기 리조트나 성수기 출발은 더 빨리 보는 것이 좋습니다." },
        { q: "박람회 특가가 항상 저렴한가요?", a: "특가가 유리한 경우가 많지만 포함 항목과 취소 조건을 함께 봐야 합니다. 항공, 숙소 등급, 현지 추가비를 꼭 비교하세요." },
        { q: "자유여행과 패키지 중 무엇이 좋나요?", a: "휴양 중심이면 패키지가 편하고, 도시 이동이 많거나 취향이 확실하면 자유여행이 맞을 수 있습니다. 두 사람의 여행 성향을 먼저 정하세요." }
      ];
    }
    if (category === "honsu") {
      return [
        { q: "혼수는 언제 준비하면 좋나요?", a: "입주일 기준 2~3개월 전부터 비교하면 배송 일정과 설치 일정을 여유 있게 잡을 수 있습니다." },
        { q: "패키지 구매가 유리한가요?", a: "필요한 품목만 포함되어 있다면 유리할 수 있습니다. 필요 없는 품목이 포함되어 있으면 단품 구매가 더 합리적일 수 있습니다." },
        { q: "현장 계약 전 무엇을 봐야 하나요?", a: "최종 결제금액, 배송비, 설치비, AS 기간, 취소·교환 조건을 계약서나 문자로 남겨두는 것이 좋습니다." }
      ];
    }
    return [
      { q: "웨딩박람회는 무료인가요?", a: "대부분 사전예약 또는 무료초대권 신청 후 무료로 입장할 수 있습니다. 행사별 운영 조건은 신청 페이지에서 최종 확인하세요." },
      { q: "방문하면 꼭 계약해야 하나요?", a: "꼭 계약할 필요는 없습니다. 여러 업체를 비교하고 기준을 잡는 목적으로 방문해도 충분히 도움이 됩니다." },
      { q: "혼자 가도 괜찮나요?", a: "가능합니다. 다만 예산과 우선순위를 함께 결정해야 하는 항목이 많아 가능하면 예비 배우자와 같이 방문하는 것이 좋습니다." }
    ];
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();

