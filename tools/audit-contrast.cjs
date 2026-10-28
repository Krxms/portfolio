// Audit de contraste sur fonds réels (dégradés, verre, mesh) : pour chaque texte, on échantillonne les pixels
// de la capture « sans texte » dans sa boîte, on compose la couleur du texte (avec son alpha) sur chaque pixel,
// et on retient le contraste du 5e centile le plus défavorable.
// Usage : node tools/audit-contrast.cjs <texts.json> <capture-sans-texte.png>
const sharp = require('sharp');
const fs = require('fs');
const [textsFile, shot] = process.argv.slice(2);
const texts = JSON.parse(fs.readFileSync(textsFile, 'utf8'));

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const parse = (s) => {
  const m = s.match(/rgba?\(([^)]+)\)/); const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
};

(async () => {
  const img = sharp(shot);
  const meta = await img.metadata();
  const raw = await img.removeAlpha().raw().toBuffer();
  const W = meta.width, H = meta.height;
  const rows = [];
  for (const t of texts) {
    const c = parse(t.color);
    const a = c.a * (t.op ?? 1);
    const x0 = Math.max(0, Math.floor(t.x)), y0 = Math.max(0, Math.floor(t.y));
    const x1 = Math.min(W, Math.ceil(t.x + t.w)), y1 = Math.min(H, Math.ceil(t.y + t.h));
    if (x1 - x0 < 2 || y1 - y0 < 2) continue;
    const ratios = [];
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const i = (y * W + x) * 3;
        const bg = [raw[i], raw[i + 1], raw[i + 2]];
        const fg = [c.r * a + bg[0] * (1 - a), c.g * a + bg[1] * (1 - a), c.b * a + bg[2] * (1 - a)];
        const L1 = lum(...fg), L2 = lum(...bg);
        ratios.push((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05));
      }
    }
    if (!ratios.length) continue;
    ratios.sort((p, q) => p - q);
    const worst = ratios[Math.floor(ratios.length * 0.05)];
    const median = ratios[Math.floor(ratios.length * 0.5)];
    const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
    const need = large ? 3 : 4.5;
    rows.push({ ...t, worst: +worst.toFixed(2), median: +median.toFixed(2), need, pass: worst >= need });
  }
  const fails = rows.filter((r) => !r.pass);
  console.log(`textes mesurés : ${rows.length}, sous le seuil : ${fails.length}`);
  for (const r of fails.sort((a, b) => a.worst - b.worst)) {
    console.log(`${r.worst.toFixed(2)} (méd. ${r.median}, requis ${r.need})  ${r.size}px/${r.weight}  ${r.color}  y=${r.y}  ${r.tag}  « ${r.txt} »`);
  }
  const best = rows.filter((r) => r.pass).sort((a, b) => a.worst - b.worst).slice(0, 8);
  console.log('\nles plus justes parmi ceux qui passent :');
  for (const r of best) console.log(`${r.worst.toFixed(2)}  ${r.size}px  y=${r.y}  ${r.tag}  « ${r.txt} »`);
})();
