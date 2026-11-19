// Scène maîtresse « Vos besoins prennent forme » : un atelier architectural, rendu hors ligne (image statique).
// Lecture de gauche à droite : des volumes bruts (le besoin) -> une structure en cadre (le cadrage) -> des modules alignés sur une grille (l'interface).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const params = new URLSearchParams(location.search);
const VIEW = params.get('view') || 'desktop';
const W = +(params.get('w') || (VIEW === 'mobile' ? 2400 : 3200));
const H = +(params.get('h') || (VIEW === 'mobile' ? 2400 : 2400));

// ---------- palette du site (tokens.css / illustrations) ----------
const C = {
  navy: 0x13247c, blue: 0x2a4cb4, klein: 0x1f45d6, cream: 0xf3efe2, stone: 0xe6e0d2, stoneDark: 0xc9c2b3, limestone: 0xe9e3d4,
  orange: 0xee8532, mint: 0xa6d4ca, yellow: 0xf1c56b, steel: 0x2a3040, grey: 0xc9c5bb,
};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.28;

// ---------- matières : mates, minérales, grain fin ----------
function noiseTex(size = 512, contrast = 1, seed = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + (rnd() - 0.5) * 255 * contrast;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // un flou léger : un grain de plâtre, pas de la neige
  g.filter = 'blur(1.2px)';
  g.drawImage(c, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}
function mottle(size = 512, seed = 5) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  let s = seed * 7919; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  g.fillStyle = '#ececec'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 160; i++) {
    const x = rnd() * size, y = rnd() * size, r = 40 + rnd() * 140, v = 200 + rnd() * 55;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${v},${v},${v},0.55)`); gr.addColorStop(1, 'rgba(236,236,236,0)');
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.5, 1.5);
  return t;
}
const mott = mottle();
const grain = noiseTex(512, 0.9, 3);
const grainFine = noiseTex(512, 0.6, 7);

function mat(color, { rough = 0.92, metal = 0, bump = 0.5, tex = grain } = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, bumpMap: tex, bumpScale: bump, roughnessMap: tex, map: mott });
}
const M = {
  blue: mat(C.blue, { bump: 0.9 }),
  navy: mat(C.navy, { bump: 0.7 }),
  klein: mat(C.klein, { bump: 0.6 }),
  cream: mat(C.cream, { bump: 0.5 }),
  limestone: mat(C.limestone, { bump: 1.0 }),
  stone: mat(C.stone, { bump: 1.1 }),
  stoneDark: mat(C.stoneDark, { bump: 1.2 }),
  orange: mat(C.orange, { bump: 0.5, rough: 0.8 }),
  mint: mat(C.mint, { bump: 0.5 }),
  yellow: mat(C.yellow, { bump: 0.5 }),
  grey: mat(C.grey, { bump: 1.4 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x4a5368, roughness: 0.38, metalness: 0.7, bumpMap: grainFine, bumpScale: 0.2 }),
};

const group = new THREE.Group();
scene.add(group);

function add(mesh, x = 0, y = 0, z = 0, ry = 0) {
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}
const box = (w, h, d, m, r = 0.025) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);

// mur percé d'ouvertures rectangulaires (les cadres d'une interface)
function wall(w, h, t, holes, m) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.lineTo(-w / 2, 0);
  holes.forEach((o) => {
    const p = new THREE.Path();
    p.moveTo(o.x - o.w / 2, o.y); p.lineTo(o.x - o.w / 2, o.y + o.h); p.lineTo(o.x + o.w / 2, o.y + o.h); p.lineTo(o.x + o.w / 2, o.y); p.lineTo(o.x - o.w / 2, o.y);
    s.holes.push(p);
  });
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 2, curveSegments: 4 });
  g.translate(0, 0, -t / 2);
  return new THREE.Mesh(g, m);
}

// ---------- 1. socle : deux dalles ----------
add(box(11.4, 0.5, 7.8, M.stone, 0.04), 0.3, -0.25, 0.2);
add(box(12.6, 0.32, 9.0, M.stoneDark, 0.04), 0.3, -0.66, 0.2);

// ---------- 2. parois ----------
// paroi du fond, bleu profond, trois ouvertures de tailles différentes (une grille d'interface)
const wallA = wall(8.0, 4.4, 0.55, [
  { x: -2.4, y: 1.3, w: 2.6, h: 2.1 },
  { x: -0.25, y: 0.5, w: 0.95, h: 3.0 },
  { x: 1.5, y: 2.3, w: 1.6, h: 1.3 },
], M.blue);
add(wallA, -0.4, 0, -3.1);
// un fond clair derrière la paroi : les ouvertures montrent une profondeur, pas le vide
add(box(7.6, 4.0, 0.3, M.limestone, 0.03), -0.4, 2.0, -3.95);
// dans les ouvertures : des modules encastrés (le contenu qui se met en place)
add(box(2.3, 1.8, 0.16, M.mint, 0.03), -2.4, 2.2, -3.68);
add(box(0.75, 2.4, 0.14, M.cream, 0.03), -0.25, 2.0, -3.74);
add(box(1.3, 0.95, 0.16, M.cream, 0.03), 1.5, 2.95, -3.76);

// paroi de droite, calcaire clair, une fente horizontale et un petit jour
const wallB = wall(5.4, 3.1, 0.5, [{ x: 0.2, y: 1.5, w: 3.4, h: 0.45 }, { x: -1.8, y: 0.5, w: 0.9, h: 0.45 }], M.limestone);
add(wallB, 5.1, 0, -0.7, -Math.PI / 2);

// ---------- 3. le besoin : volumes bruts, à gauche (ni alignés, ni finis) ----------
add(box(1.4, 1.0, 1.1, M.grey, 0.06), -4.1, 0.5, 0.9, 0.4);
add(box(0.9, 1.5, 0.9, M.grey, 0.06), -3.0, 0.75, 1.9, -0.3);
add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 32), M.stoneDark), -4.2, 0.55, 2.5);

// ---------- 4. le cadrage : une structure en barres d'acier ----------
function frameBox(w, h, d, tb, m) {
  const g = new THREE.Group();
  const bar = (x, y, z, sx, sy, sz) => {
    const b = box(sx, sy, sz, m, 0.012);
    b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; g.add(b);
  };
  [-1, 1].forEach((ix) => [-1, 1].forEach((iz) => bar(ix * w / 2, h / 2, iz * d / 2, tb, h, tb))); // montants
  [0, 1].forEach((iy) => {
    [-1, 1].forEach((iz) => bar(0, iy * h, iz * d / 2, w, tb, tb));
    [-1, 1].forEach((ix) => bar(ix * w / 2, iy * h, 0, tb, tb, d));
  });
  return g;
}
const fb = frameBox(2.8, 2.5, 2.2, 0.1, M.steel);
fb.position.set(-0.5, 0, 0.5); group.add(fb);
// dans le cadre : deux dalles posées de biais (la forme qui commence à se dessiner)
add(box(1.7, 0.16, 1.5, M.cream, 0.03), -0.5, 0.7, 0.5, 0.25);
add(box(1.0, 0.16, 1.0, M.klein, 0.03), -0.5, 1.45, 0.5, 0.5);
// un volume cylindrique crème, entre le besoin et la paroi
add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 64), M.cream), -2.1, 0.7, -1.5);

// ---------- 5. l'interface : modules alignés sur une grille, à droite ----------
const tiles = [
  { c: M.cream, h: 0.2 }, { c: M.klein, h: 0.5 }, { c: M.cream, h: 0.2 },
  { c: M.cream, h: 0.36 }, { c: M.mint, h: 0.2 }, { c: M.orange, h: 0.62 },
];
tiles.forEach((tl, i) => {
  const cx = i % 3, cz = Math.floor(i / 3);
  add(box(0.92, tl.h, 0.92, tl.c, 0.025), 1.9 + cx * 1.02, tl.h / 2, -1.6 + cz * 1.02);
});
// une dalle d'interface suspendue au-dessus de la grille, avec des barres en relief (suggestion de texte et de bouton)
add(box(0.1, 1.0, 0.1, M.steel, 0.01), 1.5, 0.5, -1.05);
add(box(0.1, 1.0, 0.1, M.steel, 0.01), 4.35, 0.5, -1.05);
add(box(3.1, 0.12, 0.95, M.cream, 0.02), 2.95, 1.06, -1.05);
add(box(1.7, 0.04, 0.1, M.steel, 0.01), 2.4, 1.14, -1.2);
add(box(1.1, 0.04, 0.1, M.steel, 0.01), 2.1, 1.14, -0.95);
add(box(0.55, 0.06, 0.26, M.klein, 0.03), 3.85, 1.14, -0.9);

// ---------- 6. pièces sculpturales : les formes du logo, en volume ----------
// l'arche : un demi-disque extrudé, crème, devant la paroi
(function arch() {
  const r = 0.95, h = 3.1;
  const s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(-r, h - r); s.absarc(0, h - r, r, Math.PI, 0, true); s.lineTo(r, 0); s.lineTo(-r, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 48 });
  g.translate(0, 0, -0.45);
  add(new THREE.Mesh(g, M.cream), 0.85, 0, -2.4, -0.12);
})();
// le disque orange, debout sur sa tranche, comme une pièce de jeu d'architecte
const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.18, 96), M.orange);
add(disc, -3.7, 0.8, -1.9);
disc.rotation.set(Math.PI / 2, 0, 0);
// un quart de cylindre menthe (le quart de disque du logo)
(function quarter() {
  const r = 1.1;
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(r, 0); s.absarc(0, 0, r, 0, Math.PI / 2, false); s.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 48 });
  g.translate(0, 0, -0.35);
  add(new THREE.Mesh(g, M.mint), 4.3, 0, 2.0, -0.5);
})();

// ---------- éclairage ----------
const key = new THREE.DirectionalLight(0xffe2bd, 3.8);
key.position.set(-11, 9.5, 1.5);
key.target.position.set(0, 0.5, -0.5);
scene.add(key, key.target);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
key.shadow.camera.left = -11; key.shadow.camera.right = 11; key.shadow.camera.top = 11; key.shadow.camera.bottom = -11;
key.shadow.camera.near = 1; key.shadow.camera.far = 40;
key.shadow.radius = 6; key.shadow.bias = -0.0003; key.shadow.normalBias = 0.04;

const fill = new THREE.HemisphereLight(0xd3ddff, 0xe2d8c4, 0.5);
scene.add(fill);
const rim = new THREE.DirectionalLight(0x9bb2ff, 0.9);
rim.position.set(8, 5, -6);
scene.add(rim);

// l'ombre portée au sol (sur le fond de la page) : un plan qui ne reçoit que l'ombre
const catcher = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.22 }));
catcher.rotation.x = -Math.PI / 2;
catcher.position.y = -0.83;
catcher.receiveShadow = true;
scene.add(catcher);

// ombres de contact : des taches douces sous les volumes (la lumière rasante d'un atelier)
function blob(x, z, w, d, op = 0.35) {
  if (typeof op !== 'number') op = 0.35;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, `rgba(30,24,16,${op})`); gr.addColorStop(1, 'rgba(30,24,16,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.004, z);
  group.add(m);
}
[[-0.4, -2.55, 8.2, 1.3, 0.55], [4.55, -0.7, 1.2, 5.6, 0.5], [-4.1, 0.9, 2.5, 2.3], [-3.0, 1.9, 2.0, 2.0], [-4.2, 2.5, 1.8, 1.8], [-0.5, 0.5, 3.8, 3.4], [-2.1, -1.5, 2.0, 2.0], [0.85, -2.4, 3.2, 2.6], [3.0, -1.0, 4.6, 3.4], [4.3, 2.0, 2.6, 2.4], [-3.7, -1.9, 2.0, 1.2]].forEach((a) => blob(...a));

// ---------- caméra ----------
const aspect = W / H;
let cam;
if (VIEW === 'mobile') {
  // cadrage dédié : on garde la paroi bleue, l'arche et la grille de modules, on resserre
  cam = new THREE.PerspectiveCamera(31, aspect, 0.1, 100);
  cam.position.set(-5.6, 4.6, 12.6);
  cam.lookAt(1.1, 1.3, -0.9);
} else {
  cam = new THREE.PerspectiveCamera(27, aspect, 0.1, 100);
  cam.position.set(-10.6, 7.6, 15.6);
  cam.lookAt(0.4, 1.0, -0.4);
}
group.rotation.y = 0;
renderer.render(scene, cam);
window.__png = renderer.domElement.toDataURL('image/png');
window.__done = true;
