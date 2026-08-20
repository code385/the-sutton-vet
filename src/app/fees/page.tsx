import Link from "next/link";

import { PricingMobileAccordion } from "@/components/pricing/PricingMobileAccordion";
import { SectionCta } from "@/components/shared/SectionCta";
import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const priceSections = [
  {
    id: "consultations",
    title: "Consultations",
    eyebrow: "First Step",
    description:
      "Consultation and follow-up appointments are the clearest route into day-to-day care, second opinions, and sensible next-step planning.",
    rows: [
      { service: "Routine consult", standard: "\u00a347", online: "\u00a342" },
      { service: "Follow-up consult", standard: "\u00a338", online: "-" },
      { service: "Prescription health check", standard: "\u00a342", online: "\u00a338" },
    ],
  },
  {
    id: "dentistry",
    title: "Dental care",
    eyebrow: "Oral Health",
    description:
      "Dental prices include anaesthetic, scale and polish, full oral assessment, and post-operative pain medication. Extractions may be charged separately depending on the tooth.",
    rows: [
      { service: "Cat dental, including dental radiography", standard: "\u00a3360", online: "\u00a3314" },
      { service: "Dog dental under 10kg", standard: "\u00a3343", online: "\u00a3276" },
      { service: "Dog dental 10-20kg", standard: "\u00a3356", online: "\u00a3299" },
      { service: "Dog dental 20-40kg", standard: "\u00a3380", online: "\u00a3320" },
      { service: "Dog dental over 40kg", standard: "\u00a3422", online: "\u00a3358" },
      { service: "Whole mouth dental X-ray series", standard: "\u00a380", online: "\u00a380" },
    ],
  },
  {
    id: "diagnostics",
    title: "In-house diagnostics",
    eyebrow: "Imaging & Tests",
    description:
      "Imaging fees do not include sedation or anaesthesia if required. That cost varies by patient size and procedure length.",
    rows: [
      { service: "X-ray first image", standard: "\u00a3150", online: "-" },
      { service: "X-ray additional image", standard: "\u00a3100", online: "-" },
      { service: "X-ray series, up to 10 images including GA", standard: "\u00a3605", online: "-" },
      { service: "Diagnostic abdominal ultrasound", standard: "\u00a3180", online: "-" },
      { service: "Pregnancy diagnosis ultrasound, includes consult", standard: "\u00a380", online: "-" },
    ],
  },
  {
    id: "health-plan",
    title: "Health Plan",
    eyebrow: "Monthly Care",
    description:
      "Monthly preventative-care pricing helps owners spread routine costs for vaccinations, flea and worm treatment, and ongoing support.",
    rows: [
      { service: "Cat", standard: "\u00a314.58/mo", online: "-" },
      { service: "Small dog under 10kg", standard: "\u00a312.30/mo", online: "-" },
      { service: "Medium dog 10-25kg", standard: "\u00a314.64/mo", online: "-" },
      { service: "Large dog 25-40kg", standard: "\u00a317.40/mo", online: "-" },
      { service: "Giant dog over 40kg", standard: "\u00a320.28/mo", online: "-" },
    ],
  },
  {
    id: "vaccinations",
    title: "Vaccinations",
    eyebrow: "Preventative Care",
    description:
      "Vaccination appointments include a physical examination plus practical health, weight, and microchip checks where appropriate.",
    rows: [
      { service: "Puppy course, includes vaccine course, flea and worm treatment", standard: "\u00a372", online: "\u00a363" },
      { service: "Dog booster vaccine", standard: "\u00a362", online: "\u00a353" },
      { service: "Kennel cough", standard: "\u00a354", online: "\u00a340" },
      { service: "Dog booster and kennel cough", standard: "\u00a382", online: "\u00a374" },
      { service: "Rabies vaccine", standard: "\u00a377", online: "\u00a365" },
      { service: "Kitten course, includes vaccine course, flea and worm treatment", standard: "\u00a383", online: "\u00a372" },
      { service: "Cat booster", standard: "\u00a365", online: "\u00a355" },
    ],
  },
  {
    id: "cat-neutering",
    title: "Cat neutering",
    eyebrow: "Routine Procedures",
    description:
      "Prices include routine post-operative pain medication, post-operative checks, and a buster collar where needed.",
    rows: [
      { service: "Cat castrate", standard: "\u00a388", online: "\u00a378" },
      { service: "Cat spay", standard: "\u00a3132", online: "\u00a3110" },
    ],
  },
  {
    id: "dog-neutering",
    title: "Dog neutering and keyhole spays",
    eyebrow: "Routine Procedures",
    description:
      "Dog neutering prices include post-operative pain medication, checks, and a buster collar. Laparoscopic spay pricing is shown as an online booking price where available.",
    rows: [
      { service: "Dog castrate under 10kg", standard: "\u00a3237", online: "\u00a3210" },
      { service: "Dog castrate 10-20kg", standard: "\u00a3259", online: "\u00a3231" },
      { service: "Dog castrate 20-40kg", standard: "\u00a3275", online: "\u00a3246" },
      { service: "Dog castrate over 40kg", standard: "\u00a3286", online: "\u00a3257" },
      { service: "Bitch spay under 10kg", standard: "\u00a3300", online: "\u00a3265" },
      { service: "Bitch spay 10-20kg", standard: "\u00a3328", online: "\u00a3290" },
      { service: "Bitch spay 20-40kg", standard: "\u00a3365", online: "\u00a3320" },
      { service: "Bitch spay over 40kg", standard: "\u00a3434", online: "\u00a3380" },
      { service: "Laparoscopic spay", standard: "-", online: "\u00a3850" },
    ],
  },
  {
    id: "lump-removals",
    title: "Lump removals",
    eyebrow: "Soft Tissue",
    description:
      "A practical guide for common mass removals. Final pricing depends on patient size, incision length, histology, and clinical findings.",
    rows: [
      { service: "Mass removal under 1cm incision", standard: "\u00a3427", online: "\u00a3385" },
      { service: "Mass removal 1-3cm incision", standard: "\u00a3468", online: "\u00a3429" },
      { service: "Mass removal 3-10cm incision", standard: "\u00a3750", online: "\u00a3680" },
      { service: "Mass removal over 10cm incision", standard: "\u00a3921", online: "\u00a3815" },
      { service: "Histology submission to external laboratory", standard: "\u00a3144.76", online: "-" },
      { service: "Major mass removal with skin reconstruction", standard: "\u00a31500", online: "-" },
    ],
  },
  {
    id: "surgery",
    title: "Surgery and procedures",
    eyebrow: "Procedure Guide",
    description:
      "Advanced surgery at The Sutton Vet is for soft tissue, orthopaedic surgery, and endoscopy. Prices below are a rough guide and may change after assessment.",
    rows: [
      { service: "Pyometra", standard: "\u00a3750", online: "\u00a3670" },
      { service: "Caesarean section dog", standard: "\u00a3980", online: "\u00a3830" },
      { service: "Caesarean section cat", standard: "\u00a3620", online: "\u00a3620" },
      { service: "Cystotomy", standard: "\u00a31050", online: "\u00a31050" },
      { service: "Splenectomy", standard: "\u00a31350", online: "\u00a31350" },
      { service: "Simple fracture repair", standard: "-", online: "\u00a31500" },
      { service: "Complex fracture repair", standard: "-", online: "\u00a32300" },
      { service: "Medial patella luxation", standard: "-", online: "\u00a31500" },
      { service: "BOAS surgery", standard: "-", online: "\u00a31500" },
      { service: "TPLO, size dependent", standard: "-", online: "\u00a32350-\u00a32850" },
      { service: "Total ear canal ablation", standard: "-", online: "\u00a31900" },
      { service: "Endoscopy", standard: "Assessment", online: "Estimate" },
    ],
  },
  {
    id: "misc",
    title: "Other useful prices",
    eyebrow: "Everyday Extras",
    description:
      "Common add-on or stand-alone services owners often ask about before booking.",
    rows: [
      { service: "Weight checks", standard: "Free", online: "-" },
      { service: "Nail clip", standard: "\u00a321", online: "\u00a318" },
      { service: "Anal gland expression", standard: "\u00a324", online: "\u00a318" },
      { service: "Puppy or kitten checks with the nurse", standard: "Free", online: "-" },
      { service: "Microchip", standard: "\u00a324", online: "\u00a319" },
      { service: "Animal Health Certificate", standard: "\u00a3160", online: "-" },
      { service: "End of life care", standard: "Contact", online: "Guidance" },
    ],
  },
];

const heroStats = [
  { label: "routine consult", value: "\u00a347" },
  { label: "cat health plan", value: "\u00a314.58/mo" },
  { label: "microchip", value: "\u00a324" },
];

export default async function FeesPage() {
  const siteSettings = resolveSiteSettings(await getSiteSettingsDocument());
  return (
    <>
      <section className="pricing-v3-hero full-bleed-section">
        <div className="shell pricing-v3-hero-shell">
          <Reveal variant="left">
            <div className="pricing-v3-hero-copy">
              <p className="eyebrow">Pricing</p>
              <h1>Prices you can scan without feeling lost.</h1>
              <p>
                A warmer pricing experience for routine care, diagnostics, procedures, health plans, and advanced pathways. The figures are grouped around real owner decisions, not buried in a long table.
              </p>
              <div className="pricing-v3-actions">
                <Link className="button button-primary" href={siteSettings.ctas.book}>Book Online</Link>
                <Link className="button button-muted" href="/contact">Ask Before Booking</Link>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <div className="pricing-v3-showpiece" aria-label="Pricing highlights">
              <div className="pricing-v3-pet-card">
                <img src="/pricing-vet-ginger-pets.png" alt="Veterinarian with a ginger cat and ginger dog" />
                <span>Transparent care guide</span>
              </div>
              {heroStats.map((item, index) => (
                <div key={item.label} className={`pricing-v3-float-ticket ticket-${index + 1}`}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell pricing-v3-intro">
        <Reveal variant="up">
          <div className="pricing-v3-intro-copy">
            <p className="eyebrow">How to read this page</p>
            <h2>Start with the service, then compare standard and online booking prices.</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={80}>
          <p>
            These prices are a practical launch guide for The Sutton Vet. Final costs may vary where clinical assessment, patient size, medication, or additional tests affect the treatment plan. Instalment payments via Klarna can be offered where eligible once the Lupa Pay setup is confirmed.
          </p>
        </Reveal>
      </section>

      <nav className="shell pricing-v3-route-map" aria-label="Pricing categories">
        {priceSections.map((section, index) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        ))}
      </nav>

      <PricingMobileAccordion sections={priceSections} bookHref={siteSettings.ctas.book} />

      <section className="shell pricing-v3-health-band">
        <div>
          <p className="eyebrow">Health Plan</p>
          <h2>Monthly preventative care, kept easy to compare.</h2>
        </div>
        <p>
          The Health Plan figures are included above for fast comparison, while the full Health Plan page explains what is included and how owners can join.
        </p>
        <Link className="button button-primary" href="/health-plan">See Health Plan</Link>
      </section>

      <SectionCta
        eyebrow="Next Step"
        title="Need help understanding a likely cost?"
        text="Tell us what your pet needs and the team can guide you towards the right appointment, estimate, or care route."
        primaryLabel="Book Online"
        primaryHref={siteSettings.ctas.book}
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
