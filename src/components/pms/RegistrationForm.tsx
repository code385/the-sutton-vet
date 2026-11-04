"use client";

import { useRef, useState, type FormEvent } from "react";
import { BreedCombobox } from "./BreedCombobox";
import { MAX_REGISTRATION_PETS, londonToday } from "@/lib/registrationPet";
import styles from "./RegistrationForm.module.css";

type PetForm = { id: number; species: string; breed: string; ageMode: string; neuterStatus: string; dateOfBirth: string };
const newPet = (id: number): PetForm => ({ id, species: "", breed: "", ageMode: "", neuterStatus: "", dateOfBirth: "" });
const petFields = ["petName", "species", "breed", "ageMode", "dateOfBirth", "ageYears", "ageMonths", "sex", "neuterStatus", "neuteredDate", "temperament", "weight", "previousPractice", "reason", "clinicalNotes", "microchip", "lastVaccinationDate", "lastDewormingDate", "lastFleaTickDate"];
const ownerFields = ["title", "firstName", "lastName", "email", "phone", "ownerDateOfBirth", "addressLine1", "addressLine2", "city", "postcode", "country", "referralSource", "contactConsent"];

export function RegistrationForm({ clinicPhone }: { clinicPhone: string }) {
  const [pets, setPets] = useState<PetForm[]>([newPet(1)]);
  const nextId = useRef(2);
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const pending = useRef(false);
  const status = useRef<HTMLDivElement>(null);
  const today = londonToday();
  const update = (id: number, value: Partial<PetForm>) => setPets(current => current.map(pet => pet.id === id ? { ...pet, ...value } : pet));
  function focusStatus() { requestAnimationFrame(() => status.current?.focus()); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || locked) return;
    const data = new FormData(event.currentTarget);
    const input = {
      ...Object.fromEntries(ownerFields.map(key => [key, data.get(key) || ""])),
      pets: pets.map(pet => Object.fromEntries(petFields.map(key => [key, data.get(`pet-${pet.id}-${key}`) || ""]))),
    };
    pending.current = true; setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/lupa/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const payload = await response.json();
      if (response.ok && payload.ok === true) { setSuccess(true); setLocked(true); }
      else if (payload.retryable !== true) setLocked(true);
      setMessage(payload.message || payload.error || "We could not confirm your registration. Please call the practice before trying again.");
    } catch {
      setLocked(true);
      setMessage("We could not confirm whether your details reached the practice. Please call before submitting again so we can avoid duplicate records.");
    } finally { pending.current = false; setBusy(false); focusStatus(); }
  }
  return <section className={styles.registration} aria-labelledby="registration-title">
    <header className={styles.intro}>
      <div><p className="eyebrow">Welcome to The Sutton Vet</p><h1 id="registration-title">A caring start.<br />For all your pets.</h1></div>
      <div><p>Register your household and pets together. Fields marked <span aria-hidden="true">*</span> are required; everything else is optional.</p>
        <p>Already registered? Call <a href={`tel:${clinicPhone}`}>{clinicPhone}</a> to update your record or add another pet without duplicating your account.</p></div>
    </header>
    <form className={`lupa-form ${styles.form}`} onSubmit={submit} aria-busy={busy}>
      {!success && <>
        <fieldset className={styles.section} disabled={busy || locked}>
          <legend><span className={styles.number}>01</span> Your details</legend>
          <div className={styles.grid}>
            <label>First name *<input name="firstName" autoComplete="given-name" required maxLength={80} /></label>
            <label>Last name *<input name="lastName" autoComplete="family-name" required maxLength={80} /></label>
            <label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
            <label>Phone number *<input name="phone" type="tel" autoComplete="tel" placeholder="+44..." required maxLength={40} /><small>Include the country code. For the UK use +44, without the first 0.</small></label>
            <label>Your birth date (optional)<input name="ownerDateOfBirth" type="date" autoComplete="bday" min="1900-01-01" max={today} /></label>
            <label>Title (optional)<select name="title" defaultValue=""><option value="">Prefer not to say</option>{["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"].map(title => <option key={title}>{title}</option>)}</select></label>
            <label className={styles.wide}>Address line 1 *<input name="addressLine1" autoComplete="address-line1" required maxLength={150} placeholder="House number / name and street" /></label>
            <label className={styles.wide}>Address line 2 (optional)<input name="addressLine2" autoComplete="address-line2" maxLength={150} /></label>
            <label>Town / city *<input name="city" autoComplete="address-level2" required maxLength={80} /></label>
            <label>Postcode *<input name="postcode" autoComplete="postal-code" required maxLength={32} /></label>
            <label>Country *<input name="country" autoComplete="country-name" required defaultValue="United Kingdom" maxLength={80} /></label>
            <label>How did you hear about us? (optional)<input name="referralSource" placeholder="For example, a friend or Google" maxLength={200} /></label>
          </div>
        </fieldset>
        <div className={styles.petIntro}><div><p className="eyebrow">Your household</p><h2>Meet your pets</h2></div><span>{pets.length} of {MAX_REGISTRATION_PETS} pets</span></div>
        {pets.map((pet, index) => {
          const name = (key: string) => `pet-${pet.id}-${key}`;
          const minDate = pet.ageMode === "date" && pet.dateOfBirth ? pet.dateOfBirth : "1900-01-01";
          return <fieldset key={pet.id} className={styles.section} disabled={busy || locked} data-pet-card={pet.id}>
            <legend><span className={styles.number}>{String(index + 2).padStart(2, "0")}</span> Pet {index + 1}</legend>
            {pets.length > 1 && <button type="button" className={styles.remove} aria-label={`Remove pet ${index + 1}`} onClick={() => { setPets(current => current.filter(item => item.id !== pet.id)); setAnnouncement(`Pet ${index + 1} removed.`); }}>Remove pet</button>}
            <div className={styles.grid}>
              <label>Pet&apos;s name *<input name={name("petName")} required maxLength={80} /></label>
              <label>Species *<select name={name("species")} value={pet.species} onChange={event => update(pet.id, { species: event.target.value, breed: "" })} required><option value="" disabled>Choose species</option><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Other</option></select></label>
              <BreedCombobox key={pet.species} name={name("breed")} species={pet.species} value={pet.breed} onChange={breed => update(pet.id, { breed })} required={false} />
              <label>Age or birth date *<select name={name("ageMode")} value={pet.ageMode} onChange={event => update(pet.id, { ageMode: event.target.value, dateOfBirth: "" })} required><option value="" disabled>Choose how to enter age</option><option value="date">I know the birth date</option><option value="age">Enter approximate age</option></select></label>
              {pet.ageMode === "date" && <label>Pet&apos;s birth date *<input name={name("dateOfBirth")} type="date" min="1900-01-01" max={today} value={pet.dateOfBirth} onChange={event => update(pet.id, { dateOfBirth: event.target.value })} required /></label>}
              {pet.ageMode === "age" && <div className={`${styles.age} ${styles.wide}`}><p>Approximate age * <small>Enter 0 years for a pet under one year old. We will estimate a birth date for the practice to check.</small></p><div className={styles.grid}><label>Years *<input name={name("ageYears")} type="number" inputMode="numeric" min={0} max={100} step={1} required /></label><label>Months (0-11)<input name={name("ageMonths")} type="number" inputMode="numeric" min={0} max={11} step={1} defaultValue="0" /></label></div></div>}
              <label>Sex (optional)<select name={name("sex")} defaultValue=""><option value="">Unknown / not provided</option><option>Male</option><option>Female</option></select></label>
              <label>Neuter status (optional)<select name={name("neuterStatus")} value={pet.neuterStatus} onChange={event => update(pet.id, { neuterStatus: event.target.value })}><option value="">Unknown / not provided</option><option value="yes">Neutered / spayed</option><option value="no">Not neutered</option></select></label>
              {pet.neuterStatus === "yes" && <label>Neutering date (if known)<input name={name("neuteredDate")} type="date" min={minDate} max={today} /></label>}
              <label>Weight in kg (optional)<input name={name("weight")} type="number" inputMode="decimal" min="0.001" max="2000" step="0.001" placeholder="For example, 12.5" /></label>
              <label className={styles.wide}>Temperament / handling needs *<textarea name={name("temperament")} rows={2} required maxLength={500} placeholder="For example, friendly, nervous around dogs, or needs gentle handling" /><small>This helps us prepare a calmer, safer visit. If unsure, please tell us.</small></label>
              <label className={styles.wide}>Reason for appointment *<textarea name={name("reason")} rows={3} required maxLength={1000} placeholder="What would you like us to help your pet with?" /><small>This does not reserve a time. After registration, use Book Online to request an appointment.</small></label>
              <label className={styles.wide}>Previous daytime veterinary practice (if you have one)<input name={name("previousPractice")} maxLength={200} placeholder="Practice name and location" /></label>
            </div>
            <details className={styles.history}>
              <summary>Health history &amp; previous clinical notes <span>Optional</span></summary>
              <div className={styles.grid}>
                <label>Microchip number<input name={name("microchip")} maxLength={50} /></label>
                <label>Last vaccination date<input name={name("lastVaccinationDate")} type="date" min={minDate} max={today} /></label>
                <label>Last deworming date<input name={name("lastDewormingDate")} type="date" min={minDate} max={today} /></label>
                <label>Last flea / tick prevention date<input name={name("lastFleaTickDate")} type="date" min={minDate} max={today} /></label>
                <label className={styles.wide}>Previous vet&apos;s clinical notes (text, optional)<textarea name={name("clinicalNotes")} rows={4} maxLength={4000} placeholder="You can paste relevant notes here for the practice to review." /><small>Saved in your pet&apos;s Lupa notes as owner-supplied information, not a verified treatment record.</small></label>
                <p className={`${styles.notice} ${styles.wide}`}>Document upload is not yet available. For PDFs or other files, please contact the practice to arrange transfer from your previous vet. You can still register now.</p>
              </div>
            </details>
          </fieldset>;
        })}
        <div className={styles.addRow}><button className="button button-muted" type="button" disabled={busy || locked || pets.length >= MAX_REGISTRATION_PETS} onClick={() => { const id = nextId.current++; setPets(current => [...current, newPet(id)]); setAnnouncement(`Pet ${pets.length + 1} added. Please complete their details below.`); requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`[name="pet-${id}-petName"]`)?.focus()); }}>+ Add another pet</button><p>Register up to {MAX_REGISTRATION_PETS} pets together. For a larger household, please call us.</p></div>
        <p className={styles.srOnly} role="status">{announcement}</p>
        <div className={styles.submitArea}>
          <label className="lupa-consent"><input name="contactConsent" type="checkbox" value="true" disabled={busy || locked} /> I am happy for The Sutton Vet to contact me by email or SMS about my registration.</label>
          <p>We use these details to set up your practice record. <a href="/privacy-policy">Read our privacy policy.</a></p>
          <button className="button button-primary" type="submit" disabled={busy || locked}>{busy ? "Registering your household..." : `Register ${pets.length === 1 ? "you and your pet" : `you and ${pets.length} pets`}`}</button>
        </div>
      </>}
      {message && <div ref={status} tabIndex={-1} className={styles.result} role={success ? "status" : "alert"}>
        <h2>{success ? "Welcome to the practice" : locked ? "Please contact the practice" : "Please check your details"}</h2><p>{message}</p>
        {success ? <a className="button button-primary" href="/book">Book Online</a> : locked ? <a className="button button-muted" href={`tel:${clinicPhone}`}>Call {clinicPhone}</a> : null}
      </div>}
    </form>
  </section>;
}
