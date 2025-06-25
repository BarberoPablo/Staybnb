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
  host: Host;
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

export type Host = {
  name: string;
  avatarUrl: string;
};

export type Guests = "adults" | "children" | "infant" | "pets";
