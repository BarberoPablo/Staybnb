import { Guests, Listing, UnavailableDates } from "@/lib/types";
import { listingGuests, validateDateRange } from "@/lib/utils";
import { format, isSameDay } from "date-fns";

export const bookingColors = {
  checkIn: "bg-blue-500",
  checkOut: "bg-yellow-400",
};

export type FormErrors = Partial<Record<Guests | "dateRange", string>>;

export function excludeDate(dates: Date[], dateToExclude: Date): Date[] {
  return dates.filter((date) => date.getTime() !== dateToExclude.getTime());
}

export function validateFormData(startDate: Date, endDate: Date, guests: Record<Guests, number>, listing: Listing): FormErrors {
  const errors: FormErrors = {};
  const dateError = validateDateRange(startDate, endDate);

  if (dateError) {
    errors.dateRange = dateError;
  }

  for (const key of listingGuests) {
    const value = guests[key];
    const { max, min } = listing.guestLimits[key];
    if (value > max || value < min) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be between ${min} and ${max}.`;
      return errors;
    }
  }

  return errors;
}

export function getCustomDayContent(disabledDates: UnavailableDates) {
  return function customDayContent(day: Date) {
    const { unavailableCheckInDates, unavailableCheckOutDates } = disabledDates;

    const isCheckOutOnly = unavailableCheckInDates.all.some((d) => isSameDay(d, day)) && !unavailableCheckOutDates.all.some((d) => isSameDay(d, day));

    const isCheckInOnly = unavailableCheckOutDates.all.some((d) => isSameDay(d, day)) && !unavailableCheckInDates.all.some((d) => isSameDay(d, day));

    let dot = null;

    if (isCheckInOnly) {
      dot = <div className={`absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-[50%] ${bookingColors.checkIn}`} />;
    }

    if (isCheckOutOnly) {
      dot = <div className={`absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-[50%] ${bookingColors.checkOut}`} />;
    }

    return (
      <div>
        {dot}
        <span>{format(day, "d")}</span>
      </div>
    );
  };
}
