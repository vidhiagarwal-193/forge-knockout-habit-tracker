import HabitRow from "./HabitRow.jsx";

export default function HabitList({
  habits,
  onToggleToday,
  onDelete,
  onEdit,
  emptyMessage = "Add a habit to get started",
}) {
  if (habits.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
