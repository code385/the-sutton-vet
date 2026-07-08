import { TeamDirectory } from "@/components/team/TeamDirectory";
import { SectionCta } from "@/components/shared/SectionCta";
import { fallbackTeamMembers, teamPageSeed, type TeamMemberRecord } from "@/lib/teamSeed";
import { getTeamPageDocument } from "@/sanity/lib/contentPages";
import { getTeamMembers } from "@/sanity/lib/teamMembers";

export default async function MeetTheTeamPage() {
  const [sanityMembers, teamPageDocument] = await Promise.all([getTeamMembers(), getTeamPageDocument()]);
  const members: TeamMemberRecord[] = sanityMembers?.length
    ? sanityMembers
        .filter((member) => member.name && member.role && member.category && member.bio)
        .map((member, index) => ({
          id: member._id,
          name: member.name || "",
          role: member.role || "",
          category: member.category as TeamMemberRecord["category"],
          qualifications: member.qualifications || "",
          shortBio: member.shortBio || member.role || "",
          bio: member.bio || "",
          imageUrl: member.image?.asset?.url || member.imageUrl || fallbackTeamMembers[index % fallbackTeamMembers.length].imageUrl,
          displayOrder: member.displayOrder ?? index + 1,
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : fallbackTeamMembers;

  return (
    <>
      <section
        className="team-hero full-bleed-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(17, 25, 39, 0.7), rgba(17, 25, 39, 0.34)), url(${teamPageDocument?.heroImageUrl || teamPageSeed.heroImageUrl})`,
        }}
      >
        <div className="shell team-hero-shell">
          <div className="team-hero-copy">
            <p className="eyebrow">{teamPageDocument?.heroEyebrow || teamPageSeed.heroEyebrow}</p>
            <h1>{teamPageDocument?.heroTitle || teamPageSeed.heroTitle}</h1>
            <p>{teamPageDocument?.heroDescription || teamPageSeed.heroDescription}</p>
          </div>
        </div>
      </section>

      <section className="team-intro narrow-section">
        <div className="section-heading section-heading-center">
          <p className="eyebrow">{teamPageDocument?.introEyebrow || teamPageSeed.introEyebrow}</p>
          <h2>{teamPageDocument?.introTitle || teamPageSeed.introTitle}</h2>
          <p className="section-intro-copy">{teamPageDocument?.introDescription || teamPageSeed.introDescription}</p>
        </div>
      </section>

      <TeamDirectory members={members} />

      <SectionCta
        title={teamPageDocument?.ctaTitle || "Meet us in person?"}
        text={teamPageDocument?.ctaText || "Register, contact, or book online when you're ready."}
        primaryLabel={teamPageDocument?.ctaPrimaryLabel}
        primaryHref={teamPageDocument?.ctaPrimaryHref}
        secondaryLabel={teamPageDocument?.ctaSecondaryLabel}
        secondaryHref={teamPageDocument?.ctaSecondaryHref}
      />
    </>
  );
}
