const UFO_VS = /* glsl */ `#version 300 es
precision highp float;
in vec3 aLocal;
in vec3 aNormal;
in vec3 aColor;

uniform mat3 uRot;
uniform vec3 uCenter;
uniform vec3 uRight;
uniform vec3 uForward;
uniform vec3 uUp;
uniform float uScale;
uniform float uCraftScale;
uniform float uAlpha;

out vec3 vColor;
out float vLight;
out float vAlpha;

void main() {
  vec3 g = uCenter + (uRight * aLocal.x + uForward * aLocal.y + uUp * aLocal.z) * uCraftScale;
  vec3 n = normalize(uRight * aNormal.x + uForward * aNormal.y + uUp * aNormal.z);
  vec3 view = uRot * g;
  vec3 viewN = normalize(uRot * n);
  vec3 lightDir = normalize(vec3(-0.35, 0.52, 0.78));
  float diffuse = max(dot(viewN, lightDir), 0.0);
  float rim = pow(1.0 - max(viewN.z, 0.0), 2.4);

  gl_Position = vec4(0.8 * uScale * view.xy, 0.0, 1.0);
  vColor = aColor;
  vLight = 0.28 + diffuse * 0.82 + rim * 0.22;
  vAlpha = uAlpha;
}
`;

const UFO_FS = /* glsl */ `#version 300 es
precision highp float;
in vec3 vColor;
in float vLight;
in float vAlpha;
out vec4 frag;
void main() {
  vec3 color = vColor * vLight;
  frag = vec4(color * vAlpha, vAlpha);
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

function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function toView(m, g) {
  return [
    m[0] * g[0] + m[3] * g[1] + m[6] * g[2],
    m[1] * g[0] + m[4] * g[1] + m[7] * g[2],
    m[2] * g[0] + m[5] * g[1] + m[8] * g[2],
  ];
}

function isOccluded(view) {
  const rho2 = view[0] * view[0] + view[1] * view[1];
  return rho2 < 1 && view[2] < Math.sqrt(Math.max(0, 1 - rho2));
}

function pushVertex(out, p, n, c) {
  out.push(p[0], p[1], p[2], n[0], n[1], n[2], c[0], c[1], c[2]);
}

function pushTri(out, a, b, c, na, nb, nc, ca, cb = ca, cc = ca) {
  pushVertex(out, a, na, ca);
  pushVertex(out, b, nb, cb);
  pushVertex(out, c, nc, cc);
}

function makeRing(out, rings, color) {
  for (let r = 0; r < rings.length - 1; r++) {
    const a = rings[r];
    const b = rings[r + 1];
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length;
      pushTri(out, a[i].p, b[i].p, b[j].p, a[i].n, b[i].n, b[j].n, color);
      pushTri(out, a[i].p, b[j].p, a[j].p, a[i].n, b[j].n, a[j].n, color);
    }
  }
}

function ellipticalRing(count, rx, ry, z, normalZ) {
  const ring = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry;
    ring.push({
      p: [x, y, z],
      n: normalize([x / Math.max(rx, 0.001), y / Math.max(ry, 0.001), normalZ]),
    });
  }
  return ring;
}

function makeMesh() {
  const out = [];
  const seg = 44;
  const darkMetal = [0.24, 0.28, 0.34];
  const rimMetal = [0.64, 0.78, 0.88];
  const glass = [0.48, 0.84, 1.0];
  const mint = [0.46, 1.0, 0.76];

  makeRing(out, [
    ellipticalRing(seg, 0.16, 0.09, 0.22, 1.8),
    ellipticalRing(seg, 0.42, 0.25, 0.13, 0.85),
    ellipticalRing(seg, 0.5, 0.3, 0.03, 0.35),
  ], glass);

  makeRing(out, [
    ellipticalRing(seg, 0.5, 0.3, 0.03, 0.3),
    ellipticalRing(seg, 0.88, 0.46, -0.04, 0.05),
    ellipticalRing(seg, 0.74, 0.34, -0.13, -0.45),
    ellipticalRing(seg, 0.2, 0.11, -0.2, -1.4),
  ], darkMetal);

  makeRing(out, [
    ellipticalRing(seg, 0.9, 0.48, -0.025, 0.15),
    ellipticalRing(seg, 0.94, 0.5, -0.055, -0.15),
  ], rimMetal);

  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2;
    const x = Math.cos(t) * 0.62;
    const y = Math.sin(t) * 0.3;
    makeRing(out, [
      ellipticalRing(12, 0.035, 0.025, -0.08, 1).map((v) => ({ p: [v.p[0] + x, v.p[1] + y, v.p[2]], n: v.n })),
      ellipticalRing(12, 0.05, 0.035, -0.12, -1).map((v) => ({ p: [v.p[0] + x, v.p[1] + y, v.p[2]], n: v.n })),
    ], mint);
  }

  return new Float32Array(out);
}

function craftFrame(phase) {
  const theta = -1.55 + phase * Math.PI * 2.1;
  const radius = 1.48;
  const z = 0.34 * Math.sin(phase * Math.PI * 1.25) + 0.08;
  const center = [Math.cos(theta) * radius, Math.sin(theta) * radius, z];
  const tangent = normalize([-Math.sin(theta), Math.cos(theta), 0.22 * Math.cos(phase * Math.PI * 1.25)]);
  const up = normalize(center);
  const right = normalize(cross(tangent, up));
  const forward = normalize(cross(up, right));
  return { center, right, forward, up };
}

/**
 * WebGL UFO scene layer. It lives in globe space like debris/fleets, not screen space:
 * dragging the planet rotates it, and Earth occlusion hides it behind the globe.
 *
 * @param {WebGL2RenderingContext} gl
 * @param {{ scale: number }} opts
 */
export function createUfoLayer(gl, opts) {
  const program = link(gl, UFO_VS, UFO_FS);
  const vao = gl.createVertexArray();
  const buf = gl.createBuffer();
  const data = makeMesh();
  const stride = 9 * 4;

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const aLocal = gl.getAttribLocation(program, "aLocal");
  const aNormal = gl.getAttribLocation(program, "aNormal");
  const aColor = gl.getAttribLocation(program, "aColor");
  gl.enableVertexAttribArray(aLocal);
  gl.vertexAttribPointer(aLocal, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(aNormal);
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, stride, 3 * 4);
  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 6 * 4);
  gl.bindVertexArray(null);

  const u = {
    uRot: gl.getUniformLocation(program, "uRot"),
    uCenter: gl.getUniformLocation(program, "uCenter"),
    uRight: gl.getUniformLocation(program, "uRight"),
    uForward: gl.getUniformLocation(program, "uForward"),
    uUp: gl.getUniformLocation(program, "uUp"),
    uScale: gl.getUniformLocation(program, "uScale"),
    uCraftScale: gl.getUniformLocation(program, "uCraftScale"),
    uAlpha: gl.getUniformLocation(program, "uAlpha"),
  };

  function render(rot, phase) {
    if (phase < 0 || phase > 1) return;
    const frame = craftFrame(phase);
    if (isOccluded(toView(rot, frame.center))) return;
    const fadeIn = Math.min(1, phase / 0.14);
    const fadeOut = Math.min(1, (1 - phase) / 0.18);
    const alpha = Math.max(0, Math.min(fadeIn, fadeOut));
    if (alpha <= 0.001) return;

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniformMatrix3fv(u.uRot, false, rot);
    gl.uniform3fv(u.uCenter, frame.center);
    gl.uniform3fv(u.uRight, frame.right);
    gl.uniform3fv(u.uForward, frame.forward);
    gl.uniform3fv(u.uUp, frame.up);
    gl.uniform1f(u.uScale, opts.scale);
    gl.uniform1f(u.uCraftScale, 0.115);
    gl.uniform1f(u.uAlpha, alpha * 0.94);
    gl.drawArrays(gl.TRIANGLES, 0, data.length / 9);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
  }

  function destroy() {
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  }

  return { render, destroy };
}
