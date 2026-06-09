import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INITIAL_VIEW, latLngDegToMapUV, radToDeg } from "../../src/globe/geo.js";
import { maxLandLightNear } from "../../src/globe/renderSim.js";
import { initialOrientation } from "../../src/globe/view.js";
import { tickGlobeFrame } from "../../src/globe/spin.js";
import { geoLatLngAtFrag, viewportSamples } from "../../src/globe/shaderPath.js";
import {
  MAP_LAND_THRESHOLD,
  loadWorldMap,
  sampleMapNeighborhood,
} from "../../src/globe/mapSample.js";
import { quatToMat3 } from "../../src/globe/quat.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const VIEWPORT = 512;
const MIN_LAND_LIGHT = 0.15;

/** Rough bounding box for Brazil (deg). */
const BRAZIL = {
  latMin: -33.75,
  latMax: 5.27,
  lngMin: -73.99,
  lngMax: -34.79,
};

/**
 * @param {Float32Array} mat column-major uRot for frame 0
 */
function assertFrame0CentersOnBrazil(mat) {
  const map = loadWorldMap();
  const { center } = viewportSamples(VIEWPORT);

  const geo = geoLatLngAtFrag(mat, ...center, VIEWPORT, VIEWPORT);
  assert.ok(geo, "screen center must hit the globe");

  const latDeg = radToDeg(geo.lat);
  const lngDeg = radToDeg(geo.lng);

  assert.ok(
    latDeg >= BRAZIL.latMin && latDeg <= BRAZIL.latMax,
    `center latitude ${latDeg.toFixed(2)}° must be inside Brazil`,
  );
  assert.ok(
    lngDeg >= BRAZIL.lngMin && lngDeg <= BRAZIL.lngMax,
    `center longitude ${lngDeg.toFixed(2)}° must be inside Brazil`,
  );

  const [u, v] = latLngDegToMapUV(latDeg, lngDeg);
  assert.ok(
    sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD,
    "screen center must sample land on world-map.png (not ocean)",
  );

  const { landLight } = maxLandLightNear(mat, ...center, VIEWPORT, VIEWPORT, map);
  assert.ok(
    landLight >= MIN_LAND_LIGHT,
    `visible land dots near center (landLight=${landLight}) — matches shader output`,
  );

  return { latDeg, lngDeg, uv: [u, v] };
}

describe("globe starts at Brazil", () => {
  it("INITIAL_VIEW is inside Brazil", () => {
    assert.ok(INITIAL_VIEW.latDeg >= BRAZIL.latMin);
    assert.ok(INITIAL_VIEW.latDeg <= BRAZIL.latMax);
    assert.ok(INITIAL_VIEW.lngDeg >= BRAZIL.lngMin);
    assert.ok(INITIAL_VIEW.lngDeg <= BRAZIL.lngMax);
  });

  it("initialOrientation places geographic center on INITIAL_VIEW", () => {
    const mat = quatToMat3(initialOrientation());
    const geo = geoLatLngAtFrag(mat, ...viewportSamples(VIEWPORT).center, VIEWPORT, VIEWPORT);
    assert.ok(geo);
    assert.ok(Math.abs(radToDeg(geo.lat) - INITIAL_VIEW.latDeg) < 0.02);
    assert.ok(Math.abs(radToDeg(geo.lng) - INITIAL_VIEW.lngDeg) < 0.02);
  });

  it("first rendered frame (Globe bootstrap) centers on Brazil with visible land", () => {
    const orientationRef = initialOrientation();
    const { mat } = tickGlobeFrame(orientationRef, false);
    const { latDeg, lngDeg } = assertFrame0CentersOnBrazil(mat);
    assert.ok(
      Math.abs(latDeg - INITIAL_VIEW.latDeg) < 0.02 &&
        Math.abs(lngDeg - INITIAL_VIEW.lngDeg) < 0.02,
      "first frame center must match INITIAL_VIEW",
    );
  });

  it("Globe.jsx seeds orientation from initialOrientation()", () => {
    const src = readFileSync(join(root, "src/globe/Globe.jsx"), "utf8");
    assert.ok(
      src.includes("useRef(initialOrientation())"),
      "Globe must start with initialOrientation(), not identity or cobe defaults",
    );
    assert.ok(src.includes("orientationRef.current = initialOrientation()"));
  });

  it("declared map UV for INITIAL_VIEW is western-hemisphere Brazil land", () => {
    const map = loadWorldMap();
    const [u, v] = latLngDegToMapUV(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    assert.ok(u < 0.5, "Brazil is west of Greenwich");
    assert.ok(
      sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD,
      "INITIAL_VIEW map pixel must be land",
    );
  });
});
