import { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import CategoryView from "./components/CategoryView.jsx";
import BYOBView from "./components/BYOBView.jsx";
import { loadHabits, saveHabits } from "./lib/storage.js";
import { loadByob, saveByob } from "./lib/byobStorage.js";
import { todayISO } from "./lib/dates.js";
import { getCategory } from "./lib/categories.js";

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [byob, setByob] = useState(() => loadByob());
  const [view, setView] = useState("home");

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveByob(byob);
  }, [byob]);

  function handleAddHabit(category) {
    return function addHabit(name, timesPerWeek = 7) {
      const newHabit = {
        id: crypto.randomUUID(),
        name,
        tagline: "",
        category,
        timesPerWeek,
        createdAt: todayISO(),
        checkIns: [],
      };
      setHabits((prev) => [...prev, newHabit]);
    };
  }

  function handleToggleToday(habitId) {
    const today = todayISO();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const isDone = habit.checkIns.includes(today);
        return {
          ...habit,
          checkIns: isDone
            ? habit.checkIns.filter((d) => d !== today)
            : [...habit.checkIns, today],
        };
      }),
    );
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }

  function handleEditHabit(habitId, updates) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, ...updates } : habit)),
    );
  }

  function handleLogMinutes(minutes) {
    const today = todayISO();
    setByob((prev) => ({
      ...prev,
      focusedMinutes: {
        ...prev.focusedMinutes,
        [today]: (prev.focusedMinutes[today] ?? 0) + minutes,
      },
    }));
  }

  function handleSaveRevenue(amount) {
    const today = todayISO();
    setByob((prev) => ({
      ...prev,
      revenue: { ...prev.revenue, [today]: amount },
    }));
  }

  function handleSetDailyTarget(amount) {
    setByob((prev) => ({ ...prev, dailyTarget: amount }));
  }

  const xp = habits.reduce((sum, h) => sum + h.checkIns.length, 0);
  const level = Math.floor(xp / 15) + 1;

  if (view === "home") {
    return (
      <main className="app">
        <Home habits={habits} byob={byob} level={level} onOpenCategory={setView} />
      </main>
    );
  }

  const category = getCategory(view);
  const categoryHabits = habits.filter((h) => h.category === category.id);

  return (
    <main className="app">
      {category.id === "byob" ? (
        <BYOBView
          category={category}
          byob={byob}
          habits={categoryHabits}
          onBack={() => setView("home")}
          onLogMinutes={handleLogMinutes}
          onSaveRevenue={handleSaveRevenue}
          onSetDailyTarget={handleSetDailyTarget}
          onAddHabit={handleAddHabit(category.id)}
          onToggleToday={handleToggleToday}
          onDelete={handleDelete}
          onEditHabit={handleEditHabit}
        />
      ) : (
        <CategoryView
          category={category}
          habits={categoryHabits}
          onBack={() => setView("home")}
          onAddHabit={handleAddHabit(category.id)}
          onToggleToday={handleToggleToday}
          onDelete={handleDelete}
          onEditHabit={handleEditHabit}
        />
      )}
    </main>
  );
}
