import { PageIntro } from "@/components/shared/PageIntro";
import { accessibilitySections, legalPageCopy } from "@/lib/site";
import { getLegalPageByType } from "@/sanity/lib/contentPages";

export default async function AccessibilityPage() {
  const page = await getLegalPageByType("Accessibility Statement");
  const sections = page?.sections?.length ? page.sections : accessibilitySections;

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Accessibility Statement"}
        title={page?.title || "Accessibility"}
        description={page?.description || legalPageCopy.accessibility}
      />
      <section className="legal-stack">
        {sections.map((section) => (
          <article key={section.title} className="legal-card">
            <h2>{section.title}</h2>
            {(section.body || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
    </>
  );
}
