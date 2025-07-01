import { addDays, eachDayOfInterval, subDays } from "date-fns";
import { Guests, Listing, ListingSummary, ReservedDates } from "./types";

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const listingGuests: Guests[] = ["adults", "children", "infant", "pets"];

export function calculateTotal(startDate: Date, endDate: Date, listing: Listing): ListingSummary {
  const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const baseTotal = nights * listing.price;

  const promotion = listing.promotions?.find((promo) => nights >= promo.minNights);
  if (promotion) {
    const discountPercentage = promotion.discountPercentage;
    const discount = (discountPercentage / 100) * baseTotal;
    return { nights, baseTotal, discount, discountPercentage, total: baseTotal - discount };
  }

  return { nights, baseTotal, total: baseTotal, discount: 0, discountPercentage: 0 };
}

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

export const listingQueryParams = ["startDate", "endDate", "adults", "children", "infant", "pets"];

export function createListingData(params: Partial<Record<string, string>>, listing: Listing) {
  const guests = Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => listingGuests.includes(key as Guests) && value !== "0")
      .map(([key, value]) => [key, Number(value)])
  ) as Record<Guests, number>;
  const startDate = params.startDate ? new Date(params.startDate) : new Date();
  const endDate = params.endDate ? new Date(params.endDate) : new Date();
  const summary = calculateTotal(startDate, endDate, listing);

  return { guests, startDate, endDate, summary };
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

export function getDisabledDates(reservedDates: ReservedDates[]): { unavailableCheckInDates: Date[]; unavailableCheckOutDates: Date[] } {
  // Block all days in between the dates
  const unavailableCheckInDates: Date[] = [];
  const unavailableCheckOutDates: Date[] = [];

  reservedDates.forEach((reservation) => {
    const start = normalizeDate(addDays(reservation.startDate, 1));
    const end = normalizeDate(subDays(reservation.endDate, 1));

    // Add all checkin dates to unavailable unavailableCheckInDates
    unavailableCheckInDates.push(normalizeDate(reservation.startDate));
    console.log("Start date", reservation.startDate);
    // Add all checkout dates to unavailable unavailableCheckOutDates
    unavailableCheckOutDates.push(normalizeDate(reservation.endDate));
    console.log("End date", reservation.endDate);

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
