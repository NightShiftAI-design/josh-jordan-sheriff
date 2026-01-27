/* Josh Jordan for Sheriff — script.js
   - Sticky header mobile menu toggle
   - Close menu on navigation
   - Set current year
   - Auto mark active nav links
   - Homepage hero carousel (safe + reusable)
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

  /* ---------- Homepage Hero Carousel (safe) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = carousel.querySelector(".carousel__btn.prev");
    const nextBtn = carousel.querySelector(".carousel__btn.next");

    if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      update();
    });
  });
})();
