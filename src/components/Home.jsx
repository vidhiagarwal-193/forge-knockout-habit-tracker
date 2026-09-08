import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../lib/categories.js";
import CategoryCard from "./CategoryCard.jsx";
import Heatmap from "./Heatmap.jsx";
import MesaBrand from "./MesaBrand.jsx";
import MesaHero from "./MesaHero.jsx";
import MesaTriangle from "./MesaTriangle.jsx";
import MesaReceipt from "./MesaReceipt.jsx";
import MomentumPanel from "./MomentumPanel.jsx";
import { todayISO } from "../lib/dates.js";
import { calculateStreak, calculateValueStreak } from "../lib/streaks.js";
import { isDailyHabit } from "../lib/frequency.js";
import { getDailySummary, getComboStreak, countYouDays } from "../lib/mesaStatus.js";
import { getClapMessage, getCookedStatus, getComboLabel } from "../lib/clapProtocol.js";
import { shouldShowReminder, dismissReminder } from "../lib/reminder.js";

export default function Home({ habits, byob, level, onOpenCategory }) {
  const today = todayISO();
  const [showReceipt, setShowReceipt] = useState(false);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  const summary = getDailySummary(habits, byob, today);
  const comboStreak = getComboStreak(habits, byob, today);
  const youDays = countYouDays(habits, byob);
  const clapMessage = getClapMessage(summary.completedCount);
  const cookedStatus = getCookedStatus(summary.completedCount);
  const comboLabel = getComboLabel(summary.completedCount);
  const allComplete = summary.completedCount === 3;
  const incompleteCategories = summary.categories.filter((c) => !c.complete);
  const showReminder = !reminderDismissed && shouldShowReminder(summary.completedCount);
  const cardsRef = useRef(null);
  const [cardsRevealed, setCardsRevealed] = useState(false);

  function handleDismissReminder(e) {
    e.stopPropagation();
    dismissReminder();
    setReminderDismissed(true);
  }

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCardsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <MesaHero completedCount={summary.completedCount} categories={summary.categories} />
      <MesaBrand />
      <header className="app-header">
        <div className="app-header-top">
          <h1>Good morning, MESA.</h1>
          <span className="level-badge">Lv {level}</span>
        </div>
        <p className="app-subtitle">Let's get some wins today.</p>
      </header>
      {showReminder && (
        <button
          type="button"
          className="reminder-banner"
          onClick={() => onOpenCategory(incompleteCategories[0].id)}
        >
          <span>
            👀 You still have {incompleteCategories.length} thing
            {incompleteCategories.length === 1 ? "" : "s"} waiting.
          </span>
          <span
            className="reminder-banner-dismiss"
            role="button"
            tabIndex={0}
            aria-label="Dismiss reminder"
            onClick={handleDismissReminder}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleDismissReminder(e);
            }}
          >
            ×
          </span>
        </button>
      )}
      <div
        ref={cardsRef}
        className={`category-card-list${cardsRevealed ? " is-revealed" : ""}`}
      >
        {CATEGORIES.map((category) => {
          if (category.id === "byob") {
            const focusedDone = (byob.focusedMinutes[today] ?? 0) > 0;
            const revenueDone = today in byob.revenue;
            const targetDone =
              byob.dailyTarget > 0 && (byob.revenue[today] ?? 0) >= byob.dailyTarget;
            const done = [focusedDone, revenueDone, targetDone].filter(Boolean).length;
            const streak = calculateValueStreak(byob.revenue);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                done={done}
                total={3}
                streak={streak}
                onOpen={() => onOpenCategory(category.id)}
              />
            );
          }

          const categoryHabits = habits.filter((h) => h.category === category.id);
          const done = categoryHabits.filter((h) => h.checkIns.includes(today)).length;
          const streak = Math.max(
            0,
            ...categoryHabits.filter(isDailyHabit).map((h) => calculateStreak(h.checkIns)),
          );
          return (
            <CategoryCard
              key={category.id}
              category={category}
              done={done}
              total={categoryHabits.length}
              streak={streak}
              onOpen={() => onOpenCategory(category.id)}
            />
          );
        })}
      </div>

      <section className="mesa-status">
        <MesaTriangle categories={summary.categories} complete={allComplete} />
        <p className="mesa-cooked">
          {summary.completedCount}/3 · {cookedStatus}
        </p>
        {clapMessage && <p className="mesa-clap">{clapMessage}</p>}
        {comboLabel && (
          <p className="mesa-combo">
            🔥 {comboLabel}
            {allComplete && comboStreak > 1 ? ` × ${comboStreak}` : ""}
          </p>
        )}
        <button
          type="button"
          className="link-button mesa-receipt-toggle"
          onClick={() => setShowReceipt((v) => !v)}
        >
          {showReceipt ? "Hide receipt" : "🧾 Today's receipt"}
        </button>
        {showReceipt && (
          <MesaReceipt
            summary={summary}
            comboLabel={comboLabel}
            comboStreak={comboStreak}
            cookedStatus={cookedStatus}
          />
        )}
      </section>

      <Heatmap habits={habits} />
      <MomentumPanel habits={habits} byob={byob} />
      <p className="you-days">
        <strong>{youDays.youDays} You Days</strong>{" "}
        <span className="you-days-muted">out of {youDays.totalDays} days</span>
      </p>
    </>
  );
}
