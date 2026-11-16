import type { CSSProperties, ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { heroJoiner, heroSentence, profile } from "@content/profile";
import { projects } from "@content/projects";
import { contact, howIBuild } from "@content/site";
import { Footer } from "@/components/SiteChrome";
import { CostLedger } from "@/components/lab/CostLedger";
import { GateTrack, type Phase } from "@/components/lab/GateTrack";
import { Lanes } from "@/components/lab/Lanes";
import { Prompt } from "@/components/lab/Prompt";
import { Terminal, type LogLine, type Scene } from "@/components/lab/Terminal";
import "./lab.css";

/*
 * Session Replay: the same facts as the home page, replayed as the session
 * that built them. Every figure and label below is read out of the approved
 * copy in content/*.ts, so the page cannot drift from it: if a sentence stops
 * saying what a scene shows, the build fails here.
 */

/** Everything on this page that is not already in content/*.ts. */
const copy = {
  title: "Session Replay",
  boot: "Boot",
  replay: "Replay",
  session: {
    loaded: "plan.md loaded",
    stop: "STOP — waiting for Adam",
    command: "/kolla",
    checks: ["typecheck", "lint", "build"],
    review: "review: fresh session, different model",
  },
  ledger: {
    scrub: "Time since the last question",
    hint: "Drag into the cache →",
    cold: "cold",
    warm: "warm",
    now: "now",
    minutes: "min",
    hours: "h",
    note: "Blocks are not drawn to scale.",
    dot: "Each dot is one token.",
    total: "Only the total is drawn, not how much of it is cached.",
  },
  lanes: {
    check: "No rows lost.",
    caption: "Simulated run. The rows are made up and their outcomes are random.",
  },
  gates: { go: "go", stopped: "Stop:" },
  prompt: "email adam",
  more: "Read the case",
} as const;

/** The phases and stops of docs/how-this-was-built.md, in its own words. */
const phases: readonly Phase[] = [
  { name: "Foundation", stop: "I ran /kolla and saw CI pass." },
  { name: "Content before design", stop: "I approved or corrected all text. No design until it was settled." },
  { name: "Design direction", stop: "I picked one." },
  { name: "Home page", stop: "I went through it in the browser." },
  { name: "Case pages", stop: "I approved it before the others were built." },
  { name: "Polish" },
  { name: "Launch" },
  { name: "Review", stop: "I went through the list and decided what to change." },
  { name: "Fixes" },
];

/** Named pieces of a sentence in the approved copy. Throws when the copy no longer has them. */
function read<const K extends readonly string[]>(
  source: string,
  pattern: RegExp,
  keys: K,
): Record<K[number], string> {
  const match = pattern.exec(source);
  const out: Record<string, string> = {};
  keys.forEach((key, i) => {
    const value = match?.[i + 1];
    if (value === undefined) {
      throw new Error(`/lab: the approved copy no longer contains "${key}" (${pattern.source})`);
    }
    out[key] = value;
  });
  return out as Record<K[number], string>;
}

const [seminar, blueMesa] = projects;

// Scene 2: Seminar for groups
const caching = seminar.case.decisions[1];
const extraction = seminar.case.decisions[3];
const cost = read(
  caching.text,
  /about (\$[\d.]+) for (the first question after a pause)[^(]*\(([\d,]+ tokens)\), about (\$[\d.]+) for (follow-ups within the hour)/,
  ["cold", "coldWhen", "coldTokens", "warm", "warmWhen"],
);
const prompt = read(
  caching.text,
  /(system prompt), then the (room.s documents) with a (one-hour cache breakpoint), then (what changes per question)/,
  ["system", "documents", "breakpoint", "question"],
);
const perQuestion = read(seminar.fact.text, /^(cost per question).*(read from the prompt cache)/, [
  "label",
  "cached",
]);
const saving = read(extraction.text, /by (\d+) %/, ["percent"]);
const formats = read(extraction.title, /^(Text) instead of (PDFs)/, ["after", "before"]);
const checked = read(
  seminar.case.hardest,
  /(In testing, (\d+) of (\d+) (chat markers) and (\d+) of (\d+) (analysis markers)[^.]*\.)/,
  ["sentence", "chatPassed", "chatTotal", "chatLabel", "analysisPassed", "analysisTotal", "analysisLabel"],
);
const citations = [
  { passed: Number(checked.chatPassed), total: Number(checked.chatTotal), label: checked.chatLabel },
  {
    passed: Number(checked.analysisPassed),
    total: Number(checked.analysisTotal),
    label: checked.analysisLabel,
  },
];

// Scene 3: Blue Mesa
const parallel = blueMesa.case.built[1];
const split = read(parallel, /the (company list) is split into groups of (\d+)–(\d+), (one subagent per group)/, [
  "list",
  "min",
  "max",
  "lanes",
]);
const classified = blueMesa.case.decisions[1];
const written = blueMesa.case.decisions[2];
const sheet = read(written.text, /a script writes it into the (spreadsheet)/, ["label"]);
const classes = read(
  classified.text,
  /^(\w+) \(([^)]+)\), (\w+) \(([^)]+)\), (\w+), or ([\w ]+)\. (.+)$/,
  ["verified", "verifiedNote", "pattern", "patternNote", "generic", "notFound", "notFoundNote"],
);
const rowClasses = [
  { label: classes.verified.toLowerCase(), note: classes.verifiedNote },
  { label: classes.pattern, note: classes.patternNote },
  { label: classes.generic },
  { label: classes.notFound, note: classes.notFoundNote },
];

const scenes: readonly Scene[] = [
  // The boot sheet is torn away; what stays at the top of the page is the hero.
  { id: "intro", label: copy.boot },
  { id: seminar.slug, label: seminar.title },
  { id: blueMesa.slug, label: blueMesa.title },
  { id: "how-i-build", label: howIBuild.title },
  { id: "contact", label: contact.title },
];

/**
 * The session as it is typed. Pauses are in milliseconds, after the segment.
 * With the typing speed in Terminal.tsx the whole log takes about 2.5 seconds
 * before the sheet tears away.
 */
const log: readonly LogLine[] = [
  [{ text: copy.session.loaded, pause: 120 }],
  ...phases.map((phase, i): LogLine => [
    { text: `${i}  `, tone: "mute" },
    { text: phase.name, pause: 15 },
  ]),
  [{ text: copy.session.stop, tone: "stop", pause: 300 }],
  [
    { text: copy.session.command, pause: 60 },
    ...copy.session.checks.flatMap((check, i, all) => [
      { text: " ✓", tone: "ok" as const },
      { text: ` ${check}`, pause: i === all.length - 1 ? 120 : 60 },
    ]),
  ],
  [{ text: copy.session.review }],
];

/** The browser chrome continues the status line: Riso Lab ink (--ink in lab.css). */
export const viewport: Viewport = { themeColor: "#1d1b2e" };

export const metadata: Metadata = {
  title: `${copy.title} · ${profile.name}`,
  description: heroSentence(),
  alternates: { canonical: "/lab" },
  // An experiment that repeats the home page: kept out of search results.
  robots: { index: false },
};

type SceneHeadProps = {
  id: string;
  /** 1-based position among the scenes. */
  index: number;
  title: string;
  period?: string;
  children: ReactNode;
};

function SceneHead({ id, index, title, period, children }: SceneHeadProps) {
  return (
    <header className="lab-head">
      <h2 id={id}>
        <span className="lab-title">{title}</span>
        <span className="lab-date">
          {index}/{scenes.length}
          {period && ` · ${period}`}
        </span>
      </h2>
      <div className="lab-lead">{children}</div>
    </header>
  );
}

export default function Lab() {
  const mailto = `mailto:${profile.links.email}`;
  const kept = 1 - Number(saving.percent) / 100;

  return (
    <>
      <div className="lab">
        <Terminal name={profile.name} title={copy.title} scenes={scenes} log={log} replayLabel={copy.replay} />

        <main className="lab-main" id="main">
          <h1 className="lab-hero" id={scenes[0]?.id}>
            {profile.hero.lead}{" "}
            {profile.hero.items.map((text, i) => (
              <span key={text}>
                <a href={`#${projects[i]?.slug ?? "main"}`}>
                  {text}
                </a>
                {heroJoiner(i)}
              </span>
            ))}
          </h1>

          <section id={seminar.slug} className="lab-scene" aria-labelledby="lab-seminar">
            <SceneHead id="lab-seminar" index={2} title={seminar.title} period={seminar.period}>
              <p>{seminar.summary}</p>
              <p className="lab-fact">
                <mark>{seminar.fact.figure}</mark> {seminar.fact.text}
              </p>
            </SceneHead>

            <CostLedger
              cold={{
                cost: cost.cold,
                when: cost.coldWhen,
                detail: cost.coldTokens,
                state: copy.ledger.cold,
              }}
              warm={{
                cost: cost.warm,
                when: cost.warmWhen,
                detail: perQuestion.cached,
                state: copy.ledger.warm,
              }}
              windowMinutes={60}
              blocks={[prompt.system, prompt.documents, prompt.question]}
              breakpoint={prompt.breakpoint}
              perQuestion={perQuestion.label}
              tokens={Number(cost.coldTokens.replace(/\D/g, ""))}
              copy={copy.ledger}
            />

            <div className="lab-notes">
              <div className="lab-note">
                <h3>{caching.title}</h3>
                <p>{caching.text}</p>
              </div>

              <div className="lab-note" data-watch>
                <p className="lab-big">{saving.percent}&nbsp;%</p>
                <dl className="lab-bars" style={{ "--kept": kept } as CSSProperties}>
                  <div>
                    <dt>{formats.before}</dt>
                    <dd>
                      <i />
                    </dd>
                  </div>
                  <div data-kept>
                    <dt>{formats.after}</dt>
                    <dd>
                      <i />
                    </dd>
                  </div>
                </dl>
                <h3>{extraction.title}</h3>
                <p>{extraction.text}</p>
              </div>

              <div className="lab-note" data-watch>
                {citations.map((group, g) => (
                  <div key={group.label} className="lab-checked">
                    <p className="lab-big">
                      {group.passed}/{group.total} <span>{group.label}</span>
                    </p>
                    <ol className="lab-ticks" aria-hidden="true">
                      {Array.from({ length: group.total }, (_, i) => (
                        <li
                          key={i}
                          data-passed={i < group.passed ? "" : undefined}
                          // The second group starts ticking where the first one ends.
                          style={{ "--i": i + (g > 0 ? (citations[g - 1]?.total ?? 0) : 0) } as CSSProperties}
                        />
                      ))}
                    </ol>
                  </div>
                ))}
                <p>{checked.sentence}</p>
              </div>
            </div>

            <p className="lab-more">
              <a href={`/projects/${seminar.slug}`}>
                {copy.more}
                <span className="sr-only">: {seminar.title}</span>
              </a>
            </p>
          </section>

          <section id={blueMesa.slug} className="lab-scene" aria-labelledby="lab-blue-mesa">
            <SceneHead id="lab-blue-mesa" index={3} title={blueMesa.title} period={blueMesa.period}>
              <p>{blueMesa.summary}</p>
              <p className="lab-fact">
                <mark>{blueMesa.fact.figure}</mark> {blueMesa.fact.text}
              </p>
            </SceneHead>

            <Lanes
              min={Number(split.min)}
              max={Number(split.max)}
              classes={rowClasses}
              description={parallel}
              labels={{ list: split.list, lanes: split.lanes, sheet: sheet.label }}
              copy={{ ...copy.lanes, replay: copy.replay }}
            />

            <div className="lab-notes">
              <div className="lab-note">
                <p>{parallel}</p>
              </div>
              <div className="lab-note">
                <h3>{classified.title}</h3>
                <p>{classified.text}</p>
              </div>
              <div className="lab-note">
                <h3>{written.title}</h3>
                <p>{written.text}</p>
              </div>
            </div>

            <p className="lab-more">
              <a href={`/projects/${blueMesa.slug}`}>
                {copy.more}
                <span className="sr-only">: {blueMesa.title}</span>
              </a>
            </p>
          </section>

          <section id="how-i-build" className="lab-scene" aria-labelledby="lab-how">
            <SceneHead id="lab-how" index={4} title={howIBuild.title}>
              <p>{howIBuild.intro}</p>
            </SceneHead>

            <div className="lab-build">
              <GateTrack phases={phases} copy={{ ...copy.gates, waiting: copy.session.stop }} />

              <ol className="lab-principles">
                {howIBuild.principles.map((principle) => (
                  <li key={principle.title}>
                    <h3>{principle.title}</h3>
                    <p>
                      {principle.text}
                      {"link" in principle && principle.link && (
                        <>
                          {" "}
                          <a href={principle.link.href}>{principle.link.label}</a>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <Prompt
            id="contact"
            index={`${scenes.length}/${scenes.length}`}
            title={contact.title}
            text={contact.text}
            prompt={copy.prompt}
            mailto={mailto}
            email={profile.links.email}
            links={[
              { label: "LinkedIn", href: profile.links.linkedin },
              { label: "GitHub", href: profile.links.github },
            ]}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
