import { createClient } from "next-sanity";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "../env";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
});

type SanityFetchOptions = {
  cache?: "no-store";
  perspective?: "published";
};

export async function safeSanityFetch<T>(query: string, params?: Record<string, unknown>, fallback?: T, options?: SanityFetchOptions) {
  try {
    if (options) {
      return await sanityClient.fetch<T>(query, params || {}, options);
    }

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
