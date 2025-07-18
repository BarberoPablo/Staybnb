import { addDays, eachDayOfInterval, subDays } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { Guests, ListingSearchParams } from "./types";
import { Listing, Location, Promotion } from "./types/listing";
import { ReservedDate } from "./types/reservation";

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const listingGuests: Guests[] = ["adults", "children", "infant", "pets"];

export const displayGuestLabel = (type: Guests, value: number) => {
  const singular = {
    adults: "adult",
    children: "child",
    infant: "infant",
    pets: "pet",
  };
  const plural = {
    adults: "adults",
    children: "children",
    infant: "infants",
    pets: "pets",
  };
  return `${value} ${value === 1 ? singular[type] : plural[type]}`;
};

export function buildListingParams(guests: Record<Guests, number>, startDate: Date, endDate: Date) {
  let query = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

  for (const [guest, count] of Object.entries(guests)) {
    if (count > 0) {
      query += `&${guest}=${count}`;
    }
  }

  return query;
}

export const listingQueryParams = ["startDate", "endDate", "adults"] as const;

export const listingOptionalQueryParams = ["children", "infant", "pets"] as const;

export function getGuestsFromParams(params: ListingSearchParams) {
  const guests = Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => listingGuests.includes(key as Guests) && value !== "0")
      .map(([key, value]) => [key, Number(value)])
  ) as Record<Guests, number>;

  return guests;
}

export function validateDateRange(startDate: Date, endDate: Date) {
  if (startDate.getTime() === endDate.getTime()) {
    return "Check-in and check-out can't be the same day";
  }

  if (startDate.getTime() > endDate.getTime()) {
    return "Check-in should be prior to check-out";
  }
  return "";
}

export function getDisabledDates(reservedDates: ReservedDate[]): { unavailableCheckInDates: Date[]; unavailableCheckOutDates: Date[] } {
  // Block all days in between the dates
  const unavailableCheckInDates: Date[] = [];
  const unavailableCheckOutDates: Date[] = [];

  reservedDates.forEach((reservation) => {
    const start = normalizeDate(addDays(reservation.startDate, 1));
    const end = normalizeDate(subDays(reservation.endDate, 1));

    // Add all checkin dates to unavailable unavailableCheckInDates
    unavailableCheckInDates.push(normalizeDate(reservation.startDate));
    // Add all checkout dates to unavailable unavailableCheckOutDates
    unavailableCheckOutDates.push(normalizeDate(reservation.endDate));

    if (start <= end) {
      // Block all days in between the dates
      unavailableCheckInDates.push(...eachDayOfInterval({ start, end }));
      unavailableCheckOutDates.push(...eachDayOfInterval({ start, end }));
    }
  });

  return { unavailableCheckInDates, unavailableCheckOutDates };
}

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calculateNights(startDate: Date, endDate: Date) {
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getListingPromotion(listing: Listing, nights: number): Promotion | null {
  const promos = listing.promotions?.filter((promo) => promo.minNights <= nights);
  return promos.length > 0 ? promos[promos.length - 1] : null;
}

export function twoDecimals(data: number): number {
  return Number(data.toFixed(2));
}

export async function reverseGeocode(lat: number, lng: number): Promise<Location | string> {
  try {
    const api_key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${api_key}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const locationInfo = {
      lat: data.features[0].properties.lat,
      lng: data.features[0].properties.lon,
      formatted: data.features[0].properties.formatted,
      housenumber: data.features[0].properties.housenumber,
      street: data.features[0].properties.street,
      city: data.features[0].properties.city,
      postcode: data.features[0].properties.state_code + " " + data.features[0].properties.postcode,
      country: data.features[0].properties.country,
      state: data.features[0].properties.state,
      timezone: data.features[0].properties.timezone.name,
    };

    return locationInfo;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown location";
  }
}

// Converts local date and time strings in a given timezone to a UTC Date object
export function createUTCDate(date: string, time: string, timezone: string) {
  const dateTimeString = `${date}T${time}:00`;
  const dateInZone = fromZonedTime(dateTimeString, timezone);
  return dateInZone;
}

// Converts a UTC Date to a Date object adjusted to the given timezone for display
export function createTimezoneDate(date: Date, timezone: string) {
  const dateInZone = toZonedTime(date, timezone);
  return dateInZone;
}
