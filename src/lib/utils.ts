import { Guests } from "./types";

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const listingGuests: Guests[] = ["adults", "children", "infant", "pets"];
