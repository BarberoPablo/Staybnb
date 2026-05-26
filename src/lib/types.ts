import { LatLng } from "leaflet";

export const guests = ["adults", "children", "infant", "pets"] as const;
export type Guests = (typeof guests)[number];

export type Dates = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type DateRangeKey = {
  startDate: Date;
  endDate: Date;
  key: string | undefined;
};

export type UnavailableDates = {
  unavailableCheckInDates: {
    filtered: string[];
    all: string[];
  };
  unavailableCheckOutDates: {
    filtered: string[];
    all: string[];
  };
};

export type RequiredParams = "adults" | "startDate" | "endDate";

export type OptionalParams = "children" | "infant" | "pets";

export type ListingSearchParams = Record<RequiredParams, string> & Partial<Record<OptionalParams, string>>;

export type MapCoordinates = {
  center: LatLng;
  zoom: number;
  northEast: LatLng;
  southWest: LatLng;
};

export type GetListingsParams = Partial<MapCoordinates> & {
  city?: string;
  includeAmenities?: boolean;
  amenities?: number[];
  limit?: number;
  offset?: number;
};

export type SearchPageParams = Record<string, string | string[] | undefined>;
