export const hostingSteps = [
  "property-type",
  "privacy-type",
  "location",
  "checkin-checkout",
  "structure",
  "photos",
  "title",
  "description",
  "price",
  "promotions",
] as const;

export type HostingStep = (typeof hostingSteps)[number];
