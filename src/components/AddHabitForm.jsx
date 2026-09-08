import { useState } from "react";
import { FREQUENCY_OPTIONS } from "../lib/frequency.js";

const MAX_LENGTH = 80;

export default function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [frequencyId, setFrequencyId] = useState("daily");
  const [customTimes, setCustomTimes] = useState(4);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const option = FREQUENCY_OPTIONS.find((f) => f.id === frequencyId);
    const timesPerWeek =
      option.timesPerWeek ?? Math.min(7, Math.max(1, Number(customTimes) || 1));
    onAddHabit(trimmed, timesPerWeek);
    setName("");
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <label htmlFor="habit-name">Add a habit</label>
      <div className="add-habit-row">
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="e.g. Drink a glass of water"
          autoComplete="off"
        />
        <button type="submit">Add</button>
      </div>
      <div className="add-habit-frequency-row">
        <label htmlFor="habit-frequency" className="add-habit-frequency-label">
          Frequency
        </label>
        <select
          id="habit-frequency"
          value={frequencyId}
          onChange={(e) => setFrequencyId(e.target.value)}
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
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
    </form>
  );
}
