// Node 런타임 필수(kordoc은 Buffer 등 Node API 사용). Edge에서는 동작 안 함.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 큰 파일 변환 대비(초). Vercel 요금제 상한까지 적용됨.

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// 상태 확인용: 브라우저로 열면 동작 여부만 알려줌 (kordoc은 불러오지 않음)
export async function GET() {
  return json({ ok: true, service: "oasis-doc-convert", ready: !!process.env.CONVERT_SECRET });
}

export async function POST(req) {
  // 1) 비밀키 인증 — 아무나 호출하지 못하게
  const secret = process.env.CONVERT_SECRET || "";
  const got = req.headers.get("x-oasis-secret") || "";
  if (!secret || got !== secret) return json({ ok: false, error: "unauthorized" }, 401);

  // 2) 본문 파싱
  let body;
  try { body = await req.json(); } catch (e) { return json({ ok: false, error: "bad json" }, 400); }
  const b64 = body && body.base64;
  const filename = (body && body.filename) || "";
  if (!b64) return json({ ok: false, error: "no file" }, 400);

  // 3) base64 → 바이트
  let bytes;
  try { bytes = Uint8Array.from(Buffer.from(String(b64), "base64")); }
  catch (e) { return json({ ok: false, error: "bad base64" }, 400); }
  if (!bytes.length) return json({ ok: false, error: "empty file" }, 400);

  // 4) kordoc은 여기서만(변환 시점에) 불러온다 — 콜드스타트 크래시 방지 + 오류를 JSON으로 반환
  let parse;
  try {
    ({ parse } = await import("kordoc"));
  } catch (e) {
    return json({ ok: false, error: "kordoc load failed: " + String((e && e.message) || e) }, 500);
  }

  // 5) 마크다운 변환 (HWP·HWPX·HWPML·DOCX·XLSX 등)
  try {
    const result = await parse(bytes.buffer);
    if (!result || !result.success) {
      return json({ ok: false, error: (result && result.error) || "parse failed" });
    }
    return json({
      ok: true,
      filename,
      markdown: result.markdown || "",
      meta: result.metadata || {},
    });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) });
  }
}
