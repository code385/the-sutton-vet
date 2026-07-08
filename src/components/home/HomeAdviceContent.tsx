import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { blogPreview, homeMedia } from "@/lib/site";

type AdviceArticle = {
  category?: string;
  date?: string;
  title?: string;
  excerpt?: string;
  meta?: string;
  cta?: string;
  href?: string;
};

const fallbackArticles: AdviceArticle[] = blogPreview.map((item) => ({
  ...item,
  href: "/blog",
}));

type HomeAdviceContentProps = {
  eyebrow?: string;
  title?: string;
  introText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  pills?: string[];
  featuredImageUrl?: string;
  secondaryImageUrl?: string;
  articles?: AdviceArticle[];
};

export function HomeAdviceContent({
  eyebrow,
  title,
  introText,
  ctaLabel,
  ctaHref,
  featuredImageUrl,
  secondaryImageUrl,
  articles,
}: HomeAdviceContentProps) {
  const previewArticles = (articles?.filter((item) => item.title && item.excerpt) || fallbackArticles).slice(0, 2);
  const [firstArticle, secondArticle] = previewArticles;

  if (!firstArticle) {
    return null;
  }

  return (
    <section className="advice-section-home">
      <div className="advice-section-top">
        <Reveal variant="left">
          <div className="section-heading">
            <p className="eyebrow">{eyebrow || "Advice & Content"}</p>
            <h2>{title || "Latest posts"}</h2>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="advice-section-actions">
            <p>{introText || "A simple preview of the latest practical posts, with a clear route into the full advice hub."}</p>
            <Link className="button button-primary" href={ctaHref || "/blog"}>
              {ctaLabel || "View blog"}
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="advice-minimal-grid">
        {[firstArticle, secondArticle].filter(Boolean).map((item, index) => (
          <Reveal key={item?.title} variant={index === 0 ? "mask" : "up"} delayMs={index * 80}>
            <article className="info-card advice-simple-card">
              <div
                className="advice-simple-thumb"
                style={{
                  backgroundImage: `url(${index === 0 ? featuredImageUrl || homeMedia.adviceFeaturedImage : secondaryImageUrl || homeMedia.adviceSecondaryImage})`,
                }}
              />
              <div className="advice-simple-content">
                <div className="advice-simple-top">
                  <span className="card-tag">{item?.category}</span>
                  <span className="advice-simple-date">{item?.date}</span>
                </div>
                <h3>{item?.title}</h3>
                <p>{item?.excerpt}</p>
                <Link className="text-link advice-read-link" href={item?.href || "/blog"}>
                  {item?.cta || "Read article"}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
