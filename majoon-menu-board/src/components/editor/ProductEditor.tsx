import { useEffect, useRef } from 'react';
import type { Product } from '../../types';
import type { MenuActions } from '../../lib/useMenuStore';
import { fileToOptimizedDataUrl } from '../../lib/image';
import { Button, IconButton, Range, TextField } from './fields';

interface Props {
  sectionId: string;
  product: Product;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  actions: MenuActions;
}

export function ProductEditor({ sectionId, product, index, count, open, onToggle, actions }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<Product>) => actions.updateItem(sectionId, product.id, patch);

  useEffect(() => {
    if (open) rootRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [open]);

  return (
    <div ref={rootRef} className={`rounded-lg border transition ${open ? 'border-cream/30 bg-studio' : 'border-studio-3 bg-studio/40'}`}>
      <div className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2" onClick={onToggle}>
        <div
          className="h-9 w-7 shrink-0 overflow-hidden rounded-t-full border border-cream/20 bg-forest/60"
          style={product.image ? { backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        />
        <div className="min-w-0 flex-1">
          <div className={`truncate text-[13px] ${product.name ? 'text-cream' : 'italic text-cream/35'}`}>
            {product.name || `Empty card ${index + 1}`}
          </div>
          <div className="truncate text-[11px] text-cream/35">{product.price ? product.price : 'no price'}</div>
        </div>
        <IconButton title="Move up" onClick={() => actions.moveItem(sectionId, product.id, -1)} disabled={index === 0}>↑</IconButton>
        <IconButton title="Move down" onClick={() => actions.moveItem(sectionId, product.id, 1)} disabled={index === count - 1}>↓</IconButton>
        <IconButton title="Duplicate card" onClick={() => actions.duplicateItem(sectionId, product.id)}>⧉</IconButton>
        <IconButton title="Remove card" danger onClick={() => actions.removeItem(sectionId, product.id)}>✕</IconButton>
      </div>

      {open && (
        <div className="space-y-3.5 border-t border-studio-3 px-3 pb-3.5 pt-3">
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={() => fileRef.current?.click()}>
              {product.image ? 'Replace photo' : 'Upload photo'}
            </Button>
            {product.image && <Button onClick={() => set({ image: null })}>Remove photo</Button>}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) set({ image: await fileToOptimizedDataUrl(f) });
              }}
            />
          </div>
          {product.image && (
            <div className="grid grid-cols-2 gap-3">
              <Range label="Focus ←→" value={product.focusX} min={0} max={100} suffix="%" onChange={(v) => set({ focusX: v })} />
              <Range label="Focus ↑↓" value={product.focusY} min={0} max={100} suffix="%" onChange={(v) => set({ focusY: v })} />
            </div>
          )}
          <TextField label="Product name" value={product.name} onChange={(v) => set({ name: v })} />
          <TextField label="Short description" multiline value={product.description} onChange={(v) => set({ description: v })} hint="Best at 6–14 words; two lines are shown." />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Price" value={product.price} onChange={(v) => set({ price: v })} />
            <TextField label="Badge (optional)" value={product.badge} onChange={(v) => set({ badge: v })} />
          </div>
        </div>
      )}
    </div>
  );
}
