/* ============================================================
   MON PASSAGE BEAUTÉ — JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Header scroll behavior ──────────────────────────────
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  // Only index (.hero) and head-spa (.hs-hero) have dark backgrounds at the top
  const isTransparentHeader = document.querySelector('.hero, .hs-hero') !== null;

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 60) {
        header.classList.remove('transparent');
        header.classList.add('scrolled');
      } else {
        if (isTransparentHeader) {
          header.classList.add('transparent');
          header.classList.remove('scrolled');
        } else {
          header.classList.remove('transparent');
          header.classList.add('scrolled');
        }
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 400) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 2. Hero Ken Burns ──────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  // ── 3. Mobile Navigation ───────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const body       = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      if (isOpen) {
        mobileNav.style.display = 'flex';
        setTimeout(() => mobileNav.classList.add('open'), 10);
        body.style.overflow = 'hidden';
        if (header) {
          header.classList.remove('transparent');
          header.classList.add('scrolled', 'nav-open');
        }
      } else {
        mobileNav.classList.remove('open');
        body.style.overflow = '';
        if (header) {
          header.classList.remove('nav-open');
          handleScroll();
        }
        setTimeout(() => {
          if (!mobileNav.classList.contains('open')) {
            mobileNav.style.display = 'none';
          }
        }, 400);
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        body.style.overflow = '';
        if (header) {
          header.classList.remove('nav-open');
          handleScroll();
        }
        setTimeout(() => { mobileNav.style.display = 'none'; }, 400);
      });
    });
  }

  // ── 4. Scroll Reveal (IntersectionObserver) ────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // ── 5. Tabs (prestations) ──────────────────────────────────
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('visible');
      });

      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.style.display = 'block';
        setTimeout(() => panel.classList.add('visible'), 10);
      }
    });
  });

  // Activate first tab by default
  if (tabBtns.length > 0) {
    tabBtns[0].click();
  }

  // ── 6. Lightbox ────────────────────────────────────────────
  const lightbox      = document.querySelector('.lightbox');
  const lightboxImg   = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  if (lightbox) {
    document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.src;
        lightboxImg.alt = item.dataset.alt || '';
        lightbox.classList.add('open');
        body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      body.style.overflow = '';
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ── 7. Contact Form Validation ─────────────────────────────
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const showError = (field, msg) => {
      field.classList.add('error');
      let err = field.parentElement.querySelector('.form-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'form-error';
        field.parentElement.appendChild(err);
      }
      err.textContent = msg;
    };

    const clearError = (field) => {
      field.classList.remove('error');
      const err = field.parentElement.querySelector('.form-error');
      if (err) err.remove();
    };

    contactForm.querySelectorAll('.form-control').forEach(f => {
      f.addEventListener('input', () => clearError(f));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nom     = contactForm.querySelector('#nom');
      const email   = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      if (nom && !nom.value.trim()) {
        showError(nom, 'Votre nom est requis'); valid = false;
      }
      if (email && !email.value.trim()) {
        showError(email, 'Votre email est requis'); valid = false;
      } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Email invalide'); valid = false;
      }
      if (message && !message.value.trim()) {
        showError(message, 'Votre message est requis'); valid = false;
      }

      if (valid) {
        contactForm.innerHTML = `
          <div class="form-success">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🌸</div>
            <div>Merci pour votre message !</div>
            <div style="font-size: 0.9rem; color: var(--taupe); margin-top: 0.5rem; font-family: var(--font-sans);">
              Nous vous répondrons dans les plus brefs délais.
            </div>
          </div>`;
      }
    });
  }

  // ── 8. Active nav link detection ───────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) link.classList.add('active');
    if (currentPage === '' && href === 'index.html') link.classList.add('active');
  });

  // ── 9. Smooth anchor scrolling ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 110;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Ignorer les erreurs de syntaxe sur les sélecteurs invalides
      }
    });
  });

  // ── 10. Tarif filter tabs (page tarifs) ───────────────────
  const tarifTabs = document.querySelectorAll('.tarif-tab-btn');
  const tarifSections = document.querySelectorAll('.tarif-section');

  tarifTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      tarifTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tarifSections.forEach(sec => {
        if (cat === 'all' || sec.dataset.category === cat) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // ── 11. Header initial state is handled by handleScroll() ────────

});
