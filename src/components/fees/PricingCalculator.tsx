"use client";

import { useMemo, useState } from "react";

import { Reveal } from "@/components/shared/Reveal";
import type { PricingCalculatorEntry } from "@/sanity/lib/pricing";

type PricingCalculatorProps = {
  entries: PricingCalculatorEntry[];
};

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingCalculator({ entries }: PricingCalculatorProps) {
  const speciesOptions = useMemo(() => Array.from(new Set(entries.map((entry) => entry.species).filter(Boolean))), [entries]);
  const [species, setSpecies] = useState<"Dog" | "Cat">((speciesOptions[0] as "Dog" | "Cat") || "Dog");

  const weightOptions = useMemo(
    () =>
      entries
        .filter((entry) => entry.species === species && entry.weightBand)
        .map((entry) => entry.weightBand as string),
    [entries, species],
  );

  const [weightBand, setWeightBand] = useState(weightOptions[0] || "");

  const activeEntry = useMemo(() => {
    const filtered = entries.filter((entry) => entry.species === species);
    if (species === "Dog") {
      return filtered.find((entry) => entry.weightBand === weightBand) || filtered[0];
    }
    return filtered[0];
  }, [entries, species, weightBand]);

  const annualPlan = (activeEntry?.monthlyPlanCost || 0) * 12;
  const savings = Math.max((activeEntry?.annualPayAsYouGo || 0) - annualPlan, 0);

  return (
    <Reveal variant="up">
      <section className="pricing-calculator-card">
        <div className="pricing-calculator-controls">
          <div className="pricing-toggle">
            {speciesOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`pricing-toggle-button${species === option ? " is-active" : ""}`}
                onClick={() => {
                  const nextSpecies = option as "Dog" | "Cat";
                  setSpecies(nextSpecies);
                  const nextWeight = entries.find((entry) => entry.species === nextSpecies && entry.weightBand)?.weightBand || "";
                  setWeightBand(nextWeight);
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {species === "Dog" && weightOptions.length ? (
            <label className="pricing-select-wrap">
              <span>Weight band</span>
              <select value={weightBand} onChange={(event) => setWeightBand(event.target.value)}>
                {weightOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <div className="pricing-calculator-results">
          <article className="pricing-result-card">
            <span className="eyebrow">Pay as you go</span>
            <strong>{toCurrency(activeEntry?.annualPayAsYouGo || 0)}</strong>
            <p>Estimated annual preventative spend</p>
          </article>

          <article className="pricing-result-card pricing-result-card-highlight">
            <span className="eyebrow">Health Plan</span>
            <strong>{toCurrency(annualPlan)}</strong>
            <p>{toCurrency(activeEntry?.monthlyPlanCost || 0)} per month</p>
          </article>

          <article className="pricing-result-card">
            <span className="eyebrow">Estimated saving</span>
            <strong>{toCurrency(savings)}</strong>
            <p>{activeEntry?.note || "Routine preventative care comparison"}</p>
          </article>
        </div>
      </section>
    </Reveal>
  );
}
