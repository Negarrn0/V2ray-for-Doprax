/**
 * Reads an uploaded photo and downsizes it so the whole menu (images included)
 * stays small enough for browser storage and for a single exported HTML file.
 * 1800px on the long edge is more than the largest frame on the 4K board.
 */
export async function fileToOptimizedDataUrl(file: File, maxEdge = 1800, quality = 0.88): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
  if (file.type === 'image/svg+xml') return original;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = original;
  });
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, w, h);
  // Keep transparency for PNG cut-outs, otherwise use compact JPEG.
  return file.type === 'image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality);
}
