import Link from "next/link";
import type { Metadata } from "next";
import { getClientReviews } from "@/sanity/lib/reviews";
import { ReviewCards } from "@/components/reviews/ReviewCards";
import styles from "@/components/reviews/Reviews.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const reviews = await getClientReviews();
  return { title: "Client Reviews | The Sutton Vet", description: "Read experiences shared by clients of The Sutton Vet.", ...(reviews.length ? {} : { robots: { index: false, follow: true } }) };
}

export default async function ReviewsPage() {
  const reviews = await getClientReviews();
  return <section className={styles.section} aria-labelledby="reviews-title">
    <div className={styles.heading}>
      <div><p className="eyebrow">Our community</p><h1 id="reviews-title">Little stories. Much-loved pets.</h1><p>Client reviews of The Sutton Vet.</p></div>
      <Link className={styles.allLink} href="/contact">Talk to our team <span aria-hidden="true">&rarr;</span></Link>
    </div>
    {reviews.length ? <ReviewCards reviews={reviews} /> : <div className={styles.empty}><p>There are no reviews to share just yet. If you have a question about the practice, our team is happy to help.</p><Link className={styles.allLink} href="/">Back to home</Link></div>}
  </section>;
}
