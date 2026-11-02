import { useCallback, useEffect, useRef, useState } from 'react';
import { useMenuStore } from './lib/useMenuStore';
import { ScaledBoard } from './components/ScaledBoard';
import { EditorPanel, type Selection } from './components/editor/EditorPanel';
import { Button } from './components/editor/fields';
import { canExportStandalone, exportBoardImage, exportJson, exportStandaloneHtml, readJsonFile } from './lib/exporters';

type Mode = 'edit' | 'display';

function initialMode(): Mode {
  const q = new URLSearchParams(window.location.search).get('mode');
  if (q === 'display' || q === 'edit') return q;
  return window.__MAJOON__?.mode === 'display' ? 'display' : 'edit';
}

export default function App() {
  const { config, actions, saveError } = useMenuStore();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [selection, setSelection] = useState<Selection>({ sectionId: null, itemId: null });
  const [showSafeArea, setShowSafeArea] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Keyboard: E toggles editor / display, F toggles fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select')) return;
      if (e.key === 'e' || e.key === 'E') setMode((m) => (m === 'edit' ? 'display' : 'edit'));
      if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      }
      if (e.key === 'Escape') setSelection({ sectionId: null, itemId: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runExport = useCallback(async (label: string, fn: () => Promise<void> | void) => {
    setExportOpen(false);
    setBusy(label);
    try {
      await new Promise((r) => setTimeout(r, 30));
      await fn();
    } catch (err) {
      console.error(err);
      alert(`Export failed: ${(err as Error).message ?? err}`);
    } finally {
      setBusy(null);
    }
  }, []);

  if (mode === 'display') {
    return (
      <div className="h-full w-full cursor-none bg-black" onDoubleClick={() => setMode('edit')}>
        <ScaledBoard config={config} ref={boardRef} />
      </div>
    );
  }

  const standaloneOk = canExportStandalone();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <aside className="flex w-[400px] shrink-0 flex-col border-r border-studio-3 bg-studio-2">
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <div className="font-display text-[26px] font-medium leading-none tracking-[0.22em]">MAJOON</div>
            <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.24em] text-cream/45">Menu board template studio</div>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <EditorPanel
            config={config}
            actions={actions}
            selection={selection}
            onSelect={setSelection}
            showSafeArea={showSafeArea}
            onShowSafeArea={setShowSafeArea}
          />
        </div>
        <div className="flex flex-wrap gap-2 border-t border-studio-3 p-4">
          <Button onClick={() => importRef.current?.click()} title="Load a menu JSON file">Import JSON</Button>
          <Button onClick={() => exportJson(config)} title="Save the editable menu file">Save JSON</Button>
          <Button
            onClick={() => {
              if (confirm('Reset to the empty master template? Current content will be cleared.')) {
                actions.reset();
                setSelection({ sectionId: null, itemId: null });
              }
            }}
          >
            Reset
          </Button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                actions.replaceAll(await readJsonFile(f));
              } catch {
                alert('That file is not a valid MAJOON menu JSON.');
              }
            }}
          />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-studio-3 px-6 py-3">
          <div className="text-[11.5px] uppercase tracking-[0.18em] text-cream/45">
            Live preview · 3840 × 2160 · 16:9
            {saveError ? <span className="ml-3 normal-case tracking-normal text-[#e8a49a]">{saveError}</span> : <span className="ml-3 normal-case tracking-normal text-cream/30">Autosaved in this browser</span>}
          </div>
          <div className="relative flex items-center gap-2">
            <Button onClick={() => setMode('display')} title="Full-screen TV view (press E to return)">Present</Button>
            <Button variant="primary" onClick={() => setExportOpen((o) => !o)} disabled={!!busy}>
              {busy ?? 'Export ▾'}
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-[300px] overflow-hidden rounded-lg border border-studio-3 bg-studio-2 shadow-2xl">
                <ExportItem
                  title="PNG · 3840 × 2160"
                  note="Lossless 4K image for TV, media player or signage CMS"
                  onClick={() => runExport('Rendering…', () => exportBoardImage(boardRef.current!, 'png'))}
                />
                <ExportItem
                  title="JPEG · 3840 × 2160"
                  note="Smaller 4K file for USB playback on TVs"
                  onClick={() => runExport('Rendering…', () => exportBoardImage(boardRef.current!, 'jpeg'))}
                />
                <ExportItem
                  title="Standalone HTML"
                  note={
                    standaloneOk
                      ? 'One offline file: opens full-screen, press E to edit'
                      : 'Available from the built file (npm run build) — not in dev mode'
                  }
                  disabled={!standaloneOk}
                  onClick={() => runExport('Packaging…', () => exportStandaloneHtml(config))}
                />
                <ExportItem title="Menu JSON" note="Editable source — re-import any time" onClick={() => runExport('Saving…', () => exportJson(config))} />
              </div>
            )}
          </div>
        </header>
        <div className="min-h-0 flex-1 bg-[radial-gradient(ellipse_at_center,#1f1a17_0%,#0e0c0b_75%)] p-8">
          <ScaledBoard
            ref={boardRef}
            shadow
            config={config}
            editable
            showSafeArea={showSafeArea}
            selectedId={selection.itemId ?? selection.sectionId}
            onSelect={(sectionId, itemId) => setSelection({ sectionId, itemId })}
            onImage={(sid, iid, url) => {
              actions.updateItem(sid, iid, { image: url });
              setSelection({ sectionId: sid, itemId: iid });
            }}
          />
        </div>
        <footer className="border-t border-studio-3 px-6 py-2 text-[11px] text-cream/35">
          Click a card to edit it · click a photo frame to upload · <kbd className="text-cream/60">E</kbd> toggle TV view ·{' '}
          <kbd className="text-cream/60">F</kbd> full screen
        </footer>
      </main>
    </div>
  );
}

function ExportItem(props: { title: string; note: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="block w-full border-b border-studio-3 px-4 py-3 text-left transition last:border-b-0 hover:bg-studio-3 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <div className="text-[13px] text-cream">{props.title}</div>
      <div className="mt-0.5 text-[11px] text-cream/45">{props.note}</div>
    </button>
  );
}
