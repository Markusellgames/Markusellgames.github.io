// ── Card entrance animations ──────────────────────────────────────────────
function initCards() {
  const cards = document.querySelectorAll('.js-card');

  if (!('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const delay = (parseInt(card.dataset.index) || 0) * 90;
        setTimeout(() => card.classList.add('visible'), delay);
        observer.unobserve(card);
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((c) => observer.observe(c));
}

// ── Progress bar animations ───────────────────────────────────────────────
function initProgress() {
  const fills = document.querySelectorAll('.js-progress');
  if (!('IntersectionObserver' in window)) {
    fills.forEach((f) => { f.style.width = f.dataset.width; });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        setTimeout(() => { fill.style.width = fill.dataset.width; }, 200);
        observer.unobserve(fill);
      });
    },
    { threshold: 0.6 }
  );

  fills.forEach((f) => observer.observe(f));
}

// ── Hero fade-in ──────────────────────────────────────────────────────────
function initHero() {
  const els = [
    document.querySelector('.social-row'),
    document.querySelector('.logo-title'),
    document.querySelector('.tagline'),
  ];

  els.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      els.forEach((el) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 60);
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initCards();
  initProgress();
});
