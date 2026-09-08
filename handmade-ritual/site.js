/* ============================================================
   EMBER & STONE STUDIO - shared behaviour
   Edit the CONFIG block; nothing else needs to change.
   ============================================================ */
const CONFIG = {
  // Where every "Buy" button sends people. Etsy or Shopify handles checkout
  // and reviews; this site handles trust, education, and community.
  shopUrl: "https://www.etsy.com/shop/YOUR-SHOP-NAME",
  // Brevo (or any email tool) form POST URL. Leave blank for demo mode.
  emailFormAction: "",
  // Private Facebook Group link for The Handmade Ritual Circle.
  groupUrl: "https://www.facebook.com/groups/YOUR-GROUP",
  // Your one visual channel. Instagram or TikTok, not both.
  socialUrl: "https://www.instagram.com/YOUR-HANDLE",
  socialLabel: "Instagram",
  // Where customer questions go. Reply within a business day; the site promises it.
  contactEmail: "hello@example.com",
  // Honest processing time, shown in the announcement bar and every listing.
  processingTime: "2-4 business days",
};

(function () {
  const spa = document.body.hasAttribute("data-spa");

  // ---- Single-file preview: hash routing (#shop, #learn/candle-care) ----
  function route() {
    if (!spa) return;
    const raw = location.hash.replace(/^#/, "");
    const [pg, sub] = raw.split("/");
    const name = pg || "home";
    const pages = document.querySelectorAll(".page");
    let found = false;
    pages.forEach((p) => { const on = p.dataset.page === name; p.classList.toggle("active", on); if (on) found = true; });
    if (!found) { pages.forEach((p) => p.classList.toggle("active", p.dataset.page === "home")); }
    document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
      if (a.dataset.page === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.querySelector(".nav-links")?.classList.remove("open");
    if (sub) {
      const el = document.getElementById(sub);
      if (el && !el.closest(".filter-bar")) { requestAnimationFrame(() => el.scrollIntoView({ block: "start" })); return; }
    }
    window.scrollTo({ top: 0 });
  }

  // ---- Fill CONFIG-driven links ----
  document.querySelectorAll("[data-shop-link]").forEach((a) => {
    const item = a.getAttribute("data-shop-link");
    a.href = item ? `${CONFIG.shopUrl}?ref=site&item=${encodeURIComponent(item)}` : CONFIG.shopUrl;
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-group-link]").forEach((a) => { a.href = CONFIG.groupUrl; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-social-link]").forEach((a) => { a.href = CONFIG.socialUrl; a.target = "_blank"; a.rel = "noopener"; a.textContent = CONFIG.socialLabel; });
  document.querySelectorAll("[data-contact-link]").forEach((a) => {
    const subject = a.getAttribute("data-contact-link") || "Question about an item";
    a.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}`;
  });
  document.querySelectorAll("[data-contact-email]").forEach((el) => { el.textContent = CONFIG.contactEmail; });
  document.querySelectorAll("[data-processing]").forEach((el) => { el.textContent = CONFIG.processingTime; });

  // ---- Mobile nav ----
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- Shop filters ----
  const filters = document.querySelectorAll(".filter-bar button");
  const products = document.querySelectorAll("[data-collection]");
  function currentSub() {
    const raw = location.hash.replace(/^#/, "");
    return spa ? (raw.split("/")[1] || "") : raw;
  }
  function applyFilter(key) {
    filters.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === key)));
    products.forEach((p) => { p.hidden = key !== "all" && p.dataset.collection !== key; });
    const count = [...products].filter((p) => !p.hidden).length;
    const live = document.getElementById("filter-status");
    if (live) live.textContent = `${count} item${count === 1 ? "" : "s"} shown`;
  }
  if (filters.length && products.length) {
    filters.forEach((b) => b.addEventListener("click", () => {
      applyFilter(b.dataset.filter);
      history.replaceState(null, "", spa ? `#shop/${b.dataset.filter}` : `#${b.dataset.filter}`);
    }));
    const syncFilter = () => {
      const key = currentSub();
      applyFilter([...filters].some((b) => b.dataset.filter === key) ? key : "all");
    };
    syncFilter();
    window.addEventListener("hashchange", syncFilter);
  }

  // ---- Email / community forms ----
  document.querySelectorAll("form[data-email-form]").forEach((form) => {
    const msg = form.querySelector(".form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const name = form.querySelector('input[name="FIRSTNAME"]');
      let ok = true;
      [email, name].forEach((f) => { if (f) f.removeAttribute("aria-invalid"); });
      if (name && !name.value.trim()) { name.setAttribute("aria-invalid", "true"); ok = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { if (email) email.setAttribute("aria-invalid", "true"); ok = false; }
      if (!ok) { msg.className = "form-msg error"; msg.textContent = "Add your first name and a valid email address to continue."; return; }
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending";
      try {
        if (CONFIG.emailFormAction) {
          await fetch(CONFIG.emailFormAction, { method: "POST", mode: "no-cors", body: new FormData(form) });
        }
        msg.className = "form-msg ok";
        msg.textContent = form.dataset.successText || "You're on the list. The care guide is on its way to your inbox.";
        form.reset();
      } catch (err) {
        msg.className = "form-msg error";
        msg.textContent = `That didn't send. Email ${CONFIG.contactEmail} and we'll add you by hand.`;
      } finally { btn.disabled = false; btn.textContent = label; }
    });
  });

  // ---- Scroll reveal: only elements below the fold at load are ever hidden ----
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    const arm = () => {
      document.querySelectorAll("[data-reveal]:not(.will-reveal):not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight) { el.classList.add("will-reveal"); io.observe(el); }
      });
    };
    arm();
    if (spa) window.addEventListener("hashchange", () => setTimeout(arm, 50));
  }

  // ---- Footer year ----
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  if (spa) { route(); window.addEventListener("hashchange", route); }
})();
