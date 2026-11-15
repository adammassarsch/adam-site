// Home page copy outside the projects. Approved by Adam in phase 1 (2026-11-15).

export const siteUrl = "https://adam.bluemesa.se";
export const repoUrl = "https://github.com/adammassarsch/adam-site";

export type Principle = {
  title: string;
  text: string;
  link?: { href: string; label: string };
};

export const howIBuild = {
  title: "How I build",
  intro:
    "I build with Claude Code. The point is not that an AI writes code; it is that I set up the work so the result can be trusted.",
  principles: [
    {
      title: "Plan first, one piece at a time.",
      text: "My projects start with a written plan in phases, with a stop after each phase where I test before anything continues. This site was built that way too.",
    },
    {
      title: "CLAUDE.md as a handover.",
      text: "The project file says what is built, what is decided, what is waiting and what to watch out for, so the next session, or the next person, can pick it up without asking.",
      link: { href: `${repoUrl}/blob/main/CLAUDE.md`, label: "Read this site’s CLAUDE.md" },
    },
    {
      title: "Budgets in code.",
      text: "Every route that calls a model checks a budget before the call and logs the cost after it. Prompts are ordered so the expensive part is cached.",
    },
    {
      title: "Measure, then decide.",
      text: "Built-in citations were measured at 31–46 % more tokens, so I built my own and verify them in code. Text extraction was measured at 59 % fewer tokens before it became the default.",
    },
    {
      title: "Never invent.",
      text: "The agents I write have explicit rules: a source for every claim, “not found” as a valid answer, and code, not the model, writing the final result.",
    },
  ] satisfies Principle[],
} as const;

export const about = {
  title: "About",
  text: "I started building with AI to solve problems I saw around me: preparing for seminars, and finding the right companies to sell to.",
} as const;

export const contact = {
  title: "Let’s talk",
  text: "I’m looking for a part-time internship building AI products.",
  action: "Email me",
} as const;
