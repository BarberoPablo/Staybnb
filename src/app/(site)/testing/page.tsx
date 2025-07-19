"use client";

import { toZonedTime } from "date-fns-tz";

export default function TestingPage() {
  const startDateUTC = new Date("2025-07-29T18:00:00Z");
  const endDateUTC = new Date("2025-08-01T11:00:00Z");

  const timezone = "America/Argentina/Buenos_Aires";

  const localStartDate = toZonedTime(startDateUTC, timezone);
  const localEndDate = toZonedTime(endDateUTC, timezone);

  console.log("Start:", localStartDate.toString());
  console.log("End:", localEndDate.toString());

  return <div>Testing Page</div>;
}
