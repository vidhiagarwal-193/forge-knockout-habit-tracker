import CategoryMascot from "./CategoryMascot.jsx";
import AddHabitForm from "./AddHabitForm.jsx";
import HabitList from "./HabitList.jsx";
import Heatmap from "./Heatmap.jsx";
import { todayISO } from "../lib/dates.js";

export default function CategoryView({
  category,
  habits,
  onBack,
  onAddHabit,
  onToggleToday,
  onDelete,
  onEditHabit,
}) {
  const today = todayISO();
  const done = habits.filter((h) => h.checkIns.includes(today)).length;
  const total = habits.length;
  const progressPct = total === 0 ? 0 : Math.round((done / total) * 100);

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
      {total > 0 && (
        <>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="progress-label">
            {done === total ? "All done — cooking today." : `${done} of ${total} done today`}
          </p>
        </>
      )}
      <AddHabitForm onAddHabit={onAddHabit} />
      <HabitList
        habits={habits}
        onToggleToday={onToggleToday}
        onDelete={onDelete}
        onEdit={onEditHabit}
        emptyMessage="Nothing here yet. Add your first one."
      />
      <Heatmap habits={habits} />
    </div>
  );
}
