// Sphère "vivante" en WebGL2 pur (aucune dépendance) : ondulations lentes,
// bandes découpées dans le fragment shader, réaction type ferrofluide au curseur.

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec3 aPos;
uniform float uTime;
uniform vec3 uMouse;
uniform float uStrength;
out vec3 vPos;
out vec3 vNormal;
out float vInfl;
${NOISE}

vec3 displace(vec3 p, out float infl) {
  float t = uTime;
  float r = 1.0 + 0.028 * snoise(p * 1.3 + vec3(0., 0., t * 0.10))
                + 0.014 * snoise(p * 2.6 - vec3(t * 0.16, 0., 0.));
  float d = distance(p, uMouse);
  infl = exp(-d * d * 4.2) * uStrength;
  // pointes de ferrofluide : lobes positifs d'un bruit haute fréquence
  float spike = pow(max(snoise(p * 6.5 + vec3(t * 0.35, t * 0.2, 0.)), 0.), 2.2);
  r += infl * (0.12 + 0.42 * spike);
  return p * r;
}

void main() {
  float i0, i1, i2;
  vec3 t1 = normalize(cross(aPos, abs(aPos.y) < 0.99 ? vec3(0., 1., 0.) : vec3(1., 0., 0.)));
  vec3 t2 = cross(aPos, t1);
  float e = 0.03;
  vec3 p0 = displace(aPos, i0);
  vec3 p1 = displace(normalize(aPos + t1 * e), i1);
  vec3 p2 = displace(normalize(aPos + t2 * e), i2);
  vNormal = normalize(cross(p1 - p0, p2 - p0));
  vPos = p0;
  vInfl = i0;
  float cam = 3.4;
  gl_Position = vec4(p0.xy * 2.3, -p0.z * 0.3 * (cam - p0.z), cam - p0.z);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNormal;
in float vInfl;
uniform float uTime;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uRim;
out vec4 outColor;
${NOISE}

void main() {
  vec3 p = vPos;
  float t = uTime;
  vec3 ax = normalize(vec3(-0.55, 1.0, 0.1));
  float f = dot(p, ax) * 2.7
          + 0.95 * sin(p.x * 1.9 + p.z * 1.2 + t * 0.18)
          + 0.30 * snoise(p * 1.2 + vec3(t * 0.06))
          + t * 0.035;

  float fr = fract(f);
  float g = 0.05 + vInfl * 0.06;
  float aa = max(fwidth(f), 0.002) * 1.3;
  float a = smoothstep(g, g + aa, fr) * smoothstep(1.0 - g, 1.0 - g - aa, fr);
  if (a < 0.01) discard;

  vec3 n = normalize(vNormal);
  float gx = p.x * 0.75 + p.y * 0.45 + 0.25 * snoise(p * 0.9 + vec3(t * 0.05));
  vec3 col = mix(uColA, uColB, smoothstep(-0.9, 0.9, gx));

  float diff = clamp(dot(n, normalize(vec3(-0.5, 0.6, 0.8))) * 0.5 + 0.5, 0., 1.);
  col *= 0.72 + 0.5 * diff;

  float fres = pow(1.0 - max(n.z, 0.), 2.5);
  float side = smoothstep(-0.2, 0.9, n.x * 0.7 - n.y * 0.6);
  col = mix(col, uRim, fres * side * 0.75);

  float hl = smoothstep(g + 0.05, g, fr);
  col = mix(col, uRim * 1.15, hl * 0.4);
  col *= 0.86 + 0.14 * smoothstep(1.0 - g, 1.0 - g - 0.14, fr);

  outColor = vec4(col * a, a);
}
`;

function hex(str, fallback) {
  const v = (str || fallback).trim().replace('#', '');
  const n = parseInt(v.length === 3 ? v.replace(/./g, '$&$&') : v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function buildSphere(rows, cols) {
  const verts = new Float32Array((rows + 1) * (cols + 1) * 3);
  let k = 0;
  for (let i = 0; i <= rows; i++) {
    const th = (i / rows) * Math.PI;
    for (let j = 0; j <= cols; j++) {
      const ph = (j / cols) * Math.PI * 2;
      verts[k++] = Math.sin(th) * Math.cos(ph);
      verts[k++] = Math.cos(th);
      verts[k++] = Math.sin(th) * Math.sin(ph);
    }
  }
  const idx = new Uint32Array(rows * cols * 6);
  let m = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j;
      const b = a + cols + 1;
      idx[m++] = a; idx[m++] = a + 1; idx[m++] = b;
      idx[m++] = a + 1; idx[m++] = b + 1; idx[m++] = b;
    }
  }
  return { verts, idx };
}

function init(canvas) {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  const { verts, idx } = buildSphere(180, 180);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

  const U = {};
  ['uTime', 'uMouse', 'uStrength', 'uColA', 'uColB', 'uRim'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  const css = getComputedStyle(canvas);
  gl.uniform3fv(U.uColA, hex(css.getPropertyValue('--sphere-a'), '#5b1f26'));
  gl.uniform3fv(U.uColB, hex(css.getPropertyValue('--sphere-b'), '#1d2766'));
  gl.uniform3fv(U.uRim, hex(css.getPropertyValue('--sphere-rim'), '#9aa9c9'));

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(0, 0, 0, 0);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
    if (canvas.width !== w) {
      canvas.width = w;
      canvas.height = w;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  // état du curseur (lissé pour un mouvement fluide)
  const target = { x: 0, y: 0, prox: 0 };
  const cur = { x: 0.3, y: 0.2, z: 0.93, strength: 0.12, speed: 0 };
  let last = { x: 0, y: 0 };

  window.addEventListener(
    'pointermove',
    (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      const sx = nx / 0.68;
      const sy = ny / 0.68;
      target.x = sx;
      target.y = sy;
      const dist = Math.hypot(sx, sy);
      target.prox = 1 - Math.min(Math.max((dist - 1.0) / 0.9, 0), 1);
      cur.speed = Math.min(cur.speed + Math.hypot(e.clientX - last.x, e.clientY - last.y) * 0.004, 1);
      last = { x: e.clientX, y: e.clientY };
    },
    { passive: true }
  );
  window.addEventListener('pointerleave', () => (target.prox = 0));
  document.addEventListener('mouseleave', () => (target.prox = 0));

  function frame(now) {
    const t = reduce ? 8 : now / 1000;

    // point au repos : lent vagabondage sur la sphère
    const wx = Math.sin(t * 0.31) * 0.55;
    const wy = Math.cos(t * 0.23) * 0.4;
    let tx = target.x * target.prox + wx * (1 - target.prox);
    let ty = target.y * target.prox + wy * (1 - target.prox);
    const r2 = tx * tx + ty * ty;
    let tz = 0;
    if (r2 < 1) tz = Math.sqrt(1 - r2);
    else {
      const l = Math.sqrt(r2);
      tx /= l;
      ty /= l;
    }
    cur.x += (tx - cur.x) * 0.07;
    cur.y += (ty - cur.y) * 0.07;
    cur.z += (tz - cur.z) * 0.07;
    cur.speed *= 0.96;
    const wantStrength = 0.14 + target.prox * (0.55 + 0.45 * cur.speed);
    cur.strength += (wantStrength - cur.strength) * 0.05;
    const l = Math.hypot(cur.x, cur.y, cur.z) || 1;

    gl.uniform1f(U.uTime, t);
    gl.uniform3f(U.uMouse, cur.x / l, cur.y / l, cur.z / l);
    gl.uniform1f(U.uStrength, reduce ? 0.14 : cur.strength);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
  }

  if (reduce) {
    frame(0);
    return;
  }

  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(canvas);
  (function loop(now) {
    if (visible) frame(now);
    requestAnimationFrame(loop);
  })(performance.now());
}

const canvas = document.querySelector('[data-hero-sphere]');
if (canvas) init(canvas);
