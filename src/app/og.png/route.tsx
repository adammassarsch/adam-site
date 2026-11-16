import { heroSentence } from "@content/profile";
import { projects } from "@content/projects";
import { factLead, renderCard } from "@/lib/og";

/*
 * The site card, at a fixed address. Every page outside the case pages names
 * it in its metadata (ogImage in lib/metadata.ts), resolved against
 * metadataBase from site-url.ts. It is a route rather than an
 * opengraph-image file because no layout sits above app/: a metadata file
 * there would be resolved without a metadataBase.
 */
export async function GET() {
  const { fact } = projects[0];
  return renderCard({
    headline: heroSentence(),
    figure: fact.figure,
    figureText: factLead(fact.text),
  });
}
