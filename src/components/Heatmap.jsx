import { buildHeatmapDays, bucketClass } from "../lib/heatmap.js";
import { calculateStreak } from "../lib/streaks.js";
import { isDailyHabit } from "../lib/frequency.js";

export default function Heatmap({ habits, weeks = 12 }) {
  const days = buildHeatmapDays(habits, weeks);
  const columns = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  const bestStreak = Math.max(
    0,
    ...habits.filter(isDailyHabit).map((h) => calculateStreak(h.checkIns)),
  );
  const activeDays = days.filter((d) => d.count > 0).length;

  if (habits.length === 0) return null;

  return (
    <section className="heatmap">
      <div className="heatmap-header">
        <span className="heatmap-title">Momentum</span>
      </div>
      <div className="heatmap-grid">
        {columns.map((col, i) => (
          <div className="heatmap-col" key={i}>
            {col.map((day) => (
              <span
                key={day.date}
                className={`heatmap-cell ${bucketClass(day.count)}`}
                title={`${day.date}: ${day.count} done`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="heatmap-summary">
        {bestStreak > 0 && <>🔥 {bestStreak} day streak · </>}
        {activeDays} active days in the last {weeks * 7}
      </p>
    </section>
  );
}
