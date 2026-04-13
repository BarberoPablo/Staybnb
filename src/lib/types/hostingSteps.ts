import { UseFormGetValues } from "react-hook-form";
import { PartialUpdateDraftListing } from "../api/host/draftListings/draftListings.schema";
import { CreateListingForm } from "../schemas/createListingSchema";

export interface StepConfig {
  name: string;
  fields: (keyof PartialUpdateDraftListing)[];
  path: string;
}

export const hostingStepsConfig: StepConfig[] = [
  { name: "propertyType", fields: ["propertyType"], path: "propertyType" },
  { name: "privacyType", fields: ["privacyType"], path: "privacyType" },
  { name: "location", fields: ["location"], path: "location" },
  { name: "structure", fields: ["structure"], path: "structure" },
  { name: "guests", fields: ["guestLimits"], path: "guests" },
  { name: "amenities", fields: ["amenities"], path: "amenities" },
  { name: "images", fields: ["images"], path: "images" },
  { name: "title", fields: ["title"], path: "title" },
  { name: "description", fields: ["description"], path: "description" },
  { name: "nightPrice", fields: ["nightPrice"], path: "nightPrice" },
  { name: "promotions", fields: ["promotions"], path: "promotions" },
  { name: "checkInOut", fields: ["checkInTime", "checkOutTime"], path: "checkInOut" },
];

// For backward compatibility
export const hostingSteps = hostingStepsConfig.map((step) => step.path);

export const getStepConfig = (stepPath: string): StepConfig | undefined => {
  return hostingStepsConfig.find((step) => step.path === stepPath);
};

export const getStepFields = (stepPath: string): (keyof PartialUpdateDraftListing)[] => {
  const config = getStepConfig(stepPath);
  return config?.fields || [];
};

export const getStepData = (
  stepFields: (keyof PartialUpdateDraftListing)[],
  formData: Partial<PartialUpdateDraftListing>,
): Partial<PartialUpdateDraftListing> => {
  return Object.fromEntries(stepFields.filter((field) => formData[field] !== undefined).map((field) => [field, formData[field]]));
};

/**
 * Builds the payload for updating a draft listing for a specific step.
 *
 * ⚠️ IMPORTANT:
 * This function DOES NOT return only the step fields.
 * It also injects `currentStep` into the payload, which is REQUIRED
 * by the backend to determine which fields are allowed to be updated.
 *
 * Contract:
 * - Extracts only the fields associated with the given step.
 * - Adds `currentStep` equal to the provided stepIndex.
 * - Returns a payload ready to be sent to the updateDraftListing API.
 *
 * @param stepIndex - Index of the step whose data should be extracted and sent.
 * @param getValues - React Hook Form getter for current form state.
 *
 * @returns Payload including:
 * - Only the fields corresponding to the step
 * - `currentStep` set to stepIndex
 */
export function getStepPayload(stepIndex: number, getValues: UseFormGetValues<CreateListingForm>): PartialUpdateDraftListing {
  const currentStep = hostingSteps[stepIndex];
  const stepFields = getStepFields(currentStep);
  const allValues = getValues();

  const stepData = getStepData(stepFields, allValues);

  return {
    ...stepData,
    currentStep: stepIndex,
  };
}
