// ── Sticky bar ────────────────────────────────────────────────────────────
function initStickyBar() {
  const bar  = document.getElementById('sticky-bar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle('visible', !entry.isIntersecting);
      bar.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}

// ── Project accordion ─────────────────────────────────────────────────────
function initAccordion() {
  let currentId = null;

  document.querySelectorAll('.proj-row').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.proj;
      const panel = document.getElementById('proj-panel-' + id);
      if (!panel) return;

      if (currentId === id) {
        // collapse
        collapsePanel(id, panel, btn);
        currentId = null;
      } else {
        // collapse previous
        if (currentId) {
          const prevPanel = document.getElementById('proj-panel-' + currentId);
          const prevBtn = document.querySelector('.proj-row[data-proj="' + currentId + '"]');
          collapsePanel(currentId, prevPanel, prevBtn);
        }
        // expand new
        expandPanel(id, panel, btn);
        currentId = id;
      }
    });
  });

  function expandPanel(id, panel, btn) {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    // set max-height to scrollHeight for animation, then auto
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.addEventListener('transitionend', function onEnd() {
      if (panel.classList.contains('open')) panel.style.maxHeight = 'none';
      panel.removeEventListener('transitionend', onEnd);
    }, { once: true });
    // Animate progress bars inside
    panel.querySelectorAll('.js-img-progress').forEach((fill) => {
      setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, 300);
    });
    // Init slideshows inside if not already done
    panel.querySelectorAll('.js-slideshow:not([data-inited])').forEach(initOneSlideshow);
  }

  function collapsePanel(id, panel, btn) {
    if (!panel || !btn) return;
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    // reset max-height from 'none' to current px so transition works
    panel.style.maxHeight = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { panel.style.maxHeight = '0px'; });
    });
  }
}

// ── Slideshow ─────────────────────────────────────────────────────────────
function initOneSlideshow(wrap) {
  wrap.setAttribute('data-inited', '1');
  const accent = wrap.dataset.accent || '#fff';
  const slides = Array.from(wrap.querySelectorAll('.slide'));
  const dotsEl = wrap.querySelector('.js-dots');
  const placeholder = wrap.querySelector('.slide-placeholder');

  if (!slides.length) return;

  const errored = slides.map(() => false);
  const loaded  = slides.map(() => false);
  let cur = 0;
  let timer = null;

  function validIdx() { return slides.map((_,i) => i).filter(i => !errored[i]); }

  function show(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    const valid = validIdx();
    (dotsEl ? dotsEl.querySelectorAll('.slide-dot') : []).forEach((d, i) => d.classList.toggle('active', valid[i] === idx));
    cur = idx;
    if (placeholder) placeholder.classList.toggle('hidden', !errored[idx] && loaded[idx]);
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const valid = validIdx();
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
    const valid = validIdx();
    if (valid.length < 2) return;
    const pos = valid.indexOf(cur);
    show(valid[(pos + 1) % valid.length]);
  }

  function resetTimer() {
    clearInterval(timer);
    if (validIdx().length > 1) timer = setInterval(next, 3000);
  }

  slides.forEach((img, i) => {
    img.addEventListener('load', () => {
      loaded[i] = true; buildDots();
      if (i === 0) show(0);
      resetTimer();
    });
    img.addEventListener('error', () => {
      errored[i] = true; buildDots();
      if (i === cur) { const v = validIdx(); if (v.length) show(v[0]); }
    });
  });

  resetTimer();
}

function initSlideshows() {
  // Only init slideshows that are NOT inside a proj-panel (those are lazy)
  document.querySelectorAll('.js-slideshow:not(.proj-panel .js-slideshow)').forEach(initOneSlideshow);
}

// ── Image progress bars (for non-accordion context) ───────────────────────
function initImgProgress() {
  // Outside panels — trigger on scroll
  const fills = document.querySelectorAll('.js-img-progress:not(.proj-panel .js-img-progress)');
  if (!fills.length) return;
  if (!('IntersectionObserver' in window)) {
    fills.forEach(f => { f.style.width = f.dataset.pct + '%'; });
    return;
  }
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, 200);
      observer.unobserve(fill);
    }),
    { threshold: 0.3 }
  );
  fills.forEach(f => observer.observe(f));
}

// ── Card entrance animations ──────────────────────────────────────────────
function initCards() {
  const cards = document.querySelectorAll('.js-card-inner');
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(12px)';
    c.style.transition = 'opacity .4s ease, transform .4s ease';
  });
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; });
    return;
  }
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const delay = (parseInt(card.dataset.index) || 0) * 60;
      setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, delay);
      observer.unobserve(card);
    }),
    { threshold: 0.05 }
  );
  cards.forEach(c => observer.observe(c));
}

// ── Hero fade-in ──────────────────────────────────────────────────────────
function initHero() {
  const els = [document.querySelector('.logo-title'), document.querySelector('.hero-row')];
  els.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity .45s ease ${i * 0.1}s, transform .45s ease ${i * 0.1}s`;
  });
  requestAnimationFrame(() => setTimeout(() => {
    els.forEach(el => { if (!el) return; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  }, 40));
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initStickyBar();
  initAccordion();
  initSlideshows();
  initImgProgress();
  initCards();
});
