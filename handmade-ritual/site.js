/* ============================================================
   EMBER & STONE STUDIO — shared behaviour
   Edit the CONFIG block, nothing else needs to change.
   ============================================================ */
const CONFIG = {
  // Where the "Buy" buttons send people. Etsy or Shopify handles checkout,
  // reviews, and payment — this site handles trust, education, and community.
  shopUrl: "https://www.etsy.com/shop/YOUR-SHOP-NAME",
  // Brevo (or any email tool) form POST URL. Leave blank for demo mode.
  emailFormAction: "",
  // Private Facebook Group link for The Handmade Ritual Circle.
  groupUrl: "https://www.facebook.com/groups/YOUR-GROUP",
  // Instagram or TikTok — pick ONE visual channel, not five.
  socialUrl: "https://www.instagram.com/YOUR-HANDLE",
  socialLabel: "Instagram",
  // Where customer questions go. Reply fast, reply kind.
  contactEmail: "hello@example.com",
  // Honest processing time shown in every listing and in the announcement bar.
  processingTime: "2–4 business days",
};

(function () {
  // ---- Fill CONFIG-driven links ----
  document.querySelectorAll("[data-shop-link]").forEach((a) => {
    const item = a.getAttribute("data-shop-link");
    a.href = item ? `${CONFIG.shopUrl}?ref=site&item=${encodeURIComponent(item)}` : CONFIG.shopUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-group-link]").forEach((a) => { a.href = CONFIG.groupUrl; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-social-link]").forEach((a) => { a.href = CONFIG.socialUrl; a.target = "_blank"; a.rel = "noopener"; if (!a.dataset.keepText) a.textContent = CONFIG.socialLabel; });
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
  if (filters.length && products.length) {
    const apply = (key) => {
      filters.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === key)));
      products.forEach((p) => { p.hidden = key !== "all" && p.dataset.collection !== key; });
      const count = [...products].filter((p) => !p.hidden).length;
      const live = document.getElementById("filter-status");
      if (live) live.textContent = `${count} item${count === 1 ? "" : "s"} shown`;
    };
    filters.forEach((b) => b.addEventListener("click", () => { apply(b.dataset.filter); history.replaceState(null, "", "#" + b.dataset.filter); }));
    const initial = location.hash.replace("#", "");
    apply([...filters].some((b) => b.dataset.filter === initial) ? initial : "all");
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
      if (!ok) { msg.className = "form-msg error"; msg.textContent = "Please add your first name and a valid email address."; return; }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        if (CONFIG.emailFormAction) {
          await fetch(CONFIG.emailFormAction, { method: "POST", mode: "no-cors", body: new FormData(form) });
        }
        msg.className = "form-msg ok";
        msg.textContent = form.dataset.successText || "You're on the list. The care guide is on its way to your inbox.";
        form.reset();
      } catch (err) {
        msg.className = "form-msg error";
        msg.textContent = `Something went wrong. Email us directly at ${CONFIG.contactEmail} and we'll add you by hand.`;
      } finally { btn.disabled = false; }
    });
  });

  // ---- Footer year ----
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
