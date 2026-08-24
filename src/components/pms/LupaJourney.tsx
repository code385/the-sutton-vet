"use client";

import { FormEvent, useEffect, useState } from "react";

type RecordItem = { id?: string; name?: string; title?: string; duration?: number; start?: string; end?: string; startsAt?: string; endsAt?: string };
type Props = { mode: "book" | "register"; clinicPhone: string };

const normaliseItems = (value: unknown): RecordItem[] => {
  if (Array.isArray(value)) return value as RecordItem[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return normaliseItems(record.data || record.items || record.slots || []);
  }
  return [];
};

export function LupaJourney({ mode, clinicPhone }: Props) {
  const [types, setTypes] = useState<RecordItem[]>([]);
  const [slots, setSlots] = useState<RecordItem[]>([]);
  const [visitTypeId, setVisitTypeId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<RecordItem | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(mode === "book");
  const isBooking = mode === "book";

  useEffect(() => {
    if (!isBooking) return;
    fetch("/api/lupa/appointment-types")
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.available) throw new Error(payload.error || "Appointment types are unavailable.");
        setTypes(normaliseItems(payload.data));
      })
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [isBooking]);

  async function loadSlots() {
    if (!visitTypeId) return;
    setLoading(true);
    setMessage("");
    const selectedType = types.find((type) => type.id === visitTypeId);
    const month = new Date().toISOString().slice(0, 7);
    const duration = Math.max(5, Math.min(480, Number(selectedType?.duration) || 30));
    try {
      const response = await fetch(`/api/lupa/available-slots?month=${month}&duration=${duration}&visitTypeId=${encodeURIComponent(visitTypeId)}`);
      const payload = await response.json();
      if (!payload.available) throw new Error(payload.error || "Live slots are unavailable.");
      setSlots(normaliseItems(payload.data));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Live slots are unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());
    if (isBooking) {
      if (!selectedSlot) { setMessage("Please choose an available appointment time first."); return; }
      body.visitTypeId = visitTypeId;
      body.start = selectedSlot.start || selectedSlot.startsAt || "";
      body.end = selectedSlot.end || selectedSlot.endsAt || "";
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(isBooking ? "/api/lupa/booking" : "/api/lupa/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      setMessage(payload.message || payload.error || "Please try again.");
      if (payload.ok) event.currentTarget.reset();
    } catch {
      setMessage("We could not send your request. Please call the clinic instead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="lupa-journey" aria-labelledby="lupa-journey-title">
      <div className="lupa-journey-intro">
        <p className="eyebrow">Lupa online care</p>
        <h1 id="lupa-journey-title">{isBooking ? "Book an appointment" : "Register you and your pet"}</h1>
        <p>{isBooking ? "Choose a visit type and available time, then send your request securely to the team." : "Share a few details and we will add your household to The Sutton Vet."}</p>
        <p className="lupa-journey-note">Already registered? Please call <a href={`tel:${clinicPhone}`}>{clinicPhone}</a> so we can find the right appointment without duplicating your details.</p>
      </div>
      <form className="lupa-form" onSubmit={submit}>
        {isBooking && <>
          <label>Appointment type<select value={visitTypeId} onChange={(event) => { setVisitTypeId(event.target.value); setSlots([]); setSelectedSlot(null); }} required disabled={loading || !types.length}><option value="">{loading ? "Loading appointment types..." : "Choose an appointment type"}</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name || type.title || "Appointment"}</option>)}</select></label>
          <button className="button button-muted" type="button" onClick={loadSlots} disabled={!visitTypeId || loading}>Check available times</button>
          {slots.length > 0 && <fieldset className="lupa-slots"><legend>Available times</legend>{slots.slice(0, 18).map((slot, index) => { const value = slot.start || slot.startsAt || String(index); return <label key={value} className="lupa-slot"><input type="radio" name="slot" checked={selectedSlot === slot} onChange={() => setSelectedSlot(slot)} /><span>{new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span></label>; })}</fieldset>}
        </>}
        <div className="lupa-form-grid"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" required /></label><label>Pet's name<input name="petName" required /></label><label>Species<select name="species" defaultValue="Dog"><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Other</option></select></label><label>Breed<input name="breed" placeholder="If known" /></label><label>Sex<select name="sex" defaultValue="Unknown"><option>Unknown</option><option>Female</option><option>Male</option></select></label></div>
        {isBooking && <label>What would you like help with?<textarea name="notes" rows={4} /></label>}
        {!isBooking && <label className="lupa-consent"><input type="checkbox" name="gdprOptIn" value="true" /> I am happy for The Sutton Vet to use these details to contact me about my registration.</label>}
        <button className="button button-primary" type="submit" disabled={loading}>{isBooking ? "Send booking request" : "Send registration"}</button>
        {message && <p className="lupa-form-message" role="status">{message}</p>}
      </form>
    </section>
  );
}
