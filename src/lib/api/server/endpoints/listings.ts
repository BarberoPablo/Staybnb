"use server";

import { parseAmenitiesFromDB } from "@/lib/parsers/amenities";
import { prisma } from "@/lib/prisma";
import { AmenityDB } from "@/lib/types/amenities";
import { EditListing, ListingDB, ListingStatus, ListingWithReservationsAndHostDB, ReviewDB, ScoreDB } from "@/lib/types/listing";
import { parseEditListingToDB, parseListingFromDB, parseListingWithReservationsAndHostFromDB } from "../../../parsers/listing";
import { createClient } from "../../../supabase/server";
import { fetchFeaturedListings, fetchListingDetails, fetchPopularListings, fetchSearchListings } from "../../listings/listings.http";
import { CityCenter, ListingCardData } from "../../listings/listings.schema";
import { NotFoundError } from "../errors";
import { MapCoordinates } from "../types";
import { ParsedFilters } from "../utils";

export async function legacyGetListingWithReservations(id: number) {
  try {
    const listing = await prisma.listings.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        listing_amenities: {
          include: {
            amenities: true,
          },
        },
        reservations: {
          where: {
            status: "upcoming",
            end_date: {
              gte: new Date(),
            },
          },
          select: {
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundError();
    }

    const host = await prisma.profiles.findUnique({
      where: {
        id: listing.host_id,
      },
      select: {
        first_name: true,
        last_name: true,
        avatar_url: true,
      },
    });

    const rawData = {
      ...listing,
      host,
      amenities: parseAmenitiesFromDB(listing.listing_amenities as unknown as AmenityDB[]),
    };

    return parseListingWithReservationsAndHostFromDB(rawData as unknown as ListingWithReservationsAndHostDB);
  } catch (error) {
    console.error("Error fetching listing with reservations", error);
    throw new NotFoundError();
  }
}

export async function getListingDetails(id: string) {
  return fetchListingDetails(id);
}

export async function searchListings(
  filters: ParsedFilters,
  city?: string,
  mapCoordinates?: MapCoordinates,
): Promise<{ listings: ListingCardData[]; cityCenter: CityCenter }> {
  return fetchSearchListings(filters, city, mapCoordinates);
}

export async function editListing(id: number, props: EditListing) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    const dbData = parseEditListingToDB(props);
    const { amenities, ...listingData } = dbData;

    let validAmenities: number[] = [];
    if (amenities && amenities.length > 0) {
      const existingAmenities = await prisma.amenities.findMany({
        where: { id: { in: amenities.map(Number) } },
        select: { id: true },
      });
      validAmenities = existingAmenities.map((a) => a.id);
    }

    await prisma.$transaction([
      prisma.listings.update({
        where: {
          id,
          host_id: user.id,
        },
        data: listingData,
      }),

      prisma.listingAmenities.deleteMany({
        where: { listing_id: id },
      }),

      ...(validAmenities.length > 0
        ? [
            prisma.listingAmenities.createMany({
              data: validAmenities.map((amenityId) => ({
                listing_id: id,
                amenity_id: amenityId,
              })),
            }),
          ]
        : []),
    ]);

    return;
  } catch (error) {
    console.error("Error updating listing", error);
    throw new NotFoundError();
  }
}

export async function addReviewToListing(listingId: number, score: number, message: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    const listing = await prisma.listings.findUnique({
      where: {
        id: listingId,
      },
      select: {
        score: true,
      },
    });

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    const currentScoreData = (listing.score as ScoreDB) || { value: 0, reviews: [] };

    const existingReviewIndex = currentScoreData.reviews.findIndex((review) => review.user_id === user.id);

    const newReview: ReviewDB = {
      score,
      message,
      user_id: user.id,
    };

    let updatedReviews: ReviewDB[];
    if (existingReviewIndex >= 0) {
      updatedReviews = [...currentScoreData.reviews];
      updatedReviews[existingReviewIndex] = newReview;
    } else {
      updatedReviews = [...currentScoreData.reviews, newReview];
    }

    const totalScore = updatedReviews.reduce((sum, review) => sum + review.score, 0);
    const newAverageScore = updatedReviews.length > 0 ? totalScore / updatedReviews.length : 0;

    const updatedScoreData: ScoreDB = {
      value: Math.round(newAverageScore * 10) / 10,
      reviews: updatedReviews,
    };

    await prisma.listings.update({
      where: {
        id: listingId,
      },
      data: {
        score: updatedScoreData,
      },
    });

    return {
      success: true,
      message: "Review added successfully",
    };
  } catch (error) {
    console.error("Error adding review", error);
    throw new NotFoundError("Failed to add review");
  }
}

export async function getPopularListings(limit: number = 12, offset: number = 0) {
  return fetchPopularListings(limit, offset);
}

export async function getFeaturedListings(limit: number = 12, offset: number = 0) {
  return fetchFeaturedListings(limit, offset);
}

export async function getAllListingsWithHost() {
  try {
    const listings = await prisma.listings.findMany({
      include: {
        profiles: {
          select: {
            first_name: true,
            last_name: true,
            avatar_url: true,
            users: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return listings.map((listing) => {
      const parsedListing = parseListingFromDB(listing as unknown as ListingDB);
      return {
        ...parsedListing,
        host: {
          firstName: listing.profiles.first_name,
          lastName: listing.profiles.last_name,
          avatarUrl: listing.profiles.avatar_url || "",
          email: listing.profiles.users?.email || undefined,
        },
      };
    });
  } catch (error) {
    console.error("Error fetching all listings with host", error);
    throw new NotFoundError("Failed to fetch listings");
  }
}

export async function updateListingStatus(listingId: number, status: ListingStatus) {
  try {
    const updatedListing = await prisma.listings.update({
      where: {
        id: listingId,
      },
      data: {
        status,
      },
    });

    return { success: true, data: parseListingFromDB(updatedListing as unknown as ListingDB) };
  } catch (error) {
    console.error("Error updating listing status", error);
    throw new Error("Failed to update listing status");
  }
}
