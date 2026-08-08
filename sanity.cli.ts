import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hoi7uq4a";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "the-sutton-vet",
  deployment: {
    appId: "n67zsfug3xsp3t31vwfzu35d",
  },
});


