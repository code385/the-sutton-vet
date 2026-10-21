import { bookingDigest, bookingKey, limitBookingRequests, readBookingChoice, signBookingChoice } from "./bookingAuth";
import { BookingAccessError, bookingStore } from "./bookingStore";
import { getLupaRecordId, lupaConfig, lupaFetch, withLupaScope } from "./lupa";
import { sendBookingConfirmation } from "./transactionalEmail";

type RecordData = Record<string, unknown>;
type Session = { email: string; token: string };
type Pet = { id: string; name: string; species: string };
type VisitType = { id: string; name: string; duration: number; order: number };
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const record = (value: unknown): RecordData => value && typeof value === "object" && !Array.isArray(value) ? value as RecordData : {};

async function requestLupa(path: string, init?: RequestInit) {
  await limitBookingRequests("lupa-api", 75, 60);
  return lupaFetch<unknown>(path, { ...init, signal: AbortSignal.timeout(12000) });
}

export function readLupaList(payload: unknown): RecordData[] {
  const items = Array.isArray(payload) ? payload : record(payload).data;
  if (!Array.isArray(items)) throw new BookingAccessError(503, "The practice system returned an unexpected response. Please call the practice.");
  return items.map(record);
}

async function listAll(path: string) {
  const items: RecordData[] = [];
  let cursor = "";
  for (let page = 0; page < 5; page++) {
    const payload = await requestLupa(`${path}${path.includes("?") ? "&" : "?"}limit=500${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
    items.push(...readLupaList(payload));
    if (!record(payload).hasMore) return items;
    const next = record(payload).nextCursor;
    if (typeof next !== "string" || !next || next === cursor) break;
    cursor = next;
  }
  throw new BookingAccessError(503, "We could not load all records safely. Please call the practice.");
}

export async function getVerifiedPets(session: Session): Promise<{ state: "ready" | "not_registered"; pets: Pet[] }> {
  const payload = await requestLupa("/v1/clients/search", {
    method: "POST", body: JSON.stringify({ companyId: lupaConfig.companyId, filter: { email: { eq: session.email } }, limit: 5 }),
  });
  const matches = readLupaList(payload).filter((client) => typeof client.email === "string" && client.email.trim().toLowerCase() === session.email);
  if (record(payload).hasMore || matches.length > 1) throw new BookingAccessError(409, "Please call the practice so we can confirm the correct client record.");
  if (!matches.length) return { state: "not_registered", pets: [] };
  const clientId = getLupaRecordId(matches[0]);
  if (!clientId || !uuid.test(clientId)) throw new BookingAccessError(503, "We could not confirm your client record. Please call the practice.");
  const pets = await listAll(`/v1/pets?clientId=${encodeURIComponent(clientId)}`);
  return { state: "ready", pets: pets.filter((pet) => {
    const id = getLupaRecordId(pet);
    return id && uuid.test(id) && !pet.isArchived && !pet.isDeceased && (!pet.clientId || pet.clientId === clientId);
  }).map((pet) => ({ id: getLupaRecordId(pet)!, name: typeof pet.name === "string" ? pet.name : "Your pet", species: typeof pet.species === "string" ? pet.species : "" })) };
}

export async function getPublicVisitTypes(): Promise<VisitType[]> {
  const key = bookingKey(`types:${lupaConfig.companyId}:${lupaConfig.storeId}`);
  const cached = await bookingStore<string | null>(["GET", key]);
  if (cached) return JSON.parse(cached) as VisitType[];
  const items = await listAll("/v1/appointment-types");
  const types = items.filter((item) => item.isPublic === true && item.isArchived === false && typeof item.id === "string" && uuid.test(item.id) && typeof item.duration === "number" && item.duration >= 5 && item.duration <= 480)
    .map((item) => ({ id: String(item.id), name: String(item.name || "Appointment"), duration: Number(item.duration), order: Number(item.onlineBookingOrder) || 0 }))
    .sort((a, b) => a.order - b.order);
  await bookingStore(["SET", key, JSON.stringify(types), "EX", 60]);
  return types;
}

export function extractSlots(payload: unknown): RecordData[] {
  const result: RecordData[] = [];
  const queue: unknown[] = [payload];
  for (let visited = 0; queue.length && visited < 10000; visited++) {
    const node = queue.shift();
    if (Array.isArray(node)) queue.push(...node);
    else if (node && typeof node === "object") {
      const item = record(node);
      if (typeof item.start === "string" && typeof item.end === "string") result.push(item);
      else queue.push(...Object.values(item).filter((value) => value && typeof value === "object"));
    }
  }
  return result;
}

export async function getVerifiedSlots(session: Session, visitTypeId: string, month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new BookingAccessError(400, "Choose a valid month.");
  const monthStart = new Date(`${month}-01T00:00:00Z`).getTime();
  if (monthStart < Date.now() - 32 * 86400000 || monthStart > Date.now() + 366 * 86400000) throw new BookingAccessError(400, "Choose a month within the next year.");
  const type = (await getPublicVisitTypes()).find((item) => item.id === visitTypeId);
  if (!type) throw new BookingAccessError(400, "Choose an available appointment type.");
  const query = new URLSearchParams({ storeId: lupaConfig.storeId, visitTypeId, duration: String(type.duration), month });
  const payload = await requestLupa(`/v2/get-available-slots?${query}`);
  const seen = new Set<string>();
  return extractSlots(payload).filter((slot) => {
    const start = Date.parse(String(slot.start));
    const end = Date.parse(String(slot.end));
    const signature = JSON.stringify([start, end, slot.employeeId, slot.roomId]);
    if (!Number.isFinite(start) || start <= Date.now() || end - start !== type.duration * 60000 || seen.has(signature)) return false;
    if (slot.employeeId && !uuid.test(String(slot.employeeId))) return false;
    if (slot.roomId && !uuid.test(String(slot.roomId))) return false;
    seen.add(signature);
    return true;
  }).slice(0, 300).map((slot) => {
    const start = new Date(String(slot.start)).toISOString();
    const end = new Date(String(slot.end)).toISOString();
    const choice = { visitTypeId, start, end, employeeId: slot.employeeId || undefined, roomId: slot.roomId || undefined };
    return { start, end, choice: signBookingChoice(choice, session.token) };
  });
}

export async function bookForVerifiedClient(session: Session, input: RecordData) {
  const choice = readBookingChoice(input.choice, session.token);
  if (typeof input.petId !== "string" || !uuid.test(input.petId) || typeof choice.start !== "string" || !Number.isFinite(Date.parse(choice.start)) || Date.parse(choice.start) <= Date.now()) throw new BookingAccessError(400, "Choose your pet and an available time.");
  if (typeof input.notes !== "string" || input.notes.length > 1000) throw new BookingAccessError(400, "Notes must be 1,000 characters or fewer.");
  const { pets } = await getVerifiedPets(session);
  const pet = pets.find((item) => item.id === input.petId);
  if (!pet) throw new BookingAccessError(403, "This pet is not available for your verified account. Please call the practice.");
  if (!(await getPublicVisitTypes()).some((item) => item.id === choice.visitTypeId)) throw new BookingAccessError(400, "This appointment type is no longer available.");
  // Same owner/pet/time has a stable upstream key, even across fresh OTP sessions.
  const attempt = bookingDigest(JSON.stringify([session.email, pet.id, choice.visitTypeId, choice.start, choice.end, choice.employeeId, choice.roomId]));
  const key = bookingKey(`appointment:${attempt}`);
  const locked = await bookingStore(["SET", key, JSON.stringify({ state: "pending" }), "NX", "EX", 86400]);
  if (!locked) {
    const saved = JSON.parse(await bookingStore<string>(["GET", key]) || "{}");
    if (saved.state === "complete") return saved.result as { message: string; emailSent: boolean };
    throw new BookingAccessError(409, "This request may already have reached the clinic. Please call before trying again to avoid duplicate bookings.");
  }
  let appointment: unknown;
  try {
    appointment = await requestLupa("/v1/appointments", {
      method: "POST", headers: { "Idempotency-Key": `website-${attempt}` },
      body: JSON.stringify(withLupaScope({ petId: pet.id, visitTypeId: choice.visitTypeId, start: choice.start, end: choice.end, employeeId: choice.employeeId, roomId: choice.roomId, status: "requested", notes: input.notes.trim() || undefined }, "booking")),
    });
  } catch {
    throw new BookingAccessError(409, "We could not confirm whether this request reached the clinic. Please call before submitting again.");
  }
  const id = getLupaRecordId(appointment);
  if (!id) throw new BookingAccessError(409, "The clinic may have received your request. Please call to confirm before trying again.");
  const result = { message: "Your appointment request has been sent. The practice will confirm your appointment; this is not yet a confirmed booking.", emailSent: false };
  try {
    await bookingStore(["SET", key, JSON.stringify({ state: "complete", result }), "EX", 86400]);
    const email = await sendBookingConfirmation({ email: session.email, firstName: "there", petName: pet.name, appointmentStart: choice.start, reference: id });
    result.emailSent = email.sent;
    await bookingStore(["SET", key, JSON.stringify({ state: "complete", result }), "EX", 86400]);
  } catch {
    // The upstream appointment already exists; never turn a notification/cache failure into a retry prompt.
    console.error("[Verified booking] Request created; notification or receipt storage unavailable.");
  }
  return result;
}
