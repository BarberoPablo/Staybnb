import { bookingColors, calendarDot } from "./bookingFormUtils";

export function CalendarLegend() {
  return (
    <div className="flex gap-4 text-sm mt-2 px-2 text-gray-700">
      <div className="relative flex items-center gap-1">
        {calendarDot(bookingColors.checkIn, "in", false)}
        <span>Check-in only</span>
      </div>
      <div className="relative flex items-center gap-1">
        {calendarDot(bookingColors.checkOut, "out", false)}
        <span>Check-out only</span>
      </div>
    </div>
  );
}
