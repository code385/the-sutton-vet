import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { healthPlanPageSeed } from "@/lib/healthPlanSeed";
import { visualAssets } from "@/lib/visualAssets";
import { getHealthPlanPageDocument } from "@/sanity/lib/healthPlan";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

type GlyphProps = {
  name?: string;
};

function HealthPlanGlyph({ name }: GlyphProps) {
  switch (name) {
    case "dog":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 40c0-8 6-14 14-14h10c4 0 7-1 10-4l3 4-3 6v8c0 6-4 10-10 10H28c-6 0-10-4-10-10Z" />
          <path d="M24 24l-4-5M49 23l4 2M22 50v5M42 50v5" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 25 28 16l6 7 6-7 6 9v15c0 7-5 12-12 12h-4c-8 0-14-6-14-14Z" />
          <path d="M23 35 15 37M41 35l8 2M25 52v4M41 52v4" />
        </svg>
      );
    case "syringe":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="m42 15 7 7M19 45l17-17M15 49l8-8M23 13h9v7h-9zM38 30l8 8-5 5-8-8z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 11c7 5 15 7 20 8v13c0 12-8 20-20 25C20 52 12 44 12 32V19c5-1 13-3 20-8Z" />
          <path d="m24 33 6 6 11-13" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M21 14v12c0 6 5 11 11 11s11-5 11-11V14M17 14h8M39 14h8M43 37v6c0 6-5 11-11 11s-11-5-11-11v-3" />
          <circle cx="49" cy="37" r="5" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="16" y="20" width="32" height="24" rx="6" />
          <path d="M24 20v-5M32 20v-5M40 20v-5M24 49v-5M32 49v-5M40 49v-5M16 28h-5M16 36h-5M53 28h-5M53 36h-5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="20" />
          <path d="M32 22v20M22 32h20" />
        </svg>
      );
  }
}

const included = [
  { title: "Annual booster vaccinations", icon: "syringe" },
  { title: "Prescription flea, tick, and worming support", icon: "shield" },
  { title: "Routine nurse-led weight checks", icon: "stethoscope" },
  { title: "Helpful reminders through the year", icon: "chip" },
  { title: "Preventative care made easier to budget", icon: "cat" },
  { title: "Selected savings on routine care", icon: "dog" },
];


const planOptions = [
  {
    name: "Paw Health Plan",
    price: "As little as \u00a312.30 per month",
    description: "For cats, small furries, rabbits, guinea pigs, birds, and routine preventative healthcare planning.",
    benefits: [
      "Prescription flea treatment delivered to your door every 3 months",
      "Prescription worm treatment delivered to your door every 3 months",
      "Free nurse weight checks",
      "Annual booster vaccinations",
      "Free direct insurance claims",
      "Save up to 20% on preventative healthcare",
    ],
  },
  {
    name: "Golden Paw Health Plan",
    price: "\u00a325 per month",
    description: "One clear monthly option for all sizes and species, with extra routine-care support included.",
    benefits: [
      "Prescription flea treatment delivered to your door every 3 months",
      "Prescription worm treatment delivered to your door every 3 months",
      "Free nurse weight checks",
      "Annual booster vaccinations",
      "Free direct insurance claims",
      "Unlimited first-opinion consultations",
      "Unlimited nail clips and anal gland evacuations",
      "Free microchip",
      "Kennel cough vaccine",
      "Always pay our minimum price",
    ],
  },
];

const prices = [
  { pet: "Cat", detail: "all sizes", price: "\u00a314.58", icon: "cat" },
  { pet: "Small dog", detail: "under 10kg", price: "\u00a312.30", icon: "dog" },
  { pet: "Medium dog", detail: "10-25kg", price: "\u00a314.64", icon: "dog" },
  { pet: "Large dog", detail: "25-40kg", price: "\u00a317.40", icon: "dog" },
  { pet: "Giant dog", detail: "over 40kg", price: "\u00a320.28", icon: "dog" },
];

export default async function HealthPlanPage() {
  const [healthPlanPage, siteSettingsDocument] = await Promise.all([getHealthPlanPageDocument(), getSiteSettingsDocument()]);
  const page = healthPlanPage || healthPlanPageSeed;
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const healthPlanSignupUrl = siteSettings.ctas.healthPlan || siteSettings.ctas.book;
  const faqItems = page.faqItems?.filter((item) => item.question && item.answer) || healthPlanPageSeed.faqItems;

  return (
    <>
      <section className="hp-v2-hero full-bleed-section">
        <div className="shell hp-v2-hero-shell">
          <Reveal variant="left">
            <div className="hp-v2-hero-copy">
              <p className="eyebrow">{page.eyebrow || "The Sutton Vet Health Plan"}</p>
              <h1>Routine care that feels easier to keep on track.</h1>
              <p>
                Spread the cost of routine preventative care for dogs and cats, with clear monthly pricing, year-round reminders, and support that feels calm rather than complicated.
              </p>
              <div className="hp-v2-actions">
                <a className="button button-primary" href={healthPlanSignupUrl}>
                  Join or Ask Online
                </a>
                <Link className="button button-muted" href="#health-plan-pricing">
                  See Monthly Prices
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <div className="hp-v2-hero-card">
              <div className="hp-v2-plan-orbit" aria-hidden="true"><span /><span /><span /></div>
              <div className="hp-v2-care-photo" aria-hidden="true">
                <img src="/pricing-vet-ginger-pets.png" alt="" />
              </div>
              <div className="hp-v2-price-ticket">
                <span>From</span>
                <strong>{"\u00a3"}12.30</strong>
                <small>per month</small>
              </div>
              <div className="hp-v2-delivery-note">
                <HealthPlanGlyph name="shield" />
                <span>Routine care planned through the year</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell hp-v2-peace">
        <Reveal variant="mask">
          <div className="hp-v2-peace-media" style={{ backgroundImage: `url(${visualAssets.gingerSpanielHero})` }} />
        </Reveal>
        <Reveal variant="right">
          <div className="hp-v2-peace-copy">
            <p className="eyebrow">Peace of mind</p>
            <h2>One calmer route for the routine things pets need most.</h2>
            <p>
              The Health Plan is not insurance. It is for predictable preventative care: boosters, parasite protection, weight checks, reminders, and a steadier rhythm for routine wellbeing.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="hp-v2-included full-bleed-section">
        <div className="shell hp-v2-included-shell">
          <Reveal variant="up">
            <div className="hp-v2-section-heading">
              <p className="eyebrow">What's included</p>
              <h2>Clear benefits, without a heavy sales pitch.</h2>
            </div>
          </Reveal>
          <div className="hp-v2-benefit-grid">
            {included.map((item, index) => (
              <Reveal key={item.title} variant="up" delayMs={index * 35}>
                <div className="hp-v2-benefit">
                  <HealthPlanGlyph name={item.icon} />
                  <span>{item.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      <section className="shell hp-v2-plan-options">
        <Reveal variant="up">
          <div className="hp-v2-section-heading is-center">
            <p className="eyebrow">Plan Options</p>
            <h2>Paw and Golden Paw, explained without clutter.</h2>
          </div>
        </Reveal>
        <div className="hp-v2-plan-grid">
          {planOptions.map((plan, index) => (
            <Reveal key={plan.name} variant="up" delayMs={index * 60}>
              <article className="hp-v2-plan-card">
                <div className="hp-v2-plan-card-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{plan.name}</h3>
                    <strong>{plan.price}</strong>
                  </div>
                </div>
                <p>{plan.description}</p>
                <ul>
                  {plan.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="health-plan-pricing" className="shell hp-v2-pricing">
        <Reveal variant="up">
          <div className="hp-v2-section-heading is-center">
            <p className="eyebrow">Monthly pricing</p>
            <h2>Pick the pet size, then scan the monthly cost.</h2>
          </div>
        </Reveal>

        <div className="hp-v2-price-rail">
          {prices.map((item, index) => (
            <Reveal key={item.pet} variant="up" delayMs={index * 45}>
              <article className="hp-v2-price-item">
                <HealthPlanGlyph name={item.icon} />
                <h3>{item.pet}</h3>
                <p>{item.detail}</p>
                <strong>{item.price}</strong>
                <span>per month</span>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" delayMs={80}>
          <div className="hp-v2-puppy-note">
            <div className="hp-v2-note-index">i</div>
            <div>
              <strong>Puppies and growing dogs</strong>
              <p>If you are registering a puppy, choose the plan that aligns with their expected adult weight. If you are unsure, the team can advise before sign-up.</p>
            </div>
            <a className="button button-primary" href={healthPlanSignupUrl}>Register Interest</a>
          </div>
        </Reveal>
      </section>

      <section className="hp-v2-faq full-bleed-section">
        <div className="shell hp-v2-faq-shell">
          <Reveal variant="left">
            <div className="hp-v2-section-heading">
              <p className="eyebrow">FAQs</p>
              <h2>Questions owners usually ask first.</h2>
            </div>
          </Reveal>
          <div className="hp-v2-faq-list">
            {faqItems.map((item, index) => (
              <Reveal key={`${item.question}-${index}`} variant="up" delayMs={index * 40}>
                <details className="hp-v2-faq-item">
                  <summary>
                    <span>{item.question}</span>
                    <b aria-hidden="true">+</b>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell hp-v2-final">
        <Reveal variant="mask">
          <div className="hp-v2-final-panel">
            <div>
              <p className="eyebrow">Join the plan</p>
              <h2>Ready to make routine care feel more settled?</h2>
              <p>Register interest online or contact the team if you want help choosing the right plan for your pet.</p>
            </div>
            <div className="hp-v2-actions">
              <a className="button button-primary" href={healthPlanSignupUrl}>Join Health Plan</a>
              <Link className="button button-muted" href="/contact">Contact Us</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}




