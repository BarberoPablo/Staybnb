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

  return (
    <div className="text-center text-myGray">
      <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={true} />
    </div>
  );
}
