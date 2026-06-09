/**
 * JavaScript mirror of globeEngine.js fragment-shader view math.
 * Keeps ray construction and lat/lng extraction identical to GLSL.
 */
import { latLngToMapUV, surfaceToLatLng } from "./geo.js";
import { DEFAULT_MAP_SAMPLES, fibNearest } from "./fib.js";
import { surfaceFromRay } from "./view.js";

/** Default globeEngine uniforms. */
export const SHADER_DEFAULTS = {
  scale: 1.02,
  offset: [0, 0],
};

/**
 * Fragment-shader NDC `uv` before normalize (globeEngine line 82–83).
 * @param {number} fragX gl_FragCoord.x (origin bottom-left)
 * @param {number} fragY gl_FragCoord.y
 * @param {number} width
 * @param {number} height
 * @param {{ scale?: number, offset?: [number, number] }} [opts]
 * @returns {[number, number] | null} null outside the globe disc (r² > 0.64)
 */
export function fragCoordToNdc(fragX, fragY, width, height, opts = {}) {
  const { scale = SHADER_DEFAULTS.scale, offset = SHADER_DEFAULTS.offset } = opts;
  const invX = 1 / width;
  const invY = 1 / height;
  let uvX = (fragX * invX * 2 - 1) / scale - offset[0] * invX;
  let uvY = (fragY * invY * 2 - 1) / scale - offset[1] * -1 * invY;
  uvX *= width * invY;
  const r2 = uvX * uvX + uvY * uvY;
  if (r2 > 0.64) {
    return null;
  }
  return [uvX, uvY];
}

/**
 * Unit view ray from fragment coordinates — matches `normalize(vec3(uv, sqrt(0.64-r²)))`.
 */
export function fragCoordToRay(fragX, fragY, width, height, opts = {}) {
  const ndc = fragCoordToNdc(fragX, fragY, width, height, opts);
  if (!ndc) {
    return null;
  }
  const [uvX, uvY] = ndc;
  const r2 = uvX * uvX + uvY * uvY;
  const z = Math.sqrt(0.64 - r2);
  const len = Math.hypot(uvX, uvY, z) || 1;
  return [uvX / len, uvY / len, z / len];
}

/**
 * Lat/lng at a fragment — matches shader (fib lattice point, not raw surface).
 * @param {Float32Array} mat3
 * @param {number} [mapSamples]
 */
export function latLngAtFrag(
  mat3,
  fragX,
  fragY,
  width,
  height,
  opts = {},
  mapSamples = DEFAULT_MAP_SAMPLES,
) {
  const ray = fragCoordToRay(fragX, fragY, width, height, opts);
  if (!ray) {
    return null;
  }
  const surface = surfaceFromRay(mat3, ray);
  const { fib } = fibNearest(surface, mapSamples);
  return surfaceToLatLng(fib);
}

/** Geographic lat/lng of the ray intersection (no fib snap) — for orientation checks. */
export function geoLatLngAtFrag(mat3, fragX, fragY, width, height, opts = {}) {
  const ray = fragCoordToRay(fragX, fragY, width, height, opts);
  if (!ray) {
    return null;
  }
  return surfaceToLatLng(surfaceFromRay(mat3, ray));
}

/** Map UV at a fragment — surface → lat/lng → map UV. */
export function mapUVAtFrag(mat3, fragX, fragY, width, height, opts = {}) {
  const geo = latLngAtFrag(mat3, fragX, fragY, width, height, opts);
  if (!geo) {
    return null;
  }
  return latLngToMapUV(geo.lat, geo.lng);
}

/** Screen sample points for a square viewport (gl_FragCoord, origin bottom-left). */
export function viewportSamples(size) {
  const c = size / 2;
  return {
    center: [c, c],
    top: [c, (2 * size) / 3],
    bottom: [c, size / 3],
    left: [size / 3, c],
    right: [(2 * size) / 3, c],
  };
}
