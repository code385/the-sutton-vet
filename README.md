# The Sutton Vet Website

Production-ready Next.js website for The Sutton Vet. Sanity manages website content, Vercel handles deployments, and Lupa PMS integration is prepared behind secure server routes.

## Current Status

- Responsive website, services, service galleries, pricing/quote messaging, Careers, legal pages, and chatbot are implemented.
- Sanity Studio is available at `/studio`.
- The chatbot answers approved administrative questions only and never gives clinical advice.
- Lupa registration has been verified against the Sutton production API. Booking remains unavailable until Lupa returns active appointment types and available slots for the Sutton store.
- Lupa Pay is not part of this project.
- Health Plan is informational and editable in Sanity until its provider and sign-up flow are confirmed.
- Public booking/registration URLs are separate from API credentials and must be supplied by Lupa.

## Requirements

- Node.js 22.12.0 or newer
- npm and Git
- Access to the client-owned GitHub, Vercel, and Sanity accounts

## Local Development

```bash
git clone https://github.com/code385/the-sutton-vet.git
cd the-sutton-vet
npm install
```

Copy `.env.example` to `.env.local`, add the required values, then:

```bash
npm run dev
```

Open `http://localhost:3000` for the website and `http://localhost:3000/studio` for Studio.

For a ZIP handover, extract it on the client computer and run the same `npm install` and `npm run dev` commands. Do not copy `.next` or `node_modules` between computers.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run seed:cms
npm run migrate:cms-extensions
npx sanity deploy
```

`npm run seed:cms` creates or replaces known seeded documents. Use it for initial migration only because matching CMS document IDs can be overwritten.

`npm run migrate:cms-extensions` is the safer incremental migration for Careers, About, service-directory records, concise homepage copy, and quote-first pricing. It does not delete documents.

## Environment Variables

Copy `.env.example` to `.env.local`. In Vercel, add values under Project Settings > Environment Variables and select Production, Preview, or Development deliberately.

### Sanity

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: client-owned Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET`: normally `production` or `staging`.
- `SANITY_PROJECT_ID` and `SANITY_DATASET`: server/CLI values.
- `SANITY_API_READ_TOKEN`: optional private read token.
- `SANITY_API_WRITE_TOKEN`: temporary controlled migration/seed token.
- `SANITY_REVALIDATE_SECRET`: long private value shared with the webhook.

Never expose read/write tokens with a `NEXT_PUBLIC_` prefix.

### Lupa

- `LUPA_API_BASE_URL`: sandbox is `https://api.dev.lupapets.com/api/external`.
- `LUPA_API_KEY`: server-only API key.
- `LUPA_COMPANY_ID`: company scope supplied by Lupa.
- `LUPA_STORE_ID`: Sutton practice/store scope supplied by Lupa.
- `LUPA_DIAGNOSTICS_KEY`: temporary password protecting diagnostics.
- `LUPA_PAY_ENABLED`: keep `false`.
- `LUPA_HEALTH_PLAN_ENABLED`: keep `false` until supported and approved.
- `NEXT_PUBLIC_LUPA_BOOKING_URL`: public booking URL from Lupa.
- `NEXT_PUBLIC_LUPA_REGISTRATION_URL`: public registration URL from Lupa.
- `NEXT_PUBLIC_LUPA_HEALTHPLAN_URL`: optional public Health Plan URL.
- `NEXT_PUBLIC_LUPA_CLIENT_PORTAL_URL`: secure Lupa login/portal URL for existing clients. The external API does not provide login, OTP, or session endpoints.

The `NEXT_PUBLIC_PMS_*` variables are legacy fallbacks. Prefer `NEXT_PUBLIC_LUPA_*`.

## Sanity Setup and Ownership

1. Create a Sanity project in the client's account.
2. Create `production`; also create `staging` for safer future work.
3. Replace project and dataset values locally and in Vercel.
4. Add the client and approved developers as project members.
5. Add CORS origins for localhost, Vercel Preview, and production.
6. Run `npx sanity login`.
7. Run `npm run seed:cms` once if migrating the supplied content.
8. Review all content, then run `npx sanity deploy`.
9. Keep a dataset export before bulk migrations.

Editable content includes Site Settings/chat replies, Home, About, Contact, Careers, service directory groups, service detail pages/subservices/galleries, pricing/quotes, Health Plan, team, emergency details, and legal pages. Forms, API payloads, validation, layout, and navigation behaviour remain code-controlled for reliability.

### Live Content Updates

Create a Sanity webhook:

- URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
- Method: `POST`
- Events: Create, Update, Delete
- Projection:

```json
{
  "_type": _type,
  "slug": slug.current,
  "pageType": pageType
}
```

Publishing revalidates the appropriate route, including `/services`, `/fees`, `/health-plan`, `/meet-the-team`, `/careers`, `/contact`, legal pages, and homepage.

## Vercel and Dev/Test Setup

1. Push the project to a repository owned by the client.
2. Import it into the client's Vercel account.
3. Keep Next.js preset and `npm run build`.
4. Add environment variables separately for Development, Preview, and Production.
5. Test a Vercel Preview deployment before connecting the live domain.
6. Use feature branches for future changes and merge to `main` after approval.
7. Redeploy after any `NEXT_PUBLIC_*` change because public values are embedded at build time.

Recommended environments:

- Local: Sanity `staging` + Lupa sandbox.
- Vercel Preview: Sanity `staging` + Lupa sandbox.
- Production: Sanity `production` + Lupa production credentials/URLs.

Never point Preview at production Lupa write endpoints.

## Lupa Integration

Lupa calls are server-side, so the key is not sent to the browser.

Implemented routes:

- `GET /api/lupa/status`
- `GET /api/lupa/services`
- `GET /api/lupa/appointment-types`
- `GET /api/lupa/available-slots`
- `POST /api/lupa/registration`
- `POST /api/lupa/booking`
- `GET /api/lupa/health-plans`
- `GET /api/lupa/diagnostics`

Diagnostics performs read-only checks and lists configured write calls without creating records. Protect it with `LUPA_DIAGNOSTICS_KEY`, use it only for support verification, then remove that variable.

Before live Lupa activation, obtain:

1. Confirmation that the key belongs to Sutton, not the shared Paddington sandbox.
2. Correct sandbox and production API base URLs.
3. Company/store IDs for each environment.
4. Permissions for services, appointment types, slots, clients, pets, and booking requests.
5. Approved test payloads and end-to-end test procedure.
6. Public booking and registration URLs if Lupa expects hosted redirects.
7. A hosted client-portal/login URL for existing clients; do not build login from the server API key.

A Vercel HTTP `200` only means the website endpoint responded. Check the JSON `status` and `state`; an upstream `403` still means Lupa denied the request.

## Booking, Payments, and Health Plan

- Book/Register buttons use public Lupa URLs when configured.
- Without them, the temporary handover page and contact fallback remain.
- API booking should activate only after appointment types and slots are accessible and test writes are approved.
- Sutton currently needs active appointment types in Lupa before the website can request a valid slot and submit its required `visitTypeId`.
- The Lupa API accepts breed as text and does not expose a breed catalogue. The website therefore uses a controlled common-breed list with `Unknown` and `Other` fallbacks.
- Do not enable Lupa Pay.
- Keep Health Plan informational in Sanity until an approved provider/API or hosted URL exists.
- Services can be listed without prices; use quote messaging where assessment affects cost.

## Chatbot

Chat replies live under **Site Settings > Chat Settings** in Sanity. Current topics are services, hours, location, pricing, Health Plan, Careers, registration/booking, contact, and payments.

Emergency wording always tells visitors to call. Never add diagnosis, dosage, treatment, or triage advice.

## Careers

The Careers page has two content areas in Sanity:

1. Open **Careers Page** to edit the page heading, introduction, hero image, labels, and application-panel copy.
2. Create a **Job Vacancy** record for each role.
3. Complete Job Title, Location, Hours / Employment Type, Salary, Summary, Benefits, application email, and optional deadline.
4. Keep **Show On Careers Page** enabled, set Display Order, and publish.
5. The vacancy appears automatically on `/careers`. Disable the toggle or unpublish the record to remove it.

Salary and at least one benefit are required before a vacancy can be published. Existing legacy vacancies remain readable, but all new roles should use standalone **Job Vacancy** records.

## Routine Content Editing

- **Site Settings**: navigation, contact details, opening hours, social links, chatbot replies, booking/registration links.
- **Home Page / About Page / Contact Page / Team Page / Careers Page**: page-specific headings, text, images, and section labels.
- **Service Directory Group**: the six main service areas, their descriptions, visible service list, order, and linked detail page.
- **Service**: detail-page title, description, image, subservices, clinical galleries, CTA, and order.
- **Pricing Page / Fee Category**: quote messaging, service categories, individual items, and confirmed prices when approved.
- **Health Plan**: informational copy and plan details.
- **Legal Page / Emergency Settings**: compliance and emergency content.

Publish changes in Studio. With the revalidation webhook configured, the relevant live route refreshes automatically; otherwise trigger a Vercel redeploy.

## Go-Live Checklist

1. Move the repository to the client's GitHub account.
2. Verify install, local dev, and production build on the client computer.
3. Create client-owned Sanity datasets and migrate/review content.
4. Deploy Studio; configure CORS and webhook.
5. Import into client Vercel and configure scoped environment variables.
6. Test every Preview route on desktop and mobile.
7. Confirm services, Careers, hours, contact, emergency and legal copy.
8. Confirm domain/DNS, cookie consent, analytics, and email links.
9. Keep Lupa sandbox-only until permissions pass.
10. Add production Lupa values only after written confirmation.
11. Deploy and complete booking, registration, contact, CMS, and mobile smoke tests.
12. Remove diagnostics access and rotate temporary credentials.

## Cookie consent

- Consent is stored in the browser for 180 days with a version number, saved date, expiry date, and separate choices for analytics and external media.
- Optional categories default to off. Accept all, Reject optional, and Manage settings remain equally accessible from the consent panel.
- Google Maps, YouTube, and similar third-party embeds must use the consent-managed wrapper and stay blocked until external-media consent is granted. Direct map and media links should remain available without consent.
- Analytics is not currently active. Any future analytics or tag-manager script must load only after analytics consent and must respect later withdrawal.
- Visitors can reopen the panel from the persistent Cookie settings control in the footer. Update the Cookie Policy inventory whenever a vendor or cookie changes.

## Security

- Never commit `.env.local`, API keys, tokens, passwords, or diagnostics links.
- Keep Lupa keys server-side and use least-privilege Sanity tokens.
- Rotate any credentials shared during setup.
- Review dependency upgrades in Preview before Production.

## Troubleshooting

- Sanity changes not live: check publish state, webhook delivery, secret, and Vercel logs.
- Studio cannot connect: check project ID, dataset, membership, and CORS.
- Lupa `403`: verify environment, key scope, company ID, store ID, and endpoint permissions.
- Buttons open temporary page: add public Lupa URLs and redeploy.
- Vercel uses old public URLs: redeploy after changing `NEXT_PUBLIC_*`.
- Local install fails: verify Node 22.12.0+ and run `npm install`.
