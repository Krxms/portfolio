/* Scènes de défilement. Un petit moteur, sans bibliothèque, qui fonctionne partout (Chrome, Firefox, Safari) : il lit la
   position de chaque bloc pendant le défilement et écrit des variables CSS sur l'élément ; tout le dessin (3D, assemblage,
   passages dessus/dessous) est dans scenes.css.

   Variables écrites sur chaque scène :
     --e   entrée, de 0 (le bloc apparaît en bas de l'écran) à 1 (il est installé)
     --ee  la même, adoucie (sortie en douceur)
     --p   traversée complète, de 0 (il entre) à 1 (il sort par le haut)
   Les valeurs ne suivent pas le doigt à la lettre : elles le rattrapent avec un amorti (inertie), ce qui donne des
   mouvements souples et organiques, même si le défilement est saccadé (molette, trackpad).
   Sur le document : --hp (rideau de la Hero) et --page-p (progression de lecture).
   Sur les carrousels : --d et --ad sur chaque carte (distance au centre, signée et absolue).

   Rien n'est lancé avec « réduire les animations » : la page reste statique et complète. */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const root = document.documentElement;
  root.classList.add('has-scenes');

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  // ---- 1. Les mots d'un texte s'allument un à un
  const splitWords = (el) => {
    let idx = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(part);
            } else {
              const s = document.createElement('span');
              s.className = 'w';
              s.style.setProperty('--i', idx++);
              s.textContent = part;
              frag.append(s);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    el.style.setProperty('--n', idx);
  };

  // ---- 2. Les scènes : sélecteur, fenêtre d'entrée (en part de la hauteur d'écran), options
  //  stagger : numérote les enfants (--i, --n) ; avec `in`, ceux du sélecteur donné
  const CONFIG = [
    { sel: '.tile-head', start: 0.95, end: 0.6, stagger: true },
    { sel: '.manifesto-quote, .manifesto-lead, .about-lead', start: 0.88, end: 0.38, words: true },
    { sel: '.cards', start: 0.96, end: 0.34, stagger: true },
    { sel: '.versus', start: 0.96, end: 0.3 },
    { sel: '.proc-wrap[data-scene]', start: 0.98, end: 0.5, stagger: true, in: '.proc' },
    { sel: '.proc-after', start: 1, end: 0.75 },
    { sel: '.about', start: 0.9, end: 0.3 },
    { sel: '.cta-panel', start: 0.95, end: 0.45 },
  ];

  const scenes = [];
  CONFIG.forEach((c) => {
    document.querySelectorAll(c.sel).forEach((el) => {
      if (c.words) splitWords(el);
      if (c.stagger) {
        const list = c.in ? el.querySelector(c.in) : el;
        if (list) {
          [...list.children].forEach((ch, i, a) => {
            ch.style.setProperty('--i', i);
            ch.style.setProperty('--n', a.length);
          });
        }
      }
      scenes.push({ el, start: c.start, end: c.end, only: c.only, vis: true, e: null, p: 0 });
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        const s = scenes.find((x) => x.el === en.target);
        if (s) s.vis = en.isIntersecting;
      });
    },
    { rootMargin: '25% 0px 25% 0px' },
  );
  scenes.forEach((s) => io.observe(s.el));

  // ---- 3. Carrousels (mobile) : chaque carte sait à quelle distance du centre elle se trouve
  const flows = [...document.querySelectorAll('.cards, .versus')];
  const flowUpdate = (box) => {
    if (box.scrollWidth <= box.clientWidth + 2) return;
    const mid = box.getBoundingClientRect().left + box.clientWidth / 2;
    [...box.children].forEach((ch) => {
      const r = ch.getBoundingClientRect();
      const d = clamp(((r.left + r.width / 2) - mid) / (box.clientWidth * 0.62), -1, 1);
      ch.style.setProperty('--d', d.toFixed(3));
      ch.style.setProperty('--ad', Math.abs(d).toFixed(3));
    });
  };
  flows.forEach((box) => {
    let queued = false;
    box.addEventListener(
      'scroll',
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          flowUpdate(box);
        });
      },
      { passive: true },
    );
  });

  // ---- 4. Boucle : écrit les variables, avec amorti, tant que la page bouge ou que les valeurs rattrapent la cible
  const hero = document.querySelector('.hero-zone');
  let covered = false;
  let ticking = false;
  let last = performance.now();
  let hp = null;

  const frame = (now) => {
    ticking = false;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const k = 1 - Math.exp(-dt * 6.5); // vitesse de rattrapage : souple, sans traîner
    const kh = 1 - Math.exp(-dt * 9);
    const vh = innerHeight;
    const y = scrollY;
    let moving = false;

    scenes.forEach((s) => {
      if (!s.vis) return;
      const r = s.el.getBoundingClientRect();
      const te = clamp((vh * s.start - r.top) / (vh * (s.start - s.end)));
      const tp = clamp((vh - r.top) / (vh + r.height));
      if (s.e === null) {
        s.e = te;
        s.p = tp;
      } else {
        s.e += (te - s.e) * k;
        s.p += (tp - s.p) * k;
        if (Math.abs(te - s.e) > 0.0006 || Math.abs(tp - s.p) > 0.0006) moving = true;
        else {
          s.e = te;
          s.p = tp;
        }
      }
      if (s.only) {
        s.el.style.setProperty(s.only, s.e.toFixed(4));
        return;
      }
      s.el.style.setProperty('--e', s.e.toFixed(4));
      s.el.style.setProperty('--ee', ease(s.e).toFixed(4));
      s.el.style.setProperty('--p', s.p.toFixed(4));
    });

    // rideau : la Hero reste en place, les sections montent par-dessus
    if (hero) {
      const h = hero.offsetHeight || vh;
      const target = clamp(y / h);
      if (hp === null) hp = target;
      else {
        hp += (target - hp) * kh;
        if (Math.abs(target - hp) > 0.0006) moving = true;
        else hp = target;
      }
      root.style.setProperty('--hp', hp.toFixed(4));
      const nowCovered = y > h + 60;
      if (nowCovered !== covered) {
        covered = nowCovered;
        window.dispatchEvent(new CustomEvent('lava:cover', { detail: covered }));
      }
    }

    const max = root.scrollHeight - vh;
    root.style.setProperty('--page-p', max > 0 ? clamp(y / max).toFixed(4) : '0');

    if (moving) request();
  };

  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  };

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => {
    flows.forEach(flowUpdate);
    request();
  });
  addEventListener('load', () => {
    flows.forEach(flowUpdate);
    request();
  });

  flows.forEach(flowUpdate);
  frame(performance.now());
}
