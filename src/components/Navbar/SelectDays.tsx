"use client";

import { DateRangeKey, Dates } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";

export default function SelectDays({ dates, setDates }: { dates: Dates; setDates: (dates: Dates) => void }) {
  const [dateRange, setDateRange] = useState<DateRangeKey>({
    startDate: dates.startDate || new Date(),
    endDate: dates.endDate || new Date(),
    key: "selection",
  });

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    const { startDate, endDate, key } = selection;

    if (startDate && endDate) {
      const utcStartDate = normalizeDate(startDate);
      const utcEndDate = normalizeDate(endDate);

      setDateRange({ startDate: utcStartDate, endDate: utcEndDate, key });
      setDates({ startDate: utcStartDate, endDate: utcEndDate });
    }
  };

  const handleClearDates = () => {
    setDateRange({ startDate: new Date(), endDate: new Date(), key: "selection" });
    setDates({ startDate: new Date(), endDate: new Date() });
  };

  return (
    <div className="text-center text-myGray">
      {dateRange.startDate.toISOString() !== dateRange.endDate.toISOString() && (
        <div className="sticky top-0 bg-white border-b border-gray-200 mb-4 pb-2 z-10 flex justify-end items-center">
          <button onClick={handleClearDates} className="text-sm text-red-600 hover:text-red-800 hover:underline hover:cursor-pointer">
            Clear dates
          </button>
        </div>
      )}
      <div className="overflow-y-auto">
        <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={true} />
      </div>
    </div>
  );
}
