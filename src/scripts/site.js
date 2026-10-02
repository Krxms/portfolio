document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && revealEls.length) {
  const vh = window.innerHeight;
  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < vh) el.classList.add('is-in');
  });
  // Le masquage ne s'active qu'une fois ce script exécuté : sans JS, tout reste visible.
  document.documentElement.classList.add('reveal-on');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealEls.forEach((el) => {
    if (!el.classList.contains('is-in')) io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}
