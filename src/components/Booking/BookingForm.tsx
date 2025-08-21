"use client";

import Tooltip from "@/components/Tooltip";
import { DateRangeKey, Guests, UnavailableDates } from "@/lib/types";
import { ListingWithReservations } from "@/lib/types/listing";
import { buildListingParams, calculateNights, createUTCDate, getDisabledDates, getListingPromotion, getTotalPrice, listingGuests } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange } from "react-date-range";
import { IoCalendar, IoCheckmarkCircle, IoPeople, IoPricetag } from "react-icons/io5";
import { excludeDate, getCustomDayContent, validateFormData } from "./bookingFormUtils";
import { CalendarLegend } from "./CalendarLegend";
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
      {/* Price and Nights Summary - Always at the top */}
      <div className="bg-gradient-to-r from-myGreenExtraLight to-myGreenSemiBold/10 rounded-xl p-4 border border-myGreenSemiBold/20">
        <div className="flex items-center gap-2 mb-3">
          <IoPricetag className="w-5 h-5 text-myGreenSemiBold" />
          <span className="text-lg font-semibold text-myGrayDark">Price Summary</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-myGray">Selected:</span>
            <span className="font-bold text-lg text-myGrayDark">
              {nights} night{nights > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-myGray">Price per night:</span>
            <span className="font-semibold text-myGrayDark">${listing.nightPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-myGray">Discount:</span>
            {discountPercentage > 0 ? (
              <span className="font-semibold text-myGreenSemiBold">
                {(getTotalPrice(nights, listing.nightPrice) * discountPercentage) / 100} USD ({discountPercentage}% off)
              </span>
            ) : (
              <span className="font-semibold text-myGrayDark">-</span>
            )}
          </div>
          <div className="border-t border-myGreenSemiBold/20 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-myGrayDark">Total:</span>
              <div className="flex items-center gap-2">
                {discountPercentage ? (
                  <span className="text-myGray text-lg font-medium line-through decoration-2 decoration-myGray/70">
                    ${getTotalPrice(nights, listing.nightPrice).toFixed(2)}
                  </span>
                ) : null}
                <span className="text-myGrayDark text-xl font-bold">${getTotalPrice(nights, listing.nightPrice, discountPercentage).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Progress Bar */}
      {listing.promotions && listing.promotions.length > 0 && (
        <div className="bg-background rounded-xl pl-4 pr-10 pt-3 pb-10 border border-gray-200">
          <PromotionsProgressBar promotions={listing.promotions} currentNights={nights} />
        </div>
      )}

      {/* Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
          <IoCalendar className="w-5 h-5 text-myGreenSemiBold" />
          Select Dates
        </div>
        <div className="relative flex flex-col w-full justify-center items-center">
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

      {/* Guests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-myGrayDark">
          <IoPeople className="w-5 h-5 text-myGreenSemiBold" />
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
                  className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, -1)}
                >
                  -
                </button>

                <span className="w-8 text-center font-semibold text-myGrayDark">{guests[type]}</span>

                <button
                  type="button"
                  disabled={guests[type] === listing.guestLimits[type].max}
                  className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGuest(type, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
