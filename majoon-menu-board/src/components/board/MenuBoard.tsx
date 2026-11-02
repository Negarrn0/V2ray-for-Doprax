import { forwardRef, Fragment } from 'react';
import type { MenuConfig } from '../../types';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../config/defaultMenu';
import { BrandHeader } from './BrandHeader';
import { MenuSection } from './MenuSection';
import { KhatamStar, Lozenges } from './Ornaments';

export interface MenuBoardProps {
  config: MenuConfig;
  editable?: boolean;
  selectedId?: string | null;
  showSafeArea?: boolean;
  style?: React.CSSProperties;
  onSelect?: (sectionId: string, itemId: string | null) => void;
  onImage?: (sectionId: string, itemId: string, dataUrl: string) => void;
}

/**
 * The 3840 × 2160 board. Always rendered at native 4K pixel size;
 * previews scale it with a CSS transform so exports are pixel-exact.
 */
export const MenuBoard = forwardRef<HTMLDivElement, MenuBoardProps>(function MenuBoard(
  { config, editable = false, selectedId = null, showSafeArea = false, style, onSelect, onImage },
  ref,
) {
  const { brand, display, sections } = config;

  return (
    <div
      ref={ref}
      className={`mj-board theme-${config.theme} ${editable ? 'is-editable' : ''}`}
      style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, ...style }}
    >
      <div className="mj-backdrop" aria-hidden="true" />
      <div className="mj-frame" aria-hidden="true">
        {(['t', 'r', 'b', 'l'] as const).map((e) => (
          <span key={e} className={`mj-frame-edge mj-frame-edge--${e}`} />
        ))}
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
          <span key={c} className={`mj-frame-corner mj-frame-corner--${c}`}>
            <KhatamStar size={30} stroke={1.4} />
          </span>
        ))}
      </div>

      <div className="mj-safe">
        <BrandHeader brand={brand} />

        <main className="mj-body">
          {sections.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 && (
                <div className="mj-divider" aria-hidden="true">
                  <span className="mj-divider-line" />
                </div>
              )}
              <MenuSection
                section={s}
                index={i}
                display={display}
                editable={editable}
                selectedId={selectedId}
                onSelect={onSelect}
                onImage={onImage}
              />
            </Fragment>
          ))}
        </main>

        <footer className="mj-footer">
          <span className="mj-footer-text">{brand.footerNote}</span>
          <Lozenges />
          <span className="mj-footer-text mj-footer-text--end">{brand.footerHandle}</span>
        </footer>
      </div>

      {showSafeArea && (
        <div className="mj-safe-guides edit-only" aria-hidden="true">
          <span className="mj-guide mj-guide--action" title="Action-safe 3.5%" />
          <span className="mj-guide mj-guide--title" title="Title-safe 5%" />
        </div>
      )}
    </div>
  );
});
