// src/lib/hostingSteps.ts
export const hostingSteps = ["property-type", "privacy-type", "location", "basics", "amenities", "photos", "description"] as const;

export type HostingStep = (typeof hostingSteps)[number];
