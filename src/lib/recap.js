import { addDays, todayISO } from "./dates.js";
import { getWeekRange, isDailyHabit } from "./frequency.js";
import { getCategoryCompletionForDate } from "./mesaStatus.js";
import { calculateStreak } from "./streaks.js";
import { CATEGORIES } from "./categories.js";

export function getWeeklyCategoryPct(categoryId, habits, byob) {
  const { start } = getWeekRange();
  const today = todayISO();
  let doneSum = 0;
  let totalSum = 0;
  let cursor = start;

  while (cursor <= today) {
    const { done, total } = getCategoryCompletionForDate(categoryId, habits, byob, cursor);
    doneSum += done;
    totalSum += total;
    cursor = addDays(cursor, 1);
  }

  return totalSum > 0 ? Math.round((doneSum / totalSum) * 100) : 0;
}

export function getWeeklyRecap(habits, byob) {
  const { start } = getWeekRange();
  const today = todayISO();

  const totalCompleted = habits.reduce(
    (sum, h) => sum + h.checkIns.filter((d) => d >= start && d <= today).length,
    0,
  );

  const bestStreak = Math.max(
    0,
    ...habits.filter(isDailyHabit).map((h) => calculateStreak(h.checkIns)),
  );

  const categoryPercents = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, getWeeklyCategoryPct(c.id, habits, byob)]),
  );

  return { totalCompleted, bestStreak, categoryPercents };
}
