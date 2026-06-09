/**
 * View ↔ globe orientation for the dot globe shader.
 *
 * Shader contract (globeEngine.js):
 *   ray   = normalize(vec3(screenNDC.xy, sqrt(0.64 - r²)))   // +Z at screen center
 *   surface = ray * uRot                                      // row-vector × column-major mat3
 *
 * uRot is column-major with rows [east | north | target] (each row is a globe-fixed
 * basis vector). GLSL `ray * uRot` yields dot(ray, column i), so row 2 (indices
 * m[2], m[5], m[8]) is the globe direction at viewport center when ray = (0,0,1).
 *
 * Quaternions (quat.js) store user orientation; this module builds the initial
 * view from lat/lng and provides shader-aligned ray helpers for validation.
 */
import {
  INITIAL_VIEW,
  eastTangentAt,
  latLngDegToMapUV,
  latLngDegToSurface,
  northTangentAt,
  radToDeg,
  surfaceToLatLng,
} from "./geo.js";
import { geoLatLngAtFrag, latLngAtFrag, viewportSamples } from "./shaderPath.js";
import { mat3ToQuat, quatToMat3 } from "./quat.js";

/** @typedef {[number, number, number]} Ray */
/** @typedef {import("./quat.js").Quat} Quat */

/** Screen-center view ray — matches globeEngine fragment shader. */
export const VIEW_CENTER_RAY = /** @type {Ray} */ ([0, 0, 1]);

/**
 * View-space ray from normalized device coords (matches shader `uv` before normalize).
 * @param {number} nx @param {number} ny @returns {Ray}
 */
export function viewRayFromNDC(nx, ny) {
  const len2 = nx * nx + ny * ny;
  const scale = len2 <= 0.64 ? Math.sqrt(0.64 - len2) : 1;
  const len = Math.hypot(nx, ny, scale) || 1;
  return [nx / len, ny / len, scale / len];
}

/**
 * Column-major mat3 for GLSL `surface = ray * uRot`.
 * Rows of the rotation are east, north, target (view +X, +Y, +Z in globe space).
 * @param {Ray} east @param {Ray} north @param {Ray} target
 * @returns {Float32Array}
 */
export function mat3ViewToGlobe(east, north, target) {
  return new Float32Array([
    east[0], north[0], target[0],
    east[1], north[1], target[1],
    east[2], north[2], target[2],
  ]);
}

/** Globe surface for a view ray — matches GLSL `surface = ray * uRot` exactly. */
export function surfaceFromRay(m, ray) {
  return [
    ray[0] * m[0] + ray[1] * m[1] + ray[2] * m[2],
    ray[0] * m[3] + ray[1] * m[4] + ray[2] * m[5],
    ray[0] * m[6] + ray[1] * m[7] + ray[2] * m[8],
  ];
}

/** Globe surface at shader screen center for `m`. */
export function centerSurfaceFromMat3(m) {
  return surfaceFromRay(m, VIEW_CENTER_RAY);
}

/** @param {Quat} q */
export function centerSurfaceFromQuat(q) {
  return centerSurfaceFromMat3(quatToMat3(q));
}

/** True when screen top (gl_FragCoord +Y) has higher latitude than center. */
export function isNorthUp(m, viewportSize = 512) {
  const { center, top } = viewportSamples(viewportSize);
  const centerGeo = geoLatLngAtFrag(m, ...center, viewportSize, viewportSize);
  const topGeo = geoLatLngAtFrag(m, ...top, viewportSize, viewportSize);
  if (!centerGeo || !topGeo) {
    return false;
  }
  return topGeo.lat > centerGeo.lat;
}

/**
 * Build view→globe mat3 that centers on lat/lng with geographic north toward screen top.
 * @param {number} latDeg @param {number} lngDeg @returns {Float32Array}
 */
export function mat3OrientationFromLatLng(latDeg, lngDeg) {
  const target = latLngDegToSurface(latDeg, lngDeg);
  const north = northTangentAt(target);
  const east = eastTangentAt(target, north);
  return mat3ViewToGlobe(east, north, target);
}

/** @param {number} latDeg @param {number} lngDeg @returns {Quat} */
export function orientationFromLatLng(latDeg, lngDeg) {
  return mat3ToQuat(mat3OrientationFromLatLng(latDeg, lngDeg));
}

/** @returns {Quat} */
export function initialOrientation() {
  return orientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
}

/** @param {number} latDeg @param {number} lngDeg */
export function viewConfig(latDeg = INITIAL_VIEW.latDeg, lngDeg = INITIAL_VIEW.lngDeg) {
  const m = mat3OrientationFromLatLng(latDeg, lngDeg);
  const center = centerSurfaceFromMat3(m);
  const geo = surfaceToLatLng(center);
  const target = latLngDegToSurface(latDeg, lngDeg);
  return {
    latDeg,
    lngDeg,
    mapUV: latLngDegToMapUV(latDeg, lngDeg),
    surface: target,
    centerSurface: center,
    centerLatDeg: radToDeg(geo.lat),
    centerLngDeg: radToDeg(geo.lng),
    centerError: Math.hypot(
      center[0] - target[0],
      center[1] - target[1],
      center[2] - target[2],
    ),
    northUp: isNorthUp(m),
  };
}

export { INITIAL_VIEW };
