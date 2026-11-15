# adam-site

Source for [adam.bluemesa.se](https://adam.bluemesa.se), the portfolio of Adam Massarsch.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19
- TypeScript in strict mode, including `noUncheckedIndexedAccess`
- Tailwind CSS v4
- Statically rendered pages, no database, deployed on Vercel

## Running locally

Requires Node 24 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run check
```

This runs type checking (`next typegen` then `tsc --noEmit`), ESLint with zero warnings allowed, and a production build.
GitHub Actions runs the same command on every push and pull request (`.github/workflows/ci.yml`).

## Working with Claude Code

The site is built with [Claude Code](https://claude.com/claude-code), following a phased build plan with a review stop after each phase. The plan is kept locally; the agent setup is part of the repo:

- `CLAUDE.md` – project context and hard rules the agent follows (for example: only state confirmed facts)
- `.claude/commands/kolla.md` – the `/kolla` command, which runs the full check suite
- `.claude/hooks/typecheck.sh` – a hook that type-checks after every TypeScript edit, so errors surface immediately
