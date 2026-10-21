import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { BookingAccessError, bookingStore, rateScript, verifyScript } from "./bookingStore";
import { sendVerificationCode } from "./transactionalEmail";

export const challengeCookie = "sv_booking_challenge";
export const sessionCookie = "sv_booking_session";
export const sessionSeconds = 1800;
export const codeSeconds = 600;
export const cookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/api/client-booking",
};

export function assertBookingAccessConfig() {
  const required = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "BOOKING_AUTH_SECRET", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "LUPA_API_KEY", "LUPA_COMPANY_ID", "LUPA_STORE_ID", "NEXT_PUBLIC_SITE_URL"];
  if (process.env.LUPA_CLIENT_BOOKING_ENABLED !== "true" || required.some((key) => !process.env[key]?.trim()) || (process.env.BOOKING_AUTH_SECRET?.length || 0) < 32) {
    throw new BookingAccessError(503, "Online verification is not configured. Please call the practice.");
  }
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
  if (!["http:", "https:"].includes(origin.protocol) || origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password) throw new BookingAccessError(503, "Configure the website origin without a path.");
  if (process.env.NODE_ENV === "production" && origin.protocol !== "https:") throw new BookingAccessError(503, "Online verification requires a secure website address.");
  const sender = process.env.RESEND_FROM_EMAIL!.trim();
  if (/YOUR_|PLACEHOLDER/i.test(sender) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(sender.match(/<([^<>]+)>$/)?.[1] || sender)) throw new BookingAccessError(503, "Configure a verified email sender before enabling online verification.");
}

export function bookingDigest(value: string) {
  const secret = process.env.BOOKING_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new BookingAccessError(503, "Online verification is not configured.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function bookingKey(value: string) { return `sv:booking:${bookingDigest(value)}`; }

export function normaliseBookingEmail(value: unknown) {
  if (typeof value !== "string") throw new BookingAccessError(400, "Enter a valid email address.");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BookingAccessError(400, "Enter a valid email address.");
  return email;
}

export async function limitBookingRequests(identity: string, limit: number, seconds = 3600) {
  const count = await bookingStore<number>(["EVAL", rateScript, 1, bookingKey(`limit:${identity}`), seconds]);
  if (count > limit) throw new BookingAccessError(429, "Too many attempts. Please wait before trying again.");
}

export async function requestBookingCode(value: unknown, ip: string, previousChallenge?: string) {
  assertBookingAccessConfig();
  const email = normaliseBookingEmail(value);
  await limitBookingRequests(`send-ip:${ip}`, 20);
  await limitBookingRequests(`send-email:${email}`, 5);
  await limitBookingRequests("send-global", 200);
  await limitBookingRequests(`cooldown:${email}`, 1, 60);
  const challenge = randomBytes(32).toString("hex");
  const code = String(randomInt(100000, 1000000));
  const key = bookingKey(`challenge:${challenge}`);
  await bookingStore(["SET", key, JSON.stringify({ email, digest: bookingDigest(`${challenge}:${code}`), attempts: 0 }), "EX", codeSeconds]);
  if (previousChallenge && /^[a-f0-9]{64}$/.test(previousChallenge)) await bookingStore(["DEL", bookingKey(`challenge:${previousChallenge}`)]);
  // All valid addresses receive the same response; Lupa lookup only happens after verification.
  const result = await sendVerificationCode({ email, code, reference: challenge });
  if (!result.sent) {
    await bookingStore(["DEL", key]);
    throw new BookingAccessError(503, "We could not send a code. Please try later or call the practice.");
  }
  return challenge;
}

export async function verifyBookingCode(challenge: string | undefined, code: unknown, ip: string) {
  assertBookingAccessConfig();
  await limitBookingRequests(`verify-ip:${ip}`, 60);
  if (!challenge || !/^[a-f0-9]{64}$/.test(challenge) || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    throw new BookingAccessError(400, "The code is invalid or expired. Request a new code if needed.");
  }
  const token = randomBytes(32).toString("hex");
  const result = await bookingStore<number>(["EVAL", verifyScript, 2, bookingKey(`challenge:${challenge}`), bookingKey(`session:${token}`), bookingDigest(`${challenge}:${code}`), sessionSeconds]);
  if (result !== 1) throw new BookingAccessError(400, "The code is invalid or expired. Request a new code if needed.");
  return token;
}

export async function getBookingSession(token?: string) {
  assertBookingAccessConfig();
  if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new BookingAccessError(401, "Please verify your email to continue.");
  const email = await bookingStore<string | null>(["GET", bookingKey(`session:${token}`)]);
  if (!email) throw new BookingAccessError(401, "Your verification has expired. Please verify your email again.");
  return { email: normaliseBookingEmail(email), token };
}

export async function revokeBookingSession(token?: string) {
  if (token && /^[a-f0-9]{64}$/.test(token)) await bookingStore(["DEL", bookingKey(`session:${token}`)]);
}

export async function revokeBookingChallenge(token?: string) {
  if (token && /^[a-f0-9]{64}$/.test(token)) await bookingStore(["DEL", bookingKey(`challenge:${token}`)]);
}

export function signBookingChoice(payload: Record<string, unknown>, sessionToken: string) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, session: bookingDigest(sessionToken), expires: Date.now() + codeSeconds * 1000 })).toString("base64url");
  return `${encoded}.${bookingDigest(encoded)}`;
}

export function readBookingChoice(token: unknown, sessionToken: string): Record<string, unknown> {
  if (typeof token !== "string" || token.length > 4096) throw new BookingAccessError(400, "Choose an available time again.");
  const [body, signature, extra] = token.split(".");
  if (extra || !body || !signature || !/^[a-f0-9]{64}$/.test(signature) || !timingSafeEqual(Buffer.from(signature), Buffer.from(bookingDigest(body)))) throw new BookingAccessError(400, "Choose an available time again.");
  let data: Record<string, unknown>;
  try { data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { throw new BookingAccessError(400, "Choose an available time again."); }
  if (!data || data.session !== bookingDigest(sessionToken) || typeof data.expires !== "number" || data.expires < Date.now()) throw new BookingAccessError(400, "That time selection expired. Check available times again.");
  return data;
}
