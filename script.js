/* Josh Jordan for Sheriff — script.js
   Matches new index + new CSS:
   - Mobile nav toggle: .nav-toggle controls #nav by toggling .is-open
   - Close nav on link click, outside click, and Escape
   - Contact form: opens mail client (mailto:) with filled fields
   Notes:
   - Personal Statement uses native <details> (no JS needed)
*/

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  // -------------------------
  // Mobile Nav Toggle
  // -------------------------
  const nav = document.getElementById("nav");
  const navToggle = $(".nav-toggle");

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      setNav(!nav.classList.contains("is-open"));
    });

    // Close nav when a nav link is clicked
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setNav(false);
    });

    // Close nav on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNav(false);
    });

    // Close nav when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const insideNav = e.target.closest("#nav");
      const insideToggle = e.target.closest(".nav-toggle");
      if (!insideNav && !insideToggle) setNav(false);
    });

    // If resizing up to desktop, ensure nav is visible by default (no overlay)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setNav(false);
    });
  }

  // -------------------------
  // Contact Form (mailto)
  // -------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (document.getElementById("name")?.value || "").trim();
      const phone = (document.getElementById("phone")?.value || "").trim();
      const email = (document.getElementById("email")?.value || "").trim();
      const topic = (document.getElementById("topic")?.value || "other").trim();
      const message = (document.getElementById("message")?.value || "").trim();

      if (!name || !email || !message) {
        // Let browser show "required" messages when possible
        form.reportValidity?.();
        return;
      }

      const to = "jjordan206@yahoo.com";

      const subjectMap = {
        volunteer: "Volunteer — Josh Jordan for Sheriff",
        sign: "Yard Sign / Window Decal Request",
        endorsement: "Endorsement / Support",
        question: "Question for the Campaign",
        other: "Message for the Campaign",
      };

      const subject = subjectMap[topic] || subjectMap.other;

      const lines = [
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : null,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        message,
      ].filter(Boolean);

      const body = lines.join("\n");

      const mailto =
        `mailto:${encodeURIComponent(to)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      form.reset();
    });
  }
})();
