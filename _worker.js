export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.wedding-guide.co.kr") {
      url.hostname = "wedding-guide.co.kr";
      return Response.redirect(url.toString(), 301);
    }

    if (["/data/fairs.json", "/data/wedding-publication-status.json"].includes(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    if (/^\/(?:data|logs|scripts|tests|tools)(?:\/|$)/.test(url.pathname)) {
      return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || /\.[a-z0-9]+$/i.test(url.pathname)) {
      return response;
    }

    const htmlUrl = new URL(url);
    htmlUrl.pathname = `${url.pathname.replace(/\/$/, "")}.html`;
    const htmlRequest = new Request(htmlUrl.toString(), request);
    const htmlResponse = await env.ASSETS.fetch(htmlRequest);

    return htmlResponse.status === 404 ? response : htmlResponse;
  },
};
