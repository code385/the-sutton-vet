# The Sutton Vet: Go-Live and Handover Guide

Prepared 12 November 2026. Intended opening announcement: February 2027.

## Accounts and ownership

Website preview: https://the-sutton-vet.vercel.app

Client Sanity Studio: https://the-sutton-vet-client.sanity.studio/

Sanity project: `o17zk9fa`. Dataset: `production`.

Current source repository: https://github.com/code385/the-sutton-vet

The client should own the production GitHub repository, Vercel project, domain,
Sanity project, Lupa, Resend and Upstash accounts. Temporary developer access can
be removed after the handover checks pass. Do not share account passwords.

For GitHub handover, create an empty private repository without an initial README,
licence or gitignore, invite `code385` with write access, and send its URL. The
source and history can then be pushed there. A source ZIP is an alternative;
it must exclude `.env*` secrets, `node_modules`, `.next`, `.git`, `.vercel` and local
exports/backups. `.env.example`, if present, contains names/placeholders only.

For Vercel, invite the developer's confirmed Vercel account email to the client's
team with sufficient project/deployment access. Do not assume their GitHub or
Sanity email is also their Vercel email. Check the plan's collaboration and
commercial-use eligibility before selecting a plan. Account invitations,
ownership transfer and production domain access still require the client.

## Coming-soon mode

1. Open Sanity Studio and sign in to the client project.
2. Open **Site Settings**, then **Website Launch / Coming Soon**.
3. Choose **Coming Soon - registration only navigation** under **Website Mode**.
4. Edit **Opening Announcement**, **Landing Page Heading** and description as needed.
5. Optionally upload **Landing Page Photo** and enter its description.
6. Click **Publish**. Reload the public website to check the result.

This displays a temporary homepage with Register Now, contact routes and essential
legal links. It hides the main menus, Book Online and the chatbot. The TikTok
section remains on the full homepage, not on the coming-soon page.

This is a presentation mode, not access control: existing direct URLs, including
`/book`, other content pages and API endpoints remain available. There is no
automatic calendar-based launch. If bookings must actually be disabled, obtain
approval for a separate server-side booking shutdown before launch.

## Enable the full website

1. Finish reviewing page copy, prices, photos, policies and company disclosures.
2. Complete the registration/booking and domain checks below.
3. In **Site Settings > Website Launch / Coming Soon**, select **Full Website**.
4. Click **Publish** and reload the homepage in a fresh browser tab.
5. Verify the full homepage, navigation, Book Online, reviews and TikTok section.

No code deployment is required for this switch. To roll back, select Coming Soon
and publish again. Existing full-site content is retained in Sanity.

## Footer and company information

In **Site Settings**, edit Phone, Email, Address, Footer Tagline, Social Links and
Legal Links. Under **Registered Company Details**, enter the confirmed registered
company name, company number, registered office, registration jurisdiction and VAT
number where applicable. These company fields appear in both footer modes after
publishing. Blank fields do not display placeholder numbers.

The client has confirmed that The Sutton Vet is a trading name of Vet ER LTD.
Other registration/VAT details must be supplied and checked by the company or its
adviser; previously seeded values are not treated as verified legal disclosures.
The older **Footer Compliance Lines** field is retained for backwards compatibility
but is not rendered. Use **Registered Company Details** for the visible disclosures.

For an extra policy page, create a **Legal Page**, choose **Additional Compliance
Page**, set its slug and content, and publish. Add its label and `/legal/your-slug`
to **Site Settings > Legal Links**, then publish Site Settings. Review legal and
clinic-specific requirements with the appropriate adviser before launch.

## TikTok feed

The official creator-profile embed is near the bottom of the full homepage,
after client reviews and before the footer. In **Site Settings > Homepage TikTok
Feed**, edit the username, section heading/description or turn **Show TikTok Feed**
off, then publish. The configured account is `the.sutton.vet`.

Visitors must allow **External media** in Cookie settings before TikTok loads.
Revoking permission removes the embedded browsing context. A direct TikTok profile
link remains available when consent is denied or TikTok is unavailable. The
account must be public and eligible for embedding; its video selection and
availability are controlled by TikTok, not by Sanity. No TikTok API token is needed.

## Replace stock photos with real clinic photos

Upload only approved photos with the necessary permission from anyone pictured.
Do not upload clinical records or other private patient documents into the public
Sanity image dataset.

1. Choose the relevant document: **Home Page**, **About Page**, **Team Page**,
   **Pricing Page**, **Health Plan Page**, **Service**, **Team Member** or **Careers Page**.
2. Use its photo/image upload field, such as **Hero Photo Upload** or **Image**.
3. Upload the new photo, review the crop and supply alt text where that field exists.
4. Click **Publish**, reload the relevant page and check it on mobile and desktop.

Uploads take priority over existing fallback image URLs. Removing an upload returns
to the existing URL/fallback photo. Some schema fields belong to optional or legacy
sections; editing an unused section will not add it to the current page layout.
The launch-page photo is edited separately in Site Settings. Footer organisation
logo artwork is static in `public/images/footer/`, not a Sanity photo field.

## Connect the production domain safely

1. Confirm which domain should be canonical, and who manages its DNS.
2. Deploy the reviewed code to the client's intended Vercel project and verify the
   correct GitHub repository and production branch are connected.
3. In that project, open **Settings > Domains**, add the apex and `www` names, and
   follow the verification instructions shown for that specific project.
4. At the DNS provider, back up the current zone and change only the website records
   Vercel asks for. Use the exact current A/CNAME/TXT values from Vercel, not old
   values copied from another project. Do not change nameservers unless a full DNS
   migration is explicitly planned.
5. Preserve email MX records, SPF, DKIM, DMARC, Resend verification and other service
   records. Website domain changes must not interrupt the clinic's email.
6. Wait for Vercel's valid configuration and HTTPS certificate. Check both hostnames
   and configure the non-canonical hostname to redirect to the chosen domain.
7. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and redeploy. Review any
   hardcoded site URLs in metadata/structured data when the canonical domain is
   confirmed; the current structured-data URL is `https://thesuttonvet.co.uk`.
8. Check homepage, registration, legal links, mobile layout, email and booking.
   Retain the previous website/DNS settings until these checks pass.

Official domain instructions:
https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Deployment and secrets

Use Node.js 24 LTS (this repository requires at least 22.12). For a new checkout:

```powershell
npm ci
npm run build
```

Push to the connected production branch and wait for a successful Vercel production
deployment. Changing saved environment variables requires a new deployment; saving
them alone does not update an already-running deployment.

Configure Lupa, Resend, booking-session authentication, Upstash and Sanity environment
variables privately in the target Vercel project. Copy approved values through a
secure channel, never into GitHub, screenshots or this guide. Write/API tokens must
not have a `NEXT_PUBLIC_` prefix. Check the environment scope is Production.

The old local `.vercel` project link may refer to a different project. Verify the
target before any Vercel CLI deployment. Do not deploy blindly from that link.

For schema or Studio code changes, sign in with an authorised Sanity user, verify
`sanity.cli.ts` targets `o17zk9fa` / `production` and app
`kjib8tob6mnlrjuxt8znqxx8`, then run:

```powershell
npx sanity deploy
```

Normal content edits need only **Publish**, not a Studio redeploy. Do not run
`seed:cms` against edited production content: its create-or-replace operations can
overwrite client changes. Never import an old dataset over production without a
reviewed backup/migration plan.

## Handover acceptance checks

- Client owns/accesses the intended GitHub, Vercel, DNS and Sanity projects.
- Company details and policy wording have been supplied and approved.
- Coming-soon mode shows February 2027 and working Register Now links.
- Registration works for one and multiple pets and records reach the right Lupa practice.
- Email verification, pet lookup, available slots and appointment requests work.
- Appointment durations are configured in Lupa; the website reads them. Practice
  approval is still needed for appointment requests to become confirmed bookings.
- A practice staff member confirms the test request in Lupa. Remove test data using
  the practice's approved process, not by creating more duplicate registrations.
- Real clinical-note **file uploads are not implemented**. Registration supports
  clinical-note text. Any proposed email-attachment workflow still needs the clinic's
  approved recipient, delivery consent, size limits and failure handling.
- Test TikTok with external-media consent allowed, denied and later revoked.
- Check real photo replacements, legal links and the launch-mode switch.
- Confirm phone, email and WhatsApp routes, including `+447440278373`.
- Check the final domain, HTTPS, redirects and continued email delivery.
- Record any open items and rotate/revoke temporary credentials after handover.

## Pending client input

The client repository URL, Vercel invitation, production DNS access, confirmed company
registration/VAT information, approved real photos and a decision on whether direct
booking access should be disabled are still required where not already provided.
No partnership links are added by this change; those can wait until agreements exist.
