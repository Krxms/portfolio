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

// ---------- 1. socle : une dalle, un seul ressaut ----------
add(box(10.6, 0.4, 7.4, M.stone, 0.04), 0.3, -0.2, 1.0);
add(box(11.8, 0.28, 8.6, M.stoneDark, 0.04), 0.3, -0.54, 1.0);

// ---------- 2. la façade : un système de modules assemblés en structure d'interface ----------
// Une plaque de fond, sombre : les joints entre modules sont des ombres, et l'emplacement vide se lit comme un creux.
add(box(6.9, 4.6, 0.3, M.stoneDark, 0.03), 0, 2.3, -0.15);

// colonnes : x -3.2 .. 3.2 ; rangées : y 0 .. 4.2 ; joint de 0,12
const mod = (x, y, w, h, d, m, r = 0.03) => add(box(w, h, d, m, r), x, y, d / 2);

mod(-2.45, 1.5, 1.5, 3.0, 0.6, M.navy);                       // barre latérale (navigation)
mod(0, 3.66, 6.4, 1.08, 0.34, M.cream);                       // bandeau d'en-tête
mod(0.23, 0.65, 2.7, 1.3, 0.5, M.limestone);                      // module bas, au centre
mod(2.22, 0.65, 1.96, 1.3, 0.28, M.cream);                    // module bas, à droite
// le module principal, en saillie : le point focal
const hero = mod(0.23, 2.21, 2.7, 1.58, 1.05, M.klein, 0.045);
// sur le bandeau : un bouton et deux traits de texte, en relief léger
add(box(0.95, 0.4, 0.12, M.klein, 0.03), 2.55, 3.66, 0.34 + 0.06);
add(box(1.9, 0.07, 0.05, M.steel, 0.01), -1.3, 3.8, 0.34 + 0.025);
add(box(1.2, 0.07, 0.05, M.steel, 0.01), -1.65, 3.55, 0.34 + 0.025);
// sur le module principal : des lignes de contenu en relief, et la seule touche orange (l'action)
add(box(1.7, 0.1, 0.05, M.cream, 0.01), 0.0, 2.7, 1.05 + 0.025);
add(box(1.2, 0.1, 0.05, M.cream, 0.01), -0.25, 2.45, 1.05 + 0.025);
add(box(0.85, 0.32, 0.1, M.orange, 0.04), 0.85, 1.8, 1.05 + 0.05);

// l'emplacement libre : un cadre d'acier à fleur de plaque (là où le prochain module viendra)
const SX0 = 1.24, SX1 = 3.2, SY0 = 1.42, SY1 = 3.0;
[[SX0, SY0, SX1, SY0], [SX1, SY0, SX1, SY1], [SX1, SY1, SX0, SY1], [SX0, SY1, SX0, SY0]].forEach(([x0, y0, x1, y1]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const b = box(Math.abs(x1 - x0) > 0 ? len : 0.05, Math.abs(y1 - y0) > 0 ? len : 0.05, 0.05, M.steel, 0.01);
  add(b, (x0 + x1) / 2, (y0 + y1) / 2, 0.03);
});

// le module en cours d'assemblage : décalé en avant et vers le haut, guidé par quatre rails vers son emplacement
const F = { x: 2.7, y: 2.95, z: 2.0, w: 1.96, h: 1.58, d: 0.55 };
const flo = box(F.w, F.h, F.d, M.cream, 0.04);
add(flo, F.x, F.y, F.z, -0.14);
flo.rotation.z = 0.025;
add(box(1.2, 0.1, 0.05, M.steel, 0.01), F.x - 0.1, F.y + 0.45, F.z + F.d / 2 + 0.02, -0.14);
add(box(0.8, 0.1, 0.05, M.steel, 0.01), F.x - 0.3, F.y + 0.22, F.z + F.d / 2 + 0.02, -0.14);
add(box(0.6, 0.26, 0.08, M.mint, 0.03), F.x + 0.3, F.y - 0.4, F.z + F.d / 2 + 0.04, -0.14);
function rod(a, b, r = 0.028) {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), M.steel);
  m.position.copy(va.clone().add(vb).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  m.castShadow = true; m.receiveShadow = true; group.add(m);
}
[[SX0, SY0, F.x - F.w / 2, F.y - F.h / 2], [SX1, SY0, F.x + F.w / 2, F.y - F.h / 2], [SX0, SY1, F.x - F.w / 2, F.y + F.h / 2], [SX1, SY1, F.x + F.w / 2, F.y + F.h / 2]]
  .forEach(([x0, y0, x1, y1]) => rod([x0, y0, 0.04], [x1, y1, F.z - F.d / 2]));

// ---------- 3. des modules en attente, au premier plan (alignés, pas encore posés) ----------
add(box(1.5, 0.32, 1.05, M.cream, 0.03), -2.9, 0.16, 2.6, 0.18);
add(box(1.05, 0.28, 0.75, M.mint, 0.03), -2.75, 0.46, 2.55, 0.32);
add(box(1.2, 0.42, 1.2, M.stone, 0.03), -0.9, 0.21, 3.2, -0.16);

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
[[0, -0.2, 7.4, 1.2, 0.5], [-2.9, 2.6, 2.4, 1.9, 0.4], [-0.9, 3.2, 1.9, 1.9, 0.4], [0.23, 0.9, 3.4, 2.4, 0.4], [2.2, 0.9, 2.6, 1.6, 0.3]].forEach((a) => blob(...a));

// ---------- caméra ----------
const aspect = W / H;
let cam;
if (VIEW === 'mobile') {
  // cadrage mobile dédié : le module principal et le module qui vient s'assembler, au plus près
  cam = new THREE.PerspectiveCamera(33, aspect, 0.1, 100);
  cam.position.set(-4.8, 3.9, 11.4);
  cam.lookAt(1.6, 2.3, 0.8);
} else {
  cam = new THREE.PerspectiveCamera(27, aspect, 0.1, 100);
  cam.position.set(-8.2, 5.4, 12.6);
  cam.lookAt(0.6, 1.9, 0.5);
}
renderer.render(scene, cam);
window.__png = renderer.domElement.toDataURL('image/png');
window.__done = true;
