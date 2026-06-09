/**
 * Orbital layer — a second WebGL2 pass sharing the globe's context. Draws two
 * populations per shell: active satellites (cool white-blue, orderly) and debris
 * (warm, heating to red with criticality), plus transient collision flashes.
 * Additive blending, on top of the globe in the same cleared frame.
 *
 * The vertex shader mirrors src/globe/orbits.js: orbit from per-instance elements +
 * a sim-time uniform, globe→view via the same column-major uRot, behind-the-Earth
 * occlusion. Each shell×population is its own contiguous draw with scalar uniforms —
 * no uniform arrays, no dynamic indexing — so it's simple and portable.
 */
import { mulberry32 } from "../sim/kessler.js";
import { radiusForAltitude } from "./orbits.js";
import { HIGH_SHELL_INDEX } from "../sim/scenarios.js";

/** Highest shell drawn at this radius; the rest scale ∝ real altitude. */
const OUTER_RADIUS = 1.36;
/** Active satellites — blue (the operational, "good" population). */
const SAT_COLOR = [0.32, 0.58, 1.0];
/** The hero fleet — bright mint, big, unmistakable among blue sats and red debris
 *  (matches the "with fleet" green in the charts). */
const FLEET_COLOR = [0.45, 1.0, 0.78];
const FLEET_POOL = 30;

const PROJECT_GLSL = /* glsl */ `
  vec3 toView(vec3 g) { return uRot * g; }
  bool occluded(vec3 v) {
    float rho2 = v.x * v.x + v.y * v.y;
    return rho2 < 1.0 && v.z < sqrt(max(0.0, 1.0 - rho2));
  }
`;

const ORBIT_VS = /* glsl */ `#version 300 es
precision highp float;
in float aRadius;
in float aIncl;
in float aNode;
in float aPhase0;
in float aOmega;
in float aRank;

uniform mat3 uRot;
uniform float uScale;
uniform float uTime;
uniform float uPointBase;
uniform float uActive;
uniform float uBright;
uniform float uIsSat;
uniform vec3 uColor;

out vec3 vColor;
out float vAlpha;
${PROJECT_GLSL}

void main() {
  float theta = aPhase0 + aOmega * uTime;
  float cx = aRadius * cos(theta);
  float cy = aRadius * sin(theta);
  float ci = cos(aIncl), si = sin(aIncl);
  vec3 plane = vec3(cx, cy * ci, cy * si);
  float cn = cos(aNode), sn = sin(aNode);
  vec3 g = vec3(plane.x * cn - plane.y * sn, plane.x * sn + plane.y * cn, plane.z);

  vec3 v = toView(g);
  if (aRank >= uActive || occluded(v)) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  gl_Position = vec4(0.8 * uScale * v.xy, 0.0, 1.0);
  float depth = clamp(v.z / aRadius * 0.5 + 0.5, 0.0, 1.0);
  float shapeScale = uIsSat > 0.5 ? 2.2 : 3.0;
  gl_PointSize = uPointBase * shapeScale * (0.55 + 0.85 * depth);
  vColor = uColor;
  vAlpha = uBright * (0.8 + 0.8 * depth);
}
`;

const POINT_FS = /* glsl */ `#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
uniform float uRing;   // 0 = solid shape, 1 = expanding radar ring
uniform float uPulse;  // ring radius phase 0..1
uniform float uShape;  // 0=circle(satellite), 1=diamond(debris)
out vec4 frag;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = length(p);
  if (uRing > 0.5) {
    // thin circle line expanding from the craft, fading as it grows
    float edge = smoothstep(0.07, 0.0, abs(d - uPulse));
    float a = edge * (1.0 - uPulse);
    if (a <= 0.002) discard;
    frag = vec4(vColor * a, a);
    return;
  }

  float alpha;
  if (uShape > 0.5) {
    // --- diamond / spike shape for debris — solid red, shape never changes ---
    float manhattan = abs(p.x) + abs(p.y);
    if (manhattan > 1.0) discard;
    float core = 1.0 - manhattan;
    float shape = min(pow(core, 1.8) + exp(-manhattan * 2.8) * 0.35, 1.0);
    // vAlpha only dims, never brightens past 1.0 — so the diamond taper is stable
    alpha = shape * clamp(vAlpha, 0.0, 1.0);
    if (alpha <= 0.008) discard;
    frag = vec4(vColor * alpha, alpha);
  } else {
    // --- circle for satellites (bright core + soft glow) ---
    if (d > 1.0) discard;
    float core = exp(-d * d * 6.0);
    float glow = pow(1.0 - d * d, 2.2) * 0.7;
    alpha = (core * 0.9 + glow) * vAlpha;
    if (alpha <= 0.008) discard;
    // bright white core blending to blue at edges
    vec3 satCol = mix(vec3(0.85, 0.95, 1.0), vColor, pow(d, 0.6));
    frag = vec4(satCol * alpha, alpha);
  }
}
`;

const FLASH_VS = /* glsl */ `#version 300 es
precision highp float;
in vec3 aPos;
in float aBirth;
uniform mat3 uRot;
uniform float uScale;
uniform float uTime;
uniform float uLife;
uniform float uPointBase;
out float vGlow;
${PROJECT_GLSL}
void main() {
  float age = (uTime - aBirth) / uLife;
  vec3 v = toView(aPos);
  if (age < 0.0 || age > 1.0 || occluded(v)) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }
  gl_Position = vec4(0.8 * uScale * v.xy, 0.0, 1.0);
  gl_PointSize = uPointBase * (4.5 + 12.0 * age);
  vGlow = (1.0 - age) * (1.0 - age);
}
`;

const FLASH_FS = /* glsl */ `#version 300 es
precision highp float;
in float vGlow;
out vec4 frag;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = length(p);
  if (d > 1.0) discard;
  // X / cross shape — reads as "destroyed", dangerous
  float cross = 1.0 - smoothstep(0.03, 0.22, abs(abs(p.x) - abs(p.y)));
  float edge = 1.0 - smoothstep(0.78, 1.0, d);
  float ring = edge * vGlow * (0.35 + 0.65 * cross);
  // amber → hot white at the core
  vec3 c = mix(vec3(1.0, 0.45, 0.18), vec3(1.0, 0.9, 0.7), ring);
  frag = vec4(c * ring, ring);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || "shader compile failed");
  }
  return sh;
}
function link(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(log || "program link failed");
  }
  return p;
}

// Debris is red — always. No criticality heat-up, so it never blends into orange
// and reads unambiguously as "the bad stuff" regardless of cascade state.
const DEBRIS_COLOR = [1.0, 0.24, 0.3];

const SHELL_STYLE = {
  leo: { base: [0.32, 0.86, 1.0], poolD: 220, scaleD: 4000, poolS: 600, scaleS: 12000 },
  mid: { base: [0.46, 0.74, 1.0], poolD: 320, scaleD: 6000, poolS: 240, scaleS: 4000 },
  high: { base: [0.66, 0.5, 1.0], poolD: 700, scaleD: 30000, poolS: 110, scaleS: 1500 },
};

const activeFromN = (N, pool, scale) => (N <= 0 ? 0 : Math.round(pool * (1 - Math.exp(-N / scale))));

/**
 * @param {WebGL2RenderingContext} gl
 * @param {{ shells: import("../sim/kessler.js").Shell[], scale: number, dpr?: number, seed?: number }} opts
 */
export function createDebrisLayer(gl, opts) {
  const shells = opts.shells;
  const scale = opts.scale;
  const dpr = opts.dpr ?? 2;
  const rng = mulberry32(opts.seed ?? 0xc0ffee);
  const style = shells.map((s) => SHELL_STYLE[s.id] ?? { base: [0.5, 0.8, 1], poolD: 800, scaleD: 2000, poolS: 400, scaleS: 400 });

  const maxAltRatio = Math.max(...shells.map((s) => radiusForAltitude(s.altitudeKm) - 1));
  const exaggeration = (OUTER_RADIUS - 1) / maxAltRatio;
  const vizRadius = (altKm) => 1 + (radiusForAltitude(altKm) - 1) * exaggeration;

  // ---- build one contiguous element buffer; record a draw group per shell×kind ----
  const STRIDE = 6; // radius, incl, node, phase0, omega, rank
  const groups = []; // { shellIndex, kind, first, count }
  const chunks = [];
  let firstVertex = 0;

  const buildGroup = (si, radius, baseOmega, pool, kind) => {
    const arr = new Float32Array(pool * STRIDE);
    const ranks = Array.from({ length: pool }, (_, i) => i);
    for (let i = pool - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
    }
    let w = 0;
    for (let i = 0; i < pool; i++) {
      const incl = (kind === 1 ? 30 + rng() * 70 : 20 + rng() * 90) * (Math.PI / 180);
      arr[w++] = radius * (1 + (rng() - 0.5) * (kind === 1 ? 0.006 : 0.014));
      arr[w++] = incl;
      arr[w++] = rng() * Math.PI * 2;
      arr[w++] = rng() * Math.PI * 2;
      arr[w++] = baseOmega * (0.85 + rng() * 0.3);
      arr[w++] = ranks[i];
    }
    chunks.push(arr);
    groups.push({ shellIndex: si, kind, first: firstVertex, count: pool });
    firstVertex += pool;
  };

  shells.forEach((s, si) => {
    const radius = vizRadius(s.altitudeKm);
    const baseOmega = 1.6 * Math.pow(1.07 / radius, 1.5);
    buildGroup(si, radius, baseOmega, style[si].poolD, 0);
    buildGroup(si, radius, baseOmega, style[si].poolS, 1);
  });

  // the hero fleet — visible craft orbiting just outside the critical shell
  const highIdx = HIGH_SHELL_INDEX;
  const fleetR = vizRadius(shells[highIdx].altitudeKm) + 0.05;
  // intentionally fast — the fleet sweeps the orbit, clearly quicker than debris
  buildGroup(highIdx, fleetR, 9 * Math.pow(1.07 / fleetR, 1.5), FLEET_POOL, 2);

  const data = new Float32Array(firstVertex * STRIDE);
  let off = 0;
  for (const c of chunks) {
    data.set(c, off);
    off += c.length;
  }

  const program = link(gl, ORBIT_VS, POINT_FS);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const bytes = STRIDE * 4;
  ["aRadius", "aIncl", "aNode", "aPhase0", "aOmega", "aRank"].forEach((name, k) => {
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, bytes, k * 4);
  });
  gl.bindVertexArray(null);

  const u = {
    uRot: gl.getUniformLocation(program, "uRot"),
    uScale: gl.getUniformLocation(program, "uScale"),
    uTime: gl.getUniformLocation(program, "uTime"),
    uPointBase: gl.getUniformLocation(program, "uPointBase"),
    uActive: gl.getUniformLocation(program, "uActive"),
    uBright: gl.getUniformLocation(program, "uBright"),
    uIsSat: gl.getUniformLocation(program, "uIsSat"),
    uColor: gl.getUniformLocation(program, "uColor"),
    uRing: gl.getUniformLocation(program, "uRing"),
    uPulse: gl.getUniformLocation(program, "uPulse"),
    uShape: gl.getUniformLocation(program, "uShape"),
  };

  // ---- collision flashes ----
  const MAX_FLASH = 96;
  const FLASH_LIFE = 0.7;
  const flashData = new Float32Array(MAX_FLASH * 4);
  let flashHead = 0;
  let flashActive = 0;

  const flashProgram = link(gl, FLASH_VS, FLASH_FS);
  const flashVao = gl.createVertexArray();
  gl.bindVertexArray(flashVao);
  const flashBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, flashBuf);
  gl.bufferData(gl.ARRAY_BUFFER, flashData, gl.DYNAMIC_DRAW);
  const aPosLoc = gl.getAttribLocation(flashProgram, "aPos");
  gl.enableVertexAttribArray(aPosLoc);
  gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 16, 0);
  const aBirthLoc = gl.getAttribLocation(flashProgram, "aBirth");
  gl.enableVertexAttribArray(aBirthLoc);
  gl.vertexAttribPointer(aBirthLoc, 1, gl.FLOAT, false, 16, 12);
  gl.bindVertexArray(null);

  const fu = {
    uRot: gl.getUniformLocation(flashProgram, "uRot"),
    uScale: gl.getUniformLocation(flashProgram, "uScale"),
    uTime: gl.getUniformLocation(flashProgram, "uTime"),
    uLife: gl.getUniformLocation(flashProgram, "uLife"),
    uPointBase: gl.getUniformLocation(flashProgram, "uPointBase"),
  };

  const shellRadii = shells.map((s) => vizRadius(s.altitudeKm));
  function spawnFlash(shellIndex, now) {
    const uu = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const r = shellRadii[shellIndex];
    const ss = Math.sqrt(1 - uu * uu);
    const b = flashHead * 4;
    flashData[b] = r * ss * Math.cos(phi);
    flashData[b + 1] = r * ss * Math.sin(phi);
    flashData[b + 2] = r * uu;
    flashData[b + 3] = now;
    flashHead = (flashHead + 1) % MAX_FLASH;
    flashActive = Math.min(MAX_FLASH, flashActive + 1);
  }

  const pointBase = Math.max(1.5, 2.0 * dpr);

  function render(rot, frame, tSec) {
    if (!frame) return;
    const snap = frame.live;
    const events = frame.events ?? [0, 0, 0];
    // sparse, occasional flashes — cosmetic, not a fireworks show
    for (let i = 0; i < shells.length; i++) {
      if ((events[i] | 0) > 0 && rng() < 0.18) spawnFlash(i, tSec);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniformMatrix3fv(u.uRot, false, rot);
    gl.uniform1f(u.uScale, scale);
    gl.uniform1f(u.uTime, tSec);
    gl.uniform1f(u.uRing, 0);
    const fleetCount = Math.max(0, Math.min(FLEET_POOL, frame.fleets ?? 0));

    for (const grp of groups) {
      if (grp.kind === 2) {
        // deployed fleet — compact green craft with subtle pulse
        const pulse = 0.75 + 0.25 * Math.sin(performance.now() / 260);
        gl.uniform1f(u.uActive, fleetCount);
        gl.uniform1f(u.uIsSat, 0);
        gl.uniform1f(u.uShape, 0);
        gl.uniform1f(u.uBright, 2.4 * pulse);
        gl.uniform1f(u.uPointBase, pointBase * (3.0 + 0.8 * pulse));
        gl.uniform3fv(u.uColor, FLEET_COLOR);
        gl.drawArrays(gl.POINTS, grp.first, grp.count);
        continue;
      }
      const sh = snap.shells[grp.shellIndex];
      const st = style[grp.shellIndex];
      if (!sh) continue;
      if (grp.kind === 1) {
        gl.uniform1f(u.uPointBase, pointBase);
        gl.uniform1f(u.uActive, activeFromN(sh.S, st.poolS, st.scaleS));
        gl.uniform1f(u.uIsSat, 1);
        gl.uniform1f(u.uShape, 0);
        gl.uniform1f(u.uBright, 1.25);
        gl.uniform3fv(u.uColor, SAT_COLOR);
      } else {
        gl.uniform1f(u.uPointBase, pointBase * 1.8);
        gl.uniform1f(u.uActive, activeFromN(sh.D, st.poolD, st.scaleD));
        gl.uniform1f(u.uIsSat, 0);
        gl.uniform1f(u.uShape, 1);
        gl.uniform1f(u.uBright, 1.05 + Math.min(1.8, sh.criticality * 0.6));
        gl.uniform3fv(u.uColor, DEBRIS_COLOR);
      }
      gl.drawArrays(gl.POINTS, grp.first, grp.count);
    }

    // fleet radar-ring pulse — a thin circle line expanding from each craft
    const fleetGrp = groups.find((g) => g.kind === 2);
    if (fleetGrp && fleetCount > 0) {
      gl.uniform1f(u.uRing, 1);
      gl.uniform1f(u.uPulse, (performance.now() % 1300) / 1300);
      gl.uniform1f(u.uActive, fleetCount);
      gl.uniform1f(u.uIsSat, 0);
      gl.uniform1f(u.uShape, 0);
      gl.uniform1f(u.uPointBase, pointBase * 10);
      gl.uniform3fv(u.uColor, FLEET_COLOR);
      gl.drawArrays(gl.POINTS, fleetGrp.first, fleetGrp.count);
      gl.uniform1f(u.uRing, 0);
    }

    if (flashActive > 0) {
      gl.useProgram(flashProgram);
      gl.bindVertexArray(flashVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, flashBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flashData);
      gl.uniformMatrix3fv(fu.uRot, false, rot);
      gl.uniform1f(fu.uScale, scale);
      gl.uniform1f(fu.uTime, tSec);
      gl.uniform1f(fu.uLife, FLASH_LIFE);
      gl.uniform1f(fu.uPointBase, pointBase);
      gl.drawArrays(gl.POINTS, 0, MAX_FLASH);
    }

    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
  }

  function destroy() {
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
    gl.deleteBuffer(flashBuf);
    gl.deleteVertexArray(flashVao);
    gl.deleteProgram(flashProgram);
  }

  return { render, destroy };
}
