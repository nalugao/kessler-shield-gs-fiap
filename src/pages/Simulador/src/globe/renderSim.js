/**
 * JavaScript mirror of globeEngine.js fragment land shading.
 * Used by unit tests to assert what the browser actually draws.
 */
import { latLngToMapUV, surfaceToLatLng } from "./geo.js";
import { DEFAULT_MAP_SAMPLES, fibNearest } from "./fib.js";
import { sampleMap } from "./mapSample.js";
import { surfaceFromRay } from "./view.js";
import { fragCoordToRay } from "./shaderPath.js";

/** @typedef {import("./mapSample.js").GrayMap} GrayMap */

export const RENDER_DEFAULTS = {
  scale: 1.02,
  offset: [0, 0],
  mapSamples: DEFAULT_MAP_SAMPLES,
  mapBrightness: 6.5,
  diffuse: 0.88,
  dark: 1,
  opacity: 0.94,
  mapBaseBrightness: 0,
};

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Land shading at a fragment — matches globeEngine fragment shader.
 * @param {Float32Array} mat3 column-major uRot
 * @param {number} fragX
 * @param {number} fragY
 * @param {number} width
 * @param {number} height
 * @param {GrayMap} map
 * @param {Partial<typeof RENDER_DEFAULTS>} [opts]
 */
export function landShadeAtFrag(mat3, fragX, fragY, width, height, map, opts = {}) {
  const cfg = { ...RENDER_DEFAULTS, ...opts };
  const ray = fragCoordToRay(fragX, fragY, width, height, cfg);
  if (!ray) {
    return null;
  }

  const surface = surfaceFromRay(mat3, ray);
  const { fib, dotDist } = fibNearest(surface, cfg.mapSamples);
  const { lat, lng } = surfaceToLatLng(fib);
  const [u, v] = latLngToMapUV(lat, lng);
  const mapVal = Math.max(sampleMap(map, u, v) / 255, cfg.mapBaseBrightness);

  const landMask = smoothstep(0.008, 0, dotDist);
  const facing = ray[2];
  const diffuse = Math.pow(Math.max(facing, 0), cfg.diffuse) * cfg.mapBrightness;
  const landLight = mapVal * landMask * diffuse;
  const shade =
    (1 - cfg.dark) * landLight +
    cfg.dark * ((1 - landLight) * Math.pow(Math.max(facing, 0), 0.4) + landLight) +
    0.1;

  return {
    ray,
    surface,
    fib,
    dotDist,
    lat,
    lng,
    mapVal,
    landMask,
    landLight,
    shade: shade * (1 + cfg.opacity) * 0.5,
  };
}

/** Max landLight in a neighborhood — catches visible dots near screen center. */
export function maxLandLightNear(
  mat3,
  fragX,
  fragY,
  width,
  height,
  map,
  radiusPx = 24,
  opts = {},
) {
  let best = 0;
  let bestSample = null;
  for (let dy = -radiusPx; dy <= radiusPx; dy += 4) {
    for (let dx = -radiusPx; dx <= radiusPx; dx += 4) {
      const sample = landShadeAtFrag(
        mat3,
        fragX + dx,
        fragY + dy,
        width,
        height,
        map,
        opts,
      );
      if (sample && sample.landLight > best) {
        best = sample.landLight;
        bestSample = sample;
      }
    }
  }
  return { landLight: best, sample: bestSample };
}
