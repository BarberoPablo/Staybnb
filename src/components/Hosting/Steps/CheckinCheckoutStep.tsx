"use client";

import { useListingForm } from "@/store/useListingForm";
import { TimePicker } from "rsuite";
import "rsuite/TimePicker/styles/index.css";
import Title from "./components/Title";
import { parse, format } from "date-fns";

export default function CheckinCheckoutStep() {
  const checkInTime = useListingForm((state) => state.checkInTime);
  const checkOutTime = useListingForm((state) => state.checkOutTime);
  const setField = useListingForm((state) => state.setField);

  const handleCheckInChange = (date: Date | null) => {
    if (date) {
      const formatted = format(date, "HH:mm");
      setField("checkInTime", formatted);
    }
  };

  const handleCheckOutChange = (date: Date | null) => {
    if (date) {
      const formatted = format(date, "HH:mm");
      setField("checkOutTime", formatted);
    }
  };

  const parseTime = (value: string | null) => (value ? parse(value, "HH:mm", new Date()) : null);

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        <h1>Choose your arrival and departure times</h1>
        <p className="text-lg font-medium text-gray-500">
          Select your check-in and check-out times in local time.
          <br /> You can change them later at any time.
        </p>
      </Title>

      <div className="flex items-center justify-center gap-20">
        <div className="flex flex-col text-center gap-2">
          <h2 className="text-lg font-semibold ">Check-in</h2>
          <TimePicker format="HH:mm" size="lg" value={parseTime(checkInTime)} onChange={handleCheckInChange} placeholder="Select check-in time" />
        </div>
        <div className="flex flex-col text-center gap-2">
          <h2 className="text-lg font-semibold ">Check-out</h2>
          <TimePicker format="HH:mm" size="lg" value={parseTime(checkOutTime)} onChange={handleCheckOutChange} placeholder="Select check-out time" />
        </div>
      </div>
    </div>
  );
}
