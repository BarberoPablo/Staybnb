"use client";

import { CalendarLegend } from "@/components/Booking/CalendarLegend";
import { excludeDate, getCustomDayContent } from "@/components/Booking/bookingFormUtils";
import Tooltip from "@/components/Tooltip";
import { getListingReservations } from "@/lib/api/server/endpoints/reservations";
import { DateRangeKey, UnavailableDates } from "@/lib/types";
import { calculateNights, getDisabledDates, getListingPromotion, normalizeDate, validateDateRange } from "@/lib/utils";
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

  const updateURLParams = (startDate: Date, endDate: Date) => {
    const params = new URLSearchParams(window.location.search);
    params.set("startDate", startDate.toISOString());
    params.set("endDate", endDate.toISOString());

    const newURL = `${window.location.pathname}?${params.toString()}`;

    window.history.replaceState(null, "", newURL);
  };

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const { reservations } = await getListingReservations(listingId);

        const { unavailableCheckInDates: disabledCheckInDates, unavailableCheckOutDates: disabledCheckOutDates } = getDisabledDates(reservations);

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
      const utcStartDate = normalizeDate(startDate);
      const utcEndDate = normalizeDate(endDate);

      setDateRange({ startDate: utcStartDate, endDate: utcEndDate, key });

      setDisabledDates((prevState) => {
        const filteredDates = { ...prevState };

        if (userSelectedCheckOut) {
          filteredDates.unavailableCheckOutDates.filtered = excludeDate(filteredDates.unavailableCheckOutDates.all, utcStartDate);
        } else {
          filteredDates.unavailableCheckInDates.filtered = excludeDate(filteredDates.unavailableCheckInDates.all, utcEndDate);
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

    updateURLParams(dateRange.startDate, dateRange.endDate);
    const nights = calculateNights(dateRange.startDate, dateRange.endDate);

    setListingData((prevState) => ({
      ...prevState,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      nights,
      promo: getListingPromotion(prevState.listing, nights),
    }));

    onClose();
  };

  const handleClose = () => {
    setDateRange({
      startDate: startDate,
      endDate: endDate,
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
              disabledDates={isSelectingCheckOut ? disabledDates.unavailableCheckOutDates.filtered : disabledDates.unavailableCheckInDates.filtered}
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
