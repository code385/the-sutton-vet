export class BookingAccessError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function bookingStore<T = unknown>(command: (string | number)[]): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url?.startsWith("https://") || !token) throw new BookingAccessError(503, "Online verification is not configured. Please call the practice.");
  const response = await fetch(url, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(8000),
  });
  const body = await response.json() as { result?: T; error?: string };
  if (!response.ok || body.error || !("result" in body)) throw new BookingAccessError(503, "Verification is temporarily unavailable. Please try later.");
  return body.result as T;
}

// Fixed-window counters and expiry are updated together across serverless workers.
export const rateScript = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count
`;

// Consumption, failed-attempt limits and session creation must be one operation.
export const verifyScript = `
local raw = redis.call('GET', KEYS[1])
if not raw then return 0 end
local record = cjson.decode(raw)
if record.digest ~= ARGV[1] then
  record.attempts = record.attempts + 1
  if record.attempts >= 5 then redis.call('DEL', KEYS[1])
  else redis.call('SET', KEYS[1], cjson.encode(record), 'KEEPTTL') end
  return 0
end
redis.call('SET', KEYS[2], record.email, 'EX', ARGV[2])
redis.call('DEL', KEYS[1])
return 1
`;
