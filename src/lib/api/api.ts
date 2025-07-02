import customFetch from "./fetch";
import { CreateReservation } from "@/lib/types";

const baseUrl = ""; // Empty string for local run

export const endpoint = {
  createReservation: `${baseUrl}/api/reservations`,
};

export const api = {
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
};
