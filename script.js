```js
/* Josh Jordan for Sheriff — script.js
   Minimal + safe:
   - Mobile nav toggle (.nav-toggle toggles .nav.is-open)
   - Accordion toggle for statement (div.accordion[data-accordion])
   - Contact form opens mail client (mailto:) with filled fields
*/

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  // -------------------------
  // Mobile nav
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
      const open = nav.classList.contains("is-open");
      setNav(!open);
    });

    // close when clicking a link in the nav
    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      setNav(false);
    });

    // close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNav(false);
    });

    // close when clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const clickedNav = e.target.closest("#nav");
      const clickedToggle = e.target.closest(".nav-toggle");
      if (!clickedNav && !clickedToggle) setNav(false);
    });
  }

  // -------------------------
  // Accordion (statement)
  // -------------------------
  const acc = $(".accordion[data-accordion]");
  if (acc) {
    const btn = $(".accordion__btn", acc);
    const panel = $(".accordion__panel", acc);

    if (btn && panel) {
      const setAcc = (open) => {
        acc.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        panel.hidden = !open;
      };

      // force closed on load (keeps consistent)
      setAcc(false);

      btn.addEventListener("click", () => {
        const open = acc.classList.contains("is-open");
        setAcc(!open);
      });
    }
  }

  // -------------------------
  // Contact form (mailto)
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

      const body = [
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : null,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      const mailto =
        `mailto:${encodeURIComponent(to)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      form.reset();
    });
  }
})();
```
