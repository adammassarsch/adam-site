import { copy } from "@content/home";
import { Document } from "@/components/Document";
import { brevetFonts } from "@/components/brevet/fonts";
import { brevetViewport } from "@/components/brevet/meta";
import "../globals.css";
import "../chrome.css";

/** Root layout for / in Swedish. No Familjen Grotesk: the letter is set in its own fonts. */
export const viewport = brevetViewport;

export default function SwedishLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang="sv" className={brevetFonts} skip={copy.sv.skip}>
      {children}
    </Document>
  );
}
