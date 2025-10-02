import { parseFavoritesWithListingFromDB, parseFavoriteWithListingFromDB } from "../parsers/favorites";
import { parseCreateProfile, parseProfileFromDB, parseUpdateProfile } from "../parsers/profile";
import { parseListingReservedDatesDB, parseReservationsFromDB } from "../parsers/reservation";
import { FavoriteWithListing, FavoriteWithListingDB } from "../types/favorites";
import { CreateProfile, Profile, ProfileDB, UpdateProfile } from "../types/profile";
import { ListingReservedDatesDB, ReservationDB } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const endpoint = {
  getHostListingReservations: (id: number) => `${baseUrl}/api/host/listings/${id}/reservations`,
  // profile
  getProfile: `${baseUrl}/api/profile`,
  updateProfile: `${baseUrl}/api/profile`,
  // favorites
  getFavorites: `${baseUrl}/api/favorites`,
  createFavorites: `${baseUrl}/api/favorites`,
  deleteFavorites: (id: number) => `${baseUrl}/api/favorites/${id}`,
  // auth
  signUp: `${baseUrl}/api/signUp`,
  // reservations
  getListingReservations: (listingId: number) => `${baseUrl}/api/reservations/${listingId}`,
};

export const api = {
  async getProfile(): Promise<Profile | null> {
    try {
      const { data } = await customFetch.get<ProfileDB>(endpoint.getProfile);
      const parsedData = parseProfileFromDB(data);
      return parsedData;
    } catch (error) {
      // If profile was not found, return null (not an error)
      if (error instanceof Error && error.message === "Profile not found") {
        return null;
      }
      throw error; // Supabase errors
    }
  },
  async updateProfile(props: UpdateProfile) {
    const parsedProps = parseUpdateProfile(props);
    return await customFetch.patch(endpoint.updateProfile, parsedProps);
  },
  async getFavorites(): Promise<FavoriteWithListing[]> {
    const { data } = await customFetch.get<FavoriteWithListingDB[]>(endpoint.getFavorites);
    if (!data) return [];
    const parsedData = parseFavoritesWithListingFromDB(data);
    return parsedData;
  },
  async createFavorite(listingId: number): Promise<FavoriteWithListing> {
    const { data } = await customFetch.post<FavoriteWithListingDB>(endpoint.createFavorites, { listingId });
    const parsedData = parseFavoriteWithListingFromDB(data);
    return parsedData;
  },
  async deleteFavorite(id: number) {
    return await customFetch.del(endpoint.deleteFavorites(id));
  },
  async signUp(userData: CreateProfile) {
    const parsedUserData = parseCreateProfile(userData);
    return await customFetch.post(endpoint.signUp, { ...parsedUserData });
  },
  async getListingReservations(listingId: number) {
    const { data } = await customFetch.get<ListingReservedDatesDB>(endpoint.getListingReservations(listingId));
    const parsedData = parseListingReservedDatesDB(data);
    return parsedData;
  },
  async getHostListingReservations(ListingId: number) {
    const { data } = await customFetch.get<ReservationDB[]>(endpoint.getHostListingReservations(ListingId));
    const parsedHostListings = parseReservationsFromDB(data);
    return parsedHostListings;
  },
};
