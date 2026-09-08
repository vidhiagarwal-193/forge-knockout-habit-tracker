import { useState } from "react";
import { calculateWeeklyGoal } from "../lib/frequency.js";
import { getPersonalRecords } from "../lib/records.js";
import { getWeeklyRecap } from "../lib/recap.js";
import { CATEGORIES } from "../lib/categories.js";

export default function MomentumPanel({ habits, byob }) {
  const [showRecap, setShowRecap] = useState(false);

  const goal = calculateWeeklyGoal(habits);
  const records = getPersonalRecords(habits);
  const recap = getWeeklyRecap(habits, byob);
  const goalPct = goal.target > 0 ? Math.min(100, Math.round((goal.completed / goal.target) * 100)) : 0;

  const hasRecords = records.bestStreakDays > 0 || records.bestWeekPct > 0;

  return (
    <section className="momentum-panel">
      {goal.target > 0 && (
        <div className="weekly-goal">
          <div className="weekly-goal-header">
            <span>Weekly goal</span>
            <span>
              {goal.completed} / {goal.target} completed
            </span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      )}

      {hasRecords && (
        <ul className="personal-records">
          {records.bestStreakDays > 0 && (
            <li>
              🔥 Best streak: {records.bestStreakDays} days
              {records.bestStreakHabitName ? ` — ${records.bestStreakHabitName}` : ""}
            </li>
          )}
          {records.bestWeekPct > 0 && <li>📈 Personal best week: {records.bestWeekPct}%</li>}
          {records.strongestCategoryLabel && (
            <li>💪 Strongest: {records.strongestCategoryLabel}</li>
          )}
        </ul>
      )}

      <button
        type="button"
        className="link-button momentum-recap-toggle"
        onClick={() => setShowRecap((v) => !v)}
      >
        {showRecap ? "Hide your week" : "📊 Your week"}
      </button>

      {showRecap && (
        <div className="recap-card">
          <p className="recap-title">YOUR WEEK</p>
          <p className="recap-line">{recap.totalCompleted} habits completed</p>
          {recap.bestStreak > 0 && (
            <p className="recap-line">{recap.bestStreak}-day streak</p>
          )}
          {CATEGORIES.map((c) => (
            <p className="recap-line" key={c.id}>
              {c.label}: {recap.categoryPercents[c.id]}%
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
