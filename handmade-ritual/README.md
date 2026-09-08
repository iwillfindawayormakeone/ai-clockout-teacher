# Ember & Stone Studio: handmade candles, gemstone jewelry, beads and soap

A six-page static website for a small "handmade ritual and gifting" brand. No build step: open `index.html` in a browser, or drop the folder on any static host (Netlify, Vercel, GitHub Pages). `preview.html` is the same site as a single file with hash routing (`#shop`, `#learn/candle-care`), for sharing a link before hosting.

## Design system

Built against the anti-slop frontend checklist: no em-dashes, at most one eyebrow label per three sections, no three-equal-card rows, no serif display face, no cream-and-brass palette, library icons only, light and dark mode.

| Token | Light | Dark | Used for |
|---|---|---|---|
| Ground | `#f4f4ef` bone | `#0f1813` | page background |
| Ground 2 | `#e9ebe3` pale sage | `#15211a` | alternate sections |
| Ink | `#15231c` | `#e8ece6` | text |
| Forest | `#1f4d3a` | `#3f8a67` | every button, links, the one dark block |
| Amber | `#d99a2b` | `#e0a63b` | stars and focus rings only |

Type: Bricolage Grotesque (display) and Geist (body), both from Google Fonts. Shape rule: buttons are pills, containers are 14px, inputs are 8px.

## Photos

`img/` holds 20 AI-generated studio renderings (made with vidIQ's image generator, 22 credits each) so the preview looks finished: a hero, one square per product, the workbench shot, and two care-guide shots. The collection tiles reuse product photos. They are placeholders in the honest sense: before anything goes on sale, each product image must be a photograph of the actual item, because "product differs from photos" is one of the top complaints in the research. To swap one, replace the file in `img/` with the same name (900 by 900 for products, 900 by 1125 for the hero, 1200 by 900 for the rest) and rebuild or edit the page.

The shot list, in priority order:

1. Home hero: a lit candle, one bracelet, and a bar of soap together on linen, daylight, 4:5.
2. Four collection tiles: candles, jewelry, soap, gift sets (4:3 and 3:4).
3. One square photo per product (16), each described in its own caption. Unfiltered, with a hand, wrist, or mug for scale.
4. About page: you at the workbench, mid-task.
5. Learn page: a bar on a soap dish; hands rolling a bracelet on.


It is built directly from the research on what makes handmade spiritual-product shops succeed or fail:

| Research finding | Where the site answers it |
|---|---|
| Vague listings are the #1 complaint | Every product card has a "Full details , the six questions" panel: what it is, made from, size, use & care, ships when, what if there's a problem |
| Unsafe / untested candles are the #1 risk | Burn-testing promise in the announcement bar, hero, About, and Policies; the three ASTM-style label warnings on the Learn page |
| Misleading gemstone claims | Treatment status on every stone; a plain-language glossary (natural, heated, dyed, stabilized, coated, lab-created, imitation, cultured); "traditionally associated with" language; a no-health-claims disclaimer in the footer and Policies |
| Product differs from photos | Every illustration is labelled "real photo goes here" so a placeholder can never ship silently |
| No clear return / repair policy | `policies.html`: 30-day returns, free resizing, free restringing, damage replacement without a return, "we tell you before the ship date, not after" |
| Too much selling, too little education | `learn.html` (care & safety guides, Material Monday) and `community.html` (weekly rhythm, house rules) |
| Trying to be on every platform | One shop platform, one Facebook Group, one email list, one visual channel , all set in `CONFIG` |
| A cohesive collection, not "a little of everything" | 16 items in four collections that go together, plus three gift sets that bundle them |

## Pages

- `index.html` , home: hero, trust bar, four collections, the six-questions rule, four featured items, maker story teaser, sample reviews, community sign-up
- `shop.html` , all 16 items with a collection filter (`#candles`, `#jewelry`, `#soap`, `#sets` deep-link)
- `learn.html` , candle care & safety, gemstone honesty guide, jewelry & bead care, soap care, Material Monday
- `community.html` , The Handmade Ritual Circle: weekly rhythm, house rules, letter sign-up, markets table
- `about.html` , maker story, how each product is made and tested, ten promises
- `policies.html` , shipping, returns, repairs & resizing, damage/late, custom orders, candle safety, gemstone & claims disclosure, privacy
- `preview.html` , all six pages in one file, for sharing a link
- `styles.css`, `site.js` , shared across all pages

## Before launch , the swaps

Everything configurable is in the `CONFIG` block at the top of `site.js`:

1. **`shopUrl`** , your Etsy shop (or Shopify store) URL. Every "Buy" button links there with the item id appended. This site handles trust, education, and community; the shop platform handles checkout and reviews.
2. **`emailFormAction`** , your Brevo (or other) form POST URL. Until set, both sign-up forms run in demo mode (show success, send nothing). Do one real test sign-up and confirm the contact appears , browsers can't read the response (`no-cors`), so a wrong URL fails silently.
3. **`groupUrl`**, **`socialUrl`**, **`socialLabel`** , the private Facebook Group and your one visual channel.
4. **`contactEmail`** , where "Ask a question" buttons go. Reply within a business day; the site promises that.
5. **`processingTime`** , shown in the announcement bar and every listing. Keep it honest; update it in one place.

Then, in the HTML:

6. **Photos.** Replace the renderings in `img/` with photographs of the real items. This is the single most important swap.
7. **Your story** on `about.html` , the placeholder paragraphs are marked in italics.
8. **Reviews** on `index.html` , the three quotes are labelled "Sample review". Replace with real, permission-granted ones.
9. **Markets table** on `community.html`.
10. **Privacy policy** on `policies.html` , the placeholder is marked. Meta and Google ads require a real one.
11. **Prices, sizes, and materials** , every product's six-question details live in the product cards; make sure they match what you actually make. The candle burn times, wick sizes, and soap ingredients are realistic defaults, not your tested numbers.

Once you have a domain, add absolute `og:image`, `og:url`, and `canonical` tags in each `<head>` (there is a `LAUNCH TODO` comment marking the spot).

## Editing products

Product cards are plain HTML in `shop.html` (and four are repeated on `index.html`). Each card is an `<article class="product" data-collection="…">`; copy one to add an item. The `data-shop-link="item-id"` attribute is appended to the shop URL so you can track which listing sent the click.

## Verification

Checked in headless Chromium: no JS errors, one `h1` per page with no skipped heading levels, no duplicate ids, every input labelled, no dead `#` links, no horizontal overflow at 1280px or 390px, shop filter and deep-links, form validation and success states, mobile nav.
