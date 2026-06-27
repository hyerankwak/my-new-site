const API_BASE = "https://apis.data.go.kr/B553457/cultureinfo";

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

function parseItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1];
    return {
      id: tag(item, ["seq", "id", "contentsid"]),
      title: tag(item, ["title", "subject"]),
      place: tag(item, ["place", "facility", "eventSite"]),
      startDate: tag(item, ["startDate", "start_date"]),
      endDate: tag(item, ["endDate", "end_date"]),
      realm: tag(item, ["realmName", "realm", "category"]),
      price: tag(item, ["price", "charge", "useFee"]),
      sido: tag(item, ["sido"]),
      sigungu: tag(item, ["sigungu"]),
      image: tag(item, ["thumbnail", "imageObject", "mainImg"]),
      url: tag(item, ["url", "link", "homepage"]),
    };
  });
}

function clean(value, max = 60) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    if (request.method !== "GET") return json({ message: "GET 요청만 지원합니다." }, 405, "no-store");
    if (requestUrl.pathname === "/api/health") return json({ ok: true, service: "toypoppo-public-data" }, 200, "no-store");
    if (requestUrl.pathname !== "/api/culture") return json({ message: "존재하지 않는 API 경로입니다." }, 404, "no-store");
    if (!env.DATA_GO_KR_SERVICE_KEY) return json({ message: "공공데이터 인증키가 아직 연결되지 않았습니다." }, 503, "no-store");

    const sido = clean(requestUrl.searchParams.get("sido"));
    if (!sido) return json({ message: "시·도를 선택해 주세요." }, 400, "no-store");

    const upstream = new URL(`${API_BASE}/area2`);
    upstream.searchParams.set("serviceKey", env.DATA_GO_KR_SERVICE_KEY);
    upstream.searchParams.set("PageNo", "1");
    upstream.searchParams.set("numOfrows", String(Math.min(Number(requestUrl.searchParams.get("limit")) || 20, 30)));
    upstream.searchParams.set("sido", sido);

    const sigungu = clean(requestUrl.searchParams.get("sigungu"));
    const keyword = clean(requestUrl.searchParams.get("keyword"));
    const from = clean(requestUrl.searchParams.get("from"), 10).replace(/-/g, "");
    const to = clean(requestUrl.searchParams.get("to"), 10).replace(/-/g, "");
    if (sigungu) upstream.searchParams.set("sigungu", sigungu);
    if (keyword) upstream.searchParams.set("keyword", keyword);
    if (from) upstream.searchParams.set("from", from);
    if (to) upstream.searchParams.set("to", to);

    try {
      const response = await fetch(upstream, { cf: { cacheTtl: 300, cacheEverything: true } });
      const xml = await response.text();
      if (!response.ok) throw new Error(`공공데이터 응답 오류 ${response.status}`);

      const resultCode = tag(xml, ["resultCode", "returnReasonCode"]);
      const resultMessage = tag(xml, ["resultMsg", "returnAuthMsg"]);
      if (resultCode && !["00", "0", "0000"].includes(resultCode)) {
        return json({ message: resultMessage || "공공데이터 제공기관에서 오류를 반환했습니다.", code: resultCode }, 502, "no-store");
      }

      let items = parseItems(xml);
      if (keyword) {
        const needle = keyword.toLocaleLowerCase("ko-KR");
        items = items.filter((item) => `${item.title} ${item.place} ${item.realm}`.toLocaleLowerCase("ko-KR").includes(needle));
      }
      return json({
        source: "한국문화정보원 한눈에보는문화정보조회서비스",
        updatedAt: new Date().toISOString(),
        totalCount: Number(tag(xml, ["totalCount", "totalCnt"])) || items.length,
        items,
      });
    } catch (error) {
      return json({ message: "공공데이터 제공기관과 통신하지 못했습니다.", detail: error.message }, 502, "no-store");
    }
  },
};
