/* ── Sticky bar ─────────────────────────────────────────────── */
(function initStickyBar() {
  const bar  = document.getElementById('sticky-bar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;
  const io = new IntersectionObserver(
    ([entry]) => bar.classList.toggle('visible', !entry.isIntersecting),
    { threshold: 0 }
  );
  io.observe(hero);
})();

/* ── Accordion ──────────────────────────────────────────────── */
(function initAccordion() {
  document.querySelectorAll('.proj-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      if (!panel || !panel.classList.contains('proj-panel')) return;
      const isOpen = panel.classList.contains('open');

      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.maxHeight = '0px';
          panel.classList.remove('open');
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      } else {
        panel.style.maxHeight = '0px';
        panel.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        });
        panel.addEventListener('transitionend', () => {
          if (panel.classList.contains('open')) panel.style.maxHeight = 'none';
        }, { once: true });
      }
    });
  });
})();

/* ── Progress bars ──────────────────────────────────────────── */
(function initProgressBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = (el.dataset.pct || '0') + '%';
        io.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.js-img-progress').forEach(el => io.observe(el));
})();

/* ── Slideshows ─────────────────────────────────────────────── */
(function initSlideshows() {
  document.querySelectorAll('.js-slideshow').forEach(show => {
    const slides      = show.querySelectorAll('.slide');
    const dotsWrap    = show.querySelector('.js-dots');
    const placeholder = show.querySelector('.slide-placeholder');
    const accent      = show.dataset.accent || '#a78bfa';

    if (!slides.length) return;

    let current = 0;
    let timer;

    const dots = Array.from(slides).map((_, i) => {
      const d = document.createElement('button');
      d.className = 'slide-dot' + (i === 0 ? ' active' : '');
      d.style.setProperty('--dot-color', accent);
      d.addEventListener('click', () => { go(i); resetTimer(); });
      dotsWrap && dotsWrap.appendChild(d);
      return d;
    });

    function go(idx) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
      if (placeholder) {
        const hasLoaded = slides[current].complete && slides[current].naturalWidth > 0;
        placeholder.classList.toggle('hidden', hasLoaded);
      }
    }

    function next() { go((current + 1) % slides.length); }
    function resetTimer() { clearInterval(timer); timer = setInterval(next, 3800); }

    slides.forEach(img => {
      img.addEventListener('load', () => {
        if (parseInt(img.dataset.index ?? '0') === current && placeholder) {
          placeholder.classList.add('hidden');
        }
      });
    });

    go(0);
    resetTimer();
  });
})();
