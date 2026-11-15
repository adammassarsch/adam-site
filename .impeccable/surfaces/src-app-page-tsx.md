---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope

Home page (`/`), visitor mode: Experience. The work leads from the first viewport.
Audience, job and constraints: see PRODUCT.md. Primary action: Email me.

Phase 2 builds two variants of hero + one project card for Adam to choose between:
A) Release Notes (the roll, chosen by Adam 2026-11-15) and B) Scouting Report (Impeccable's pick).
The vitals strip from B is built as a standalone component so it can be borrowed into A if A wins.

## Direction contract

THESIS: The portfolio is a release record. Each project is a dated release with what shipped, how, and what was measured, in one identical anatomy. It refuses the category default of a centred name, a tagline, a button and three equal image cards.

OWN-WORLD: Cool grey-white paper ground, near-black ink, one acid-yellow highlighter used once per release on the single figure that matters. Hairline black rules, a left release rail with dates, tabular figures, one grotesk family at two extremes of scale. Dark mode is the same record printed in reverse, the highlighter unchanged.

STORY: The visitor reads one sentence about what Adam builds, sees the newest release (Seminar) playing at once, reads one measured fact, and finds Email me without searching. Scrolling reads older releases in the same anatomy.

FIRST VIEWPORT: Masthead with name, nav and Email me. Left rail: three releases by date, newest active. Main column: the hero sentence set as the largest object on the page, then the Seminar release: video at about 60 % width, beside it the release notes with one highlighted figure.

FORM: Release Notes, position 7 of 7 on the ordered list, seed:841f066e35655d70.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Raises (from declined challengers)

- Scher street typography: the hero sentence is set at architectural scale, not as subcopy
- Skate deck wall: release identifiers read at sticker size (rail, card, link preview)
- Miura sheet: explicit states, compact in the rail, open on the home page, fully deployed on the case page
- Coiled tower: one text measure held down the whole record
- Hand-drawn zine: one highlighter mark per release, on the figure that matters, nowhere else
- VU meter bridge: identical anatomy for every release, so the row is the ruler

## Decisions

- Adam chose Release Notes on 2026-11-15, with the vitals strip from Scouting Report borrowed under the hero
- Lead Bot has no media; how its release reads is settled in phase 4
