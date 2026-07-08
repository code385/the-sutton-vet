"use client";

import { useEffect, useRef, useState } from "react";
import { homeHighlights, homeMedia } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";

type HomeWhyChooseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  secondaryText?: string;
  imageUrl?: string;
  mediaTitle?: string;
  mediaDescription?: string;
  pills?: string[];
  cards?: { title?: string; description?: string }[];
};

export function HomeWhyChoose({
  eyebrow,
  title,
  description,
  secondaryText,
  imageUrl,
  mediaTitle,
  mediaDescription,
  pills,
  cards,
}: HomeWhyChooseProps) {
  const whyChooseCards = cards?.filter((item) => item.title && item.description) || homeHighlights;
  const whyChoosePills = pills?.filter(Boolean).length ? pills.filter(Boolean) : ["Local ownership", "Clear pricing cues", "Modern facilities"];
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [showPoints, setShowPoints] = useState(false);
  const [activePoint, setActivePoint] = useState(0);

  useEffect(() => {
    if (!showPoints || whyChooseCards.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActivePoint((current) => (current + 1) % whyChooseCards.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [showPoints, whyChooseCards.length]);

  useEffect(() => {
    const node = mediaRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPoints(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-choose-section section-surface">
      <div className="why-choose-intro split-feature">
        <Reveal variant="left">
          <div className="why-choose-copy split-copy">
            <div className="section-heading">
              <p className="eyebrow">{eyebrow || "Why Choose The Sutton Vet"}</p>
              <h2>
                {title || "Independent, transparent, and reassuring from day one."}
              </h2>
            </div>
            <p>{description || "Local ownership, practical pricing clarity, and compassionate evidence-based care should all feel clear within seconds."}</p>
            <p>{secondaryText || "The aim is to make new clients in Sutton feel informed, calmer, and more confident before they even get in touch."}</p>
            <div className="services-copy-points why-choose-points">
              {whyChoosePills.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variant="mask">
          <div ref={mediaRef} className="section-media-card why-choose-media">
            <div className="section-media-image" style={{ backgroundImage: `url(${imageUrl || homeMedia.whyChooseImage})` }} />
            <div className="section-media-overlay" />
            <div className="section-media-caption why-choose-media-caption">
              <div className="why-choose-media-header">
                <span>{mediaTitle || "Modern facilities"}</span>
                <div className="why-choose-progress" aria-hidden="true">
                  {whyChooseCards.map((item, index) => (
                    <span
                      key={item.title}
                      className={`why-choose-progress-dot${showPoints && index === activePoint ? " is-active" : ""}`}
                    />
                  ))}
                </div>
              </div>
              <strong>{mediaDescription || "Calmer, clearer clinical surroundings help first visits feel less overwhelming."}</strong>
              <div className="why-choose-media-points">
                {whyChooseCards.map((item, index) => (
                  <div
                    key={item.title}
                    className={`why-choose-media-point${showPoints ? " is-visible" : ""}${showPoints && index === activePoint ? " is-active" : ""}`}
                    style={{ transitionDelay: `${index * 180}ms` }}
                  >
                    <p>{item.title}</p>
                    <small>{item.description}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
