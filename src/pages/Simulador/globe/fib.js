/**
 * Fibonacci sphere lattice — JavaScript mirror of globeEngine.js `fibNearest`.
 */
const DEFAULT_MAP_SAMPLES = 16000;

function fract(x) {
  return x - Math.floor(x);
}

/**
 * Nearest fibonacci-lattice point on the unit sphere.
 * @param {[number, number, number]} surface globe-fixed direction
 * @param {number} [mapSamples]
 * @returns {{ fib: [number, number, number], dotDist: number }}
 */
export function fibNearest(surface, mapSamples = DEFAULT_MAP_SAMPLES) {
  const uSampleInv = 1 / mapSamples;
  const c = [surface[0], surface[2], surface[1]]; // c.xzy in GLSL

  const p = Math.max(
    2,
    Math.floor(
      Math.log2(2.236068 * mapSamples * Math.PI * (1 - c[2] * c[2])) * 0.72021,
    ),
  );
  const g = [
    Math.floor((Math.pow(1.618034, p) / 2.236068) * 1 + 0.5),
    Math.floor((Math.pow(1.618034, p) / 2.236068) * 1.618034 + 0.5),
  ];
  const d = [
    fract((g[0] + 1) * 0.618034) * 6.283185 - 3.883222,
    fract((g[1] + 1) * 0.618034) * 6.283185 - 3.883222,
  ];
  const e = [-2 * g[0], -2 * g[1]];
  const f = [Math.atan2(c[1], c[0]), c[2] - 1];
  const det = d[0] * e[1] - e[0] * d[1];
  const q = [
    Math.floor((e[1] * f[0] - d[1] * (f[1] * mapSamples + 1)) / det),
    Math.floor((-e[0] * f[0] + d[0] * (f[1] * mapSamples + 1)) / det),
  ];

  let best = Math.PI;
  /** @type {[number, number, number]} */
  let nearest = [0, 0, 1];

  const peel = (j) => {
    let a = j;
    let b = 0;
    const steps = [
      [16384, 0.868872],
      [8192, 0.934436],
      [4096, 0.467218],
      [2048, 0.733609],
      [1024, 0.866804],
      [512, 0.433402],
      [256, 0.216701],
      [128, 0.108351],
      [64, 0.554175],
      [32, 0.777088],
      [16, 0.888544],
      [8, 0.944272],
      [4, 0.472136],
      [2, 0.236068],
      [1, 0.618034],
    ];
    for (const [limit, add] of steps) {
      if (a >= limit) {
        a -= limit;
        b += add;
      }
    }
    const ang = fract(b) * 6.283185;
    const zi = 1 - 2 * j * uSampleInv;
    const zm = Math.sqrt(Math.max(0, 1 - zi * zi));
    const o = [Math.cos(ang) * zm, Math.sin(ang) * zm, zi];
    const t = Math.hypot(c[0] - o[0], c[1] - o[1], c[2] - o[2]);
    return { o, t };
  };

  for (let h = 0; h < 4; h++) {
    const s = [h % 2, Math.floor(h * 0.5)];
    const j = g[0] * (q[0] + s[0]) + g[1] * (q[1] + s[1]);
    if (j > mapSamples) {
      continue;
    }
    const { o, t } = peel(j);
    if (t < best) {
      best = t;
      nearest = o;
    }
  }

  return {
    fib: [nearest[0], nearest[2], nearest[1]],
    dotDist: best,
  };
}

export { DEFAULT_MAP_SAMPLES };
