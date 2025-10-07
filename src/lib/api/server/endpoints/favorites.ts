"use server";

import { parseFavoritesWithListingFromDB, parseFavoriteWithListingFromDB } from "@/lib/parsers/favorites";
import { prisma } from "@/lib/prisma";
import { FavoriteWithListingDB } from "@/lib/types/favorites";
import { createClient } from "../../../supabase/server";

export async function getFavorites() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const favorites = await prisma.favorites.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            images: true,
            night_price: true,
            location: true,
            score: true,
            property_type: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform the data to match the expected structure
    const transformedFavorites = favorites.map((fav) => ({
      ...fav,
      listing: fav.listings,
      created_at: fav.created_at?.toISOString() || new Date().toISOString(),
    }));

    const parsedFavorites = parseFavoritesWithListingFromDB(transformedFavorites as unknown as FavoriteWithListingDB[]);
    return { success: true, data: parsedFavorites };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Error fetching favorites" };
  }
}

export async function createFavorite(listingId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if listing exists
    const listing = await prisma.listings.findUnique({
      where: {
        id: listingId,
      },
      select: {
        title: true,
        images: true,
        night_price: true,
        location: true,
        score: true,
        property_type: true,
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    // Create favorite
    const favorite = await prisma.favorites.create({
      data: {
        user_id: user.id,
        listing_id: listingId,
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            images: true,
            night_price: true,
            location: true,
            score: true,
            property_type: true,
          },
        },
      },
    });

    // Transform the data to match the expected structure
    const transformedFavorite = {
      ...favorite,
      listing: favorite.listings,
    };

    const parsedFavorite = parseFavoriteWithListingFromDB(transformedFavorite as unknown as FavoriteWithListingDB);
    return { success: true, data: parsedFavorite };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, message: "Already in favorites" };
      }
      return { success: false, message: error.message };
    }
    return { success: false, message: "Error adding to favorites" };
  }
}

export async function deleteFavorite(listingId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    await prisma.favorites.deleteMany({
      where: {
        user_id: user.id,
        listing_id: listingId,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Error removing from favorites" };
  }
}
