export const hostingSteps = [
  "property-type",
  "privacy-type",
  "location",
  "structure",
  "photos",
  "title",
  "description",
  /* "amenities", */
  "price",
  "promotions",
] as const;

export type HostingStep = (typeof hostingSteps)[number];
