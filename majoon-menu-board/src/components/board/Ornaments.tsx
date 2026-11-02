/** Khatam — the eight-pointed star of Persian geometry, drawn as a single hairline outline. */
export function KhatamStar({ size = 40, stroke = 1.5, className = '' }: { size?: number; stroke?: number; className?: string }) {
  const R = 50;
  const r = R * 0.7654; // inner vertex radius where the two squares intersect
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 - 90) * (Math.PI / 180);
    const rad = i % 2 === 0 ? R : r;
    return `${(50 + rad * Math.cos(a)).toFixed(2)},${(50 + rad * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return (
    <svg className={className} width={size} height={size} viewBox="-2 -2 104 104" aria-hidden="true">
      <polygon points={pts} fill="none" stroke="currentColor" strokeWidth={(stroke * 100) / size} strokeLinejoin="miter" />
      <circle cx="50" cy="50" r={R * 0.2} fill="none" stroke="currentColor" strokeWidth={(stroke * 100) / size} />
    </svg>
  );
}

/** A horizontal hairline with a centred star — used under the header and in the footer. */
export function StarRule({ starSize = 44 }: { starSize?: number }) {
  return (
    <div className="mj-star-rule" aria-hidden="true">
      <span className="mj-hairline" />
      <KhatamStar size={starSize} className="mj-accent shrink-0" />
      <span className="mj-hairline" />
    </div>
  );
}

/** Three tiny lozenges — a quiet typographic separator. */
export function Lozenges() {
  return (
    <span className="mj-lozenges" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
