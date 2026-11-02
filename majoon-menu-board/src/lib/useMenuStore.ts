import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Brand, DisplaySettings, MenuConfig, Product, Section, ThemeName } from '../types';
import { createDefaultMenu, emptyProduct, emptySection, normalizeMenu } from '../config/defaultMenu';
import { uid } from './id';

const STORAGE_KEY = 'majoon.menu-board.v1';

declare global {
  interface Window {
    /** Injected into exported standalone HTML files. */
    __MAJOON__?: { config?: unknown; mode?: 'display' | 'edit' };
  }
}

function loadInitial(): MenuConfig {
  if (window.__MAJOON__?.config) return normalizeMenu(window.__MAJOON__.config);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeMenu(JSON.parse(stored));
  } catch {
    /* storage unavailable — fall back to template */
  }
  return createDefaultMenu();
}

const move = <T,>(arr: T[], index: number, dir: -1 | 1): T[] => {
  const to = index + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  [next[index], next[to]] = [next[to], next[index]];
  return next;
};

export function useMenuStore() {
  const [config, setConfig] = useState<MenuConfig>(loadInitial);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timer = useRef<number>();

  // Autosave (debounced — images are stored inline as data URLs).
  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        setSaveError(null);
      } catch {
        setSaveError('Browser storage is full — export the menu JSON to keep a copy of your changes.');
      }
    }, 400);
    return () => window.clearTimeout(timer.current);
  }, [config]);

  const mapSection = useCallback((id: string, fn: (s: Section) => Section) => {
    setConfig((c) => ({ ...c, sections: c.sections.map((s) => (s.id === id ? fn(s) : s)) }));
  }, []);

  const actions = useMemo(
    () => ({
      setTheme: (theme: ThemeName) => setConfig((c) => ({ ...c, theme })),
      setBrand: (patch: Partial<Brand>) => setConfig((c) => ({ ...c, brand: { ...c.brand, ...patch } })),
      setDisplay: (patch: Partial<DisplaySettings>) =>
        setConfig((c) => ({ ...c, display: { ...c.display, ...patch } })),

      updateSection: (id: string, patch: Partial<Section>) => mapSection(id, (s) => ({ ...s, ...patch })),
      addSection: () => setConfig((c) => ({ ...c, sections: [...c.sections, emptySection('list', 4)] })),
      duplicateSection: (id: string) =>
        setConfig((c) => {
          const i = c.sections.findIndex((s) => s.id === id);
          if (i < 0) return c;
          const src = c.sections[i];
          const copy: Section = { ...src, id: uid('sec'), items: src.items.map((p) => ({ ...p, id: uid('item') })) };
          const sections = c.sections.slice();
          sections.splice(i + 1, 0, copy);
          return { ...c, sections };
        }),
      removeSection: (id: string) => setConfig((c) => ({ ...c, sections: c.sections.filter((s) => s.id !== id) })),
      moveSection: (id: string, dir: -1 | 1) =>
        setConfig((c) => ({ ...c, sections: move(c.sections, c.sections.findIndex((s) => s.id === id), dir) })),

      updateItem: (sid: string, iid: string, patch: Partial<Product>) =>
        mapSection(sid, (s) => ({ ...s, items: s.items.map((p) => (p.id === iid ? { ...p, ...patch } : p)) })),
      addItem: (sid: string) => mapSection(sid, (s) => ({ ...s, items: [...s.items, emptyProduct()] })),
      duplicateItem: (sid: string, iid: string) =>
        mapSection(sid, (s) => {
          const i = s.items.findIndex((p) => p.id === iid);
          if (i < 0) return s;
          const items = s.items.slice();
          items.splice(i + 1, 0, { ...s.items[i], id: uid('item') });
          return { ...s, items };
        }),
      removeItem: (sid: string, iid: string) =>
        mapSection(sid, (s) => ({ ...s, items: s.items.filter((p) => p.id !== iid) })),
      moveItem: (sid: string, iid: string, dir: -1 | 1) =>
        mapSection(sid, (s) => ({ ...s, items: move(s.items, s.items.findIndex((p) => p.id === iid), dir) })),

      replaceAll: (next: unknown) => setConfig(normalizeMenu(next)),
      reset: () => setConfig(createDefaultMenu()),
    }),
    [mapSection],
  );

  return { config, actions, saveError };
}

export type MenuActions = ReturnType<typeof useMenuStore>['actions'];
