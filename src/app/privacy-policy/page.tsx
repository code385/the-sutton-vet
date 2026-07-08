import { PageIntro } from "@/components/shared/PageIntro";
import { legalPageCopy, privacySections } from "@/lib/site";
import { getLegalPageByType } from "@/sanity/lib/contentPages";

export default async function PrivacyPolicyPage() {
  const page = await getLegalPageByType("Privacy Policy");
  const sections = page?.sections?.length ? page.sections : privacySections;

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Privacy Policy"}
        title={page?.title || "Privacy policy"}
        description={page?.description || legalPageCopy.privacy}
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
