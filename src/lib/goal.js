import { addDays, daysBetween, todayISO } from "./dates.js";
import { GOAL_AMOUNT, GOAL_DURATION_DAYS } from "./byobStorage.js";

export function calculateGoalStats(byob) {
  const today = todayISO();
  const deadline = addDays(byob.goalStartDate, GOAL_DURATION_DAYS);

  const earned = Object.entries(byob.revenue)
    .filter(([date]) => date >= byob.goalStartDate && date <= today)
    .reduce((sum, [, amount]) => sum + amount, 0);

  const remaining = Math.max(0, GOAL_AMOUNT - earned);
  const daysElapsed = Math.max(0, daysBetween(byob.goalStartDate, today)) + 1;
  const daysRemaining = Math.max(0, daysBetween(today, deadline));
  const requiredPerDay = daysRemaining > 0 ? remaining / daysRemaining : remaining;
  const todaysActual = byob.revenue[today] ?? 0;

  const expectedSoFar = Math.min(
    GOAL_AMOUNT,
    (Math.min(daysElapsed, GOAL_DURATION_DAYS) / GOAL_DURATION_DAYS) * GOAL_AMOUNT,
  );
  const onTrack = earned >= expectedSoFar;
  const progressPct = Math.min(100, (earned / GOAL_AMOUNT) * 100);

  return {
    earned,
    remaining,
    daysRemaining,
    requiredPerDay,
    todaysActual,
    onTrack,
    progressPct,
    goalReached: earned >= GOAL_AMOUNT,
  };
}
