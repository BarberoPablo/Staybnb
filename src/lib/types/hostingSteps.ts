export const hostingSteps = [
  "property-type",
  "privacy-type",
  "location",
  "structure",
  "title",
  "description",
  "amenities",
  "photos",
  "description",
] as const;

export type HostingStep = (typeof hostingSteps)[number];
