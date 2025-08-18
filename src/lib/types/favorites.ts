import { Location, PropertyType, Score } from "./listing";

export type FavoriteDB = {
  id: number;
  user_id: string;
  listing_id: number;
  created_at: string;
};

export type Favorite = {
  id: number;
  userId: string;
  listingId: number;
  createdAt: Date;
};

export type FavoriteWithListingDB = FavoriteDB & {
  listing: {
    id: number;
    title: string;
    images: string[];
    location: Location;
    night_price: number;
    score: Score;
    property_type: PropertyType;
  };
};

export type FavoriteWithListing = Favorite & {
  listing: {
    id: number;
    title: string;
    images: string[];
    location: Location;
    nightPrice: number;
    score: Score;
    propertyType: PropertyType;
  };
};

export type CreateFavorite = {
  listingId: number;
};
