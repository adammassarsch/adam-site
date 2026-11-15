# How this site was built

This site was built with Claude Code from one plan, in phases. Nothing moved on until I had tested the work and said go.

## The setup

- **One model builds, another reviews.** Claude Opus built the site. Claude Fable reviewed it in a fresh session that had not seen the build, so it judged the site the way a visitor would.
- **The plan stays local.** It holds private context, so it is not in the repo. The rules the agent follows in every session are in [`CLAUDE.md`](../CLAUDE.md).
- **Checks on every step.** A hook type-checks after each TypeScript edit, `/kolla` runs type checking, lint and build, and CI runs the same on every push.

## The phases

0. **Foundation.** Next.js, strict TypeScript, ESLint, Tailwind, a short `CLAUDE.md`, the `/kolla` command, the type-check hook, CI and the README. *Stop: I ran `/kolla` and saw CI pass.*
1. **Content before design.** All copy written first, with every factual claim listed for me to confirm. *Stop: I approved or corrected all text. No design until it was settled.*
2. **Design direction.** Audience and design system written down in `PRODUCT.md` and `DESIGN.md`. Two clearly different versions of the hero and a project card, shown on mobile and desktop. *Stop: I picked one.*
3. **Home page.** Every section built with real text and real media. *Stop: I went through it in the browser.*
4. **Case pages.** One template, with one page built first as the reference. *Stop: I approved it before the others were built.*
5. **Polish.** Design critique and audit, animation review including `prefers-reduced-motion`, mobile, tablet and desktop, keyboard and contrast, metadata and link previews, every link clicked. Lighthouse on mobile, run against the live site on 15 November 2026 (Lighthouse 13.6.0):

   | Page | Performance | Accessibility | Best practices | SEO |
   | --- | --- | --- | --- | --- |
   | Home | 99 | 100 | 100 | 100 |
   | Seminar for groups | 99 | 100 | 100 | 100 |
   | Blue Mesa | 99 | 100 | 100 | 100 |
6. **Launch.** Deployed to Vercel.
7. **Review.** A new session on a different model, in the role of a recruiter at an AI company. It looked at the live site first, then the repo, and changed nothing. It reported first impressions, what hurts most, what is missing and what is strong. *Stop: I went through the list and decided what to change.*
8. **Fixes.** Back with Opus. Only what I approved was changed.
