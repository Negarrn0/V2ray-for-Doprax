import type { DisplaySettings, Section } from '../../types';
import { ProductCard } from './ProductCard';
import { TextSlot } from './TextSlot';

interface Props {
  section: Section;
  index: number;
  display: DisplaySettings;
  editable: boolean;
  selectedId: string | null;
  onSelect?: (sectionId: string, itemId: string | null) => void;
  onImage?: (sectionId: string, itemId: string, dataUrl: string) => void;
}

export function MenuSection({ section, index, display, editable, selectedId, onSelect, onImage }: Props) {
  const mode = display.placeholderStyle;
  const cols = Math.max(1, Math.min(6, section.columns));
  const rows = Math.max(1, Math.ceil(section.items.length / cols));

  return (
    <section
      className={`mj-section mj-section--${section.variant} ${selectedId === section.id ? 'is-selected' : ''}`}
      style={{ flexGrow: Math.max(1, section.width) }}
    >
      <header className="mj-section-head" onClick={editable ? () => onSelect?.(section.id, null) : undefined}>
        <div className="mj-numeral-row">
          <span className="mj-numeral">{String(index + 1).padStart(2, '0')}</span>
          <span className="mj-numeral-rule" />
        </div>
        <TextSlot as="h2" value={section.title} label="Category heading" mode={mode} bars={['46%']} className="mj-section-title" />
        <TextSlot
          as="p"
          value={section.subtitle}
          label="Category note"
          mode={mode === 'labels' ? 'labels' : 'hidden'}
          bars={['30%']}
          className="mj-section-sub"
        />
      </header>

      <div
        className="mj-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {section.items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            section={section}
            display={display}
            editable={editable}
            selected={selectedId === p.id}
            onSelect={editable ? () => onSelect?.(section.id, p.id) : undefined}
            onImage={(url) => onImage?.(section.id, p.id, url)}
          />
        ))}
      </div>
    </section>
  );
}
