/* =========================================================
   Campaign Site — script.js
   - Mobile menu toggle (works with #menuBtn + #mobilePanel)
   - Auto year in footer (#year)
   - Active nav link highlight on scroll
   - Smooth scroll w/ sticky-header offset
   - Close mobile menu on link click / outside click / ESC
   ========================================================= */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const headerEl = $(".site-header");
  const menuBtn = $("#menuBtn");
  const mobilePanel = $("#mobilePanel");
  const yearEl = $("#year");

  // ---------- Footer Year ----------
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile Menu ----------
  const isMobilePanelOpen = () => mobilePanel && mobilePanel.style.display === "block";

  const setMobilePanel = (open) => {
    if (!mobilePanel || !menuBtn) return;
    mobilePanel.style.display = open ? "block" : "none";
    menuBtn.setAttribute("aria-expanded", String(open));
  };

  if (menuBtn && mobilePanel) {
    // Initialize (closed)
    setMobilePanel(false);

    menuBtn.addEventListener("click", () => {
      setMobilePanel(!isMobilePanelOpen());
    });

    // Close menu when clicking a link inside
    mobilePanel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setMobilePanel(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMobilePanel(false);
    });

    // Close when clicking outside header
    document.addEventListener("click", (e) => {
      if (!isMobilePanelOpen()) return;
      const clickedInsideHeader = e.target.closest(".site-header");
      if (!clickedInsideHeader) setMobilePanel(false);
    });
  }

  // ---------- Smooth Scroll (with sticky header offset) ----------
  const getHeaderOffset = () => {
    // Include topbar + header height if both are visible
    const topbar = $(".topbar");
    const h = (topbar?.offsetHeight || 0) + (headerEl?.offsetHeight || 0);
    // A little breathing room
    return h + 8;
  };

  const smoothScrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Intercept in-page anchor clicks for offset scrolling
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href") || "";
    // Ignore empty hash
    if (href === "#" || href === "#top") return;

    const id = href.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return; // let browser handle unknown anchors

    e.preventDefault();
    smoothScrollToId(id);
    // Update URL without jumping
    history.pushState(null, "", `#${id}`);
  });

  // ---------- Active Nav Link Highlight ----------
  // Adds "is-active" class to .nav__link matching the section in view.
  // You can optionally style it in CSS:
  // .nav__link.is-active { background:#f3f6fa; }
  const navLinks = $$('.nav a[href^="#"], .mobile-panel a[href^="#"]')
    .filter(a => a.getAttribute("href") && a.getAttribute("href").length > 1);

  const sections = navLinks
    .map(a => a.getAttribute("href").slice(1))
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length) {
    const setActive = (activeId) => {
      navLinks.forEach((a) => {
        const id = a.getAttribute("href").slice(1);
        a.classList.toggle("is-active", id === activeId);
      });
    };

    // Use IntersectionObserver for clean + efficient tracking
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter(en => en.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible && visible.target && visible.target.id) {
          setActive(visible.target.id);
        }
      },
      {
        root: null,
        // Offset for sticky header + topbar
        rootMargin: `-${getHeaderOffset()}px 0px -60% 0px`,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65]
      }
    );

    sections.forEach(sec => observer.observe(sec));

    // If page loads with a hash, adjust scroll to account for sticky header
    window.addEventListener("load", () => {
      const hash = (location.hash || "").replace("#", "");
      if (hash) {
        // delay to allow layout paint
        setTimeout(() => smoothScrollToId(hash), 50);
      } else {
        // default to first section highlight if near top
        const first = sections[0];
        if (first?.id) setActive(first.id);
      }
    });
  }

  // ---------- Optional: shrink header on scroll (subtle, official) ----------
  // If you want this effect, add CSS:
  // .site-header.is-compact .header__inner { padding:10px 0; }
  // .site-header.is-compact .brand__logo { width:48px; height:48px; }
  const onScroll = () => {
    if (!headerEl) return;
    headerEl.classList.toggle("is-compact", window.scrollY > 18);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

})();
