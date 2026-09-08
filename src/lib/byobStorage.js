import { todayISO } from "./dates.js";

const STORAGE_KEY = "habit-tracker:byob";

export const GOAL_AMOUNT = 700000;
export const GOAL_DURATION_DAYS = 60;
export const DEFAULT_DAILY_TARGET = Math.round(GOAL_AMOUNT / GOAL_DURATION_DAYS / 100) * 100;

export function loadByob() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return createDefaultByob();
    return { ...createDefaultByob(), ...JSON.parse(raw) };
  } catch {
    return createDefaultByob();
  }
}

function createDefaultByob() {
  return {
    focusedMinutes: {},
    revenue: {},
    dailyTarget: DEFAULT_DAILY_TARGET,
    goalStartDate: todayISO(),
  };
}

export function saveByob(byob) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byob));
  } catch {
    // localStorage unavailable (e.g. private browsing) — app still works for this session
  }
}
