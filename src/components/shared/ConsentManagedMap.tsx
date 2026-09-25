"use client";

import { ConsentManagedEmbed } from "@/components/shared/ConsentManagedEmbed";

type ConsentManagedMapProps = {
  src: string;
  title: string;
  actionHref: string;
};

export function ConsentManagedMap({ src, title, actionHref }: ConsentManagedMapProps) {
  return (
    <ConsentManagedEmbed
      category="externalMedia"
      placeholderLabel="Map privacy"
      title="Map available after consent."
      description="Allow external media to load Google Maps here, or open directions directly without changing your website cookie settings."
      actionHref={actionHref}
      actionLabel="Open in Google Maps"
      className="consent-map-placeholder"
    >
      <iframe
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </ConsentManagedEmbed>
  );
}
