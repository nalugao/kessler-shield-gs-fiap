import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_VIEW, radToDeg } from "../../src/globe/geo.js";
import { maxLandLightNear, landShadeAtFrag } from "../../src/globe/renderSim.js";
import { loadWorldMap, sampleMapNeighborhood } from "../../src/globe/mapSample.js";
import { tickGlobeFrame } from "../../src/globe/spin.js";
import { geoLatLngAtFrag, latLngAtFrag, viewportSamples } from "../../src/globe/shaderPath.js";
import {
  initialOrientation,
  mat3OrientationFromLatLng,
  surfaceFromRay,
} from "../../src/globe/view.js";
import { quatToMat3 } from "../../src/globe/quat.js";

const VIEWPORT = 512;
const MIN_LAND_LIGHT = 0.15;

/** Rough bounding box for Brazil (deg). */
const BRAZIL = {
  latMin: -33.75,
  latMax: 5.27,
  lngMin: -73.99,
  lngMax: -34.79,
};

describe("GLSL surface = ray * uRot", () => {
  it("surfaceFromRay matches GLSL column-dot formula", () => {
    const m = mat3OrientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    const ray = [0.12, -0.08, 0.99];
    const len = Math.hypot(...ray);
    const u = [ray[0] / len, ray[1] / len, ray[2] / len];
    const glsl = [
      u[0] * m[0] + u[1] * m[1] + u[2] * m[2],
      u[0] * m[3] + u[1] * m[4] + u[2] * m[5],
      u[0] * m[6] + u[1] * m[7] + u[2] * m[8],
    ];
    const js = surfaceFromRay(m, u);
    for (let i = 0; i < 3; i++) {
      assert.ok(Math.abs(glsl[i] - js[i]) < 1e-12);
    }
  });
});

describe("Brazil at viewport center", () => {
  const m = quatToMat3(initialOrientation());
  const map = loadWorldMap();
  const { center, left, right, top } = viewportSamples(VIEWPORT);

  it("screen center is geographic INITIAL_VIEW", () => {
    const geo = geoLatLngAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    assert.ok(geo);
    assert.ok(Math.abs(radToDeg(geo.lat) - INITIAL_VIEW.latDeg) < 0.02);
    assert.ok(Math.abs(radToDeg(geo.lng) - INITIAL_VIEW.lngDeg) < 0.02);
  });

  it("screen right is east of center", () => {
    const centerGeo = geoLatLngAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    const rightGeo = geoLatLngAtFrag(m, ...right, VIEWPORT, VIEWPORT);
    assert.ok(centerGeo && rightGeo);
    assert.ok(rightGeo.lng > centerGeo.lng);
  });

  it("screen top is north of center", () => {
    const centerGeo = geoLatLngAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    const topGeo = geoLatLngAtFrag(m, ...top, VIEWPORT, VIEWPORT);
    assert.ok(centerGeo && topGeo);
    assert.ok(topGeo.lat > centerGeo.lat);
  });

  it("screen left is west of center", () => {
    const centerGeo = geoLatLngAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    const leftGeo = geoLatLngAtFrag(m, ...left, VIEWPORT, VIEWPORT);
    assert.ok(centerGeo && leftGeo);
    assert.ok(leftGeo.lng < centerGeo.lng);
  });
});

describe("render path (fib + landMask) at frame 0", () => {
  const map = loadWorldMap();

  it("first frame shows Brazil land dots near screen center", () => {
    const { mat } = tickGlobeFrame(initialOrientation(), false);
    const { center } = viewportSamples(VIEWPORT);
    const { landLight, sample } = maxLandLightNear(
      mat,
      ...center,
      VIEWPORT,
      VIEWPORT,
      map,
    );
    assert.ok(
      landLight >= MIN_LAND_LIGHT,
      `expected visible land dots near center (landLight=${landLight})`,
    );
    assert.ok(sample);
    const latDeg = radToDeg(sample.lat);
    const lngDeg = radToDeg(sample.lng);
    assert.ok(latDeg >= BRAZIL.latMin && latDeg <= BRAZIL.latMax);
    assert.ok(lngDeg >= BRAZIL.lngMin && lngDeg <= BRAZIL.lngMax);
  });

  it("fib lat/lng at center samples land on world-map.png", () => {
    const m = quatToMat3(initialOrientation());
    const geo = latLngAtFrag(m, ...viewportSamples(VIEWPORT).center, VIEWPORT, VIEWPORT);
    assert.ok(geo);
    const [u, v] = [geo.lng * 0.5 / Math.PI + 0.5, 0.5 - geo.lat / Math.PI];
    assert.ok(sampleMapNeighborhood(map, u, v) >= 128);
  });

  it("frame 0 center shade is non-zero", () => {
    const { mat } = tickGlobeFrame(initialOrientation(), false);
    const shade = landShadeAtFrag(
      mat,
      ...viewportSamples(VIEWPORT).center,
      VIEWPORT,
      VIEWPORT,
      map,
    );
    assert.ok(shade);
    assert.ok(shade.shade > 0.05 || shade.landLight > 0);
  });
});
