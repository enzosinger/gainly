import type { WeekWindow } from "../types/domain";

function addDays(timestamp: number, days: number) {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

export function getMondayWeekStart(timestamp: number) {
  const date = new Date(timestamp);
  const dayIndex = date.getDay();
  const mondayOffset = (dayIndex + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - mondayOffset);
  return date.getTime();
}

export function getWeekWindow(timestamp: number = Date.now()): WeekWindow {
  const start = getMondayWeekStart(timestamp);
  const endExclusive = addDays(start, 7);
  const startLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(addDays(start, 6));

  return {
    start,
    endExclusive,
    label: `${startLabel} - ${endLabel}`,
  };
}

export function shiftWeekWindowStart(start: number, offsetWeeks: number) {
  return addDays(start, offsetWeeks * 7);
}

