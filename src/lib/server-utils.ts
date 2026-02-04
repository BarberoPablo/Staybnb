import { ReservationStatusDB } from "./types/reservation";
import sanitizeHtml from "sanitize-html";

export function cleanString(value?: unknown): string {
  if (typeof value !== "string") return "";
  return sanitizeHtml(value.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });
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
