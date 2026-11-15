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

export type Decision = {
  title: string;
  text: string;
};

export type CaseLink = {
  label: string;
  /** Omitted when the thing exists but is not public, e.g. a private repo. */
  href?: string;
};

/** The case page: the same template for every project. */
export type Case = {
  problem: string;
  built: readonly string[];
  stack: string;
  decisions: readonly Decision[];
  hardest: string;
  /** Only true, confirmed results. Omitted when there are none to state. */
  results?: string;
  links: readonly CaseLink[];
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
  /** Present once the case page is written and approved for building. */
  case?: Case;
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
    case: {
      problem:
        "Seminars and group presentations are done together, but students prepare alone, and generic AI chat does not know their material. A group needs one place where everyone sees the same sources, and a way to practise answering hard questions before the real seminar.",
      built: [
        "A web app where one person creates a room and the rest of the group joins with a link or a six-character code, no account needed. Inside the room the group shares PDFs, asks a shared AI chat that has read the material and answers with page-level citations, follows a live activity log, and rehearses: individually, or as an AI-led group seminar where each person takes turns answering by voice. Results are visible to the whole group.",
        "The group version took two days to build, on top of a solo practice app I had built first.",
      ],
      stack:
        "Next.js 16, TypeScript, Tailwind CSS 4, Supabase (Postgres, Storage, Realtime, anonymous auth), the Anthropic Claude API with the Files API, ElevenLabs for voice, Vercel with a daily cron job.",
      decisions: [
        {
          title: "The browser reads, the server writes.",
          text: "Row-level security lets a browser read only rooms it is a member of. Every write goes through an API route that checks membership first, with the secret key kept on the server. A script checks that every API route is protected.",
        },
        {
          title: "Prompt caching by design.",
          text: "The prompt is ordered stable-first: system prompt, then the room's documents with a one-hour cache breakpoint, then what changes per question. Measured cost per question: about $0.47 for the first question after a pause in a room with seven papers (114,000 tokens), about $0.03 for follow-ups within the hour.",
        },
        {
          title: "Cost is checked before the call, not after.",
          text: "Every AI route checks a rolling 24-hour budget for the app and for each room, and logs usage afterwards. Before a chat question the app estimates its cost, including whether the cache is still warm, and refuses the call if it would not fit.",
        },
        {
          title: "Text instead of PDFs.",
          text: "Uploaded PDFs are converted to page-marked text before they reach the model. On real files this cut input tokens by 59 %. Scanned PDFs without a text layer fall back to the original file.",
        },
      ],
      hardest:
        "Citations the group can trust. Anthropic's built-in citations added 31–46 % more input tokens per question in my measurements, so I had the model write its own compact markers (document, page, quote) instead. The server then checks every quote against the extracted text page by page: a correct marker is kept, a wrong page is corrected, and a quote that cannot be found is removed. This also runs on the live stream, so nobody sees half a marker. In testing, 13 of 13 chat markers and 17 of 17 analysis markers passed, each also checked by hand against the PDF. Clicking a citation opens the PDF at that page with the quote highlighted.",
      links: [{ label: "Demo video above" }, { label: "Repo available on request" }],
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
