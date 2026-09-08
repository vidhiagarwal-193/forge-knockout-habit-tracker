export default function MesaReceipt({ summary, comboLabel, comboStreak, cookedStatus }) {
  const clapCount = summary.completedCount;

  return (
    <div className="mesa-receipt">
      <p className="mesa-receipt-title">TODAY'S RECEIPT</p>
      {summary.categories.map((c) => (
        <div className="mesa-receipt-line" key={c.id}>
          <span>{c.label}</span>
          <span>{c.complete ? "✓" : "✗"}</span>
        </div>
      ))}
      <div className="mesa-receipt-divider" />
      <div className="mesa-receipt-line">
        <span>Total</span>
        <span>{summary.completedCount}/3</span>
      </div>
      <div className="mesa-receipt-line">
        <span>Combo</span>
        <span>
          {comboLabel ? `${comboLabel}${comboStreak > 1 ? ` ×${comboStreak}` : ""}` : "—"}
        </span>
      </div>
      <div className="mesa-receipt-line">
        <span>Status</span>
        <span>{cookedStatus}</span>
      </div>
      <div className="mesa-receipt-line">
        <span>Clap requirement</span>
        <span>{clapCount > 0 ? "👏".repeat(clapCount) : "—"}</span>
      </div>
    </div>
  );
}
