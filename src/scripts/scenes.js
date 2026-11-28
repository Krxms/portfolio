/* Scènes de défilement. Un petit moteur, sans bibliothèque, qui fonctionne partout (Chrome, Firefox, Safari) : il lit la
   position de chaque bloc pendant le défilement et écrit des variables CSS sur l'élément ; tout le dessin (3D, assemblage,
   passages dessus/dessous) est dans scenes.css.

   Variables écrites sur chaque scène :
     --e   entrée, de 0 (le bloc apparaît en bas de l'écran) à 1 (il est installé)
     --ee  la même, adoucie (sortie en douceur)
     --p   traversée complète, de 0 (il entre) à 1 (il sort par le haut)
   Les valeurs ne suivent pas le doigt à la lettre : elles le rattrapent avec un amorti (inertie), ce qui donne des
   mouvements souples et organiques, même si le défilement est saccadé (molette, trackpad).
   Sur le bloc de texte de la Hero : --hp (rideau). Sur l'en-tête : --page-p (progression de lecture).
   Sur les carrousels : --d et --ad sur chaque carte (distance au centre, signée et absolue).

   Rien n'est lancé avec « réduire les animations » : la page reste statique et complète. */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const root = document.documentElement;
  root.classList.add('has-scenes');

  // Progression pilotée par le CSS (animation-timeline: scroll()) : le recul de la Hero (--hp), le filet de lecture (--page-p) et le grain du bouton d'en-tête
  // (--cta-p) n'ont plus besoin du script. Pour revenir à l'ancien calcul en JavaScript : mettre CSS_SCROLL à false (rien d'autre à changer).
  const CSS_SCROLL = true;
  const cssScroll = CSS_SCROLL && typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
  if (cssScroll) root.classList.add('css-scroll');
  // Apparitions liées à la position d'un bloc dans l'écran (animation-timeline: view()) : le manifeste (mots du titre, paragraphe, étapes) est joué en CSS
  // (voir scenes.css, « css-view ») ; les entrées marquées `css` ci-dessous ne sont alors plus suivies par le script. Sans view() (Firefox, Safari ancien), le script reprend.
  const cssView = cssScroll && CSS.supports('animation-timeline: view()');
  if (cssView) root.classList.add('css-view');

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
  //  Les fenêtres commencent au bord bas de l'écran (ou juste dessous) et finissent assez haut dans l'écran : à défilement rapide, l'animation
  //  est déjà lancée quand le bloc apparaît, et terminée avant qu'on l'ait dépassé.
  //  stagger : numérote les enfants (--i, --n) ; avec `in`, ceux du sélecteur donné
  const CONFIG = [
    // les en-têtes de section (étiquette, titre, sous-titre), un enfant après l'autre ; les en-têtes propres à une section (projet, expérience) aussi
    { sel: '.tile-head', start: 0.95, end: 0.6, stagger: true },
    { sel: '.sc-title', start: 0.95, end: 0.6, stagger: true },
    { sel: '.il-xp-copy', start: 0.95, end: 0.6, stagger: true },
    // page Interfaces : les cartes des interventions arrivent une à une, puis leurs pictogrammes s'animent (interfaces-logiciels.css)
    { sel: '.il-tasks', start: 0.95, end: 0.6, stagger: true },
    { sel: '.manifesto-quote', start: 0.94, end: 0.48, words: true, css: true },
    // Qui suis-je : l'étiquette et l'introduction, en blocs (les mots ne s'allument plus que dans le manifeste, la phrase signature de l'accueil)
    { sel: '.about-copy > .tile-label', start: 0.95, end: 0.6 },
    { sel: '.about-lead', start: 0.95, end: 0.6 },
    // le texte qui suit le titre du manifeste : d'un seul bloc, qui apparaît quand le titre arrive vers la fin de ses mots (même progression : ref)
    { sel: '.manifesto-lead', ref: '.manifesto-quote', start: 0.94, end: 0.48, css: true },
    // idem pour la suite de « Qui suis-je » : elle suit la progression de l'introduction
    { sel: '.about-follow', ref: '.about-lead', start: 0.94, end: 0.48 },
    // page Création, « Un cadre clair » : même mécanique, les engagements suivent l'introduction dont les mots s'allument
    { sel: '.cs-follow', ref: '#cadre .tile-sub', start: 0.94, end: 0.48 },
    // page Création : le panneau « Vous gardez la main » donne sa progression à ses trois jauges (voir creation-site-web.css)
    // (plus de suivi du défilement : les jauges se remplissent une fois, à l'arrivée du panneau ; voir plus bas, « reveal »)
    { sel: '.cs-lv-panel', start: 0.98, end: 0.5, stagger: true, in: '.cs-lv-list', damp: 5 },
    // scores du projet : le compteur se déclenche dès que la réglette entre dans l'écran (haut du bloc à 92 % de la hauteur), puis se joue seul, en 2,6 s
    // (voir ProjectTeaser.css) : il ne dépend plus de la vitesse du défilement
    { sel: '.sc-scores', timed: true, trigger: 0.92, dur: 2600 },
    { sel: '.cards', start: 1.02, end: 0.45, stagger: true },
    { sel: '.proofs', start: 1.02, end: 0.42, stagger: true, css: true },
    { sel: '.proc-wrap[data-scene]', start: 1.04, end: 0.6, stagger: true, in: '.proc' },
    { sel: '.proc-after', start: 1.04, end: 0.85 },
    { sel: '.about', start: 0.98, end: 0.42 },
  ];

  // Une seule logique d'apparition, sur tous les écrans : les titres et les textes se jouent UNE fois, quand ils entrent dans l'écran (classe .is-in,
  // transition CSS sur opacity et translate, jouées par la carte graphique) : l'en-tête d'une section monte enfant après enfant (étiquette, titre,
  // sous-titre), puis le texte qui le suit arrive d'un bloc. Ils ne suivent plus le doigt image par image (le recalcul à chaque image saccadait).
  // Seule exception : le manifeste de l'accueil sur ordinateur, dont les mots s'allument au défilement (animation-timeline, scenes.css).
  // Téléphone : le carrousel des formules ne suit plus le défilement ; il reçoit .is-in à son arrivée (la première carte se remplit, voir creation-site-web.css).
  const reveal = true;
  const REVEAL_SEL = new Set(['.tile-head', '.sc-title', '.il-xp-copy', '.il-tasks', '.about-copy > .tile-label', '.about-lead', '.manifesto-quote', '.manifesto-lead', '.about-follow', '.cs-follow']);
  // les jauges des formules (« Vous gardez la main ») : remplies une seule fois, à la première arrivée du panneau dans l'écran (creation-site-web.css)
  REVEAL_SEL.add('.cs-lv-panel');
  const revealEls = [];
  if (reveal) root.classList.add('has-reveal');

  const scenes = [];
  CONFIG.forEach((c) => {
    if (cssView && c.css) return;
    document.querySelectorAll(c.sel).forEach((el) => {
      // un texte déjà découpé dans le HTML (le titre du manifeste) n'est pas redécoupé
      if (c.words && !el.querySelector('.w')) splitWords(el);
      if (c.stagger) {
        const list = c.in ? el.querySelector(c.in) : el;
        if (list) {
          [...list.children].forEach((ch, i, a) => {
            ch.style.setProperty('--i', i);
            ch.style.setProperty('--n', a.length);
          });
        }
      }
      if (reveal && REVEAL_SEL.has(c.sel)) {
        revealEls.push(el);
        return;
      }
      scenes.push({ el, ref: c.ref ? document.querySelector(c.ref) : null, start: c.start, end: c.end, only: c.only, damp: c.damp, timed: c.timed, trigger: c.trigger, dur: c.dur, t0: null, vis: true, e: null, p: 0 });
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

  if (revealEls.length) {
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          rio.unobserve(en.target);
        });
      },
      // déclenchée un peu AVANT l'arrivée dans l'écran (8 % de sa hauteur sous le bord bas) : à défilement rapide, le texte est déjà en mouvement
      // quand il apparaît, au lieu d'attendre d'être bien entré
      { rootMargin: '0px 0px 8% 0px', threshold: 0 },
    );
    revealEls.forEach((el) => rio.observe(el));
  }

  // ---- 3. Carrousels (mobile) : chaque carte sait à quelle distance du centre elle se trouve
  const flows = [...document.querySelectorAll('.cards, .cs-lv-list')];
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
  const veil = document.querySelector('.curtain > :not(.hero-zone)');
  const heroActs = [...document.querySelectorAll('.hero-zone .hero-actions a, .hero-zone .hero-assure')];
  // Une variable personnalisée écrite sur <html> est héritée par tous les éléments : à chaque valeur nouvelle, le navigateur recalcule les
  // styles de toute la page. On l'écrit donc le plus bas possible : le recul de la Hero (--hp) sur le bloc de texte de la Hero, le seul à
  // le lire (seulement tant qu'il change), et la progression de lecture (--page-p) directement sur l'en-tête, le seul à la lire.
  const header = document.querySelector('.site-header');
  // accueil : .hero ; pages de service au traitement de l'accueil (rideau) : le texte de l'en-tête
  const heroText = document.querySelector('.hero') || document.querySelector('.curtain > .hero-zone--page .ph-copy');
  // l'en-tête d'une page de service est plus court que l'écran : son fondu suit la hauteur réelle de l'en-tête, en script (--hp), même quand le
  // navigateur sait jouer animation-timeline (une plage fixe en svh ne correspondrait pas)
  const hpByScript = !cssScroll || (heroText && !heroText.classList.contains('hero'));
  let lastHp = '';
  let lastPage = '';
  let covered = false;
  let ticking = false;
  let last = performance.now();
  let hp = null;

  const frame = (now) => {
    ticking = false;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const k = 1 - Math.exp(-dt * 20); // vitesse de rattrapage : le défilement est déjà lissé par Lenis, un second lissage lent ajoutait du retard
    const kh = 1 - Math.exp(-dt * 26);
    const vh = innerHeight;
    const y = scrollY;
    let moving = false;

    scenes.forEach((s) => {
      // une scène minutée déjà lancée va toujours jusqu'au bout, même si on la fait sortir de l'écran : sinon la note restait figée à mi-course
      if (!s.vis && !(s.timed && s.t0 !== null && s.p !== 1)) return;
      const r = (s.ref || s.el).getBoundingClientRect();
      // scène minutée : elle part une fois, à l'arrivée de l'élément dans l'écran, et se joue à son propre rythme (--e va de 0 à 1 avec le temps)
      if (s.timed) {
        if (s.t0 === null && r.top < vh * s.trigger) {
          s.t0 = now;
          setTimeout(() => {
            s.p = 1;
            s.el.style.setProperty('--e', '1');
            s.el.style.setProperty('--ee', '1');
          }, s.dur + 150);
        }
        const tt = s.t0 === null ? 0 : clamp((now - s.t0) / s.dur);
        if (s.t0 !== null && tt < 1) moving = true;
        s.el.style.setProperty('--e', tt.toFixed(4));
        s.el.style.setProperty('--ee', ease(tt).toFixed(4));
        if (tt >= 1) s.p = 1;
        return;
      }
      const te = clamp((vh * s.start - r.top) / (vh * (s.start - s.end)));
      const tp = clamp((vh - r.top) / (vh + r.height));
      if (s.e === null) {
        s.e = te;
        s.p = tp;
      } else {
        // damp : vitesse de rattrapage propre à la scène (plus bas = plus lent, donc plus fluide) ; sinon celle de tout le site
        const ks = s.damp ? 1 - Math.exp(-dt * s.damp) : k;
        s.e += (te - s.e) * ks;
        s.p += (tp - s.p) * ks;
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

    // rideau : la Hero reste en place, les sections montent par-dessus (seulement sur l'accueil : les en-têtes des pages de service n'ont pas de .hero)
    if (hero && heroText) {
      const h = hero.offsetHeight || vh;
      const target = clamp(y / h);
      if (hpByScript) {
        if (hp === null) hp = target;
        else {
          hp += (target - hp) * kh;
          if (Math.abs(target - hp) > 0.0006) moving = true;
          else hp = target;
        }
        const hpv = hp.toFixed(4);
        if (hpv !== lastHp) {
          lastHp = hpv;
          heroText.style.setProperty('--hp', hpv);
          // pages de service : les illustrations de l'en-tête (hors du bloc de texte) s'estompent avec lui
          if (!heroText.classList.contains('hero')) hero.style.setProperty('--hp', hpv);
        }
      }
      const nowCovered = y > h + 60;
      if (nowCovered !== covered) {
        covered = nowCovered;
        hero.classList.toggle('is-covered', covered);
      }
      // les boutons de la Hero que la section suivante (les offres) commence à recouvrir s'effacent et cessent d'être une cible (clic, focus clavier) :
      // un bouton entièrement visible répond, un bouton à moitié caché n'est plus présenté comme utilisable
      if (veil && !covered) {
        const edge = veil.getBoundingClientRect().top;
        heroActs.forEach((a) => {
          const behind = a.getBoundingClientRect().bottom > edge - 2;
          if (behind !== a.classList.contains('is-behind')) a.classList.toggle('is-behind', behind);
        });
      }
    }

    const max = root.scrollHeight - vh;
    const pv = max > 0 ? clamp(y / max).toFixed(4) : '0';
    if (!cssScroll && pv !== lastPage) {
      lastPage = pv;
      (header || root).style.setProperty('--page-p', pv);
    }

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
