import { toISODate, todayISO } from "./dates.js";

export function calculateStreak(checkIns) {
  return calculateStreakFromSet(new Set(checkIns));
}

export function calculateValueStreak(values) {
  const done = new Set(
    Object.entries(values)
      .filter(([, amount]) => amount > 0)
      .map(([date]) => date),
  );
  return calculateStreakFromSet(done);
}

function calculateStreakFromSet(doneDates) {
  if (!doneDates.has(todayISO())) return 0;

  const cursor = new Date();
  let streak = 0;

  while (doneDates.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
