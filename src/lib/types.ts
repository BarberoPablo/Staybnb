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
  host: {
    name: string;
    avatarUrl: string;
  };
  structure: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
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
