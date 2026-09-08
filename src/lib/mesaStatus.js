import { addDays, todayISO } from "./dates.js";
import { CATEGORIES } from "./categories.js";

export function getCategoryCompletionForDate(categoryId, habits, byob, dateISO) {
  if (categoryId === "byob") {
    const focusedDone = (byob.focusedMinutes[dateISO] ?? 0) > 0;
    const revenueDone = dateISO in byob.revenue;
    const targetDone =
      byob.dailyTarget > 0 && (byob.revenue[dateISO] ?? 0) >= byob.dailyTarget;
    const done = [focusedDone, revenueDone, targetDone].filter(Boolean).length;
    return { done, total: 3, complete: done === 3 };
  }

  const categoryHabits = habits.filter((h) => h.category === categoryId);
  const total = categoryHabits.length;
  const done = categoryHabits.filter((h) => h.checkIns.includes(dateISO)).length;
  return { done, total, complete: total > 0 && done === total };
}

export function getDailySummary(habits, byob, dateISO = todayISO()) {
  const categories = CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    ...getCategoryCompletionForDate(category.id, habits, byob, dateISO),
  }));
  const completedCount = categories.filter((c) => c.complete).length;
  return { date: dateISO, categories, completedCount };
}

export function getComboStreak(habits, byob, dateISO = todayISO()) {
  let streak = 0;
  let cursor = dateISO;

  while (getDailySummary(habits, byob, cursor).completedCount === CATEGORIES.length) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function isYouDay(habits, byob, dateISO) {
  const anyHabit = habits.some((h) => h.checkIns.includes(dateISO));
  const anyByob =
    (byob.focusedMinutes[dateISO] ?? 0) > 0 || (byob.revenue[dateISO] ?? 0) > 0;
  return anyHabit || anyByob;
}

export function countYouDays(habits, byob) {
  const startDates = habits.map((h) => h.createdAt).filter(Boolean);
  if (byob.goalStartDate) startDates.push(byob.goalStartDate);
  const start = startDates.length
    ? startDates.reduce((earliest, d) => (d < earliest ? d : earliest))
    : todayISO();
  const today = todayISO();

  let totalDays = 0;
  let youDays = 0;
  let cursor = start;

  while (cursor <= today) {
    totalDays += 1;
    if (isYouDay(habits, byob, cursor)) youDays += 1;
    cursor = addDays(cursor, 1);
  }

  return { youDays, totalDays };
}
