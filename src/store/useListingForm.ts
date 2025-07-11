import { Listing, PrivacyType, Promotion, PropertyType, Score, Structure } from "@/lib/types/listing";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ListingForm = {
  propertyType: PropertyType;
  privacyType: PrivacyType;
  location: string;
  lat: number;
  lng: number;
  timezone: string;
  title: string;
  description: string;
  nightPrice: number;
  promotions: Promotion[];
  structure: Structure;
  guestLimits: Listing["guestLimits"];
  amenities: string[];
  safetyItems: string[];
  images: string[];
  score: Score;
};

function getInitialListingForm(): ListingForm {
  return {
    propertyType: "House",
    privacyType: "Entire",
    structure: { guests: 1, bedrooms: 0, beds: 0, bathrooms: 0 },
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
    promotions: [],
    score: {
      value: 0,
      reviews: [],
    },
  };
}

type ListingFormState = ListingForm & {
  setField: <K extends keyof ListingForm>(key: K, value: ListingForm[K]) => void;
  reset: () => void;
};

export const useListingForm = create<ListingFormState>()(
  persist(
    (set) => ({
      ...getInitialListingForm(),
      setField: (key, value) => set(() => ({ [key]: value })),
      reset: () => set(() => getInitialListingForm()),
    }),
    {
      name: "listing-form-storage",
    }
  )
);
