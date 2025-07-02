import React from "react";

export default function DateRange({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    <span>
      {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} -{" "}
      {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
    </span>
  );
}
