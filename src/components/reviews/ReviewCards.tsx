import type { ClientReview } from "@/lib/reviews";
import styles from "./Reviews.module.css";

export function ReviewCards({ reviews, compact = false }: { reviews: ClientReview[]; compact?: boolean }) {
  return <div className={`${styles.grid} ${compact ? styles.compact : ""}`}>
    {reviews.map((review) => {
      const rating = Number.isInteger(review.rating) && review.rating! >= 1 && review.rating! <= 5 ? review.rating : undefined;
      const date = review.reviewDate && /^\d{4}-\d{2}-\d{2}$/.test(review.reviewDate)
        ? new Date(`${review.reviewDate}T12:00:00Z`) : null;
      const initials = review.reviewerName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
      return <figure className={styles.card} key={review._id}>
        <div className={styles.cardTop}>
          <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
          {rating !== undefined && <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => <svg key={index} viewBox="0 0 24 24" aria-hidden="true" fill={index < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2L12 17.3l-5.7 2.9 1.1-6.2L2.9 9.6l6.3-.9Z" /></svg>)}
          </span>}
        </div>
        <blockquote className={styles.text}>{review.text}</blockquote>
        <figcaption className={styles.attribution}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <div><strong>{review.reviewerName}</strong>
            {review.source?.trim() && <span className={styles.source}>{review.source}</span>}
            {date && !Number.isNaN(date.getTime()) && <time className={styles.date} dateTime={review.reviewDate}>{date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Europe/London" })}</time>}
          </div>
        </figcaption>
      </figure>;
    })}
  </div>;
}
