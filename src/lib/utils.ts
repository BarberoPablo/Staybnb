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
