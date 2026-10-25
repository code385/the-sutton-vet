type FooterLink = { label: string; href: string };

export function resolveFooterLinks(links: FooterLink[]): FooterLink[] {
  const seen = new Set<string>();
  return links.flatMap((item) => {
    const href = item.href.trim();
    const key = href.replace(/\/$/, "");
    if (!href || !item.label.trim() || seen.has(key)) return [];
    seen.add(key);
    return [{ label: key === "/terms" ? "Terms of Business" : item.label.trim(), href }];
  });
}
