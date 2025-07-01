import { bookingColors } from "./bookingFormUtils";

export function CalendarLegend() {
  return (
    <div className="flex gap-4 text-sm mt-2 px-2 text-gray-700">
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${bookingColors.checkIn}`} />
        <span>Check-in only</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${bookingColors.checkOut}`} />
        <span>Check-out only</span>
      </div>
    </div>
  );
}
