# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and engineers at AI companies who are screening candidates. They get many portfolio links and give each one about 30 seconds, usually from a message, an email or a LinkedIn profile, on a phone or a laptop. Their job is to decide fast whether this person builds real products with AI, and builds them well, and whether to get in touch.

## Product Purpose

The portfolio of Adam Massarsch, an economics student at Mälardalen University who builds AI products. It works as his CV. Success means a visitor understands who Adam is and what he has built from the hero and the first project alone, and emails him about part-time work or an internship building AI products.

## Positioning

The site proves rather than claims. Every claim is backed by a demo, a link or the code, and the repo for the site is itself a public work sample, built in phases with Claude Code. Each project is described only as what it is: what Adam built himself, and what he built on top of other people's work.

## Operating Context

- Visitors arrive from a link in a message, email or LinkedIn, so the link preview (Open Graph image and text) is part of the first impression
- Visitors who are engineers may open the GitHub repo and read README, CLAUDE.md and `.claude/` after the site
- Hosted at `adam.bluemesa.se`, a subdomain of Blue Mesa, Adam's prospecting service. The site is Adam's personal site, not a Blue Mesa page

## Capabilities and Constraints

- Statically rendered Next.js site: a home page (hero, projects, How I build, About, Contact) and one case page per project at `/projects/[slug]`, all from one template
- Project content lives in one typed file, `content/projects.ts`
- Site copy is English and was approved by Adam on 2026-11-15. Copy changes need Adam's approval
- Two projects, in this order: Seminar for groups, Blue Mesa
- Seminar's repo is private: the case says "Repo available on request". It has no public live link
- Tagd appears only as a line in the facts strip: a hands-on workshop with their AI engineer on a production lead-gen pipeline. It is not a project or a case, and nothing more is claimed about it
- Blue Mesa: two paying customers in summer 2026, never named, no figures about companies or lists. No repo link for Blue Mesa
- Do not imply any affiliation or endorsement Adam has not confirmed

## Brand Commitments

- A personal identity of its own. It borrows nothing from Blue Mesa's logo, colours or name styling; Blue Mesa is one of two projects
- Voice: plain, specific and calm. Concrete numbers and mechanisms instead of adjectives. No "Hi, I'm…" hero

## Evidence on Hand

- Photo of Adam: `public/media/adam-portrait.webp`
- Seminar demo video: `public/media/seminar-demo.mp4` (52 s, 720p, about 400 kbit/s, no audio, UI in Swedish). This is the final version. The third-party article page it opens (about 1.6–3.6 s) is blurred so neither its text nor its download watermark can be read; the article title, the highlighted source band and the app around it stay visible. Its poster is a frame from 12.5 s that shows the room, not the article. Any re-encode or new poster must keep the article unreadable
- Blue Mesa demo video: `public/media/blue-mesa-demo.mp4` (32 s, 720p, no audio, UI in Swedish, sample data)
- Every demo carries a visible caption that says it is a demo, its length, that it has no sound and that the UI is in Swedish
- Measured figures approved for publication: Seminar's per-question cost ($0.47 cold, $0.03 cached), 59 % fewer tokens from text extraction, 31–46 % more tokens from built-in citations, 13/13 and 17/17 verified citation markers
- No testimonials, user numbers or customer names exist. Do not create any

## Product Principles

1. Proof before claims: if something cannot be shown or linked, it is cut, not described louder
2. The first 30 seconds decide: hero plus the first project must carry the whole message
3. Honest scope: say what Adam built, what he built on, and what is not in production
4. Real product footage outranks text and decoration
5. The site and its repo are held to the same standard as the projects they show

## Accessibility & Inclusion

Lighthouse 95+ in all four categories on mobile, keyboard navigation, sufficient contrast in light and dark mode, and every animation respects `prefers-reduced-motion`.
