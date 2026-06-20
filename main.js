// ── Sticky bar ────────────────────────────────────────────────────────────
function initStickyBar() {
  const bar  = document.getElementById('sticky-bar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // show bar when hero is no longer visible
      bar.classList.toggle('visible', !entry.isIntersecting);
      bar.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
    },
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );
  observer.observe(hero);
}

// ── Slideshow ─────────────────────────────────────────────────────────────
function initSlideshows() {
  document.querySelectorAll('.js-slideshow').forEach((wrap) => {
    const accent = wrap.dataset.accent || '#fff';
    const slides = Array.from(wrap.querySelectorAll('.slide'));
    const dotsEl = wrap.querySelector('.js-dots');
    const placeholder = wrap.querySelector('.slide-placeholder');

    if (!slides.length) return;

    const errored = slides.map(() => false);
    const loaded  = slides.map(() => false);
    let cur = 0;
    let timer = null;

    function validIndices() {
      return slides.map((_, i) => i).filter((i) => !errored[i]);
    }

    function show(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      const dots = dotsEl ? dotsEl.querySelectorAll('.slide-dot') : [];
      const valid = validIndices();
      dots.forEach((d, i) => d.classList.toggle('active', valid[i] === idx));
      cur = idx;
      // hide placeholder once we have a real image
      if (placeholder) {
        const showing = !errored[idx] && loaded[idx];
        placeholder.classList.toggle('hidden', showing);
      }
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const valid = validIndices();
      if (valid.length <= 1) return;
      valid.forEach((realIdx) => {
        const d = document.createElement('button');
        d.className = 'slide-dot';
        d.style.setProperty('--dot-color', accent);
        d.addEventListener('click', () => { show(realIdx); resetTimer(); });
        dotsEl.appendChild(d);
      });
    }

    function next() {
      const valid = validIndices();
      if (valid.length < 2) return;
      const pos = valid.indexOf(cur);
      show(valid[(pos + 1) % valid.length]);
    }

    function resetTimer() {
      clearInterval(timer);
      if (validIndices().length > 1) timer = setInterval(next, 3000);
    }

    slides.forEach((img, i) => {
      img.addEventListener('load', () => {
        loaded[i] = true;
        buildDots();
        if (i === 0) show(0);
        resetTimer();
      });
      img.addEventListener('error', () => {
        errored[i] = true;
        buildDots();
        if (i === cur) {
          const valid = validIndices();
          if (valid.length) show(valid[0]);
        }
      });
    });

    resetTimer();
  });
}

// ── Image progress bars (on WIP cards) ───────────────────────────────────
function initImgProgress() {
  const fills = document.querySelectorAll('.js-img-progress');
  if (!('IntersectionObserver' in window)) {
    fills.forEach((f) => { f.style.width = f.dataset.pct + '%'; });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, 200);
        observer.unobserve(fill);
      });
    },
    { threshold: 0.3 }
  );
  fills.forEach((f) => observer.observe(f));
}

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
    { threshold: 0.06 }
  );
  cards.forEach((c) => observer.observe(c));
}

// ── Hero fade-in ──────────────────────────────────────────────────────────
function initHero() {
  const els = [
    document.querySelector('.logo-title'),
    document.querySelector('.hero-row'),
  ];
  els.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.45s ease ${i * 0.1}s, transform 0.45s ease ${i * 0.1}s`;
  });
  requestAnimationFrame(() => {
    setTimeout(() => {
      els.forEach((el) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 40);
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initStickyBar();
  initCards();
  initImgProgress();
  initSlideshows();
});
