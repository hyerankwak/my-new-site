(function () {
  const honeymoonDealUrl = "https://myrealt.rip/fK9ced";
  const targetRoot = document.querySelector("main");
  if (!targetRoot) return;

  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  if (!path.startsWith("/honeymoon/")) return;

  normalizeHoneymoonCtas();

  const pageTokens = buildPageTokens(path);
  const section = document.createElement("section");
  section.className = "section myrealtrip-products";
  section.setAttribute("aria-label", "허니문 특가 추천");
  section.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Honeymoon Deal</p>
      <h2>허니문 특가 추천</h2>
      <p>여행지, 예산, 일정에 맞춰 비교하기 좋은 허니문 상품을 모았습니다. 실제 가격, 포함사항, 예약 조건은 이동한 페이지에서 다시 확인해 주세요.</p>
    </div>
    <div class="myrealtrip-grid" data-myrealtrip-grid>
      <article class="myrealtrip-skeleton">허니문 특가 정보를 불러오는 중입니다.</article>
    </div>
  `;

  const anchor = document.querySelector(".honeymoon-next");
  if (anchor) {
    anchor.parentNode.insertBefore(section, anchor);
  } else {
    targetRoot.appendChild(section);
  }

  fetch("/data/myrealtrip-products.json")
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("상품 데이터 로드 실패")))
    .then((products) => {
      const selected = selectProducts(products, pageTokens, path);
      renderProducts(selected);
    })
    .catch(() => {
      const grid = section.querySelector("[data-myrealtrip-grid]");
      grid.innerHTML = `<article class="myrealtrip-empty">현재 허니문 특가 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</article>`;
    });

  function buildPageTokens(currentPath) {
    const clean = currentPath.replace(/\.html$/, "").split("/").filter(Boolean);
    const last = clean[clean.length - 1] || "honeymoon";
    const parent = clean[clean.length - 2] || "";
    const tokens = new Set([last, parent, "featured"]);

    if (currentPath === "/honeymoon/") tokens.add("featured");
    if (currentPath.includes("/destinations/")) tokens.add(last);
    if (currentPath.includes("/styles/")) tokens.add(last);
    if (currentPath.includes("/budget")) tokens.add("budget");
    if (currentPath.includes("/checklist")) tokens.add("checklist");
    if (currentPath.includes("/travel-prep")) tokens.add("travel-prep");
    if (currentPath.includes("/deals")) tokens.add("featured");
    if (currentPath.includes("/itineraries")) tokens.add("featured");
    if (currentPath.includes("/hotels") || currentPath.includes("/resorts")) tokens.add("resort");

    return tokens;
  }

  function normalizeHoneymoonCtas() {
    const replaceLabels = new Set([
      "박람회 특가 보기",
      "박람회 특가보러가기",
      "박람회 신청하기",
      "웨딩박람회 신청",
      "관련 웨딩박람회 신청",
    ]);

    document.querySelectorAll("a").forEach((link) => {
      const label = link.textContent.replace(/\s+/g, " ").trim();
      const isOldHoneymoonCta = replaceLabels.has(label);
      const isHeroDealLink = link.matches(".hero-actions .button") && (
        link.getAttribute("href") === "/honeymoon/deals.html" ||
        link.getAttribute("href") === "/#fairs"
      );

      if (!isOldHoneymoonCta && !isHeroDealLink) return;

      link.textContent = "허니문 특가보러가기";
      link.setAttribute("href", honeymoonDealUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "sponsored noopener");
    });
  }

  function selectProducts(products, tokens, currentPath) {
    const scored = products.map((product, index) => {
      const tags = product.tags || [];
      const score = tags.reduce((sum, tag) => sum + (tokens.has(tag) ? 3 : 0), 0) + (tags.includes("featured") ? 1 : 0);
      return { product, score, index };
    });

    const limit = currentPath === "/honeymoon/" ? 8 : 6;
    const picked = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, limit)
      .map((item) => item.product);

    if (picked.length >= 3) return picked;
    return scored
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, limit)
      .map((item) => item.product);
  }

  function renderProducts(products) {
    const grid = section.querySelector("[data-myrealtrip-grid]");
    grid.innerHTML = products.map((product) => {
      const hasInternalUrl = Boolean(product.internalUrl);
      const cardUrl = hasInternalUrl ? product.internalUrl : product.href;
      const cardAttrs = hasInternalUrl ? "" : " target=\"_blank\" rel=\"sponsored noopener\"";
      const ctaText = hasInternalUrl ? "상세 가이드 보기" : "허니문 특가보러가기";

      return `
      <article class="myrealtrip-card">
        <a class="myrealtrip-image" href="${escapeAttribute(cardUrl)}"${cardAttrs} style="background-image: url('${escapeAttribute(product.image)}')">
          <span>${escapeHtml(product.label)}</span>
        </a>
        <div class="myrealtrip-body">
          <p class="eyebrow">${escapeHtml(product.type)}</p>
          <h3>${escapeHtml(product.title)}</h3>
          <p>${escapeHtml(product.description)}</p>
          <dl>
            <div><dt>추천 대상</dt><dd>${escapeHtml(product.idealFor)}</dd></div>
            <div><dt>일정</dt><dd>${escapeHtml(product.duration)}</dd></div>
            <div><dt>가격</dt><dd>${escapeHtml(product.priceNote)}</dd></div>
          </dl>
          <a class="button primary" href="${escapeAttribute(cardUrl)}"${cardAttrs}>${ctaText}</a>
        </div>
      </article>
    `;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();
