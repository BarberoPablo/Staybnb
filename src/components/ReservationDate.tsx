"use client";

import { dateInLocalTime } from "@/lib/utils";
import { format } from "date-fns-tz";

export default function ReservationDate({
  startDate,
  endDate,
  timezone,
  className,
}: {
  startDate: Date;
  endDate: Date;
  timezone: string;
  className?: string;
}) {
  const checkIn = dateInLocalTime(startDate, timezone);
  const checkOut = dateInLocalTime(endDate, timezone);

  return (
    <div className={`flex gap-4 border border-gray-300 rounded-xl p-4 text-cen ${className}`}>
      <div>
        <h2>Check-in</h2>
        <span>{format(checkIn, "MMM d, yyyy HH:mm")}</span>
      </div>
      <div className="border-r border-gray-300 h-full" />
      <div>
        <h2>Check-out</h2>
        <span>{format(checkOut, "MMM d, yyyy HH:mm")}</span>
      </div>
    </div>
  );
}
