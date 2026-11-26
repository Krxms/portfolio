/* Scènes isométriques de la démarche (accueil, « Avant les écrans, il y a vos besoins. »).
   Quatre dioramas, un par étape, posés sur le même socle. Chaque objet dit la fonction de l'étape :
     1. Comprendre : une cliente et le concepteur face à face ; leurs bulles montent, les besoins se posent en fiches sur une table basse.
     2. Cadrer : le devis à plat (lignes cochées une à une, signature), le calendrier et sa date de livraison, la règle, les blocs du périmètre.
     3. Concevoir : la vue éclatée d'un écran, trois calques qui respirent (fil de fer, composants, maquette finie) et le curseur qui valide.
     4. Réaliser : le site debout sur ordinateur et sur téléphone, la barre de mise en ligne qui se remplit, le drapeau d'arrivée à damier, le signal « en ligne ».

   Rendu : une seule lumière, en haut à gauche, comme partout sur le site. Dessus des volumes clairs, face gauche en demi-teinte, face droite dans
   l'ombre (dégradés verticaux), arête vive sur les bords éclairés, ombres de contact douces sous chaque objet. Palette du site : bleu klein, orange,
   sable, menthe, papier crème, marine. Formes du logo (arche, disque) dans les interfaces dessinées.

   Technique : SVG statique généré ici, sans image ni filtre. Projection isométrique (x vers le bas à droite, y vers le bas à gauche, z vers le haut).
   Les « décalques » 2D (onTop, onFront, onSide) sont dessinés à plat puis projetés par une matrice : coordonnées simples, rendu exact.
   Le mouvement est en CSS (Manifesto.css, classes iso-*) : transform et opacity seulement, joués par la carte graphique, et seulement quand la
   scène est à l'écran (data-play, posé par Manifesto.astro). Les identifiants des dégradés sont préfixés par scène (plusieurs SVG dans la page). */

type V = [number, number];

const CX = 130;
const CY = 52;
const K = 0.866;

const f = (n: number) => (Math.round(n * 10) / 10).toString();
const P = (x: number, y: number, z: number): V => [CX + (x - y) * K, CY + (x + y) * 0.5 - z];
const pts = (a: V[]) => a.map((p) => `${f(p[0])},${f(p[1])}`).join(' ');
const poly = (a: V[], fill: string, more = '') => `<polygon points="${pts(a)}" fill="${fill}"${more ? ' ' + more : ''}/>`;
/** Face de volume aux angles adoucis : un contour de la même matière, à jointures rondes, arrondit chaque coin d'un demi-trait. */
const face = (a: V[], fill: string, round = 1.3) =>
  `<polygon points="${pts(a)}" fill="${fill}" stroke="${fill}" stroke-width="${round}" stroke-linejoin="round"/>`;
const seg = (a: V, b: V, stroke: string, w = 1, more = '') =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${more ? ' ' + more : ''}/>`;

/** Décalque sur le plan horizontal z : on dessine en (x, y). */
const onTop = (z: number, inner: string, more = '') => {
  const g = `<g transform="matrix(${K} 0.5 ${-K} 0.5 ${CX} ${f(CY - z)})">${inner}</g>`;
  // une classe animée va sur un groupe extérieur : une transformation CSS remplacerait la matrice de projection
  return more ? `<g ${more}>${g}</g>` : g;
};
/** Décalque sur un plan vertical de face +y (face gauche), à y0 : on dessine en (x, z), z vers le haut. */
const onFront = (y0: number, inner: string) => `<g transform="matrix(${K} 0.5 0 -1 ${f(CX - K * y0)} ${f(CY + 0.5 * y0)})">${inner}</g>`;
/** Décalque sur un plan vertical de face +x (face droite), à x0 : on dessine en (y, z), z vers le haut. */
const onSide = (x0: number, inner: string) => `<g transform="matrix(${-K} 0.5 0 -1 ${f(CX + K * x0)} ${f(CY + 0.5 * x0)})">${inner}</g>`;

/* ---------- matières ---------- */
interface Mat {
  t: string;
  l: string;
  r: string;
  edge?: string;
}

const RAW = {
  blue: { t: '#3b63e2', l: ['#2a51d3', '#1a3cbf'], r: ['#172f9e', '#0f2178'] },
  navy: { t: '#24337f', l: ['#18256a', '#121c55'], r: ['#0f1848', '#0a1135'] },
  orange: { t: '#f39042', l: ['#ec7f2e', '#dc6a1d'], r: ['#c95e17', '#a94c10'] },
  paper: { t: '#fbf9f2', l: ['#ebe6d7', '#ddd6c3'], r: ['#d5cdb8', '#c2b9a1'] },
  sand: { t: '#ecd9b3', l: ['#dcc497', '#cbb27f'], r: ['#c0a774', '#a99060'] },
  mint: { t: '#a5e0d0', l: ['#86cdb9', '#6fbaa5'], r: ['#63ab97', '#4f917e'] },
  slab: { t: '', l: ['#2e56d8', '#1c3dc0'], r: ['#1a309f', '#101f6e'] },
} as const;

type MatName = keyof typeof RAW;

const defs = (id: string) => {
  const lin = (name: string, a: string, b: string) =>
    `<linearGradient id="${id}-${name}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const faces = (Object.keys(RAW) as MatName[]).map((m) => lin(`${m}L`, RAW[m].l[0], RAW[m].l[1]) + lin(`${m}R`, RAW[m].r[0], RAW[m].r[1])).join('');
  // côtés de cylindres : clair à gauche (côté lumière), sombre à droite
  const cyls = (['blue', 'orange', 'paper', 'navy'] as MatName[])
    .map(
      (m) =>
        `<linearGradient id="${id}-${m}C" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${RAW[m].l[0]}"/><stop offset="0.55" stop-color="${RAW[m].l[1]}"/><stop offset="1" stop-color="${RAW[m].r[1]}"/></linearGradient>`,
    )
    .join('');
  // sphères : reflet en haut à gauche
  const sph = (name: string, hi: string, mid: string, lo: string) =>
    `<radialGradient id="${id}-${name}" cx="0.34" cy="0.3" r="0.75"><stop offset="0" stop-color="${hi}"/><stop offset="0.55" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></radialGradient>`;
  return (
    `<defs>${faces}${cyls}` +
    `<radialGradient id="${id}-slabT" cx="0.25" cy="0.2" r="1"><stop offset="0" stop-color="#fdfcf7"/><stop offset="1" stop-color="#e8e3d3"/></radialGradient>` +
    sph('sphSand', '#fbeccd', '#e5cfa4', '#c6ab7c') +
    sph('sphOrange', '#ffc08a', '#f08a3a', '#c95e17') +
    sph('sphMint', '#d9f5ec', '#9edccb', '#5fa892') +
    // ombres floues sans filtre : un dégradé radial qui s'éteint vers le bord (sur la dalle, puis sur le fond de la section)
    `<radialGradient id="${id}-ao"><stop offset="0" stop-color="#0b1a4a" stop-opacity="0.34"/><stop offset="0.55" stop-color="#0b1a4a" stop-opacity="0.14"/><stop offset="1" stop-color="#0b1a4a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}-ground"><stop offset="0" stop-color="#020822" stop-opacity="0.6"/><stop offset="0.6" stop-color="#020822" stop-opacity="0.22"/><stop offset="1" stop-color="#020822" stop-opacity="0"/></radialGradient>` +
    `</defs>`
  );
};

const mat = (id: string, m: MatName): Mat => ({
  t: RAW[m].t,
  l: `url(#${id}-${m}L)`,
  r: `url(#${id}-${m}R)`,
  edge: m === 'navy' ? 'rgb(255 255 255 / 0.25)' : 'rgb(255 255 255 / 0.7)',
});

/** Boîte : face gauche (+y), face droite (+x), dessus, et l'arête éclairée des bords avant du dessus. */
const box = (x: number, y: number, z: number, w: number, d: number, h: number, c: Mat, edges = true, round = 1.3) =>
  face([P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)], c.l, round) +
  face([P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)], c.r, round) +
  face([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c.t, round) +
  (edges && c.edge ? seg(P(x, y + d, z + h), P(x + w, y + d, z + h), c.edge, 0.7) + seg(P(x + w, y, z + h), P(x + w, y + d, z + h), c.edge, 0.5) : '');

/** Cylindre debout (rayon r au sol), côté en dégradé horizontal. */
const cyl = (x: number, y: number, z: number, r: number, h: number, top: string, side: string) => {
  const [cx, cy] = P(x, y, z);
  const rx = r * 1.2247;
  const ry = r * 0.7071;
  const ty = cy - h;
  return (
    `<path d="M${f(cx - rx)} ${f(ty)}V${f(cy)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)}V${f(ty)}Z" fill="${side}"/>` +
    `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx)}" ry="${f(ry)}" fill="${top}"/>`
  );
};

const sphere = (x: number, y: number, z: number, r: number, fill: string) => {
  const [cx, cy] = P(x, y, z);
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}"/>`;
};

/* Les ombres de contact utilisent le dégradé radial « -ao » de la scène : l'identifiant courant est posé par la scène (setScene). */
let SCENE = '';
const setScene = (id: string) => (SCENE = id);

/** Ombre de contact douce et floue sur un plan horizontal (décalée vers l'avant : lumière en haut à gauche). */
const ao = (z: number, x: number, y: number, rx: number, ry: number, k = 1, more = '') =>
  onTop(z, `<ellipse cx="${f(x + 1.5)}" cy="${f(y + 1.5)}" rx="${f(rx * 1.5)}" ry="${f(ry * 1.5)}" fill="url(#${SCENE}-ao)" opacity="${f(Math.min(1, k))}"/>`, more);

/** Ombre floue sous une boîte : une ellipse qui couvre son emprise, plus large qu'elle. */
const aoRect = (z: number, x: number, y: number, w: number, d: number, k = 1, more = '') =>
  onTop(z, `<ellipse cx="${f(x + w / 2 + 1.5)}" cy="${f(y + d / 2 + 1.5)}" rx="${f(w * 0.72 + 3)}" ry="${f(d * 0.72 + 3)}" fill="url(#${SCENE}-ao)" opacity="${f(Math.min(1, k))}"/>`, more);

/* ---------- le socle ---------- */
const TOP = 14;

const socle = (id: string) =>
  // ombre portée sur le fond de la section, une semelle marine, puis la dalle (dessus papier éclairé en haut à gauche, côtés bleu klein)
  `<ellipse cx="${CX}" cy="${f(CY + 100)}" rx="104" ry="17" fill="url(#${id}-ground)"/>` +
  box(-3, -3, 0, 106, 106, 4, mat(id, 'navy'), false, 3) +
  box(0, 0, 4, 100, 100, 10, { t: `url(#${id}-slabT)`, l: `url(#${id}-slabL)`, r: `url(#${id}-slabR)`, edge: 'rgb(255 255 255 / 0.85)' }, true, 2.4) +
  // une trame très légère sur la dalle : la table de travail
  onTop(TOP, [20, 40, 60, 80].map((k) => `<path d="M${k} 3V97M3 ${k}H97" stroke="#b9c5e6" stroke-width="0.35" opacity="0.7"/>`).join(''));

const wrap = (id: string, inner: string) => `<svg class="iso" viewBox="30 -10 200 176" focusable="false" aria-hidden="true">${defs(id)}${inner}</svg>`;

/* ======================================================================================================================================
   1. Comprendre
   ====================================================================================================================================== */
const comprendre = () => {
  const id = 'isoA';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  const person = (x: number, y: number, body: 'blue' | 'orange') =>
    ao(TOP, x, y, 8, 8) + cyl(x, y, TOP, 6.5, 19, RAW[body].t, `url(#${id}-${body}C)`) + sphere(x, y, TOP + 27, 6.2, `url(#${id}-sphSand)`);
  // une fiche « besoin » qui se pose sur la table, avec ses petits traits de texte
  const card = (x: number, y: number, mt: MatName, line: string) =>
    box(x, y, TOP + 6.1, 14, 10, 1.4, m(mt)) +
    onTop(TOP + 7.5, `<rect x="${x + 2.5}" y="${y + 3}" width="8" height="1.6" rx="0.8" fill="${line}"/><rect x="${x + 2.5}" y="${y + 6}" width="5" height="1.6" rx="0.8" fill="${line}" opacity="0.7"/>`);
  // bulle de dialogue (face gauche, debout), avec sa queue vers la personne qui parle
  const bubble = (y0: number, x0: number, z0: number, w: number, lines: string, delay: string) =>
    `<g class="iso-float" style="--d:${delay}">` +
    onFront(
      y0,
      `<path d="M${x0 + 4} ${z0}h${w - 8}a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H${x0 + 12}l-6 6v-6h-2a4 4 0 0 1-4-4V${z0 + 4}a4 4 0 0 1 4-4z" fill="#fbf9f2"/>` + lines,
    ) +
    `</g>`;

  return wrap(
    id,
    socle(id) +
      // le cercle d'écoute au sol, et son onde qui s'élargit
      onTop(TOP, `<circle cx="50" cy="50" r="40" fill="none" stroke="#a9bde8" stroke-width="1.1" stroke-dasharray="2.5 3.5"/>`) +
      onTop(TOP, `<circle cx="50" cy="50" r="22" fill="none" stroke="#7f95cf" stroke-width="1.2"/>`, 'class="iso-pulse"') +
      // la table basse au centre
      ao(TOP, 50, 50, 18, 14, 0.9) +
      cyl(50, 50, TOP, 3, 4.5, RAW.paper.t, `url(#${id}-paperC)`) +
      box(36, 40, TOP + 4.5, 28, 20, 1.6, m('paper')) +
      // les fiches de besoins, qui se posent une à une
      `<g class="iso-drop" style="--d:0s">${card(38, 42, 'sand', '#8d7650')}</g>` +
      `<g class="iso-drop" style="--d:1.2s">${card(48, 46, 'mint', '#3f7e6c')}</g>` +
      // le concepteur (orange), au fond, et sa bulle (il écoute, il relance)
      person(76, 22, 'orange') +
      bubble(8, 56, 52, 30, `<circle cx="64" cy="63" r="2" fill="#ee8532"/><circle cx="70" cy="63" r="2" fill="#ee8532" opacity="0.6"/><circle cx="76" cy="63" r="2" fill="#ee8532" opacity="0.35"/>`, '-1.4s') +
      // la cliente (bleu), devant, et sa bulle (ce dont elle a besoin)
      bubble(
        62,
        2,
        48,
        40,
        `<rect x="8" y="58" width="8" height="8" rx="2" fill="#3b63e2"/><rect x="20" y="62" width="16" height="2.4" rx="1.2" fill="#a9bde8"/><rect x="20" y="58" width="11" height="2.4" rx="1.2" fill="#a9bde8" opacity="0.7"/>`,
        '0s',
      ) +
      person(22, 76, 'blue'),
  );
};

/* ======================================================================================================================================
   2. Cadrer
   ====================================================================================================================================== */
const cadrer = () => {
  const id = 'isoB';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  // une ligne du devis : case, libellé, montant ; la coche apparaît à son tour (iso-check, décalée par --d)
  const row = (y: number, w: number, d: string) =>
    `<rect x="16" y="${y}" width="7" height="7" rx="1.6" fill="#e8edf8" stroke="#a9bde8" stroke-width="0.6"/>` +
    `<g class="iso-check" style="--d:${d}"><rect x="16" y="${y}" width="7" height="7" rx="1.6" fill="#ee8532"/><path d="M17.8 ${y + 3.6}l1.6 1.8 2.8-3.8" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></g>` +
    `<rect x="27" y="${y + 1}" width="${w}" height="2" rx="1" fill="#7f95cf"/><rect x="27" y="${y + 4.4}" width="${f(w * 0.6)}" height="1.5" rx="0.75" fill="#c8d3ee"/>` +
    `<rect x="52" y="${y + 1.5}" width="7" height="2" rx="1" fill="#24337f" opacity="0.75"/>`;
  return wrap(
    id,
    socle(id) +
      // le devis, posé à plat (deux feuilles : une liasse)
      aoRect(TOP, 8, 12, 56, 76, 0.9) +
      box(8, 12, TOP, 56, 76, 1.2, m('paper')) +
      box(9, 13, TOP + 1.2, 54, 74, 1.2, m('paper')) +
      onTop(
        TOP + 2.4,
        `<rect x="14" y="18" width="20" height="3" rx="1.5" fill="#24337f"/><rect x="14" y="24" width="12" height="1.6" rx="0.8" fill="#a9bde8"/>` +
          `<circle cx="56" cy="20" r="3.4" fill="#ee8532"/>` +
          row(32, 18, '0s') +
          row(44, 14, '0.7s') +
          row(56, 20, '1.4s') +
          `<path d="M14 69H60" stroke="#ddd6c3" stroke-width="0.8"/><rect x="14" y="72" width="10" height="2.4" rx="1.2" fill="#24337f"/><rect x="46" y="71.5" width="14" height="3.4" rx="1.2" fill="#24337f"/>` +
          // la signature, tracée en boucle
          `<path class="iso-sign" pathLength="1" d="M15 82c3-4 5 3 8-1s4-3 6 0 3 2 6-2" fill="none" stroke="#ee8532" stroke-width="1.2" stroke-linecap="round"/>`,
      ) +
      // la règle, le long du bord avant
      aoRect(TOP, 10, 90, 52, 5, 0.6) +
      box(10, 90, TOP, 52, 5, 2, m('sand')) +
      onTop(TOP + 2, Array.from({ length: 11 }, (_, i) => `<path d="M${f(12 + i * 4.8)} 90.5v${i % 2 ? 1.6 : 2.6}" stroke="#7a6847" stroke-width="0.45"/>`).join('')) +
      // le calendrier : un bloc, une grille de jours, la date de livraison en orange
      aoRect(TOP, 70, 12, 22, 22) +
      box(70, 12, TOP, 22, 22, 9, m('paper')) +
      box(70, 12, TOP + 9, 22, 6, 2, m('blue')) +
      onTop(
        TOP + 9,
        Array.from({ length: 12 }, (_, i) => {
          const cx = 73 + (i % 4) * 4.6;
          const cy = 20.5 + Math.floor(i / 4) * 4.4;
          return i === 10
            ? `<rect class="iso-blink" x="${f(cx - 0.4)}" y="${f(cy - 0.4)}" width="3.6" height="3.6" rx="0.8" fill="#ee8532"/>`
            : `<rect x="${f(cx)}" y="${f(cy)}" width="2.8" height="2.8" rx="0.6" fill="${i < 6 ? '#c8d3ee' : '#e3e8f5'}"/>`;
        }).join(''),
      ) +
      onSide(92, `<rect x="15" y="${TOP + 3}" width="14" height="2" rx="1" fill="#ffffff" opacity="0.35"/>`) +
      // le périmètre : trois blocs empilés, le dernier se pose en boucle
      aoRect(TOP, 70, 56, 18, 18) +
      box(70, 56, TOP, 18, 18, 11, m('blue')) +
      box(72, 58, TOP + 11, 14, 14, 8, m('mint')) +
      `<g class="iso-stack">${box(74, 60, TOP + 19, 10, 10, 7, m('orange'))}</g>`,
  );
};

/* ======================================================================================================================================
   3. Concevoir
   ====================================================================================================================================== */
const concevoir = () => {
  const id = 'isoC';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  const L = 14;
  const S = 72;
  const layer = (z: number, mt: MatName, inner: string, cls: string) => `<g class="${cls}">` + box(L, L, z, S, S, 2.4, m(mt)) + onTop(z + 2.4, inner) + `</g>`;
  // repères de construction aux coins : la vue éclatée
  const guide = (x: number, y: number) => seg(P(x, y, TOP), P(x, y, 70), '#7f95cf', 0.6, 'stroke-dasharray="2 2.5" opacity="0.7"');
  return wrap(
    id,
    socle(id) +
      onTop(TOP, `<rect x="${L}" y="${L}" width="${S}" height="${S}" rx="1" fill="none" stroke="#7f95cf" stroke-width="0.7" stroke-dasharray="3 2.5"/>`) +
      aoRect(TOP, L, L, S, S, 0.8, 'class="iso-ghost"') +
      guide(L, L) +
      guide(L + S, L) +
      guide(L, L + S) +
      // 1. le fil de fer (sable) : zones, titres, blocs
      layer(
        TOP + 6,
        'sand',
        `<g fill="none" stroke="#7a6847" stroke-width="0.6" opacity="0.85"><rect x="20" y="20" width="60" height="9" rx="1"/><rect x="20" y="33" width="26" height="22" rx="1"/><path d="M20 33l26 22M46 33L20 55"/><rect x="50" y="33" width="30" height="4"/><rect x="50" y="40" width="22" height="3"/><rect x="50" y="48" width="14" height="6" rx="3"/><rect x="20" y="60" width="18" height="18" rx="1"/><rect x="41" y="60" width="18" height="18" rx="1"/><rect x="62" y="60" width="18" height="18" rx="1"/></g>`,
        'iso-layer iso-l1',
      ) +
      // 2. les composants (menthe) : boutons, cartes, couleurs
      layer(
        TOP + 20,
        'mint',
        `<rect x="20" y="20" width="60" height="9" rx="2" fill="#ffffff" opacity="0.55"/><path d="M20 55V43a13 13 0 0 1 26 0v12z" fill="#3b63e2"/><rect x="50" y="33" width="30" height="4" rx="2" fill="#ffffff" opacity="0.85"/><rect x="50" y="40" width="22" height="3" rx="1.5" fill="#ffffff" opacity="0.6"/><rect x="50" y="48" width="16" height="6.5" rx="3.25" fill="#ee8532"/><rect x="20" y="60" width="18" height="18" rx="2.5" fill="#ffffff" opacity="0.7"/><rect x="41" y="60" width="18" height="18" rx="2.5" fill="#ffffff" opacity="0.7"/><rect x="62" y="60" width="18" height="18" rx="2.5" fill="#ffffff" opacity="0.7"/>`,
        'iso-layer iso-l2',
      ) +
      // 3. la maquette finie (papier)
      layer(
        TOP + 34,
        'paper',
        `<rect x="20" y="20" width="60" height="9" rx="2" fill="#24337f"/><circle cx="25" cy="24.5" r="1.6" fill="#ee8532"/><rect x="58" y="23.5" width="17" height="2" rx="1" fill="#a9bde8"/>` +
          `<rect x="20" y="33" width="26" height="22" rx="2.5" fill="#ecd9b3"/><path d="M20 55V45a13 13 0 0 1 13-13h3v23z" fill="#3b63e2"/><circle cx="40" cy="39" r="4" fill="#ee8532"/>` +
          `<rect x="50" y="33" width="30" height="4" rx="2" fill="#24337f"/><rect x="50" y="40" width="22" height="3" rx="1.5" fill="#a9bde8"/><rect x="50" y="48" width="16" height="6.5" rx="3.25" fill="#3b63e2"/>` +
          `<rect x="20" y="60" width="18" height="18" rx="2.5" fill="#e8edf8"/><rect x="41" y="60" width="18" height="18" rx="2.5" fill="#e8edf8"/><rect x="62" y="60" width="18" height="18" rx="2.5" fill="#e8edf8"/>` +
          `<rect x="23" y="70" width="12" height="2" rx="1" fill="#7f95cf"/><rect x="44" y="70" width="12" height="2" rx="1" fill="#7f95cf"/><rect x="65" y="70" width="12" height="2" rx="1" fill="#7f95cf"/>`,
        'iso-layer iso-l3',
      ) +
      guide(L + S, L + S) +
      // le curseur, qui vient cliquer sur le bouton de la maquette (onde orange au clic) ; il suit le calque du haut
      `<g class="iso-layer iso-l3"><g class="iso-cursor">` +
      onTop(TOP + 36.4, `<circle class="iso-click" cx="58" cy="51" r="6" fill="none" stroke="#ee8532" stroke-width="1.2"/>`) +
      (() => {
        const [cx, cy] = P(60, 53, TOP + 44);
        return `<path d="M${f(cx)} ${f(cy)}l0 13 3.4-3.2 2.4 5.4 2.6-1.2-2.4-5.2 4.8-.4z" fill="#0b1a4a" stroke="#ffffff" stroke-width="1.1" stroke-linejoin="round"/>`;
      })() +
      `</g></g>`,
  );
};

/* ======================================================================================================================================
   4. Réaliser
   ====================================================================================================================================== */
const realiser = () => {
  const id = 'isoD';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  return wrap(
    id,
    socle(id) +
      // le signal « en ligne » : un disque orange au sol, et son onde
      onTop(TOP, `<circle cx="80" cy="24" r="12" fill="#ee8532" opacity="0.18"/>`) +
      onTop(TOP, `<circle cx="80" cy="24" r="12" fill="none" stroke="#ee8532" stroke-width="1"/>`, 'class="iso-pulse"') +
      ao(TOP, 80, 24, 4, 4) +
      cyl(80, 24, TOP, 4.5, 2.2, RAW.orange.t, `url(#${id}-orangeC)`) +
      // le mât et le drapeau
      cyl(80, 24, TOP + 2.2, 0.9, 40, RAW.paper.t, `url(#${id}-paperC)`) +
      sphere(80, 24, TOP + 43.5, 1.8, `url(#${id}-sphOrange)`) +
      // le drapeau d'arrivée, à damier : 6 × 4 cases sur le plan du mât (x = 80), découpées par un bord ondulé
      `<g class="iso-flag">` +
      onSide(
        80,
        `<clipPath id="${id}-flag"><path d="M24 ${TOP + 41}C30 ${TOP + 43} 36 ${TOP + 39} 42 ${TOP + 41.5}V${TOP + 29.5}C36 ${TOP + 27} 30 ${TOP + 31} 24 ${TOP + 29}Z"/></clipPath>` +
          `<g clip-path="url(#${id}-flag)"><rect x="24" y="${TOP + 27}" width="18" height="17" fill="#fbf9f2"/>` +
          Array.from({ length: 24 }, (_, k) => {
            const i = k % 6;
            const j = Math.floor(k / 6);
            return (i + j) % 2 ? '' : `<rect x="${24 + i * 3}" y="${TOP + 27.5 + j * 3.5}" width="3" height="3.5" fill="#0b1a4a"/>`;
          }).join('') +
          `</g>`,
      ) +
      `</g>` +
      // l'ordinateur : un écran debout (face gauche) sur son pied
      aoRect(TOP, 10, 44, 58, 8, 1) +
      box(34, 48, TOP, 10, 6, 1.6, m('navy')) +
      box(37.5, 49.5, TOP + 1.6, 3, 2, 10, m('navy')) +
      box(10, 44, TOP + 11, 58, 4, 40, m('navy')) +
      onFront(
        48,
        `<rect x="12" y="${TOP + 13}" width="54" height="36" rx="2.4" fill="#fbf9f2"/>` +
          `<path d="M12 ${TOP + 44}h54v2.6a2.4 2.4 0 0 1-2.4 2.4H14.4a2.4 2.4 0 0 1-2.4-2.4z" fill="#e8edf8"/><circle cx="15.5" cy="${TOP + 46.5}" r="1.1" fill="#ee8532"/><circle cx="19.5" cy="${TOP + 46.5}" r="1.1" fill="#a9bde8"/><circle cx="23.5" cy="${TOP + 46.5}" r="1.1" fill="#a9bde8"/>` +
          // la barre de mise en ligne, qui se remplit
          `<rect x="28" y="${TOP + 45.6}" width="34" height="1.8" rx="0.9" fill="#c8d3ee"/><rect class="iso-progress" x="28" y="${TOP + 45.6}" width="34" height="1.8" rx="0.9" fill="#3b63e2"/>` +
          `<path d="M16 ${TOP + 17}V${TOP + 31}a11 11 0 0 1 22 0V${TOP + 17}z" fill="#3b63e2"/><circle cx="33" cy="${TOP + 33}" r="4.4" fill="#ee8532"/>` +
          `<rect x="42" y="${TOP + 37}" width="20" height="3" rx="1.5" fill="#24337f"/><rect x="42" y="${TOP + 31.5}" width="14" height="2.4" rx="1.2" fill="#a9bde8"/><rect x="42" y="${TOP + 19}" width="14" height="5" rx="2.5" fill="#3b63e2"/>`,
      ) +
      // le téléphone, debout à droite, légèrement devant
      aoRect(TOP, 72, 54, 14, 6, 1) +
      box(72, 56, TOP, 14, 3.5, 27, m('navy')) +
      onFront(
        59.5,
        `<rect x="73.4" y="${TOP + 2}" width="11.2" height="23" rx="2.4" fill="#fbf9f2"/><rect x="76.5" y="${TOP + 23}" width="5" height="0.9" rx="0.45" fill="#24337f"/>` +
          `<path d="M75 ${TOP + 13}V${TOP + 18}a4 4 0 0 1 8 0V${TOP + 13}z" fill="#3b63e2"/><circle cx="81" cy="${TOP + 17}" r="1.8" fill="#ee8532"/><rect x="75" y="${TOP + 9.5}" width="8" height="1.4" rx="0.7" fill="#24337f"/><rect x="75" y="${TOP + 5}" width="8" height="2.6" rx="1.3" fill="#3b63e2"/>`,
      ) +
      // la validation : une pastille menthe cochée qui flotte au-dessus de l'écran
      `<g class="iso-float" style="--d:-0.8s">` +
      (() => {
        const [cx, cy] = P(26, 46, TOP + 62);
        return `<circle cx="${f(cx)}" cy="${f(cy)}" r="7.5" fill="url(#${id}-sphMint)"/><path d="M${f(cx - 3.2)} ${f(cy + 0.2)}l2.2 2.4 4.2-5" fill="none" stroke="#0b1a4a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      })() +
      `</g>`,
  );
};

export const isoScenes = { comprendre: comprendre(), cadrer: cadrer(), concevoir: concevoir(), realiser: realiser() };

/* ======================================================================================================================================
   La démarche de l'audit (page Audit UX/UI) : quatre scènes sur le même socle, mêmes matières et même lumière que celles de la conception.
     5. Cadrage : les pages du site posées à plat, le périmètre de l'audit tracé autour de celles qui comptent, et la cible (les objectifs).
     6. Revue : l'écran examiné, une loupe qui le parcourt, les constats qui s'y épinglent un à un et les captures qui se posent à côté.
     7. Priorisation : la grille effet / effort au sol, trois colonnes rangées par priorité ; la pastille de tête flotte au-dessus de la première.
     8. Restitution : le tableau où les résultats montent, deux personnes devant, le rapport posé, validé.
   ====================================================================================================================================== */
const person = (id: string, x: number, y: number, body: 'blue' | 'orange') =>
  ao(TOP, x, y, 8, 8) + cyl(x, y, TOP, 6.5, 19, RAW[body].t, `url(#${id}-${body}C)`) + sphere(x, y, TOP + 27, 6.2, `url(#${id}-sphSand)`);

const auditCadrage = () => {
  const id = 'isoE';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  // une page du site, à plat : un titre, deux lignes
  const page = (x: number, y: number, mt: MatName, line: string) =>
    aoRect(TOP, x, y, 20, 15, 0.7) +
    box(x, y, TOP, 20, 15, 1.8, m(mt)) +
    onTop(
      TOP + 1.8,
      `<rect x="${x + 3}" y="${y + 3}" width="11" height="2" rx="1" fill="${line}"/><rect x="${x + 3}" y="${y + 7}" width="14" height="1.5" rx="0.75" fill="${line}" opacity="0.55"/><rect x="${x + 3}" y="${y + 10.4}" width="8" height="1.5" rx="0.75" fill="${line}" opacity="0.55"/>`,
    );
  return wrap(
    id,
    socle(id) +
      // les liens entre les pages (l'arborescence)
      onTop(TOP, `<path d="M18 27V36M18 51V60M28 22H52" stroke="#9fb0dc" stroke-width="0.9" stroke-dasharray="2 2" fill="none"/>`) +
      // le périmètre de l'audit, en pointillés orange, autour des deux pages qui comptent
      onTop(TOP, `<rect x="4" y="8" width="30" height="48" rx="3.5" fill="rgb(238 133 50 / 0.1)" stroke="#ee8532" stroke-width="1.1" stroke-dasharray="3 2.2"/>`, 'class="iso-blink"') +
      page(8, 12, 'paper', '#7f95cf') +
      page(8, 38, 'paper', '#7f95cf') +
      page(8, 64, 'sand', '#8d7650') +
      page(52, 14, 'sand', '#8d7650') +
      // la cible : les objectifs, et son onde
      onTop(TOP, `<circle cx="70" cy="62" r="18" fill="none" stroke="#ee8532" stroke-width="1.1"/>`, 'class="iso-pulse"') +
      ao(TOP, 70, 62, 13, 13, 0.9) +
      cyl(70, 62, TOP, 13, 2.2, RAW.paper.t, `url(#${id}-paperC)`) +
      cyl(70, 62, TOP + 2.2, 9, 2.2, RAW.orange.t, `url(#${id}-orangeC)`) +
      cyl(70, 62, TOP + 4.4, 5, 2.2, RAW.paper.t, `url(#${id}-paperC)`) +
      cyl(70, 62, TOP + 6.6, 2, 2.2, RAW.blue.t, `url(#${id}-blueC)`) +
      // la cliente, qui fixe le cap
      person(id, 84, 34, 'blue'),
  );
};

const auditRevue = () => {
  const id = 'isoF';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  // un constat épinglé sur l'écran : un rond orange, qui apparaît à son tour
  const pin = (x: number, z: number, d: string) => `<g class="iso-check" style="--d:${d}"><circle cx="${x}" cy="${z}" r="2.6" fill="#ee8532"/><circle cx="${x}" cy="${z}" r="1" fill="#fff"/></g>`;
  // une capture d'écran qui se pose (fiche à plat)
  const capture = (x: number, y: number, d: string) =>
    `<g class="iso-drop" style="--d:${d}">` +
    box(x, y, TOP, 16, 11, 1.4, m('paper')) +
    onTop(TOP + 1.4, `<rect x="${x + 2}" y="${y + 2}" width="12" height="5" rx="0.8" fill="#dfe5f3"/><circle cx="${x + 11}" cy="${y + 8.6}" r="1.4" fill="#ee8532"/>`) +
    `</g>`;
  return wrap(
    id,
    socle(id) +
      // l'écran examiné, debout sur son pied
      aoRect(TOP, 10, 40, 56, 8, 1) +
      box(32, 46, TOP, 12, 6, 1.6, m('navy')) +
      box(36, 47.5, TOP + 1.6, 4, 2, 9, m('navy')) +
      box(10, 42, TOP + 10, 56, 4, 38, m('navy')) +
      onFront(
        46,
        `<rect x="12" y="${TOP + 12}" width="52" height="34" rx="2.2" fill="#fbf9f2"/>` +
          `<rect x="16" y="${TOP + 39}" width="20" height="3.2" rx="1.6" fill="#24337f"/><rect x="16" y="${TOP + 33}" width="34" height="2.2" rx="1.1" fill="#a9bde8"/><rect x="16" y="${TOP + 28.5}" width="26" height="2.2" rx="1.1" fill="#a9bde8"/>` +
          `<rect x="16" y="${TOP + 16}" width="16" height="7" rx="3.5" fill="#3b63e2"/><rect x="44" y="${TOP + 15}" width="16" height="12" rx="1.6" fill="#dfe5f3"/>` +
          pin(30, TOP + 20, '0s') +
          pin(55, TOP + 37, '1.1s') +
          pin(46, TOP + 24, '2.2s'),
      ) +
      // la loupe, qui parcourt l'écran
      `<g class="iso-scan">` +
      onFront(
        58,
        `<circle cx="30" cy="${TOP + 30}" r="8" fill="rgb(255 255 255 / 0.35)" stroke="#ee8532" stroke-width="2.4"/><path d="M24.5 ${TOP + 24.5}L19 ${TOP + 19}" stroke="#ee8532" stroke-width="3" stroke-linecap="round"/>`,
      ) +
      `</g>` +
      // les captures des constats, qui se posent à côté
      capture(72, 58, '0s') +
      capture(76, 74, '1.3s'),
  );
};

const auditPriorisation = () => {
  const id = 'isoG';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  return wrap(
    id,
    socle(id) +
      // la grille effet / effort, au sol : le quart « fort effet, peu d'effort » est éclairé
      onTop(
        TOP,
        `<rect x="10" y="10" width="38" height="38" rx="2" fill="rgb(166 212 202 / 0.55)"/><rect x="52" y="10" width="38" height="38" rx="2" fill="rgb(127 149 207 / 0.14)"/><rect x="10" y="52" width="38" height="38" rx="2" fill="rgb(127 149 207 / 0.14)"/><rect x="52" y="52" width="38" height="38" rx="2" fill="rgb(127 149 207 / 0.08)"/>` +
          `<path d="M8 92H92M8 92V8" stroke="#7f95cf" stroke-width="1" fill="none"/>`,
      ) +
      // trois colonnes, rangées par priorité
      aoRect(TOP, 20, 20, 14, 14) +
      box(20, 20, TOP, 14, 14, 30, m('blue')) +
      aoRect(TOP, 58, 22, 12, 12) +
      box(58, 22, TOP, 12, 12, 18, m('mint')) +
      aoRect(TOP, 22, 60, 12, 12) +
      box(22, 60, TOP, 12, 12, 11, m('sand')) +
      // la recommandation qui rejoint la tête du classement
      `<g class="iso-stack">${box(23, 23, TOP + 30, 8, 8, 5, m('orange'))}</g>` +
      // la pastille « priorité », qui flotte au-dessus de la première colonne
      `<g class="iso-float" style="--d:-1s">` +
      (() => {
        const [cx, cy] = P(27, 27, TOP + 50);
        return `<circle cx="${f(cx)}" cy="${f(cy)}" r="6.5" fill="url(#${id}-sphOrange)"/><path d="M${f(cx - 2.6)} ${f(cy + 0.4)}l1.8 2 3.6-4.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      })() +
      `</g>` +
      // les fiches restantes, empilées à côté, à traiter ensuite
      aoRect(TOP, 66, 64, 18, 13, 0.7) +
      box(66, 64, TOP, 18, 13, 1.4, m('paper')) +
      box(67, 65, TOP + 1.4, 16, 11, 1.4, m('paper')),
  );
};

const auditRestitution = () => {
  const id = 'isoH';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  // une barre du graphique, qui monte
  const bar = (x: number, h: number, fill: string, d: string) =>
    `<rect class="iso-rise" style="--d:${d}" x="${x}" y="${TOP + 14}" width="6" height="${h}" rx="1" fill="${fill}"/>`;
  return wrap(
    id,
    socle(id) +
      // le tableau de restitution, debout, et ses pieds
      aoRect(TOP, 12, 20, 52, 8, 1) +
      box(16, 23, TOP, 3, 3, 12, m('navy')) +
      box(58, 23, TOP, 3, 3, 12, m('navy')) +
      box(12, 22, TOP + 12, 52, 3, 34, m('paper')) +
      onFront(
        25,
        `<rect x="14" y="${TOP + 14}" width="48" height="30" rx="1.6" fill="#fbf9f2"/>` +
          `<path d="M18 ${TOP + 14}V${TOP + 40}" stroke="#c8d3ee" stroke-width="0.8"/>` +
          bar(22, 8, '#c8d3ee', '0s') +
          bar(31, 13, '#7f95cf', '0.25s') +
          bar(40, 19, '#3b63e2', '0.5s') +
          bar(49, 24, '#ee8532', '0.75s') +
          `<rect x="22" y="${TOP + 39}" width="18" height="2.4" rx="1.2" fill="#24337f"/>`,
      ) +
      // le concepteur et la cliente, devant
      person(id, 30, 70, 'orange') +
      person(id, 62, 76, 'blue') +
      // le rapport, posé sur une table basse, et sa pastille validée
      ao(TOP, 82, 46, 10, 9, 0.8) +
      cyl(82, 46, TOP, 2.6, 5, RAW.paper.t, `url(#${id}-paperC)`) +
      box(73, 38, TOP + 5, 18, 16, 1.6, m('paper')) +
      box(75, 40, TOP + 6.6, 14, 12, 2.4, m('blue')) +
      `<g class="iso-float" style="--d:-0.6s">` +
      (() => {
        const [cx, cy] = P(82, 46, TOP + 24);
        return `<circle cx="${f(cx)}" cy="${f(cy)}" r="6.5" fill="url(#${id}-sphMint)"/><path d="M${f(cx - 2.8)} ${f(cy + 0.2)}l2 2.2 3.8-4.6" fill="none" stroke="#0b1a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      })() +
      `</g>`,
  );
};

export const auditScenes = [auditCadrage(), auditRevue(), auditPriorisation(), auditRestitution()];

/* ======================================================================================================================================
   Les interventions de la page Interfaces et logiciels : cinq scènes sur le même socle, une par intervention (à la carte : elles ne sont pas
   reliées entre elles).
     9. Comprendre l'existant : le logiciel tel qu'il est, une utilisatrice et ses retours, la courbe d'usage qui se trace au sol.
     10. Organiser l'information : l'arborescence des écrans, qui se trace puis se peuple.
     11. Prototyper : deux écrans en fil de fer reliés par le parcours, le curseur qui clique.
     12. Concevoir l'interface : les composants (bouton, interrupteur, carte, nuancier), la carte qui se pose sur la pile.
     13. Accompagner le développement : l'écran de code, le paquet des maquettes et des spécifications qui part vers l'équipe.
   ====================================================================================================================================== */
const ilComprendre = () => {
  const id = 'isoI';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  const bubble = (y0: number, x0: number, z0: number, w: number, lines: string, delay: string) =>
    `<g class="iso-float" style="--d:${delay}">` +
    onFront(y0, `<path d="M${x0 + 4} ${z0}h${w - 8}a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H${x0 + 12}l-6 6v-6h-2a4 4 0 0 1-4-4V${z0 + 4}a4 4 0 0 1 4-4z" fill="#fbf9f2"/>` + lines) +
    `</g>`;
  return wrap(
    id,
    socle(id) +
      // l'écran du logiciel tel qu'il est, au fond
      aoRect(TOP, 40, 10, 50, 6, 1) +
      box(60, 14, TOP, 10, 5, 1.6, m('navy')) +
      box(63.5, 15.5, TOP + 1.6, 3, 2, 8, m('navy')) +
      box(40, 10, TOP + 9, 50, 4, 32, m('navy')) +
      onFront(
        14,
        `<rect x="42" y="${TOP + 11}" width="46" height="28" rx="1.8" fill="#fbf9f2"/><rect x="44" y="${TOP + 13}" width="9" height="24" rx="1.2" fill="#dfe5f3"/>` +
          `<rect x="56" y="${TOP + 31}" width="29" height="4" rx="1" fill="#e8edf8"/><rect x="56" y="${TOP + 25}" width="29" height="4" rx="1" fill="#e8edf8"/><rect x="56" y="${TOP + 19}" width="29" height="4" rx="1" fill="#e8edf8"/>` +
          `<rect x="79" y="${TOP + 26}" width="5" height="2" rx="1" fill="#ee8532"/><rect x="58" y="${TOP + 14}" width="12" height="3" rx="1.5" fill="#3b63e2"/>`,
      ) +
      // la courbe d'usage, au sol, qui se trace
      aoRect(TOP, 46, 56, 40, 30, 0.6) +
      box(46, 56, TOP, 40, 30, 1.4, m('paper')) +
      onTop(
        TOP + 1.4,
        `<path d="M50 80H82M50 80V60" stroke="#c8d3ee" stroke-width="0.7" fill="none"/>` +
          `<path class="iso-sign" pathLength="1" d="M51 78L58 72L64 75L71 66L80 62" fill="none" stroke="#3b63e2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
      ) +
      // l'utilisatrice et ses retours
      person(id, 20, 70, 'blue') +
      bubble(
        58,
        0,
        48,
        34,
        `<rect x="6" y="58" width="22" height="2.4" rx="1.2" fill="#a9bde8"/><rect x="6" y="54" width="14" height="2.4" rx="1.2" fill="#ee8532"/>`,
        '0s',
      ) +
      bubble(40, 8, 62, 26, `<circle cx="14" cy="72" r="2" fill="#ee8532"/><circle cx="20" cy="72" r="2" fill="#ee8532" opacity="0.6"/><circle cx="26" cy="72" r="2" fill="#ee8532" opacity="0.35"/>`, '-1.6s'),
  );
};

const ilOrganiser = () => {
  const id = 'isoJ';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  const node = (x: number, y: number, mt: MatName, h: number, d: string) =>
    `<g class="iso-drop" style="--d:${d}">` + aoRect(TOP, x, y, 16, 16, 0.8) + box(x, y, TOP, 16, 16, h, m(mt)) + `</g>`;
  return wrap(
    id,
    socle(id) +
      // les liens de l'arborescence, qui se tracent
      onTop(TOP, `<path class="iso-sign" pathLength="1" d="M50 30V46M18 46H82M18 46V58M50 46V58M82 46V58" fill="none" stroke="#7f95cf" stroke-width="1.4" stroke-linecap="round"/>`) +
      // l'écran d'accueil, en tête
      aoRect(TOP, 40, 14, 20, 16) +
      box(40, 14, TOP, 20, 16, 12, m('blue')) +
      onTop(TOP + 12, `<rect x="43" y="17" width="9" height="2.4" rx="1.2" fill="#ffffff" opacity="0.8"/><rect x="43" y="21.5" width="13" height="1.8" rx="0.9" fill="#ffffff" opacity="0.5"/>`) +
      // les écrans de second niveau, qui se posent un à un
      node(10, 58, 'paper', 7, '0s') +
      node(42, 58, 'mint', 7, '0.9s') +
      node(74, 58, 'paper', 7, '1.8s') +
      // un troisième niveau, plus discret
      onTop(TOP, `<rect x="44" y="80" width="12" height="10" rx="1.4" fill="none" stroke="#a9bde8" stroke-width="0.8" stroke-dasharray="2 1.6"/><path d="M50 74V80" stroke="#a9bde8" stroke-width="0.8" stroke-dasharray="2 1.6"/>`, 'class="iso-blink"'),
  );
};

const ilPrototyper = () => {
  const id = 'isoK';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  // un écran en fil de fer, à plat
  const wire = (x: number, y: number) =>
    aoRect(TOP, x, y, 34, 26, 0.7) +
    box(x, y, TOP, 34, 26, 1.6, m('paper')) +
    onTop(
      TOP + 1.6,
      `<g fill="none" stroke="#9fb0dc" stroke-width="0.8" stroke-dasharray="2 1.5"><rect x="${x + 3}" y="${y + 3}" width="28" height="5" rx="1"/><rect x="${x + 3}" y="${y + 10}" width="13" height="12" rx="1"/><rect x="${x + 18}" y="${y + 10}" width="13" height="4" rx="1"/></g><path d="M${x + 3} ${y + 10}l13 12M${x + 16} ${y + 10}l-13 12" stroke="#c6d0ea" stroke-width="0.7"/>`,
    );
  return wrap(
    id,
    socle(id) +
      wire(8, 12) +
      wire(56, 58) +
      // le parcours, d'un écran à l'autre, qui se trace
      onTop(TOP, `<path class="iso-sign" pathLength="1" d="M42 30C56 30 62 40 66 56" fill="none" stroke="#ee8532" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1"/><path d="M63.5 52.5l2.5 3.6 3.2-2.8" fill="none" stroke="#ee8532" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`) +
      // le bouton du premier écran, et le curseur qui vient le cliquer (onde orange au clic)
      onTop(TOP + 1.6, `<rect x="26" y="29" width="11" height="4" rx="2" fill="#ee8532"/>`) +
      `<g class="iso-cursor">` +
      onTop(TOP + 1.6, `<circle class="iso-click" cx="31.5" cy="31" r="5" fill="none" stroke="#ee8532" stroke-width="1.1"/>`) +
      (() => {
        const [cx, cy] = P(34, 33, TOP + 7);
        return `<path d="M${f(cx)} ${f(cy)}l0 12 3.2-3 2.2 5 2.4-1.1-2.2-4.8 4.4-.4z" fill="#0b1a4a" stroke="#ffffff" stroke-width="1" stroke-linejoin="round"/>`;
      })() +
      `</g>`,
  );
};

const ilConcevoir = () => {
  const id = 'isoL';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  return wrap(
    id,
    socle(id) +
      // le bouton principal, en relief
      aoRect(TOP, 10, 14, 30, 12, 0.9) +
      box(10, 14, TOP, 30, 12, 5, m('blue')) +
      onTop(TOP + 5, `<rect x="16" y="18.5" width="18" height="3" rx="1.5" fill="#ffffff" opacity="0.85"/>`) +
      // l'interrupteur, qui bascule
      aoRect(TOP, 52, 14, 22, 11, 0.8) +
      box(52, 14, TOP, 22, 11, 3, m('mint')) +
      onTop(TOP + 3, `<rect x="54" y="16" width="18" height="7" rx="3.5" fill="#86cdb9"/>`) +
      `<g class="iso-toggle">` + ao(TOP + 3, 57, 19.5, 3, 3, 0.6) + cyl(57, 19.5, TOP + 3, 3.4, 3, '#ffffff', `url(#${id}-paperC)`) + `</g>` +
      // la carte de contenu, qui se pose sur la pile
      aoRect(TOP, 12, 44, 34, 28, 0.9) +
      box(12, 44, TOP, 34, 28, 1.6, m('paper')) +
      box(13, 45, TOP + 1.6, 32, 26, 1.6, m('paper')) +
      `<g class="iso-stack">` +
      box(14, 46, TOP + 3.2, 30, 24, 1.8, m('paper')) +
      onTop(TOP + 5, `<path d="M17 66V58a8 8 0 0 1 16 0v8z" fill="#3b63e2"/><circle cx="37" cy="52" r="3" fill="#ee8532"/><rect x="17" y="49" width="12" height="2.4" rx="1.2" fill="#24337f"/>`) +
      `</g>` +
      // le nuancier : trois pastilles de couleur
      ao(TOP, 66, 52, 6, 6) +
      cyl(66, 52, TOP, 5, 4, RAW.orange.t, `url(#${id}-orangeC)`) +
      ao(TOP, 78, 62, 6, 6) +
      cyl(78, 62, TOP, 5, 4, RAW.blue.t, `url(#${id}-blueC)`) +
      ao(TOP, 70, 76, 6, 6) +
      cyl(70, 76, TOP, 5, 4, RAW.mint.t, `url(#${id}-paperC)`),
  );
};

const ilAccompagner = () => {
  const id = 'isoM';
  setScene(id);
  const m = (n: MatName) => mat(id, n);
  return wrap(
    id,
    socle(id) +
      // l'écran de code, debout
      aoRect(TOP, 10, 40, 46, 8, 1) +
      box(28, 46, TOP, 10, 6, 1.6, m('navy')) +
      box(31.5, 47.5, TOP + 1.6, 3, 2, 8, m('navy')) +
      box(10, 42, TOP + 9, 46, 4, 32, m('navy')) +
      onFront(
        46,
        `<rect x="12" y="${TOP + 11}" width="42" height="28" rx="1.8" fill="#13247c"/>` +
          `<path d="M16 ${TOP + 32}l-2.4 2.4 2.4 2.4M21 ${TOP + 32}l2.4 2.4-2.4 2.4" stroke="#a6d4ca" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
          `<g class="iso-blink"><rect x="27" y="${TOP + 33.4}" width="16" height="2" rx="1" fill="#f2cf86"/></g><rect x="27" y="${TOP + 28}" width="22" height="2" rx="1" fill="#9fb0dc"/><rect x="16" y="${TOP + 23}" width="28" height="2" rx="1" fill="#9fb0dc"/><rect x="16" y="${TOP + 18}" width="18" height="2" rx="1" fill="#ee8532"/>`,
      ) +
      // le paquet (maquettes et spécifications), qui part vers l'équipe
      `<g class="iso-send">` +
      aoRect(TOP, 58, 28, 14, 12, 0.7) +
      box(58, 28, TOP, 14, 12, 8, m('paper')) +
      box(58, 32.5, TOP, 14, 3, 8.2, m('orange'), false) +
      `</g>` +
      // le développeur, et la pastille validée au-dessus de lui
      person(id, 78, 66, 'orange') +
      `<g class="iso-float" style="--d:-0.8s">` +
      (() => {
        const [cx, cy] = P(78, 66, TOP + 40);
        return `<circle cx="${f(cx)}" cy="${f(cy)}" r="6" fill="url(#${id}-sphMint)"/><path d="M${f(cx - 2.6)} ${f(cy + 0.2)}l1.8 2 3.6-4.2" fill="none" stroke="#0b1a4a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
      })() +
      `</g>`,
  );
};

export const interfaceScenes = [ilComprendre(), ilOrganiser(), ilPrototyper(), ilConcevoir(), ilAccompagner()];
