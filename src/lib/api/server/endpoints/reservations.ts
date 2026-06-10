"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveStatus } from "@/lib/server-utils";
import { ListingDB } from "@/lib/types/listing";
import { parseListingFromDB } from "../../../parsers/listing";
import { parseReservationsFromDB } from "../../../parsers/reservation";
import { createClient } from "../../../supabase/server";
import { ReservationDB } from "../../../types/reservation";
import { fetchCreateReservation, fetchListingUnavailableDates, fetchUserReservations } from "../../reservations/reservations.http";
import { CreateReservation } from "../../reservations/reservations.schema";
import { NotFoundError } from "../errors";

export async function getListingUnavailableDates(listingId: string) {
  return fetchListingUnavailableDates(listingId);
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
  return fetchUserReservations();
}

export async function createReservation(id: string, reservationData: CreateReservation) {
  return fetchCreateReservation(id, reservationData);
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
