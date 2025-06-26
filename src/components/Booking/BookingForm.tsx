"use client";

import Tooltip from "@/components/Tooltip";
import { Guests, Listing } from "@/lib/types";
import { listingGuests } from "@/lib/utils";
import { ReactNode, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ListingPrice from "../ListingPrice";

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
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [guests, setGuests] = useState<Record<Guests, number>>({
    adults: 1,
    children: 0,
    infant: 0,
    pets: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<Guests | "dateRange", string>>>({});

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    if (selection?.startDate && selection?.endDate) {
      setDateRange(selection);
      setErrors({});
    }
  };

  const handleGuest = (type: Guests, amount: number) => {
    setGuests((prevState) => ({ ...prevState, [type]: prevState[type] + amount }));
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateFormData(dateRange, guests, listing);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onConfirm?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {!priceFirst && (
        <DateRange
          ranges={[dateRange]}
          onChange={handleChangeDateRange}
          minDate={new Date()}
          rangeColors={[errors.dateRange ? "#fb2c36" : "#3ecf8e"]}
          showDateDisplay={false}
        />
      )}
      <div className="flex sm:mt-4">
        <ListingPrice startDate={dateRange.startDate} endDate={dateRange.endDate} listing={listing} />
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
          {errors.dateRange && <Tooltip text={errors.dateRange} containerStyle="top-[-4px]" arrow={false} />}

          <DateRange
            ranges={[dateRange]}
            onChange={handleChangeDateRange}
            minDate={new Date()}
            rangeColors={[errors.dateRange ? "#fb2c36" : "#3ecf8e"]}
            showDateDisplay={false}
          />
        </div>
      )}

      <div className="flex justify-center gap-10">
        {children}

        <button type="submit" className="px-4 py-2 bg-myGreen text-white rounded-4xl">
          Reserve
        </button>
      </div>
    </form>
  );
}

type FormErrors = Partial<Record<Guests | "dateRange", string>>;

function validateFormData(dateRange: Range, guests: Record<Guests, number>, listing: Listing): FormErrors {
  const errors: FormErrors = {};

  if (!dateRange.startDate || !dateRange.endDate) {
    errors.dateRange = "Select a valid date range.";
    return errors;
  }
  if (dateRange.startDate.getTime() === dateRange.endDate.getTime()) {
    errors.dateRange = "Check-in and check-out can't be the same day";
    return errors;
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
