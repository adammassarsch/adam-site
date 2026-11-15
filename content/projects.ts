// One entry per project. A new project is a new entry here and nothing else.
// Copy approved by Adam in phase 1; case-page sections are added in phase 4.

export type Video = {
  src: string;
  poster: string;
  /** What the video shows, for screen readers and as a caption. */
  label: string;
  durationSeconds: number;
};

/** One measured or confirmed figure, with the sentence that explains it. */
export type Fact = {
  figure: string;
  text: string;
};

export type Project = {
  slug: string;
  title: string;
  /** When the work happened, as shown in the release rail. */
  period: string;
  summary: string;
  tags: readonly string[];
  /** The single figure that matters for this project, if there is one. */
  fact?: Fact;
  video?: Video;
};

export const projects = [
  {
    slug: "seminar",
    title: "Seminar for groups",
    period: "Nov 2026",
    summary:
      "A shared AI room where a study group uploads its material, asks one AI together and rehearses for the seminar.",
    tags: ["Next.js", "Supabase", "Claude API", "Realtime", "Vercel"],
    fact: {
      figure: "$0.47 → $0.03",
      text: "Cost per question in a room with seven papers: the first after a pause, then follow-ups read from the prompt cache.",
    },
    video: {
      src: "/media/seminar-demo.mp4",
      poster: "/media/seminar-demo-poster.jpg",
      label:
        "Demo of Seminar for groups, in Swedish: students in a shared room ask the AI about their material and open a cited page in the PDF.",
      durationSeconds: 52,
    },
  },
  {
    slug: "blue-mesa",
    title: "Blue Mesa",
    period: "Summer 2026",
    summary:
      "A prospecting service that finds companies with a reason to buy now, built on parallel AI agents and one rule: every contact needs a source.",
    tags: ["Claude Code", "Subagents", "Python", "Prompt pipeline"],
    fact: {
      figure: "Two paying customers",
      text: "In summer 2026.",
    },
    video: {
      src: "/media/blue-mesa-demo.mp4",
      poster: "/media/blue-mesa-demo-poster.jpg",
      label:
        "Demo of Blue Mesa, in Swedish: describe who to find, check company size, find a dated reason to buy, find the decision makers and export the list to Excel. The companies shown are made up.",
      durationSeconds: 32,
    },
  },
  {
    slug: "lead-bot",
    title: "Lead Bot for Tagd",
    period: "Summer–fall 2026",
    summary:
      "Prospect scoring added to Tagd's lead-generation API: dated “why now” events, per-customer scoring and cheaper enrichment.",
    tags: ["Python", "FastAPI", "Postgres", "Claude API", "React"],
  },
] as const satisfies readonly Project[];
