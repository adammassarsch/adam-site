// Site-wide facts about Adam. Every value here was confirmed by Adam in phase 1.

export type Vital = {
  label: string;
  value: string;
};

export const profile = {
  name: "Adam Massarsch",
  hero: {
    lead: "I build working AI software with Claude Code:",
    items: ["a real-time study app", "a prospecting engine with parallel agents"],
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
    { label: "Before", value: "Western Colorado University, basketball, 2025–26" },
    { label: "National team", value: "Swedish national basketball team\u00a0· U16, U18, U20" },
    {
      label: "Tagd, 2026",
      value: "Hands-on workshop with their AI engineer on a production lead-gen pipeline",
    },
    { label: "Based", value: "Stockholm and Västerås" },
    { label: "Looking for", value: "A part-time internship building AI products" },
  ] satisfies Vital[],
} as const;

/**
 * What goes between hero item `i` and the next one: "a and b", "a, b, and c".
 * The last item is followed by a full stop.
 */
export function heroJoiner(i: number): string {
  const n = profile.hero.items.length;
  if (i === n - 1) return ".";
  if (n === 2) return " and ";
  return i === n - 2 ? ", and " : ", ";
}

/** The hero sentence as one string, for metadata and plain-text use. */
export function heroSentence(): string {
  const items = profile.hero.items.map((item, i) => item + heroJoiner(i)).join("");
  return `${profile.hero.lead} ${items}`;
}
