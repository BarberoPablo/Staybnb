"use client";

import Tooltip from "@/components/Tooltip";
import { DateRangeKey, Guests, UnavailableDates } from "@/lib/types";
import { ListingWithReservations } from "@/lib/types/listing";
import { buildListingParams, calculateNights, createUTCDate, getDisabledDates, getListingPromotion, listingGuests } from "@/lib/utils";
import { enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange } from "react-date-range";
import { IoCalendar, IoCheckmarkCircle, IoPeople } from "react-icons/io5";
import ListingPrice from "../ListingPrice";
import { excludeDate, getCustomDayContent, validateFormData } from "./bookingFormUtils";
import { CalendarLegend } from "./CalendarLegend";

export default function BookingForm({
  listing,
  priceFirst = false,
  children,
  onConfirm,
}: {
  listing: ListingWithReservations;
  priceFirst?: boolean;
  children?: ReactNode;
  onConfirm?: () => void;
}) {
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
    setGuests((prevState) => ({ ...prevState, [type]: prevState[type] + amount }));
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
      {/* Calendar Section */}
      {!priceFirst && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
            <IoCalendar className="w-5 h-5 text-myGreenBold" />
            Select Dates
          </div>
          <div className="relative">
            <CalendarLegend />
            <DateRange
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[errors.dateRange ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
              disabledDates={isSelectingCheckOut ? disabledDates.unavailableCheckOutDates.filtered : disabledDates.unavailableCheckInDates.filtered}
              dayContentRenderer={getCustomDayContent(disabledDates)}
            />
            {errors.dateRange && <Tooltip text={errors.dateRange} arrow={false} containerStyle={"top-[-6px]"} />}
          </div>
        </div>
      )}

      {/* Trip Summary */}
      <div className="bg-myGreenLight rounded-xl p-4 border border-myGreenBold/20">
        <div className="flex items-center gap-2 mb-3">
          <IoCalendar className="w-4 h-4 text-myGrayDark" />
          <span className="text-sm font-medium text-myGrayDark">Trip Summary</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-myGray">Nights:</span>
            <span className="font-semibold text-myGrayDark">{nights}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-myGray">Discount:</span>
            <span className="font-semibold text-myGreenBold">{discountPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-myGrayDark mb-3">Price Details</h4>
        <ListingPrice nightPrice={listing.nightPrice} nights={nights} discountPercentage={discountPercentage} promotions={listing.promotions} />
      </div>

      {/* Guests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
          <IoPeople className="w-5 h-5 text-myGreenBold" />
          Guests
        </div>

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
                  disabled={guests[type] === listing.guestLimits[type].min}
                  className="w-8 h-8 bg-myGreenLight hover:bg-myGreen text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, -1)}
                >
                  -
                </button>

                <span className="w-8 text-center font-semibold text-myGrayDark">{guests[type]}</span>

                <button
                  type="button"
                  disabled={guests[type] === listing.guestLimits[type].max}
                  className="w-8 h-8 bg-myGreenLight hover:bg-myGreen text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Section (when priceFirst is true) */}
      {priceFirst && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
            <IoCalendar className="w-5 h-5 text-myGreenBold" />
            Select Dates
          </div>

          <div className="relative">
            {errors.dateRange && <Tooltip text={errors.dateRange} containerStyle="top-[-6px]" arrow={false} />}
            <CalendarLegend />
            <DateRange
              locale={enUS}
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[errors.dateRange ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
              disabledDates={isSelectingCheckOut ? disabledDates.unavailableCheckOutDates.filtered : disabledDates.unavailableCheckInDates.filtered}
              dayContentRenderer={getCustomDayContent(disabledDates)}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        {children}
        <button
          type="submit"
          disabled={dateRange.startDate.getTime() >= dateRange.endDate.getTime() || Object.keys(errors).length > 0}
          className="w-full bg-myGreenBold hover:bg-myGreenDark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 hover:cursor-pointer"
        >
          <IoCheckmarkCircle className="w-5 h-5" />
          Reserve Now
        </button>
      </div>
    </form>
  );
}
