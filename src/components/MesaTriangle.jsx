export default function MesaTriangle({ categories, complete }) {
  const [top, left, right] = categories;

  return (
    <div className={`mesa-triangle-wrap${complete ? " mesa-triangle-complete" : ""}`}>
      <svg viewBox="0 0 120 108" width="88" height="80" aria-hidden="true">
        <polygon points="60,14 16,96 104,96" className="mesa-triangle-shape" />
        <line x1="60" y1="14" x2="16" y2="96" className="mesa-triangle-edge" />
        <line x1="16" y1="96" x2="104" y2="96" className="mesa-triangle-edge" />
        <line x1="104" y1="96" x2="60" y2="14" className="mesa-triangle-edge" />
        <circle
          cx="60"
          cy="14"
          r="8"
          className={`mesa-node mesa-node-${top.id}${top.complete ? " is-on" : ""}`}
        />
        <circle
          cx="16"
          cy="96"
          r="8"
          className={`mesa-node mesa-node-${left.id}${left.complete ? " is-on" : ""}`}
        />
        <circle
          cx="104"
          cy="96"
          r="8"
          className={`mesa-node mesa-node-${right.id}${right.complete ? " is-on" : ""}`}
        />
      </svg>
      {complete && <p className="mesa-complete-badge">MESA COMPLETE · 👏👏👏</p>}
    </div>
  );
}
