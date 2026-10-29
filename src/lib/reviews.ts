export type ClientReview = {
  _id: string;
  reviewerName: string;
  text: string;
  rating?: number;
  source?: string;
  reviewDate?: string;
  active?: boolean;
  featured?: boolean;
};

export function visibleReviews(reviews: ClientReview[]): ClientReview[] {
  return reviews.filter((review) => !review._id.startsWith("drafts.") && review.active === true
    && typeof review.reviewerName === "string" && review.reviewerName.trim()
    && typeof review.text === "string" && review.text.trim());
}

export function homepageReviews(reviews: ClientReview[]): ClientReview[] {
  const visible = visibleReviews(reviews);
  return [...visible.filter((review) => review.featured), ...visible.filter((review) => !review.featured)].slice(0, 3);
}
