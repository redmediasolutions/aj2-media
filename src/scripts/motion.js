const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------- */
const progress = document.querySelector('.scroll-progress');
function updateProgress() {
  if (!progress) return;
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  progress.style.transform = `scaleX(${Math.min(Math.max(scrolled, 0), 1)})`;
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* --------------------------------------------------------------------
   Nav — solidify on scroll
   -------------------------------------------------------------------- */
const nav = document.querySelector('[data-nav]');
function updateNav() {
  if (!nav) return;
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}
document.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* --------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------- */
const navToggle = document.querySelector('[data-nav-toggle]');
const navPanel = document.querySelector('[data-nav-panel]');
if (navToggle && navPanel) {
  navToggle.addEventListener('click', () => {
    const open = navPanel.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  navPanel.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navPanel.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    })
  );
}

/* --------------------------------------------------------------------
   Custom cursor
   -------------------------------------------------------------------- */
const dot = document.querySelector('.cursor-dot');
if (dot && !reduceMotion) {
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  function loop() {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-active'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-active'));
  });
}

/* --------------------------------------------------------------------
   Magnetic buttons
   -------------------------------------------------------------------- */
if (!reduceMotion) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    let rect;
    el.addEventListener('mouseenter', () => (rect = el.getBoundingClientRect()));
    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

/* --------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------- */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const group = entry.target.closest('[data-reveal-group]');
          if (group) {
            const siblings = Array.from(group.querySelectorAll('[data-reveal]'));
            entry.target.style.setProperty('--i', siblings.indexOf(entry.target));
          }
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* --------------------------------------------------------------------
   Hero intro sequence
   -------------------------------------------------------------------- */
const hero = document.querySelector('[data-hero]');
if (hero) {
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('is-ready'), 80);
  });
}

/* --------------------------------------------------------------------
   Portfolio tilt-on-hover (subtle, desktop only)
   -------------------------------------------------------------------- */
if (!reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const media = card.querySelector('[data-tilt-media]');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (media) {
        media.style.transform = `scale(1.06) translate(${px * -10}px, ${py * -10}px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (media) media.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------
   Active nav link + smooth in-page scroll offset handling
   -------------------------------------------------------------------- */
const sections = document.querySelectorAll('main [id]');
const navLinks = document.querySelectorAll('[data-nav] a[href^="#"], [data-nav-panel] a[href^="#"]');
if (sections.length && 'IntersectionObserver' in window) {
  const navIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((s) => navIo.observe(s));
}

/* --------------------------------------------------------------------
   Counter animation for stat numbers
   -------------------------------------------------------------------- */
document.querySelectorAll('[data-count]').forEach((el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.count.includes('.') ? 1 : 0;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        if (reduceMotion) {
          el.textContent = target + suffix;
          return;
        }
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  obs.observe(el);
});
