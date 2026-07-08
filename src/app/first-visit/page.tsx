import { PageIntro } from "@/components/shared/PageIntro";
import { SectionCta } from "@/components/shared/SectionCta";
import { getFirstVisitPageDocument } from "@/sanity/lib/contentPages";

const fallbackSteps = [
  "Register through the Lupa Pets flow before the appointment where possible.",
  "Bring previous records, medication details, and any insurance information.",
  "Expect a calm first consultation with practical next-step guidance.",
];

export default async function FirstVisitPage() {
  const page = await getFirstVisitPageDocument();
  const steps = page?.steps?.length ? page.steps : fallbackSteps;

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "New Client / First Visit Guide"}
        title={page?.title || "A calmer first visit starts with clearer preparation."}
        description={page?.description || "Simple guidance for a smoother first appointment."}
      />

      <section className="panel">
        <div className="stack-list">
          {steps.map((item) => (
            <div key={item} className="list-row">
              <span className="list-dot" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionCta
        title={page?.ctaTitle || "Ready to register first?"}
        text={page?.ctaText || "A simple route into Lupa starts here."}
        primaryLabel={page?.ctaPrimaryLabel}
        primaryHref={page?.ctaPrimaryHref}
        secondaryLabel={page?.ctaSecondaryLabel}
        secondaryHref={page?.ctaSecondaryHref}
      />
    </>
  );
}
