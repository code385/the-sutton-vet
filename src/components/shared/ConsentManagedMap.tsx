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
      placeholderLabel="Google Maps"
      title="View our location"
      description="Google Maps is paused until you allow external media. You can still open directions in a new tab."
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
