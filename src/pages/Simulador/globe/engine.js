const MAP_URL = "/world-map.png";

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Dot globe fragment shader (cobe-style fibonacci sampling).
// View ↔ globe contract: src/globe/view.js (ray * uRot, column-major uRot).
// Map UV contract: src/globe/geo.js latLngToMapUV().
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uSize;
uniform vec2 uOffset;
uniform mat3 uRot;
uniform vec3 uBaseColor;
uniform vec3 uGlowColor;
uniform vec4 uStyle;
uniform float uMapSamples;
uniform float uScale;
uniform float uMapBaseBrightness;
uniform sampler2D uMap;

out vec4 fragColor;

float uSampleInv;

vec3 fibNearest(vec3 c, out float dist) {
  c = c.xzy;
  float p = max(2.0, floor(log2(2.236068 * uMapSamples * 3.141593 * (1.0 - c.z * c.z)) * 0.72021));
  vec2 g = floor(pow(1.618034, p) / 2.236068 * vec2(1.0, 1.618034) + 0.5);
  vec2 d = fract((g + 1.0) * 0.618034) * 6.283185 - 3.883222;
  vec2 e = -2.0 * g;
  vec2 f = vec2(atan(c.y, c.x), c.z - 1.0);
  vec2 q = floor(vec2(
    e.y * f.x - d.y * (f.y * uMapSamples + 1.0),
    -e.x * f.x + d.x * (f.y * uMapSamples + 1.0)
  ) / (d.x * e.y - e.x * d.y));
  float best = 3.141593;
  vec3 nearest;
  for (float h = 0.0; h < 4.0; h += 1.0) {
    vec2 s = vec2(mod(h, 2.0), floor(h * 0.5));
    float j = dot(g, q + s);
    if (j > uMapSamples) continue;
    float a = j;
    float b = 0.0;
    if (a >= 16384.0) { a -= 16384.0; b += 0.868872; }
    if (a >= 8192.0)  { a -= 8192.0;  b += 0.934436; }
    if (a >= 4096.0)  { a -= 4096.0;  b += 0.467218; }
    if (a >= 2048.0)  { a -= 2048.0;  b += 0.733609; }
    if (a >= 1024.0)  { a -= 1024.0;  b += 0.866804; }
    if (a >= 512.0)   { a -= 512.0;   b += 0.433402; }
    if (a >= 256.0)   { a -= 256.0;   b += 0.216701; }
    if (a >= 128.0)   { a -= 128.0;   b += 0.108351; }
    if (a >= 64.0)    { a -= 64.0;    b += 0.554175; }
    if (a >= 32.0)    { a -= 32.0;    b += 0.777088; }
    if (a >= 16.0)    { a -= 16.0;    b += 0.888544; }
    if (a >= 8.0)     { a -= 8.0;     b += 0.944272; }
    if (a >= 4.0)     { a -= 4.0;     b += 0.472136; }
    if (a >= 2.0)     { a -= 2.0;     b += 0.236068; }
    if (a >= 1.0)     { a -= 1.0;     b += 0.618034; }
    float ang = fract(b) * 6.283185;
    float zi = 1.0 - 2.0 * j * uSampleInv;
    float zm = sqrt(1.0 - zi * zi);
    vec3 o = vec3(cos(ang) * zm, sin(ang) * zm, zi);
    float t = length(c - o);
    if (t < best) {
      best = t;
      nearest = o;
    }
  }
  dist = best;
  return nearest.xzy;
}

void main() {
  uSampleInv = 1.0 / uMapSamples;
  vec2 inv = 1.0 / uSize;
  vec2 uv = (gl_FragCoord.xy * inv * 2.0 - 1.0) / uScale - uOffset * vec2(1.0, -1.0) * inv;
  uv.x *= uSize.x * inv.y;
  float r2 = dot(uv, uv);
  vec4 color = vec4(0.0);
  float glow = 0.0;

  if (r2 <= 0.64) {
    float dotDist;
    vec4 land = vec4(0.0);
    vec3 ray = normalize(vec3(uv, sqrt(0.64 - r2)));
    float facing = ray.z;
    vec3 surface = ray * uRot;
    vec3 fib = fibNearest(surface, dotDist);
    // Map UV from fib lattice point (cobe contract); dotDist gates visibility.
    float lat = asin(clamp(fib.y, -1.0, 1.0));
    float cosLat = cos(lat);
    float lng = acos(clamp(-fib.x / cosLat, -1.0, 1.0));
    if (fib.z < 0.0) lng = -lng;
    float map = max(
      texture(uMap, vec2(lng * 0.5 / 3.141593 + 0.5, 0.5 - lat / 3.141593)).x,
      uMapBaseBrightness
    );
    float landMask = smoothstep(0.008, 0.0, dotDist);
    float diffuse = pow(max(facing, 0.0), uStyle.y) * uStyle.x;
    float landLight = map * landMask * diffuse;
    float shade = mix((1.0 - landLight) * pow(max(facing, 0.0), 0.4), landLight, uStyle.z) + 0.1;
    land += vec4(uBaseColor * shade, 1.0);
    land.rgb += pow(1.0 - facing, 4.0) * uGlowColor;
    color += land * (1.0 + uStyle.w) * 0.5;
    glow = (1.0 - r2) * (1.0 - r2) * smoothstep(0.0, 1.0, 0.2 / (r2 - 0.64));
  } else {
    float R = sqrt(0.2 / (r2 - 0.64));
    glow = smoothstep(0.5, 1.0, R / (R + 1.0));
  }
  fragColor = color + vec4(glow * uGlowColor, glow);
}
`;

function createGl(canvas) {
  return (
    canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    }) || null
  );
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "shader compile failed");
  }
  return shader;
}

function linkProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log || "program link failed");
  }
  return program;
}

function uploadMapTexture(gl, img) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

/** @type {Promise<HTMLImageElement> | null} */
let mapImagePromise = null;

/** Start loading the map as soon as this module is imported (browser only). */
export function preloadWorldMap() {
  if (typeof Image === "undefined") {
    return null;
  }
  if (!mapImagePromise) {
    mapImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`failed to load ${MAP_URL}`));
      img.src = MAP_URL;
    });
  }
  return mapImagePromise;
}

function loadMap(gl) {
  const pending = preloadWorldMap();
  if (!pending) {
    return Promise.reject(new Error("world map preload unavailable"));
  }
  return pending.then((img) => uploadMapTexture(gl, img));
}

if (typeof window !== "undefined") {
  preloadWorldMap();
}

/** Matches app.css --bg (#07080c); fallback if transparency is unavailable. */
const APP_BG = [7 / 255, 8 / 255, 12 / 255];

const DEFAULTS = {
  devicePixelRatio: 2,
  dark: 1,
  diffuse: 0.88,
  scale: 1.02,
  mapSamples: 16000,
  mapBrightness: 6.5,
  mapBaseBrightness: 0,
  baseColor: [0.3, 0.3, 0.3],
  glowColor: [0.26, 0.32, 0.46],
  opacity: 0.94,
  offset: [0, 0],
  /** When true, clear alpha 0 so the page background shows outside the globe. */
  transparent: true,
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ getRotationMat3: () => Float32Array, devicePixelRatio?: number }} options
 */
export function createGlobe(canvas, options) {
  const opts = { ...DEFAULTS, ...options };
  const gl = createGl(canvas);
  if (!gl) {
    throw new Error("WebGL2 required");
  }

  const program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  gl.useProgram(program);

  // VAO so the debris pass (a second program sharing this context) can't clobber
  // the globe's attribute state, and vice-versa.
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const loc = {
    uSize: gl.getUniformLocation(program, "uSize"),
    uOffset: gl.getUniformLocation(program, "uOffset"),
    uRot: gl.getUniformLocation(program, "uRot"),
    uBaseColor: gl.getUniformLocation(program, "uBaseColor"),
    uGlowColor: gl.getUniformLocation(program, "uGlowColor"),
    uStyle: gl.getUniformLocation(program, "uStyle"),
    uMapSamples: gl.getUniformLocation(program, "uMapSamples"),
    uScale: gl.getUniformLocation(program, "uScale"),
    uMapBaseBrightness: gl.getUniformLocation(program, "uMapBaseBrightness"),
    uMap: gl.getUniformLocation(program, "uMap"),
  };

  gl.uniform1i(loc.uMap, 0);
  gl.uniform1f(loc.uMapSamples, opts.mapSamples);
  gl.uniform1f(loc.uMapBaseBrightness, opts.mapBaseBrightness);
  gl.uniform1f(loc.uScale, opts.scale);
  gl.uniform4f(loc.uStyle, opts.mapBrightness, opts.diffuse, opts.dark, opts.opacity);
  gl.uniform3fv(loc.uBaseColor, opts.baseColor);
  gl.uniform3fv(loc.uGlowColor, opts.glowColor);
  gl.uniform2fv(loc.uOffset, opts.offset);

  let mapTex = null;
  let ready = false;
  let destroyed = false;

  function resize() {
    const dpr = opts.devicePixelRatio;
    const cssW = canvas.clientWidth || canvas.offsetWidth;
    const cssH = canvas.clientHeight || canvas.offsetHeight;
    if (!cssW || !cssH) return;
    const pxW = Math.round(cssW * dpr);
    const pxH = Math.round(cssH * dpr);
    if (canvas.width === pxW && canvas.height === pxH) return;
    canvas.width = pxW;
    canvas.height = pxH;
    gl.useProgram(program);
    gl.viewport(0, 0, pxW, pxH);
    gl.uniform2f(loc.uSize, pxW, pxH);
  }

  function draw(rotationMat3) {
    if (!mapTex) return;
    // Re-establish our own state — the debris pass leaves a different program,
    // VAO and blend mode bound.
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.disable(gl.BLEND);
    if (opts.transparent) {
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(APP_BG[0], APP_BG[1], APP_BG[2], 1);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mapTex);
    gl.uniformMatrix3fv(loc.uRot, false, rotationMat3);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /**
   * Render one frame. Externally driven by the shared simulation loop
   * (useSimulation → onFrame) so the whole app runs on a single rAF clock.
   * Pass the rotation matrix in so the debris pass can reuse the exact same one;
   * falls back to the orientation callback otherwise. No-op until the world-map
   * texture has loaded. Returns true once it draws.
   * @param {Float32Array} [rotationMat3]
   */
  function frame(rotationMat3) {
    if (destroyed || !ready || !mapTex) return false;
    resize();
    draw(rotationMat3 ?? options.getRotationMat3());
    return true;
  }

  loadMap(gl)
    .then((tex) => {
      if (destroyed) {
        gl.deleteTexture(tex);
        return;
      }
      mapTex = tex;
      ready = true;
    })
    .catch((err) => {
      console.error(err);
    });

  return {
    frame,
    // Shared with the debris layer so it can draw into the same context/frame.
    gl,
    scale: opts.scale,
    devicePixelRatio: opts.devicePixelRatio,
    get ready() {
      return ready;
    },
    destroy() {
      destroyed = true;
      if (mapTex) gl.deleteTexture(mapTex);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
