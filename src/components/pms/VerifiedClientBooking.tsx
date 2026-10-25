"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { londonDateKey } from "@/lib/bookingCalendar";
import { AppointmentCalendar } from "./AppointmentCalendar";
import styles from "./VerifiedClientBooking.module.css";

type Pet = { id: string; name: string; species: string };
type VisitType = { id: string; name: string; duration: number };
type Slot = { start: string; end: string; choice: string };
type Payload = { ok: boolean; error?: string; message?: string; state?: string; pets?: Pet[]; types?: VisitType[]; slots?: Slot[] };

export function VerifiedClientBooking({ clinicPhone }: { clinicPhone: string }) {
  const [stage, setStage] = useState<"email" | "code" | "pets" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [types, setTypes] = useState<VisitType[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [petId, setPetId] = useState("");
  const [visitTypeId, setVisitTypeId] = useState("");
  const [choice, setChoice] = useState("");
  const [month, setMonth] = useState(() => londonDateKey(new Date()).slice(0, 7));
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [locked, setLocked] = useState(false);
  const [slotsChecked, setSlotsChecked] = useState(false);

  function clearAvailability() {
    setSlots([]); setChoice(""); setSelectedDate(""); setSlotsChecked(false);
  }

  async function api(query: string, body?: Record<string, unknown>): Promise<Payload> {
    const response = await fetch(`/api/client-booking${query}`, {
      method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store",
      ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    });
    const data = await response.json() as Payload;
    if (response.status === 401) { setStage("email"); setPets([]); clearAvailability(); }
    if (!response.ok || !data.ok) throw new Error(data.error || "Please call the practice for help.");
    return data;
  }

  async function loadPets() {
    const data = await api("?action=pets");
    setStage("pets"); setPets(data.pets || []); setNotRegistered(data.state === "not_registered");
    if (data.pets?.length) setTypes((await api("?action=types")).types || []);
  }

  useEffect(() => {
    let active = true;
    // Session cookies survive reload; personal details and tokens stay out of localStorage.
    fetch("/api/client-booking?action=pets", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (response.status === 401) return;
        const data = await response.json() as Payload;
        if (!active) return;
        if (!response.ok) { setMessage(data.error || "Please call the practice for help."); return; }
        setStage("pets"); setPets(data.pets || []); setNotRegistered(data.state === "not_registered");
        if (data.pets?.length) {
          const typeResponse = await fetch("/api/client-booking?action=types", { cache: "no-store", credentials: "same-origin" });
          const typeData = await typeResponse.json() as Payload;
          if (active) { setTypes(typeData.types || []); if (!typeData.ok) setMessage(typeData.error || "Please reload your details."); }
        }
      }).catch(() => { if (active) setMessage("Unable to connect. Please try again or call the practice."); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = setTimeout(() => setRetryAfter((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [retryAfter]);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setMessage("");
    try { await action(); } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again or call the practice."); }
    finally { setBusy(false); }
  }

  async function requestCode(event?: FormEvent) {
    event?.preventDefault();
    await run(async () => {
      const result = await api("", { action: "request-code", email });
      setStage("code"); setCode(""); setLocked(false); setRetryAfter(60); setMessage(result.message || "Check your inbox for a code.");
    });
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    await run(async () => { await api("", { action: "verify-code", code }); setCode(""); setStage("pets"); await loadPets(); });
  }

  async function reset() {
    await run(async () => {
      await api("", { action: "logout" });
      setStage("email"); setEmail(""); setCode(""); setPets([]); setTypes([]); setSlots([]);
      setPetId(""); setVisitTypeId(""); setChoice(""); setNotes(""); setLocked(false); setNotRegistered(false);
      clearAvailability();
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!choice || !petId || locked) return;
    await run(async () => {
      setLocked(true);
      // Never silently retry a write: the clinic may already have received it.
      const result = await api("", { action: "book", petId, choice, notes });
      setStage("done"); setMessage(result.message || "Your request has been sent to the practice.");
    });
  }

  return (
    <section className={styles.layout} aria-labelledby="verified-booking-title">
      <div className={styles.intro}>
        <p className="eyebrow">Book online</p>
        <h1 id="verified-booking-title">A visit for your pet.</h1>
        <p>Verify your email, choose your registered pet, then request a suitable appointment.</p>
        <ol className={styles.steps} aria-label="Booking steps">
          <li aria-current={stage === "email" || stage === "code" ? "step" : undefined}>Verify your email</li>
          <li aria-current={stage === "pets" ? "step" : undefined}>Choose your pet and time</li>
          <li aria-current={stage === "done" ? "step" : undefined}>Send your request</li>
        </ol>
        <p>New to the practice? <Link href="/register">Register you and your pet first</Link>, then return here.</p>
        <p>For urgent concerns or booking help, call <a href={`tel:${clinicPhone.replace(/\D/g, "")}`}>{clinicPhone}</a>.</p>
      </div>
      <div className={styles.panel} aria-busy={busy}>
        {stage === "email" && <form onSubmit={requestCode} className={styles.form}>
          <h2>Let&apos;s start with your email</h2>
          <p>Use the email address registered with the practice. We will send a six-digit code before showing any pet details.</p>
          <label>Email address<input type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} /></label>
          <button className="button button-primary" disabled={busy}>{busy ? "Please wait..." : "Send verification code"}</button>
        </form>}
        {stage === "code" && <form onSubmit={verify} className={styles.form}>
          <h2>Check your inbox</h2>
          <p>Enter the code sent to {email}. It expires after 10 minutes. Please check your spam folder too.</p>
          <label>Verification code<input className={styles.code} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} disabled={busy} /></label>
          <button className="button button-primary" disabled={busy}>Verify email</button>
          <div className={styles.actions}>
            <button type="button" onClick={() => requestCode()} disabled={busy || retryAfter > 0}>{retryAfter > 0 ? `Resend in ${retryAfter}s` : "Resend code"}</button>
            <button type="button" onClick={reset} disabled={busy}>Use another email</button>
          </div>
        </form>}
        {stage === "pets" && <>
          <div className={styles.actions}><h2>Your appointment request</h2><button onClick={reset} disabled={busy}>Sign out</button></div>
          {!pets.length ? <div className={styles.form}>
            <p>{notRegistered ? "We could not find a client record for your verified email. If you are already registered, contact us before registering again." : "No bookable pets were returned. Please contact the practice so we can check your record."}</p>
            {notRegistered && <Link className="button button-primary" href="/register">Register with the practice</Link>}
            <button className="button button-muted" disabled={busy} onClick={() => run(loadPets)}>Reload details</button>
          </div> : <form className={styles.form} onSubmit={submit}>
            <label><span id="booking-pet-label">Your pet</span><select aria-labelledby="booking-pet-label" required value={petId} onChange={(event) => { setPetId(event.target.value); clearAvailability(); }} disabled={busy || locked}><option value="">Choose your pet</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}{pet.species ? ` (${pet.species})` : ""}</option>)}</select></label>
            <label><span id="booking-type-label">Appointment type</span><select aria-labelledby="booking-type-label" required value={visitTypeId} disabled={busy || locked} onChange={(event) => { setVisitTypeId(event.target.value); clearAvailability(); }}><option value="">Choose appointment type</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name} ({type.duration} minutes)</option>)}</select></label>
            {!types.length && <><p>No online appointment types are available. Please call the practice or reload your details.</p><button type="button" disabled={busy} onClick={() => run(loadPets)}>Reload details</button></>}
            <AppointmentCalendar month={month} slots={slots} selectedDate={selectedDate} choice={choice}
              checked={slotsChecked} disabled={busy || locked} canCheck={Boolean(visitTypeId && petId)}
              onMonthChange={(value) => { setMonth(value); clearAvailability(); }}
              onDateChange={(value) => { setSelectedDate(value); setChoice(""); }}
              onChoiceChange={setChoice}
              onCheck={() => run(async () => {
                clearAvailability();
                const result = await api(`?action=slots&visitTypeId=${encodeURIComponent(visitTypeId)}&month=${encodeURIComponent(month)}`);
                setSlots(result.slots || []); setSlotsChecked(true);
              })} />
            <label>Reason for your visit (optional)<textarea value={notes} maxLength={1000} rows={3} disabled={busy || locked} onChange={(event) => setNotes(event.target.value)} /></label>
            <p>This sends a request to the practice. Your appointment is not confirmed until the team confirms it.</p>
            <button className="button button-primary" disabled={busy || locked || !choice || !petId}>Send appointment request</button>
            {locked && <p>If you did not receive a confirmation, call the practice before trying again. This avoids duplicate bookings.</p>}
          </form>}
        </>}
        {stage === "done" && <div className={styles.form}><h2>Request sent</h2><p>Thank you. The practice will review your request.</p><button className="button button-muted" disabled={busy} onClick={reset}>Sign out</button></div>}
        <p className={styles.message} role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
