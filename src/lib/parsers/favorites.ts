import { FavoriteDB, Favorite, FavoriteWithListingDB, FavoriteWithListing } from "../types/favorites";

export function parseFavoriteFromDB(favorite: FavoriteDB): Favorite {
  return {
    id: favorite.id,
    userId: favorite.user_id,
    listingId: favorite.listing_id,
    createdAt: new Date(favorite.created_at),
  };
}

export function parseFavoriteWithListingFromDB(favoriteWithListingDB: FavoriteWithListingDB): FavoriteWithListing {
  const favorite = parseFavoriteFromDB(favoriteWithListingDB);
  return {
    ...favorite,
    listing: {
      id: favoriteWithListingDB.listing.id,
      title: favoriteWithListingDB.listing.title,
      images: favoriteWithListingDB.listing.images,
      location: favoriteWithListingDB.listing.location,
      nightPrice: Number(favoriteWithListingDB.listing.night_price),
      score: favoriteWithListingDB.listing.score,
      propertyType: favoriteWithListingDB.listing.property_type,
    },
  };
}

export function parseFavoritesWithListingFromDB(favoritesWithListingDB: FavoriteWithListingDB[]): FavoriteWithListing[] {
  return favoritesWithListingDB.map((favorite) => parseFavoriteWithListingFromDB(favorite));
}
