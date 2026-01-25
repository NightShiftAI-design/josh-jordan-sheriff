/* Josh Jordan for Sheriff — script.js
   - Sticky header mobile menu toggle
   - Close menu on navigation
   - Set current year
   - (Optional) mark active nav links automatically if not manually set
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
      const within = header.contains(e.target);
      if (!within) closeMenu();
    });
  }

  // Optional: auto-set active nav link based on filename (helps if you forget is-active)
  const path = window.location.pathname.split("/").pop() || "index.html";
  const markActive = (root) => {
    if (!root) return;
    root.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;

      const target = href.split("/").pop();
      if (target === path) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  };

  markActive(document.querySelector(".nav"));
  markActive(document.getElementById("mobilePanel"));
})();
