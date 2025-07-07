export const hostingSteps = [
  "property-type",
  "privacy-type",
  "location",
  "structure",
  "title",
  "description",
  /* "amenities", */
  "price",
  "photos",
] as const;

export type HostingStep = (typeof hostingSteps)[number];
