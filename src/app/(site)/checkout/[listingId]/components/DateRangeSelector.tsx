"use client";

import { CalendarLegend } from "@/components/Booking/CalendarLegend";
import { getCustomDayContent, updateURLParams } from "@/components/Booking/bookingFormUtils";
import Tooltip from "@/components/Tooltip";
import { excludeStringDate, formatDate, parseCalendarDate, toUTCDate, unavailableDateRange } from "@/lib/api/reservations/utils";
import { getListingUnavailableDates } from "@/lib/api/server/endpoints/reservations";
import { DateRangeKey, UnavailableDates } from "@/lib/types";
import { calculateNights, getListingPromotion } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { IoCalendar, IoCheckmark, IoClose } from "react-icons/io5";
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
  startDate: string;
  endDate: string;
  listingId: string;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: parseCalendarDate(startDate),
    endDate: parseCalendarDate(endDate),
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
        const { unavailableCheckInDates, unavailableCheckOutDates } = await getListingUnavailableDates(listingId);

        setDisabledDates({
          unavailableCheckInDates: {
            filtered: unavailableCheckInDates,
            all: unavailableCheckInDates,
          },
          unavailableCheckOutDates: {
            filtered: unavailableCheckOutDates,
            all: unavailableCheckOutDates,
          },
        });
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchReservedDates();
  }, [listingId]);

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];

    if (selection?.startDate && selection?.endDate) {
      const { startDate, endDate, key } = selection;

      const userIsSelectingCheckOut = startDate.getTime() === endDate.getTime();
      const unavailableDates = unavailableDateRange(startDate, endDate, disabledDates.unavailableCheckInDates.all, userIsSelectingCheckOut);

      if (unavailableDates) {
        return;
      }

      const normalizedStartDate = formatDate(startDate);
      const normalizedEndDate = formatDate(endDate);

      updateURLParams("startDate", normalizedStartDate);
      updateURLParams("endDate", normalizedEndDate);

      setDateRange({ startDate: parseCalendarDate(normalizedStartDate), endDate: parseCalendarDate(normalizedEndDate), key });

      setDisabledDates((prevState) => {
        const filteredDates = { ...prevState };

        if (userIsSelectingCheckOut) {
          filteredDates.unavailableCheckOutDates.filtered = excludeStringDate(filteredDates.unavailableCheckOutDates.all, normalizedStartDate);
        } else {
          filteredDates.unavailableCheckInDates.filtered = excludeStringDate(filteredDates.unavailableCheckInDates.all, normalizedEndDate);
        }

        return filteredDates;
      });

      setIsSelectingCheckOut(userIsSelectingCheckOut);

      setError("");
    }
  };

  const handleConfirm = () => {
    const unavailableDates = unavailableDateRange(dateRange.startDate, dateRange.endDate, disabledDates.unavailableCheckInDates.all);

    if (unavailableDates) {
      setError("Date range invalid or not available.");
      return;
    }

    const normalizedStartDate = formatDate(dateRange.startDate);
    const normalizedEndDate = formatDate(dateRange.endDate);

    updateURLParams("startDate", normalizedStartDate);
    updateURLParams("endDate", normalizedEndDate);

    const nights = calculateNights(dateRange.startDate, dateRange.endDate);

    setListingData((prevState) => ({
      ...prevState,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      nights,
      promo: getListingPromotion(nights, prevState.listing.promotions),
    }));

    onClose();
  };

  const handleClose = () => {
    setDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      key: "selection",
    });
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-myGreenExtraLight rounded-full flex items-center justify-center">
                <IoCalendar className="w-5 h-5 text-myGrayDark" />
              </div>
              <div>
                <DialogTitle id="dialog-title" className="text-xl font-bold text-myGrayDark">
                  Select Your Dates
                </DialogTitle>
                <p className="text-sm text-myGray">Choose your check-in and check-out dates</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-myGray hover:text-myGrayDark transition-colors duration-200 cursor-pointer"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Legend */}
          <div className="px-6 pt-4">
            <CalendarLegend />
          </div>

          {/* Calendar */}
          <div id="dialog-description" className="flex flex-col justify-center items-center w-full px-6 py-4 relative">
            <DateRange
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[error ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
              disabledDates={
                isSelectingCheckOut
                  ? disabledDates.unavailableCheckOutDates.filtered.map(toUTCDate)
                  : disabledDates.unavailableCheckInDates.filtered.map(toUTCDate)
              }
              dayContentRenderer={getCustomDayContent(disabledDates)}
            />
            {error && <Tooltip text={error} arrow={false} containerStyle={"top-[-6px]"} />}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleClose}
              className="flex-1 bg-white hover:bg-gray-50 text-myGrayDark font-medium py-3 px-4 rounded-xl border border-gray-200 transition-all duration-200 hover:border-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              disabled={dateRange.startDate === dateRange.endDate}
              onClick={handleConfirm}
            >
              <IoCheckmark className="w-4 h-4" />
              Confirm Dates
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
