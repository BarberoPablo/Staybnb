import { describe, it, expect } from "vitest";
import { normalizeDate, calculateNights } from "../../src/lib/utils";

describe("normalizeDate", () => {
  it("should return a new Date object at midnight UTC for the given date", () => {
    const input = new Date("2026-06-23T19:00:00-03:00");
    const result = normalizeDate(input);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5); // months are 0-based (10 = November)
    expect(result.getDate()).toBe(23);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it("should not modify the original Date instance", () => {
    const input = new Date("2025-11-10T19:00:00-03:00");
    const result = normalizeDate(input);

    expect(result).not.toBe(input); // ensures it's a new instance
  });

  it("should correctly normalize dates in different time zones", () => {
    const input = new Date("2025-11-10T23:59:59Z");
    const result = normalizeDate(input);

    expect(result.getUTCFullYear()).toBe(2025);
    expect(result.getUTCMonth()).toBe(10);
    expect(result.getUTCDate()).toBe(10);
  });

  it("should correctly normalize dates in different time zones", () => {
    const input = new Date("2028-01-10T23:59:59Z");
    const result = normalizeDate(input);

    expect(result.getUTCFullYear()).toBe(2028);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCDate()).toBe(10);
  });
});

describe.only("calculateNights", () => {
  it("should ignore date hours, and only focus on the year-date-month", () => {
    const startDate = new Date("2025-08-10T06:00:00-03:00");
    const endDate = new Date("2025-08-20T03:00:00-03:00");
    const result = calculateNights(startDate, endDate);

    expect(result).toBe(10);
  });

  it("should return 1 if startDate is lower than endDate", () => {
    const startDate = new Date("2025-08-10T06:00:00-03:00");
    const endDate = new Date("2025-07-20T03:00:00-03:00");
    const result = calculateNights(startDate, endDate);

    expect(result).toBe(1);
  });

  it("should return 1 if startDate is equals than endDate", () => {
    const startDate = new Date("2025-08-10T06:00:00-03:00");
    const endDate = new Date("2025-08-10T06:00:00-03:00");
    const result = calculateNights(startDate, endDate);

    expect(result).toBe(1);
  });
});
