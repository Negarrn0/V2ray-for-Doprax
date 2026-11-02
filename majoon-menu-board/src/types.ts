/**
 * MAJOON menu board — content model.
 * Everything the board displays lives in a MenuConfig object.
 * The layout components never hard-code content; they only render this data.
 */

export type ThemeName = 'burgundy' | 'green' | 'cream';

/** "arch"  → large editorial cards with a tall Persian-arch photograph.
 *  "list"  → refined rows: small arch thumbnail, name, leader line, price. */
export type SectionVariant = 'arch' | 'list';

/** How empty slots look: elegant hairline bars, labelled guides, or invisible. */
export type PlaceholderStyle = 'bars' | 'labels' | 'hidden';

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Free text — e.g. "85" or "85K". Prefix/suffix are applied globally. */
  price: string;
  /** Small caps label such as a signature marker. Hidden when empty. */
  badge: string;
  /** Data URL or absolute/relative URL. null = designed empty frame. */
  image: string | null;
  /** object-position of the photograph, 0–100 (%). */
  focusX: number;
  focusY: number;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  variant: SectionVariant;
  /** Number of card columns inside the section. */
  columns: number;
  /** Relative width of the section (flex weight, 1–12). */
  width: number;
  /** For list sections: show the small arch thumbnail. */
  showImages: boolean;
  items: Product[];
}

export interface Brand {
  name: string;
  tagline: string;
  descriptor: string;
  /** Persian wordmark shown in the header. */
  nativeName: string;
  footerNote: string;
  footerHandle: string;
}

export interface DisplaySettings {
  placeholderStyle: PlaceholderStyle;
  pricePrefix: string;
  priceSuffix: string;
  /** Show the 16-point khatam star motif inside empty image frames. */
  showFrameMotif: boolean;
}

export interface MenuConfig {
  version: 1;
  theme: ThemeName;
  brand: Brand;
  display: DisplaySettings;
  sections: Section[];
}
