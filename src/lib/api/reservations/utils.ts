import { OptionalGuests } from "../shared/listing/listing.fragments.schema";

/* Transforms a date string to a UTC Date for Calendar purposes */
export function toUTCDate(dateString: string): Date {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function excludeStringDate(dates: string[], dateToExclude: string): string[] {
  return dates.filter((date) => date !== dateToExclude);
}

/**
 * Validates if a date range is available, considering blocked dates.
 * @param startDate start date of the range
 * @param endDate end date of the range
 * @param blockedDates array of blocked date strings
 * @returns boolean indicating if the date range is available
 */
export function unavailableDateRange(startDate: Date, endDate: Date, blockedDates: string[], userIsSelectingCheckOut?: boolean) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (userIsSelectingCheckOut) {
    if (blockedDates.includes(end)) return true;
  } else {
    if (blockedDates.includes(start)) return true;
  }

  return blockedDates.some((blocked) => blocked > start && blocked < end);
}

/**
 * Parses a date string into a Date object for calendar purposes.
 * @param dateString date string in the format "YYYY-MM-DD"
 * @returns Date object
 */
export function parseCalendarDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  date.setHours(12, 0, 0, 0);

  return date;
}

/**
 * Parses an array of date strings into an array of Date objects for calendar purposes.
 * @param dateStrings array of date strings in the format "YYYY-MM-DD"
 * @returns array of Date objects
 */
export function parseStringsToCalendarDates(dateStrings: string[]): Date[] {
  return dateStrings.map(parseCalendarDate);
}

/**
 * Formats a Date object into a string in the format "YYYY-MM-DD".
 * @param date date to be formatted
 * @returns string in the format "YYYY-MM-DD"
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTotalGuests(guests: OptionalGuests): number {
  return Object.values(guests).reduce((total, count) => total + count, 0);
}
