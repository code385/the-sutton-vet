# The Sutton Vet: Website Setup Guide

## 1. Extract the ZIP

1. Download the supplied website ZIP to your computer.
2. Right-click it and select **Extract All**.
3. Extract it to a folder such as `C:\Projects\sutton-vet-web`.
4. Open the extracted folder. It should contain `package.json`, `package-lock.json`, `src`, `public`, `scripts`, and `.env.example`.
5. If there is another project folder inside, open that inner folder instead.

Run all commands below from the folder containing `package.json`, not from inside the ZIP preview. The commands use Windows PowerShell.

## 2. Install the Required Software

Install:

- [Node.js 24 LTS](https://nodejs.org/en/download), including npm.
- [Git](https://git-scm.com/downloads).
- [Visual Studio Code](https://code.visualstudio.com/) to open the project and terminal.

Restart your terminal after installation, then check:

~~~powershell
node --version
npm --version
git --version
~~~

Use Node 24 locally and Node 24.x in Vercel.

Open the extracted folder in VS Code, select **Terminal > New Terminal**, and enter the project folder if necessary:

~~~powershell
Set-Location C:\Projects\sutton-vet-web
~~~

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` and `npx.cmd` instead of `npx`.

## 3. Create Your Sanity Account and Project

1. Create or sign in to your account at [Sanity Manage](https://www.sanity.io/manage).
2. Create a project named **The Sutton Vet**.
3. Copy the project's **Project ID**.
4. Create a dataset named `production` with **public** visibility.
5. Invite any colleagues who need content-editing access.

Use your business account and enable two-factor authentication.

This website reads public website content from Sanity. Keep customer records, clinical information, passwords, and private files out of this dataset.

### Allow Local Access

In the Sanity project's API/CORS settings, add:

~~~text
http://localhost:3000
~~~

Enable credentials for this origin so that you can sign in to Studio. Enter the origin only, without `/studio`.

### Use the Included Schemas

The project already includes its schemas in [src/sanity/schemaTypes](src/sanity/schemaTypes). Do not create another Sanity starter or manually recreate the fields.

Studio runs inside this website at `/studio`. After completing the next steps, it will show the included schemas connected to your project.

**A separate `npx sanity deploy` command is not needed for this setup.** Deploying the website also deploys its embedded Studio.

## 4. Configure the Local Environment

From the project root, create your local configuration:

~~~powershell
Copy-Item .env.example .env.local
~~~

If `.env.local` already exists, edit it rather than overwriting it.

Open it and fill in all four Sanity settings:

~~~dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PROJECT_ID=YOUR_PROJECT_ID
SANITY_DATASET=production
~~~

Replace `YOUR_PROJECT_ID` with the ID from Sanity. Both project IDs must match, and both dataset names must match. Do not leave the project IDs blank.

Generate a random secret for the publishing webhook:

~~~powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
~~~

Add the generated value:

~~~dotenv
SANITY_REVALIDATE_SECRET=YOUR_GENERATED_SECRET
~~~

For the initial website setup, leave Lupa and Resend credentials blank. Configure them in their sections below.

Keep `.env.local` private. Do not commit it to GitHub or put secrets into variables beginning with `NEXT_PUBLIC_`. The example file contains comments explaining the remaining settings.

Restart the local server whenever you change environment variables.

## 5. Install Dependencies and Start the Website

Install the dependencies from the supplied lockfile:

~~~powershell
npm ci
~~~

This installs Next.js, React, Sanity, and the other project dependencies. You do not need to install them separately or globally.

Start the development server:

~~~powershell
npm run dev
~~~

Once the terminal says the server is ready, open:

- Website: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio
- Registration: http://localhost:3000/register
- Booking: http://localhost:3000/book

Sign in to Studio using the account you added to your Sanity project. A new dataset will initially be empty; populate it in the next step.

Keep the terminal open while using the local website. Press **Ctrl+C** to stop it. To run it again later, open the project folder and run `npm run dev`; reinstalling dependencies is not necessary unless they change.

If port 3000 is occupied:

~~~powershell
npm run dev -- --port 3001
~~~

Then use http://localhost:3001 and add that exact origin to Sanity CORS.

## 6. Add Content to Sanity

Choose **one** of the following options. The ZIP contains the schemas and local images, but content and uploaded assets stored in Sanity need to be imported or created.

### Prepare the Sanity CLI

Open a second terminal in the project folder:

~~~powershell
npx sanity login
~~~

Sign in with an account authorized to edit your project. Explicitly set the destination before running any content-writing command:

~~~powershell
$env:SANITY_PROJECT_ID="YOUR_PROJECT_ID"
$env:NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR_PROJECT_ID"
$env:SANITY_DATASET="production"
$env:NEXT_PUBLIC_SANITY_DATASET="production"
npx sanity dataset list
~~~

Confirm that the project ID and dataset are correct.

### Option A: Import a Supplied Content Backup

Use this if a Sanity export has been supplied with the website content and uploaded assets.

1. Keep the backup outside your Git repository, for example in `C:Backups`.
2. Confirm that your destination dataset is empty.
3. Import the archive:

~~~powershell
npx sanity dataset import "C:\Backups\sutton-content.tar.gz" production
~~~

4. Open `/studio` and check the imported documents and images.
5. Check the website too, including any images stored as external URLs.

Use the actual backup filename. The export should include image/file assets. Do not overwrite an already populated dataset without first backing it up.

### Option B: Create the Included Starter Content

If you are starting with an empty dataset and do not have a content backup:

~~~powershell
npm run seed:cms
~~~

Open Studio and review the resulting pages, services, careers, prices, contact information, and images.

**Run this only for initial setup on an empty dataset.** The seed replaces matching documents and removes predefined stale documents. Running it after content editing or after an import can overwrite your work.

No other migration or service-seeding command is required for this setup. For normal changes, edit and publish documents through Studio.

## 7. Check the Local Production Build

Stop the development server, then run:

~~~powershell
npm run build
npx tsc --noEmit
npm run start
~~~

Open http://localhost:3000 and check that the website runs. Stop it with **Ctrl+C** when finished.

Use `npm run dev` for normal local development; `npm run start` requires a completed build.

## 8. Create Your GitHub Repository

### Create an Empty Repository

1. Sign in to your own [GitHub account](https://github.com/).
2. Create a repository, for example `sutton-vet-web`.
3. Choose **Private**.
4. Do not initialize it with another README, licence, or .gitignore.
5. Copy its HTTPS repository URL.

Vercel can deploy from a private repository.

### Upload the Extracted Project

From a fresh extracted folder without Git history:

~~~powershell
git init -b main
git config user.name "YOUR NAME"
git config user.email "YOUR GITHUB EMAIL"
~~~

Check that private configuration and generated folders are ignored:

~~~powershell
git check-ignore .env .env.local .env.production.local node_modules .vercel
git status --short
~~~

Keep database/content backups outside the repository. Do not upload real API keys or environment files.

Stage the source and review the file list:

~~~powershell
git add .
git diff --cached --name-only
~~~

Confirm that only the intended source/configuration files are included, then run:

~~~powershell
git commit -m "Initial website setup"
git remote add origin https://github.com/YOUR_USERNAME/sutton-vet-web.git
git push -u origin main
~~~

Replace the URL with your new repository URL. Complete the GitHub browser sign-in if prompted.

If the folder is already a Git repository, inspect `git status` and `git remote -v` before proceeding instead of initializing it again.

## 9. Deploy on Vercel

### Import Your Repository

1. Create or sign in to your [Vercel account](https://vercel.com/).
2. Select **Add New > Project**.
3. Connect GitHub and grant access to your repository.
4. Import the repository.
5. Select the **Next.js** framework preset.
6. Set the root directory to the folder containing `package.json`, normally the repository root.
7. Select **Node.js 24.x**.
8. Set the install command to `npm ci` and the build command to `npm run build`.
9. Leave the output directory at the Next.js default.

Do not use a static export: the website needs its server/API routes.

### Add Production Environment Variables

Add the following under the project's environment-variable settings, selecting **Production**:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `SANITY_PROJECT_ID` | The same project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_DATASET` | `production` |
| `SANITY_REVALIDATE_SECRET` | The generated webhook secret |

Paste only the value into each value field, not `KEY=value`. Do not include enclosing quotes in Vercel value fields.

A Sanity write token is not required for normal website hosting or authenticated Studio editing.

### Deploy and Check

1. Click **Deploy** and wait for a successful build.
2. Open your assigned `https://YOUR_PROJECT.vercel.app` address.
3. Add that exact origin to Sanity CORS, with credentials enabled.
4. Open `/studio`, sign in, and verify your documents.
5. Check the website on desktop and mobile.

After changing Vercel environment variables, redeploy so that the new values are used. Configure Preview separately in section 14.

## 10. Connect Your Domain

1. In Vercel, open **Project Settings > Domains**.
2. Add your domain, for example `thesuttonvet.co.uk`.
3. Add `www.thesuttonvet.co.uk` if you want both addresses.
4. Choose which address should be primary and redirect the other to it.
5. Open your domain's DNS-provider dashboard.
6. Add the exact A/CNAME/verification records shown by your Vercel project.
7. Wait for Vercel to verify the domain and enable HTTPS.
8. Test both addresses.

Keep existing email DNS records, including MX, SPF, DKIM, and DMARC. Connecting the website must not replace the records used by your clinic's mailbox.

Add your final website origins to Sanity CORS, with credentials enabled for Studio.

If using a different domain from the one already configured in the website content, review business links and structured-data URLs before launch. Changing `NEXT_PUBLIC_SITE_URL` alone does not update those URLs in this code.

Reference: [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## 11. Set Up Sanity Publishing Updates

Create a webhook so that publishing content asks the website to refresh its cached pages.

1. Confirm that `SANITY_REVALIDATE_SECRET` is saved in Vercel and the website has been redeployed.
2. Open the Sanity project's webhook settings.
3. Create a webhook for the `production` dataset.
4. Use **POST** and this URL:

~~~text
https://YOUR_DOMAIN/api/revalidate
~~~

5. Enable create, update, and delete events.
6. Exclude draft changes using this filter:

~~~groq
!(_id in path("drafts.**"))
~~~

7. Set this projection:

~~~groq
{
  "_type": _type,
  "slug": slug.current,
  "pageType": pageType
}
~~~

8. Add a **custom HTTP header**:

~~~text
x-revalidate-secret: YOUR_GENERATED_SECRET
~~~

The header value must match Vercel's `SANITY_REVALIDATE_SECRET`. Filling only Sanity's separate signing-secret field is not sufficient for this route.

9. Publish a small test change in Studio.
10. Check the webhook delivery response and refresh the relevant page.

A successful response includes `ok: true` and `revalidated: true`. If a service detail page remains stale, redeploy as a temporary workaround; the current webhook does not explicitly refresh every service-detail route.

## 12. Configure Resend Email

### Create Your Account and Verify the Sender Domain

1. Create a business-owned account at [Resend](https://resend.com/).
2. Open **Domains** and add a sending subdomain such as `mail.thesuttonvet.co.uk`.
3. Add the exact DNS records provided by Resend at your DNS provider.
4. Wait until the domain is verified.
5. Create a sending API key, restricted to your sender domain where supported.

Do not replace your main domain's existing mailbox MX records. A Resend sending domain does not create an inbox; replies should go to your existing clinic mailbox.

### Add the Email Settings

Add these to your local `.env.local` when ready to test:

~~~dotenv
RESEND_API_KEY=YOUR_RESEND_SENDING_KEY
RESEND_FROM_EMAIL="The Sutton Vet <registrations@mail.thesuttonvet.co.uk>"
RESEND_REPLY_TO=info@thesuttonvet.co.uk
~~~

Use your own verified sender domain and monitored reply address.

Add the same variables to Vercel's **Production** environment, without enclosing quotes in the value fields, and redeploy.

The code uses Resend's HTTP API, so no additional email package needs to be installed. These settings support registration/booking confirmations and the optional email-code verification flow below. The hosted Lupa booking journey manages its own notifications separately.

### Enable Email Verification and Existing-Client Booking

Leave `LUPA_CLIENT_BOOKING_ENABLED=false` until this setup is complete. When false, `/book` keeps the existing hosted Lupa journey. When true, `/book` uses the website's own email-code verification, pet lookup, available times, and appointment-request form, without embedding the portal. Changing the flag or other environment variables requires a redeploy.

1. Configure the Resend settings above with the client's sending key, verified sender email (including the display name if desired), and monitored reply-to email. Replace `YOUR_VERIFIED_DOMAIN`; it is not a real sender. No Resend template ID or webhook is required for this implementation.
2. Create a **client-owned Upstash Redis** database and copy its HTTPS REST URL and full read/write REST token. Use separate databases/secrets for test and production. Redis is required to enforce code expiry, one-time use, attempt limits, and sessions across Vercel workers. Do not replace it with in-memory storage on Vercel. See [Upstash REST setup](https://upstash.com/docs/redis/features/restapi).
3. Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep the generated value private and use a different secret for each deployment environment.
4. In the client's Vercel Production environment (or server environment), set:

~~~dotenv
NEXT_PUBLIC_SITE_URL=https://YOUR_EXACT_WEBSITE_DOMAIN
RESEND_API_KEY=YOUR_RESEND_SENDING_KEY
RESEND_FROM_EMAIL="The Sutton Vet <booking@YOUR_VERIFIED_DOMAIN>"
RESEND_REPLY_TO=YOUR_MONITORED_REPLY_ADDRESS
BOOKING_AUTH_SECRET=YOUR_GENERATED_RANDOM_SECRET
UPSTASH_REDIS_REST_URL=https://YOUR_REDIS_REST_HOST
UPSTASH_REDIS_REST_TOKEN=YOUR_REDIS_READ_WRITE_TOKEN
LUPA_CLIENT_BOOKING_ENABLED=true
~~~

Use the exact origin visitors use, with no path, query, or hash. Redirect alternate domains to this origin. Production must use HTTPS. Keep the existing `LUPA_API_BASE_URL`, `LUPA_API_KEY`, `LUPA_COMPANY_ID`, and `LUPA_STORE_ID` configured server-side as described in section 13. Do not change them to Resend credentials. In Vercel value fields, omit the enclosing quote characters.

5. Confirm the dedicated Lupa website employee can create appointments, public appointment types have durations and `isPublic=true`/`isArchived=false`, and qualified staff have suitable rota availability. This flow submits `requested` appointments, not confirmed bookings. It does not implement Lupa passwords, payments, deposits, questionnaires, cancellations, or booking-policy collection. Do not enable it if the clinic requires those hosted-portal features without a separate implementation.
6. Redeploy, then run the acceptance tests below with clinic-approved test records and email addresses you control. Real sender delivery and real Lupa responses must be checked on the client's environment before inviting customers.

**Security behavior:** six-digit codes expire after 10 minutes, allow five failed attempts and one successful use, and have a 60-second resend cooldown. Requests are limited to five sends per email/hour, 20 per IP/hour, and 200 globally/hour. Sessions expire after 30 minutes and use HttpOnly/Secure/SameSite cookies; sign-out revokes them. No client lookup happens before email verification, so send-code responses do not reveal whether an address is registered. An unregistered but verified address is offered registration. Email matches are checked exactly and pet ownership is rechecked before booking. Slot choices are signed and expire after 10 minutes. Write attempts are deduplicated for 24 hours; uncertain outcomes instruct the visitor to call rather than automatically resubmit.

On Vercel, the IP limit uses its platform-provided forwarded IP header. On other hosts the conservative default shares the IP bucket across all visitors; configure trusted-proxy IP handling and review rate limits before public launch. Apply appropriate edge/WAF rate limiting too. Redis stores verified emails temporarily for the code/session TTLs, hashed rate-limit identifiers for up to one hour, cached appointment types for one minute, and minimal booking receipts for 24 hours. Do not log codes, tokens, or client details. Update the clinic's privacy/cookie information and agree provider data-processing arrangements before launch.

### Verification Acceptance Tests

1. Open `/book`: it should show email verification when enabled, not an iframe.
2. Request a code using a controlled email already on a Lupa record. Confirm the code arrives, and no pet details appear before verification.
3. Try an incorrect code, an expired code, and a previously used code. All must fail. Confirm resend cooldown and attempt limits.
4. Verify with a fresh code, check only that owner's pets are listed, select a public appointment type, then check available times (displayed in London time).
5. With the clinic's permission, send one clearly labelled test appointment request. Check it in Lupa and check the Resend receipt. Do not resend after an uncertain result; call/check the backend first. Clean up the approved test record through the clinic.
6. Sign out and confirm protected pet/booking requests require verification again. Test session expiry and an email that is not registered. Returning owners with a different email should contact the practice rather than create duplicates.

Offline regression tests: `node --experimental-strip-types --test scripts/test-client-booking.mjs`. These stub all outbound services and never send real emails or create Lupa records. They do not replace provider-side acceptance tests. Browser UI tests are in `scripts/check-verified-booking-ui.mjs` and require a local server with the feature flag enabled and separately installed Playwright; the test intercepts the booking API so no live requests are made.

### Test Delivery

After Lupa is configured:

1. Submit an approved test registration using an email address you control.
2. Verify the record in Lupa.
3. Check the email in Resend's logs and the recipient's inbox/spam folder.
4. Test the booking-request email using an approved test appointment.

If the Lupa operation succeeds but email fails, do not submit the form again simply to retry email. Check Resend first to avoid duplicate records.

Reference: [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).

## 13. Configure Lupa

### Add the Credentials

Obtain the correct API key, company ID, store ID, and authorized endpoint from Lupa.

For the production connection, configure:

~~~dotenv
LUPA_API_BASE_URL=https://api.lupapets.com/api/external
LUPA_API_KEY=YOUR_LUPA_KEY
LUPA_COMPANY_ID=YOUR_COMPANY_ID
LUPA_STORE_ID=YOUR_STORE_ID
LUPA_DIAGNOSTICS_KEY=YOUR_SEPARATE_RANDOM_SECRET
LUPA_PAY_ENABLED=false
LUPA_HEALTH_PLAN_ENABLED=false
~~~

Generate a separate random diagnostics secret using the command in section 4. Enter the raw API key without adding `Bearer` or `ID=`; the application creates the authorization header.

Keep these values server-side. Add the live values to Vercel's **Production** scope and redeploy. Use local credentials only when testing against that environment is explicitly approved.

Leave payment and health-plan flags false unless a supported integration has been agreed and tested.

### Optional Public Journey Links

If Lupa supplies approved visitor-facing URLs, add the relevant values:

~~~dotenv
NEXT_PUBLIC_LUPA_BOOKING_URL=
NEXT_PUBLIC_LUPA_REGISTRATION_URL=
NEXT_PUBLIC_LUPA_HEALTHPLAN_URL=
~~~

These are public page URLs, not API endpoints. Check the corresponding Sanity link fields and test where the actual website buttons go after deployment.

For Health Plans, set **Sanity > Site Settings > Health Plan Signup URL** to the approved enrolment URL when it is available. This takes priority over `NEXT_PUBLIC_LUPA_HEALTHPLAN_URL`. Do not enter the website's own `/health-plan` address. Without a valid signup destination, all signup/interest buttons lead to `/contact#health-plan-enquiry`, where visitors can email or call the practice. This fallback does not create a subscription or take payment.

Update the home location text under **Sanity > Home Page > Location Title / Location Points**, then publish. Known old seed placeholders are replaced on the website with visitor-facing copy; your own edited text is preserved.

By default `/book` embeds Lupa's hosted booking journey. Set `NEXT_PUBLIC_LUPA_BOOKING_URL` to the approved hosted URL if supplied; otherwise the page derives `https://store.lupapets.com/booking/{LUPA_STORE_ID}`. The page also offers a new-tab link if embedding is blocked. To use the custom verified-email/pet-lookup API flow instead, complete the Resend/Redis setup in section 12 and enable `LUPA_CLIENT_BOOKING_ENABLED` before redeploying.

### Test the Connection

Check the deployed website's read-only endpoints:

~~~text
https://YOUR_DOMAIN/api/lupa/status
https://YOUR_DOMAIN/api/lupa/appointment-types
https://YOUR_DOMAIN/api/lupa/services
~~~

For a private diagnostic report:

~~~text
https://YOUR_DOMAIN/api/lupa/diagnostics?key=YOUR_DIAGNOSTICS_SECRET
~~~

Do not share the secret or unredacted URL in recordings. Remove the diagnostics variable when it is no longer needed.

Read the response body, not just the outer HTTP status. A response can be HTTP 200 while reporting an upstream error or fallback data. For a 403, ask Lupa to confirm the endpoint, key, company/store scope, and permissions.

### Test Registration and Booking

1. Ask the clinic to approve any test that will create live records.
2. Ensure Lupa has an appropriate online appointment type, duration, and staff availability.
3. Open `/book`, choose an appointment type, and check available times.
4. Use an email you control and a clearly identified test name.
5. Submit once and verify the result in the correct Lupa company/store.
6. Confirm that only intended appointment types appear.
7. Verify the request/confirmation workflow and customer email.
8. Ask an authorized clinic user to clean up test records.

If an outcome is uncertain, check Lupa before retrying. For sandbox testing, use the exact endpoint and credentials Lupa authorizes; do not assume that a sandbox dashboard login grants access to the development API.

## 14. Create a Separate Development Environment

### Create a Staging Dataset

1. In Sanity, create a public dataset named `staging`.
2. Populate it using either the import or initial-seed approach in section 6.
3. Before any write command, set **both** CLI dataset variables to `staging`.
4. Change your local configuration:

~~~dotenv
NEXT_PUBLIC_SANITY_DATASET=staging
SANITY_DATASET=staging
~~~

Keep both project-ID variables set to your project and restart the local server.

### Configure Vercel Preview

In Vercel's **Preview** environment, set:

~~~dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
SANITY_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=staging
SANITY_DATASET=staging
~~~

Use approved test integration credentials or leave Lupa/Resend unconfigured. Do not automatically copy live credentials into Preview.

Add the exact test-site origin to Sanity CORS. If needed, configure a separate staging webhook and secret.

A separate Vercel project connected to your development branch is also an option for a stable test-site URL.

### Publish Code Changes Through a Branch

Create a branch:

~~~powershell
git switch -c development
~~~

After making and testing changes:

~~~powershell
git add .
git diff --cached --name-only
git commit -m "Describe the website update"
git push -u origin development
~~~

Review the Vercel Preview deployment, open a GitHub pull request into `main`, and merge when approved. Vercel deploys the production branch.

A code branch alone does not isolate data. Always check the dataset and integration credentials used by the test deployment.

## 15. Edit Website Content

1. Open `https://YOUR_DOMAIN/studio`.
2. Sign in to your Sanity account.
3. Select the appropriate page or document.
4. Edit the available content fields.
5. Click **Publish**.
6. Check the relevant public page.

Use **Careers Page** for the careers introduction and **Job Vacancy** for roles. Enter the title, salary, benefits, location, employment type, application details, and active status before publishing.

Use **Service** for service descriptions, subservices, and procedure galleries. Add images with alternative text, publish, and check the service detail page.

To publish a service price, open **Fee Category > the relevant category > Fee Items > the service > Display Price**. Enter the complete display value, including the currency (for example GBP 65 or From GBP 120), then click **Publish**. The website replaces that item's Quote link with non-clickable price text. Leave the field blank to restore the Quote link. Existing Quote values continue to work. Optional notes appear beneath the service name. The pricing page reads fresh published prices on each page request; reload an already open page after publishing. Draft edits are not shown publicly. Other pages still use the publishing webhook from section 11.

Normal text/image edits use the existing Studio fields. New layouts, navigation structures, or functionality require code changes; adding a document does not automatically add a new navigation item.

Do not rerun seeding commands to publish normal edits.

## 16. Back Up and Verify the Setup

### Back Up Sanity Content

Create a backup folder outside the repository. With the CLI explicitly targeted at the correct project and dataset, run:

~~~powershell
npx sanity dataset export production "C:\Backups\sutton-content.tar.gz"
~~~

Ensure `C:Backups` exists and keep asset export enabled. Use a new filename for each dated backup.

GitHub stores source code, not your Sanity dataset. A Vercel rollback changes the deployed code but does not undo CMS edits or Lupa records.

### Final Setup Checks

- [ ] The local website starts with `npm run dev`.
- [ ] `npm run build` and `npx tsc --noEmit` complete successfully.
- [ ] Source code is in your private GitHub repository without secrets.
- [ ] Vercel deploys from your repository.
- [ ] The domain and HTTPS work without disrupting business email.
- [ ] Studio connects to your project and publishing updates the website.
- [ ] Required page text, images, contact details, salary, and benefits are reviewed.
- [ ] Approved Lupa test submissions appear in the correct backend.
- [ ] Resend test emails arrive at controlled recipient addresses.
- [ ] Development and production use their intended datasets and credentials.

### Common Setup Issues

| Issue | Check |
| --- | --- |
| `package.json` not found | Enter the extracted project root |
| Dependency version/engine error | Use Node 24 locally and in Vercel |
| Studio is empty | Import content or seed the empty dataset once |
| Studio login fails | Check account membership and the exact credentialed CORS origin |
| Website shows different content from Studio | Check all four Sanity variables, publish status, and fallback content |
| Schema changes do not appear | Restart locally or redeploy the website, then open its `/studio` |
| Environment change has no effect | Restart locally or redeploy Vercel in the correct scope |
| Webhook returns 401 | Match its custom header to the server's revalidation secret |
| Booking has no available times | Check Lupa appointment types, staff schedules, permissions, and the API response |
| Registration succeeds but email is missing | Check Resend sender verification and delivery logs before retrying anything |
| DNS verification fails | Use the exact records shown in Vercel and check the authoritative DNS provider |
