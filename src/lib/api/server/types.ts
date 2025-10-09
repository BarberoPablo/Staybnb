export type MapCoordinates = {
  zoom: number;
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
};

export type ListingForScoring = {
  id: number;
  created_at: string | Date | null;
  images: string[];
  score:
    | {
        value: number;
        reviews: unknown[];
      }
    | unknown;
  _count?: {
    favorites: number;
    reservations: number;
  };
};

export type ScoredListing<T> = T & {
  popularityScore: number;
};
