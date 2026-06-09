import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_VIEW, radToDeg } from "../../src/globe/geo.js";
import { quatToMat3 } from "../../src/globe/quat.js";
import {
  fragCoordToRay,
  geoLatLngAtFrag,
  latLngAtFrag,
  mapUVAtFrag,
  viewportSamples,
} from "../../src/globe/shaderPath.js";
import {
  MAP_LAND_THRESHOLD,
  loadWorldMap,
  sampleMapNeighborhood,
} from "../../src/globe/mapSample.js";
import {
  initialOrientation,
  isNorthUp,
  mat3OrientationFromLatLng,
  orientationFromLatLng,
  surfaceFromRay,
  viewRayFromNDC,
  VIEW_CENTER_RAY,
} from "../../src/globe/view.js";

const VIEWPORT = 512;

describe("view orientation", () => {
  const m = mat3OrientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);

  it("centers on target lat/lng", () => {
    const geo = geoLatLngAtFrag(m, ...viewportSamples(VIEWPORT).center, VIEWPORT, VIEWPORT);
    assert.ok(geo);
    assert.ok(Math.abs(radToDeg(geo.lat) - INITIAL_VIEW.latDeg) < 0.01);
    assert.ok(Math.abs(radToDeg(geo.lng) - INITIAL_VIEW.lngDeg) < 0.01);
  });

  it("is north-up in shader screen space", () => {
    assert.equal(isNorthUp(m), true);
    const { center, top, bottom } = viewportSamples(VIEWPORT);
    const centerGeo = geoLatLngAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    const topGeo = geoLatLngAtFrag(m, ...top, VIEWPORT, VIEWPORT);
    const bottomGeo = geoLatLngAtFrag(m, ...bottom, VIEWPORT, VIEWPORT);
    assert.ok(centerGeo && topGeo && bottomGeo);
    assert.ok(topGeo.lat > centerGeo.lat, "screen top must be higher latitude");
    assert.ok(bottomGeo.lat < centerGeo.lat, "screen bottom must be lower latitude");
  });

  it("quaternion round-trip preserves mat3", () => {
    const mQuat = quatToMat3(orientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg));
    for (let i = 0; i < 9; i++) {
      assert.ok(Math.abs(m[i] - mQuat[i]) < 1e-6);
    }
  });

  it("initialOrientation matches direct mat3 path", () => {
    const mInit = quatToMat3(initialOrientation());
    for (let i = 0; i < 9; i++) {
      assert.ok(Math.abs(m[i] - mInit[i]) < 1e-6);
    }
  });

  it("row 2 of uRot is the globe direction at view center (GLSL ray * uRot)", () => {
    const row2 = [m[2], m[5], m[8]];
    const fromRay = surfaceFromRay(m, VIEW_CENTER_RAY);
    for (let i = 0; i < 3; i++) {
      assert.ok(Math.abs(row2[i] - fromRay[i]) < 1e-8);
    }
  });
});

describe("shader path integration", () => {
  const m = mat3OrientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
  const map = loadWorldMap();

  it("viewRayFromNDC matches fragCoordToRay at viewport center", () => {
    const c = VIEWPORT / 2;
    const fromFrag = fragCoordToRay(c, c, VIEWPORT, VIEWPORT);
    const fromNdc = viewRayFromNDC(0, 0);
    assert.ok(fromFrag);
    for (let i = 0; i < 3; i++) {
      assert.ok(Math.abs(fromFrag[i] - fromNdc[i]) < 1e-5);
    }
  });

  it("screen center samples land on world-map.png", () => {
    const { center } = viewportSamples(VIEWPORT);
    const uv = mapUVAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    assert.ok(uv);
    assert.ok(
      sampleMapNeighborhood(map, uv[0], uv[1]) >= MAP_LAND_THRESHOLD,
      "Brazil center must sample land through full shader path",
    );
  });

  it("screen top samples higher-latitude land than center", () => {
    const { center, top } = viewportSamples(VIEWPORT);
    const centerUV = mapUVAtFrag(m, ...center, VIEWPORT, VIEWPORT);
    const topUV = mapUVAtFrag(m, ...top, VIEWPORT, VIEWPORT);
    assert.ok(centerUV && topUV);
    assert.ok(topUV[1] < centerUV[1], "north should be at lower map v");
    assert.ok(
      sampleMapNeighborhood(map, topUV[0], topUV[1]) >= MAP_LAND_THRESHOLD,
      "land visible north of Brazil",
    );
  });
});
