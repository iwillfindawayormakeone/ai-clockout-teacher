# Launch Guide — from these files to a live, self-running funnel

This guide gets the whole funnel running — signup → confirmation email → 5 reminder emails → 3 reminder texts — for **$0/month**, using exactly **one** outside account (Brevo, free tier). No ClickFunnels, no Kajabi, no WebinarJam, no Zapier. The page you already have replaces all of them.

**Total time: one afternoon. Total cost: $0 required; ~$5–20 optional (SMS credits + Zoom, explained below).**

---

## The honest one-paragraph summary

A web page cannot send emails or texts by itself — nobody's can. Every funnel service you've seen ($97–$300/month) is really just three things glued together: a landing page, an email/SMS sender, and a video room. Your landing page is already built (that's the expensive part you're skipping). The email/SMS sender has a genuinely free tier (Brevo). The video room is Zoom or Google Meet. So the "stack" is: **this repo + one free Brevo account + one meeting link.** Everything below is just wiring those together, once.

---

## Step 1 — Put the site online (free, ~10 minutes)

You already have a GitHub account (this repo lives there), so use **GitHub Pages** — no new account needed:

1. On github.com, open this repo → **Settings → Pages**.
2. Under "Build and deployment," set Source to **Deploy from a branch**, pick `main`, folder `/ (root)`, and save.
3. In a minute or two your site is live at `https://<your-username>.github.io/ai-clockout-teacher/`.

That URL is fine to launch with. A custom domain (`leaveatthebell.com` style) costs ~$10–12/year at Namecheap/Cloudflare and can be connected to Pages later — optional, skip it for cohort #1 if you want.

*Alternative: drag the folder onto [Netlify Drop](https://app.netlify.com/drop) — also free.*

**Once you have the URL:** in `index.html`'s `<head>`, uncomment and fill in the three tags (`og:image`, `og:url`, `canonical`) and the JSON-LD `url` — otherwise links shared in Facebook teacher groups show **no preview image**.

## Step 2 — Create the free Brevo account (the only new account you need)

[brevo.com](https://www.brevo.com) → free plan. It includes contact storage, signup forms, marketing automation, and **300 emails/day** — enough for a first cohort (one real limit, covered in Step 6).

1. Verify your sender email address (Brevo walks you through it). Use a real address you'll actually read — registrants are told to reply with their most annoying task, and those replies are your demo material.
2. **Contacts → Forms → Create a form.** Add three fields: `FIRSTNAME`, `EMAIL`, and `SMS` (phone). Design doesn't matter — the form is never shown; your page only borrows its submission URL.
3. In the form's **Share → HTML** view, copy the URL inside `<form action="...">`.
4. Paste that URL into **both** files:
   - `index.html` → `CONFIG.brevoFormAction`
   - `thanks.html` → `CONFIG.brevoFormAction` (powers the text-reminder opt-in)
5. If the form's HTML embed contains hidden inputs (commonly `email_address_check` or `locale`), note their names/values — do a test signup first (Step 6); if the contact doesn't appear, add those as hidden inputs to the forms in both files.

## Step 3 — Create the meeting link (the one place "free" has a catch)

- **Zoom free = 40-minute cap** on meetings. Your training is an hour, so free Zoom will cut you off mid-demo.
- **Cheapest solid option: Zoom Pro for one month** (~$15–16, month-to-month — cancel right after the webinar). A regular Zoom *Meeting* is fine; you do **not** need the pricier "Zoom Webinars" add-on. Turn on waiting room + mute-on-entry.
- **$0 option: Google Meet** — free meetings allow ~60 minutes with 3+ participants, which is exactly your runtime with zero buffer. Workable if the budget is truly zero, but the Zoom month is the safer $16.
- **$0 unlimited option: YouTube Live (unlisted)** — no time cap, but attendees can only ask questions in chat. Fine for broadcast-style; worse for the open Q&A this training promises.

**Recommendation: one month of Zoom Pro, cancelled after.** Whatever you pick, that join URL is your `{{ZOOM_LINK}}`.

## Step 4 — Build the automation in Brevo (the emails send themselves)

**Automations → Create an automation → start from scratch.** One workflow:

| Workflow step | What | Source |
|---|---|---|
| **Trigger** | "Form submitted" → your form | — |
| Send email immediately | Email 0 — confirmation | `emails.md` |
| Wait until **3 days before** the webinar date, 10:00 AM | Email 1 | `emails.md` |
| Wait until **day before**, 7:00 PM | Email 2 | `emails.md` |
| Wait until **morning of**, 7:30 AM | Email 3 | `emails.md` |
| Wait until **1 hour before** | Email 4 | `emails.md` |
| Wait until **start time** | Email 5 | `emails.md` |

Paste each email from `emails.md` into a Brevo template. Before pasting, replace `{{DATE}}`, `{{TIME}}`, `{{ZOOM_LINK}}`, `{{CALENDAR_LINK}}` everywhere. `{{contact.FIRSTNAME}}` is already in Brevo's own syntax — leave it.

Two rules from `emails.md` worth repeating: send everything from "JD (AI Clock Out Teacher)" with a real reply-to, and keep the emails plain-looking (plain lands in Primary; pretty lands in Promotions).

Since registration is open right up to start time, use **fixed date/time** wait steps ("wait until Aug 6, 6:00 PM"), not relative delays — late registrants then skip straight past emails whose send time already passed, instead of getting them late.

## Step 5 — Turn on the texts (the only per-use cost)

The thank-you page now collects phone numbers ("get a text reminder") and saves them to the contact's `SMS` field in Brevo. To actually send:

1. In Brevo, buy a small **SMS credit pack** (pay-as-you-go, no subscription; US texts run roughly a cent or two each — check current pricing at Brevo → SMS). For 100 registrants × 3 texts, budget **~$5**.
2. Brevo will have you register an SMS sender for US delivery (carrier requirement — every legit provider requires this; it's a form, not a fee wall).
3. In the same automation, add three **Send SMS** steps at: morning of, 1 hour before, and start time. The three messages are at the bottom of `emails.md`, ready to paste. Brevo only delivers SMS steps to contacts that have an `SMS` value — everyone else is skipped automatically.
4. Keep the STOP language — the opt-in card on the page already promises it, and US carriers require honoring it (Brevo handles STOP automatically).

**Zero-budget alternative:** skip SMS for cohort #1. Emails 3–5 cover the same three moments. The page's opt-in still collects numbers, so you can turn texts on for cohort #2 without touching anything.

## Step 6 — The pre-flight checklist (do not skip #4)

1. **Set the real date** in all four places: `index.html` CONFIG, `thanks.html` CONFIG, the JSON-LD `startDate`/`endDate` in `index.html`, and your Brevo templates. (Countdown, calendar links, and page labels update automatically from CONFIG.)
2. Drop in `hero.jpg` and `jd.jpg` (see README).
3. Fill the two `[BRACKETED]` placeholders in `privacy.html` (date + contact email).
4. **One real end-to-end test, non-negotiable:** register with your own email on the live site → contact appears in Brevo → confirmation email arrives → add your cell on the thank-you page → the `SMS` field appears on your Brevo contact → (if using SMS) send yourself a test text. The forms post "blind" (`no-cors`) — a wrong form URL still shows "You're in!" while the lead silently vanishes. **This test is the only thing standing between you and a launch that collects nobody.**
5. Delete your test contact, or you'll text yourself at 7:30 AM on webinar day.

## What this replaces (the money math)

| What funnel sites charge for | Typical price | Your version |
|---|---|---|
| Landing page + thank-you page builder | $97–297/mo (ClickFunnels, Kajabi, Kartra) | **$0** — this repo |
| Email automation | $15–45/mo | **$0** — Brevo free tier |
| SMS reminders | $20+/mo platforms | **~$5 one-time** credits (or $0, skip) |
| Webinar platform | $40–100/mo (WebinarJam etc.) | **~$16 once** (1 month Zoom Pro) or $0 (Meet) |
| Hosting | bundled into the above | **$0** — GitHub Pages |

**Recurring cost: $0.** Per-webinar cost: roughly $0–21 depending on the Zoom/SMS choices.

**One real limit to know:** Brevo's free tier sends **300 emails/day**. On webinar day each registrant gets up to 3 emails (morning-of, 1-hour, live), so free covers roughly **~90–95 registrants**. If registrations blow past that: either drop Email 5 (the "we're live" one — SMS covers that moment better anyway) to stretch to ~140, or take Brevo's Starter plan for one month (~$9–25) and cancel after. That's a good problem.

## What only you can do (nobody — including AI — can do these for you)

1. Create the Brevo account and paste the form URL into the two CONFIGs (it's *your* sender identity — that's what makes the emails deliverable and legal).
2. Create the Zoom/Meet link.
3. Pick the real date and put it in the four places above.
4. Enable GitHub Pages (one click in repo settings).
5. Run the end-to-end test signup.
6. Show up and teach. 🔔
