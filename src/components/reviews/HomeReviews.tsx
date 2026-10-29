import Link from "next/link";
import { homepageReviews, type ClientReview } from "@/lib/reviews";
import { ReviewCarousel } from "./ReviewCarousel";
import styles from "./Reviews.module.css";

export function HomeReviews({ reviews }: { reviews: ClientReview[] }) {
  const selected = homepageReviews(reviews);
  if (!selected.length) return null;

  return <section className={styles.section} aria-labelledby="home-reviews-title">
    <div className={styles.heading}>
      <div><p className="eyebrow">From our clients</p><h2 id="home-reviews-title">Kind words from our community.</h2><p>Experiences shared by the people who trust us with their pets.</p></div>
      <Link className={styles.allLink} href="/reviews">Read all reviews <span aria-hidden="true">&rarr;</span></Link>
    </div>
    <ReviewCarousel key={selected.map(review => review._id).join(",")} reviews={selected} />
  </section>;
}
