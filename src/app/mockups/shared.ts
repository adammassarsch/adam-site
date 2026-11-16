// Redesign test only. Every string here is existing site copy, shortened or
// cut, never new claims. Source fields are named next to each value.

import type { Metadata } from "next";
import { profile } from "@content/profile";
import { projects } from "@content/projects";

export const mockupMetadata = (name: string): Metadata => ({
  title: `${profile.name} · mockup: ${name}`,
  robots: { index: false, follow: false },
});

/** profile.hero.lead, without the list after the colon. */
export const headline = "I build working AI software with Claude Code.";

/** contact.text */
export const seeking = "I’m looking for a part-time internship building AI products.";

export const mailto = `mailto:${profile.links.email}`;

type MockProject = {
  slug: string;
  title: string;
  /** Shortest honest result: project.fact, cut. Absent when there is none. */
  result?: string;
  /** project.summary, cut to one sentence where it had two clauses. */
  sentence: string;
  /** Used where a project has no result: the rest of project.summary. */
  description?: string;
  tags: readonly string[];
  video: { src: string; poster: string; label: string };
};

const byslug = (slug: string) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`No project ${slug}`);
  return p;
};

const seminar = byslug("seminar");
const blueMesa = byslug("blue-mesa");
const film = byslug("text-to-film");

export const mockProjects: MockProject[] = [
  {
    slug: seminar.slug,
    title: seminar.title,
    result: "$0.47 → $0.03 per question",
    sentence: "A shared AI room where a study group uploads its material, asks one AI together and rehearses.",
    tags: seminar.tags,
    video: seminar.video,
  },
  {
    slug: blueMesa.slug,
    title: blueMesa.title,
    result: "Two paying customers",
    sentence: "A prospecting service that finds companies with a reason to buy now, built on parallel AI agents.",
    tags: blueMesa.tags,
    video: blueMesa.video,
  },
  {
    slug: film.slug,
    title: film.title,
    sentence: "A Claude Code workflow that turns a company’s process page into a short explainer film.",
    description: "Rendered in code from the page’s own words.",
    tags: film.tags,
    video: film.video,
  },
];

/** Vitals moved into About, labels kept. */
export const aboutFacts = profile.vitals.filter((v) => v.label !== "Looking for");
