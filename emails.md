# Leave at the Bell — Show-Up Sequence (Brevo-ready)

Confirmation + reminder copy for the free live training. Paste each into Brevo as its own automation step. Placeholders to replace everywhere before launch:

- `{{DATE}}` → e.g. Thursday, August 6
- `{{TIME}}` → e.g. 7:00 PM Eastern
- `{{ZOOM_LINK}}` → the actual Zoom join link
- `{{CALENDAR_LINK}}` → the Google Calendar link (the thank-you page generates the same one)
- `{{contact.FIRSTNAME}}` → Brevo's first-name tag (already correct for Brevo)

Sending rules that protect show-up rate:

- Send everything **from "JD (AI Clock Out Teacher)"** with a real reply-to. Replies are gold — Step 3 of the thank-you page tells people to reply with their most annoying task.
- Plain-looking emails (minimal design, no big banners) land in Primary more often and read teacher-to-teacher. Resist the urge to make them pretty.
- Every email contains the Zoom link. Never make someone dig through old emails to find it.

---

## Email 0 — Confirmation (instantly on signup)

**Subject:** Your seat is saved 🔔
**Preview text:** Here's your link — plus one 10-second thing to do right now.

{{contact.FIRSTNAME}} —

You're in. Here's everything you need:

**Free live training: how to walk out at the final bell with your work actually done**
📅 {{DATE}} at {{TIME}}
📍 Your seat link: {{ZOOM_LINK}}
🗓 [Add it to your calendar]({{CALENDAR_LINK}}) — do this now, future-you will thank you

Two quick things while I have you:

**1. Drag this email into your Primary inbox** (if it landed in spam or Promotions). Your reminders — and your seat link — live here.

**2. Hit reply and tell me your most annoying task.** The parent email you've been dreading. Sunday's lesson plan. The rubric. I read every reply, and I build the live demos around what you send me. Your task might be the one that gets retired on screen.

This is taught live, once, with open Q&A. A replay is not guaranteed — so put it on the calendar and come.

See you at the bell,
JD
AI Clock Out Teacher

P.S. No prep, no downloads, nothing to install. Come skeptical — especially if AI has burned you before. You're my favorite people in the room.

---

## Email 1 — Three days out

**Subject:** the 4-minute hall walk (a true story)
**Preview text:** The task was supposed to take 4–10 hours.

{{contact.FIRSTNAME}} —

Quick story before {{DATE}}.

Every teacher in my state has to write an SLO. If you know, you know: it's a 4-to-10-hour job, usually done at the kitchen table, usually the week you can least afford it.

Two years ago I did mine in the four-minute hall walk between classes.

Not a rushed version. Not a cut-corners version. My principal said it was the best one I'd turned in — and I've been doing this for 18 years.

The difference wasn't talent and it wasn't a magic app. It was that I finally stopped rebuilding the same work from scratch every single time. That shift — build it once — is exactly what I'm showing you live on {{DATE}} at {{TIME}}.

Your seat link (save this email): {{ZOOM_LINK}}

See you there,
JD

P.S. Haven't told me your most annoying task yet? Hit reply. I'm building the demos from your answers this week.

---

## Email 2 — Day before

**Subject:** tomorrow night — bring that task
**Preview text:** One hour. One task retired. Live.

{{contact.FIRSTNAME}} —

Tomorrow at {{TIME}}, you and I have an appointment: {{ZOOM_LINK}}

Here's the plan for the hour:

- We settle the "isn't this cheating?" question in the first ten minutes. (Short version: nobody calls a calculator cheating. The real cheat is burning out.)
- You watch a real parent email get written — calm, professional, in the teacher's own voice — in about 3 minutes.
- You see why AI gave you garbage last time, and the backwards shift that fixes it.
- You leave knowing exactly what "build it once" means for your grading, your planning, and your Sunday nights.

It's live, it's free, and I'm answering questions at the end for as long as it takes.

One ask: come with your most annoying task in mind. Watching someone else's task get retired is interesting. Watching yours is different.

Tomorrow,
JD

---

## Email 3 — Morning of

**Subject:** tonight, {{TIME}} — your seat's waiting
**Preview text:** The kitchen table can have the night off.

{{contact.FIRSTNAME}} —

Tonight. {{TIME}}. One hour.

Your seat link: {{ZOOM_LINK}}

Show up as you are — pajamas, dinner plate, stack of ungraded quizzes you're pointedly ignoring. This is the one evening obligation this week that's designed to give you evenings back.

A replay is not guaranteed. If you can only make part of it, come for the first half — that's where the 3-minute parent email happens.

Tonight,
JD

---

## Email 4 — One hour before

**Subject:** doors open in an hour 🔔
**Preview text:** Grab your link — see you at {{TIME}}.

{{contact.FIRSTNAME}} —

We're live in one hour.

Join here at {{TIME}}: {{ZOOM_LINK}}

Bring the task. See you inside.

— JD

---

## Email 5 — We're live (send at start time)

**Subject:** we're LIVE — come on in
**Preview text:** The room is open right now.

{{contact.FIRSTNAME}} —

The room is open and we're starting: {{ZOOM_LINK}}

First ten minutes: the "cheating" question, settled for good. Don't miss it.

— JD

---

## SMS lines

The thank-you page now collects phone numbers (optional "get a text reminder" opt-in) and saves them to the contact's `SMS` field in Brevo. Add three **Send SMS** steps to the same Brevo automation — Brevo automatically skips contacts with no phone number. Setup details (credits, sender registration, cost): see `SETUP.md`.

Keep under 160 characters. Send: morning-of, 1 hour before, at start.

1. **Morning of:** "It's JD (AI Clock Out Teacher). Tonight {{TIME}}: the free Leave at the Bell training. Your link: {{ZOOM_LINK}} — bring your most annoying task."
2. **1 hour:** "One hour until we're live. Grab your seat: {{ZOOM_LINK}} — JD"
3. **Live:** "We're LIVE right now. Come in: {{ZOOM_LINK}} — JD"

*Note: the registration form itself stays name + email only (a phone field on the main form costs conversion). The number is asked for on the thank-you page instead — already built and wired.*

---

## Not written yet (deliberately)

- **Post-webinar follow-up** (replay/no-show/pitch emails) — depends on the replay decision and the $497 pitch flow, which belong to the webinar itself. Write these after the webinar deck exists.
