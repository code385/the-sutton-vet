import { PageIntro } from "@/components/shared/PageIntro";
import { cookieInventory, cookieSections, legalPageCopy } from "@/lib/site";
import { getLegalPageByType } from "@/sanity/lib/contentPages";

export default async function CookiePolicyPage() {
  const page = await getLegalPageByType("Cookie Policy");
  const sections = page?.sections?.length
    ? page.sections
    : cookieSections.map((section) => ({
        title: section.title,
        status: section.status,
        body: [section.body],
      }));
  const inventoryItems = page?.inventoryItems?.length ? page.inventoryItems : cookieInventory;

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Cookie Policy"}
        title={page?.title || "Cookie policy"}
        description={page?.description || legalPageCopy.cookies}
      />
      <section className="legal-stack">
        {sections.map((section) => (
          <article key={section.title} className="legal-card">
            <div className="legal-card-row">
              <h2>{section.title}</h2>
              {section.status ? <span className="legal-pill">{section.status}</span> : null}
            </div>
            {(section.body || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}

        <article className="legal-card">
          <h2>Cookie and technology inventory</h2>
          <div className="cookie-table">
            {inventoryItems.map((item) => (
              <div key={item.name} className="cookie-table-row">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.provider}</p>
                </div>
                <p>{item.purpose}</p>
                <p>{item.duration}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
