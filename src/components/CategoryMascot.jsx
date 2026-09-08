const FACE = (
  <>
    <circle cx="-8" cy="-4" r="3.2" fill="#1a1a1a" />
    <circle cx="8" cy="-4" r="3.2" fill="#1a1a1a" />
    <path
      d="M -8 8 Q 0 14 8 8"
      stroke="#1a1a1a"
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    />
  </>
);

function AcademicsMascot() {
  return (
    <svg viewBox="0 0 120 120" width="56" height="56" aria-hidden="true">
      <circle cx="60" cy="64" r="40" fill="#dcd9fb" />
      <g transform="translate(60, 60)">{FACE}</g>
      <path d="M22 34 L60 20 L98 34 L60 48 Z" fill="#5b52d6" />
      <path d="M60 48 L60 62" stroke="#5b52d6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="63" r="3" fill="#5b52d6" />
    </svg>
  );
}

function SelfMascot() {
  return (
    <svg viewBox="0 0 120 120" width="56" height="56" aria-hidden="true">
      <circle cx="60" cy="64" r="40" fill="#d3ead9" />
      <g transform="translate(60, 60)">{FACE}</g>
      <path
        d="M60 16 C66 26 76 30 76 40 C76 48 68 54 60 54 C52 54 44 48 44 40 C44 30 54 26 60 16 Z"
        fill="#2f9e6f"
      />
    </svg>
  );
}

function BYOBMascot() {
  return (
    <svg viewBox="0 0 120 120" width="56" height="56" aria-hidden="true">
      <circle cx="60" cy="64" r="40" fill="#fbe0cf" />
      <g transform="translate(60, 62)">{FACE}</g>
      <path
        d="M60 14 C70 24 74 36 68 48 L52 48 C46 36 50 24 60 14 Z"
        fill="#e0592c"
      />
      <path d="M52 48 L44 60 L56 56 Z" fill="#e0592c" />
      <path d="M68 48 L76 60 L64 56 Z" fill="#e0592c" />
      <circle cx="60" cy="34" r="4" fill="#fbe0cf" />
    </svg>
  );
}

const MASCOTS = {
  academics: AcademicsMascot,
  self: SelfMascot,
  byob: BYOBMascot,
};

export default function CategoryMascot({ category }) {
  const Mascot = MASCOTS[category] ?? AcademicsMascot;
  return <Mascot />;
}
