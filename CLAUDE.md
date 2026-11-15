# adam-site

Adam Massarsch's portfolio at `adam.bluemesa.se`. Audience: AI companies and recruiters.
The site and this repo are themselves a work sample. Sloppiness here costs more than anywhere else.

The build plan lives in `PLAN.md`, a local file that is not committed and may be missing.
If it exists, read it before starting a phase. If it does not, ask Adam what to work on.

Next.js-specific notes are in `AGENTS.md`: this Next version differs from older training data,
so check `node_modules/next/dist/docs/` before using an API you are unsure of.

## Stack

- Next.js 16 (App Router) + React 19, TypeScript strict (`noUncheckedIndexedAccess` on)
- Tailwind CSS v4 (config in `src/app/globals.css`, no `tailwind.config`)
- Statically rendered, no database, no auth. Hosted on Vercel
- Project content goes in one typed file, `content/projects.ts`. A new project is a new entry, nothing else

## Commands

- `npm run dev` – dev server on http://localhost:3000
- `npm run typecheck` – `next typegen` (route types like `LayoutProps`) then `tsc --noEmit`
- `npm run lint` – ESLint, zero warnings allowed
- `npm run build` – production build
- `npm run check` – all three above, same as CI
- `/kolla` – runs `npm run check` and summarises the result

A hook (`.claude/hooks/typecheck.sh`) runs `tsc --noEmit` after every edit to a `.ts`/`.tsx` file
and reports errors back. Fix them before moving on.

## Hard rules

- **Only state confirmed facts.** No invented numbers, clients, quotes or results. If something is missing, ask Adam or leave it out
- **No placeholders in production.** No lorem ipsum, no dead links, no "coming soon"
- **Do not modify other repositories.** Reading them for context is fine
- **Never name clients or show third-party code without explicit permission** from Adam
- **Describe each project only as what it is.** Do not imply affiliations or endorsements that Adam has not confirmed
- Plan first, build one bounded piece at a time, test in the browser
- Commit only when Adam asks
- Stop at every review point in the plan and wait for Adam's go-ahead

## Conventions

- Site copy is English
- Server Components by default; add `"use client"` only where interaction needs it
- Images via `next/image`; video as mp4/webm with a poster, loaded lazily
- Respect `prefers-reduced-motion` for every animation
