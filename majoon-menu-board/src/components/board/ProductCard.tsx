import type { DisplaySettings, Product, Section } from '../../types';
import { ImageSlot } from './ImageSlot';
import { TextSlot } from './TextSlot';

interface Props {
  product: Product;
  section: Section;
  display: DisplaySettings;
  editable: boolean;
  selected: boolean;
  onSelect?: () => void;
  onImage?: (dataUrl: string) => void;
}

function formatPrice(price: string, d: DisplaySettings) {
  return price.trim() ? `${d.pricePrefix}${price.trim()}${d.priceSuffix}` : '';
}

export function ProductCard({ product, section, display, editable, selected, onSelect, onImage }: Props) {
  const mode = display.placeholderStyle;
  const price = formatPrice(product.price, display);
  const cls = `mj-card mj-card--${section.variant} ${selected ? 'is-selected' : ''} ${editable ? 'is-editable' : ''}`;
  const slot = {
    image: product.image,
    focusX: product.focusX,
    focusY: product.focusY,
    showMotif: display.showFrameMotif,
    showLabel: mode === 'labels',
    editable,
    onImage,
  };

  if (section.variant === 'arch') {
    return (
      <article className={cls} onClick={onSelect}>
        <div className="mj-card-arch-media">
          <ImageSlot {...slot} motifSize={72} className="mj-arch--tall" />
          {product.badge.trim() && <span className="mj-badge mj-badge--float">{product.badge}</span>}
        </div>
        <div className="mj-card-arch-text">
          <TextSlot as="h3" value={product.name} label="Product name" mode={mode} bars={['58%']} align="center" className="mj-name" />
          <TextSlot as="p" value={product.description} label="Short description" mode={mode} bars={['82%', '56%']} align="center" className="mj-desc" />
          <div className="mj-price-row">
            <span className="mj-price-rule" />
            <TextSlot as="span" value={price} label="Price" mode={mode} bars={['2.6em']} align="center" className="mj-price" />
            <span className="mj-price-rule" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`${cls} ${section.showImages ? '' : 'no-image'}`} onClick={onSelect}>
      {section.showImages && <ImageSlot {...slot} motifSize={40} className="mj-arch--thumb" />}
      <div className="mj-card-list-text">
        {product.badge.trim() && <span className="mj-badge">{product.badge}</span>}
        <div className="mj-list-headline">
          <TextSlot as="h3" value={product.name} label="Product name" mode={mode} bars={['78%']} className="mj-name" />
          <span className="mj-leader" />
          <TextSlot as="span" value={price} label="Price" mode={mode} bars={['2.4em']} align="end" className="mj-price" />
        </div>
        <TextSlot as="p" value={product.description} label="Short description" mode={mode} bars={['92%', '64%']} className="mj-desc" />
      </div>
    </article>
  );
}
