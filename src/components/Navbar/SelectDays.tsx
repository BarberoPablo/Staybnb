"use client";

import { DateRangeKey, Dates } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";

export default function SelectDays({ isOpen, onClose, setDates }: { isOpen: boolean; onClose: () => void; setDates: (dates: Dates) => void }) {
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    const { startDate, endDate, key } = selection;

    if (startDate && endDate) {
      // Convert local date selection to UTC at midnight, preserving the calendar date
      const utcStartDate = normalizeDate(startDate);
      const utcEndDate = normalizeDate(endDate);

      setDateRange({ startDate: utcStartDate, endDate: utcEndDate, key });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col items-center justify-between bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
        >
          <DialogTitle id="dialog-title" className="text-2xl font-bold text-myGrayDark text-center mb-4">
            Select Check-in and Check-out Dates
          </DialogTitle>

          <div id="dialog-description" className="text-center text-myGray mb-8">
            <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={true} />
          </div>

          <button
            className="flex items-center justify-center w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
            onClick={() => {
              setDates(dateRange);
              onClose();
            }}
          >
            Apply Filter
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
