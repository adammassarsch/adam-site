import { Document } from "@/components/Document";
import { grotesk } from "@/lib/fonts";
import { siteMetadata, siteViewport } from "@/lib/metadata";
import "../globals.css";
import "../chrome.css";

/** Root layout for the case pages and /lab: English, set in Familjen Grotesk. */
export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang="en" className={grotesk.variable} skip="Skip to content">
      {children}
    </Document>
  );
}
