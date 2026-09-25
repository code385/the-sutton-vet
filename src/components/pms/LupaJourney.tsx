"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type RecordItem = { id?: string; name?: string; title?: string; duration?: number; start?: string; end?: string; startsAt?: string; endsAt?: string; employeeId?: string };
type Props = { mode: "book" | "register"; clinicPhone: string; clientPortalUrl?: string };

const titleOptions = ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"];
const breedOptions: Record<string, string[]> = {
  Dog: ["Unknown", "Crossbreed / mixed breed", "Labrador Retriever", "Golden Retriever", "German Shepherd", "French Bulldog", "Bulldog", "Cocker Spaniel", "Cockapoo", "Cavapoo", "Poodle", "Border Collie", "Dachshund", "Chihuahua", "Shih Tzu", "Staffordshire Bull Terrier", "Jack Russell Terrier", "Greyhound", "Whippet"],
  Cat: ["Unknown", "Crossbreed / mixed breed", "Domestic Shorthair", "Domestic Longhair", "British Shorthair", "Ragdoll", "Maine Coon", "Bengal", "Siamese", "Persian", "Sphynx"],
  Rabbit: ["Unknown", "Crossbreed / mixed breed", "Mini Lop", "Holland Lop", "Lionhead", "Netherland Dwarf", "Rex", "Dutch", "English Lop"],
  Other: ["Unknown", "Other"],
};

const normaliseItems = (value: unknown): RecordItem[] => {
  if (Array.isArray(value)) return value as RecordItem[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return normaliseItems(record.data || record.items || record.slots || []);
  }
  return [];
};

export function LupaJourney({ mode, clinicPhone, clientPortalUrl = "" }: Props) {
  const [types, setTypes] = useState<RecordItem[]>([]);
  const [slots, setSlots] = useState<RecordItem[]>([]);
  const [visitTypeId, setVisitTypeId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<RecordItem | null>(null);
  const [message, setMessage] = useState("");
  const [submissionLocked, setSubmissionLocked] = useState(false);
  const [loading, setLoading] = useState(mode === "book");
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("Unknown");
  const isBooking = mode === "book";
  const monthOptions = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const value = new Date();
    value.setDate(1);
    value.setMonth(value.getMonth() + index);
    return {
      value: value.toISOString().slice(0, 7),
      label: value.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    };
  }), []);

  useEffect(() => {
    if (!isBooking) return;
    fetch("/api/lupa/appointment-types")
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.available) throw new Error(payload.error || "Appointment types are unavailable.");
        const availableTypes = normaliseItems(payload.data);
        setTypes(availableTypes);
        if (!availableTypes.length) setMessage("Online appointment types have not yet been enabled for the Sutton clinic. Please call us to book while Lupa completes this setup.");
      })
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [isBooking]);

  async function loadSlots() {
    if (!visitTypeId) return;
    setLoading(true);
    setMessage("");
    const selectedType = types.find((type) => type.id === visitTypeId);
    const duration = Math.max(5, Math.min(480, Number(selectedType?.duration) || 30));
    try {
      const response = await fetch(`/api/lupa/available-slots?month=${selectedMonth}&duration=${duration}&visitTypeId=${encodeURIComponent(visitTypeId)}`);
      const payload = await response.json();
      if (!payload.available) throw new Error(payload.error || "Live slots are unavailable.");
      const availableSlots = normaliseItems(payload.data);
      setSlots(availableSlots);
      if (!availableSlots.length) {
        setMessage("No online times were returned for that month. Try another month or call the clinic.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Live slots are unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || submissionLocked) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());
    if (isBooking) {
      if (!selectedSlot) { setMessage("Please choose an available appointment time first."); return; }
      body.visitTypeId = visitTypeId;
      body.start = selectedSlot.start || selectedSlot.startsAt || "";
      body.end = selectedSlot.end || selectedSlot.endsAt || "";
      body.employeeId = selectedSlot.employeeId || "";
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(isBooking ? "/api/lupa/booking" : "/api/lupa/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      setMessage(payload.message || payload.error || "Please try again.");
      if (payload.ok) {
        form.reset();
        setSpecies("Dog");
        setBreed("Unknown");
        setSubmissionLocked(true);
      } else if (payload.retryable === false) {
        setSubmissionLocked(true);
      }
    } catch {
      setSubmissionLocked(true);
      setMessage("We could not confirm your request. Please call the clinic before submitting again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="lupa-journey" aria-labelledby="lupa-journey-title">
      <div className="lupa-journey-intro">
        <p className="eyebrow">Lupa online care</p>
        <h1 id="lupa-journey-title">{isBooking ? "Book an appointment" : "Register you and your pet"}</h1>
        <p>{isBooking ? "New clients can choose a visit type and time, then register and send a booking request in one secure journey." : "Share a few details and we will add your household to The Sutton Vet."}</p>
        {!isBooking ? <p className="lupa-journey-note">Already registered? Please call <a href={`tel:${clinicPhone}`}>{clinicPhone}</a> so we can update your existing record without duplication.</p> : null}
      </div>
      <form className="lupa-form" onSubmit={submit}>
        {isBooking && <>
          <div className="lupa-existing-client">
            <div>
              <p className="eyebrow">Already registered?</p>
              <h2>Use your existing client account.</h2>
              <p>{clientPortalUrl ? "Sign in through Lupa to book without entering your details again." : "Lupa has not yet supplied a secure client-login link. Please call us and we will book against your existing record."}</p>
            </div>
            {clientPortalUrl ? <a className="button button-muted" href={clientPortalUrl}>Client login</a> : <a className="button button-muted" href={`tel:${clinicPhone}`}>Call {clinicPhone}</a>}
          </div>
          <p className="lupa-new-client-label">New client booking</p>
          <label>Appointment type<select value={visitTypeId} onChange={(event) => { setVisitTypeId(event.target.value); setSlots([]); setSelectedSlot(null); }} required disabled={loading || !types.length}><option value="">{loading ? "Loading appointment types..." : "Choose an appointment type"}</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name || type.title || "Appointment"}</option>)}</select></label>
          <label>Month<select value={selectedMonth} onChange={(event) => { setSelectedMonth(event.target.value); setSlots([]); setSelectedSlot(null); setMessage(""); }}>{monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}</select></label>
          <button className="button button-muted" type="button" onClick={loadSlots} disabled={!visitTypeId || loading}>Check available times</button>
          {slots.length > 0 && <fieldset className="lupa-slots"><legend>Available times</legend>{slots.slice(0, 24).map((slot, index) => { const value = slot.start || slot.startsAt || String(index); return <label key={`${value}-${slot.employeeId || index}`} className="lupa-slot"><input type="radio" name="slot" checked={selectedSlot === slot} onChange={() => setSelectedSlot(slot)} /><span>{new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span></label>; })}</fieldset>}
        </>}
        <div className="lupa-form-grid"><label>Title<select name="title" defaultValue="" required><option value="" disabled>Choose a title</option>{titleOptions.map((title) => <option key={title} value={title}>{title}</option>)}</select></label><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Phone (include country code)<input type="tel" name="phone" autoComplete="tel" placeholder="+44..." required /></label><label>Pet's name<input name="petName" required /></label><label>Species<select name="species" value={species} onChange={(event) => { setSpecies(event.target.value); setBreed("Unknown"); }}><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Other</option></select></label><label>Breed<select name="breed" value={breed} onChange={(event) => setBreed(event.target.value)} required>{breedOptions[species].map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label>Sex<select name="sex" defaultValue="Unknown"><option>Unknown</option><option>Female</option><option>Male</option></select></label></div>
        {isBooking && <label>What would you like help with?<textarea name="notes" rows={4} /></label>}
        {!isBooking && <label className="lupa-consent"><input type="checkbox" name="contactConsent" value="true" /> I am happy for The Sutton Vet to contact me by email or SMS about my registration.</label>}
        <button className="button button-primary" type="submit" disabled={loading || submissionLocked || (isBooking && !selectedSlot)}>{loading ? "Please wait..." : isBooking ? "Send booking request" : "Send registration"}</button>
        {message && <p className="lupa-form-message" role="status">{message}</p>}
      </form>
    </section>
  );
}
