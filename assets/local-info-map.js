(() => {
  const mapElement = document.getElementById("localMap");
  const regionSelect = document.getElementById("localRegion");
  const districtInput = document.getElementById("localDistrict");
  const needSelect = document.getElementById("localNeed");
  const searchButton = document.getElementById("localBtn");
  const currentButtons = [document.getElementById("mapCurrent"), document.getElementById("heroCurrent")].filter(Boolean);
  const state = document.getElementById("mapState");
  const intro = document.getElementById("mapIntro");
  const list = document.getElementById("mapPlaceList");
  const listHeading = document.getElementById("listHeading");
  const regionChips = document.getElementById("regionChips");
  const categoryGrid = document.getElementById("categoryGrid");
  const ageFilters = document.getElementById("ageFilters");
  const conditionFilters = document.getElementById("conditionFilters");
  const conditionNote = document.getElementById("conditionNote");
  const todayActions = document.getElementById("todayActions");
  const todayResult = document.getElementById("todayResult");

  if (!mapElement || !regionSelect || !needSelect) return;
  if (!window.kakao) {
    state.textContent = "지도 연결을 확인하고 있습니다. 잠시 후 다시 이용해 주세요.";
    list.innerHTML = '<div class="map-empty">지도를 불러오지 못했습니다. 공공데이터 상세 검색을 이용해 주세요.</div>';
    return;
  }

  const regionCenters = {
    서울: [37.5665, 126.9780], 경기: [37.4138, 127.5183], 인천: [37.4563, 126.7052],
    부산: [35.1796, 129.0756], 대구: [35.8714, 128.6014], 광주: [35.1595, 126.8526],
    대전: [36.3504, 127.3845], 울산: [35.5384, 129.3114], 세종: [36.4800, 127.2890],
    강원: [37.8228, 128.1555], 충북: [36.6357, 127.4917], 충남: [36.6588, 126.6728],
    전북: [35.8203, 127.1088], 전남: [34.8161, 126.4629], 경북: [36.4919, 128.8889],
    경남: [35.4606, 128.2132], 제주: [33.4996, 126.5312],
  };
  const API_BASE = "https://toypoppo-public-data.rururubs.workers.dev";
  const regionNames = {
    서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
    광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
    경기: "경기도", 강원: "강원", 충북: "충청북도", 충남: "충청남도",
    전북: "전라북도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도", 제주: "제주",
  };
  const publicSources = {
    어린이도서관: { endpoint: "places", type: "library" },
    "어린이 박물관": { endpoint: "places", type: "museum" },
    "어린이 과학관": { endpoint: "science" },
    "어린이 공원": { endpoint: "places", type: "park" },
    어린이놀이터: { endpoint: "places", type: "playground" },
    "문화센터 어린이": { endpoint: "culture", keyword: "어린이" },
    "어린이 체험관": { endpoint: "culture", keyword: "체험" },
    "어린이 공연장": { endpoint: "culture", keyword: "어린이" },
  };

  const ageTips = {
    baby: {
      label: "0~12개월",
      text: "낮잠과 수유 사이에 60분 안팎으로 짧게 방문하고, 유모차 이동과 수유 공간을 먼저 확인하세요.",
      tags: ["짧은 체류", "유모차 확인"],
    },
    toddler: {
      label: "1~2세",
      text: "걷고 만질 수 있는 공간이 좋습니다. 계단, 출입구와 입에 넣을 수 있는 작은 물건을 살펴보세요.",
      tags: ["대근육 활동", "안전 동선"],
    },
    preschool: {
      label: "3~4세",
      text: "직접 조작하고 질문할 거리가 있는 장소가 잘 맞습니다. 한 번에 활동 두 가지 정도면 충분합니다.",
      tags: ["체험 중심", "질문 놀이"],
    },
    kindergarten: {
      label: "5~7세",
      text: "관람 전에 주제를 하나 정하고, 돌아온 뒤 그림이나 만들기로 기억을 이어가 보세요.",
      tags: ["관찰 미션", "사후 놀이"],
    },
    elementary: {
      label: "초등",
      text: "아이에게 코스를 직접 고르게 하고 기록, 사진, 활동지로 관심 분야를 확장해 보세요.",
      tags: ["자기 선택", "기록 활동"],
    },
  };

  const presetData = {
    today: {
      need: "어린이도서관",
      title: "오늘의 부담 적은 외출",
      text: "가까운 어린이도서관은 체류 시간을 조절하기 쉽고, 날씨가 바뀌어도 이용하기 편합니다.",
    },
    rain: {
      need: "어린이 과학관",
      title: "비 오는 날 실내 추천",
      text: "과학관이나 체험관은 실내 이동이 편하지만 주말에는 붐빌 수 있어 예약과 주차를 먼저 확인하세요.",
    },
    weekend: {
      need: "어린이 체험관",
      title: "주말에 경험을 남기는 장소",
      text: "체험시설은 예약 시간이 정해진 경우가 많습니다. 이동 시간보다 아이가 참여할 프로그램을 먼저 고르세요.",
    },
    free: {
      need: "어린이 공원",
      title: "비용 부담이 적은 야외 놀이",
      text: "공원은 무료 이용이 일반적이지만 주차비와 행사 비용은 별도일 수 있습니다. 화장실과 그늘 위치도 확인하세요.",
    },
    indoor: {
      need: "어린이 박물관",
      title: "날씨 영향을 덜 받는 실내 외출",
      text: "박물관은 전부 보려 하기보다 아이가 멈추는 전시 두세 곳에 집중하면 만족도가 높습니다.",
    },
    outdoor: {
      need: "어린이 공원",
      title: "몸을 충분히 쓰는 야외 외출",
      text: "기온과 미세먼지를 확인하고 물, 모자, 여벌 옷을 준비하세요. 낮잠 직전의 긴 야외 활동은 피하는 편이 좋습니다.",
    },
  };

  let selectedAge = "baby";
  let selectedConditions = [];
  let latestPlaces = [];
  let latestMarkers = [];
  let map;
  let places;
  let geocoder;
  let infoWindow;
  let currentMarker;
  const initialParams = new URLSearchParams(window.location.search);

  const escapeHtml = (value) => String(value || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function updateActive(container, selector, active) {
    container.querySelectorAll(selector).forEach((element) => {
      element.classList.toggle("is-active", element === active);
    });
  }

  function categoryLabel() {
    const active = categoryGrid.querySelector("button.is-active strong");
    return active ? active.textContent : needSelect.value;
  }

  function setNeed(need) {
    needSelect.value = need;
    const target = [...categoryGrid.querySelectorAll("button")].find((button) => button.dataset.need === need);
    if (target) updateActive(categoryGrid, "button", target);
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("region", regionSelect.value);
    params.set("need", needSelect.value);
    if (districtInput.value.trim()) params.set("district", districtInput.value.trim());
    params.set("age", selectedAge);
    history.replaceState(null, "", `${window.location.pathname}?${params.toString()}#mapTitle`);
  }

  function clearMarkers() {
    latestMarkers.forEach((entry) => entry.marker.setMap(null));
    latestMarkers = [];
    infoWindow.close();
  }

  function selectedChecks() {
    return selectedConditions.map((condition) => `<em>${escapeHtml(condition)} 확인</em>`).join("");
  }

  function showPlace(place, marker, card) {
    document.querySelectorAll(".map-place.is-active").forEach((element) => element.classList.remove("is-active"));
    if (card) {
      card.classList.add("is-active");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    const address = place.road_address_name || place.address_name || "주소 정보 없음";
    if (marker) {
      infoWindow.setContent(`<div class="map-infowindow"><strong>${escapeHtml(place.place_name)}</strong>${escapeHtml(address)}</div>`);
      infoWindow.open(map, marker);
      map.panTo(marker.getPosition());
    }
  }

  function renderPlaces(data) {
    latestPlaces = data.slice(0, 12);
    list.innerHTML = "";
    const bounds = new kakao.maps.LatLngBounds();
    const tip = ageTips[selectedAge];

    latestPlaces.forEach((place) => {
      const hasCoordinates = Number.isFinite(Number(place.y)) && Number.isFinite(Number(place.x));
      const position = hasCoordinates ? new kakao.maps.LatLng(Number(place.y), Number(place.x)) : null;
      const marker = position ? new kakao.maps.Marker({ map, position, title: place.place_name }) : null;
      const card = document.createElement("button");
      const address = place.road_address_name || place.address_name || "주소 정보 없음";
      const category = place.category_name ? place.category_name.split(" > ").slice(-1)[0] : categoryLabel();
      card.className = "map-place";
      card.type = "button";
      card.innerHTML = `<span class="map-place__top"><strong>${escapeHtml(place.place_name)}</strong><span>${escapeHtml(category)}</span></span>
        <span>${escapeHtml(address)}</span>
        <small><b>${escapeHtml(tip.label)} 부모 팁</b> · ${escapeHtml(tip.text)}</small>
        <span class="place-tags">${place.environment ? `<em>${escapeHtml(place.environment)}</em>` : ""}${tip.tags.map((tag) => `<em>${escapeHtml(tag)}</em>`).join("")}${selectedChecks()}</span>
        <span class="place-view">지도에서 보기 →</span>`;
      card.addEventListener("click", () => showPlace(place, marker, card));
      if (marker) {
        kakao.maps.event.addListener(marker, "click", () => showPlace(place, marker, card));
        latestMarkers.push({ marker, card });
      }
      list.appendChild(card);
      if (position) bounds.extend(position);
    });

    if (latestMarkers.length) map.setBounds(bounds);
    const area = [regionSelect.value, districtInput.value.trim()].filter(Boolean).join(" ");
    state.textContent = `${area} ${categoryLabel()} 검색 결과 ${latestPlaces.length}곳`;
    listHeading.textContent = `${area} · ${categoryLabel()}`;
    intro.textContent = `${area}에서 ${categoryLabel()} ${latestPlaces.length}곳을 지도와 함께 확인하세요.`;
  }

  function showEmpty(message) {
    state.textContent = message;
    list.innerHTML = `<div class="map-empty">${escapeHtml(message)}</div>`;
  }

  function toPlace(item) {
    return {
      place_name: item.title,
      road_address_name: item.address || item.roadAddress || item.place || "",
      address_name: item.lotAddress || "",
      x: item.longitude,
      y: item.latitude,
      category_name: item.category || categoryLabel(),
      environment: item.description || "",
      place_url: item.url || "",
    };
  }

  function geocodePlaces(data) {
    return Promise.all(data.map((place) => new Promise((resolve) => {
      if (place.x && place.y) {
        resolve(place);
        return;
      }
      const address = place.road_address_name || place.address_name;
      geocoder.addressSearch(address, (result, statusCode) => {
        if (statusCode === kakao.maps.services.Status.OK && result[0]) {
          resolve({ ...place, x: result[0].x, y: result[0].y });
        } else {
          resolve(place);
        }
      });
    })));
  }

  async function searchPlaces(options = {}) {
    const region = regionSelect.value;
    const district = districtInput.value.trim();
    const need = needSelect.value;
    const center = options.center || regionCenters[region] || regionCenters.서울;
    clearMarkers();
    state.textContent = "장소를 찾고 있습니다.";
    list.innerHTML = '<div class="map-empty">지도와 목록을 준비하고 있습니다.</div>';
    map.setCenter(new kakao.maps.LatLng(center[0], center[1]));

    if (options.useRegion === false) {
      const query = need;
      const callback = (data, statusCode) => {
        if (statusCode === kakao.maps.services.Status.OK) renderPlaces(data);
        else showEmpty("내 주변 장소를 찾지 못했습니다. 지역을 선택해 탐색해 주세요.");
      };
      places.keywordSearch(query, callback, {
        location: new kakao.maps.LatLng(center[0], center[1]),
        radius: options.radius || 12000,
      });
      return;
    }

    const source = publicSources[need];
    if (!source) {
      showEmpty("이 카테고리는 지역별 공식 정보 페이지에서 준비하고 있습니다.");
      return;
    }

    if (source.endpoint === "science") {
      try {
        syncUrl();
        const response = await fetch("/assets/data/science-museums.json?v=20260628b");
        const payload = await response.json();
        if (!response.ok) throw new Error("과학관 자료 조회 실패");
        const keyword = district.toLowerCase();
        const data = (payload.items || [])
          .filter((item) => item.address.includes(regionNames[region] || region))
          .filter((item) => !keyword || `${item.title} ${item.address}`.toLowerCase().includes(keyword))
          .map(toPlace);
        if (data.length) renderPlaces(await geocodePlaces(data));
        else showEmpty("선택한 지역의 과학관 공식 데이터가 없습니다. 인접 지역도 확인해 보세요.");
      } catch {
        showEmpty("과학관 자료를 불러오지 못했습니다. 잠시 후 다시 이용해 주세요.");
      }
      return;
    }

    const params = new URLSearchParams({ sido: region, limit: "30" });
    if (district) params.set("sigungu", district);
    if (source.endpoint === "places") params.set("type", source.type);
    if (source.keyword) params.set("keyword", source.keyword);
    if (source.endpoint === "culture") {
      const today = new Date();
      const later = new Date(today);
      later.setMonth(later.getMonth() + 3);
      params.set("from", today.toISOString().slice(0, 10));
      params.set("to", later.toISOString().slice(0, 10));
    }

    try {
      syncUrl();
      let response = await fetch(`${API_BASE}/api/${source.endpoint}?${params.toString()}`);
      let payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "공공데이터 조회 실패");
      if (!(payload.items || []).length && source.keyword && source.endpoint === "places") {
        params.delete("keyword");
        response = await fetch(`${API_BASE}/api/${source.endpoint}?${params.toString()}`);
        payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "공공데이터 조회 실패");
      }
      const data = (payload.items || []).map(toPlace);
      if (data.length) renderPlaces(data);
      else showEmpty("조건에 맞는 공식 데이터가 없습니다. 다른 지역이나 카테고리를 선택해 보세요.");
    } catch {
      showEmpty("공공데이터를 불러오지 못했습니다. 잠시 후 상세 검색을 이용해 주세요.");
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showEmpty("현재 위치 기능을 지원하지 않는 브라우저입니다.");
      return;
    }
    state.textContent = "현재 위치를 확인하고 있습니다.";
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const center = [coords.latitude, coords.longitude];
      if (currentMarker) currentMarker.setMap(null);
      currentMarker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(center[0], center[1]),
        title: "현재 위치",
      });
      districtInput.value = "";
      searchPlaces({ center, radius: 12000, useRegion: false });
      document.getElementById("mapTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    }, () => {
      state.textContent = "위치 권한을 사용할 수 없습니다. 지역 선택으로 찾아보세요.";
    }, { enableHighAccuracy: false, timeout: 8000 });
  }

  kakao.maps.load(() => {
    const requestedRegion = initialParams.get("region");
    const requestedNeed = initialParams.get("need");
    const requestedDistrict = initialParams.get("district");
    const requestedAge = initialParams.get("age");
    if (requestedRegion && regionCenters[requestedRegion]) {
      regionSelect.value = requestedRegion;
      const regionButton = regionChips.querySelector(`[data-region="${requestedRegion}"]`);
      if (regionButton) updateActive(regionChips, "button", regionButton);
    }
    if (requestedNeed && publicSources[requestedNeed]) setNeed(requestedNeed);
    if (requestedDistrict) districtInput.value = requestedDistrict;
    if (requestedAge && ageTips[requestedAge]) {
      selectedAge = requestedAge;
      const ageButton = ageFilters.querySelector(`[data-age="${requestedAge}"]`);
      if (ageButton) updateActive(ageFilters, "button", ageButton);
    }
    const initial = regionCenters[regionSelect.value] || regionCenters.서울;
    map = new kakao.maps.Map(mapElement, {
      center: new kakao.maps.LatLng(initial[0], initial[1]),
      level: 8,
    });
    places = new kakao.maps.services.Places();
    geocoder = new kakao.maps.services.Geocoder();
    infoWindow = new kakao.maps.InfoWindow({ removable: true });
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

    searchButton.addEventListener("click", () => searchPlaces());
    districtInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") searchPlaces();
    });

    regionChips.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-region]");
      if (!button) return;
      updateActive(regionChips, "button", button);
      regionSelect.value = button.dataset.region;
      districtInput.value = "";
      searchPlaces();
    });

    regionSelect.addEventListener("change", () => {
      const target = regionChips.querySelector(`[data-region="${regionSelect.value}"]`);
      if (target) updateActive(regionChips, "button", target);
      districtInput.value = "";
      searchPlaces();
    });

    categoryGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-need]");
      if (!button) return;
      updateActive(categoryGrid, "button", button);
      needSelect.value = button.dataset.need;
      searchPlaces();
    });

    ageFilters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-age]");
      if (!button) return;
      selectedAge = button.dataset.age;
      updateActive(ageFilters, "button", button);
      clearMarkers();
      renderPlaces(latestPlaces);
    });

    conditionFilters.addEventListener("change", () => {
      selectedConditions = [...conditionFilters.querySelectorAll("input:checked")].map((input) => input.value);
      conditionNote.textContent = selectedConditions.length
        ? `${selectedConditions.join(", ")} 정보는 실시간 제공 항목이 아니므로 방문 전 공식 홈페이지나 전화로 확인해 주세요.`
        : "편의시설 정보는 장소별로 변경될 수 있어 선택한 항목을 방문 전 공식 안내에서 확인하도록 표시합니다.";
      clearMarkers();
      renderPlaces(latestPlaces);
    });

    todayActions.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-preset]");
      if (!button) return;
      const preset = presetData[button.dataset.preset];
      setNeed(preset.need);
      todayResult.innerHTML = `<strong>${escapeHtml(preset.title)}</strong><p>${escapeHtml(preset.text)}</p>`;
      searchPlaces();
      document.getElementById("mapTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    currentButtons.forEach((button) => button.addEventListener("click", useCurrentLocation));
    searchPlaces();
  });
})();
