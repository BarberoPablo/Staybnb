"use server";

import { parseAmenitiesFromDB } from "@/lib/parsers/amenities";
import { prisma } from "@/lib/prisma";
import { AmenityDB } from "@/lib/types/amenities";
import { EditListing, ListingDB, ListingWithReservationsAndHostDB, ReviewDB, ScoreDB } from "@/lib/types/listing";
import { parseEditListingToDB, parseListingFromDB, parseListingWithReservationsAndHostFromDB } from "../../../parsers/listing";
import { createClient } from "../../../supabase/server";
import { NotFoundError } from "../errors";
import { MapCoordinates } from "../types";
import { buildSearchListingsWhereClause, ParsedFilters, sortByFeatured, sortByPopularity } from "../utils";
import { searchCities } from "./cities";

export async function getListingWithReservations(id: number) {
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

export async function searchListings(city: string | undefined, filters: ParsedFilters, mapCoordinates?: MapCoordinates) {
  if (!city) {
    return { listings: [], cityCenter: null };
  }

  try {
    let cityCenter = null;
    let actualCityName = city;

    if (mapCoordinates) {
      // Map movement search - search for listings within the visible area that match the city search term
      const whereClause = buildSearchListingsWhereClause(city, filters, mapCoordinates);

      const listings = await prisma.listings.findMany({
        where: whereClause,
      });

      const parsedListings = listings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));

      return { listings: parsedListings, cityCenter };
    } else {
      // Initial city search - use database-first approach
      const matchingCities = await searchCities(city);

      if (matchingCities.length === 0) {
        return { listings: [], cityCenter: null };
      } else if (matchingCities.length === 1) {
        cityCenter = {
          lat: matchingCities[0].lat,
          lng: matchingCities[0].lng,
        };
        actualCityName = matchingCities[0].name;
      } else {
        cityCenter = {
          lat: matchingCities[0].lat,
          lng: matchingCities[0].lng,
        };
        actualCityName = matchingCities[0].name;
      }

      // Search listings using the actual city name
      const whereClause = buildSearchListingsWhereClause(actualCityName, filters);

      const listings = await prisma.listings.findMany({
        where: whereClause,
      });

      const parsedListings = listings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));

      return { listings: parsedListings, cityCenter };
    }
  } catch (error) {
    console.error("Error fetching listings", error);
    throw new NotFoundError();
  }
}

export async function getHostListings() {
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
    const listings = await prisma.listings.findMany({
      where: {
        host_id: user.id,
      },
      include: { listing_amenities: { include: { amenities: true } } },
    });

    const parsedListings = listings.map((listing) => ({
      ...listing,
      amenities: parseAmenitiesFromDB(listing.listing_amenities as unknown as AmenityDB[]),
    }));

    return parsedListings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));
  } catch (error) {
    console.error("Error fetching host listings", error);
    throw new NotFoundError();
  }
}

export async function getHostListing(id: number) {
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
        id: id,
        host_id: user.id,
      },
      include: { listing_amenities: { include: { amenities: true } } },
    });

    const parsedListing = parseListingFromDB(listing as unknown as ListingDB);

    return {
      ...parsedListing,
      amenities: parseAmenitiesFromDB(listing?.listing_amenities as unknown as AmenityDB[]),
    };
  } catch (error) {
    console.error("Error fetching host listings", error);
    throw new NotFoundError();
  }
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
        where: { id: { in: amenities } },
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

export async function pauseListing(id: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  const { data, error } = await supabase
    .from("listings")
    .update({ status: "paused" })
    .eq("host_id", user.id)
    .eq("id", id)
    .eq("status", "published")
    .select();

  if (error) {
    console.error("Error pausing listing", error);
    throw new NotFoundError("Error pausing listing");
  }

  if (!data || data.length === 0) {
    throw new NotFoundError("Could not pause listing");
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

/**
 * Get popular listings based on sophisticated scoring algorithm
 * Factors: favorites (40%), reservations (35%), rating (25%)
 * @param limit - Number of listings to return (default: 12)
 * @param offset - Number of listings to skip for pagination (default: 0)
 */
export async function getPopularListings(limit: number = 12, offset: number = 0) {
  try {
    const listings = await prisma.listings.findMany({
      where: {
        status: "published",
      },
      include: {
        _count: {
          select: {
            favorites: true,
            reservations: {
              where: {
                status: {
                  in: ["upcoming", "completed"],
                },
              },
            },
          },
        },
      },
      take: 100,
    });

    const scoredListings = sortByPopularity(listings);

    const paginatedListings = scoredListings.slice(offset, offset + limit);

    return paginatedListings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));
  } catch (error) {
    console.error("Error fetching popular listings", error);
    throw new NotFoundError("Failed to fetch popular listings");
  }
}

/**
 * Get featured listings based on sophisticated scoring algorithm
 * Factors: rating (50%), review count (30%), image quality/count (15%)
 * @param limit - Number of listings to return (default: 12)
 * @param offset - Number of listings to skip for pagination (default: 0)
 */
export async function getFeaturedListings(limit: number = 12, offset: number = 0) {
  try {
    const listings = await prisma.listings.findMany({
      where: {
        status: "published",
        score: {
          path: ["value"],
          gte: 4.0, // Minimum rating for featured
        },
      },
      include: {
        _count: {
          select: {
            favorites: true,
            reservations: true,
          },
        },
      },
      take: 100,
    });

    // Apply scoring algorithm
    const scoredListings = sortByFeatured(listings);

    const paginatedListings = scoredListings.slice(offset, offset + limit);

    return paginatedListings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));
  } catch (error) {
    console.error("Error fetching featured listings", error);
    throw new NotFoundError("Failed to fetch featured listings");
  }
}
