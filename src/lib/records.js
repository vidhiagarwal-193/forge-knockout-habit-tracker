import { addDays, daysBetween, todayISO } from "./dates.js";
import { getWeekRange } from "./frequency.js";
import { CATEGORIES } from "./categories.js";

export function calculateBestStreak(checkIns) {
  if (checkIns.length === 0) return 0;
  const sorted = [...new Set(checkIns)].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

export function calculateBestWeekPct(habits) {
  if (habits.length === 0) return 0;

  const earliest = habits.reduce(
    (min, h) => (h.createdAt < min ? h.createdAt : min),
    habits[0].createdAt,
  );
  const today = todayISO();
  const weekStarts = new Set();
  let cursor = earliest;

  while (cursor <= today) {
    weekStarts.add(getWeekRange(cursor).start);
    cursor = addDays(cursor, 1);
  }

  let best = 0;
  const target = habits.reduce((sum, h) => sum + (h.timesPerWeek ?? 7), 0);
  if (target === 0) return 0;

  for (const weekStart of weekStarts) {
    const weekEnd = addDays(weekStart, 6);
    const completed = habits.reduce(
      (sum, h) => sum + h.checkIns.filter((d) => d >= weekStart && d <= weekEnd).length,
      0,
    );
    best = Math.max(best, Math.round((completed / target) * 100));
  }

  return best;
}

export function getStrongestCategory(habits) {
  let best = null;
  let bestAvg = -1;

  for (const category of CATEGORIES) {
    const categoryHabits = habits.filter((h) => h.category === category.id);
    if (categoryHabits.length === 0) continue;

    const avg =
      categoryHabits.reduce((sum, h) => sum + h.checkIns.length, 0) / categoryHabits.length;

    if (avg > bestAvg) {
      bestAvg = avg;
      best = category;
    }
  }

  return best;
}

export function getPersonalRecords(habits) {
  let bestStreakDays = 0;
  let bestStreakHabitName = null;

  for (const habit of habits) {
    const best = calculateBestStreak(habit.checkIns);
    if (best > bestStreakDays) {
      bestStreakDays = best;
      bestStreakHabitName = habit.name;
    }
  }

  const strongest = getStrongestCategory(habits);

  return {
    bestStreakDays,
    bestStreakHabitName,
    bestWeekPct: calculateBestWeekPct(habits),
    strongestCategoryLabel: strongest ? strongest.label : null,
  };
}
