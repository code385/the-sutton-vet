import { Reveal } from "@/components/shared/Reveal";
import { homeMedia, serviceGroups } from "@/lib/site";

type HomeServicesProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaKicker?: string;
  mediaCaption?: string;
  mediaButtonLabel?: string;
  mediaButtonHref?: string;
  points?: string[];
};

export function HomeServices({
  eyebrow,
  title,
  description,
  imageUrl,
  videoUrl,
  mediaKicker,
  mediaCaption,
  mediaButtonLabel,
  mediaButtonHref,
  points,
}: HomeServicesProps) {
  const servicePoints = points?.filter(Boolean).length ? points.filter(Boolean) : ["Clear service summaries", "Separate pages planned", "Mobile-friendly pathways"];

  return (
    <section className="services-section-home">
      <div className="services-intro split-feature split-feature-reverse">
        <Reveal variant="mask">
          <div className="section-media-card services-media-shell">
            <div
              className="section-media-image"
              style={{ backgroundImage: `url(${imageUrl || homeMedia.servicesImage})` }}
            />
            <video className="section-media-video" src={videoUrl || homeMedia.servicesVideo} autoPlay muted loop playsInline />
            <div className="section-media-overlay" />
            <div className="section-media-caption">
              <span>{mediaKicker || "CMS-driven media"}</span>
              <strong>{mediaCaption || "Replaceable service image or muted clinical walkthrough video can live here later."}</strong>
              <a className="button button-primary services-media-button" href={mediaButtonHref || "/services"}>
                {mediaButtonLabel || "Explore Services"}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="services-copy-stack split-copy">
            <div className="section-heading">
              <p className="eyebrow">{eyebrow || "Core Services"}</p>
              <h2>{title || "Clinical services should feel structured, modern, and easy to navigate."}</h2>
            </div>

            <div className="services-copy-card">
              <p>{description || "The homepage should reassure first, then guide visitors into the right clinical pathway without making the site feel crowded."}</p>
              <div className="services-copy-points">
                {servicePoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
