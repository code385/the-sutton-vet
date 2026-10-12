const quotePlaceholders = new Set([
  "quote", "request a quote", "ask for a quote", "call for quote", "call for a quote",
  "price on request", "on request", "poa", "p.o.a.", "tbc", "tbd", "-",
]);

/** Preserve display prices (including ranges); old quote-only entries remain links. */
export function getFeePrice(price?: string | null): string | null {
  const value = price?.trim();
  if (!value || quotePlaceholders.has(value.toLowerCase().replace(/\s+/g, " "))) {
    return null;
  }
  return value;
}
