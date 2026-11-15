---
name: Adam Massarsch
description: A portfolio set as a release record, in paper, ink and one highlighter.
colors:
  paper: "oklch(96.4% 0.004 130)"
  ink: "oklch(19% 0.006 140)"
  pencil: "oklch(46% 0.008 140)"
  hairline: "oklch(86% 0.006 130)"
  plate-frame: "oklch(19% 0.006 140 / 0.35)"
  highlighter: "oklch(92% 0.19 112)"
  highlighter-ink: "oklch(19% 0.006 140)"
  media-ground: "oklch(22% 0.03 260)"
  paper-dark: "oklch(17% 0.006 140)"
  ink-dark: "oklch(94% 0.004 130)"
  pencil-dark: "oklch(72% 0.008 140)"
  hairline-dark: "oklch(30% 0.006 140)"
  plate-frame-dark: "oklch(94% 0.004 130 / 0.3)"
typography:
  display:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1rem + 3.6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.35
    fontFeature: "\"tnum\" 1"
rounded:
  none: "0"
spacing:
  gutter: "clamp(1rem, 4vw, 4rem)"
  measure: "36rem"
  row-top: "1.5rem"
  section-bottom: "clamp(3.5rem, 7vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1rem"
  button-large:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.9rem 1.5rem"
  highlighter-mark:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.highlighter-ink}"
    padding: "0 0.15em"
  demo-plate:
    backgroundColor: "{colors.media-ground}"
    rounded: "{rounded.none}"
  rail-entry:
    textColor: "{colors.pencil}"
  rail-entry-current:
    textColor: "{colors.ink}"
---

# Design System: Adam Massarsch

## Overview

**Creative North Star: "The Release Record"**

The portfolio is set as a record of releases. Each project is a dated release with what shipped, how it was built and what was measured, always in the same anatomy, so the row itself becomes the ruler. The page is printed matter: cool grey-white paper, near-black ink, hairline rules, and one acid-yellow highlighter stroke per release on the single figure that matters. Dark mode is the same record printed in reverse; the highlighter does not change.

Typography does the work that decoration does elsewhere. One grotesk is used at two extremes of scale: the hero sentence and the closing "Let's talk" at architectural size, everything else at reading size with small pencil-grey labels. There are no cards, no shadows, no rounded corners and no gradients. Product footage is the only image that carries weight, and it is presented as a plate: a hairline frame with a caption line under it.

Motion is rare and authored: the hero's underlines draw once on load, the highlighter draws once under the first figure, and on small screens the release strip slides in only while a release is being read. Everything else is instant.

**Key Characteristics:**
- Paper, ink and one highlighter; no other colour
- Hairline rules divide every row; nothing floats in a box
- One family, two extremes of scale, tabular figures throughout
- A left release rail with dates on wide screens; a strip that appears only inside the record on small screens
- Square corners everywhere

## Colors

A near-monochrome paper-and-ink palette with a single acid-yellow accent that appears once per release.

### Primary
- **Acid Highlighter** (`highlighter`): drawn behind the one figure per release that matters (`$0.47 → $0.03`, `Two paying customers`) and used as the text-selection colour. Ink sits on it in both themes.

### Neutral
- **Cool Paper** (`paper` / `paper-dark`): the page ground. In dark mode it is a near-black with the same green-grey cast.
- **Press Ink** (`ink` / `ink-dark`): all text, primary buttons, the strong rules between rows, and focus rings.
- **Pencil Grey** (`pencil` / `pencil-dark`): dates, labels, captions, tags and secondary text. Contrast is at least 6.4:1 in light mode and 7.7:1 in dark mode.
- **Faint Hairline** (`hairline` / `hairline-dark`): the light rules inside a release (above the tags, between principles and between decisions).
- **Plate Frame** (`plate-frame` / `plate-frame-dark`): the 1px frame around product footage, ink at about a third of its strength, so light footage keeps an edge on paper.
- **Night Media Ground** (`media-ground`): the fill behind a video before its poster paints.

### Named Rules
**The One Stroke Rule.** The highlighter is used once per release, on the figure that proves the release, and nowhere else. A second highlight on the same release dilutes the first.

**The Same Ink Rule.** Dark mode inverts paper and ink but keeps the highlighter and the ink that sits on it unchanged.

## Typography

**Display Font:** Familjen Grotesk (with system-ui, sans-serif)
**Body Font:** Familjen Grotesk (with system-ui, sans-serif)

**Character:** A Swedish grotesk with a slightly condensed, workmanlike rhythm. Set heavy and tight at display size it reads like a poster headline; at body size it is plain and calm. Tabular figures are on everywhere, so dates and measured numbers line up.

### Hierarchy
- **Display** (700, `clamp(2rem, 1rem + 3.6vw, 5.25rem)`, 1.04): the hero sentence, the case title, the 404 line and "Let's talk". The largest object on the page.
- **Headline** (700, `clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem)`, 1.05): section titles, "Next project" and the contact line on case pages.
- **Title** (700, `clamp(1.5rem, 1.1rem + 1vw, 2rem)`, 1.1): release titles on the home page.
- **Body** (400, 1.0625rem, 1.5–1.55): release notes, principles and case rows, held to a 36rem measure.
- **Label** (500, 0.875–0.9375rem): dates, tags, captions, vitals labels and the footer, in Pencil Grey.

### Named Rules
**The Two Extremes Rule.** Type is either display-large or reading-size. There are no in-between decorative sizes, eyebrows or kickers above headings.

**The Wrap Rule.** Headings use `text-wrap: balance`, running text uses `text-wrap: pretty`, so no line ends on a single orphaned word.

## Layout

On wide screens the page is a two-column grid: a release rail (`minmax(11rem, 14rem)`) divided from the main column by a 1px ink rule, with a gutter of `clamp(1rem, 4vw, 4rem)`. Each release is a row: framed footage at 3fr beside notes at 2fr (minimum 16rem), with an ink rule on top. Running text never exceeds the 36rem measure. Sections open with a 1.5rem gap below their rule and close with `clamp(3.5rem, 7vw, 6rem)` of air. Case pages use the same rows with the heading on the left (1fr) and the body on the right (2fr).

Below 52rem everything stacks into one column. The rail becomes a horizontal strip: on case pages it is sticky under the masthead, and on the home page it is fixed to the top edge and shown only while a release crosses the reading line. Below 40rem the masthead keeps only the name and "Email me" on one row. The vitals strip shows its essential facts in two columns, with the rest behind "More".

## Elevation & Depth

The system is flat. There are no shadows anywhere; depth is conveyed only by rules (1px ink between rows, 1px hairline inside a release) and by the plate frame around footage. Sticky and fixed elements sit on the paper colour with a rule beneath them, not a shadow.

### Named Rules
**The Printed Page Rule.** If it would not survive being printed on paper, it does not belong: no shadows, glows, blurs or glass.

## Shapes

Every corner is square (0). Form comes from rules, not containers: rows are separated by horizontal lines, the rail by a vertical line, and footage by a hairline frame. The only "shape" with fill is the highlighter, a flat yellow block behind a figure that follows line breaks (`box-decoration-break: clone`).

## Components

### Buttons
- **Shape:** square corners (0).
- **Primary:** Press Ink fill with Cool Paper text, 600 weight, padding 0.55rem 1rem. A large variant (1.25rem text, 0.9rem 1.5rem) is used once, for the closing "Email me".
- **Press:** scales to 0.97 over 160ms with a strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`). There is no hover colour change.
- **Focus:** a 2px ink outline with a 3px offset, shared by every focusable element.

### Navigation
- **Masthead:** the name in 700 on the left, text links and the one button on the right, with an ink rule below. Text links have no underline and get one on hover (fine pointers only); on phones they are hidden.
- **Release rail:** each entry is a date in Pencil Grey over a title in 600. The current entry turns to ink and 700 weight (`aria-current`); colour changes over 160ms ease.
- **Skip link:** an ink button that drops into view on keyboard focus only.

### Release (signature component)
The repeating unit of the record: framed footage, then notes with the title (date shown above it), one paragraph, the highlighted fact line, tags over a hairline, and "Read the case". Every project uses this anatomy unchanged; a project without footage drops to one column.

### Demo plate
Product footage in a 16:9 frame with a 1px Plate Frame border, a Night Media Ground fill behind the poster, and a caption line under it in Pencil Grey ("Demo · 52 s · no sound · UI in Swedish"). Videos are muted, loop, have native controls, load only near the viewport, play only while visible and never autoplay under reduced motion.

### Highlighter mark
Ink text on the Acid Highlighter, 700 weight, with 0.15em side padding. On load it draws left to right over 700ms with a strong ease-out, keeping ink colour until the stroke is under it so it stays readable in dark mode. On small screens the first release's stroke follows the scroll as the figure rises into view. Under reduced motion it is simply there.

### Vitals strip
A definition list of facts in a grid between hairlines: small 600 labels in Pencil Grey over 0.9375rem values. Three columns on wide screens, two on small screens with a "More" toggle.

## Do's and Don'ts

### Do:
- **Do** separate content with 1px rules: ink between rows, hairline inside a release.
- **Do** use the highlighter exactly once per release, on its proving figure.
- **Do** frame every piece of footage as a plate with a caption that says what it is, how long, and that it has no sound.
- **Do** keep running text at or under the 36rem measure, with tabular figures.
- **Do** gate every motion behind `prefers-reduced-motion: no-preference`, and keep press feedback and colour changes under 250ms.

### Don't:
- **Don't** put content in cards, add shadows, or round any corner.
- **Don't** add a second accent colour, gradients, or gradient text.
- **Don't** put an eyebrow or kicker label above a heading.
- **Don't** animate on scroll for decoration; motion exists only for the hero underline, the highlighter and the mobile release strip.
- **Don't** borrow Blue Mesa's logo, colours or name styling; this is a personal identity.
