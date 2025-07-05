import { Listing } from "@/lib/types/listing";
import { create } from "zustand";

export type PropertyType = "House" | "Apartment" | "Cabin" | "Boat";

export type PrivacyType = "entire" | "private" | "shared";

type ListingForm = {
  propertyType: PropertyType;
  structure: Listing["structure"];
  privacyType: PrivacyType;
  location: Listing["location"];
  lat: number;
  lng: number;
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
    lat: 0,
    lng: 0,
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
