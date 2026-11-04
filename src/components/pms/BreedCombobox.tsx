"use client";

import { useEffect, useId, useRef, useState } from "react";
import { breedOptions } from "@/lib/registrationPet";
import styles from "./RegistrationFields.module.css";

export function BreedCombobox({ species, value, onChange, name = "breed", required = true }: { species: string; value: string; onChange: (value: string) => void; name?: string; required?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const optionsRef = useRef<HTMLUListElement>(null);
  const matches = (breedOptions[species] || []).filter(option => option.toLowerCase().includes(value.toLowerCase())).slice(0, 8);
  const expanded = open && Boolean(species) && matches.length > 0;
  useEffect(() => {
    if (expanded && active >= 0) optionsRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, expanded]);
  function choose(option: string) { onChange(option); setOpen(false); setActive(-1); }
  return <div className={styles.breed} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <label htmlFor={id}>Breed{!required && " (optional)"}</label>
    <div className={styles.control}>
    <input id={id} name={name} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={`${id}-options`}
      aria-activedescendant={expanded && active >= 0 && active < matches.length ? `${id}-${active}` : undefined}
      aria-describedby={`${id}-hint`} autoComplete="off" value={value} required={required} maxLength={100} disabled={!species}
      placeholder={species ? "Start typing a breed" : "Choose species first"}
      onFocus={() => setOpen(true)} onChange={event => { onChange(event.target.value); setActive(-1); setOpen(true); }}
      onKeyDown={event => {
        if (event.key === "Escape") { setOpen(false); setActive(-1); }
        if ((event.key === "ArrowDown" || event.key === "ArrowUp") && matches.length) {
          event.preventDefault(); setOpen(true);
          setActive(current => event.key === "ArrowDown" ? (current + 1) % matches.length : (current <= 0 ? matches.length - 1 : current - 1));
        }
        if (event.key === "Enter" && open) { event.preventDefault(); if (active >= 0 && matches[active]) choose(matches[active]); else setOpen(false); }
      }} />
    <ul ref={optionsRef} id={`${id}-options`} role="listbox" aria-label="Breed suggestions" className={styles.options} hidden={!expanded}>
      {matches.map((option, index) => <li id={`${id}-${index}`} key={option} role="option" aria-selected={index === active}
        onMouseDown={event => event.preventDefault()} onClick={() => choose(option)}>{option}</li>)}
    </ul>
    </div>
    <small id={`${id}-hint`}>Choose a suggestion or type the full breed. If unsure, enter Unknown.</small>
  </div>;
}
