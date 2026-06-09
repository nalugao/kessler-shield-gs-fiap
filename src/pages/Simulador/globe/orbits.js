/**
 * Pure orbital + projection math for the debris layer — the JS mirror of the
 * debris vertex shader (src/globe/debris.js), so the geometry can be unit-tested
 * without a GL context, exactly like renderSim.js mirrors the globe shader.
 *
 * Coordinate contract (shared with the globe):
 *   - Globe space: right-handed, +Z = north pole. The Earth surface is the unit
 *     sphere (radius 1); debris orbit at radius R > 1 (R = 1 + altitude/Rₑ).
 *   - View space: `view = uRot · g` (GLSL `uRot * g`), the inverse of the globe
 *     fragment shader's `surface = ray · uRot`. view.xy is screen, view.z is depth
 *     (+ toward the camera). uRot is column-major.
 *   - Screen NDC: `ndc.xy = 0.8 · uScale · view.xy` (the surface sphere has radius
 *     0.8 in the fragment shader's uv space).
 *
 * @typedef {Object} OrbitElements
 * @property {number} radius   orbit radius in globe units (>1)
 * @property {number} incl     inclination (rad) — tilt of the orbital plane about +X
 * @property {number} node     longitude of ascending node (rad) — rotation about +Z
 * @property {number} phase0   phase at t=0 (rad)
 * @property {number} omega    angular speed (rad/s)
 */

export const EARTH_RADIUS_KM = 6371;

/** Orbit radius in globe units (surface = 1) for a given altitude. */
export function radiusForAltitude(altitudeKm) {
  return 1 + altitudeKm / EARTH_RADIUS_KM;
}

/**
 * Globe-space position of a debris object at time t. Circular orbit in its plane,
 * tilted by inclination about +X, then rotated by the node about +Z. Length is
 * always `radius` (rotations preserve it).
 * @param {OrbitElements} el
 * @param {number} t  seconds
 * @returns {[number, number, number]}
 */
export function orbitPosition(el, t) {
  const theta = el.phase0 + el.omega * t;
  const cx = el.radius * Math.cos(theta);
  const cy = el.radius * Math.sin(theta);
  // inclination about +X
  const ci = Math.cos(el.incl);
  const si = Math.sin(el.incl);
  const x1 = cx;
  const y1 = cy * ci;
  const z1 = cy * si;
  // ascending node about +Z
  const cn = Math.cos(el.node);
  const sn = Math.sin(el.node);
  return [x1 * cn - y1 * sn, x1 * sn + y1 * cn, z1];
}

/**
 * Globe → view: `view = uRot · g` for column-major mat3 uRot. Matches GLSL
 * `uRot * g` and is the transpose of the globe shader's `surface = ray · uRot`.
 * @param {ArrayLike<number>} m  column-major mat3
 * @param {[number, number, number]} g
 * @returns {[number, number, number]}
 */
export function projectToView(m, g) {
  return [
    m[0] * g[0] + m[3] * g[1] + m[6] * g[2],
    m[1] * g[0] + m[4] * g[1] + m[7] * g[2],
    m[2] * g[0] + m[5] * g[1] + m[8] * g[2],
  ];
}

/**
 * True when a debris point sits behind the Earth from the camera. The surface is
 * the unit sphere; a point inside the silhouette (rho < 1) is hidden when it lies
 * behind the near surface (view.z < √(1 − rho²)). Points at/beyond the limb
 * (rho ≥ 1) are never occluded.
 * @param {[number, number, number]} view
 */
export function isOccluded(view) {
  const rho2 = view[0] * view[0] + view[1] * view[1];
  if (rho2 >= 1) return false;
  return view[2] < Math.sqrt(1 - rho2);
}

/** Screen NDC of a view-space point. */
export function ndcXY(view, uScale) {
  return [0.8 * uScale * view[0], 0.8 * uScale * view[1]];
}

/**
 * How many instances of a shell's pool to light, as its population grows. Smooth,
 * monotonic, saturating toward the full pool: count = pool·(1 − e^(−N/scale)). The
 * actual debris count lives in the charts; the globe only needs a believable,
 * saturating density.
 * @param {number} N
 * @param {number} pool
 * @param {number} scale  N at which ~63% of the pool is lit
 */
export function activeFromN(N, pool, scale) {
  if (N <= 0) return 0;
  return Math.round(pool * (1 - Math.exp(-N / scale)));
}

/** Front-facing depth factor in [0,1] (0 = far limb/back, 1 = nearest point). */
export function depthFactor(view, radius) {
  return Math.max(0, Math.min(1, view[2] / radius * 0.5 + 0.5));
}
