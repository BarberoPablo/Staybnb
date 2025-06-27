import { Guests, Listing } from "./types";

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const listingGuests: Guests[] = ["adults", "children", "infant", "pets"];

export function calculateTotal(startDate: Date | undefined, endDate: Date | undefined, listing: Listing) {
  if (!startDate || !endDate) return { nights: 0, baseTotal: 0, total: 0 };

  const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const baseTotal = nights * listing.price;

  const promotion = listing.promotions?.find((promo) => nights >= promo.minNights);
  if (promotion) {
    const discount = (promotion.discountPercentage / 100) * baseTotal;
    return { nights, baseTotal, discount, total: baseTotal - discount };
  }

  return { nights, baseTotal, total: baseTotal };
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
