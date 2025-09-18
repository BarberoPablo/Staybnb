import { CreateListingForm } from "../schemas/createListingSchema";

export interface StepConfig {
  name: string;
  fields: (keyof CreateListingForm)[];
  path: string;
}

export const hostingStepsConfig: StepConfig[] = [
  { name: "propertyType", fields: ["propertyType"], path: "propertyType" },
  { name: "privacyType", fields: ["privacyType"], path: "privacyType" },
  { name: "location", fields: ["location"], path: "location" },
  { name: "structure", fields: ["structure"], path: "structure" },
  { name: "amenities", fields: ["amenities"], path: "amenities" },
  { name: "images", fields: ["images"], path: "images" },
  { name: "title", fields: ["title"], path: "title" },
  { name: "description", fields: ["description"], path: "description" },
  { name: "nightPrice", fields: ["nightPrice"], path: "nightPrice" },
  { name: "promotions", fields: ["promotions"], path: "promotions" },
  { name: "checkInOut", fields: ["checkInTime", "checkOutTime"], path: "checkInOut" },
];

// For backward compatibility
export const hostingSteps = hostingStepsConfig.map((step) => step.path) as (keyof CreateListingForm | "checkInOut")[];

export const getStepConfig = (stepPath: string): StepConfig | undefined => {
  return hostingStepsConfig.find((step) => step.path === stepPath);
};

export const getStepFields = (stepPath: string): (keyof CreateListingForm)[] => {
  const config = getStepConfig(stepPath);
  return config?.fields || [];
};
