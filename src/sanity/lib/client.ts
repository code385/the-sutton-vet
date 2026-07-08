import { createClient } from "next-sanity";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "../env";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
});

export async function safeSanityFetch<T>(query: string, params?: Record<string, unknown>, fallback?: T) {
  try {
    if (params) {
      return await sanityClient.fetch<T>(query, params);
    }

    return await sanityClient.fetch<T>(query);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[sanity] fetch failed, using fallback data: ${message}`);

    if (typeof fallback !== "undefined") {
      return fallback;
    }

    return null as T;
  }
}
