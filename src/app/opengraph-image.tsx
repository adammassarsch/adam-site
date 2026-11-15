import { heroSentence } from "@content/profile";
import { projects } from "@content/projects";
import { factLead, ogSize, renderCard } from "@/lib/og";

export const alt = heroSentence();
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const { fact } = projects[0];
  return renderCard({
    headline: heroSentence(),
    figure: fact.figure,
    figureText: factLead(fact.text),
  });
}
