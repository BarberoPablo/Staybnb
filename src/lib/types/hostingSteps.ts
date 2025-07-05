export const hostingSteps = ["property-type", "privacy-type", "location", "structure", "amenities", "photos", "description"] as const;

export type HostingStep = (typeof hostingSteps)[number];
