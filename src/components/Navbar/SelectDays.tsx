"use client";

import { DateRangeKey, Dates } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { IoClose } from "react-icons/io5";

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
    <div className="text-center text-myGray w-full relative">
      {dateRange.startDate.toISOString() !== dateRange.endDate.toISOString() && (
        <button
          onClick={handleClearDates}
          className="absolute top-0 right-0 z-20 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50 cursor-pointer"
          title="Clear dates"
        >
          <IoClose className="w-5 h-5 text-red-500 hover:text-red-600" />
        </button>
      )}
      <div className="overflow-y-auto overflow-x-hidden w-full">
        <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={true} />
      </div>
    </div>
  );
}
