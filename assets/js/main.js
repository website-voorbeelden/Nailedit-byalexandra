(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const desktopMedia = window.matchMedia('(min-width: 800px)');

  const setMenuState = (open) => {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open && !desktopMedia.matches);
    const label = menuToggle.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Menu sluiten' : 'Menu openen';
  };

  menuToggle?.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  desktopMedia.addEventListener?.('change', () => setMenuState(false));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const form = document.querySelector('#whatsapp-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll('input, textarea')];
    fields.forEach((field) => field.closest('.field')?.classList.remove('is-invalid'));

    const firstEmpty = fields.find((field) => !field.value.trim());
    if (firstEmpty) {
      firstEmpty.closest('.field')?.classList.add('is-invalid');
      firstEmpty.focus();
      firstEmpty.reportValidity();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();
    const whatsappMessage = `Hoi, ik ben ${name}.\n\nMijn telefoonnummer is ${phone}.\n\nMijn vraag is:\n${message}`;
    const url = `https://wa.me/31631206696?text=${encodeURIComponent(whatsappMessage)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = url;
  });

  form?.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.closest('.field')?.classList.remove('is-invalid'));
  });

  const miniCarousel = document.querySelector('[data-mini-carousel]');
  if (miniCarousel) {
    const track = miniCarousel.querySelector('[data-mini-track]');
    const slides = [...track.children];
    const status = miniCarousel.querySelector('[data-mini-status]');
    const prev = miniCarousel.querySelector('[data-mini-prev]');
    const next = miniCarousel.querySelector('[data-mini-next]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = null;

    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (status) status.textContent = `${index + 1} / ${slides.length}`;
    };
    const go = (direction) => {
      index = (index + direction + slides.length) % slides.length;
      render();
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };
    const start = () => {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = window.setInterval(() => go(1), 5500);
    };

    prev?.addEventListener('click', () => { go(-1); start(); });
    next?.addEventListener('click', () => { go(1); start(); });
    miniCarousel.addEventListener('mouseenter', stop);
    miniCarousel.addEventListener('mouseleave', start);
    miniCarousel.addEventListener('focusin', stop);
    miniCarousel.addEventListener('focusout', start);
    render();
    start();
  }

  const reviewCarousel = document.querySelector('[data-review-carousel]');
  if (reviewCarousel) {
    const track = reviewCarousel.querySelector('[data-review-track]');
    const cards = [...track.children];
    const prev = reviewCarousel.querySelector('[data-review-prev]');
    const next = reviewCarousel.querySelector('[data-review-next]');
    const status = reviewCarousel.querySelector('[data-review-status]');

    const cardStep = () => {
      const first = cards[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    };

    const currentIndex = () => Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / cardStep())));
    const updateStatus = () => {
      if (status) status.textContent = `${currentIndex() + 1} / ${cards.length}`;
    };
    const scrollByCard = (direction) => {
      track.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
    };

    prev?.addEventListener('click', () => scrollByCard(-1));
    next?.addEventListener('click', () => scrollByCard(1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(updateStatus), { passive: true });
    window.addEventListener('resize', updateStatus, { passive: true });
    updateStatus();
  }

  const accordion = document.querySelector('[data-accordion]');
  accordion?.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      accordion.querySelectorAll('details').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
})();
