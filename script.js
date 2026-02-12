/* Josh Jordan for Sheriff — script.js
   - Sticky header mobile menu toggle (robust)
   - Close menu on navigation / escape / outside click / resize
   - Set current year
   - Auto mark active nav links (safe)
   - Homepage hero carousel (safe + swipe + optional autoplay + reduced motion)
*/

(() => {
  const header = document.querySelector(".site-header");
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  const yearEl = document.getElementById("year");

  // ---------------------------
  // Year
  // ---------------------------
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------------------
  // Mobile menu
  // ---------------------------
  const hasMenu = header && menuBtn && mobilePanel;
  const isOpen = () => header?.classList.contains("is-open");

  const closeMenu = () => {
    if (!hasMenu) return;
    header.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!hasMenu) return;
    header.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  if (hasMenu) {
    // Toggle on button click
    menuBtn.addEventListener("click", (e) => {
      // Prevent “outside click” handler from immediately closing it
      e.stopPropagation();
      isOpen() ? closeMenu() : openMenu();
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

    // Close when clicking outside header (only if open)
    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (!header.contains(e.target)) closeMenu();
    });

    // Close when switching to desktop layout / orientation changes
    const closeOnWide = () => {
      // Match your CSS breakpoint where .nav hides / menu shows
      if (window.innerWidth > 980) closeMenu();
    };
    window.addEventListener("resize", closeOnWide);
    window.addEventListener("orientationchange", closeOnWide);
  }

  // ---------------------------
  // Active nav link (safe)
  // ---------------------------
  const normalizePath = (hrefOrPath) => {
    if (!hrefOrPath) return "";
    // strip query/hash
    const clean = hrefOrPath.split("#")[0].split("?")[0];
    // last segment
    const last = clean.split("/").filter(Boolean).pop() || "";
    // treat root as index.html
    return last || "index.html";
  };

  const current = normalizePath(window.location.pathname);

  const shouldIgnoreHref = (href) => {
    if (!href) return true;
    if (href === "#" || href.startsWith("#")) return true;
    if (href.startsWith("http")) return true;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("sms:")) return true;
    return false;
  };

  const markActive = (root) => {
    if (!root) return;
    root.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (shouldIgnoreHref(href)) return;

      const target = normalizePath(href);
      if (target === current) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  };

  markActive(document.querySelector(".nav"));
  markActive(document.getElementById("mobilePanel"));

  // ---------------------------
  // Homepage Hero Carousel
  // ---------------------------
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Shared pointer tracking so we don't attach a window pointerup per carousel
  let activePointer = null; // { carousel, startX }
  const SWIPE_THRESHOLD = 40;

  const onPointerUp = (clientX) => {
    if (!activePointer) return;
    const { carousel, startX } = activePointer;
    activePointer = null;

    const delta = clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    const prevBtn = carousel.querySelector(".carousel__btn.prev");
    const nextBtn = carousel.querySelector(".carousel__btn.next");
    if (!prevBtn || !nextBtn) return;

    if (delta > 0) prevBtn.click();
    else nextBtn.click();
  };

  window.addEventListener("pointerup", (e) => onPointerUp(e.clientX));

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = carousel.querySelector(".carousel__btn.prev");
    const nextBtn = carousel.querySelector(".carousel__btn.next");

    if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

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

    // Keyboard (only when carousel is focused)
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    // Touch swipe
    let touchStartX = 0;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const endX = e.changedTouches[0].clientX;
        const delta = endX - touchStartX;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        delta > 0 ? prev() : next();
      },
      { passive: true }
    );

    // Pointer swipe (desktop drag)
    carousel.addEventListener("pointerdown", (e) => {
      activePointer = { carousel, startX: e.clientX };
    });

    // Optional autoplay (respects reduced motion)
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

    // Start autoplay only if multiple slides
    if (slides.length > 1) startAuto();

    update();
  });
})();
