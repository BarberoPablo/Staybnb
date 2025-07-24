"use client";

import { createTimezoneDate, showUTCDate } from "@/lib/utils";

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
  const checkIn = createTimezoneDate(startDate, timezone);
  const checkOut = createTimezoneDate(endDate, timezone);

  return (
    <div className={`flex gap-4 border border-gray-300 rounded-xl p-4 text-cen ${className}`}>
      <div>
        <h2>Check-in</h2>
        <span>{showUTCDate(checkIn)}</span>
      </div>
      <div className="border-r border-gray-300 h-full" />
      <div>
        <h2>Check-out</h2>
        <span>{showUTCDate(checkOut)}</span>
      </div>
    </div>
  );
}
