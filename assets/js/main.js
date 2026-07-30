(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-nav');

  const setMenu = (open) => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const handleHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
  handleHeader();
  window.addEventListener('scroll', handleHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const viewport = document.querySelector('[data-review-viewport]');
  const track = document.querySelector('[data-review-track]');
  const prev = document.querySelector('[data-review-prev]');
  const next = document.querySelector('[data-review-next]');
  let reviewIndex = 0;

  const visibleCards = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  };

  const updateCarousel = () => {
    if (!track || !viewport) return;
    const cards = track.children.length;
    const visible = visibleCards();
    const maxIndex = Math.max(0, cards - visible);
    reviewIndex = Math.min(reviewIndex, maxIndex);
    const firstCard = track.querySelector('.review-card');
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    track.style.transform = `translate3d(${-reviewIndex * step}px, 0, 0)`;
    if (prev) prev.disabled = reviewIndex === 0;
    if (next) next.disabled = reviewIndex === maxIndex;
  };

  prev?.addEventListener('click', () => {
    reviewIndex = Math.max(0, reviewIndex - 1);
    updateCarousel();
  });
  next?.addEventListener('click', () => {
    const maxIndex = Math.max(0, (track?.children.length || 0) - visibleCards());
    reviewIndex = Math.min(maxIndex, reviewIndex + 1);
    updateCarousel();
  });
  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  const form = document.getElementById('whatsapp-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const message = form.elements.message;
    let valid = true;

    [[name, 'Vul je naam in.'], [message, 'Schrijf kort je vraag.']].forEach(([field, errorText]) => {
      const error = form.querySelector(`[data-error-for="${field.name}"]`);
      const empty = !field.value.trim();
      field.classList.toggle('is-invalid', empty);
      field.setAttribute('aria-invalid', String(empty));
      if (error) error.textContent = empty ? errorText : '';
      if (empty) valid = false;
    });

    if (!valid) {
      form.querySelector('.is-invalid')?.focus();
      return;
    }

    const text = `Hoi, ik ben ${name.value.trim()}.\n\nMijn vraag is:\n${message.value.trim()}`;
    const url = `https://wa.me/31631206696?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  document.querySelectorAll('#whatsapp-form input, #whatsapp-form textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      const error = form?.querySelector(`[data-error-for="${field.name}"]`);
      if (error) error.textContent = '';
    });
  });

  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
})();
