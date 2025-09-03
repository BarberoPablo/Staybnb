"use client";

import { DateRangeKey, Dates } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";

export default function SelectDays({ setDates }: { setDates: (dates: Dates) => void }) {
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
    <div className="flex flex-col gap-2">
      <div id="dialog-description" className="text-center text-myGray mb-8">
        <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={true} />
      </div>

      <button
        className="flex items-center justify-center w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
        onClick={() => {
          setDates(dateRange);
        }}
      >
        Apply Filter
      </button>
    </div>
  );
}
