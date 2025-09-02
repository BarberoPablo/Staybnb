import { LatLng } from "leaflet";

export type Guests = "adults" | "children" | "infant" | "pets";

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
    filtered: Date[];
    all: Date[];
  };
  unavailableCheckOutDates: {
    filtered: Date[];
    all: Date[];
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
