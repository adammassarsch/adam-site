import { Document } from "@/components/Document";
import { grotesk } from "@/lib/fonts";
import { siteViewport } from "@/lib/metadata";
import "../globals.css";
import "../chrome.css";

/** Root layout for /video: Swedish, set in Familjen Grotesk, with none of the site chrome. */
export const viewport = siteViewport;

export default function VideoLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang="sv" className={grotesk.variable} skip="Hoppa till innehållet">
      {children}
    </Document>
  );
}
