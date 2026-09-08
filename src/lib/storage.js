import { DEFAULT_HABITS } from "./defaultHabits.js";
import { todayISO } from "./dates.js";

const STORAGE_KEY = "habit-tracker:habits";

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return createDefaultHabits();
    return JSON.parse(raw).map(normalizeHabit);
  } catch {
    return createDefaultHabits();
  }
}

function normalizeHabit(habit) {
  return {
    category: "academics",
    tagline: "",
    timesPerWeek: 7,
    ...habit,
  };
}

function createDefaultHabits() {
  return DEFAULT_HABITS.map((habit) => ({
    id: crypto.randomUUID(),
    createdAt: todayISO(),
    checkIns: [],
    ...habit,
  }));
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // localStorage unavailable (e.g. private browsing) — app still works for this session
  }
}
