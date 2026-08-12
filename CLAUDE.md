# Project context — read me first

## This repo belongs to **Talk it Build it**

**Talk it Build it** is JD's umbrella project for his community work. It is the parent
brand/program. The code in this repo is *one offer inside it*, not a standalone thing.

```
Talk it Build it              ← umbrella / community program
└── AI Clock Out Teacher      ← the teacher-facing offer
    └── "Leave at the Bell"   ← the founding cohort + its webinar funnel  ← THIS REPO
```

So: **repo name ≠ project name.** The repo is called `ai-clockout-teacher` for historical
reasons — it was created before the Talk it Build it umbrella existed. Don't rename it,
and don't assume the clock-out funnel is the whole picture. When someone refers to
"the Talk it Build it project," this repo is part of what they mean.

## What is actually in here

A complete, static webinar registration funnel. No build step, no dependencies (except
Google Fonts at runtime). Deploys to any static host.

| File | Role |
|---|---|
| `index.html` | Registration page — self-contained inline CSS/JS, Brevo form ×2, countdown, sticky mobile CTA |
| `thanks.html` | Post-signup show-up page — calendar add, inbox rescue, micro-commitment. `noindex` |
| `emails.md` | Brevo confirmation + 5 reminder emails, send timing, optional SMS lines |
| `README.md` | Launch checklist — the 4 pre-launch swaps |
| `FINAL_REPORT.md` | Audit report from the funnel upgrade pass (20/20 browser checks green) |

## Rules that are easy to break by accident

1. **The two `CONFIG` blocks are deliberately duplicated** — one in `index.html`, one in
   `thanks.html`. This is intentional (each page is self-contained). If you change the
   webinar date in one, change it in the other *and* in `emails.md`, *and* in the JSON-LD
   `startDate`. This is the only cross-file coupling in the repo.
2. **No price and no cohort pitch on the registration page.** It sells exactly one thing:
   signing up for the free training. The $497 offer stack belongs inside the webinar.
3. **"A replay is not guaranteed" stays.** It's deliberate show-up psychology, not an
   oversight. Don't soften it.
4. **Brevo form posts are `no-cors`** — the browser cannot read the response, so a wrong
   or expired form URL still shows "You're in!" while the lead silently vanishes. Any
   change to the form requires one real test signup verified inside Brevo.

## Current state

Pre-launch. The funnel is built and audited; it is waiting on real values, not on code.
Outstanding items live in `README.md` (the 4 swaps) and `FINAL_REPORT.md` (remaining
recommendations — privacy policy page, domain-dependent `og:`/`canonical` tags,
post-webinar email sequence).

## Other repos in the same GitHub account

`professor-piano-web`, `findawaytosing`, `arianas-little-star`, `anthem-site`.

Whether each of these sits under the Talk it Build it umbrella has **not been confirmed** —
only this repo's membership is established. Ask before assuming a relationship between
them, and update this section once the full map is settled.

## Open thread: the Talk it Build it app

As of 2026-08-12 there is **no "Talk it Build it" application built anywhere** — not in any
of the five repos, not in Higgsfield, not as a published artifact. A Claude session titled
"Talk it build it app" exists and created the branch `claude/talk-it-build-it-app-ag23hw`
in this repo, but no app code was ever committed to it. If a previous version was seen on
screen, it was most likely an unsaved in-chat preview.

If someone asks you to work on "the Talk it Build it app," get the spec from them first —
there is no prior implementation to read.
