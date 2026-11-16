import { profile } from "@content/profile";
import { projects, type Project } from "@content/projects";
import { factLead, ogSize, renderCard } from "@/lib/og";

export const alt = profile.name;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.filter((p) => "case" in p).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project = projects.find((p) => p.slug === slug) ?? projects[0];
  return renderCard({
    date: project.period,
    headline: project.title,
    figure: project.fact?.figure,
    figureText: project.fact && factLead(project.fact.text),
  });
}
