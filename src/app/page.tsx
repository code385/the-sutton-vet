import { HomeAdviceContent } from "@/components/home/HomeAdviceContent";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHealthPlan } from "@/components/home/HomeHealthPlan";
import { HomeFounderStory } from "@/components/home/HomeFounderStory";
import { HomeSocialShowcase } from "@/components/home/HomeSocialShowcase";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeTrustCommunity } from "@/components/home/HomeTrustCommunity";
import { HomeWhyChoose } from "@/components/home/HomeWhyChoose";
import { SectionCta } from "@/components/shared/SectionCta";
import { getHomePageDocument, portableTextToParagraphs } from "@/sanity/lib/homePage";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

export default async function Home() {
  const [homePage, siteSettingsDocument] = await Promise.all([getHomePageDocument(), getSiteSettingsDocument()]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const founderParagraphs = portableTextToParagraphs(homePage?.founderStory);

  return (
    <>
      <HomeHero
        eyebrow={homePage?.heroEyebrow}
        title={homePage?.heroTitle}
        description={homePage?.heroDescription}
        practicalNote={homePage?.heroPracticalNote}
        imageUrl={homePage?.heroImageUrl}
        videoUrl={homePage?.heroVideoUrl}
        primaryCtaLabel={homePage?.heroPrimaryCtaLabel}
        primaryCtaHref={homePage?.heroPrimaryCtaHref}
        secondaryCtaLabel={homePage?.heroSecondaryCtaLabel}
        secondaryCtaHref={homePage?.heroSecondaryCtaHref}
        stats={homePage?.heroStats}
        links={homePage?.heroLinks}
        registerHref={siteSettings.ctas.register}
        bookHref={siteSettings.ctas.book}
      />

      <HomeWhyChoose
        eyebrow={homePage?.whyChooseEyebrow}
        title={homePage?.whyChooseTitle}
        description={homePage?.whyChooseDescription}
        secondaryText={homePage?.whyChooseSecondaryText}
        imageUrl={homePage?.whyChooseImageUrl}
        mediaTitle={homePage?.whyChooseMediaTitle}
        mediaDescription={homePage?.whyChooseMediaDescription}
        pills={homePage?.whyChoosePills}
        cards={homePage?.whyChooseCards}
      />

      <HomeFounderStory
        eyebrow={homePage?.founderEyebrow}
        title={homePage?.founderTitle}
        role={homePage?.founderRole}
        quote={homePage?.founderQuote}
        paragraphs={founderParagraphs}
        image={homePage?.founderPortrait?.asset?.url}
        portraitKicker={homePage?.founderPortraitKicker}
        portraitBadgeText={homePage?.founderPortraitBadgeText}
        highlights={homePage?.founderHighlights}
        primaryCtaLabel={homePage?.founderPrimaryCtaLabel}
        primaryCtaHref={homePage?.founderPrimaryCtaHref}
        secondaryCtaLabel={homePage?.founderSecondaryCtaLabel}
        secondaryCtaHref={homePage?.founderSecondaryCtaHref}
        registerHref={siteSettings.ctas.register}
        whatsappHref={siteSettings.ctas.whatsapp}
      />

      <HomeServices
        eyebrow={homePage?.servicesEyebrow}
        title={homePage?.servicesTitle}
        description={homePage?.servicesDescription}
        imageUrl={homePage?.servicesImageUrl}
        videoUrl={homePage?.servicesVideoUrl}
        mediaKicker={homePage?.servicesMediaKicker}
        mediaCaption={homePage?.servicesMediaCaption}
        mediaButtonLabel={homePage?.servicesMediaButtonLabel}
        mediaButtonHref={homePage?.servicesMediaButtonHref}
        points={homePage?.servicesPoints}
      />

      <HomeHealthPlan
        eyebrow={homePage?.healthPlanEyebrow}
        title={homePage?.healthPlanTitle}
        description={homePage?.healthPlanDescription}
        secondaryText={homePage?.healthPlanSecondaryText}
        primaryCtaLabel={homePage?.healthPlanPrimaryCtaLabel}
        primaryCtaHref={homePage?.healthPlanPrimaryCtaHref}
        secondaryCtaLabel={homePage?.healthPlanSecondaryCtaLabel}
        secondaryCtaHref={homePage?.healthPlanSecondaryCtaHref}
        videoUrl={homePage?.healthPlanVideoUrl}
        posterUrl={homePage?.healthPlanPosterUrl}
        cardEyebrow={homePage?.healthPlanCardEyebrow}
        cardTitle={homePage?.healthPlanCardTitle}
        tiers={homePage?.healthPlanTiers}
        benefits={homePage?.healthPlanBenefits}
      />

      <HomeTrustCommunity
        trustEyebrow={homePage?.trustEyebrow}
        trustTitle={homePage?.trustTitle}
        trustText={homePage?.trustText}
        trustImageUrl={homePage?.trustImageUrl}
        trustPills={homePage?.trustPills}
        trustHighlights={homePage?.trustHighlights}
        trustModules={homePage?.trustModules}
        locationEyebrow={homePage?.locationEyebrow}
        locationTitle={homePage?.locationTitle}
        locationAddress={homePage?.locationAddress}
        locationDirectionsLabel={homePage?.locationDirectionsLabel}
        locationDirectionsHref={homePage?.locationDirectionsHref}
        locationPoints={homePage?.locationPoints}
        locationMapImageUrl={homePage?.locationMapImageUrl}
        homepageVideoUrl={homePage?.homepageVideoUrl}
        homepageVideoEyebrow={homePage?.homepageVideoEyebrow}
        homepageVideoTitle={homePage?.homepageVideoTitle}
        homepageVideoDescription={homePage?.homepageVideoDescription}
        homepageVideoActionLabel={homePage?.homepageVideoActionLabel}
        defaultAddress={siteSettings.address}
        youtubeHref={siteSettings.socialLinks.find((item) => item.label === "YouTube")?.href || "https://www.youtube.com/"}
      />

      <HomeAdviceContent
        eyebrow={homePage?.adviceEyebrow}
        title={homePage?.adviceTitle}
        introText={homePage?.adviceIntroText}
        ctaLabel={homePage?.adviceCtaLabel}
        ctaHref={homePage?.adviceCtaHref}
        pills={homePage?.advicePills}
        featuredImageUrl={homePage?.adviceFeaturedImageUrl}
        secondaryImageUrl={homePage?.adviceSecondaryImageUrl}
        articles={homePage?.adviceArticles}
      />

      <HomeSocialShowcase
        eyebrow={homePage?.socialEyebrow}
        title={homePage?.socialTitle}
        description={homePage?.socialDescription}
        instagramLabel={homePage?.socialInstagramLabel}
        tikTokLabel={homePage?.socialTikTokLabel}
        cards={homePage?.socialCards}
        instagramHref={siteSettings.socialLinks.find((item) => item.label === "Instagram")?.href || "/"}
        tikTokHref={siteSettings.socialLinks.find((item) => item.label === "TikTok")?.href || "/"}
      />

      <SectionCta
        eyebrow={homePage?.ctaEyebrow}
        title={homePage?.ctaTitle || "Every page should still end with a clear next step."}
        text={homePage?.ctaText || "Clear actions, less clutter."}
        primaryLabel={homePage?.ctaPrimaryLabel}
        primaryHref={homePage?.ctaPrimaryHref}
        secondaryLabel={homePage?.ctaSecondaryLabel}
        secondaryHref={homePage?.ctaSecondaryHref}
      />
    </>
  );
}
