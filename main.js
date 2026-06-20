// ── Slideshow ─────────────────────────────────────────────────────────────
function initSlideshows() {
  document.querySelectorAll('.js-slideshow').forEach((wrap) => {
    const accent = wrap.dataset.accent || '#fff';
    const slides = Array.from(wrap.querySelectorAll('.slide'));
    const dotsEl = wrap.querySelector('.js-dots');
    const placeholder = wrap.querySelector('.slide-placeholder');

    if (!slides.length) return;

    // Track which images loaded/errored
    const loaded = slides.map(() => false);
    const errored = slides.map(() => false);
    let cur = 0;
    let timer = null;

    function validIndices() {
      return slides.map((_, i) => i).filter((i) => !errored[i]);
    }

    function show(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dotsEl.querySelectorAll('.slide-dot').forEach((d, i) => {
        d.classList.toggle('active', validIndices()[i] === idx);
      });
      cur = idx;

      const hasVisible = validIndices().length > 0 && loaded[idx];
      if (placeholder) placeholder.classList.toggle('hidden', hasVisible);
    }

    function buildDots() {
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
      const nextIdx = valid[(pos + 1) % valid.length];
      show(nextIdx);
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
        // Try the next valid slide if current errored
        if (i === cur) {
          const valid = validIndices();
          if (valid.length) show(valid[0]);
        }
      });
    });

    // Start timer anyway (images might already be cached)
    resetTimer();
  });
}

// ── Vertical progress bars ────────────────────────────────────────────────
function initVBars() {
  const fills = document.querySelectorAll('.js-vbar');
  if (!('IntersectionObserver' in window)) {
    fills.forEach((f) => { f.style.height = f.dataset.pct + '%'; });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        setTimeout(() => { fill.style.height = fill.dataset.pct + '%'; }, 250);
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
    { threshold: 0.08 }
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
  initCards();
  initVBars();
  initSlideshows();
});
