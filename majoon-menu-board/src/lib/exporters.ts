import { toJpeg, toPng } from 'html-to-image';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../config/defaultMenu';
import type { MenuConfig } from '../types';

/** Snapshot of the untouched document, captured in main.tsx before React mounts. */
let pristineHtml = '';
export function capturePristineHtml() {
  const clone = document.documentElement.cloneNode(true) as HTMLElement;
  // Drop any menu data injected into a previously exported file; fresh data is added on export.
  clone.querySelectorAll('script[data-majoon]').forEach((el) => el.remove());
  pristineHtml = '<!doctype html>\n' + clone.outerHTML;
}

function download(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

/** Render the board node at native 3840 × 2160, independent of the on-screen preview scale. */
export async function exportBoardImage(node: HTMLElement, format: 'png' | 'jpeg') {
  await document.fonts.ready;
  node.classList.add('is-exporting');
  try {
    const opts = {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      canvasWidth: BOARD_WIDTH,
      canvasHeight: BOARD_HEIGHT,
      pixelRatio: 1,
      // html-to-image can drop the root's var()-based background; pass the resolved colour explicitly.
      backgroundColor: getComputedStyle(node).backgroundColor,
      style: { transform: 'none', transformOrigin: '0 0', margin: '0', left: '0', top: '0' },
    };
    const url = format === 'png' ? await toPng(node, opts) : await toJpeg(node, { ...opts, quality: 0.95 });
    download(url, `majoon-menu-4k-${stamp()}.${format === 'png' ? 'png' : 'jpg'}`);
  } finally {
    node.classList.remove('is-exporting');
  }
}

export function exportJson(config: MenuConfig) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  download(url, `majoon-menu-${stamp()}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** True when running from the single-file production build (the only build that can clone itself). */
export const canExportStandalone = () => !import.meta.env.DEV && pristineHtml.length > 0;

/**
 * Standalone HTML = this very app (JS + CSS + fonts already inlined by the single-file build)
 * plus the current menu content injected as data. Opens directly in display mode;
 * press E in the file to reopen the editor.
 */
export function exportStandaloneHtml(config: MenuConfig) {
  const payload = JSON.stringify({ config, mode: 'display' }).replace(/</g, '\\u003c');
  const inject = `<script data-majoon>window.__MAJOON__=${payload};<` + `/script>`;
  const at = pristineHtml.indexOf('<head>') + '<head>'.length;
  const html = pristineHtml.slice(0, at) + inject + pristineHtml.slice(at);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  download(url, `majoon-menu-display-${stamp()}.html`);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function readJsonFile(file: File): Promise<unknown> {
  return JSON.parse(await file.text());
}
