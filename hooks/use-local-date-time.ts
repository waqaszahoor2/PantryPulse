"use client";

import { useEffect, useState } from "react";
import { formatLocalDate, formatLiveTime, getGreetingByHour } from "@/lib/date-time";

export function useLocalDateTime(customTimeZone?: string) {
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted || !now) {
    return {
      isMounted: false,
      dateFormatted: "",
      timeFormatted: "",
      timeZoneAbbr: "",
      greetingPrefix: "Good morning",
      fullDateTimeTooltip: "",
    };
  }

  const dateFormatted = formatLocalDate(now, customTimeZone);
  const { time: timeFormatted, abbr: timeZoneAbbr } = formatLiveTime(now, customTimeZone);
  const greetingPrefix = getGreetingByHour(now.getHours());
  const fullDateTimeTooltip = `${dateFormatted} (${timeZoneAbbr || "Local Time"})`;

  return {
    isMounted: true,
    dateFormatted,
    timeFormatted,
    timeZoneAbbr,
    greetingPrefix,
    fullDateTimeTooltip,
  };
}
