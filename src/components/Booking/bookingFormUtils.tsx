import { ListingDetails } from "@/lib/api/listings/listings.schema";
import { dateToString } from "@/lib/api/reservations/utils";
import { LISTING_GUESTS } from "@/lib/api/shared/listing/listing.fragments.schema";
import { Guests, UnavailableDates } from "@/lib/types";
import { validateDateRange } from "@/lib/utils";
import { format } from "date-fns";

export const bookingColors = {
  checkIn: "bg-myGreenSemiBold",
  checkOut: "bg-myGreenBold",
};

export function calendarDot(color: string, children: React.ReactNode, absolute: boolean = true) {
  return (
    <div
      className={`${absolute && "absolute"} bottom-4 right-0.5 h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${color}`}
    >
      {children}
    </div>
  );
}

export type FormErrors = Partial<Record<Guests | "dateRange", string>>;

export function excludeDate(dates: Date[], dateToExclude: Date): Date[] {
  return dates.filter((date) => date.getTime() !== dateToExclude.getTime());
}

export function validateFormData(startDate: Date, endDate: Date, guests: Record<Guests, number>, listing: ListingDetails): FormErrors {
  const errors: FormErrors = {};
  const dateError = validateDateRange(startDate, endDate);

  if (dateError) {
    errors.dateRange = dateError;
  }

  for (const key of LISTING_GUESTS) {
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
    const dayString = dateToString(day);
    const allUnavailableCheckInDates = disabledDates.unavailableCheckInDates.all;
    const allUnavailableCheckOutDates = disabledDates.unavailableCheckOutDates.all;

    const isCheckOutOnly = allUnavailableCheckInDates.some((d) => d === dayString) && !allUnavailableCheckOutDates.some((d) => d === dayString);
    const isCheckInOnly = allUnavailableCheckOutDates.some((d) => d === dayString) && !allUnavailableCheckInDates.some((d) => d === dayString);

    let dot = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isCheckInOnly && day >= today) {
      dot = calendarDot(bookingColors.checkIn, "in");
    }

    if (isCheckOutOnly && day >= today) {
      dot = calendarDot(bookingColors.checkOut, "out");
    }

    return (
      <div>
        {dot}
        <span>{format(day, "d")}</span>
      </div>
    );
  };
}
