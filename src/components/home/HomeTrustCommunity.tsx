import { Reveal } from "@/components/shared/Reveal";
import { ConsentManagedEmbed } from "@/components/shared/ConsentManagedEmbed";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { homeMedia, locationPoints, practiceTourPreview, siteConfig, trustHighlights, trustIntro, trustModules } from "@/lib/site";

type HomeTrustCommunityProps = {
  trustEyebrow?: string;
  trustTitle?: string;
  trustText?: string;
  trustImageUrl?: string;
  trustPills?: string[];
  trustHighlights?: string[];
  trustModules?: { tag?: string; title?: string; text?: string }[];
  locationEyebrow?: string;
  locationTitle?: string;
  locationAddress?: string;
  locationDirectionsLabel?: string;
  locationDirectionsHref?: string;
  locationPoints?: string[];
  locationMapImageUrl?: string;
  homepageVideoUrl?: string;
  homepageVideoEyebrow?: string;
  homepageVideoTitle?: string;
  homepageVideoDescription?: string;
  homepageVideoActionLabel?: string;
  defaultAddress?: string;
  youtubeHref?: string;
};

export function HomeTrustCommunity({
  trustEyebrow,
  trustTitle,
  trustText,
  trustImageUrl,
  trustPills,
  trustHighlights: trustHighlightItems,
  trustModules: trustModuleItems,
  locationEyebrow,
  locationTitle,
  locationAddress,
  locationDirectionsLabel,
  locationDirectionsHref,
  locationPoints: locationPointItems,
  locationMapImageUrl,
  homepageVideoUrl,
  homepageVideoEyebrow,
  homepageVideoTitle,
  homepageVideoDescription,
  homepageVideoActionLabel,
  defaultAddress,
  youtubeHref,
}: HomeTrustCommunityProps) {
  const embedUrl = getYouTubeEmbedUrl(homepageVideoUrl);
  const launchPills = (trustPills?.filter(Boolean).length ? trustPills.filter(Boolean) : ["Founder-led", "Registrations open", "CMS swappable content"]).slice(0, 2);
  const modules = trustModuleItems?.filter((item) => item.tag && item.title && item.text) || trustModules;
  const primaryModule = modules[0];
  const locationList = locationPointItems?.filter(Boolean).length ? locationPointItems.filter(Boolean) : locationPoints;
  const resolvedAddress = locationAddress || defaultAddress || siteConfig.address;

  return (
    <section className="trust-section-home">
      <div className="trust-section-top">
        <Reveal variant="left">
          <article className="feature-panel trust-launch-panel">
            <div className="trust-launch-media" style={{ backgroundImage: `url(${trustImageUrl || homeMedia.trustImage})` }} />
            <div className="trust-launch-overlay" />
            <p className="eyebrow">{trustEyebrow || trustIntro.eyebrow}</p>
            <h2>{trustTitle || trustIntro.title}</h2>
            <p>{trustText || trustIntro.text}</p>
            <div className="hero-stat-row trust-panel-pills">
              {launchPills.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal variant="right">
          <div className="trust-section-intro">
            <article className="info-card trust-summary-card">
              <div className="trust-summary-header">
                <span className="card-tag">{primaryModule?.tag || "Now Accepting"}</span>
                <h3>{primaryModule?.title || "Launch credibility should feel clear, not crowded."}</h3>
                <p>{trustText || primaryModule?.text || "Show opening momentum, standards, and future review readiness in one concise block instead of multiple competing cards."}</p>
              </div>

              <div className="trust-summary-rows">
                {modules.map((item) => (
                  <div key={`${item.tag}-${item.title}`} className="trust-summary-row">
                    <span className="trust-summary-label">{item.tag}</span>
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </Reveal>
      </div>

      {embedUrl ? (
        <Reveal variant="scale" delayMs={80}>
          <ConsentManagedEmbed
            category="marketing"
            title="Practice tour available after consent."
            description="YouTube embeds only load when optional embedded-media cookies are accepted."
            actionHref={homepageVideoUrl || youtubeHref || siteConfig.socials[3]?.href || "https://www.youtube.com/"}
            actionLabel={homepageVideoActionLabel || "Open on YouTube"}
            hideWhenBlocked
          >
            <article className="panel trust-tour-card trust-tour-row">
              <div className="trust-tour-embed-shell">
                <iframe
                  className="trust-tour-embed"
                  src={embedUrl}
                  title={homepageVideoTitle || practiceTourPreview.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="trust-tour-overlay" />
              </div>
              <div className="trust-tour-copy">
                <p className="eyebrow">{homepageVideoEyebrow || "Practice Tour"}</p>
                <h2>{homepageVideoTitle || practiceTourPreview.title}</h2>
                <p>{homepageVideoDescription || practiceTourPreview.text}</p>
              </div>
            </article>
          </ConsentManagedEmbed>
        </Reveal>
      ) : null}

      <div className="trust-modules-grid">
        <Reveal variant="mask">
          <article className="panel trust-location-card">
            <div
              className="trust-map-card"
              aria-hidden="true"
              style={locationMapImageUrl ? { backgroundImage: `url(${locationMapImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!locationMapImageUrl ? (
                <>
                  <div className="trust-map-grid" />
                  <div className="trust-map-route trust-map-route-a" />
                  <div className="trust-map-route trust-map-route-b" />
                  <div className="trust-map-pin trust-map-pin-primary">
                    <span />
                  </div>
                  <div className="trust-map-pin trust-map-pin-secondary">
                    <span />
                  </div>
                </>
              ) : null}
              <div className="trust-map-label">
                <strong>The Sutton Vet</strong>
                <p>{resolvedAddress}</p>
              </div>
            </div>
            <div className="trust-card-copy">
              <p className="eyebrow">{locationEyebrow || "Find Us"}</p>
              <h2>{locationTitle || "Exact location and directions should be clear early."}</h2>
              <p className="trust-location-address">{resolvedAddress}</p>
              <div className="stack-list">
                {locationList.map((item) => (
                  <div key={item} className="list-row">
                    <span className="list-dot" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <a className="text-link trust-directions-link" href={locationDirectionsHref || "/contact"}>
                {locationDirectionsLabel || "Get directions"}
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal variant="right" delayMs={90}>
          <article className="info-card trust-side-notes">
            <div className="trust-side-notes-header">
              <span className="card-tag">{primaryModule?.tag || "Now Accepting"}</span>
              <h3>{primaryModule?.title || "Launch credibility should feel clear, not crowded."}</h3>
              <p>{primaryModule?.text || "A cleaner trust block for credentials, opening momentum, and future reviews."}</p>
            </div>

            <div className="trust-side-list">
              {trustHighlightItems?.length ? trustHighlightItems.map((item) => (
                <div key={item} className="list-row">
                  <span className="list-dot" />
                  <p>{item}</p>
                </div>
              )) : trustHighlights.map((item) => (
                <div key={item} className="list-row">
                  <span className="list-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="trust-summary-rows trust-summary-rows-compact">
              {modules.map((item) => (
                <div key={`${item.tag}-${item.title}`} className="trust-summary-row">
                  <span className="trust-summary-label">{item.tag}</span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
