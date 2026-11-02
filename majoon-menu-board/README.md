# MAJOON — Digital Menu Board Template

A reusable 4K (3840 × 2160, 16:9) menu board template for **MAJOON – Persian Dessert Bar, Bali**, built with React, TypeScript and Tailwind CSS.

This is the **master design template**. It has no product names, prices, descriptions, categories or photos. Every slot is empty and shows a designed placeholder until you add real content.

## Run it

```bash
cd majoon-menu-board
npm install
npm run dev          # editor at http://localhost:5173
                     # TV view at http://localhost:5173/?mode=display
npm run build        # dist/index.html, a single offline HTML file
```

## Design system

| Token | Value | Use |
|---|---|---|
| Burgundy | `#4A1823` | default background, cream-theme ink |
| Warm Cream | `#E5DCC9` | ink on dark themes, cream-theme background |
| Deep Green | `#081702` | green-theme background, cream-theme accent |
| Display type | Cormorant Garamond | wordmark, headings, names, prices |
| Sans type | Jost | descriptor, numerals, descriptions, labels |
| Persian type | Amiri | the معجون wordmark |

Motifs: Persian-arch photo frames, the eight-pointed *khatam* star, hairline rules and a quiet frame inside the TV action-safe area. All content sits inside the 5% title-safe area. You can preview the guides under **Display → Show TV safe-area guides**.

### Components (`src/components/board/`)

- `MenuBoard`: the 3840 × 2160 canvas (frame, header, section row, footer).
- `BrandHeader`: wordmark, tagline, Persian wordmark and descriptor, with a star rule underneath.
- `MenuSection`: numeral, category heading, optional note, and a card grid that fills the space it has.
- `ProductCard`: two variants:
  - `arch`: feature card with a tall arch photo, name, description and price.
  - `list`: arch thumbnail (optional), name, dotted leader, price and description.
- `ImageSlot`: arch photo frame. Click it in the editor to upload or replace a photo.
- `TextSlot`: shows the text if there is some. If not, it keeps the same space with hairline bars, editor labels or nothing.

Cards scale with container queries. When you add cards to a section the grid splits the space again, and type sizes have minimums so the board never scrolls or overflows.

## Content is separate from layout

Everything shown on the board is one `MenuConfig` object (`src/types.ts`). The empty master template is in `src/config/defaultMenu.ts`. Layout components only render that data.

```jsonc
{
  "theme": "burgundy",               // burgundy | green | cream
  "brand": { "name", "tagline", "descriptor", "nativeName", "footerNote", "footerHandle" },
  "display": { "placeholderStyle": "bars", "pricePrefix": "", "priceSuffix": "", "showFrameMotif": true },
  "sections": [{
    "title": "", "subtitle": "",
    "variant": "arch",               // arch | list
    "columns": 3, "width": 6,        // width = relative share of the row
    "showImages": true,
    "items": [{ "name": "", "description": "", "price": "", "badge": "", "image": null, "focusX": 50, "focusY": 50 }]
  }]
}
```

## Editing

- **Menu content tab:** edit category headings and notes; add, duplicate, reorder or remove categories and product cards; upload, replace or remove photos and set the photo focus point; set name, description, price and an optional badge.
- **Click on the preview:** click a card to open it in the editor, or click a photo frame to upload a photo.
- **Brand tab:** wordmark, tagline, descriptor, Persian name and footer texts.
- **Display tab:** colour theme, how empty slots look (hairlines, labels or hidden), price prefix and suffix, and safe-area guides.
- Changes save automatically in the browser. Use **Save JSON / Import JSON** to keep and move menu files.

Uploaded photos are downsized to 1800 px on the long edge, which is larger than any frame on the board, and stored inside the menu file.

## Export

| Export | What it is |
|---|---|
| PNG · 3840 × 2160 | lossless 4K image for a TV, media player or signage system |
| JPEG · 3840 × 2160 | smaller 4K image for USB playback |
| Standalone HTML | one offline file containing the app and your menu. It opens full-screen on the board; press **E** to edit, **F** for full screen. Only available from the built file (`npm run build`, then open `dist/index.html`). |
| Menu JSON | the editable source. Re-import it any time. |

For a TV browser, open `?mode=display` or the exported HTML and press **F**. Older TV browsers may not support modern CSS, so the 4K PNG/JPEG is the safest option.
