```js
/* Josh Jordan for Sheriff — script.js
   Works with the current index.html + styles.css you’re using:
   - Mobile nav toggle (#nav + .nav-toggle) + body.nav-open
   - Smooth scroll for internal anchors
   - Accordion system for statements (data-accordion)
   - Contact form: opens mail client (mailto) with filled fields
*/

(function () {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const isSamePageHashLink = (href) => typeof href === "string" && href.startsWith("#") && href.length > 1;

  const closeNav = () => {
    const nav = $("#nav");
    const toggle = $(".nav-toggle");
    if (!nav || !toggle) return;

    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openNav = () => {
    const nav = $("#nav");
    const toggle = $(".nav-toggle");
    if (!nav || !toggle) return;

    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  const toggleNav = () => {
    const nav = $("#nav");
    if (!nav) return;
    nav.classList.contains("is-open") ? closeNav() : openNav();
  };

  // ---------- Mobile nav ----------
  const nav = $("#nav");
  const navToggle = $(".nav-toggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", toggleNav);

    // Close nav when clicking any nav link
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      // close for any click on a link (including external)
      closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Close when clicking outside the nav (mobile drawer)
    document.addEventListener("click", (e) => {
      const isOpen = nav.classList.contains("is-open");
      if (!isOpen) return;

      const clickedToggle = e.target.closest(".nav-toggle");
      const clickedNav = e.target.closest("#nav");
      if (!clickedNav && !clickedToggle) closeNav();
    });
  }

  // ---------- Smooth scroll for internal anchors ----------
  $$('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!isSamePageHashLink(href)) return;

    a.addEventListener("click", (e) => {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      closeNav();

      // Use scroll-margin-top via CSS? We'll account for sticky header.
      const header = $(".header");
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

      window.scrollTo({ top: y, behavior: "smooth" });

      // Update URL hash (without jumping)
      history.pushState(null, "", href);
    });
  });

  // ---------- Make .card[role="button"] / .card[data-scroll] scroll (optional) ----------
  $$(".card[role='button'][tabindex], .card[data-scroll]").forEach((card) => {
    const link = card.querySelector("a[href^='#']");
    const href = link ? link.getAttribute("href") : null;
    if (!href || !isSamePageHashLink(href)) return;

    const go = () => {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      const header = $(".header");
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", href);
    };

    card.addEventListener("click", (e) => {
      // If user clicked a real link/button inside, let it behave normally.
      if (e.target.closest("a, button, input, select, textarea")) return;
      go();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  });

  // ---------- Accordions ----------
  // Expected structure:
  // <div class="accordion" data-accordion>
  //   <button class="accordion__btn" aria-expanded="false">...</button>
  //   <div class="accordion__panel" hidden>...</div>
  // </div>
  $$(".accordion[data-accordion]").forEach((acc) => {
    const btn = $(".accordion__btn", acc);
    const panel = $(".accordion__panel", acc);
    if (!btn || !panel) return;

    const setState = (open) => {
      acc.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
    };

    // Start closed (if markup accidentally left it open)
    setState(btn.getAttribute("aria-expanded") === "true" && !panel.hidden);

    btn.addEventListener("click", () => {
      const isOpen = acc.classList.contains("is-open");
      setState(!isOpen);
    });
  });

  // ---------- Contact form: mailto ----------
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = ($("#name")?.value || "").trim();
      const phone = ($("#phone")?.value || "").trim();
      const email = ($("#email")?.value || "").trim();
      const topic = ($("#topic")?.value || "other").trim();
      const message = ($("#message")?.value || "").trim();

      // Basic required fields check (HTML already enforces)
      if (!name || !email || !message) return;

      const to = "jjordan206@yahoo.com";

      const subjectMap = {
        volunteer: "Volunteer — Josh Jordan for Sheriff",
        sign: "Yard Sign / Window Decal Request",
        endorsement: "Endorsement / Support",
        question: "Question for the Campaign",
        other: "Message for Josh Jordan Campaign",
      };

      const subject = subjectMap[topic] || subjectMap.other;

      const bodyLines = [
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : null,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        message,
      ].filter(Boolean);

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

      window.location.href = mailto;

      // Nice UX: clear form after launching mail client
      form.reset();
    });
  }
})();
```
