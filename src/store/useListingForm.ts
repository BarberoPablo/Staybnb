import { AmenityId } from "@/lib/constants/amenities";
import { Listing, Location, PrivacyType, Promotion, PropertyType, Score, Structure } from "@/lib/types/listing";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ListingForm = {
  propertyType: PropertyType;
  privacyType: PrivacyType;
  location: Location;
  checkInTime: string;
  checkOutTime: string;
  title: string;
  description: string;
  nightPrice: number;
  promotions: Promotion[];
  structure: Structure;
  guestLimits: Listing["guestLimits"];
  amenities: AmenityId[];
  safetyItems: string[];
  images: string[];
  score: Score;
  minCancelDays: number;
  status: Listing["status"];
};

function getInitialListingForm(): ListingForm {
  return {
    propertyType: "House",
    privacyType: "Entire",
    structure: { guests: 1, bedrooms: 0, beds: 0, bathrooms: 0 },
    location: {
      formatted: "",
      housenumber: "",
      street: "",
      city: "",
      postcode: "",
      country: "",
      state: "",
      lat: 0,
      lng: 0,
      timezone: "",
    },
    checkInTime: "15:00",
    checkOutTime: "11:00",
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
    minCancelDays: 3,
    status: "draft",
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
