import { founderStory, siteConfig } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";

type HomeFounderStoryProps = {
  eyebrow?: string;
  title?: string;
  role?: string;
  quote?: string;
  paragraphs?: string[];
  image?: string;
  portraitKicker?: string;
  portraitBadgeText?: string;
  highlights?: string[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  registerHref?: string;
  whatsappHref?: string;
};

export function HomeFounderStory({
  eyebrow,
  title,
  role,
  quote,
  paragraphs,
  image,
  portraitKicker,
  portraitBadgeText,
  highlights,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  registerHref,
  whatsappHref,
}: HomeFounderStoryProps) {
  const mergedParagraphs = paragraphs?.length ? paragraphs : founderStory.paragraphs;
  const [leadParagraph, ...bodyParagraphs] = mergedParagraphs;
  const founderHighlights = highlights?.filter(Boolean).length ? highlights.filter(Boolean) : founderStory.highlights;

  return (
    <section className="founder-section-home">
      <Reveal variant="mask">
        <div className="founder-portrait-column">
          <div className="founder-portrait-frame" style={{ backgroundImage: `url(${image || founderStory.image})` }}>
            <div className="founder-portrait-overlay" />
            <div className="founder-portrait-badge">
              <span className="founder-badge-kicker">{portraitKicker || "Founder Portrait"}</span>
              <strong>{portraitBadgeText || "Professional founder photography can be updated from the CMS at any time."}</strong>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal variant="right">
        <div className="founder-copy-panel">
          <div className="founder-copy-header">
            <div className="founder-meta-stack">
              <p className="eyebrow">{eyebrow || founderStory.eyebrow}</p>
              <p className="founder-role">{role || founderStory.role}</p>
            </div>
          </div>

          <h2>
            {title || founderStory.title}
          </h2>

          <blockquote className="founder-quote">{quote || founderStory.quote}</blockquote>

          <div className="founder-chip-row">
            {founderHighlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <p className="founder-lead">{leadParagraph}</p>

          <div className="founder-body">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="founder-actions">
            <a className="button button-primary" href={primaryCtaHref || registerHref || siteConfig.ctas.register}>
              {primaryCtaLabel || "Register Now"}
            </a>
            <a className="text-link" href={secondaryCtaHref || whatsappHref || siteConfig.ctas.whatsapp}>
              {secondaryCtaLabel || "Talk to our team on WhatsApp"}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
