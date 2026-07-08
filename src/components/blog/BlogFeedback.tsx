"use client";

import Link from "next/link";
import { useState } from "react";

type BlogFeedbackProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  helperLabel?: string;
  helperHref?: string;
  helpfulLabel?: string;
  moreLabel?: string;
  contactLabel?: string;
  helpfulResponse?: string;
  moreResponse?: string;
  contactResponse?: string;
  browseMoreLabel?: string;
  browseMoreHref?: string;
  askDirectLabel?: string;
  askDirectHref?: string;
};

export function BlogFeedback({
  eyebrow = "Article feedback",
  title = "Was this article useful?",
  description = "Quick feedback helps shape which advice should be clearer, shorter, or surfaced earlier across the site.",
  helperLabel = "Contact the practice",
  helperHref = "/contact",
  helpfulLabel = "Helpful",
  moreLabel = "Need more detail",
  contactLabel = "I need to speak to someone",
  helpfulResponse = "Thanks. This signals that the article answered the question clearly.",
  moreResponse = "Thanks. This helps highlight where future advice needs more practical detail.",
  contactResponse = "Thanks. If the issue feels urgent or specific to your pet, direct contact is the safer next step.",
  browseMoreLabel = "Browse more advice",
  browseMoreHref = "/blog",
  askDirectLabel = "Ask the team directly",
  askDirectHref = "/contact",
}: BlogFeedbackProps) {
  const [answer, setAnswer] = useState<"helpful" | "more" | "contact" | null>(null);

  return (
    <section className="blog-feedback-card">
      <div className="blog-feedback-intro">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="blog-feedback-note">
          <span>Need practical help now?</span>
          <Link className="text-link" href={helperHref}>
            {helperLabel}
          </Link>
        </div>
      </div>

      <div className="blog-feedback-actions">
        <button
          type="button"
          className={`button button-muted${answer === "helpful" ? " is-selected" : ""}`}
          onClick={() => setAnswer("helpful")}
        >
          {helpfulLabel}
        </button>
        <button
          type="button"
          className={`button button-muted${answer === "more" ? " is-selected" : ""}`}
          onClick={() => setAnswer("more")}
        >
          {moreLabel}
        </button>
        <button
          type="button"
          className={`button button-muted${answer === "contact" ? " is-selected" : ""}`}
          onClick={() => setAnswer("contact")}
        >
          {contactLabel}
        </button>
      </div>

      <div className="blog-feedback-links">
        <Link className="text-link" href={browseMoreHref}>
          {browseMoreLabel}
        </Link>
        <Link className="text-link" href={askDirectHref}>
          {askDirectLabel}
        </Link>
      </div>

      {answer ? (
        <p className="blog-feedback-response">
          {answer === "helpful"
            ? helpfulResponse
            : answer === "more"
              ? moreResponse
              : contactResponse}
        </p>
      ) : null}
    </section>
  );
}
