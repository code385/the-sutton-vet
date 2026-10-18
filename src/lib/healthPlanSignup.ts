export const healthPlanEnquiryHref = "/contact#health-plan-enquiry";

export function resolveHealthPlanSignup(value?: string, siteUrl?: string) {
  const fallback = { href: healthPlanEnquiryHref, canJoin: false };
  const candidate = value?.trim();
  if (!candidate || !/^(https?:\/\/|\/(?!\/))/i.test(candidate)) return fallback;

  try {
    const base = new URL(siteUrl || "https://thesuttonvet.co.uk");
    const url = new URL(candidate, base);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return fallback;
    const localHosts = new Set([base.hostname, "thesuttonvet.co.uk", "www.thesuttonvet.co.uk", "the-sutton-vet.vercel.app"]);
    const isLocal = localHosts.has(url.hostname);
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    if (isLocal && (path === "/health-plan" || path === "/pms-integration")) return fallback;
    if (isLocal && path === "/contact") return fallback;
    return { href: candidate, canJoin: true };
  } catch {
    return fallback;
  }
}
