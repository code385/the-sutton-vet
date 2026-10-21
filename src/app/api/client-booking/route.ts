import { NextRequest, NextResponse } from "next/server";
import { assertBookingAccessConfig, challengeCookie, codeSeconds, cookieOptions, getBookingSession, limitBookingRequests, requestBookingCode, revokeBookingChallenge, revokeBookingSession, sessionCookie, sessionSeconds, verifyBookingCode } from "@/lib/bookingAuth";
import { BookingAccessError } from "@/lib/bookingStore";
import { bookForVerifiedClient, getPublicVisitTypes, getVerifiedPets, getVerifiedSlots } from "@/lib/clientBooking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" } });
const ip = (request: NextRequest) => process.env.VERCEL === "1" ? (request.headers.get("x-vercel-forwarded-for") || "unknown").slice(0, 100) : "shared-server";

function failure(error: unknown) {
  const status = error instanceof BookingAccessError ? error.status : 503;
  return json({ ok: false, error: error instanceof BookingAccessError ? error.message : "The service is temporarily unavailable. Please call the practice." }, status);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getBookingSession(request.cookies.get(sessionCookie)?.value);
    await limitBookingRequests(`read:${session.token}`, 30, 60);
    const action = request.nextUrl.searchParams.get("action");
    if (action === "pets") return json({ ok: true, ...await getVerifiedPets(session) });
    if (action === "types") return json({ ok: true, types: await getPublicVisitTypes() });
    if (action === "slots") return json({ ok: true, slots: await getVerifiedSlots(session, request.nextUrl.searchParams.get("visitTypeId") || "", request.nextUrl.searchParams.get("month") || "") });
    return json({ ok: false, error: "Unknown request." }, 400);
  } catch (error) { return failure(error); }
}

export async function POST(request: NextRequest) {
  try {
    assertBookingAccessConfig();
    if (request.headers.get("origin") !== new URL(process.env.NEXT_PUBLIC_SITE_URL!).origin) throw new BookingAccessError(403, "Please submit this request from the practice website.");
    if (!request.headers.get("content-type")?.startsWith("application/json")) throw new BookingAccessError(400, "Send a valid request.");
    // Bound the body before parsing, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new BookingAccessError(400, "Send a valid request.");
    let size = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > 8192) { await reader.cancel(); throw new BookingAccessError(413, "The request is too large."); }
      chunks.push(part.value);
    }
    let input: Record<string, unknown>;
    try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new BookingAccessError(400, "Send a valid request."); }
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new BookingAccessError(400, "Send a valid request.");
    const oldSession = request.cookies.get(sessionCookie)?.value;
    if (input.action === "request-code") {
      const challenge = await requestBookingCode(input.email, ip(request), request.cookies.get(challengeCookie)?.value);
      await revokeBookingSession(oldSession);
      const response = json({ ok: true, message: "Check your inbox for a verification code. It expires in 10 minutes.", resendAfter: 60 });
      response.cookies.set(challengeCookie, challenge, { ...cookieOptions, maxAge: codeSeconds });
      response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    if (input.action === "verify-code") {
      const session = await verifyBookingCode(request.cookies.get(challengeCookie)?.value, input.code, ip(request));
      await revokeBookingSession(oldSession);
      const response = json({ ok: true });
      response.cookies.set(sessionCookie, session, { ...cookieOptions, maxAge: sessionSeconds });
      response.cookies.set(challengeCookie, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    if (input.action === "logout") {
      await revokeBookingSession(oldSession);
      await revokeBookingChallenge(request.cookies.get(challengeCookie)?.value);
      const response = json({ ok: true });
      response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
      response.cookies.set(challengeCookie, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    const session = await getBookingSession(oldSession);
    await limitBookingRequests(`book:${session.email}`, 6, 3600);
    if (input.action === "book") return json({ ok: true, ...await bookForVerifiedClient(session, input) });
    return json({ ok: false, error: "Unknown request." }, 400);
  } catch (error) { return failure(error); }
}
