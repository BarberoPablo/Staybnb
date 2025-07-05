import { create } from "zustand";
import { Listing } from "@/lib/types/listing";

export type PropertyType = "House" | "Apartment" | "Cabin" | "Boat";

type ListingForm = {
  propertyType: PropertyType;
  structure: Listing["structure"];
  privacyType: "entire" | "private" | "shared";
  location: Listing["location"];
  timezone: string;
  guestLimits: Listing["guestLimits"];
  amenities: string[];
  safetyItems: string[];
  images: Listing["images"];
  title: Listing["title"];
  description: Listing["description"];
  nightPrice: number;
};

function getInitialListingForm(): ListingForm {
  return {
    propertyType: "House",
    structure: { guests: 1, bedrooms: 1, beds: 1, bathrooms: 1 },
    privacyType: "entire",
    location: "",
    timezone: "",
    guestLimits: {
      adults: { min: 1, max: 2 },
      children: { min: 0, max: 0 },
      infant: { min: 0, max: 0 },
      pets: { min: 0, max: 0 },
    },
    amenities: [],
    safetyItems: [],
    images: [],
    title: "",
    description: "",
    nightPrice: 0,
  };
}

type ListingFormState = ListingForm & {
  setField: <K extends keyof ListingForm>(key: K, value: ListingForm[K]) => void;
  reset: () => void;
};

export const useListingForm = create<ListingFormState>((set) => ({
  ...getInitialListingForm(),
  setField: (key, value) => set(() => ({ [key]: value })),
  reset: () => set(() => getInitialListingForm()),
}));
