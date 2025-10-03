"use server";

import { parseAmenitiesFromDB } from "@/lib/parsers/amenities";
import { parseCreateListingToDB, parseDraftListingFromDB, parseDraftListingToCreateListingDB } from "@/lib/parsers/draftListings";
import { parseProfileFromDB } from "@/lib/parsers/profile";
import { prisma } from "@/lib/prisma";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { getEffectiveStatus } from "@/lib/server-utils";
import { Guests } from "@/lib/types";
import { AmenityDB } from "@/lib/types/amenities";
import { City } from "@/lib/types/cities";
import { DraftListingDB } from "@/lib/types/draftListing";
import { EditListing, ListingDB, ListingWithReservationsAndHostDB, ReviewDB, ScoreDB, Structure } from "@/lib/types/listing";
import { ProfileDB } from "@/lib/types/profile";
import { parseEditListingToDB, parseListingFromDB, parseListingWithReservationsAndHostFromDB } from "../../parsers/listing";
import { parseReservationsFromDB, parseResumedReservationWithListingFromDB } from "../../parsers/reservation";
import { createClient } from "../../supabase/server";
import { CreateReservation, ReservationDB, ResumedReservationWithListingDB } from "../../types/reservation";
import { calculateNights, getListingPromotionDB, getTotalGuests, twoDecimals } from "../../utils";
import { NotFoundError } from "./errors";
import { ParsedFilters, buildSearchListingsWhereClause } from "./utils";

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

export async function searchListings(
  city: string | undefined,
  filters: ParsedFilters,
  mapCoordinates?: { zoom: number; northEast: { lat: number; lng: number }; southWest: { lat: number; lng: number } }
) {
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

export async function searchCities(searchTerm: string): Promise<City[]> {
  try {
    const cities = await prisma.cities.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country,
      lat: Number(city.lat),
      lng: Number(city.lng),
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

export async function getAllCities(): Promise<City[]> {
  try {
    const cities = await prisma.cities.findMany({
      orderBy: {
        name: "asc",
      },
      take: 50,
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country,
      lat: Number(city.lat),
      lng: Number(city.lng),
    }));
  } catch (error) {
    console.error("Error fetching all cities:", error);
    return [];
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

export async function createDraftListing() {
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
    const existingDrafts = await prisma.draft_listings.count({
      where: {
        host_id: user.id,
      },
    });

    if (existingDrafts >= 3) {
      throw new Error("Maximum number of draft listings reached (3)");
    }

    const draftListing = await prisma.draft_listings.create({
      data: {
        host_id: user.id,
        property_type: "House",
        privacy_type: "Entire",
        title: "",
        description: "",
        night_price: 0,
        check_in_time: "15:00",
        check_out_time: "11:00",
        min_cancel_days: 3,
        promotions: [],
        images: [],
        structure: {
          guests: 1,
          bedrooms: 0,
          beds: 0,
          bathrooms: 1,
        },
        guest_limits: {
          adults: { min: 1, max: 2 },
          children: { min: 0, max: 0 },
          infant: { min: 0, max: 0 },
          pets: { min: 0, max: 0 },
        },
        location: {
          lat: 0,
          lng: 0,
          city: "",
          state: "",
          street: "",
          country: "",
          postcode: "",
          timezone: "",
          formatted: "",
          housenumber: "",
        },
        amenities: [],
        current_step: 0,
      },
    });

    return {
      id: draftListing.id,
      success: true,
    };
  } catch (error) {
    console.error("Error creating draft listing", error);
    if (error instanceof Error && error.message.includes("Maximum number")) {
      throw error;
    }
    throw new NotFoundError("Failed to create draft listing");
  }
}

export async function updateDraftListing(id: number, data: Partial<CreateListingForm>) {
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
    const parsedData = parseCreateListingToDB(data);

    await prisma.draft_listings.update({
      where: {
        id: id,
        host_id: user.id,
      },
      data: {
        ...parsedData,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating draft listing", error);
    throw new NotFoundError("Failed to update draft listing");
  }
}

export async function getDraftListing(id?: number) {
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
    if (id) {
      const draftListing = await prisma.draft_listings.findFirst({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      if (!draftListing) {
        throw new NotFoundError("Draft listing not found");
      }

      return [parseDraftListingFromDB(draftListing as unknown as DraftListingDB)];
    } else {
      const draftListings = await prisma.draft_listings.findMany({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      if (!draftListings || draftListings.length === 0) {
        return [];
      }

      return draftListings.map((draft) => parseDraftListingFromDB(draft as unknown as DraftListingDB));
    }
  } catch (error) {
    console.error("Error fetching draft listing", error);
    throw new NotFoundError("Failed to fetch draft listing");
  }
}

export async function completeDraftListing(id: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  const draftData = await prisma.draft_listings.findUnique({
    where: {
      id: id,
      host_id: user.id,
    },
  });

  if (!draftData) {
    throw new NotFoundError("Draft listing not found");
  }

  const listingData = parseDraftListingToCreateListingDB(draftData as unknown as DraftListingDB);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newListing = await tx.listings.create({
        data: {
          host_id: user.id,
          ...listingData,
        },
      });

      if (draftData.amenities && Array.isArray(draftData.amenities) && draftData.amenities.length > 0) {
        await tx.listingAmenities.createMany({
          data: draftData.amenities.map((amenityId) => ({
            listing_id: newListing.id,
            amenity_id: amenityId,
          })),
        });
      }

      await tx.draft_listings.delete({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      return newListing;
    });

    return {
      success: true,
      listingId: result.id,
    };
  } catch (error) {
    console.error("Error completing draft listing", error);
    throw new NotFoundError("Failed to complete draft listing");
  }
}

export async function getHostReservationsGroupedByListing() {
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
      include: {
        reservations: {
          orderBy: {
            start_date: "desc",
          },
        },
      },
    });

    const listingsWithReservations = listings.map((listing) => {
      const validatedReservations = listing.reservations.map((reservation) => ({
        ...reservation,
        status: getEffectiveStatus(reservation.status, reservation.start_date.toISOString(), reservation.end_date.toISOString()),
      }));

      const parsedListing = parseListingFromDB(listing as unknown as ListingDB);
      const parsedReservations = parseReservationsFromDB(validatedReservations as unknown as ReservationDB[]);

      return {
        listing: parsedListing,
        reservations: parsedReservations,
      };
    });

    return listingsWithReservations;
  } catch (error) {
    console.error("Error fetching host reservations", error);
    throw new NotFoundError("Failed to fetch host reservations");
  }
}

export async function getUserReservations() {
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
    const reservations = await prisma.reservations.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            location: true,
            night_price: true,
            images: true,
            property_type: true,
            privacy_type: true,
            check_in_time: true,
            check_out_time: true,
            score: true,
          },
        },
      },
      orderBy: {
        start_date: "asc",
      },
    });

    const validatedReservations = reservations.map((reservation) => {
      const { listings, ...reservationWithoutListings } = reservation;

      const scoreData = listings.score as ScoreDB;
      const userReview = scoreData?.reviews?.find((review: ReviewDB) => review.user_id === user.id) || null;

      return {
        ...reservationWithoutListings,
        listing: {
          ...listings,
          score: {
            value: scoreData?.value || 0,
            user_review: userReview,
          },
        },
        status: getEffectiveStatus(reservation.status, reservation.start_date.toISOString(), reservation.end_date.toISOString()),
      };
    });

    return parseResumedReservationWithListingFromDB(validatedReservations as unknown as ResumedReservationWithListingDB[]);
  } catch (error) {
    console.error("Error fetching user reservations", error);
    throw new NotFoundError("Failed to fetch user reservations");
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

export async function getProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      throw new NotFoundError();
    }

    const profile = await prisma.profiles.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!profile) {
      return null;
    }

    return parseProfileFromDB({ ...profile, email: user.email } as unknown as ProfileDB);
  } catch (error) {
    // If profile was not found, return null (not an error)
    if (error instanceof Error && error.message === "Profile not found") {
      return null;
    }
    throw error;
  }
}

export async function createReservation(reservationData: CreateReservation) {
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
    // Validate dates are in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (reservationData.startDate < today) {
      throw new Error("Start date must be in the future");
    }

    if (reservationData.endDate <= reservationData.startDate) {
      throw new Error("End date must be after start date");
    }

    // Get the listing to verify it exists and get pricing info
    const listing = await prisma.listings.findUnique({
      where: {
        id: reservationData.listingId,
      },
      select: {
        id: true,
        night_price: true,
        promotions: true,
        status: true,
        host_id: true,
        guest_limits: true,
        structure: true,
      },
    });

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    // Check if listing is published
    if (listing.status !== "published") {
      throw new Error("Listing is not available for booking");
    }

    // Prevent users from booking their own listings
    if (listing.host_id === user.id) {
      throw new Error("You cannot book your own listing");
    }

    // Validate guest limits
    const guestLimits = listing.guest_limits as { [key in Guests]: { min: number; max: number } };

    // Check each guest type against limits
    for (const [guestType, count] of Object.entries(reservationData.guests)) {
      if (count > 0) {
        const limit = guestLimits[guestType as Guests];
        if (count < limit.min || count > limit.max) {
          throw new Error(`Invalid number of ${guestType}: must be between ${limit.min} and ${limit.max}`);
        }
      }
    }

    // Check total guests against structure limits
    const totalGuests = getTotalGuests(reservationData.guests);
    const structure = listing.structure as Structure;
    const maxTotalGuests = structure.guests;
    if (totalGuests > maxTotalGuests) {
      throw new Error(`Total guests (${totalGuests}) exceeds maximum capacity (${maxTotalGuests})`);
    }

    // Check for conflicting reservations
    const conflictingReservations = await prisma.reservations.findMany({
      where: {
        listing_id: reservationData.listingId,
        status: "upcoming",
        OR: [
          {
            AND: [{ start_date: { lte: reservationData.startDate } }, { end_date: { gt: reservationData.startDate } }],
          },
          {
            AND: [{ start_date: { lt: reservationData.endDate } }, { end_date: { gte: reservationData.endDate } }],
          },
          {
            AND: [{ start_date: { gte: reservationData.startDate } }, { end_date: { lte: reservationData.endDate } }],
          },
        ],
      },
    });

    if (conflictingReservations.length > 0) {
      throw new Error("Selected dates are not available");
    }

    // Calculate nights and pricing
    const nights = calculateNights(reservationData.startDate, reservationData.endDate);

    // Get applicable promotion
    const promotion = getListingPromotionDB(listing as unknown as ListingDB, nights);

    // Calculate pricing
    const discountPercentage = promotion?.discount_percentage || 0;
    const basePrice = Number(listing.night_price) * nights;
    const discount = discountPercentage > 0 ? (basePrice * discountPercentage) / 100 : 0;
    const totalPrice = twoDecimals(basePrice - discount);

    // Create the reservation
    const reservation = await prisma.reservations.create({
      data: {
        user_id: user.id,
        listing_id: reservationData.listingId,
        start_date: reservationData.startDate,
        end_date: reservationData.endDate,
        guests: reservationData.guests,
        total_price: totalPrice,
        total_nights: nights,
        night_price: Number(listing.night_price),
        discount: discount > 0 ? twoDecimals(discount) : null,
        discount_percentage: discountPercentage > 0 ? discountPercentage : null,
        status: "upcoming",
      },
    });

    return {
      success: true,
      reservationId: reservation.id,
      message: "Reservation created successfully",
    };
  } catch (error) {
    console.error("Error creating reservation", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new NotFoundError("Failed to create reservation");
  }
}

export async function cancelReservation(reservationId: string) {
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
    const reservation = await prisma.reservations.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        listings: {
          select: {
            host_id: true,
            min_cancel_days: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    const isGuest = reservation.user_id === user.id;
    const isHost = reservation.listings.host_id === user.id;

    if (!isGuest && !isHost) {
      throw new NotFoundError("Unauthorized");
    }

    if (reservation.status !== "upcoming") {
      throw new NotFoundError("Can only cancel upcoming reservations");
    }

    if (isGuest) {
      const minCancelDays = reservation.listings.min_cancel_days;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const daysUntilCheckIn = Math.ceil((reservation.start_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilCheckIn < minCancelDays) {
        throw new Error(`Cannot cancel reservation. Must cancel at least ${minCancelDays} days before check-in.`);
      }
    }

    await prisma.reservations.update({
      where: {
        id: reservationId,
      },
      data: {
        status: isGuest ? "canceled" : "canceled_by_host",
        canceled_at: new Date(),
      },
    });

    return {
      success: true,
      message: "Reservation canceled successfully",
      canceledBy: isGuest ? "guest" : "host",
    };
  } catch (error) {
    console.error("Error canceling reservation", error);
    if (error instanceof Error && error.message.includes("Cannot cancel reservation")) {
      throw error;
    }
    throw new NotFoundError("Failed to cancel reservation");
  }
}

export async function deleteDraftListing(id: number) {
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
    const draftListing = await prisma.draft_listings.findFirst({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    if (!draftListing) {
      throw new NotFoundError("Draft listing not found or you don't have permission to delete it");
    }

    await prisma.draft_listings.delete({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    return {
      success: true,
      message: "Draft listing deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting draft listing", error);
    if (error instanceof Error && error.message.includes("not found")) {
      throw error;
    }
    throw new NotFoundError("Failed to delete draft listing");
  }
}
