(() => {
  const mapElement = document.getElementById("localMap");
  const regionSelect = document.getElementById("localRegion");
  const needSelect = document.getElementById("localNeed");
  const searchButton = document.getElementById("localBtn");
  const currentButton = document.getElementById("mapCurrent");
  const state = document.getElementById("mapState");
  const list = document.getElementById("mapPlaceList");

  if (!mapElement || !window.kakao || !regionSelect || !needSelect) return;

  const regionCenters = {
    서울: [37.5665, 126.9780], 경기: [37.4138, 127.5183], 인천: [37.4563, 126.7052],
    부산: [35.1796, 129.0756], 대구: [35.8714, 128.6014], 광주: [35.1595, 126.8526],
    대전: [36.3504, 127.3845], 세종: [36.4800, 127.2890], 강원: [37.8228, 128.1555],
    충청: [36.6357, 127.4917], 전라: [35.7175, 127.1530], 경상: [36.4919, 128.8889],
    제주: [33.4996, 126.5312]
  };

  kakao.maps.load(() => {
    const initial = regionCenters[regionSelect.value] || regionCenters.서울;
    const map = new kakao.maps.Map(mapElement, {
      center: new kakao.maps.LatLng(initial[0], initial[1]),
      level: 8
    });
    const places = new kakao.maps.services.Places();
    const markers = [];
    let infoWindow = new kakao.maps.InfoWindow({ removable: true });

    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

    const clearMarkers = () => {
      markers.forEach((marker) => marker.setMap(null));
      markers.length = 0;
      infoWindow.close();
    };

    const escapeHtml = (value) => String(value || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    function showPlace(place, marker) {
      const address = place.road_address_name || place.address_name || "주소 정보 없음";
      infoWindow.setContent(`<div class="map-infowindow"><strong>${escapeHtml(place.place_name)}</strong>${escapeHtml(address)}</div>`);
      infoWindow.open(map, marker);
      map.panTo(marker.getPosition());
    }

    function renderPlaces(data) {
      list.innerHTML = "";
      const bounds = new kakao.maps.LatLngBounds();

      data.slice(0, 10).forEach((place) => {
        const position = new kakao.maps.LatLng(Number(place.y), Number(place.x));
        const marker = new kakao.maps.Marker({ map, position, title: place.place_name });
        markers.push(marker);
        bounds.extend(position);
        kakao.maps.event.addListener(marker, "click", () => showPlace(place, marker));

        const button = document.createElement("button");
        button.className = "map-place";
        button.type = "button";
        button.innerHTML = `<strong>${escapeHtml(place.place_name)}</strong><span>${escapeHtml(place.road_address_name || place.address_name || "주소 정보 없음")}</span><em>지도에서 보기</em>`;
        button.addEventListener("click", () => showPlace(place, marker));
        list.appendChild(button);
      });

      if (data.length) map.setBounds(bounds);
      state.textContent = `${regionSelect.value} ${needSelect.value} 검색 결과 ${Math.min(data.length, 10)}곳`;
    }

    function searchPlaces() {
      const region = regionSelect.value;
      const need = needSelect.value;
      const center = regionCenters[region] || regionCenters.서울;
      clearMarkers();
      state.textContent = "장소를 찾고 있습니다.";
      list.innerHTML = "";
      map.setCenter(new kakao.maps.LatLng(center[0], center[1]));

      places.keywordSearch(`${region} ${need}`, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          renderPlaces(data);
          return;
        }
        const message = status === kakao.maps.services.Status.ZERO_RESULT
          ? "조건에 맞는 장소가 없습니다. 다른 시설 종류를 선택해 보세요."
          : "지도 장소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
        state.textContent = message;
        list.innerHTML = `<div class="map-empty">${message}</div>`;
      }, { location: new kakao.maps.LatLng(center[0], center[1]), radius: 20000 });
    }

    searchButton.addEventListener("click", searchPlaces);
    regionSelect.addEventListener("change", searchPlaces);
    needSelect.addEventListener("change", searchPlaces);

    currentButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        state.textContent = "현재 위치 기능을 지원하지 않는 브라우저입니다.";
        return;
      }
      state.textContent = "현재 위치를 확인하고 있습니다.";
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const current = new kakao.maps.LatLng(coords.latitude, coords.longitude);
        map.setCenter(current);
        map.setLevel(5);
        new kakao.maps.Marker({ map, position: current, title: "현재 위치" });
        state.textContent = "현재 위치로 지도를 이동했습니다. 시설 검색은 선택한 지역을 기준으로 합니다.";
      }, () => {
        state.textContent = "위치 권한을 사용할 수 없습니다. 지역 선택으로 검색해 주세요.";
      }, { enableHighAccuracy: false, timeout: 8000 });
    });

    searchPlaces();
  });
})();
