const STANDARD_SOURCES = {
  library: {
    name: "전국도서관표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_lbrry_api",
    label: "도서관",
  },
  museum: {
    name: "전국박물관미술관정보표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_museum_artgr_info_api",
    label: "박물관·미술관",
  },
  park: {
    name: "전국도시공원정보표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_cty_park_info_api",
    label: "도시공원",
  },
  event: {
    name: "전국공연행사정보표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_pblprfr_event_info_api",
    label: "공연·행사",
  },
  festival: {
    name: "전국문화축제표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api",
    label: "문화축제",
  },
  tourism: {
    name: "전국관광지정보표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_trrsrt_api",
    label: "관광지",
  },
  forest: {
    name: "전국휴양림표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_public_rcrfrst_api",
    label: "휴양림",
  },
  parking: {
    name: "전국주차장정보표준데이터",
    url: "https://api.data.go.kr/openapi/tn_pubr_prkplce_info_api",
    label: "주차장",
  },
};

const PLAYGROUND_SOURCES = {
  playground: {
    name: "행정안전부 전국어린이놀이시설정보서비스",
    url: "https://apis.data.go.kr/1741000/pfc3/getPfctInfo3",
    label: "어린이놀이시설",
  },
  safety: {
    name: "행정안전부 전국어린이놀이시설안전검사정보서비스",
    url: "https://apis.data.go.kr/1741000/sfty4/getSftyInsp4",
    label: "놀이시설 안전검사",
  },
};

const CULTURE_URL = "https://apis.data.go.kr/B553457/cultureinfo/area2";
const AIR_URL = "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
const FORECAST_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const REGION_NAMES = {
  서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
  광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
  경기: "경기도", 강원: "강원특별자치도", 충북: "충청북도", 충남: "충청남도",
  전북: "전북특별자치도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도",
  제주: "제주특별자치도",
};

function json(body, status = 200, cache = "public, max-age=300") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cache,
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "https://toypoppo.kr",
    },
  });
}

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function tag(xml, names) {
  for (const name of names) {
    const match = xml.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, "i"));
    if (match) return decodeXml(match[1]).trim();
  }
  return "";
}

function clean(value, max = 80) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function itemBlocks(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
}

function normalizeItem(item, type, label) {
  const title = tag(item, [
    "lbrryNm", "fcltyNm", "museumNm", "museumArtgrNm", "parkNm", "eventNm",
    "fstvlNm", "trrsrtNm", "rcrfrstNm", "prkplceNm", "ciName", "pfctNm",
    "title", "subject",
  ]);
  const roadAddress = tag(item, ["rdnmadr", "roadNmAddr", "ciRdnmadr", "adres", "address"]);
  const lotAddress = tag(item, ["lnmadr", "lotnoAddr", "ciLnmadr"]);
  return {
    id: tag(item, ["manageNo", "mngNo", "ciSeq", "pfctSn", "seq", "id"]),
    type,
    category: tag(item, ["parkSe", "museumSe", "fcltySe", "eventSe", "prkplceSe"]) || label,
    title,
    description: tag(item, ["trrsrtIntrcn", "fstvlCo", "eventCo", "intrcn", "remark"]),
    address: roadAddress || lotAddress,
    roadAddress,
    lotAddress,
    sido: tag(item, ["ctprvnNm", "sido", "sidoNm", "ciSido"]),
    sigungu: tag(item, ["signguNm", "sigungu", "sggNm", "ciSigungu"]),
    latitude: number(tag(item, ["latitude", "lat", "la", "ciLa"])),
    longitude: number(tag(item, ["longitude", "lng", "lo", "ciLo"])),
    phone: tag(item, ["phoneNumber", "phone", "telNo", "ciTel"]),
    url: tag(item, ["homepageUrl", "homepage", "url", "link"]),
    startDate: tag(item, ["eventStartDate", "fstvlStartDate", "startDate"]),
    endDate: tag(item, ["eventEndDate", "fstvlEndDate", "endDate"]),
    place: tag(item, ["eventPlace", "opar", "place", "facility"]),
    fee: tag(item, ["chargeInfo", "useFee", "price", "parkingchrgeInfo"]),
    hours: tag(item, ["weekdayOperOpenHhmm", "operOpenHhmm", "useTime"]),
    closed: tag(item, ["closeDay", "rstde"]),
    safetyDate: tag(item, ["inspDe", "inspDate", "lastInspDe"]),
    safetyResult: tag(item, ["inspResult", "inspRslt", "result"]),
  };
}

function regionMatches(item, sido, sigungu) {
  const haystack = `${item.sido} ${item.sigungu} ${item.address}`.replace(/\s+/g, "");
  return (!sido || haystack.includes(sido.replace(/\s+/g, "")))
    && (!sigungu || haystack.includes(sigungu.replace(/\s+/g, "")));
}

function keywordMatches(item, keyword) {
  if (!keyword) return true;
  const needle = keyword.toLocaleLowerCase("ko-KR");
  return `${item.title} ${item.category} ${item.description} ${item.address} ${item.place}`
    .toLocaleLowerCase("ko-KR").includes(needle);
}

function normalizeJsonPlayground(item, type, label) {
  const address = [item.ronaAddr || item.roadNmAddr, item.ronaDaddr].filter(Boolean).join(" ");
  return {
    id: item.pfctSn || item.ciSeq || item.inspSn || "",
    type,
    category: item.instlPlaceCdNm || item.inspSeNm || label,
    title: item.pfctNm || item.ciName || item.fcltyNm || "어린이놀이시설",
    description: item.idrodrCdNm ? `${item.idrodrCdNm} · ${item.prvtPblcYnCdNm || ""}` : "",
    address: address || item.lotnoAddr || item.rgnCdNm || "",
    roadAddress: address,
    lotAddress: item.lotnoAddr || "",
    sido: item.rgnCdNm || item.sidoNm || "",
    sigungu: item.rgnCdNm || item.sggNm || "",
    latitude: number(item.latCrtsVl || item.latitude),
    longitude: number(item.lotCrtsVl || item.longitude),
    phone: item.telNo || "",
    url: "",
    safetyDate: item.inspYmd || item.inspDe || "",
    safetyResult: item.inspResult || item.inspRslt || "",
  };
}

async function fetchXml(upstream) {
  const response = await fetch(upstream, { cf: { cacheTtl: 600, cacheEverything: true } });
  const xml = await response.text();
  if (!response.ok) throw new Error(`공공데이터 응답 오류 ${response.status}`);
  const resultCode = tag(xml, ["resultCode", "returnReasonCode"]);
  if (resultCode && !["00", "0", "0000"].includes(resultCode)) {
    throw new Error(tag(xml, ["resultMsg", "returnAuthMsg"]) || `공공데이터 오류 ${resultCode}`);
  }
  return xml;
}

async function standardPlaces(requestUrl, env) {
  const type = clean(requestUrl.searchParams.get("type"));
  const source = STANDARD_SOURCES[type] || PLAYGROUND_SOURCES[type];
  if (!source) return json({ message: "지원하지 않는 시설 유형입니다." }, 400, "no-store");

  const limit = Math.min(Math.max(Number(requestUrl.searchParams.get("limit")) || 20, 1), 50);
  const upstream = new URL(source.url);
  upstream.searchParams.set("serviceKey", env.DATA_GO_KR_SERVICE_KEY);
  upstream.searchParams.set("pageNo", "1");
  upstream.searchParams.set("numOfRows", type in PLAYGROUND_SOURCES ? "100" : "1000");
  upstream.searchParams.set("type", type in PLAYGROUND_SOURCES ? "json" : "xml");
  const unfilteredUpstream = new URL(upstream);

  const sido = clean(requestUrl.searchParams.get("sido"));
  const officialSido = REGION_NAMES[sido] || sido;
  const sigungu = clean(requestUrl.searchParams.get("sigungu"));
  const keyword = clean(requestUrl.searchParams.get("keyword"));
  if (type in PLAYGROUND_SOURCES) {
    if (officialSido) upstream.searchParams.set("sido", officialSido);
    if (sigungu) upstream.searchParams.set("sigungu", sigungu);
  } else {
    if (officialSido) upstream.searchParams.set("ctprvnNm", officialSido);
    if (sigungu) upstream.searchParams.set("signguNm", sigungu);
  }

  let rawItems;
  if (type in PLAYGROUND_SOURCES) {
    const response = await fetch(upstream, { cf: { cacheTtl: 600, cacheEverything: true } });
    if (!response.ok) throw new Error(`공공데이터 응답 오류 ${response.status}`);
    const payload = await response.json();
    const header = payload.response?.header || {};
    if (header.resultCode && !["00", "0", "0000"].includes(String(header.resultCode))) {
      throw new Error(header.resultMsg || `공공데이터 오류 ${header.resultCode}`);
    }
    rawItems = (payload.response?.body?.items || []).map((item) => normalizeJsonPlayground(item, type, source.label));
  } else {
    let xml;
    try {
      xml = await fetchXml(upstream);
    } catch {
      xml = await fetchXml(unfilteredUpstream);
    }
    rawItems = itemBlocks(xml).map((item) => normalizeItem(item, type, source.label));
  }

  const normalized = rawItems
    .filter((item) => item.title)
    .filter((item) => regionMatches(item, officialSido, sigungu))
    .filter((item) => keywordMatches(item, keyword));

  return json({
    source: source.name,
    type,
    totalCount: normalized.length,
    items: normalized.slice(0, limit),
  });
}

async function culture(requestUrl, env) {
  const sido = clean(requestUrl.searchParams.get("sido"));
  if (!sido) return json({ message: "시·도를 선택해 주세요." }, 400, "no-store");

  const upstream = new URL(CULTURE_URL);
  upstream.searchParams.set("serviceKey", env.DATA_GO_KR_SERVICE_KEY);
  upstream.searchParams.set("PageNo", "1");
  upstream.searchParams.set("numOfrows", "50");
  upstream.searchParams.set("sido", sido);
  const sigungu = clean(requestUrl.searchParams.get("sigungu"));
  const keyword = clean(requestUrl.searchParams.get("keyword"));
  const from = clean(requestUrl.searchParams.get("from"), 10).replace(/-/g, "");
  const to = clean(requestUrl.searchParams.get("to"), 10).replace(/-/g, "");
  if (sigungu) upstream.searchParams.set("sigungu", sigungu);
  if (from) upstream.searchParams.set("from", from);
  if (to) upstream.searchParams.set("to", to);

  const xml = await fetchXml(upstream);
  const items = itemBlocks(xml).map((item) => ({
    id: tag(item, ["seq", "id", "contentsid"]),
    type: "culture",
    category: tag(item, ["realmName", "realm", "category"]) || "문화행사",
    title: tag(item, ["title", "subject"]),
    place: tag(item, ["place", "facility", "eventSite"]),
    startDate: tag(item, ["startDate", "start_date"]),
    endDate: tag(item, ["endDate", "end_date"]),
    fee: tag(item, ["price", "charge", "useFee"]),
    sido: tag(item, ["sido"]),
    sigungu: tag(item, ["sigungu"]),
    image: tag(item, ["thumbnail", "imageObject", "mainImg"]),
    url: tag(item, ["url", "link", "homepage"]),
  })).filter((item) => item.title).filter((item) => keywordMatches(item, keyword));

  return json({
    source: "한국문화정보원 한눈에보는문화정보조회서비스",
    type: "culture",
    totalCount: Number(tag(xml, ["totalCount", "totalCnt"])) || items.length,
    items: items.slice(0, Math.min(Number(requestUrl.searchParams.get("limit")) || 20, 30)),
  });
}

async function airQuality(requestUrl, env) {
  const sidoName = clean(requestUrl.searchParams.get("sido")) || "서울";
  const upstream = new URL(AIR_URL);
  upstream.searchParams.set("serviceKey", env.DATA_GO_KR_SERVICE_KEY);
  upstream.searchParams.set("returnType", "xml");
  upstream.searchParams.set("numOfRows", "100");
  upstream.searchParams.set("pageNo", "1");
  upstream.searchParams.set("sidoName", sidoName);
  upstream.searchParams.set("ver", "1.3");
  const xml = await fetchXml(upstream);
  const items = itemBlocks(xml).map((item) => ({
    station: tag(item, ["stationName"]),
    dataTime: tag(item, ["dataTime"]),
    pm10: tag(item, ["pm10Value"]),
    pm25: tag(item, ["pm25Value"]),
    pm10Grade: tag(item, ["pm10Grade1h", "pm10Grade"]),
    pm25Grade: tag(item, ["pm25Grade1h", "pm25Grade"]),
  }));
  return json({ source: "한국환경공단 에어코리아", sido: sidoName, items });
}

async function forecast(requestUrl, env) {
  const nx = clean(requestUrl.searchParams.get("nx"), 3);
  const ny = clean(requestUrl.searchParams.get("ny"), 3);
  const baseDate = clean(requestUrl.searchParams.get("baseDate"), 8);
  const baseTime = clean(requestUrl.searchParams.get("baseTime"), 4) || "0500";
  if (!nx || !ny || !baseDate) return json({ message: "nx, ny, baseDate가 필요합니다." }, 400, "no-store");
  const upstream = new URL(FORECAST_URL);
  upstream.searchParams.set("serviceKey", env.DATA_GO_KR_SERVICE_KEY);
  upstream.searchParams.set("pageNo", "1");
  upstream.searchParams.set("numOfRows", "300");
  upstream.searchParams.set("dataType", "XML");
  upstream.searchParams.set("base_date", baseDate);
  upstream.searchParams.set("base_time", baseTime);
  upstream.searchParams.set("nx", nx);
  upstream.searchParams.set("ny", ny);
  const xml = await fetchXml(upstream);
  const items = itemBlocks(xml).map((item) => ({
    date: tag(item, ["fcstDate"]),
    time: tag(item, ["fcstTime"]),
    category: tag(item, ["category"]),
    value: tag(item, ["fcstValue"]),
  }));
  return json({ source: "기상청 단기예보", nx, ny, items });
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    if (request.method !== "GET") return json({ message: "GET 요청만 지원합니다." }, 405, "no-store");
    if (requestUrl.pathname === "/api/health") {
      return json({
        ok: true,
        service: "toypoppo-public-data",
        endpoints: ["places", "culture", "air", "forecast"],
      }, 200, "no-store");
    }
    if (!env.DATA_GO_KR_SERVICE_KEY) return json({ message: "공공데이터 인증키가 연결되지 않았습니다." }, 503, "no-store");

    try {
      if (requestUrl.pathname === "/api/places") return await standardPlaces(requestUrl, env);
      if (requestUrl.pathname === "/api/culture") return await culture(requestUrl, env);
      if (requestUrl.pathname === "/api/air") return await airQuality(requestUrl, env);
      if (requestUrl.pathname === "/api/forecast") return await forecast(requestUrl, env);
      return json({ message: "존재하지 않는 API 경로입니다." }, 404, "no-store");
    } catch (error) {
      return json({ message: "공공데이터 제공기관과 통신하지 못했습니다.", detail: error.message }, 502, "no-store");
    }
  },
};
