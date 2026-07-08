# Sutton Vet Web

Initial Next.js foundation for `The Sutton Vet`.

## Current Status

- branded homepage shell created
- reusable landing-page sections added
- env placeholders prepared
- Sanity Studio route scaffolded
- ready for Git repo connection
- ready for Sanity integration once account/project is created

## Next Steps

1. Run `npm install`
2. Run `npm run dev`
3. Connect Git remote
4. Copy `.env.example` to `.env.local`
5. Create Sanity project and add env vars
5. Replace placeholder content with CMS-driven data

## Planned Integration Areas

- site settings
- services
- team
- fees
- health plan
- FAQs
- legal pages
- emergency settings
- studio available at `/studio`

## Sanity To Vercel Live Updates

Sanity publish can now trigger page-wise Vercel revalidation.

### 1. Add the secret to Vercel

Set this environment variable in Vercel for Production (and Preview if needed):

- `SANITY_REVALIDATE_SECRET`

Use a long random value and keep it private.

### 2. Add the same secret locally if needed

In `.env.local`:

- `SANITY_REVALIDATE_SECRET=your-long-random-secret`

### 3. Create a Sanity webhook

In the Sanity project dashboard, create a webhook with:

- URL: `https://your-domain.com/api/revalidate?secret=your-long-random-secret`
- Method: `POST`
- Trigger on: `Create`, `Update`, `Delete`

Suggested Sanity webhook projection:

```json
{
  "_type": _type,
  "slug": slug.current,
  "pageType": pageType
}
```

### 4. What gets revalidated

- `homePage` -> `/`
- `servicesPage`, `service` -> `/services`, `/`
- `teamPage`, `teamMember` -> `/meet-the-team`, `/`
- `pricingPage`, `feeCategory` -> `/fees`, `/health-plan`
- `healthPlan` -> `/health-plan`, `/fees`, `/`
- `firstVisitPage` -> `/first-visit`, `/`
- `faqPage`, `faq` -> `/faq`, `/health-plan`, `/`
- `blogPage` -> `/blog`, `/`
- `blogPost` -> `/blog`, `/blog/[slug]`, `/`
- `contactPage` -> `/contact`, `/`
- `legalPage` -> matching legal route
- `siteSettings`, `emergencySettings` -> full site routes

### 5. Notes

- The Sanity client now uses fresh content mode (`useCdn: false`) so published changes are picked up immediately after revalidation.
- You can also test manually:

```bash
https://your-domain.com/api/revalidate?secret=your-long-random-secret
```
