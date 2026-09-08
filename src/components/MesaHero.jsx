import { useRef } from "react";
import { getHeroCopy } from "../lib/clapProtocol.js";

const PARTICLE_COUNT = 7;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function MesaHero({ completedCount, categories }) {
  const coreRef = useRef(null);
  const copy = getHeroCopy(completedCount);
  const [top, left, right] = categories;
  const complete = completedCount === 3;

  function handleMouseMove(e) {
    const core = coreRef.current;
    if (!core) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const rect = core.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    core.style.setProperty("--tilt-x", `${py * -10}deg`);
    core.style.setProperty("--tilt-y", `${px * 10}deg`);
  }

  function handleMouseLeave() {
    const core = coreRef.current;
    if (!core) return;
    core.style.setProperty("--tilt-x", "0deg");
    core.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <section
      className={`mesa-hero${complete ? " mesa-hero-complete" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mesa-hero-glow" aria-hidden="true" />

      <div className="mesa-core-stage">
        <div className="mesa-core" ref={coreRef} aria-hidden="true">
          <div className="mesa-core-ring" />
          <svg viewBox="0 0 200 180" className="mesa-core-svg">
            <line x1="100" y1="24" x2="30" y2="156" className="mesa-core-edge" />
            <line x1="30" y1="156" x2="170" y2="156" className="mesa-core-edge" />
            <line x1="170" y1="156" x2="100" y2="24" className="mesa-core-edge" />
            <circle
              cx="100"
              cy="24"
              r="13"
              className={`mesa-core-node mesa-core-academics${top.complete ? " is-on" : ""}`}
            />
            <circle
              cx="30"
              cy="156"
              r="13"
              className={`mesa-core-node mesa-core-self${left.complete ? " is-on" : ""}`}
            />
            <circle
              cx="170"
              cy="156"
              r="13"
              className={`mesa-core-node mesa-core-byob${right.complete ? " is-on" : ""}`}
            />
          </svg>
          <div className="mesa-core-particles">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <span key={i} className={`mesa-particle mesa-particle-${i}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="mesa-hero-eyebrow">MESA FORGE</p>
      <h1 className="mesa-hero-title">{copy.title}</h1>
      <p className="mesa-hero-subtitle">{copy.subtitle}</p>
    </section>
  );
}
