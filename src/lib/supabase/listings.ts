import { mockListings } from "../mockListings";
import { parseListingFromDB } from "../parsers/listing";
import { Listing } from "../types/listing";

export async function getListing(id: number): Promise<Listing> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const listing = mockListings.find((listing) => listing.id === id);
      if (listing) {
        const parsedListing = parseListingFromDB(listing);
        resolve(parsedListing);
      } else {
        reject(new Error("Listing not found"));
      }
    }, 100);
  });
}
