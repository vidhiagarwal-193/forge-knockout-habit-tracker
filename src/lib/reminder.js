import { todayISO } from "./dates.js";

const DISMISS_KEY = "habit-tracker:reminder-dismissed";
const REMINDER_HOUR = 18;

export function shouldShowReminder(completedCount) {
  if (completedCount >= 3) return false;
  if (new Date().getHours() < REMINDER_HOUR) return false;

  try {
    return localStorage.getItem(DISMISS_KEY) !== todayISO();
  } catch {
    return true;
  }
}

export function dismissReminder() {
  try {
    localStorage.setItem(DISMISS_KEY, todayISO());
  } catch {
    // localStorage unavailable — banner will just show again this session
  }
}
