"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./FooterLogos.module.css";

// Keep these paths stable when replacing the original artwork.
const logos = [
  {
    name: "RCVS",
    src: "/images/footer/rcvs.png",
    alt: "RCVS - Setting Veterinary Standards",
    width: 642,
    height: 336,
    compact: false,
    padded: true,
  },
  {
    name: "VECCS",
    src: "/images/footer/veccs.png",
    alt: "VECCS - Veterinary Emergency and Critical Care Society",
    width: 486,
    height: 161,
    compact: false,
    padded: false,
  },
  {
    name: "AO VET",
    src: "/images/footer/ao-vet.png",
    alt: "AO VET",
    width: 298,
    height: 252,
    compact: true,
    padded: false,
  },
];

export function FooterLogos() {
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const availableLogos = logos.filter((logo) => !unavailable.includes(logo.name));

  // Missing artwork must not leave broken images or an empty panel in the footer.
  if (availableLogos.length === 0) return null;

  return (
    <div className={`shell ${styles.wrapper}`}>
      <ul className={styles.strip} aria-label="Professional organisation logos">
        {availableLogos.map((logo) => (
          <li className={styles.item} key={logo.name}>
            <Image
              className={`${styles.image} ${logo.compact ? styles.compact : ""} ${logo.padded ? styles.padded : ""}`}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              sizes={logo.compact ? "96px" : "(max-width: 640px) 240px, 280px"}
              onError={() => setUnavailable((previous) => previous.includes(logo.name) ? previous : [...previous, logo.name])}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
