import type { PlaceholderStyle } from '../../types';

interface Props {
  value: string;
  label: string;
  mode: PlaceholderStyle;
  /** Widths of the placeholder hairline bars — one bar per reserved line. */
  bars: string[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  as?: 'h2' | 'h3' | 'p' | 'div' | 'span';
}

/**
 * Renders real text when present; otherwise reserves the exact same space with a designed placeholder.
 * Placeholders never contain fake copy — only hairline bars or an editor-only label.
 */
export function TextSlot({ value, label, mode, bars, className = '', align = 'start', as: Tag = 'div' }: Props) {
  if (value.trim()) return <Tag className={className}>{value}</Tag>;

  const justify = align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start';
  return (
    <Tag className={`${className} mj-empty`} aria-label={`${label} (empty)`}>
      {bars.map((w, i) => (
        <span key={i} className="mj-bar-line" style={{ justifyContent: justify }}>
          {'\u200b' /* zero-width space: gives the line the font's exact line-height */}
          {mode === 'bars' && <span className="mj-bar" style={{ width: w }} />}
          {mode === 'labels' && i === 0 && (
            <span className="mj-slot-label" style={{ minWidth: w }}>
              {label}
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}
