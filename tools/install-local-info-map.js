const fs = require("fs");

const file = "local-info/index.html";
let html = fs.readFileSync(file, "utf8");

if (!html.includes("/assets/local-info-map.css")) {
  html = html.replace(
    '<link rel="stylesheet" href="/assets/styles.css">',
    '<link rel="stylesheet" href="/assets/styles.css">\n  <link rel="stylesheet" href="/assets/local-info-map.css">'
  );
}

const marker = '<section><h2>제공 예정 정보</h2>';
const mapSection = `<section class="map-panel" aria-labelledby="mapTitle">
        <div class="map-panel__head">
          <div><h2 id="mapTitle">지도에서 우리동네 육아 장소 찾기</h2><p>지역과 시설 종류를 선택하면 가까운 장소를 지도와 목록으로 확인할 수 있어요.</p></div>
          <button class="map-current" id="mapCurrent" type="button">현재 위치로 이동</button>
        </div>
        <div id="localMap" class="local-map" aria-label="우리동네 육아 장소 지도"></div>
        <div class="map-state"><span id="mapState">지도를 준비하고 있습니다.</span><small>장소 정보 제공: Kakao Maps</small></div>
        <div id="mapPlaceList" class="map-place-list"></div>
      </section>
      `;

if (!html.includes('id="localMap"')) {
  if (!html.includes(marker)) throw new Error("Map insertion point not found");
  html = html.replace(marker, mapSection + marker);
}

if (!html.includes("dapi.kakao.com/v2/maps/sdk.js")) {
  html = html.replace(
    "</body>",
    '  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=3fa350c084c36848cbaadf42c19bcfcb&libraries=services&autoload=false"></script>\n  <script src="/assets/local-info-map.js"></script>\n</body>'
  );
}

fs.writeFileSync(file, html, "utf8");
