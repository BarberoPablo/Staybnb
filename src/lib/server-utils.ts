import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { ReservationStatusDB } from "./types/reservation";

// DOMPurify config for Node.js
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function cleanString(value?: unknown): string {
  return typeof value === "string" ? DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [] }) : "";
}

export const PROFILE_PATCH_ALLOWED_FIELDS = ["first_name", "last_name", "avatar_url", "bio"] as const;

// Function to determine the effective status of a reservation
export function getEffectiveStatus(currentStatus: ReservationStatusDB, startDate: string, endDate: string): ReservationStatusDB {
  if (currentStatus === "canceled" || currentStatus === "canceled_by_host") {
    return currentStatus;
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start || (now >= start && now <= end)) {
    return "upcoming";
  } else if (now > end) {
    return "completed";
  }

  return currentStatus;
}
