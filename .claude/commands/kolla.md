---
description: Run typecheck, lint and build (same as CI) and summarise the result
allowed-tools: Bash(npm run check), Bash(npm run typecheck), Bash(npm run lint), Bash(npm run build)
---

Run `npm run check` from the repo root. It runs, in order: `next typegen` + `tsc --noEmit`, ESLint (zero warnings) and `next build`.

Then report in a short list:

- Typecheck (typegen + tsc): pass/fail
- Lint: pass/fail
- Build: pass/fail

On failure, quote the relevant errors with `file:line` and say what is causing them.
Do not fix anything unless asked.
