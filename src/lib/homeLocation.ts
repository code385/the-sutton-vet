export const homeLocationTitle = "Find The Sutton Vet in Hackbridge";
export const defaultLocationPoints = [
  "Visit us at Spinning Wheel Way, near Hackbridge Rail Station.",
  "Use the map for directions, or contact the team for help planning your visit.",
  "Please call ahead if you have any questions about access or arrival.",
];

const legacyPoints = [
  "Hyper-local reassurance near Sutton and Hackbridge",
  "Google map and local travel guidance built into the contact journey",
  "Google Business Profile alignment required before go-live",
];

// Replace only known seed copy; leave the client's authored CMS content intact.
export function resolveHomeLocationCopy(title?: string, points?: string[]) {
  return {
    locationTitle: !title?.trim() || title.trim() === "Exact location and directions should be clear early."
      ? homeLocationTitle : title,
    locationPoints: points?.some((point) => point.trim())
      ? points.filter((point) => point.trim()).map((point) => {
        const index = legacyPoints.indexOf(point.trim());
        return index >= 0 ? defaultLocationPoints[index] : point;
      })
      : defaultLocationPoints,
  };
}
