/* Josh Jordan for Rhea County Sheriff — script.js
   - Mobile nav toggle (if present)
   - Smooth scroll w/ header offset
   - Scroll reveal
   - Click-to-scroll for buttons/cards (data-scroll="#sectionId")
   - Accordions for long text (data-accordion)
   - Contact form -> mailto compose (if present)
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // Mobile nav toggle (works if your HTML has .nav-toggle + #nav)
  // -----------------------------
  const navToggle = $(".nav-toggle");
  const nav = $("#nav");

  const closeNav = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  const openNav = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeNav() : openNav();
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeNav();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 981px)").matches) closeNav();
    });
  }

  // -----------------------------
  // Smooth scroll with header offset
  // -----------------------------
  const header = $(".header");
  const headerOffset = () => (header ? header.getBoundingClientRect().height + 10 : 80);

  const scrollToId = (id) => {
    if (!id) return;
    const target = document.getElementById(id.replace("#", ""));
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Standard anchor links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      scrollToId(href);
      history.pushState(null, "", href);
    });
  });

  // Buttons/cards with data-scroll
  // Example: <button data-scroll="#unity">Read the full statement</button>
  $$("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const dest = el.getAttribute("data-scroll");
      if (!dest) return;
      scrollToId(dest);
      if (dest.startsWith("#")) history.pushState(null, "", dest);
      closeNav();
    });
  });

  // -----------------------------
  // Scroll reveal
  // -----------------------------
  const autoRevealSelectors = [
    ".hero__content",
    ".hero__media",
    ".trust__item",
    ".card",
    ".about__content",
    ".about__side",
    ".action",
    ".contact-card",
    ".form",
    ".section__head",
    ".note",
    ".statement",
    ".timeline",
    ".accordion",
    ".faq",
  ];

  const revealTargets = new Set();
  autoRevealSelectors.forEach((sel) => $$(sel).forEach((el) => revealTargets.add(el)));
  $$("[data-reveal]").forEach((el) => revealTargets.add(el));

  revealTargets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity 700ms ease, transform 700ms ease";
    el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => io.observe(el));

  // -----------------------------
  // Accordions for long content
  // Markup:
  // <div class="accordion" data-accordion>
  //   <button class="accordion__btn" type="button" aria-expanded="false">...</button>
  //   <div class="accordion__panel" hidden>...</div>
  // </div>
  // -----------------------------
  $$("[data-accordion]").forEach((wrap) => {
    const btn = $(".accordion__btn", wrap);
    const panel = $(".accordion__panel", wrap);
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (expanded) {
        panel.hidden = true;
        wrap.classList.remove("is-open");
      } else {
        panel.hidden = false;
        wrap.classList.add("is-open");
      }
    });
  });

  // Auto-open accordion if URL hash matches its panel id
  const hash = window.location.hash;
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      const acc = target.closest?.("[data-accordion]");
      if (acc) {
        const btn = $(".accordion__btn", acc);
        const panel = $(".accordion__panel", acc);
        if (btn && panel) {
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
          acc.classList.add("is-open");
        }
      }
      // Scroll after layout
      setTimeout(() => scrollToId(hash), 50);
    }
  }

  // -----------------------------
  // Contact form -> mailto (if present)
  // -----------------------------
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = ($("#name")?.value || "").trim();
      const phone = ($("#phone")?.value || "").trim();
      const email = ($("#email")?.value || "").trim();
      const topic = ($("#topic")?.value || "question").trim();
      const message = ($("#message")?.value || "").trim();

      const subjectMap = {
        volunteer: "Volunteer — Josh Jordan for Sheriff",
        sign: "Yard Sign Request — Josh Jordan for Sheriff",
        endorsement: "Endorsement — Josh Jordan for Sheriff",
        question: "Question — Josh Jordan for Sheriff",
        other: "Message — Josh Jordan for Sheriff",
      };

      const subject = subjectMap[topic] || subjectMap.other;

      const lines = [
        `Topic: ${topic}`,
        `Name: ${name || "N/A"}`,
        `Phone: ${phone || "N/A"}`,
        `Email: ${email || "N/A"}`,
        "",
        "Message:",
        message || "(No message provided)",
        "",
        "— Sent from the campaign website",
      ];

      const body = encodeURIComponent(lines.join("\n"));
      const mailto = `mailto:jjordan206@yahoo.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      window.location.href = mailto;
      form.reset();
    });
  }
})();
