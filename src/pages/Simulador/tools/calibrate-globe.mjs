#!/usr/bin/env node
/**
 * Validates geo projection + view orientation + map sampling.
 * Usage: npm run calibrate:globe
 */
import {
  INITIAL_VIEW,
  latLngDegToMapUV,
  latLngDegToSurface,
  surfaceToLatLng,
} from "../src/globe/geo.js";
import {
  MAP_LAND_THRESHOLD,
  loadWorldMap,
  sampleMapNeighborhood,
} from "../src/globe/mapSample.js";
import {
  centerSurfaceFromQuat,
  isNorthUp,
  mat3OrientationFromLatLng,
  orientationFromLatLng,
  viewConfig,
} from "../src/globe/view.js";
import { mapUVAtFrag, viewportSamples } from "../src/globe/shaderPath.js";

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

const map = loadWorldMap();
const cfg = viewConfig();
const [u, v] = cfg.mapUV;
const m = mat3OrientationFromLatLng(cfg.latDeg, cfg.lngDeg);
const centerUV = mapUVAtFrag(m, ...viewportSamples(512).center, 512, 512);

console.log("=== globe orientation calibration ===");
console.log(
  JSON.stringify(
    {
      ...cfg,
      centerMapBrightness: sampleMapNeighborhood(map, u, v),
      shaderCenterMapBrightness: centerUV
        ? sampleMapNeighborhood(map, centerUV[0], centerUV[1])
        : 0,
    },
    null,
    2,
  ),
);

assert(cfg.centerError < 1e-6, `center surface error: ${cfg.centerError}`);
assert(isNorthUp(m), "orientation must be north-up (screen top has higher latitude)");
assert(cfg.northUp, "viewConfig northUp flag");
assert(u < 0.5, `Brazil western hemisphere (u=${u.toFixed(4)})`);
assert(
  Math.abs(cfg.centerLatDeg - cfg.latDeg) < 0.01 &&
    Math.abs(cfg.centerLngDeg - cfg.lngDeg) < 0.01,
  `center geo (${cfg.centerLatDeg}, ${cfg.centerLngDeg}) != target (${cfg.latDeg}, ${cfg.lngDeg})`,
);

assert(
  sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD,
  "geo map UV must sample land at Brazil",
);
assert(
  centerUV && sampleMapNeighborhood(map, centerUV[0], centerUV[1]) >= MAP_LAND_THRESHOLD,
  "shader-path center must sample land at Brazil",
);

const roundTrip = surfaceToLatLng(latLngDegToSurface(cfg.latDeg, cfg.lngDeg));
assert(
  Math.abs(radToDeg(roundTrip.lat) - cfg.latDeg) < 0.01 &&
    Math.abs(radToDeg(roundTrip.lng) - cfg.lngDeg) < 0.01,
  "surfaceToLatLng ∘ latLngToSurface failed",
);

const q = orientationFromLatLng(cfg.latDeg, cfg.lngDeg);
const center = surfaceToLatLng(centerSurfaceFromQuat(q));
assert(
  Math.abs(radToDeg(center.lat) - cfg.latDeg) < 0.01 &&
    Math.abs(radToDeg(center.lng) - cfg.lngDeg) < 0.01,
  "orientationFromLatLng center mismatch",
);

console.log("OK —", INITIAL_VIEW);
console.log("quaternion:", q);
