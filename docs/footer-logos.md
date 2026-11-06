# Footer logos

Put the three original logo images in `public/images/footer/`:

| Supplied image | Filename | Public URL |
| --- | --- | --- |
| 1st logo: RCVS | `rcvs.png` | `/images/footer/rcvs.png` |
| 2nd logo: VECCS | `veccs.png` | `/images/footer/veccs.png` |
| 3rd logo: AO VET | `ao-vet.png` | `/images/footer/ao-vet.png` |

Use genuine PNG files, preferably transparent or white-background originals.
Export JPEG or WebP originals as PNG; changing a file extension does not convert it.
Avoid screenshots and excessive whitespace around the artwork. Keep all lettering
and symbols intact. Around 600px wide is sufficient for the two horizontal logos;
around 240px square is sufficient for AO VET. Larger originals are also supported.

`src/components/layout/FooterLogos.tsx` defines the paths, accessible labels and
relative logo sizes. `FooterLogos.module.css` controls the footer grid and badges.
On desktop, the separate badges sit under Company (RCVS), Get Care (VECCS) and
Resources (AO VET), beside the practice brand/contact information. Each has its
own white background to keep the original artwork readable on the purple footer.
Logos keep their original colours and are contained, never stretched or cropped.
On tablet the badges follow the footer columns, and on phones they stack with
space between them. Missing images are hidden individually; when all are
unavailable, the logo group is hidden too.

No accreditation, partnership or membership claim is added. Confirm the practice
has permission to display the supplied marks before publishing them.

Files under `public/` ship with the website, not Sanity Studio. A website redeploy is
needed after adding or replacing the files in production. No Studio deploy or CMS
content migration is required for this change.
