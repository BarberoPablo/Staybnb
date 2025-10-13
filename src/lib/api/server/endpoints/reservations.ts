"use server";

import { formatGuestsForEmail, sendReservationConfirmationEmail } from "@/lib/email";
import type { ReservationEmailData } from "@/lib/email/types";
import { prisma } from "@/lib/prisma";
import { getEffectiveStatus } from "@/lib/server-utils";
import { Guests } from "@/lib/types";
import { ListingDB, Location, ReviewDB, ScoreDB, Structure } from "@/lib/types/listing";
import { parseListingFromDB } from "../../../parsers/listing";
import { parseReservationsFromDB, parseResumedReservationWithListingFromDB } from "../../../parsers/reservation";
import { createClient } from "../../../supabase/server";
import { CreateReservation, ReservationDB, ResumedReservationWithListingDB } from "../../../types/reservation";
import { calculateNights, getListingPromotionDB, getTotalGuests, twoDecimals } from "../../../utils";
import { NotFoundError } from "../errors";

export async function getListingReservations(listingId: number) {
  try {
    if (!listingId || isNaN(Number(listingId))) {
      throw new Error("Invalid listing ID");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const listing = await prisma.listings.findUnique({
      where: {
        id: Number(listingId),
      },
      select: {
        id: true,
        location: true,
        check_in_time: true,
        check_out_time: true,
        reservations: {
          where: {
            status: "upcoming",
            end_date: {
              gte: today,
            },
          },
          select: {
            start_date: true,
            end_date: true,
          },
          orderBy: {
            start_date: "desc",
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    const location = listing.location as Location;

    return {
      reservations: listing.reservations.map((reservation) => ({
        startDate: reservation.start_date,
        endDate: reservation.end_date,
      })),
      listing: {
        timezone: location.timezone,
        checkInTime: listing.check_in_time,
        checkOutTime: listing.check_out_time,
      },
    };
  } catch (err) {
    console.error("Server error:", err);
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new NotFoundError("Unexpected error occurred");
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
        title: true,
        night_price: true,
        promotions: true,
        status: true,
        host_id: true,
        guest_limits: true,
        structure: true,
        location: true,
        images: true,
        check_in_time: true,
        check_out_time: true,
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

    // Send confirmation email
    try {
      const userProfile = await prisma.profiles.findUnique({
        where: { id: user.id },
        select: { first_name: true, last_name: true },
      });

      const hostProfile = await prisma.profiles.findUnique({
        where: { id: listing.host_id },
        select: { first_name: true, last_name: true, avatar_url: true },
      });

      const location = listing.location as unknown as Location;
      const listingImages = Array.isArray(listing.images) ? listing.images : [];

      const emailData: ReservationEmailData = {
        // User information
        userEmail: user.email!,
        userName: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "Guest",

        // Reservation details
        reservationId: reservation.id,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        guests: formatGuestsForEmail(reservationData.guests),
        totalNights: nights,
        totalPrice: totalPrice,
        nightPrice: Number(listing.night_price),
        discount: discount > 0 ? discount : undefined,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,

        // Listing information
        listingId: listing.id,
        listingTitle: listing.title,
        listingImages: listingImages,
        listingAddress: location.formatted || `${location.city || ""}, ${location.country || ""}`.trim(),
        checkInTime: listing.check_in_time || "Flexible",
        checkOutTime: listing.check_out_time || "Flexible",

        // Host information
        hostName: hostProfile ? `${hostProfile.first_name} ${hostProfile.last_name}` : "Host",
        hostAvatarUrl: hostProfile?.avatar_url,
      };

      // Send email asynchronously
      sendReservationConfirmationEmail(emailData).catch((emailError) => {
        // Don't throw error - email failure shouldn't break reservation creation
        console.error("Failed to send reservation confirmation email:", emailError);
      });
    } catch (emailError) {
      // Don't throw error - email failure shouldn't break reservation creation
      console.error("Error preparing email data:", emailError);
    }

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
