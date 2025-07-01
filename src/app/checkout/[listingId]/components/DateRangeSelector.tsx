"use client";

import { CalendarLegend } from "@/components/Booking/CalendarLegend";
import { excludeDate, getCustomDayContent } from "@/components/Booking/bookingFormUtils";
import Tooltip from "@/components/Tooltip";
import { getReservedDates } from "@/lib/supabase/reservations";
import { DateRangeKey, UnavailableDates } from "@/lib/types";
import { getDisabledDates, validateDateRange } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ListingData } from "./Checkout";

export default function DateRangeSelector({
  isOpen,
  startDate,
  endDate,
  listingId,
  setListingData,
  onClose,
}: {
  isOpen: boolean;
  startDate: Date;
  endDate: Date;
  listingId: number;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  });
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [disabledDates, setDisabledDates] = useState<UnavailableDates>({
    unavailableCheckInDates: { filtered: [], all: [] },
    unavailableCheckOutDates: { filtered: [], all: [] },
  });

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await getReservedDates(listingId);
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
  }, [listingId]);

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    const { startDate, endDate, key } = selection;
    const userSelectedCheckOut = !isSelectingCheckOut;

    if (startDate && endDate) {
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
      setError("");
    }
  };

  const handleConfirm = () => {
    const dateError = validateDateRange(dateRange.startDate, dateRange.endDate);

    if (dateError) {
      setError(dateError);
      return;
    }

    setListingData((prevState) => ({ ...prevState, startDate: dateRange.startDate, endDate: dateRange.endDate }));
    onClose();
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col items-center bg-white rounded-lg py-2 sm:py-4 max-w-sm w-full"
        >
          <DialogTitle id="dialog-title" className="text-xl font-semibold text-myGreen">
            Select your dates
          </DialogTitle>

          <CalendarLegend />

          <div id="dialog-description" className="flex flex-col justify-center items-center w-full px-6 relative">
            <DateRange
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[error ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
              disabledDates={isSelectingCheckOut ? disabledDates.unavailableCheckOutDates.filtered : disabledDates.unavailableCheckInDates.filtered}
              dayContentRenderer={getCustomDayContent(disabledDates)}
            />
            {error && <Tooltip text={error} arrow={false} containerStyle={"top-[-6px]"} />}

            <button className="w-25 bg-myGreen text-white py-2 rounded" disabled={dateRange.startDate === dateRange.endDate} onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
