import { useState } from "react";
import CategoryMascot from "./CategoryMascot.jsx";
import AddHabitForm from "./AddHabitForm.jsx";
import HabitList from "./HabitList.jsx";
import Heatmap from "./Heatmap.jsx";
import { todayISO } from "../lib/dates.js";
import { calculateValueStreak } from "../lib/streaks.js";
import { calculateGoalStats } from "../lib/goal.js";
import { formatINR } from "../lib/money.js";

export default function BYOBView({
  category,
  byob,
  habits,
  onBack,
  onLogMinutes,
  onSaveRevenue,
  onSetDailyTarget,
  onAddHabit,
  onToggleToday,
  onDelete,
  onEditHabit,
}) {
  const today = todayISO();
  const stats = calculateGoalStats(byob);

  return (
    <div className={`category-view category-${category.id}`}>
      <button type="button" className="back-button" onClick={onBack}>
        ← Home
      </button>
      <header className="category-view-header">
        <CategoryMascot category={category.id} />
        <div>
          <h1>{category.label}</h1>
          <p className="app-subtitle">{category.blurb}</p>
        </div>
      </header>

      <GoalDashboard stats={stats} />

      <FocusedTimeCard
        minutesToday={byob.focusedMinutes[today] ?? 0}
        streak={calculateValueStreak(byob.focusedMinutes)}
        onLog={onLogMinutes}
      />

      <RevenueCard revenueToday={byob.revenue[today] ?? null} onSave={onSaveRevenue} />

      <TargetCard
        target={byob.dailyTarget}
        actual={byob.revenue[today] ?? 0}
        onSetTarget={onSetDailyTarget}
      />

      <h2 className="section-heading">Side hustles</h2>
      <AddHabitForm onAddHabit={onAddHabit} />
      <HabitList
        habits={habits}
        onToggleToday={onToggleToday}
        onDelete={onDelete}
        onEdit={onEditHabit}
        emptyMessage="No side-hustle habits yet. Add one."
      />
      <Heatmap habits={habits} />
    </div>
  );
}

function GoalDashboard({ stats }) {
  const statusLabel = stats.goalReached
    ? "GOAL SMASHED"
    : stats.onTrack
      ? "ON TRACK"
      : "BEHIND — LOCK IN";
  const statusClass = stats.goalReached || stats.onTrack ? "on-track" : "behind";

  return (
    <section className="goal-dashboard">
      <div className="goal-dashboard-top">
        <span className="goal-title">₹7L in 2 months</span>
        <span className={`goal-status goal-status-${statusClass}`}>{statusLabel}</span>
      </div>
      <div className="goal-ring-wrap">
        <div
          className="goal-ring"
          style={{ "--pct": stats.progressPct }}
          aria-hidden="true"
        >
          <span className="goal-ring-pct">{Math.round(stats.progressPct)}%</span>
        </div>
        <div className="goal-stats-grid">
          <div className="goal-stat">
            <span className="goal-stat-label">Earned</span>
            <span className="goal-stat-value">{formatINR(stats.earned)}</span>
          </div>
          <div className="goal-stat">
            <span className="goal-stat-label">Remaining</span>
            <span className="goal-stat-value">{formatINR(stats.remaining)}</span>
          </div>
          <div className="goal-stat">
            <span className="goal-stat-label">Days left</span>
            <span className="goal-stat-value">{stats.daysRemaining}</span>
          </div>
          <div className="goal-stat">
            <span className="goal-stat-label">Need/day</span>
            <span className="goal-stat-value">{formatINR(stats.requiredPerDay)}</span>
          </div>
        </div>
      </div>
      <p className="goal-today">
        Today: <strong>{formatINR(stats.todaysActual)}</strong> logged
        {stats.goalReached
          ? " — you actually did it. 🚀"
          : stats.onTrack
            ? " — pace is holding. Don't blink."
            : " — ₹7L doesn't chase itself."}
      </p>
    </section>
  );
}

function FocusedTimeCard({ minutesToday, streak, onLog }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const minutes = Number(value);
    if (!minutes || minutes <= 0) return;
    onLog(minutes);
    setValue("");
  }

  return (
    <section className="tracker-card">
      <div className="tracker-card-header">
        <span className="tracker-card-title">⏱️ Focused time</span>
        <span className="tracker-card-value">
          {minutesToday} min today
          {streak > 0 && <span className="habit-streak"> 🔥 {streak} day streak</span>}
        </span>
      </div>
      <form className="tracker-form" onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          inputMode="numeric"
          placeholder="Minutes"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Minutes focused"
        />
        <button type="submit">Log it</button>
      </form>
    </section>
  );
}

function RevenueCard({ revenueToday, onSave }) {
  const [value, setValue] = useState(revenueToday ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(value);
    if (Number.isNaN(amount) || amount < 0) return;
    onSave(amount);
  }

  return (
    <section className="tracker-card">
      <div className="tracker-card-header">
        <span className="tracker-card-title">💰 Today's revenue</span>
        <span className="tracker-card-value">
          {revenueToday != null ? formatINR(revenueToday) : "Not logged"}
        </span>
      </div>
      <form className="tracker-form" onSubmit={handleSubmit}>
        <input
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="₹ earned today"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Revenue earned today"
        />
        <button type="submit">Save</button>
      </form>
    </section>
  );
}

function TargetCard({ target, actual, onSetTarget }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(target);
  const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
  const hit = target > 0 && actual >= target;

  function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(value);
    if (!amount || amount <= 0) return;
    onSetTarget(amount);
    setEditing(false);
  }

  return (
    <section className="tracker-card">
      <div className="tracker-card-header">
        <span className="tracker-card-title">🎯 Sales target</span>
        <span className="tracker-card-value">
          {formatINR(actual)} / {formatINR(target)}
        </span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-label">
        {hit ? "Target smashed. We take those." : `${pct}% of today's target`}
      </p>
      {editing ? (
        <form className="tracker-form" onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Daily sales target"
          />
          <button type="submit">Set</button>
        </form>
      ) : (
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setValue(target);
            setEditing(true);
          }}
        >
          Edit target
        </button>
      )}
    </section>
  );
}
