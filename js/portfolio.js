'use strict';

// Each deck owns its state; controls cannot affect another project's slides.
document.querySelectorAll('.gallery').forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll('.slides img'));
  const counter = gallery.querySelector('.slide-count');
  let index = 0;
  function show(next) {
    slides[index].hidden = true;
    index = (next + slides.length) % slides.length;
    slides[index].hidden = false;
    counter.textContent = `${index + 1} / ${slides.length}`;
  }
  gallery.querySelector('.gallery-controls').hidden = false;
  gallery.querySelectorAll('[data-direction]').forEach((button) => {
    button.addEventListener('click', () => show(index + Number(button.dataset.direction)));
  });
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  const surface = gallery.querySelector('.slides');
  let start = null;
  surface.addEventListener('pointerdown', (event) => {
    if (event.isPrimary && event.pointerType !== 'mouse') start = { x: event.clientX, y: event.clientY };
  });
  surface.addEventListener('pointerup', (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    start = null;
  });
  surface.addEventListener('pointercancel', () => { start = null; });
});

// Normalize the original scroll effect to the hero's available scroll distance.
// Native scrolling remains in charge on touch devices and anchor navigation.
(() => {
  const hero = document.querySelector('.hero');
  const stage = hero?.querySelector('.hero-inner');
  if (!hero || !stage) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function render() {
    frame = 0;
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    const distance = Math.max(1, hero.offsetHeight - stage.offsetHeight);
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    const progress = Math.min(1, Math.max(0, (stickyTop - bounds.top) / distance));
    hero.style.setProperty('--hero-progress', progress.toFixed(4));
    // Don't leave invisible links in the keyboard sequence while the title exits.
    stage.inert = progress > .7;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function configure() {
    document.documentElement.classList.toggle('hero-motion', !reducedMotion.matches);
    if (reducedMotion.matches) {
      hero.style.removeProperty('--hero-progress');
      stage.inert = false;
    } else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', configure);
  if (document.fonts) document.fonts.ready.then(schedule);
  configure();
})();

const copyEmail = document.querySelector('.copy-email');
if (copyEmail && navigator.clipboard?.writeText) {
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText('jaunnnngs@naver.com');
      status.textContent = '메일 주소를 복사했어요.';
    } catch {
      status.textContent = '주소를 길게 누르거나 선택해서 복사해 주세요: jaunnnngs@naver.com';
    }
  });
}
