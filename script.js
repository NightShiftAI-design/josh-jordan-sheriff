/* Josh Jordan for Sheriff — script.js
   - Sticky header mobile menu toggle
   - Close menu on navigation
   - Set current year
   - Auto mark active nav links
   - Homepage hero carousel (safe + swipe + optional autoplay)
*/

(() => {
  const header = document.querySelector(".site-header");
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  const yearEl = document.getElementById("year");

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (header && menuBtn && mobilePanel) {
    const closeMenu = () => {
      header.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      header.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
    };

    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Close when clicking a link in the mobile panel
    mobilePanel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close when clicking outside header (mobile)
    document.addEventListener("click", (e) => {
      if (!header.classList.contains("is-open")) return;
      if (!header.contains(e.target)) closeMenu();
    });
  }

  // Auto-set active nav link based on filename
  const path = window.location.pathname.split("/").pop() || "index.html";
  const markActive = (root) => {
    if (!root) return;
    root.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) return;

      const target = href.split("/").pop();
      if (target === path) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  };

  markActive(document.querySelector(".nav"));
  markActive(document.getElementById("mobilePanel"));

  /* ---------- Homepage Hero Carousel (safe + swipe + optional autoplay) ---------- */
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = carousel.querySelector(".carousel__btn.prev");
    const nextBtn = carousel.querySelector(".carousel__btn.next");

    if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

    // Make carousel focusable for keyboard interaction
    if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");

    let index = 0;
    let autoTimer = null;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const prev = () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    };

    const next = () => {
      index = (index + 1) % slides.length;
      update();
    };

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Keyboard: only when carousel is focused
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    // Swipe support (touch + pointer)
    let startX = 0;
    let isDown = false;
    let pointerId = null;

    const threshold = 40; // swipe sensitivity

    const onDown = (clientX, pid = null) => {
      isDown = true;
      startX = clientX;
      pointerId = pid;
    };

    const onUp = (clientX) => {
      if (!isDown) return;
      isDown = false;

      const delta = clientX - startX;

      if (delta > threshold) prev();
      else if (delta < -threshold) next();

      pointerId = null;
    };

    // Touch
    carousel.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches[0]) return;
        onDown(e.touches[0].clientX);
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        onUp(e.changedTouches[0].clientX);
      },
      { passive: true }
    );

    // Pointer (desktop + some mobile browsers)
    carousel.addEventListener("pointerdown", (e) => {
      // capture so we reliably get pointerup even if pointer leaves the element
      try {
        carousel.setPointerCapture(e.pointerId);
      } catch (_) {}
      onDown(e.clientX, e.pointerId);
    });

    carousel.addEventListener("pointerup", (e) => {
      if (pointerId !== null && e.pointerId !== pointerId) return;
      onUp(e.clientX);
    });

    carousel.addEventListener("pointercancel", () => {
      isDown = false;
      pointerId = null;
    });

    // Optional autoplay (skips if reduced motion is requested)
    const startAuto = () => {
      if (prefersReducedMotion) return;
      stopAuto();
      autoTimer = window.setInterval(() => next(), 4500);
    };

    const stopAuto = () => {
      if (!autoTimer) return;
      window.clearInterval(autoTimer);
      autoTimer = null;
    };

    // Pause autoplay when user interacts
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);

    // Pause when tab not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    // Start autoplay only if there are multiple slides
    if (slides.length > 1) startAuto();

    // Initial position
    update();
  });
})();
