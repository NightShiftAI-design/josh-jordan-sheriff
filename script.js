```js
/* Josh Jordan for Rhea County Sheriff — script.js
   - Mobile nav toggle
   - Smooth scroll w/ header offset
   - Simple scroll reveal animations
   - Contact form: opens mail client (mailto) with filled fields
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -------------------------------------------
  // Mobile nav toggle (matches your original HTML structure)
  // -------------------------------------------
  const navToggle = $(".nav-toggle");
  const nav = $("#nav");

  if (navToggle && nav) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    const openNav = () => {
      navToggle.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      document.body.classList.add("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeNav() : openNav();
    });

    // Close nav when a link is clicked
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeNav();
    });

    // Close with ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Close if window is resized up (desktop)
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 981px)").matches) closeNav();
    });
  }

  // -------------------------------------------
  // Smooth scroll with header offset
  // -------------------------------------------
  const header = $(".header");
  const headerOffset = () => (header ? header.getBoundingClientRect().height + 10 : 80);

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: "smooth" });

      // Keep hash updated for shareability
      history.pushState(null, "", href);
    });
  });

  // -------------------------------------------
  // Scroll reveal (adds a classy "official" feel)
  // Add data-reveal to any element you want animated.
  // Also auto-applies to common sections/cards.
  // -------------------------------------------
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
  ];

  const revealTargets = new Set();
  autoRevealSelectors.forEach((sel) => $$(sel).forEach((el) => revealTargets.add(el)));

  // If you manually add data-reveal, include it too.
  $$("[data-reveal]").forEach((el) => revealTargets.add(el));

  // Apply base styles via inline CSS vars so no extra CSS needed
  revealTargets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity 700ms ease, transform 700ms ease";
    el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
    el.classList.add("reveal-pending");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.classList.remove("reveal-pending");
        el.classList.add("reveal-in");
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => io.observe(el));

  // -------------------------------------------
  // Contact form -> mailto compose
  // (No backend needed. Uses the form fields to create an email draft.)
  // -------------------------------------------
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
```
