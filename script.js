/* ============================================================
   Josh Jordan for Sheriff — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. YEAR ──────────────────────────────────────────── */
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ── 2. MOBILE MENU ───────────────────────────────────── */
  const menuBtn    = document.getElementById('menuBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  const siteHeader = document.querySelector('.site-header');

  if (menuBtn && mobilePanel && siteHeader) {
    menuBtn.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);

      // Animate hamburger → X
      const spans = menuBtn.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!siteHeader.contains(e.target) && siteHeader.classList.contains('is-open')) {
        siteHeader.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        const spans = menuBtn.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on mobile nav link click
    mobilePanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        const spans = menuBtn.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── 3. STICKY HEADER SHADOW ──────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.style.boxShadow = '0 4px 24px rgba(15,25,35,.1)';
      } else {
        header.style.boxShadow = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 4. ACTIVE NAV LINK ───────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-panel a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('is-active');
    }
  });

  /* ── 5. SHARE BUTTON ──────────────────────────────────── */
  document.querySelectorAll('#shareBtn').forEach(btn => {
    const msgEl = btn.closest('article, div')?.querySelector('#shareMsg, .share-msg');

    const showMsg = text => {
      if (!msgEl) return;
      msgEl.textContent = text;
      msgEl.style.display = 'block';
      setTimeout(() => { msgEl.style.display = 'none'; }, 2800);
    };

    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'Josh Jordan for Sheriff — Rhea County, TN',
        text: 'Official campaign website for Josh Jordan for Sheriff of Rhea County.',
        url: window.location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          showMsg('Shared!');
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.url);
          showMsg('Link copied to clipboard!');
        } else {
          prompt('Copy this link:', shareData.url);
        }
      } catch (e) {
        // user cancelled — no action
      }
    });
  });

  /* ── 6. VOLUNTEER FORM ────────────────────────────────── */
  const form        = document.getElementById('volunteerForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const name  = form.querySelector('#v_name')?.value.trim();
      const email = form.querySelector('#v_email')?.value.trim();

      // Basic client-side validation
      if (!name || !email || !email.includes('@')) {
        if (formError) { formError.hidden = false; formSuccess.hidden = true; }
        return;
      }
      if (formError) formError.hidden = true;

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      /*
       * FORM ENDPOINT:
       * Replace the action attribute on #volunteerForm with your form handler.
       * Options:
       *   - Netlify: action="/forms/contact" with data-netlify="true"
       *   - Formspree: action="https://formspree.io/f/YOUR_ID" method="POST"
       *   - EmailJS: use their SDK instead of fetch
       *
       * The try/catch below handles a real POST submission.
       * Currently shows success for demo since action="#".
       */

      const action = form.getAttribute('action');
      if (action && action !== '#') {
        try {
          const res = await fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (res.ok) {
            if (formSuccess) formSuccess.hidden = false;
            form.reset();
          } else {
            throw new Error('Server error');
          }
        } catch {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
          alert('Something went wrong. Please call (423) 593-1964 or email jjordan206@yahoo.com.');
          return;
        }
      } else {
        // Demo mode (no real endpoint yet) — show success
        if (formSuccess) formSuccess.hidden = false;
        form.reset();
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  /* ── 7. SCROLL-TRIGGERED CARD FADE-IN ─────────────────── */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cards = document.querySelectorAll('.card, .cred-item, .bio-layout, .timeline__item');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp .45s ease both';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => {
      card.style.opacity = '0';
      observer.observe(card);
    });
  }

})();
