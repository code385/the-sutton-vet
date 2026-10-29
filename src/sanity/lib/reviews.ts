import { cache } from "react";
import { connection } from "next/server";
import { groq } from "next-sanity";
import { safeSanityFetch } from "./client";
import { visibleReviews, type ClientReview } from "@/lib/reviews";

export const getClientReviews = cache(async (): Promise<ClientReview[]> => {
  await connection();
  const reviews = await safeSanityFetch<ClientReview[]>(groq`
    *[_type == "clientReview" && active == true && !(_id in path("drafts.**"))]
      | order(coalesce(displayOrder, 10) asc, reviewDate desc, _createdAt desc, _id asc) {
        _id, reviewerName, text, rating, source, reviewDate, active, featured
      }
  `, {}, [], { cache: "no-store", perspective: "published" });
  return visibleReviews(reviews);
});
