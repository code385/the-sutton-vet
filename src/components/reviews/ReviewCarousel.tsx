"use client";

import { useEffect, useRef, useState } from "react";
import type { ClientReview } from "@/lib/reviews";
import { ReviewCards } from "./ReviewCards";
import styles from "./Reviews.module.css";

export function ReviewCarousel({ reviews }: { reviews: ClientReview[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const multiple = reviews.length > 1;
  const rotating = multiple && !paused && !hovered && !focused && !reducedMotion && inView && pageVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % reviews.length), 3000);
    return () => window.clearInterval(timer);
  }, [rotating, reviews.length]);

  if (!reviews.length) return null;
  const activeIndex = index % reviews.length;
  function move(direction: number) {
    setPaused(true);
    setIndex((activeIndex + direction + reviews.length) % reviews.length);
  }

  return <div ref={root} className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Client reviews"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {multiple && <div className={styles.carouselControls}>
      <span className={styles.carouselCount}>Review {activeIndex + 1} of {reviews.length}</span>
      <div className={styles.carouselButtons}>
        {!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play review slideshow" : "Pause review slideshow"}>
          {paused ? "Play" : "Pause"}
        </button>}
        <button type="button" onClick={() => move(-1)} aria-label="Previous review">&larr;</button>
        <button type="button" onClick={() => move(1)} aria-label="Next review">&rarr;</button>
      </div>
    </div>}
    <div className={styles.carouselSlides} aria-live={rotating ? "off" : "polite"} aria-atomic="false">
      {reviews.map((review, slideIndex) => <div key={review._id} className={`${styles.slide} ${slideIndex === activeIndex ? styles.activeSlide : ""}`}
        role="group" aria-roledescription="slide" aria-label={`${slideIndex + 1} of ${reviews.length}`} aria-hidden={slideIndex !== activeIndex}>
        <ReviewCards reviews={[review]} compact />
      </div>)}
    </div>
  </div>;
}
