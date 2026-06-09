/**
 * Geographic projection for the dot globe.
 *
 * Owns lat/lng ↔ unit-sphere surface ↔ equirectangular map UV.
 * No quaternions or view/camera math — see globe/view.js for orientation.
 *
 * The fragment shader must stay in sync — see `mapUVGlsl()`.
 */
const PI = Math.PI;

/** @typedef {{ lat: number, lng: number }} LatLngRad */
/** @typedef {[number, number, number]} SurfaceVec */

/** Default camera target — geographic center of Brazil (land, not Atlantic). */
export const INITIAL_VIEW = { latDeg: -14.235, lngDeg: -51.9253 };

export function degToRad(deg) {
  return (deg * PI) / 180;
}

export function radToDeg(rad) {
  return (rad * 180) / PI;
}

/** @param {number} latDeg @param {number} lngDeg @returns {LatLngRad} */
export function latLngDegToRad(latDeg, lngDeg) {
  return { lat: degToRad(latDeg), lng: degToRad(lngDeg) };
}

/**
 * Unit-sphere surface point in globe-fixed coordinates (+Y = north pole).
 * @param {number} latRad @param {number} lngRad @returns {SurfaceVec}
 */
export function latLngToSurface(latRad, lngRad) {
  const cosLat = Math.cos(latRad);
  return [
    -cosLat * Math.cos(lngRad),
    Math.sin(latRad),
    cosLat * Math.sin(lngRad),
  ];
}

/** @param {number} latDeg @param {number} lngDeg @returns {SurfaceVec} */
export function latLngDegToSurface(latDeg, lngDeg) {
  return latLngToSurface(degToRad(latDeg), degToRad(lngDeg));
}

/** @param {SurfaceVec} surface @returns {LatLngRad} */
export function surfaceToLatLng([x, y, z]) {
  const lat = Math.asin(Math.max(-1, Math.min(1, y)));
  const cosLat = Math.cos(lat);
  let lng = Math.acos(Math.max(-1, Math.min(1, -x / cosLat)));
  if (z < 0) {
    lng = -lng;
  }
  return { lat, lng };
}

/** @param {number} latRad @param {number} lngRad @returns {[number, number]} */
export function latLngToMapUV(latRad, lngRad) {
  // v = 0.5 - lat/π: north pole at v=0, matching world-map.png with UNPACK_FLIP_Y_WEBGL=false.
  return [lngRad * 0.5 / PI + 0.5, 0.5 - latRad / PI];
}

/** @param {number} latDeg @param {number} lngDeg @returns {[number, number]} */
export function latLngDegToMapUV(latDeg, lngDeg) {
  return latLngToMapUV(degToRad(latDeg), degToRad(lngDeg));
}

/** @param {number} u @param {number} v @returns {LatLngRad} */
export function mapUVToLatLng(u, v) {
  return {
    lat: (0.5 - v) * PI,
    lng: (u - 0.5) * 2 * PI,
  };
}

/** GLSL texture() — must match latLngToMapUV and globeEngine UNPACK_FLIP_Y=false. */
export function mapUVGlsl() {
  return "vec2(lng * 0.5 / 3.141593 + 0.5, 0.5 - lat / 3.141593)";
}

/** Geographic north tangent on the unit sphere at `surface`. @param {SurfaceVec} surface */
export function northTangentAt(surface) {
  const [tx, ty, tz] = surface;
  const nx = -tx * ty;
  const ny = 1 - ty * ty;
  const nz = -tz * ty;
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}

/** Geographic east tangent (right-handed: east × north = outward radial). @param {SurfaceVec} surface @param {SurfaceVec} north */
export function eastTangentAt(surface, north) {
  const [tx, ty, tz] = surface;
  const [nx, ny, nz] = north;
  const ex = ny * tz - nz * ty;
  const ey = nz * tx - nx * tz;
  const ez = nx * ty - ny * tx;
  const len = Math.hypot(ex, ey, ez) || 1;
  return [ex / len, ey / len, ez / len];
}
