export type Guests = "adults" | "children" | "infant" | "pets";

export type DateRangeKey = {
  startDate: Date;
  endDate: Date;
  key: string | undefined;
};

export type ReservedDates = {
  id: string;
  listingId: number;
  startDate: Date;
  endDate: Date;
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
