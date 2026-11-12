import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { resolveFooterLinks } from "@/lib/footerLinks";
import { visualAssets } from "@/lib/visualAssets";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";
import styles from "./ComingSoon.module.css";

type Props = { siteSettings: ResolvedSiteSettings };
export const launchMainClassName = styles.main;

export function LaunchHeader({ siteSettings }: Props) {
  return <header className={`sv-header ${styles.header}`}><div className={`shell ${styles.headerInner}`}>
    <Link href="/" aria-label="The Sutton Vet home" className={styles.logo}>
      <Image src="/Sutton_vet_logo_aw.png" alt="The Sutton Vet" width={1269} height={698} priority />
    </Link>
    <a className={`button button-primary ${styles.register}`} href={siteSettings.ctas.register}>Register Now</a>
  </div></header>;
}

export function ComingSoon({ siteSettings }: Props) {
  const launch = siteSettings.launchSettings;
  return <section className={styles.landing} aria-labelledby="launch-title">
    <div className={styles.copy}>
      <p className={styles.announcement}><span aria-hidden="true" />{launch.openingLabel}</p>
      <h1 id="launch-title">{launch.title}</h1>
      <p className={styles.motto}>{siteSettings.tagline}</p>
      <p className={styles.description}>{launch.description}</p>
      <a className="button button-primary" href={siteSettings.ctas.register}>Register Now <span aria-hidden="true">&rarr;</span></a>
      <p className={styles.note}>Register your household and pets before we open. Registration does not book an appointment.</p>
      <div className={styles.location}><span className="eyebrow">Your local independent vet</span><p>{siteSettings.address}</p></div>
    </div>
    <div className={styles.visual}>
      <Image src={launch.imageUrl || visualAssets.aboutClinicCare} alt={launch.imageAlt} fill sizes="(max-width: 800px) 100vw, 45vw" className={styles.photo} />
      <div className={styles.caption}><span className="eyebrow">The Sutton Vet</span><p>Local roots. Lifelong care.</p></div>
    </div>
  </section>;
}

export function LaunchFooter({ siteSettings }: Props) {
  return <footer className={`sv-footer ${styles.footer}`}><div className="shell">
    <div className={styles.footerTop}><div><strong>{siteSettings.practiceName}</strong><p>{siteSettings.tagline}</p></div>
      <div className={styles.contacts}><a href={siteSettings.ctas.call}>{siteSettings.phone}</a><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a><a href={siteSettings.ctas.whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp</a></div>
    </div>
    <div className={styles.company}>{siteSettings.companyLines.map((line) => <p key={line}>{line}</p>)}</div>
    <div className={styles.legal}>{resolveFooterLinks(siteSettings.legalLinks).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<CookieSettingsButton /></div>
    <p className={styles.copyright}>&copy; {new Date().getFullYear()} {siteSettings.practiceName}. All rights reserved.</p>
  </div></footer>;
}
