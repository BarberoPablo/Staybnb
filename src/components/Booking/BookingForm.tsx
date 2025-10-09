"use client";

import Tooltip from "@/components/Tooltip";
import { useQueryParams } from "@/hooks/useQueryParams";
import { parseFilters } from "@/lib/api/server/utils";
import { DateRangeKey, Guests, UnavailableDates } from "@/lib/types";
import { ListingWithReservations } from "@/lib/types/listing";
import { buildListingParams, calculateNights, createUTCDate, getDisabledDates, getListingPromotion, listingGuests } from "@/lib/utils";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode, useEffect, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange } from "react-date-range";
import { IoCalendar, IoCheckmarkCircle, IoPeople } from "react-icons/io5";
import { excludeDate, getCustomDayContent, validateFormData } from "./bookingFormUtils";
import { CalendarLegend } from "./CalendarLegend";
import { PriceSummary } from "./PriceSummary";
import PromotionsProgressBar from "./PromotionsProgressBar";

export default function BookingForm({ listing, children, onConfirm }: { listing: ListingWithReservations; children?: ReactNode; onConfirm?: () => void }) {
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const nights = calculateNights(dateRange.startDate, dateRange.endDate);
  const discountPercentage = getListingPromotion(listing, nights)?.discountPercentage || 0;
  const [disabledDates, setDisabledDates] = useState<UnavailableDates>({
    unavailableCheckInDates: { filtered: [], all: [] },
    unavailableCheckOutDates: { filtered: [], all: [] },
  });
  const [guests, setGuests] = useState<Record<Guests, number>>({
    adults: 1,
    children: 0,
    infant: 0,
    pets: 0,
  });
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Guests | "dateRange", string>>>({});

  const router = useRouter();
  const urlParams = useQueryParams(["startDate", "endDate", "adults", "children", "infant", "pets"]);

  useEffect(() => {
    if (Object.values(urlParams).some((value) => value !== undefined)) {
      const parsedFilters = parseFilters(urlParams);

      setGuests((prevGuests) => ({
        adults: parsedFilters.adults ?? prevGuests.adults,
        children: parsedFilters.children ?? prevGuests.children,
        infant: parsedFilters.infant ?? prevGuests.infant,
        pets: parsedFilters.pets ?? prevGuests.pets,
      }));

      if (parsedFilters.startDate && parsedFilters.endDate) {
        setDateRange((prevDateRange) => {
          const newDateRange = {
            startDate: parsedFilters.startDate!,
            endDate: parsedFilters.endDate!,
            key: "selection" as const,
          };

          const hasChanged =
            prevDateRange.startDate.getTime() !== newDateRange.startDate.getTime() || prevDateRange.endDate.getTime() !== newDateRange.endDate.getTime();

          return hasChanged ? newDateRange : prevDateRange;
        });
      }
    }
  }, [urlParams]);

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const { unavailableCheckInDates: disabledCheckInDates, unavailableCheckOutDates: disabledCheckOutDates } = getDisabledDates(listing.reservations);
        setDisabledDates({
          unavailableCheckInDates: { filtered: disabledCheckInDates, all: disabledCheckInDates },
          unavailableCheckOutDates: { filtered: disabledCheckOutDates, all: disabledCheckOutDates },
        });
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchReservedDates();
  }, [listing]);

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];

    if (selection?.startDate && selection?.endDate) {
      const { startDate, endDate, key } = selection;
      const userSelectedCheckOut = !isSelectingCheckOut;

      const newStartDate = createUTCDate(startDate.toISOString().substring(0, 10), listing.checkInTime, listing.location.timezone);
      const newEndDate = createUTCDate(endDate.toISOString().substring(0, 10), listing.checkOutTime, listing.location.timezone);

      setDateRange({ startDate: newStartDate, endDate: newEndDate, key });

      setDisabledDates((prevState) => {
        const filteredDates = { ...prevState };

        if (userSelectedCheckOut) {
          filteredDates.unavailableCheckOutDates.filtered = excludeDate(filteredDates.unavailableCheckOutDates.all, newStartDate);
        } else {
          filteredDates.unavailableCheckInDates.filtered = excludeDate(filteredDates.unavailableCheckInDates.all, newEndDate);
        }
        return filteredDates;
      });
      setIsSelectingCheckOut(userSelectedCheckOut);
      setErrors({});
    }
  };

  const handleGuest = (type: Guests, amount: number) => {
    const newGuests = { ...guests, [type]: guests[type] + amount };
    const totalGuests = newGuests.adults + newGuests.children + newGuests.infant;

    // Check if total exceeds structure.guests
    if (totalGuests > listing.structure.guests) {
      setErrors({
        ...errors,
        [type]: `Maximum ${listing.structure.guests} guests allowed. Current total: ${totalGuests}`,
      });
      return;
    }

    setGuests(newGuests);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!dateRange.startDate || !dateRange.endDate) {
      setErrors({ dateRange: "Select a valid date range." });
      return;
    }

    const validationErrors = validateFormData(dateRange.startDate, dateRange.endDate, guests, listing);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onConfirm?.();

    const query = buildListingParams(guests, dateRange.startDate, dateRange.endDate);
    router.push(`/checkout/${listing.id}?${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
          <IoPeople className="w-5 h-5 text-myGreenSemiBold" />
          Guests
          <span className="text-sm font-normal text-myGray">(max {listing.structure.guests})</span>
        </div>

        <p className="text-xs text-myGray">Note: Pets do not count toward the guest limit</p>

        <div className="space-y-3">
          {listingGuests.map((type) => (
            <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <label className="capitalize font-medium text-myGrayDark min-w-[60px]">{type}</label>
                {errors[type] && <Tooltip text={errors[type]} />}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={guests[type] <= listing.guestLimits[type].min}
                  className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen hover:cursor-pointer text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, -1)}
                >
                  -
                </button>

                <span className="w-8 text-center font-semibold text-myGrayDark">{guests[type]}</span>

                <button
                  type="button"
                  disabled={
                    guests[type] >= listing.guestLimits[type].max ||
                    guests.adults + guests.children + guests.infant + (type === "adults" ? 1 : type === "children" ? 1 : type === "infant" ? 1 : 0) >
                      listing.structure.guests
                  }
                  className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen hover:cursor-pointer text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
          <IoCalendar className="w-5 h-5 text-myGreenSemiBold" />
          Select Dates
        </div>
        <div className="relative flex flex-col w-full justify-center items-center">
          <CalendarLegend />
          <div className="min-h-[380px] flex flex-col items-center justify-start">
            <DateRange
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[errors.dateRange ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
              disabledDates={isSelectingCheckOut ? disabledDates.unavailableCheckOutDates.filtered : disabledDates.unavailableCheckInDates.filtered}
              dayContentRenderer={getCustomDayContent(disabledDates)}
            />
          </div>
          {errors.dateRange && <Tooltip text={errors.dateRange} arrow={false} containerStyle={"top-[-6px]"} />}
        </div>
      </div>

      {/* Promotions Progress Bar */}
      {listing.promotions && listing.promotions.length > 0 && (
        <div className="bg-background rounded-xl pl-4 pr-10 pt-3 pb-10 border border-gray-200">
          <PromotionsProgressBar promotions={listing.promotions} currentNights={nights} />
        </div>
      )}

      <PriceSummary nights={nights} listing={listing} discountPercentage={discountPercentage} />

      {/* Submit Button */}
      <div className="pt-4">
        {children}
        <button
          type="submit"
          disabled={dateRange.startDate.getTime() >= dateRange.endDate.getTime() || Object.keys(errors).length > 0}
          className="w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 hover:cursor-pointer"
        >
          <IoCheckmarkCircle className="w-5 h-5" />
          Reserve Now
        </button>
      </div>
    </form>
  );
}
