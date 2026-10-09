/**
 * THE DARLING SPA — CORE SCRIPT
 * Production vanilla JS without external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initScrollAnimations();
  initGalleryLightbox();
  initYear();
});

/* 1. Sticky Header Detection */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. Mobile Navigation Drawer Controller */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileMenu');
  if (!toggleBtn || !drawer) return;

  const links = drawer.querySelectorAll('a');

  const toggleState = (open) => {
    const isOpen = open !== undefined ? open : toggleBtn.getAttribute('aria-expanded') === 'false';
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
    drawer.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleState());

  links.forEach(link => {
    link.addEventListener('click', () => toggleState(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleState(false);
      toggleBtn.focus();
    }
  });
}

/* 3. Intersection Observer Scroll Reveal */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* 4. Fullscreen Lightbox Gallery Controller */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const overlay = document.getElementById('lightboxOverlay');

  if (!items.length || !lightbox || !lightboxImg) return;

  let currentIndex = 0;
  const imageSources = Array.from(items).map(btn => {
    const img = btn.querySelector('img');
    return {
      full: img.getAttribute('data-full') || img.src,
      alt: img.alt || 'The Darling Spa Interior'
    };
  });

  const displayImage = (index) => {
    currentIndex = (index + imageSources.length) % imageSources.length;
    const target = imageSources[currentIndex];
    lightboxImg.src = target.full;
    lightboxImg.alt = target.alt;
  };

  const openLightbox = (index) => {
    displayImage(index);
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', () => displayImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => displayImage(currentIndex + 1));

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') displayImage(currentIndex - 1);
    if (e.key === 'ArrowRight') displayImage(currentIndex + 1);
  });
}

/* 5. Dynamic Footer Year */
function initYear() {
  const yearElem = document.getElementById('year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}