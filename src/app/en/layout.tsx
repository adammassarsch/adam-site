import { copy } from "@content/home";
import { Document } from "@/components/Document";
import { brevetFonts } from "@/components/brevet/fonts";
import { brevetViewport } from "@/components/brevet/meta";
import "../globals.css";
import "../chrome.css";

/** Root layout for /en, the home page in English. Same fonts as /, no Familjen Grotesk. */
export const viewport = brevetViewport;

export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  return (
    <Document lang="en" className={brevetFonts} skip={copy.en.skip}>
      {children}
    </Document>
  );
}
