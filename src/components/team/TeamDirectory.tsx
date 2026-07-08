"use client";

import { useEffect, useMemo, useState } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { teamCategoryLabels, type TeamMemberRecord } from "@/lib/teamSeed";

type TeamDirectoryProps = {
  members: TeamMemberRecord[];
};

export function TeamDirectory({ members }: TeamDirectoryProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberRecord | null>(null);

  useEffect(() => {
    if (!selectedMember) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedMember]);

  const groupedMembers = useMemo(
    () =>
      teamCategoryLabels
        .map((category) => ({
          ...category,
          members: members.filter((member) => member.category === category.key),
        }))
        .filter((category) => category.members.length > 0),
    [members],
  );

  return (
    <>
      <div className="team-directory">
        {groupedMembers.map((group, groupIndex) => (
          <section key={group.key} className="team-group">
            <Reveal variant="up" delayMs={groupIndex * 50}>
              <div className="team-group-header">
                <p className="eyebrow">{group.title}</p>
                <h2>{group.summary}</h2>
              </div>
            </Reveal>

            <div className="team-grid">
              {group.members.map((member, index) => (
                <Reveal key={member.id} variant="up" delayMs={index * 45}>
                  <article className="team-card">
                    <div className="team-card-media" style={{ backgroundImage: `url(${member.imageUrl})` }}>
                      <div className="team-card-overlay" />
                      <div className="team-card-content">
                        <div className="team-card-copy">
                          <p className="team-card-role">{member.role}</p>
                          <h3>{member.name}</h3>
                          <p className="team-card-summary">{member.shortBio}</p>
                        </div>
                        <button
                          type="button"
                          className="team-card-plus"
                          aria-label={`Open profile for ${member.name}`}
                          onClick={() => setSelectedMember(member)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selectedMember ? (
        <div className="team-modal-backdrop" role="presentation" onClick={() => setSelectedMember(null)}>
          <div
            className="team-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="team-modal-close"
              aria-label="Close team profile"
              onClick={() => setSelectedMember(null)}
            >
              ×
            </button>

            <div className="team-modal-copy">
              <p className="eyebrow">Team Profile</p>
              <h2 id="team-modal-title">{selectedMember.name}</h2>
              <p className="team-modal-meta">
                <span>{selectedMember.role}</span>
                {selectedMember.qualifications ? <span>{selectedMember.qualifications}</span> : null}
              </p>
              <p className="team-modal-lead">{selectedMember.shortBio}</p>
              <p className="team-modal-body">{selectedMember.bio}</p>
            </div>

            <div className="team-modal-media">
              <div className="team-modal-image" style={{ backgroundImage: `url(${selectedMember.imageUrl})` }} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
