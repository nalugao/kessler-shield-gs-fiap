import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INITIAL_VIEW,
  degToRad,
  eastTangentAt,
  latLngDegToMapUV,
  latLngDegToSurface,
  latLngToMapUV,
  latLngToSurface,
  mapUVToLatLng,
  northTangentAt,
  radToDeg,
  surfaceToLatLng,
} from "../../src/globe/geo.js";
import {
  MAP_LAND_THRESHOLD,
  loadWorldMap,
  sampleMap,
  sampleMapNeighborhood,
} from "../../src/globe/mapSample.js";

describe("geo projection", () => {
  it("latLngToSurface ↔ surfaceToLatLng round-trips", () => {
    for (const [latDeg, lngDeg] of [
      [0, 0],
      [45, 90],
      [-15, -47],
      [-33, 151],
      [72, -40],
    ]) {
      const surface = latLngDegToSurface(latDeg, lngDeg);
      const back = surfaceToLatLng(surface);
      assert.ok(Math.abs(radToDeg(back.lat) - latDeg) < 1e-5);
      assert.ok(Math.abs(radToDeg(back.lng) - lngDeg) < 1e-5);
    }
  });

  it("mapUV ↔ latLng round-trips", () => {
    for (const [latDeg, lngDeg] of [
      [0, 0],
      [-15, -47],
      [60, -120],
    ]) {
      const [u, v] = latLngDegToMapUV(latDeg, lngDeg);
      const back = mapUVToLatLng(u, v);
      assert.ok(Math.abs(radToDeg(back.lat) - latDeg) < 1e-5);
      assert.ok(Math.abs(radToDeg(back.lng) - lngDeg) < 1e-5);
    }
  });

  it("north pole maps to v=0 (UNPACK_FLIP_Y=false convention)", () => {
    const [, v] = latLngToMapUV(Math.PI / 2, 0);
    assert.ok(Math.abs(v) < 1e-6);
  });

  it("south pole maps to v=1", () => {
    const [, v] = latLngToMapUV(-Math.PI / 2, 0);
    assert.ok(Math.abs(v - 1) < 1e-6);
  });

  it("tangent frame is orthonormal with east × north = radial", () => {
    const target = latLngDegToSurface(-15, -47);
    const north = northTangentAt(target);
    const east = eastTangentAt(target, north);
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];

    assert.ok(Math.abs(dot(target, north)) < 1e-6);
    assert.ok(Math.abs(dot(target, east)) < 1e-6);
    assert.ok(Math.abs(dot(north, east)) < 1e-6);
    assert.ok(Math.abs(dot(north, north) - 1) < 1e-6);
    assert.ok(Math.abs(dot(east, east) - 1) < 1e-6);

    const radial = cross(east, north);
    for (let i = 0; i < 3; i++) {
      assert.ok(Math.abs(radial[i] - target[i]) < 1e-5);
    }
  });
});

describe("map UV landmarks on world-map.png", () => {
  const map = loadWorldMap();

  it("Brazil INITIAL_VIEW is in the western hemisphere on land", () => {
    const [u, v] = latLngDegToMapUV(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    assert.ok(u < 0.5, "Brazil is in the western hemisphere");
    assert.ok(
      sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD,
      `expected land at INITIAL_VIEW (${INITIAL_VIEW.latDeg}, ${INITIAL_VIEW.lngDeg})`,
    );
  });

  it("Brasília coords are not used (coastal / sparse-map gap)", () => {
    const [u, v] = latLngDegToMapUV(-15, -47);
    // Still land in neighborhood, but INITIAL_VIEW should be more central
    assert.ok(sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD);
    assert.notDeepEqual(INITIAL_VIEW, { latDeg: -15, lngDeg: -47 });
  });

  it("map V decreases toward north (v=0 north pole, v=1 south pole)", () => {
    const [, vNorth] = latLngDegToMapUV(45, 0);
    const [, vEquator] = latLngDegToMapUV(0, 0);
    const [, vSouth] = latLngDegToMapUV(-45, 0);
    assert.ok(vNorth < vEquator);
    assert.ok(vEquator < vSouth);
  });

  it("mid-Pacific is ocean", () => {
    const [u, v] = latLngDegToMapUV(0, -160);
    assert.ok(sampleMap(map, u, v) < MAP_LAND_THRESHOLD);
  });

  it("equatorial Africa is land", () => {
    const [u, v] = latLngDegToMapUV(0, 20);
    assert.ok(sampleMapNeighborhood(map, u, v) >= MAP_LAND_THRESHOLD);
  });
});
