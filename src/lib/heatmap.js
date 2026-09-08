import { toISODate } from "./dates.js";

export function buildHeatmapDays(habits, weeks = 12) {
  const totalDays = weeks * 7;
  const days = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toISODate(d);
    const count = habits.reduce(
      (sum, h) => sum + (h.checkIns.includes(iso) ? 1 : 0),
      0,
    );
    days.push({ date: iso, count });
  }

  return days;
}

export function bucketClass(count) {
  if (count <= 0) return "heat-0";
  if (count === 1) return "heat-1";
  if (count === 2) return "heat-2";
  if (count <= 4) return "heat-3";
  return "heat-4";
}
