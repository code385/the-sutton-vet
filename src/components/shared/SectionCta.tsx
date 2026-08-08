import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

type SectionCtaProps = {
  eyebrow?: string;
  title: string;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export async function SectionCta({
  eyebrow,
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: SectionCtaProps) {
  const siteSettings = resolveSiteSettings(await getSiteSettingsDocument());

  return (
    <section className="section-cta section-cta-premium">
      <Reveal variant="left">
        <div className="section-cta-content">
          <p className="eyebrow">{eyebrow || "Next Step"}</p>
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="section-cta-note" aria-hidden="true">
            <span>Prefer to talk first?</span>
            <p>Contact the team and we will point you towards the calmest next step.</p>
          </div>
          <div className="cta-actions">
            <a className="button button-primary" href={primaryHref || siteSettings.ctas.register}>
              {primaryLabel || "Register Now"}
            </a>
            <a className="button button-muted" href={secondaryHref || siteSettings.ctas.book}>
              {secondaryLabel || "Book Online"}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
