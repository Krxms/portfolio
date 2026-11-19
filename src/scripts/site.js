import 'lenis/dist/lenis.css';

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Reflet du verre : la position du pointeur alimente --mx / --my sur la surface survolée.
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('[data-glow]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
}


// Survol « encre » (bouton principal de la Hero) : la tache de matière part de l'endroit où le pointeur entre, et se retire vers
// l'endroit où il sort. Le script ne fait que noter ces deux points (--ox / --oy) ; l'animation est en CSS (cta.css).
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-ink]').forEach((el) => {
    const mark = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--ox', e.clientX - r.left + 'px');
      el.style.setProperty('--oy', e.clientY - r.top + 'px');
    };
    el.addEventListener('pointerenter', mark);
    el.addEventListener('pointerleave', mark);
  });
}

// Défilement fluide (Lenis) : la molette glisse avec de l'inertie au lieu de sauter de cran en cran. Souris et pavé tactile seulement :
// le tactile garde le défilement natif (le plus fidèle au doigt), et rien du tout avec « réduire les animations ». La bibliothèque n'est
// donc téléchargée et exécutée que sur les appareils à pointeur fin : un téléphone ne la charge pas et ne fait tourner aucune boucle pour
// elle. Les scènes de scenes.js lisent déjà la position à chaque image : elles suivent sans rien changer.
const isLow = () => document.documentElement.getAttribute('data-perf') === 'low';

// Mesure de fluidité : pendant les premières secondes de défilement, si les images durent en moyenne plus de 34 ms (moins de ~30 i/s), la machine
// est jugée lente : le mode économe (perf.css) s'active tout de suite et est mémorisé pour les visites suivantes. Le défilement à inertie s'arrête.
(() => {
  if (isLow()) return;
  let last = 0;
  let sy = scrollY;
  let sum = 0;
  let n = 0;
  const start = performance.now();
  const tick = (now) => {
    if (now - start > 6000) return;
    if (last && scrollY !== sy) {
      sum += now - last;
      n++;
      if (n >= 40) {
        if (sum / n > 34) {
          document.documentElement.setAttribute('data-perf', 'low');
          try {
            localStorage.setItem('perf', 'low');
          } catch (e) {}
          window.__lenis?.destroy();
          window.__lenis = undefined;
          return;
        }
        sum = 0;
        n = 0;
      }
    }
    sy = scrollY;
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

if (!isLow() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  import('lenis').then(({ default: Lenis }) => {
    const root = document.documentElement;
    const lenis = new Lenis({
      lerp: 0.24, // plus grand : plus réactif ; les scènes ont déjà leur propre lissage
      wheelMultiplier: 1.15,
      smoothWheel: true,
      anchors: { offset: -96 }, // les liens vers une ancre (#qui-suis-je) glissent aussi, sous l'en-tête
    });
    window.__lenis = lenis;
    const raf = (time) => {
      if (isLow()) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // le défilement s'arrête quand la page est verrouillée : menu ouvert, ouverture de page (loader) en cours
    const sync = () => {
      if (root.hasAttribute('data-nav-open') || root.classList.contains('has-loader')) lenis.stop();
      else lenis.start();
    };
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-nav-open', 'class'] });
    sync();
  });
}

// Carrousel des niveaux (.cs-lv-list) : quand il défile (téléphone), il devient une zone atteignable au clavier (tabindex, nom accessible) ;
// quand tout tient à l'écran (ordinateur), il reste hors de l'ordre de tabulation.
(() => {
  const lists = document.querySelectorAll('.cs-lv-list');
  if (!lists.length) return;
  const fit = () =>
    lists.forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', 'Niveaux d’autonomie');
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-label');
      }
    });
  fit();
  addEventListener('resize', fit);
  addEventListener('load', fit);
})();
