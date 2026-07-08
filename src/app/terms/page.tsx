import { PageIntro } from "@/components/shared/PageIntro";
import { legalPageCopy, termsSections } from "@/lib/site";
import { getLegalPageByType } from "@/sanity/lib/contentPages";

export default async function TermsPage() {
  const page = await getLegalPageByType("Terms of Business");
  const sections = page?.sections?.length ? page.sections : termsSections;

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Terms of Business"}
        title={page?.title || "Terms of business"}
        description={page?.description || legalPageCopy.terms}
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
