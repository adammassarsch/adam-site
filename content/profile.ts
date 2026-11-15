// Site-wide facts about Adam. Every value here was confirmed by Adam in phase 1.

export type Vital = {
  label: string;
  value: string;
};

export const profile = {
  name: "Adam Massarsch",
  hero: {
    lead: "I build working AI software with Claude Code:",
    items: [
      "a real-time study app",
      "a prospecting engine with parallel agents",
      "lead scoring for Tagd",
    ],
  },
  links: {
    email: "adam.massarsch@gmail.com",
    github: "https://github.com/adammassarsch",
    linkedin: "https://www.linkedin.com/in/adam-massarsch-b90728351",
  },
  photo: {
    src: "/media/adam-portrait.webp",
    width: 1093,
    height: 1439,
    alt: "Portrait of Adam Massarsch",
  },
  vitals: [
    { label: "Studying", value: "Economics, Mälardalen University, year 1" },
    { label: "Before", value: "Western Colorado University, 2025–26" },
    { label: "National teams", value: "Sweden U16, U18, U20" },
    { label: "Based", value: "Stockholm and Västerås" },
    { label: "Looking for", value: "A part-time internship building AI products" },
  ] satisfies Vital[],
} as const;

/** The hero sentence as one string, for metadata and plain-text use. */
export function heroSentence(): string {
  const [a, b, c] = profile.hero.items;
  return `${profile.hero.lead} ${a}, ${b}, and ${c}.`;
}
