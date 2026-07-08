import { PageIntro } from "@/components/shared/PageIntro";
import { SectionCta } from "@/components/shared/SectionCta";
import { faqPreview } from "@/lib/site";
import { getFaqItems, getFaqPageDocument } from "@/sanity/lib/contentPages";

export default async function FaqPage() {
  const [faqPageDocument, faqItems] = await Promise.all([getFaqPageDocument(), getFaqItems()]);
  const items = faqItems.length
    ? faqItems
        .filter((item) => item.question && item.answer)
        .map((item) => ({
          question: item.question || "",
          answer: item.answer || "",
          category: item.category || "",
        }))
    : faqPreview.map((item) => ({ ...item, category: "" }));

  return (
    <>
      <PageIntro
        eyebrow={faqPageDocument?.eyebrow || "FAQ"}
        title={faqPageDocument?.title || "Common practical questions, answered clearly."}
        description={faqPageDocument?.description || "Clear answers without making users dig."}
      />

      <section className="faq-list">
        {items.map((item) => (
          <article key={item.question} className="faq-item">
            {item.category ? <p className="eyebrow">{item.category}</p> : null}
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <SectionCta
        title={faqPageDocument?.ctaTitle || "Still need help?"}
        text={faqPageDocument?.ctaText || "Contact, book, or call from here."}
        primaryLabel={faqPageDocument?.ctaPrimaryLabel}
        primaryHref={faqPageDocument?.ctaPrimaryHref}
        secondaryLabel={faqPageDocument?.ctaSecondaryLabel}
        secondaryHref={faqPageDocument?.ctaSecondaryHref}
      />
    </>
  );
}
