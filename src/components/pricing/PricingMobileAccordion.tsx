"use client";

import Link from "next/link";
import { useState } from "react";

import { Reveal } from "@/components/shared/Reveal";

type PriceRow = {
  service: string;
  standard: string;
  online: string;
};

type PriceSection = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  rows: PriceRow[];
};

type PricingMobileAccordionProps = {
  sections: PriceSection[];
  bookHref: string;
};

export function PricingMobileAccordion({ sections, bookHref }: PricingMobileAccordionProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  return (
    <section className="shell pricing-v3-sections">
      {sections.map((section, index) => {
        const spotlightRows = section.rows.slice(0, 3);
        const isOpen = openSectionId === section.id;

        return (
          <Reveal key={section.id} variant="up" delayMs={Math.min(index * 28, 180)}>
            <article id={section.id} className={`pricing-v3-panel ${isOpen ? "is-open" : ""}`}>
              <button
                className="pricing-v3-panel-toggle"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${section.id}-pricing-content`}
                onClick={() => setOpenSectionId(isOpen ? null : section.id)}
              >
                <span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {section.title}
                </span>
                <i aria-hidden="true">{isOpen ? "-" : "+"}</i>
              </button>

              <div id={`${section.id}-pricing-content`} className="pricing-v3-panel-body">
                <div className="pricing-v3-panel-intro">
                  <span className="pricing-v3-number">{String(index + 1).padStart(2, "0")}</span>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                  <Link href={bookHref} className="pricing-v3-mini-link">
                    Book or ask about this
                  </Link>
                </div>

                <div className="pricing-v3-panel-prices">
                  <div className="pricing-v3-spotlights" aria-label={`${section.title} highlighted prices`}>
                    {spotlightRows.map((row) => (
                      <div key={`${section.id}-spot-${row.service}`} className="pricing-v3-spotlight">
                        <span>{row.service}</span>
                        <strong>{row.online !== "-" ? row.online : row.standard}</strong>
                        <small>{row.online !== "-" ? "online/min" : "standard"}</small>
                      </div>
                    ))}
                  </div>

                  <div className="pricing-v3-ledger" role="table" aria-label={`${section.title} prices`}>
                    <div className="pricing-v3-ledger-row pricing-v3-ledger-head" role="row">
                      <span role="columnheader">Service</span>
                      <span role="columnheader">Standard</span>
                      <span role="columnheader">Online/min.</span>
                    </div>
                    {section.rows.map((row) => (
                      <div key={`${section.id}-${row.service}`} className="pricing-v3-ledger-row" role="row">
                        <span role="cell">{row.service}</span>
                        <strong role="cell">{row.standard}</strong>
                        <em className={row.online === "-" ? "is-muted" : ""} role="cell">
                          {row.online}
                        </em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </section>
  );
}
