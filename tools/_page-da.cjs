const fs = require('fs');
const rw = (f, fn) => {
  let s = fs.readFileSync(f, 'utf8');
  const crlf = s.includes('\r\n');
  s = s.replace(/\r\n/g, '\n');
  const rep = (a, b) => {
    if (!s.includes(a)) { console.log('MISSING in', f, ':', a.slice(0, 90)); process.exit(1); }
    s = s.replace(a, b);
  };
  s = fn(s, rep) ?? s;
  fs.writeFileSync(f, s.replace(/\n/g, crlf ? '\r\n' : '\n'));
};

// ---- cartes : l'affiche en haut de chaque carte
rw('src/components/ServiceCards.astro', (s, rep) => {
  rep('      <li class={`card card--${c.tone}`} data-tilt>\n', '      <li class={`card card--${c.tone}`} data-tilt>\n        <div class="card-art" aria-hidden="true"><i class="s s1"></i><i class="s s2"></i><i class="s s3"></i></div>\n');
});

// ---- le canvas de lave devient un fond fixe de toute la page : il sort du hero-zone
rw('src/pages/index.astro', (s, rep) => {
  rep('  <div class="hero-zone">\n    <LavaBackground />\n    <ProgressiveBlur', '  <LavaBackground />\n\n  <div class="hero-zone">\n    <ProgressiveBlur');
});

// ---- Hero : le fond statique n'est qu'un repli, la lave fixe prend le relais
rw('src/components/Hero.css', (s, rep) => {
  s += `
/* Quand la lave de fond tourne, elle fait le fond de la Hero : le mesh statique n'est que le repli */
.lava-on .hero-zone {
  background: none;
}
`;
  return s;
});

// ---- sections : tons variés, verre dépoli seulement sur les sections colorées
rw('src/components/Tile.css', (s, rep) => {
  // fond générique des tuiles sombres (toutes pages) : plus de maillage vert, des dégradés profonds et variés, sans texture
  rep('  background: var(--tile-mesh) center / cover no-repeat, #06151c;', '  background: var(--tile-bg, linear-gradient(180deg, #0a1a58, #0b2170));');
  rep(".tile--mesh-a::before {\n  --tile-mesh: url('../assets/mesh/dark-a.webp');", ".tile--mesh-a::before {\n  --tile-bg:\n    radial-gradient(60% 46% at 82% 14%, rgb(255 140 110 / 0.2), transparent 70%),\n    radial-gradient(60% 46% at 10% 80%, rgb(60 120 255 / 0.24), transparent 72%),\n    linear-gradient(180deg, #121c70 0%, #2a1c70 100%);");
  rep(".tile--mesh-b::before {\n  --tile-mesh: url('../assets/mesh/dark-b.webp');", ".tile--mesh-b::before {\n  --tile-bg:\n    radial-gradient(60% 46% at 85% 16%, rgb(255 196 100 / 0.16), transparent 70%),\n    radial-gradient(60% 46% at 8% 78%, rgb(40 190 170 / 0.24), transparent 72%),\n    linear-gradient(180deg, #08333f 0%, #0a2a5c 100%);");
  rep("  background:\n    var(--grain-soft) 0 0 / 160px 160px repeat,\n    linear-gradient(180deg, rgb(2 12 20 / 0.34), rgb(2 12 20 / 0.26));\n  background-blend-mode: soft-light, normal;\n  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.4), inset 0 -1px 0 rgb(255 255 255 / 0.14);\n}\n\n.dark-zone {", "  background: linear-gradient(180deg, rgb(2 12 20 / 0.2), rgb(2 12 20 / 0.14));\n  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.3), inset 0 -1px 0 rgb(255 255 255 / 0.1);\n}\n\n.dark-zone {");
  // zone sombre finale : un vert-bleu profond (la section identité est indigo), opaque par défaut
  rep("  /* même matière que la section identité : un dégradé marine vers bleu klein, fixe et sans texture */\n  background:\n    radial-gradient(60% 34% at 82% 10%, rgb(46 98 230 / 0.34), transparent 72%),\n    radial-gradient(52% 30% at 8% 58%, rgb(16 130 180 / 0.26), transparent 72%),\n    linear-gradient(180deg, #081742 0%, #0b2170 52%, #0a1a58 100%);\n}", "  /* un vert-bleu profond, fixe et sans texture : il alterne avec l'indigo de la section identité */\n  background:\n    radial-gradient(56% 32% at 84% 12%, rgb(255 190 110 / 0.16), transparent 72%),\n    radial-gradient(52% 30% at 8% 60%, rgb(40 190 170 / 0.24), transparent 72%),\n    linear-gradient(180deg, #08333f 0%, #0a2c58 55%, #082a4c 100%);\n}");
  s += `
/* ---------- Avec la lave de fond (html.lava-on) : les sections colorées passent en verre dépoli ----------
   Elles teintent et floutent les bulles qui défilent derrière ; les sections claires et opaques (la méthode, le pied de page)
   ne laissent rien voir. */
.lava-on .dark-zone::before {
  background:
    radial-gradient(56% 32% at 84% 12%, rgb(255 190 110 / 0.14), transparent 72%),
    radial-gradient(52% 30% at 8% 60%, rgb(40 190 170 / 0.2), transparent 72%),
    linear-gradient(180deg, rgb(8 51 63 / 0.8), rgb(10 44 88 / 0.84));
  -webkit-backdrop-filter: blur(22px) saturate(135%);
  backdrop-filter: blur(22px) saturate(135%);
}

@media (prefers-reduced-transparency: reduce) {
  .lava-on .dark-zone::before {
    background: linear-gradient(180deg, #08333f, #0a2c58);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
`;
  return s;
});

rw('src/components/Manifesto.css', (s, rep) => {
  // section identité : indigo qui tire vers le prune, avec une lueur chaude, plus un verre dépoli quand la lave tourne
  const i = s.indexOf('/* Fond de la section : un dégradé marine vers bleu klein');
  if (i < 0) { console.log('MANIFESTO BG MARKER MISSING'); process.exit(1); }
  const j = s.indexOf('.manifesto > .pblur {', i);
  s = s.slice(0, i) + `/* Fond de la section : un indigo qui tire vers le prune, avec une lueur chaude (corail, ambre) pour ne pas tout plonger dans
   le bleu. Fixe : rien n'y bouge, l'information reste le centre. Opaque par défaut ; avec la lave de fond (html.lava-on),
   c'est un verre dépoli teinté qui laisse deviner les bulles, floutées. */
.manifesto.tile--dark::before {
  background:
    radial-gradient(60% 40% at 84% 90%, rgb(255 140 110 / 0.2), transparent 72%),
    radial-gradient(56% 36% at 10% 12%, rgb(255 196 100 / 0.12), transparent 72%),
    radial-gradient(60% 40% at 12% 78%, rgb(70 120 255 / 0.22), transparent 74%),
    linear-gradient(180deg, #131f76 0%, #2a1c70 100%);
}

.lava-on .manifesto.tile--dark::before {
  background:
    radial-gradient(60% 40% at 84% 90%, rgb(255 140 110 / 0.18), transparent 72%),
    radial-gradient(56% 36% at 10% 12%, rgb(255 196 100 / 0.1), transparent 72%),
    linear-gradient(180deg, rgb(19 31 118 / 0.78), rgb(42 28 112 / 0.82));
  -webkit-backdrop-filter: blur(22px) saturate(135%);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-mask-image: none;
  mask-image: none;
}

` + s.slice(j);
  // ancien masque (dégradé de transparence en haut) : il ne sert plus
  s = s.replace(/@media \(prefers-reduced-transparency: reduce\) \{\n  \.manifesto\.tile--dark::before \{\n    -webkit-mask-image: none;\n    mask-image: none;\n  \}\n\}\n/, '@media (prefers-reduced-transparency: reduce) {\n  .lava-on .manifesto.tile--dark::before {\n    background: linear-gradient(180deg, #131f76, #2a1c70);\n    -webkit-backdrop-filter: none;\n    backdrop-filter: none;\n  }\n}\n');
  return s;
});

console.log('ok');
