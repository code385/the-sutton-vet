"use client";

import Image from "next/image";
import { useState } from "react";

export type ClinicalGalleryItem = {
  title: string;
  description?: string;
  images: { src: string; alt: string }[];
};

export function ServiceClinicalGallery({ items }: { items: ClinicalGalleryItem[] }) {
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  function openImage(image: { src: string; alt: string }) {
    setActiveImage(image);
    setZoom(1);
  }

  function closeImage() {
    setActiveImage(null);
    setZoom(1);
  }

  return (
    <>
      <div className="service-clinical-grid">
        {items.map((item, index) => (
          <article className={`service-clinical-card${index === 0 ? " service-clinical-card-featured" : ""}`} key={item.title}>
            <div className="service-clinical-images">
              {item.images.map((image) => (
                <button type="button" className="service-clinical-image" key={image.src} onClick={() => openImage(image)} aria-label={`Enlarge ${image.alt}`}>
                  <Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 720px) 50vw, 30vw" : "(max-width: 720px) 50vw, 18vw"} />
                  <span>View</span>
                </button>
              ))}
            </div>
            <div className="service-clinical-copy">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeImage ? (
        <div className="service-image-lightbox" role="dialog" aria-modal="true" aria-label="Clinical image viewer" onClick={closeImage}>
          <div className="service-image-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="service-image-lightbox-toolbar">
              <span>{activeImage.alt}</span>
              <div>
                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} aria-label="Zoom out">−</button>
                <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} aria-label="Zoom in">+</button>
                <button type="button" onClick={closeImage} aria-label="Close image viewer">Close</button>
              </div>
            </div>
            <div className="service-image-lightbox-stage">
              <Image src={activeImage.src} alt={activeImage.alt} fill sizes="95vw" style={{ transform: `scale(${zoom})` }} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
