export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// 상태 확인용
export async function GET() {
  return json({ ok: true, endpoint: "render", ready: !!process.env.CONVERT_SECRET });
}

// 마크다운을 받아 문서 서식이 입혀진 HTML로 렌더(병합 표 등 포함) — kordoc renderHtml 사용.
export async function POST(req) {
  const secret = process.env.CONVERT_SECRET || "";
  const got = req.headers.get("x-oasis-secret") || "";
  if (!secret || got !== secret) return json({ ok: false, error: "unauthorized" }, 401);

  let body;
  try { body = await req.json(); } catch (e) { return json({ ok: false, error: "bad json" }, 400); }
  const md = body && body.markdown;
  if (typeof md !== "string" || !md.trim()) return json({ ok: false, error: "no markdown" }, 400);

  let renderHtml;
  try { ({ renderHtml } = await import("kordoc")); }
  catch (e) { return json({ ok: false, error: "kordoc load failed: " + String((e && e.message) || e) }, 500); }

  try {
    const html = renderHtml(md);
    return json({ ok: true, html: String(html || "") });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) });
  }
}
