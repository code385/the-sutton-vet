"use client";

import { ConsentManagedEmbed } from "@/components/shared/ConsentManagedEmbed";
import { useEffect, useRef, useState } from "react";
import type { resolveTikTokSettings } from "@/lib/launch";
import styles from "./TikTokFeed.module.css";

type Settings = ReturnType<typeof resolveTikTokSettings>;

function TikTokCreatorFrame({ settings }: { settings: Settings }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(480);
  useEffect(() => {
    function resize(event: MessageEvent) {
      if (event.origin !== "https://www.tiktok.com" || event.source !== frameRef.current?.contentWindow) return;
      try {
        if (typeof event.data === "string" && event.data.length > 4096) return;
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (typeof data?.height === "number" && Number.isFinite(data.height) && data.height >= 200 && data.height <= 1200) setHeight(Math.ceil(data.height) + 2);
      } catch { /* Ignore unrelated provider messages, such as SDK ready events. */ }
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);
  return <iframe ref={frameRef} title={`TikTok profile and recent videos from @${settings.username}`} src={settings.embedUrl} sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" loading="lazy" className={styles.frame} style={{ height }} />;
}

export function TikTokFeed({ settings }: { settings: Settings }) {
  // Use the cross-origin creator frame produced by TikTok's official loader.
  // Unlike a same-origin srcdoc, it can safely retain its own origin/storage
  // without giving provider scripts access to the practice website.

  return <section className={`shell ${styles.section}`} aria-labelledby="tiktok-heading">
    <div className={styles.heading}><div><p className="eyebrow">Life at The Sutton Vet</p><h2 id="tiktok-heading">{settings.title}</h2><p>{settings.description}</p></div>
      <a className="button button-muted" href={settings.profileUrl} target="_blank" rel="noreferrer">Follow on TikTok <span aria-hidden="true">&rarr;</span></a>
    </div>
    <div className={styles.embed}>
      <ConsentManagedEmbed category="externalMedia" placeholderLabel="TikTok updates" title="Our latest moments, on your terms." description="Allow external media in cookie settings to see our TikTok profile and recent videos here. You can also visit our profile without loading an embed on this website." actionHref={settings.profileUrl} actionLabel="Open TikTok" className={styles.placeholder}>
        <TikTokCreatorFrame key={settings.embedUrl} settings={settings} />
      </ConsentManagedEmbed>
    </div>
    <p className={styles.note}>Videos are provided by TikTok. If the feed is unavailable or blocked by your browser, <a href={settings.profileUrl} target="_blank" rel="noreferrer">view our profile on TikTok</a>.</p>
  </section>;
}
