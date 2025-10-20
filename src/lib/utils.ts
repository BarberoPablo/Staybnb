import { addDays, eachDayOfInterval, format, subDays } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import DOMPurify from "dompurify";
import { SearchParams } from "next/dist/server/request/search-params";
import { Guests, ListingSearchParams } from "./types";
import { Listing, ListingDB, Location, Promotion, PromotionDB } from "./types/listing";
import { CreateProfile, UpdateProfile } from "./types/profile";
import { ReservedDate } from "./types/reservation";

export const logoUrl = "https://i.postimg.cc/65bvWcTY/logo.png";
export const logoUrlReduced = "https://i.postimg.cc/WbfM7qCZ/logo-reduced.png";

export const windowWidth = {
  full: 1920,
  short: 1280,
  shortPath: (path: string) => path !== "/" && ["/listing/", "checkout"].some((shortPath) => path.includes(shortPath)),
};

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
  let query = `startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;

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
      .map(([key, value]) => [key, Number(value)]),
  ) as Record<Guests, number>;

  return guests;
}

export function getTotalGuests(guests: Record<Guests, number>) {
  return Object.values(guests).reduce((total, count) => total + count, 0);
}

export function getTotalPrice(nights: number, nightPrice: number, discountPercentage?: number) {
  const total = nights * nightPrice * (1 - (discountPercentage ?? 0) / 100);
  return total;
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

    unavailableCheckInDates.push(normalizeDate(reservation.startDate));
    unavailableCheckOutDates.push(normalizeDate(reservation.endDate));

    if (start <= end) {
      // Block all days in between the dates
      unavailableCheckInDates.push(...eachDayOfInterval({ start, end }));
      unavailableCheckOutDates.push(...eachDayOfInterval({ start, end }));
    }
  });

  return { unavailableCheckInDates, unavailableCheckOutDates };
}

/**
 * Normalizes a Date object by creating a new Date with only the date part (year, month, day) at midnight UTC.
 * This effectively strips the time component and timezone information from the original date.
 *
 * @param date - The Date object to normalize
 * @returns A new Date object representing the same calendar date at midnight UTC
 *
 * @example
 * // Input: Mon Nov 10 2025 19:00:00 GMT-0300
 * // Output: Nov 10, 2025 00:00:00 UTC
 * const normalized = normalizeDate(new Date('2025-11-10T19:00:00-03:00'));
 */
export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calculateNights(startDate: Date, endDate: Date) {
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getListingPromotion(listing: Listing, nights: number): Promotion | null {
  const sortedPromotions = [...listing.promotions].sort((a, b) => a.minNights - b.minNights);
  const promos = sortedPromotions?.filter((promo) => promo.minNights <= nights);
  return promos.length > 0 ? promos[promos.length - 1] : null;
}

export function getListingPromotionDB(listing: ListingDB, nights: number): PromotionDB | null {
  const sortedPromotions = [...listing.promotions].sort((a, b) => a.min_nights - b.min_nights);
  const promos = sortedPromotions?.filter((promo) => promo.min_nights <= nights);
  return promos.length > 0 ? promos[promos.length - 1] : null;
}

export function getPromotion(promotions: Promotion[], nights: number): Promotion | null {
  const sortedPromotions = [...promotions].sort((a, b) => a.minNights - b.minNights);
  const promos = sortedPromotions?.filter((promo) => promo.minNights <= nights);
  return promos.length > 0 ? promos[promos.length - 1] : null;
}

export function twoDecimals(data: number): number {
  return Number(data.toFixed(2));
}

export function twoDecimalsString(data: number): string {
  return data.toFixed(2);
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

export async function geocodeCity(cityName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const api_key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&apiKey=${api_key}&limit=1`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        lat: feature.properties.lat,
        lng: feature.properties.lon,
      };
    }

    return null;
  } catch (error) {
    console.error("City geocoding error:", error);
    return null;
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

export function showUTCDate(date: Date) {
  return format(date, "MMM d, yyyy HH:mm");
}

export function cleanString(value?: unknown): string {
  return typeof value === "string" ? DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [] }) : "";
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function verifyCreateProfileData(profileData: CreateProfile): CreateProfile {
  const avatarUrl = profileData.avatarUrl ? (isValidUrl(profileData.avatarUrl.trim()) ? profileData.avatarUrl.trim() : "") : "";
  return {
    firstName: cleanString(profileData.firstName),
    lastName: cleanString(profileData.lastName),
    bio: profileData.bio ? cleanString(profileData.bio.trim()) : "",
    avatarUrl,
  };
}

export function verifyUpdateProfileData(profileData: UpdateProfile): UpdateProfile {
  const data = verifyCreateProfileData(profileData);
  return {
    ...data,
  };
}

export function buildQueryStringFromParams(params: SearchParams | Record<string, string | number | Date | string[] | undefined>): string {
  console.log("PARAMS", params);
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      query.append(key, value.join(","));
    } else if (value instanceof Date) {
      query.append(key, value.toISOString());
    } else {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `&${queryString}` : "";
}
