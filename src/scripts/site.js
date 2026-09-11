// Sticky nav background on scroll
const nav = document.getElementById('siteNav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu
const burger = document.getElementById('burgerBtn');
const panel = document.getElementById('mobilePanel');
if (burger && panel) {
  burger.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// Scroll reveal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Duplicate marquee content for a seamless loop
document.querySelectorAll('[data-marquee-track]').forEach((track) => {
  track.innerHTML += track.innerHTML;
});

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
