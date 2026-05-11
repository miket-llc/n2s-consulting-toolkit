// Per-school monogram styling for the SchoolLogo component.
//
// When the curated layer (logoUrl) is absent and Clearbit fails or times out,
// SchoolLogo falls back to a monogram. This table gives each engagement school-
// specific styling — typeface family, background, and foreground color — so the
// fallback still reads as that institution's brand rather than a generic chip.
//
// Schema per project id:
//   font     — one of the keys in SCHOOL_BRAND_FONT_STACK
//   bg       — tile background (school primary color)
//   fg       — initials color (usually white or the secondary)
//   weight   — optional font-weight override (default 800)
//   tracking — optional letter-spacing override (default '-0.04em')
//
// accent field intentionally omitted — the brief forbids decorative bars/rules.

export type SchoolFontKey =
  | "serif"
  | "serif-italic"
  | "slab"
  | "sans-condensed"
  | "sans-black";

export type SchoolBrand = {
  font: SchoolFontKey;
  bg: string;
  fg: string;
  weight?: number;
  tracking?: string;
};

export const SCHOOL_BRANDS: Record<string, SchoolBrand> = {
  // p1 — Northern State University · Aberdeen, SD · Wolves
  // Brand: maroon + gold. Heritage public university.
  p1: {
    font: "serif",
    bg: "#a32638",   // NSU maroon
    fg: "#ffffff",
    weight: 700,
    tracking: "-0.04em",
  },

  // p2 — Western Illinois University · Macomb, IL · Leathernecks
  // Brand: purple + gold. Athletics-forward, bold sans.
  p2: {
    font: "sans-black",
    bg: "#4d2a7a",   // WIU purple
    fg: "#ffffff",
    weight: 900,
    tracking: "-0.06em",
  },

  // p3 — Cal State East Bay · Hayward, CA · Pioneers
  // Brand: red + gold. CSU system style, bold sans.
  p3: {
    font: "sans-black",
    bg: "#b51e2a",   // East Bay red
    fg: "#ffffff",
    weight: 900,
    tracking: "-0.05em",
  },

  // p4 — University of South Carolina · Columbia, SC · Gamecocks
  // Brand: garnet + black. Italic serif "block S" tradition.
  p4: {
    font: "serif-italic",
    bg: "#73000a",   // USC garnet
    fg: "#ffffff",
    weight: 700,
    tracking: "-0.05em",
  },

  // p5 — University of Vermont · Burlington, VT · Catamounts
  // Brand: green + gold. Heritage serif.
  p5: {
    font: "serif",
    bg: "#005f43",   // UVM green
    fg: "#ffffff",
    weight: 700,
    tracking: "-0.04em",
  },

  // p6 — Lafayette College · Easton, PA · Leopards
  // Brand: maroon + white. Refined liberal arts serif.
  p6: {
    font: "serif",
    bg: "#640014",   // Lafayette maroon (deep)
    fg: "#ffffff",
    weight: 600,
    tracking: "-0.02em",
  },

  // p7 — Oakland University · Rochester, MI · Golden Grizzlies
  // Brand: black + gold. Sharp, modern, athletic.
  p7: {
    font: "sans-black",
    bg: "#000000",
    fg: "#ffffff",
    weight: 900,
    tracking: "-0.06em",
  },

  // p8 — Coastline Community College · Fountain Valley, CA · Seahawks
  // Brand: blue. Clean modern community college sans.
  p8: {
    font: "sans-condensed",
    bg: "#1d6fb8",   // Coastline blue
    fg: "#ffffff",
    weight: 800,
    tracking: "-0.04em",
  },
};

// Map font keyword → CSS font-family stack.
// Variables (--font-playfair, etc.) are defined in layout.tsx via next/font/google.
export const SCHOOL_BRAND_FONT_STACK: Record<SchoolFontKey, string> = {
  "serif":          "var(--font-playfair), 'Times New Roman', Georgia, serif",
  "serif-italic":   "var(--font-playfair), 'Times New Roman', Georgia, serif",
  "slab":           "var(--font-roboto-slab), 'Rockwell', 'Courier New', serif",
  "sans-condensed": "var(--font-oswald), 'Arial Narrow', 'Helvetica Neue', sans-serif",
  "sans-black":     "var(--font-archivo-black), 'Arial Black', 'Helvetica Neue', sans-serif",
};
