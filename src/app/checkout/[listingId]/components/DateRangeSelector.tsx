"use client";

import Tooltip from "@/components/Tooltip";
import { DateRangeKey } from "@/lib/types";
import { validateDateRange } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ListingData } from "./Checkout";

export default function DateRangeSelector({
  isOpen,
  startDate,
  endDate,
  setListingData,
  onClose,
}: {
  isOpen: boolean;
  startDate: Date;
  endDate: Date;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  });

  /* 
  In the future, to keep the calendar synchronized if startDate or endDate can change from the parent component while this modal is closed
  useEffect(() => {
    setDateRange({
      startDate,
      endDate,
      key: "selection",
    });
  }, [startDate, endDate]); */

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    const { startDate, endDate, key } = selection;

    if (startDate && endDate) {
      setDateRange({ startDate, endDate, key });
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
          <div id="dialog-description" className="flex flex-col justify-center items-center w-full px-6 relative">
            <DateRange
              ranges={[dateRange]}
              onChange={handleChangeDateRange}
              minDate={new Date()}
              rangeColors={[error ? "#fb2c36" : "#3ecf8e"]}
              showDateDisplay={true}
            />
            {error && <Tooltip text={error} arrow={false} containerStyle={"top-[-6px]"} />}

            <button className="w-25 bg-myGreen text-white py-2 rounded" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
