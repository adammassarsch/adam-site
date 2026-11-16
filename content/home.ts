// The home page (Brevet) in two languages. English is read from the site's
// content files, so it never drifts; where it is shorter, the source field is
// named next to the value. Swedish is a translation of the same text, with no
// new claims; every Swedish string lives in this file and nowhere else.

import { profile } from "@content/profile";
import { projects } from "@content/projects";
import { about, contact, howIBuild } from "@content/site";

export type Lang = "sv" | "en";

/** profile.hero.lead, without the list after the colon. */
export const headline = "I build working AI software with Claude Code.";

type HomeProject = {
  slug: string;
  title: string;
  /** Shortest honest result: project.fact, cut. Absent when there is none. */
  result?: string;
  /** project.summary, cut to one sentence where it had two clauses. */
  sentence: string;
  /** Used where a project has no result: the rest of project.summary. */
  description?: string;
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

export const homeProjects: HomeProject[] = [
  {
    slug: seminar.slug,
    title: seminar.title,
    result: "$0.47 → $0.03 per question",
    sentence: "A shared AI room where a study group uploads its material, asks one AI together and rehearses.",
    video: seminar.video,
  },
  {
    slug: blueMesa.slug,
    title: blueMesa.title,
    result: "Two paying customers",
    sentence: "A prospecting service that finds companies with a reason to buy now, built on parallel AI agents.",
    video: blueMesa.video,
  },
  {
    slug: film.slug,
    title: film.title,
    sentence: "A Claude Code workflow that turns a company’s process page into a short explainer film.",
    description: "Rendered in code from the page’s own words.",
    video: film.video,
  },
];

/** profile.vitals, moved into About, labels kept. */
export const aboutFacts = profile.vitals.filter((v) => v.label !== "Looking for");

type Link = { href: string; label: string };

export type BrevetCopy = {
  lang: Lang;
  skip: string;
  nav: { label: string; work: string; how: string; about: string };
  email: string;
  langLabel: string;
  photoAlt: string;
  headline: string;
  seeking: string;
  workTitle: string;
  watchDemo: string;
  projects: {
    slug: string;
    title: string;
    result?: string;
    sentence: string;
    description?: string;
    videoLabel: string;
  }[];
  how: { title: string; intro: string; principles: { title: string; text: string; link?: Link }[] };
  about: { title: string; text: string; facts: { label: string; value: string }[] };
  contact: { title: string; text: string; source: string };
};

const en: BrevetCopy = {
  lang: "en",
  skip: "Skip to content",
  nav: { label: "Main", work: "Work", how: "How I build", about: "About" },
  email: contact.action,
  langLabel: "Language",
  photoAlt: profile.photo.alt,
  headline,
  seeking: contact.text,
  workTitle: "Work",
  watchDemo: "Watch demo",
  projects: homeProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    result: p.result,
    sentence: p.sentence,
    description: p.description,
    videoLabel: p.video.label,
  })),
  how: {
    title: howIBuild.title,
    intro: howIBuild.intro,
    principles: howIBuild.principles.map((p) => ({
      title: p.title,
      text: p.text,
      link: "link" in p ? p.link : undefined,
    })),
  },
  about: { title: about.title, text: about.text, facts: aboutFacts.map((f) => ({ label: f.label, value: f.value })) },
  contact: { title: contact.title, text: contact.text, source: "Source for this site" },
};

/** Links in "How I build" point at the same English documents in both languages. */
const docLink = (i: number) => en.how.principles[i]?.link?.href ?? "";

const sv: BrevetCopy = {
  lang: "sv",
  skip: "Hoppa till innehållet",
  nav: { label: "Huvudmeny", work: "Projekt", how: "Så bygger jag", about: "Om mig" },
  email: "Mejla mig",
  langLabel: "Språk",
  photoAlt: "Porträtt av Adam Massarsch",
  headline: "Jag bygger fungerande AI-mjukvara med Claude Code.",
  seeking: "Jag söker deltidsarbete eller praktik där jag bygger AI-produkter.",
  workTitle: "Projekt",
  watchDemo: "Se demo",
  projects: [
    {
      slug: "seminar",
      title: "Seminar for groups",
      result: "$0,47 → $0,03 per fråga",
      sentence: "Ett delat AI-rum där en studiegrupp laddar upp sitt material, frågar en gemensam AI och övar.",
      videoLabel:
        "Demo av Seminar for groups, på svenska: studenter i ett delat rum frågar AI:n om sitt material och öppnar en källhänvisad sida i PDF:en.",
    },
    {
      slug: "blue-mesa",
      title: "Blue Mesa",
      result: "Två betalande kunder",
      sentence: "En prospekteringstjänst som hittar företag med skäl att köpa nu, byggd på parallella AI-agenter.",
      videoLabel:
        "Förklarande film om Blue Mesa, på svenska: beskriv vilka som ska hittas, kontrollera företagets storlek, hitta ett daterat skäl att köpa, hitta beslutsfattarna och exportera listan till Excel. Företagen som visas är påhittade.",
    },
    {
      slug: "text-to-film",
      title: "Text → Film",
      sentence: "Ett arbetsflöde i Claude Code som gör om ett företags processida till en kort förklarande film.",
      description: "Renderad i kod av sidans egna ord.",
      videoLabel:
        "Visningsfilm för Text → Film, på svenska: en play-knapp träffar ett företags processida, bokstäverna faller till golvet och blir ett transportband med fyra stationer: förfrågan, offert, produktion och leverans.",
    },
  ],
  how: {
    title: "Så bygger jag",
    intro:
      "Jag bygger med Claude Code. Poängen är inte att en AI skriver kod, utan att jag lägger upp arbetet så att resultatet går att lita på.",
    principles: [
      {
        title: "Planera först, en del i taget.",
        text: "Mina projekt börjar med en skriven plan i faser, med ett stopp efter varje fas där jag testar innan något går vidare. Den här sajten byggdes också så.",
        link: { href: docLink(0), label: "Läs hur den här sajten byggdes (på engelska)" },
      },
      {
        title: "CLAUDE.md som regelbok.",
        text: "Projektfilen ger varje session samma utgångspunkt: vad projektet är, hur det körs och kontrolleras, och de hårda reglerna, som att bara ange bekräftade fakta och stanna vid varje granskningspunkt.",
        link: { href: docLink(1), label: "Läs den här sajtens CLAUDE.md (på engelska)" },
      },
      {
        title: "Budgetar i koden.",
        text: "Varje route som anropar en modell kontrollerar en budget före anropet och loggar kostnaden efteråt. Promptarna är ordnade så att den dyra delen cachas.",
      },
      {
        title: "Mät först, bestäm sedan.",
        text: "Inbyggda källhänvisningar mättes till 31–46 % fler tokens, så jag byggde egna och verifierar dem i kod. Textextraktion mättes till 59 % färre tokens innan den blev standard.",
      },
      {
        title: "Hitta aldrig på.",
        text: "Agenterna jag skriver har uttryckliga regler: en källa för varje påstående, ”hittades inte” som ett giltigt svar, och att koden, inte modellen, skriver slutresultatet.",
      },
    ],
  },
  about: {
    title: "Om mig",
    text: "Jag började bygga med AI för att lösa problem jag såg omkring mig: att förbereda seminarier och att hitta rätt företag att sälja till.",
    facts: [
      { label: "Studerar", value: "Ekonomprogrammet, Mälardalens universitet, år 1" },
      { label: "Tidigare", value: "Western Colorado University, basket, 2025–26" },
      { label: "Landslaget", value: "Svenska basketlandslaget · U16, U18, U20" },
      { label: "Tagd, 2026", value: "Praktisk workshop med deras AI-ingenjör om en lead-gen-pipeline i produktion" },
      { label: "Bor", value: "Stockholm och Västerås" },
    ],
  },
  contact: {
    title: "Hör av dig",
    text: "Jag söker deltidsarbete eller praktik där jag bygger AI-produkter.",
    source: "Källkod för den här sajten",
  },
};

export const copy: Record<Lang, BrevetCopy> = { sv, en };
