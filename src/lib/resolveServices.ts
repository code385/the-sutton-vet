import { publicServiceSlugs, seededServices } from "@/lib/servicesSeed";
import type { ServiceDocument } from "@/sanity/lib/services";

type ServiceLike = ServiceDocument | ((typeof seededServices)[number] & Pick<ServiceDocument, "subservices" | "gallery">);

export function resolveServiceCollection(services: ServiceDocument[]): ServiceLike[] {
  const bySlug = new Map<string, ServiceLike>();

  seededServices.forEach((service) => {
    const slug = service.slug?.current;
    if (slug) {
      bySlug.set(slug, service);
    }
  });

  services.forEach((service) => {
    const slug = service.slug?.current;
    if (slug) {
      bySlug.set(slug, service);
    }
  });

  return Array.from(bySlug.values()).filter((service) => publicServiceSlugs.has(service.slug?.current || ""));
}
