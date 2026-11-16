import { Document } from "@/components/Document";
import { NotFound, notFoundMetadata } from "@/components/NotFound";
import { grotesk } from "@/lib/fonts";
import { siteMetadata, siteViewport } from "@/lib/metadata";
import "./globals.css";
import "./chrome.css";

/*
 * For URLs that match no route. With three root layouts there is no single
 * layout to render a 404 in, so this file renders the whole document itself,
 * the same way the (site) layout does.
 */
export const metadata = { ...siteMetadata, ...notFoundMetadata };
export const viewport = siteViewport;

export default function GlobalNotFound() {
  return (
    <Document lang="en" className={grotesk.variable} skip="Skip to content">
      <NotFound />
    </Document>
  );
}
