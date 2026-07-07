# Webinar Funnel — Audit & Upgrade Report

Scope: the **AI Clock Out Teacher / Leave at the Bell** webinar funnel (`webinar/` — registration page, thank-you page, email sequence, docs). Audited every file across bugs, security, performance, SEO, accessibility, responsiveness, code quality, and content. All fixes verified in a real browser (Chromium) with a 20-check automated pass: **all green**.

---

## Architecture (Phase 1)

| File | Role |
|---|---|
| `index.html` | Registration page. Fully self-contained (inline CSS/JS). Brevo-ready form ×2, countdown, sticky mobile CTA, hero photo auto-upgrade. |
| `thanks.html` | Post-signup show-up page: calendar add, inbox rescue, micro-commitment. `noindex`. |
| `emails.md` | Brevo confirmation + 5 reminder emails with send timing, optional SMS lines. |
| `README.md` | Launch checklist (the 4 swaps + new pre-launch requirements below). |

No build step, no dependencies except Google Fonts at runtime. Deploys as static files anywhere. Deliberately duplicated CONFIG between the two pages (self-containment) — documented as a launch-day sync point.

## Everything fixed (Phases 2–3)

**Critical**
1. **Broken social previews** — `og:image` was a relative URL; crawlers (Facebook, iMessage) require absolute URLs, so shares in teacher Facebook groups would show no image. Replaced with clearly-marked commented tags (`og:image`, `og:url`, `canonical`) to fill in once the domain exists, so a half-configured tag can't ship silently.
2. **Missing favicons** — both pages now carry an inline bell favicon (no extra file, no 404, no wrong-brand icon if co-hosted).
3. **Silent lead-loss risk documented as a hard launch gate** — Brevo form POSTs are `no-cors`, so a wrong/expired form URL still shows "You're in!" while the lead vanishes. README now requires one live test signup verified inside Brevo, and covers Brevo hidden fields (`email_address_check`) if the form embed includes them.

**High**
4. **Render-blocking font CSS (real bug, found during verification)** — a slow/hanging font CDN held the entire page blank and delayed all scripts (countdown, form, calendar links). Fonts now load async with a `noscript` fallback; the page renders instantly on fallback fonts and swaps.
5. **Broken heading hierarchy** — registration page went H1→H3→H4; card titles are now proper H2/H3 with identical visual styling. Screen-reader outline is correct.
6. **Invisible form errors for assistive tech** — validation now sets `aria-invalid` on bad fields, shows a specific message ("Please fill in your first name and a valid email address") in a `role="alert"` region; success confirmation is `role="status"`.
7. **No visible keyboard focus** — all buttons, links, and inputs now have a high-contrast `:focus-visible` outline.
8. **Screen-reader countdown chatter** — the per-second ticking region is now `aria-hidden`; the static date/time line right above carries the same info accessibly.
9. **Decorative SVGs** (3) marked `aria-hidden`.
10. **WCAG AA contrast failure** — stats source line raised from 45% to 65% white on navy.
11. **No structured data** — added JSON-LD `EducationEvent` (free, online, with start/end) for Google event rich results, with a sync comment tied to CONFIG.
12. **No `theme-color`** — added on both pages (mobile browser chrome matches the navy).

**Medium**
13. Removed dead `id` attributes the JS never referenced (`form-error`, `form-success`).
14. Fetch-failure path now restores the correct error message text after a validation message may have replaced it.
15. README gained a "once you know the domain" section (og/canonical/JSON-LD URLs).

**No issues found in:** content (zero typos; numbers consistent: 15 hrs / 6 weeks / 32% / 18 years / 72 students / 4–10-hour SLO; no lorem ipsum — all placeholders intentional and flagged), mobile responsiveness (390px–1440px verified), duplicate IDs, unlabeled inputs, `target=_blank` without `noopener`, or JS console errors.

## Verification (Phase 4)

Automated browser suite (Playwright/Chromium), 20 checks across both pages: JS errors, heading order, ARIA on SVGs, favicon, theme-color, duplicate IDs, og:image absoluteness, JSON-LD presence, invalid-submit error announcement, valid-submit redirect to `thanks.html`, calendar link correctness (verified pointing at the right UTC instant: Aug 6, 7 PM ET = 23:00Z), and keyboard tab order. **20/20 pass.** Full-page desktop + mobile screenshots confirmed zero visual regressions.

## Remaining recommendations (not safely automatable)

1. **Privacy policy page** — the form collects PII and the footer promises privacy; Meta/Google ads require a linked policy. Legal copy — generate/review one, then link it in both footers.
2. **The four launch swaps** (README): real date/time (in `index.html` CONFIG + `thanks.html` CONFIG + `emails.md` + JSON-LD), Brevo form URL **+ one verified live signup**, `hero.jpg` (two candidates ready in the Higgsfield library), JD's headshot.
3. **Domain-dependent tags** — uncomment and fill `og:image`/`og:url`/`canonical` when the URL exists; test with Facebook's Sharing Debugger before posting in groups.
4. **Post-webinar email sequence** — deliberately unwritten until the webinar pitch flow exists.
5. **Optional:** self-host the two fonts as woff2 next to the pages to remove the Google Fonts dependency entirely.

## Maintenance

- The funnel is static — no dependencies to patch. Re-run the checks after any edit (`verify.mjs` pattern: render both pages headless, assert no JS errors + form flow works).
- Keep the two CONFIG blocks and `emails.md` dates in sync — this is the only cross-file coupling.
- After the cohort launches, archive this funnel or point it at the next cohort's date; the countdown auto-hides when the date passes, but the copy won't update itself.
