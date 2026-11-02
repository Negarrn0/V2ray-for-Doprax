import { useState } from 'react';
import type { MenuConfig, PlaceholderStyle, Section, ThemeName } from '../../types';
import type { MenuActions } from '../../lib/useMenuStore';
import { IconButton, Segmented, TextField, Toggle, Range } from './fields';
import { ProductEditor } from './ProductEditor';

export interface Selection {
  sectionId: string | null;
  itemId: string | null;
}

interface Props {
  config: MenuConfig;
  actions: MenuActions;
  selection: Selection;
  onSelect: (s: Selection) => void;
  showSafeArea: boolean;
  onShowSafeArea: (v: boolean) => void;
}

type Tab = 'menu' | 'brand' | 'display';

const THEMES: { value: ThemeName; label: string; bg: string; fg: string }[] = [
  { value: 'burgundy', label: 'Burgundy', bg: '#4A1823', fg: '#E5DCC9' },
  { value: 'green', label: 'Deep Green', bg: '#081702', fg: '#E5DCC9' },
  { value: 'cream', label: 'Warm Cream', bg: '#E5DCC9', fg: '#4A1823' },
];

export function EditorPanel({ config, actions, selection, onSelect, showSafeArea, onShowSafeArea }: Props) {
  const [tab, setTab] = useState<Tab>('menu');

  return (
    <div className="flex h-full flex-col">
      <nav className="flex gap-1 border-b border-studio-3 px-4">
        {(['menu', 'brand', 'display'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-3 text-[11.5px] font-medium uppercase tracking-[0.16em] transition ${
              tab === t ? 'border-cream text-cream' : 'border-transparent text-cream/40 hover:text-cream/80'
            }`}
          >
            {t === 'menu' ? 'Menu content' : t}
          </button>
        ))}
      </nav>

      <div className="studio-scroll flex-1 overflow-y-auto px-4 py-4">
        {tab === 'menu' && (
          <div className="space-y-4">
            {config.sections.map((s, i) => (
              <SectionEditor
                key={s.id}
                section={s}
                index={i}
                count={config.sections.length}
                actions={actions}
                selection={selection}
                onSelect={onSelect}
              />
            ))}
            <button
              onClick={actions.addSection}
              className="w-full rounded-lg border border-dashed border-cream/20 py-3 text-[12px] uppercase tracking-[0.16em] text-cream/50 transition hover:border-cream/50 hover:text-cream"
            >
              + Add category column
            </button>
          </div>
        )}

        {tab === 'brand' && (
          <div className="space-y-4">
            <TextField label="Brand name" value={config.brand.name} onChange={(v) => actions.setBrand({ name: v })} />
            <TextField label="Tagline" value={config.brand.tagline} onChange={(v) => actions.setBrand({ tagline: v })} />
            <TextField label="Descriptor" value={config.brand.descriptor} onChange={(v) => actions.setBrand({ descriptor: v })} />
            <TextField label="Persian wordmark" dir="rtl" value={config.brand.nativeName} onChange={(v) => actions.setBrand({ nativeName: v })} />
            <TextField label="Footer note (left)" value={config.brand.footerNote} onChange={(v) => actions.setBrand({ footerNote: v })} hint="e.g. allergen or service note. Empty = hidden." />
            <TextField label="Footer handle (right)" value={config.brand.footerHandle} onChange={(v) => actions.setBrand({ footerHandle: v })} hint="e.g. social handle or website. Empty = hidden." />
          </div>
        )}

        {tab === 'display' && (
          <div className="space-y-5">
            <div>
              <span className="mb-1.5 block text-[10.5px] font-medium uppercase tracking-[0.18em] text-cream/55">Colour theme</span>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => actions.setTheme(t.value)}
                    className={`rounded-md border p-1.5 text-left transition ${config.theme === t.value ? 'border-cream' : 'border-studio-3 hover:border-cream/40'}`}
                  >
                    <div className="grid h-12 place-items-center rounded font-display text-[17px] tracking-[0.2em]" style={{ background: t.bg, color: t.fg }}>
                      M
                    </div>
                    <div className="mt-1.5 text-[11px] text-cream/70">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <Segmented<PlaceholderStyle>
              label="Empty slots"
              value={config.display.placeholderStyle}
              onChange={(v) => actions.setDisplay({ placeholderStyle: v })}
              options={[
                { value: 'bars', label: 'Hairlines' },
                { value: 'labels', label: 'Labels' },
                { value: 'hidden', label: 'Hidden' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Price prefix" value={config.display.pricePrefix} onChange={(v) => actions.setDisplay({ pricePrefix: v })} />
              <TextField label="Price suffix" value={config.display.priceSuffix} onChange={(v) => actions.setDisplay({ priceSuffix: v })} />
            </div>
            <p className="-mt-3 text-[11px] text-cream/35">Applied to every price that has a value, e.g. a currency mark.</p>
            <Toggle label="Star motif in empty frames" checked={config.display.showFrameMotif} onChange={(v) => actions.setDisplay({ showFrameMotif: v })} />
            <Toggle label="Show TV safe-area guides (preview only)" checked={showSafeArea} onChange={onShowSafeArea} />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionEditor(props: {
  section: Section;
  index: number;
  count: number;
  actions: MenuActions;
  selection: Selection;
  onSelect: (s: Selection) => void;
}) {
  const { section: s, index, count, actions, selection, onSelect } = props;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const active = selection.sectionId === s.id;
  const set = (patch: Partial<Section>) => actions.updateSection(s.id, patch);

  return (
    <div className={`rounded-xl border p-3 transition ${active ? 'border-cream/35 bg-studio-2' : 'border-studio-3 bg-studio-2/60'}`}>
      <div className="flex items-center gap-2">
        <span className="font-sans text-[11px] tracking-[0.3em] text-cream/40">{String(index + 1).padStart(2, '0')}</span>
        <div className={`min-w-0 flex-1 truncate font-display text-[19px] ${s.title ? 'text-cream' : 'italic text-cream/35'}`}>
          {s.title || 'Untitled category'}
        </div>
        <IconButton title="Move left" onClick={() => actions.moveSection(s.id, -1)} disabled={index === 0}>←</IconButton>
        <IconButton title="Move right" onClick={() => actions.moveSection(s.id, 1)} disabled={index === count - 1}>→</IconButton>
        <IconButton title="Duplicate category" onClick={() => actions.duplicateSection(s.id)}>⧉</IconButton>
        <IconButton title="Remove category" danger onClick={() => actions.removeSection(s.id)}>✕</IconButton>
      </div>

      <div className="mt-3 space-y-3">
        <TextField label="Category heading" value={s.title} onChange={(v) => set({ title: v })} />
        <TextField label="Category note (optional)" value={s.subtitle} onChange={(v) => set({ subtitle: v })} />

        <button
          className="text-[11px] uppercase tracking-[0.16em] text-cream/45 hover:text-cream"
          onClick={() => setSettingsOpen((o) => !o)}
        >
          {settingsOpen ? '− Layout' : '+ Layout'} · {s.variant === 'arch' ? 'Feature arches' : 'List rows'} · {s.columns} col · width {s.width}
        </button>
        {settingsOpen && (
          <div className="space-y-3 rounded-lg bg-studio p-3">
            <Segmented
              label="Card style"
              value={s.variant}
              onChange={(v) => set({ variant: v, columns: v === 'arch' ? Math.max(s.columns, 2) : 1 })}
              options={[
                { value: 'arch', label: 'Feature arches' },
                { value: 'list', label: 'List rows' },
              ]}
            />
            <Range label="Columns" value={s.columns} min={1} max={s.variant === 'arch' ? 5 : 3} onChange={(v) => set({ columns: v })} />
            <Range label="Relative width" value={s.width} min={1} max={12} onChange={(v) => set({ width: v })} />
            {s.variant === 'list' && <Toggle label="Show thumbnails" checked={s.showImages} onChange={(v) => set({ showImages: v })} />}
          </div>
        )}

        <div className="space-y-2 pt-1">
          {s.items.map((p, i) => (
            <ProductEditor
              key={p.id}
              sectionId={s.id}
              product={p}
              index={i}
              count={s.items.length}
              open={selection.itemId === p.id}
              onToggle={() => onSelect(selection.itemId === p.id ? { sectionId: s.id, itemId: null } : { sectionId: s.id, itemId: p.id })}
              actions={actions}
            />
          ))}
          <button
            onClick={() => actions.addItem(s.id)}
            className="w-full rounded-lg border border-dashed border-cream/15 py-2 text-[11.5px] uppercase tracking-[0.14em] text-cream/45 transition hover:border-cream/45 hover:text-cream"
          >
            + Add product card
          </button>
        </div>
      </div>
    </div>
  );
}
