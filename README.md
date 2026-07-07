# Leave at the Bell — Webinar Registration Page

The registration funnel for the free live training that leads into the **Leave at the Bell** founding cohort. No build step — host the folder anywhere (GitHub Pages, Netlify drop, Vercel, any static host) or open the files directly.

**👉 To take this from files to a live, self-running funnel (emails + texts sending automatically, $0/month), follow [`SETUP.md`](SETUP.md) — it's the complete click-by-click launch guide.**

- `index.html` — registration page (redirects to the thank-you page on signup)
- `thanks.html` — thank-you page (calendar add, inbox rescue, **text-reminder opt-in**, "bring your most annoying task" micro-commitment)
- `privacy.html` — privacy policy (template — fill the two bracketed placeholders; required before running ads)
- `emails.md` — the full Brevo confirmation + reminder sequence with send timing, plus the 3 SMS reminder texts
- `SETUP.md` — the launch guide: hosting, Brevo, automation, SMS, Zoom, costs, and the pre-flight checklist

## Before launch — 4 swaps, all in one place

Everything you need to touch is in the `CONFIG` block at the top of the `<script>` in `index.html`:

1. **Date & time** — set `webinarDate` (ISO format with timezone) and the matching `dateLabel` / `timeLabel`. The countdown, calendar links, and both date lines update automatically. Current values are PLACEHOLDERS. **Update the matching CONFIG in `thanks.html` too**, and the `{{DATE}}`/`{{TIME}}` placeholders in `emails.md`.
2. **Brevo** — paste your Brevo form's POST action URL into `brevoFormAction` — in **both** `index.html` and `thanks.html` (the thank-you page uses it for the text-reminder opt-in, which saves the phone number to the contact's `SMS` field). Field names already match Brevo defaults (`FIRSTNAME`, `EMAIL`, `SMS`). Until you set it, the forms run in demo mode (show the success state, send nothing).
   **⚠️ Then do one real test signup and confirm the contact appears in Brevo.** Browsers can't read Brevo's response (`no-cors`), so a wrong or expired form URL still shows "You're in!" while the lead silently vanishes. One live test before launch is non-negotiable. If your Brevo form embed includes hidden fields (e.g. `email_address_check`, `locale`), add them to both forms as hidden inputs.
3. **Hero photo** — drop a `hero.jpg` into this folder and the page upgrades from the gradient automatically. Two candidates matching the brief ("teacher walking out of school in daylight, relieved, bag empty") are already generated and waiting in your Higgsfield library (July 6, soul_2, 16:9, 2K).
4. **JD's headshot** — save it as `jd.jpg` in this folder, then in `index.html` replace the placeholder inside `#host-photo` with the commented-out `<img>` tag right above it.

Optional: set `thankYouUrl` to redirect to a dedicated thank-you page after signup (recommended later — that's where the show-up sequence starts).

## Once you know the domain

In the `<head>` of `index.html` there are three commented-out tags (`og:image`, `og:url`, `canonical`) plus a JSON-LD `startDate` — fill in the real absolute URLs and date. Without an **absolute** `og:image` URL, links shared in Facebook groups and texts show no preview image.

## Before running any paid ads

A privacy policy page (`privacy.html`) is included and linked from both footers — the form collects names, emails, and optional phone numbers, and Meta/Google ad policies require it. It's a plain-language template, not legal advice: fill in the two `[BRACKETED]` placeholders (effective date + contact email) and have it reviewed if you can.

## What's deliberately NOT on this page

- **No price, no cohort pitch.** This page sells one thing only: registering for the free training. The $497 offer stack belongs in the webinar itself.
- **No replay promise.** "A replay is not guaranteed" is intentional show-up psychology — don't soften it.
