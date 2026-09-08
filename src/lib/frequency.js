import { toISODate, todayISO } from "./dates.js";

export const DAILY_TIMES_PER_WEEK = 7;

export const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily", timesPerWeek: 7 },
  { id: "3x", label: "3× / week", timesPerWeek: 3 },
  { id: "2x", label: "2× / week", timesPerWeek: 2 },
  { id: "1x", label: "1× / week", timesPerWeek: 1 },
  { id: "custom", label: "Custom", timesPerWeek: null },
];

export function isDailyHabit(habit) {
  return (habit.timesPerWeek ?? DAILY_TIMES_PER_WEEK) >= DAILY_TIMES_PER_WEEK;
}

export function getWeekRange(iso = todayISO()) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const daysSinceMonday = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toISODate(monday), end: toISODate(sunday) };
}

export function calculateWeeklyProgress(checkIns, timesPerWeek) {
  const { start, end } = getWeekRange();
  const completed = checkIns.filter((d) => d >= start && d <= end).length;
  return { completed, target: timesPerWeek };
}

export function calculateWeeklyGoal(habits) {
  const { start, end } = getWeekRange();
  const completed = habits.reduce(
    (sum, h) => sum + h.checkIns.filter((d) => d >= start && d <= end).length,
    0,
  );
  const target = habits.reduce((sum, h) => sum + (h.timesPerWeek ?? DAILY_TIMES_PER_WEEK), 0);
  return { completed, target };
}
