import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INITIAL_VIEW, radToDeg } from "../../src/globe/geo.js";
import { initialOrientation, viewConfig } from "../../src/globe/view.js";
import { tickGlobeFrame } from "../../src/globe/spin.js";
import { geoLatLngAtFrag, mapUVAtFrag, viewportSamples } from "../../src/globe/shaderPath.js";
import { maxLandLightNear } from "../../src/globe/renderSim.js";
import {
  MAP_LAND_THRESHOLD,
  loadWorldMap,
  sampleMapNeighborhood,
} from "../../src/globe/mapSample.js";
import { quatToMat3 } from "../../src/globe/quat.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const VIEWPORT = 512;

describe("initial view contract", () => {
  const map = loadWorldMap();
  const cfg = viewConfig();

  it("INITIAL_VIEW targets Brazil (western hemisphere, inland)", () => {
    assert.ok(cfg.mapUV[0] < 0.5);
    assert.ok(cfg.latDeg > -25 && cfg.latDeg < 0);
    assert.ok(cfg.lngDeg < -35 && cfg.lngDeg > -65);
  });

  it("initial orientation centers on INITIAL_VIEW at frame 0", () => {
    const m = quatToMat3(initialOrientation());
    const geo = geoLatLngAtFrag(m, ...viewportSamples(VIEWPORT).center, VIEWPORT, VIEWPORT);
    assert.ok(geo);
    assert.ok(Math.abs(radToDeg(geo.lat) - INITIAL_VIEW.latDeg) < 0.02);
    assert.ok(Math.abs(radToDeg(geo.lng) - INITIAL_VIEW.lngDeg) < 0.02);
  });

  it("frame 0 center has visible land dots (shader render path)", () => {
    const m = quatToMat3(initialOrientation());
    const { center } = viewportSamples(VIEWPORT);
    const { landLight } = maxLandLightNear(m, ...center, VIEWPORT, VIEWPORT, map);
    assert.ok(landLight >= 0.15, `frame 0 must show land near center (landLight=${landLight})`);
  });

  it("frame 0 is north-up", () => {
    assert.equal(cfg.northUp, true);
  });
});

describe("spin does not break invariants immediately", () => {
  const map = loadWorldMap();

  it("after 1 tick still on land at center", () => {
    let o = initialOrientation();
    const { mat } = tickGlobeFrame(o, false);
    const { center } = viewportSamples(VIEWPORT);
    const { landLight } = maxLandLightNear(mat, ...center, VIEWPORT, VIEWPORT, map);
    assert.ok(landLight >= 0.1, "one spin step should still show land near Brazil");
  });
});

describe("module layout contract", () => {
  it("geo.js has no quaternions or spin", () => {
    const src = readFileSync(join(root, "src/globe/geo.js"), "utf8");
    assert.ok(!src.includes('from "./quat'), "geo must not import quat");
    assert.ok(!src.includes("./spin"));
  });

  it("view.js owns orientation from lat/lng", () => {
    const src = readFileSync(join(root, "src/globe/view.js"), "utf8");
    assert.ok(src.includes("mat3OrientationFromLatLng"));
    assert.ok(src.includes("initialOrientation"));
  });

  it("shaderPath.js mirrors shader ray math", () => {
    const src = readFileSync(join(root, "src/globe/shaderPath.js"), "utf8");
    assert.ok(src.includes("fragCoordToRay"));
    assert.ok(src.includes("0.64"));
    assert.ok(src.includes("geoLatLngAtFrag"));
  });

  it("renderSim.js simulates fib + landMask shading", () => {
    const src = readFileSync(join(root, "src/globe/renderSim.js"), "utf8");
    assert.ok(src.includes("fibNearest"));
    assert.ok(src.includes("landMask"));
  });
});
