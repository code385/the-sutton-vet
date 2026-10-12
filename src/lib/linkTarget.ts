export function externalLinkProps(href: string) {
  return /^(?:https?:)?\/\//i.test(href.trim())
    ? { target: "_blank", rel: "noopener noreferrer", title: "Opens in a new tab" }
    : {};
}
