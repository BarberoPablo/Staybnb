export type Listing = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  promotions?: {
    minNights: number;
    discountPercentage: number;
    description: string;
  }[];
  type: string;
  hostId: string;
  structure: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guestLimits: {
    [key in Guests]: {
      min: number;
      max: number;
    };
  };
  score: {
    value: number;
    reviews: {
      message: string;
      score: number;
    }[];
  };
  images: string[];
};

/* export type Host = {
  name: string;
  avatarUrl: string;
};
 */
export type Guests = "adults" | "children" | "infant" | "pets";

export type ListingSummary = {
  nights: number;
  baseTotal: number;
  total: number;
  discount: number;
  discountPercentage: number;
};

export type DateRangeKey = {
  startDate: Date;
  endDate: Date;
  key: string | undefined;
};

export type Reservation = {
  id: string;
  userId: string;
  listingId: number;
  startDate: Date;
  endDate: Date;
  guests: Record<Guests, number>;
  totalPrice: number;
  totalNights: number;
  nightPrice: number;
  discount: number;
  discountPercentage: number;
  createdAt: Date;
};

export type ReservationWithListing = Reservation & {
  listing: Listing;
};

export type CreateReservation = Omit<Reservation, "id" | "createdAt">;

export type ReservedDates = {
  id: string;
  listingId: number;
  startDate: Date;
  endDate: Date;
};
