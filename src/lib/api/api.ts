import { ListingForm } from "@/store/useListingForm";
import { parseFavoritesWithListingFromDB, parseFavoriteWithListingFromDB } from "../parsers/favorites";
import { parseHostListingsWithReservations, parseListingFormData, parseListingFromDB } from "../parsers/listing";
import { parseCreateProfile, parseProfileFromDB, parseUpdateProfile } from "../parsers/profile";
import { parseListingReservedDatesDB, parseReservationsFromDB, parseResumedReservationWithListingFromDB } from "../parsers/reservation";
import { GetListingsParams } from "../types";
import { FavoriteWithListing, FavoriteWithListingDB } from "../types/favorites";
import { HostListingsWithReservationsDB, ListingDB } from "../types/listing";
import { CreateProfile, Profile, ProfileDB, UpdateProfile } from "../types/profile";
import { CreateReservation, ListingReservedDatesDB, ReservationDB, ResumedReservationWithListingDB } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const endpoint = {
  // listing
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
  createListing: `${baseUrl}/api/listings`,
  //NOT BEING USED getListing: (id: number) => `${baseUrl}/api/listings/${id}`,
  // listing-host
  getHostListings: () => `${baseUrl}/api/host/listings?includeReservations=false`,
  getHostListingsWithReservations: () => `${baseUrl}/api/host/listings?includeReservations=true`,
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
  getUserReservations: () => `${baseUrl}/api/reservations`,
  getListingReservations: (listingId: number) => `${baseUrl}/api/reservations/${listingId}`,
  createReservation: `${baseUrl}/api/reservations`,
  cancelReservation: (id: string) => `${baseUrl}/api/reservations/${id}/cancel`,
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
  async getUserReservations() {
    const { data } = await customFetch.get<ResumedReservationWithListingDB[]>(endpoint.getUserReservations());
    const parsedData = parseResumedReservationWithListingFromDB(data);
    return parsedData;
  },
  async getListingReservations(listingId: number) {
    const { data } = await customFetch.get<ListingReservedDatesDB>(endpoint.getListingReservations(listingId));
    const parsedData = parseListingReservedDatesDB(data);
    return parsedData;
  },
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(params: GetListingsParams) {
    const query = new URLSearchParams();

    if (params.city) query.append("city", params.city);

    if (params.zoom && params.northEast && params.southWest) {
      query.append("northEast", `${params.northEast.lat},${params.northEast.lng}`);
      query.append("southWest", `${params.southWest.lat},${params.southWest.lng}`);
      query.append("zoom", `${params.zoom}`);
    }
    if (params.includeAmenities) {
      query.append("includeAmenities", "true");
    }

    if (params.amenities) {
      query.append("amenities", params.amenities.join(","));
    }

    if (params.offset) {
      query.append("offset", params.offset.toString());
    }
    if (params.limit) {
      query.append("limit", params.limit.toString());
    }

    console.log("Query API: ", query.toString());

    const { data } = await customFetch.get<ListingDB[]>(endpoint.getListings(query.toString()));
    const parsedListings = data.map((listing) => parseListingFromDB(listing));
    return parsedListings;
  },
  /* async getListing(id: number) {
    const { data } = await customFetch.get<ListingWithReservationsDB>(endpoint.getListing(id));
    const parsedData = parseListingWithReservationsFromDB(data);
    return parsedData;
  }, */
  async createListing(data: ListingForm) {
    const parsedListingFormData = parseListingFormData(data);
    return await customFetch.post(endpoint.createListing, { ...parsedListingFormData });
  },
  async cancelReservation(id: string) {
    return await customFetch.patch(endpoint.cancelReservation(id));
  },
  async getHostListingsWithReservations() {
    const { data } = await customFetch.get<HostListingsWithReservationsDB[]>(endpoint.getHostListingsWithReservations());
    const parsedListingsWithReservations = parseHostListingsWithReservations(data);
    return parsedListingsWithReservations;
  },
  async getHostListings() {
    const { data } = await customFetch.get<ListingDB[]>(endpoint.getHostListings());
    const parsedHostListings = data.map((listing) => parseListingFromDB(listing));
    return parsedHostListings;
  },
  async getHostListingReservations(ListingId: number) {
    const { data } = await customFetch.get<ReservationDB[]>(endpoint.getHostListingReservations(ListingId));
    const parsedHostListings = parseReservationsFromDB(data);
    return parsedHostListings;
  },
};
