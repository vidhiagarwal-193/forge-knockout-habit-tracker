import { useRef } from "react";
import CategoryMascot from "./CategoryMascot.jsx";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function CategoryCard({ category, done, total, streak, onOpen }) {
  const state = total === 0 || done === 0 ? "muted" : done === total ? "complete" : "partial";
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = px * 6;
    const rotateX = py * -6;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (card) card.style.transform = "";
  }

  return (
    <button
      ref={cardRef}
      type="button"
      className={`category-card category-${category.id} category-card-${state}`}
      onClick={onOpen}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <CategoryMascot category={category.id} />
      <span className="category-card-body">
        <span className="category-card-title">
          {category.emoji} {category.label}
        </span>
        <span className="category-card-blurb">{category.blurb}</span>
      </span>
      <span className="category-card-stats">
        <span className="category-card-progress">
          {done}/{total} done
        </span>
        {streak > 0 && <span className="category-card-streak">🔥 {streak}</span>}
      </span>
    </button>
  );
}
