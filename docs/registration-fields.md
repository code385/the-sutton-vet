# Household registration

The latest client list is authoritative. The earlier request to make most pet fields compulsory has been superseded.

## Required and optional fields

- Required owner fields: first name, last name, full address (street, town/city, postcode, country), phone with country code, email.
- Optional owner fields: title, date of birth, how they heard about the practice.
- Required per pet: name, species, date of birth or approximate age, temperament/handling needs, reason for appointment.
- Optional per pet: searchable/free-text breed, sex, separate neuter status and date, weight in kg, previous daytime practice, microchip number, previous clinical notes as text, last vaccination/deworming/flea-tick dates.
- One household can register 1-6 pets in a single Lupa create request. For more pets, the form directs the owner to call.
- Registration does not reserve an appointment; the success screen links to Book Online.
- Essential email/SMS consent is separate from marketing. Marketing preferences remain empty.

## Lupa mapping

The server validates every pet before making any write to POST /v1/clients/create.

Native owner fields: firstName, lastName, title, email, phone, structured address, dob, referralSource.
Native pet fields: name, species, breed, sex, dob, neutered, neuteredDate, weight, microchip/microchipped.

When optional breed/sex are omitted, Lupa's required fields receive Unknown. Omitted neuter status does not become false. Approximate years/months are converted to an estimated DOB with a clearly labelled note and calendar month-end clamping.

Temperament, reason, previous practice, previous clinical text and preventative treatment dates are saved in each pet's notes as owner-reported information for review. They are NOT written as verified vaccination/treatment events. A previous practice is not assigned as the pet's new primary vet.

The route confirms the owner and all expected distinct pet IDs before reporting success. Uncertain or partial writes lock the form against accidental retry. Confirmation-email failures do not turn an already-created registration into a failed registration.

Older flat single-pet form payloads are rejected with a refresh instruction; they cannot bypass the new compulsory fields. Requests are JSON-only and bounded at 64 KiB.

## Clinical file uploads: blocked on Lupa contract

The client requires attachments directly in Lupa. Email and public Sanity storage are not approved alternatives.

The published [OpenAPI specification](https://api.lupapets.com/api/openapi.json) lists attachment read/search operations, including GET /v1/attachment/{id} and GET /v1/attachment/{id}/content. No file upload/create operation was found in the reviewed specification.

Text notes can be submitted now, but this is not a file upload. The form explicitly says document uploads are unavailable and asks owners to contact the practice to arrange transfer. Do not add a file picker that discards files or encodes them into text notes.

Lupa support must supply the external upload workflow, required employee/API-key permissions, examples, size/type limits, pet linking and any signed-upload/finalisation steps. Obtain a sandbox/test record before testing writes.

## Opening-period consultations

The public production API returned Consultation: 15 minutes and Dental: 30 minutes on 2026-11-04. No live type configuration has been changed.

Website availability requests and appointment start/end times already use the duration configured in Lupa. Tests now explicitly cover a 40-minute consultation and reject a previously selected shorter slot if the practice changes the duration before submission. Submission refreshes the type rather than trusting the one-minute display cache.

Confirm whether the client wants the existing Consultation changed to 40 minutes or a separate Initial Consultation type. Update the corresponding configuration in Lupa; do not merely relabel a 15-minute slot or change Dental.

## Verification and release

- node --test scripts/test-registration.mjs scripts/test-client-booking.mjs
- node node_modules/typescript/bin/tsc --noEmit
- npm run build
- node scripts/check-registration-ui.mjs (Playwright/Edge; set PLAYWRIGHT_MODULE when installed outside the repo)

The browser test uses real components and mocked submissions. It covers keyboard/touch breed selection, pet add/remove identities, complete submitted fields, retry states and 320/375/768/1024/1440px layouts. No live client/pet records are created.

No Sanity schema or content changes are needed. Deploy the website via the connected main branch, then check /register and the public Lupa appointment-type response.
