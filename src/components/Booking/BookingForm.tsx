"use client";

import Tooltip from "@/components/Tooltip";
import { getReservedDates } from "@/lib/supabase/reservations";
import { DateRangeKey, Guests, Listing, UnavailableDates } from "@/lib/types";
import { buildListingParams, calculateTotal, getDisabledDates, listingGuests } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ListingPrice from "../ListingPrice";
import { excludeDate, getCustomDayContent, validateFormData } from "./bookingFormUtils";
import { CalendarLegend } from "./CalendarLegend";

export default function BookingForm({
  listing,

  priceFirst = false,
  children,
  onConfirm,
}: {
  listing: Listing;
  priceFirst?: boolean;
  children?: ReactNode;
  onConfirm?: () => void;
}) {
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
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
        const response = await getReservedDates(listing.id);
        const { unavailableCheckInDates: disabledCheckInDates, unavailableCheckOutDates: disabledCheckOutDates } = getDisabledDates(response);
        setDisabledDates({
          unavailableCheckInDates: { filtered: disabledCheckInDates, all: disabledCheckInDates },
          unavailableCheckOutDates: { filtered: disabledCheckOutDates, all: disabledCheckOutDates },
        });
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchReservedDates();
  }, [listing.id]);

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];

    if (selection?.startDate && selection?.endDate) {
      const { startDate, endDate, key } = selection;
      const userSelectedCheckOut = !isSelectingCheckOut;

      setDateRange({ startDate, endDate, key });
      setDisabledDates((prevState) => {
        const filteredDates = { ...prevState };

        if (userSelectedCheckOut) {
          filteredDates.unavailableCheckOutDates.filtered = excludeDate(filteredDates.unavailableCheckOutDates.all, startDate);
        } else {
          filteredDates.unavailableCheckInDates.filtered = excludeDate(filteredDates.unavailableCheckInDates.all, endDate);
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
    <form onSubmit={handleSubmit}>
      {!priceFirst && (
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
      )}
      <div className="flex sm:mt-4">
        <ListingPrice summary={calculateTotal(dateRange.startDate, dateRange.endDate, listing)} listing={listing} />
        <div>
          {listingGuests.map((type) => (
            <div key={type} className="flex gap-5">
              <div className="relative">
                <label className="capitalize">{type}</label>
                {errors[type] && <Tooltip text={errors[type]} />}
              </div>
              <button
                type="button"
                disabled={guests[type] === listing.guestLimits[type].min}
                className="bg-myGreen rounded-full w-6 h-6 hover:cursor-pointer"
                onClick={() => handleGuest(type, -1)}
              >
                -
              </button>
              <label>{guests[type]}</label>
              <button
                type="button"
                disabled={guests[type] === listing.guestLimits[type].max}
                className="bg-myGreen rounded-full w-6 h-6 hover:cursor-pointer"
                onClick={() => handleGuest(type, 1)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {priceFirst && (
        <div className="relative">
          {errors.dateRange && <Tooltip text={errors.dateRange} containerStyle="top-[-6px]" arrow={false} />}

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
        </div>
      )}

      <div className="flex justify-center gap-10">
        {children}

        <button
          type="submit"
          disabled={dateRange.startDate.getTime() >= dateRange.endDate.getTime() || Object.keys(errors).length > 0}
          className="px-4 py-2 bg-myGreen text-white rounded-4xl"
        >
          Reserve
        </button>
      </div>
    </form>
  );
}
