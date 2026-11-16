import { Inter, Newsreader } from "next/font/google";

/*
 * Only what the page uses: Newsreader 400 for headings and results, Inter 400
 * and 600 for text. The heading font is preloaded, since the first screen is
 * set in it; the body font swaps in from a metric-matched fallback.
 */
const serif = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--b-serif",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--b-sans",
  preload: false,
});

/** Set on <html>, so the skip link outside the letter gets them too. */
export const brevetFonts = `${serif.variable} ${sans.variable}`;
