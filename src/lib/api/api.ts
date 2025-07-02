import customFetch from "./fetch";
import { CreateReservation } from "@/lib/types";

const baseUrl = ""; // Empty string for local run

export const endpoint = {
  createReservation: `${baseUrl}/api/reservations`,
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
};

export const api = {
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(city: string) {
    return await customFetch.get(endpoint.getListings(`city=${city}`));
  },
};
