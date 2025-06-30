import { mockListings } from "../mockListings";
import { parseListingFromDB } from "../parser";
import { Listing } from "../types";

export async function getListings(location: string): Promise<Listing[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredListings = mockListings.filter((place) => place.location.toLowerCase().includes(location?.toLowerCase() || ""));
      const parsedListings = filteredListings.map((listing) => parseListingFromDB(listing));

      resolve(parsedListings);
    }, 100);
  });
}

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
