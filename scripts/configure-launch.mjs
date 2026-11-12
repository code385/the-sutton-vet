import env from "@next/env";
import { createClient } from "@sanity/client";

env.loadEnvConfig(process.cwd());
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
if (projectId !== "o17zk9fa" || dataset !== "production") throw new Error("Refusing to configure any project other than the client's o17zk9fa / production.");
if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error("SANITY_API_WRITE_TOKEN is required; do not pass it as a command-line argument.");

const client = createClient({projectId,dataset,apiVersion:"2025-01-01",token:process.env.SANITY_API_WRITE_TOKEN,useCdn:false});
const documents = await client.fetch('*[_id in ["siteSettings", "drafts.siteSettings"]]{_id,_rev,launchSettings,companyDetails,tiktokFeed}');
if (!documents.some(doc => doc._id === "siteSettings")) throw new Error("Published Site Settings not found.");
const defaults = {
  launchSettings: {mode:"comingSoon",openingLabel:"Coming Soon in February 2027",title:"A new home for local pet care.",description:"Independent, family-owned veterinary care is coming to Hackbridge, Sutton. Register you and your pets ahead of opening and become part of our local community."},
  companyDetails: {registeredName:"Vet ER LTD"},
  tiktokFeed: {enabled:true,username:"the.sutton.vet"},
};
const changes = documents.map(doc => ({id:doc._id,fields:Object.keys(defaults).filter(key => doc[key] == null)}));
console.log(JSON.stringify({projectId,dataset,apply:process.argv.includes("--apply"),changes},null,2));
if (!process.argv.includes("--apply")) {
  console.log("Dry run only. Add --apply to initialise missing launch fields without replacing content.");
} else {
  let transaction = client.transaction();
  let writes = 0;
  for (const doc of documents) {
    const fields = Object.fromEntries(Object.entries(defaults).filter(([key]) => doc[key] == null));
    if (!Object.keys(fields).length) continue;
    // Check the revision so concurrent client edits never get silently replaced.
    transaction = transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields));
    writes++;
  }
  if (writes) await transaction.commit();
  const published = await client.getDocument("siteSettings");
  console.log(JSON.stringify({configuredDocuments:writes,publishedMode:published.launchSettings?.mode,tiktokEnabled:published.tiktokFeed?.enabled},null,2));
}
