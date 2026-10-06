/*  Find a Way or Make One  -  static site generator.
    No dependencies. `node build.mjs` reads data/*.json and writes the finished site to ./site
    Hosting: point any static host at ./site (Vercel config is in vercel.json).
*/
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const site = read("data/site.json");
const picks = read("data/products.json")
  .filter((p) => !p.hidden)
  .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1)); // newest first, stable on ties

const out = path.join(root, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, "public"), out, { recursive: true });

const write = (rel, html) => {
  const file = path.join(out, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = (u) => (/^https?:\/\//.test(u) ? u : site.baseUrl.replace(/\/$/, "") + "/" + u.replace(/^\/+/, ""));
const buyUrl = (p) => (p.url ? p.url : `https://www.amazon.com/dp/${p.asin}/?tag=${site.associateTag}`);
const month = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric" });
const pickPath = (p) => `/picks/${p.slug}/`;
const hay = (p) => [p.title, p.short, p.category, ...(p.tags || [])].join(" ");

const DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
const AFF_LINE = "Affiliate link. If you buy through it, I earn a small commission and you pay the same price.";

const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1f5a3e"/><text x="32" y="44" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="34" fill="#f4f5f0">F</text></svg>`)}`;

/* ---------- layout ---------- */
function layout({ title, desc, canonical, body, ogImage, jsonld = [], current = "", bodyClass = "", noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name}: ${site.tagline}`;
  const storefront = site.storefrontUrl ? `<a href="${esc(site.storefrontUrl)}" target="_blank" rel="noopener" class="hide-sm">Amazon storefront</a>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title || site.name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
${ogImage ? `<meta property="og:image" content="${esc(abs(ogImage))}">\n<meta name="twitter:card" content="summary_large_image">` : ""}
<meta name="theme-color" content="#f4f5f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1512" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet"></noscript>
<link rel="stylesheet" href="/styles.css">
<script src="/app.js" defer></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body class="${bodyClass}">
<nav class="nav" aria-label="Main">
  <div class="wrap">
    <a class="wordmark" href="/"><span class="mark" aria-hidden="true">F</span>${esc(site.name)}</a>
    <div class="nav-links">
      <a href="/#picks" ${current === "picks" ? 'aria-current="page"' : ""}>Picks</a>
      <a href="/#how" class="hide-sm">How I pick</a>
      ${storefront}
      <a href="/disclosure/" ${current === "disclosure" ? 'aria-current="page"' : ""}>Disclosure</a>
    </div>
  </div>
</nav>
${body}
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <p><b>${esc(site.name)}</b></p>
        <p class="legal">${DISCLOSURE} Every product link on this site is an affiliate link. I only list things I bought with my own money and would buy again. Prices and availability change on Amazon; this site never shows a price for that reason.</p>
      </div>
      <div>
        <div class="links">
          <a href="/#picks">All picks</a>
          <a href="/#how">How I pick</a>
          <a href="/#about">About JD</a>
          <a href="/disclosure/">Affiliate disclosure</a>
          ${site.storefrontUrl ? `<a href="${esc(site.storefrontUrl)}" target="_blank" rel="noopener">Amazon storefront</a>` : ""}
        </div>
      </div>
    </div>
    <p class="fine">&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(site.legalName)}. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Not affiliated with any school district.</p>
  </div>
</footer>
</body>
</html>`;
}

/* ---------- components ---------- */
function card(p, i, { reveal = true } = {}) {
  const size = i === 0 ? "lg" : i === 1 ? "md" : "";
  const img = p.images[0];
  return `<a class="card ${size} ${reveal ? "reveal" : ""}" href="${pickPath(p)}" data-category="${esc(p.category)}" data-hay="${esc(hay(p))}">
  <div class="frame"><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="${i < 2 ? "eager" : "lazy"}" width="1200" height="900"></div>
  <div class="meta"><span class="pill">${esc(p.category)}</span>${p.sample ? '<span class="pill sample">Example pick</span>' : ""}</div>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.short)}</p>
  <span class="more">Read why &rarr;</span>
</a>`;
}

function searchForm(action = "/") {
  return `<form class="search" role="search" action="${action}">
  <label class="sr-only" for="q">Search picks</label>
  <input id="q" type="search" name="q" placeholder="Search: math workbook, pedal, mic..." autocomplete="off" data-search>
  <button class="btn" type="submit">Search <span class="ico" aria-hidden="true">&rarr;</span></button>
</form>`;
}

/* ---------- home ---------- */
function home() {
  const stack = picks.slice(0, 3).map((p) => `<a href="${pickPath(p)}" aria-label="${esc(p.title)}"><img src="${esc(p.images[0].src)}" alt="" width="800" height="600" loading="eager"></a>`).join("");
  const chips = site.categories.map((c) => `<a href="/?cat=${encodeURIComponent(c)}" data-cat="${esc(c)}">${esc(c)}</a>`).join("");
  const body = `
<header class="hero">
  <div class="wrap hero-grid">
    <div>
      <h1 class="rise">Stuff I actually use, and would tell a <em>friend</em> to buy.</h1>
      <p class="lede rise d1">Teacher, musician, lifelong learner. Every pick here has been on my desk or in my classroom first.</p>
      <div class="rise d2">${searchForm("/")}</div>
      <div class="chips rise d3">${chips}</div>
    </div>
    <div class="stack rise d2" aria-label="Latest picks">${stack}</div>
  </div>
</header>

<section id="picks">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>The picks</h2>
      <p>Newest first. Click any one for the honest version: why I bought it, what happened, and who should skip it. <span data-count>${picks.length} picks</span>.</p>
    </div>
    <div class="grid" data-picks>
      ${picks.map((p, i) => card(p, i)).join("\n")}
    </div>
    <div class="empty" data-empty><b>Nothing matches that yet.</b>Try a shorter word, or clear the category. New picks get added as I find them.</div>
  </div>
</section>

<section id="how" class="band">
  <div class="wrap">
    <div class="section-head reveal"><h2>How a thing ends up on this list</h2></div>
    <div class="steps reveal">
      <div><h3>I buy it first.</h3><p>With my own money, for my own classroom, kids, or desk. Nobody sends me free stuff, and I would say so if they did.</p></div>
      <div><h3>I write what actually happened.</h3><p>Not the box copy. What broke, what surprised me, what I would tell you if you asked me in the hallway.</p></div>
      <div><h3>You click, you decide.</h3><p>Every link goes to Amazon. If you buy, I earn a small commission and you pay exactly the same price. That is how this site pays for itself.</p></div>
    </div>
    <p class="disclosure-note reveal"><b>Plain-English disclosure:</b> ${DISCLOSURE} The full version is on the <a href="/disclosure/" style="text-decoration:underline">disclosure page</a>.</p>
  </div>
</section>

<section id="about" class="about">
  <div class="wrap about-grid">
    <div class="portrait reveal">
      <div class="ph" data-portrait data-src="/img/jd.jpg" data-alt="JD, the person behind Find a Way or Make One">Drop <b>&nbsp;img/jd.jpg&nbsp;</b> in the folder and this becomes your photo.</div>
    </div>
    <div class="reveal">
      <h2>Hi, I'm JD.</h2>
      <p>I teach music in a public school, run a couple of small online businesses for teachers and musicians, and I am a little obsessed with learning how to learn.</p>
      <p>"Find a way or make one" is the rule I run my classroom by. When the school does not send the workbook home, you find one. When the pedal keeps sliding, you find one that does not. This site is where those answers go once they have passed the test: I bought it, I used it, I would buy it again.</p>
      <p>If you want to know whether something is right for your situation, read the "who it is for" part of each pick. I try to be as honest about who should skip it as who should buy it.</p>
    </div>
  </div>
</section>`;
  return layout({ title: "", desc: site.description, canonical: abs("/"), body, ogImage: picks[0]?.images[0]?.src, current: "picks",
    jsonld: [{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: abs("/"), potentialAction: { "@type": "SearchAction", target: `${abs("/")}?q={search_term_string}`, "query-input": "required name=search_term_string" } }] });
}

/* ---------- pick page ---------- */
function pickPage(p) {
  const url = abs(pickPath(p));
  const n = Math.min(p.images.length, 3);
  const gallery = `<div class="gallery n${n}">${p.images.slice(0, 3).map((im, i) => `<figure><img src="${esc(im.src)}" alt="${esc(im.alt)}" width="1200" height="900" loading="${i === 0 ? "eager" : "lazy"}"></figure>`).join("")}</div>`;
  const related = picks.filter((o) => o.slug !== p.slug && o.category === p.category).concat(picks.filter((o) => o.slug !== p.slug && o.category !== p.category)).slice(0, 3);
  const body = `
<header class="pick-head">
  <div class="wrap">
    <div class="crumb"><a href="/#picks">&larr; All picks</a></div>
    <div class="meta"><span class="pill">${esc(p.category)}</span><span class="pill muted">Added ${month(p.date)}</span>${p.sample ? '<span class="pill sample">Example pick: placeholder photos and notes</span>' : ""}</div>
    <h1>${esc(p.title)}</h1>
    <p class="short">${esc(p.short)}</p>
  </div>
</header>
<div class="wrap">
  ${gallery}
  <div class="pick-body">
    <article>
      ${p.sample ? `<p class="sample-note">This is an example pick so you can see the layout. Swap in real photos and JD's own notes before sharing it.</p>` : ""}
      <div class="quick">
        <h2>Three things to know</h2>
        <ol>${p.quickTake.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      </div>
      ${p.body.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((t) => `<p>${esc(t)}</p>`).join("")}`).join("\n")}
    </article>
    <aside class="verdict">
      <div class="in">
        <div class="score"><span>JD's rating</span><b>${p.rating}/5</b></div>
        <h3>Buy it if</h3><p>${esc(p.verdict.buy)}</p>
        <h3>Skip it if</h3><p>${esc(p.verdict.skip)}</p>
        <a class="btn block" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">See it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a>
        <p class="aff">${AFF_LINE}</p>
        <div class="share">
          <button type="button" data-copy>Copy link</button>
          <button type="button" data-share>Share</button>
        </div>
      </div>
    </aside>
  </div>
</div>
<section class="related">
  <div class="wrap">
    <div class="section-head"><h2>More picks</h2></div>
    <div class="grid">${related.map((o, i) => card(o, i + 2, { reveal: false })).join("")}</div>
  </div>
</section>
<div class="buybar"><a class="btn" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">See it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a></div>`;
  const jsonld = [
    { "@context": "https://schema.org", "@type": "Product", name: p.title, image: p.images.map((i) => abs(i.src)), description: p.short, category: p.category,
      review: { "@type": "Review", author: { "@type": "Person", name: site.owner }, datePublished: p.date, reviewBody: p.quickTake.join(" "), reviewRating: { "@type": "Rating", ratingValue: p.rating, bestRating: 5 } } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Picks", item: abs("/#picks") },
      { "@type": "ListItem", position: 2, name: p.title, item: url } ] }
  ];
  return layout({ title: p.title, desc: p.short, canonical: url, body, ogImage: p.images[0].src, jsonld, bodyClass: "has-buybar", noindex: !!p.sample });
}

/* ---------- disclosure ---------- */
function disclosure() {
  const body = `
<main class="page">
  <div class="wrap prose">
    <h1>Affiliate disclosure, in plain English</h1>
    <p><b>${DISCLOSURE}</b></p>
    <p>${site.name} is run by ${esc(site.legalName)}. The product links on this site are Amazon affiliate links. When you click one and buy something, Amazon pays me a small percentage. You pay exactly the same price you would have paid anyway. That commission is how this site covers its own costs.</p>
    <h2>What that does not change</h2>
    <ul>
      <li>I buy everything listed here myself. Nothing on this site was sent to me for free, and if that ever changes the pick will say so at the top.</li>
      <li>Nobody pays to be listed. A company cannot buy a spot, and I do not take requests from brands.</li>
      <li>I write the "skip it if" part as carefully as the "buy it if" part. A pick that is wrong for you is not worth the commission.</li>
    </ul>
    <h2>Why there are no prices</h2>
    <p>Amazon prices change constantly, and Amazon's rules do not let me show a price unless it is pulled live from them. So the button says "See it on Amazon" and the price you see there is the real one.</p>
    <h2>Questions</h2>
    <p>${site.contactEmail ? `Email me at <a href="mailto:${esc(site.contactEmail)}" style="text-decoration:underline">${esc(site.contactEmail)}</a>.` : "Reach me through any of my other sites and I will answer."} This disclosure is here because the FTC requires it and because you deserve to know how a recommendation site makes money.</p>
  </div>
</main>`;
  return layout({ title: "Affiliate disclosure", desc: "How Find a Way or Make One makes money, and what that does and does not change about the picks.", canonical: abs("/disclosure/"), body, current: "disclosure" });
}

function notFound() {
  const body = `<main class="page"><div class="wrap prose"><h1>That page is not here.</h1><p>The pick may have moved or never existed. <a href="/#picks" style="text-decoration:underline">See all picks</a>.</p></div></main>`;
  return layout({ title: "Page not found", desc: "Page not found.", canonical: abs("/404"), body, noindex: true });
}

/* ---------- write everything ---------- */
write("index.html", home());
write("disclosure/index.html", disclosure());
write("404.html", notFound());
for (const p of picks) write(`picks/${p.slug}/index.html`, pickPage(p));
write("search.json", JSON.stringify(picks.map((p) => ({ slug: p.slug, title: p.title, short: p.short, category: p.category, tags: p.tags, url: pickPath(p), image: p.images[0].src }))));
const urls = [abs("/"), abs("/disclosure/"), ...picks.filter((p) => !p.sample).map((p) => abs(pickPath(p)))];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${abs("/sitemap.xml")}\n`);

const missing = picks.filter((p) => !p.url && (!p.asin || /SAMPLE/.test(p.asin)));
console.log(`Built ${picks.length} picks -> site/`);
if (site.associateTag.startsWith("REPLACE")) console.log("NOTE: data/site.json associateTag is still a placeholder. Picks with a full amzn.to link in `url` work regardless.");
if (missing.length) console.log("NOTE: picks without a real link yet: " + missing.map((p) => p.slug).join(", "));
