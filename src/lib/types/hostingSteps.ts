import { CreateListingForm } from "../schemas/createListingSchema";

export const hostingSteps: (keyof CreateListingForm)[] = [
  "propertyType",
  "privacyType",
  "location",
  "structure",
  "amenities",
  "images",
  "title",
  "description",
  "nightPrice",
  "promotions",
];
