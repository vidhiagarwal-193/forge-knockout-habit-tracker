import { useState } from "react";
import { todayISO } from "../lib/dates.js";
import { calculateStreak } from "../lib/streaks.js";
import { randomPhrase } from "../lib/microcopy.js";
import { calculateWeeklyProgress, isDailyHabit, FREQUENCY_OPTIONS } from "../lib/frequency.js";
import { CATEGORIES } from "../lib/categories.js";

function frequencyIdFor(timesPerWeek) {
  const match = FREQUENCY_OPTIONS.find((f) => f.timesPerWeek === timesPerWeek);
  return match ? match.id : "custom";
}

export default function HabitRow({ habit, onToggleToday, onDelete, onEdit }) {
  const [justCompleted, setJustCompleted] = useState(false);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState(habit.category);
  const [frequencyId, setFrequencyId] = useState(frequencyIdFor(habit.timesPerWeek ?? 7));
  const [customTimes, setCustomTimes] = useState(habit.timesPerWeek ?? 7);

  const done = habit.checkIns.includes(todayISO());
  const daily = isDailyHabit(habit);
  const streak = daily ? calculateStreak(habit.checkIns) : 0;
  const weekly = daily
    ? null
    : calculateWeeklyProgress(habit.checkIns, habit.timesPerWeek);

  function handleToggle() {
    if (!done) {
      setJustCompleted(true);
      setToast(randomPhrase());
    }
    onToggleToday(habit.id);
  }

  function openEdit() {
    const currentTimesPerWeek = habit.timesPerWeek ?? 7;
    setName(habit.name);
    setCategory(habit.category);
    setFrequencyId(frequencyIdFor(currentTimesPerWeek));
    setCustomTimes(currentTimesPerWeek);
    setEditing(true);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const option = FREQUENCY_OPTIONS.find((f) => f.id === frequencyId);
    const timesPerWeek =
      option.timesPerWeek ?? Math.min(7, Math.max(1, Number(customTimes) || 1));
    onEdit(habit.id, { name: trimmed, category, timesPerWeek });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="habit-row habit-row-editing">
        <form className="habit-edit-form" onSubmit={handleSaveEdit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            aria-label="Habit name"
          />
          <div className="habit-edit-row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
            <select
              value={frequencyId}
              onChange={(e) => setFrequencyId(e.target.value)}
              aria-label="Frequency"
            >
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            {frequencyId === "custom" && (
              <input
                type="number"
                min="1"
                max="7"
                value={customTimes}
                onChange={(e) => setCustomTimes(e.target.value)}
                aria-label="Times per week"
                className="add-habit-custom-times"
              />
            )}
          </div>
          <div className="habit-edit-actions">
            <button type="submit">Save</button>
            <button type="button" className="link-button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  if (confirmingDelete) {
    return (
      <li className="habit-row habit-row-confirm">
        <div className="habit-confirm-body">
          <span className="habit-name">{habit.name}</span>
          <span className="habit-tagline">Delete this habit? Your history goes too.</span>
        </div>
        <div className="habit-confirm-actions">
          <button
            type="button"
            className="habit-confirm-delete"
            onClick={() => onDelete(habit.id)}
          >
            Delete
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => setConfirmingDelete(false)}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`habit-row${done ? " habit-row-done" : ""}`}>
      <button
        type="button"
        className={`habit-check${justCompleted ? " habit-check-pop" : ""}`}
        aria-pressed={done}
        onClick={handleToggle}
        onAnimationEnd={() => setJustCompleted(false)}
      >
        <span className="habit-check-icon" aria-hidden="true">
          {done ? "✓" : ""}
        </span>
        <span className="habit-body">
          <span className={done ? "habit-name habit-name-done" : "habit-name"}>
            {habit.name}
          </span>
          {habit.tagline && <span className="habit-tagline">{habit.tagline}</span>}
          {streak > 0 && (
            <span className="habit-streak">🔥 {streak} day streak</span>
          )}
          {weekly && (
            <span className="habit-weekly">
              {weekly.completed >= weekly.target
                ? `🎉 ${weekly.completed} / ${weekly.target} this week — nailed it`
                : `📅 ${weekly.completed} / ${weekly.target} this week`}
            </span>
          )}
        </span>
        {toast && (
          <span className="habit-toast" onAnimationEnd={() => setToast(null)}>
            {toast}
          </span>
        )}
      </button>
      <button
        type="button"
        className="habit-edit"
        aria-label={`Edit ${habit.name}`}
        onClick={openEdit}
      >
        ✏️
      </button>
      <button
        type="button"
        className="habit-delete"
        aria-label={`Delete ${habit.name}`}
        onClick={() => setConfirmingDelete(true)}
      >
        ×
      </button>
    </li>
  );
}
