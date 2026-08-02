import { describe, expect, it } from "vitest";
import {
  formatLocalDate,
  formatRelativeTime,
  formatUnreadBadge,
  getGreetingByHour,
} from "@/lib/date-time";

describe("Date & Time Helpers (lib/date-time.ts)", () => {
  it("returns Good morning for hours 5 to 11", () => {
    expect(getGreetingByHour(5)).toBe("Good morning");
    expect(getGreetingByHour(9)).toBe("Good morning");
    expect(getGreetingByHour(11)).toBe("Good morning");
  });

  it("returns Good afternoon for hours 12 to 16", () => {
    expect(getGreetingByHour(12)).toBe("Good afternoon");
    expect(getGreetingByHour(14)).toBe("Good afternoon");
    expect(getGreetingByHour(16)).toBe("Good afternoon");
  });

  it("returns Good evening for hours 17 to 20", () => {
    expect(getGreetingByHour(17)).toBe("Good evening");
    expect(getGreetingByHour(19)).toBe("Good evening");
    expect(getGreetingByHour(20)).toBe("Good evening");
  });

  it("returns Good night for hours 21 to 4", () => {
    expect(getGreetingByHour(21)).toBe("Good night");
    expect(getGreetingByHour(23)).toBe("Good night");
    expect(getGreetingByHour(0)).toBe("Good night");
    expect(getGreetingByHour(4)).toBe("Good night");
  });

  it("formats local date accurately", () => {
    const testDate = new Date(2026, 7, 3); // August 3, 2026
    const formatted = formatLocalDate(testDate);
    expect(formatted).toContain("AUGUST");
    expect(formatted).toContain("2026");
  });

  it("formats relative timestamps readable", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("Just now");

    const yesterday = new Date(Date.now() - 86400000).toISOString();
    expect(formatRelativeTime(yesterday)).toBe("Yesterday");
  });

  it("formats unread notification badge correctly", () => {
    expect(formatUnreadBadge(0)).toBe("");
    expect(formatUnreadBadge(5)).toBe("5");
    expect(formatUnreadBadge(99)).toBe("99");
    expect(formatUnreadBadge(120)).toBe("99+");
  });
});
