import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageIntro } from "@/components/shared/PageIntro";
import { getLegalPageBySlug } from "@/sanity/lib/contentPages";

type Props = { params: Promise<{ slug: string }> };
const getPage = cache(getLegalPageBySlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return page ? { title: `${page.title} | The Sutton Vet`, description: page.description } : { title: "Page not found" };
}

export default async function CompliancePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page?.title) notFound();

  return (
    <>
      <PageIntro eyebrow={page.eyebrow || "Practice policies"} title={page.title} description={page.description || ""} />
      <section className="legal-stack" aria-label={page.title}>
        {(page.sections || []).map((section, index) => (
          <article key={index} className="legal-card">
            {section.title && <h2>{section.title}</h2>}
            {(section.body || []).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </article>
        ))}
      </section>
    </>
  );
}
