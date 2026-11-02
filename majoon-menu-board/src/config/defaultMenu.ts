import type { MenuConfig, Product, Section, SectionVariant } from '../types';
import { uid } from '../lib/id';

/**
 * MASTER TEMPLATE — structure only.
 * No product names, prices, descriptions, categories or photos are defined here on purpose:
 * every slot is empty and renders as a designed placeholder until real content is added
 * (in the editor, or by importing a menu JSON file).
 */

export const BOARD_WIDTH = 3840;
export const BOARD_HEIGHT = 2160;

export function emptyProduct(): Product {
  return { id: uid('item'), name: '', description: '', price: '', badge: '', image: null, focusX: 50, focusY: 50 };
}

export function emptySection(variant: SectionVariant = 'list', count = 4): Section {
  return {
    id: uid('sec'),
    title: '',
    subtitle: '',
    variant,
    columns: variant === 'arch' ? 3 : 1,
    width: variant === 'arch' ? 6 : 3,
    showImages: true,
    items: Array.from({ length: count }, emptyProduct),
  };
}

export function createDefaultMenu(): MenuConfig {
  return {
    version: 1,
    theme: 'burgundy',
    brand: {
      name: 'MAJOON',
      tagline: 'more than a dessert',
      descriptor: 'Persian Dessert Bar · Bali',
      nativeName: 'معجون',
      footerNote: '',
      footerHandle: '',
    },
    display: {
      placeholderStyle: 'bars',
      pricePrefix: '',
      priceSuffix: '',
      showFrameMotif: true,
    },
    sections: [emptySection('arch', 3), emptySection('list', 4), emptySection('list', 4)],
  };
}

/** Merge an imported / stored object onto the template so older or partial files still load. */
export function normalizeMenu(input: unknown): MenuConfig {
  const base = createDefaultMenu();
  if (!input || typeof input !== 'object') return base;
  const raw = input as Partial<MenuConfig>;
  const sections = Array.isArray(raw.sections)
    ? raw.sections.map((s) => {
        const sec = { ...emptySection((s as Section).variant === 'arch' ? 'arch' : 'list', 0), ...(s as Section) };
        sec.id = sec.id || uid('sec');
        sec.items = Array.isArray(sec.items)
          ? sec.items.map((p) => ({ ...emptyProduct(), ...p, id: p?.id || uid('item') }))
          : [];
        return sec;
      })
    : base.sections;
  return {
    version: 1,
    theme: raw.theme === 'green' || raw.theme === 'cream' ? raw.theme : 'burgundy',
    brand: { ...base.brand, ...(raw.brand ?? {}) },
    display: { ...base.display, ...(raw.display ?? {}) },
    sections,
  };
}
