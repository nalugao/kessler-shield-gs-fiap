import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INITIAL_VIEW, radToDeg } from "../../src/globe/geo.js";
import {
  SPIN_AXIS,
  SPIN_SPEED,
  stepAutoSpin,
  tickGlobeFrame,
} from "../../src/globe/spin.js";
import { orientationFromLatLng } from "../../src/globe/view.js";
import { quatToMat3 } from "../../src/globe/quat.js";
import { geoLatLngAtFrag, viewportSamples } from "../../src/globe/shaderPath.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const VIEWPORT = 512;

function centerLng(orientation) {
  const m = quatToMat3(orientation);
  const geo = geoLatLngAtFrag(m, ...viewportSamples(VIEWPORT).center, VIEWPORT, VIEWPORT);
  assert.ok(geo);
  return radToDeg(geo.lng);
}

describe("globeSpin", () => {
  it("SPIN_SPEED is positive magnitude", () => {
    assert.ok(SPIN_SPEED > 0);
  });

  it("stepAutoSpin changes orientation every frame when not dragging", () => {
    const start = orientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    const next = stepAutoSpin(start, false);
    let diff = 0;
    for (let i = 0; i < 4; i++) {
      diff += Math.abs(start[i] - next[i]);
    }
    assert.ok(diff > 1e-6, "orientation must change each spin step");
  });

  it("stepAutoSpin does not change orientation while dragging", () => {
    const start = orientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    const next = stepAutoSpin(start, true);
    for (let i = 0; i < 4; i++) {
      assert.equal(start[i], next[i]);
    }
  });

  it("tickGlobeFrame always advances orientation when not dragging", () => {
    let o = orientationFromLatLng(INITIAL_VIEW.latDeg, INITIAL_VIEW.lngDeg);
    const lng0 = centerLng(o);
    for (let frame = 0; frame < 120; frame++) {
      const { mat, orientation } = tickGlobeFrame(o, false);
      assert.ok(mat instanceof Float32Array);
      assert.notDeepEqual(orientation, o, `frame ${frame}: must spin every tick`);
      o = orientation;
    }
    const lng1 = centerLng(o);
    assert.ok(Math.abs(lng1 - lng0) > 5, "120 frames must move center longitude");
  });

  it("spin axis is view +Y", () => {
    assert.deepEqual(SPIN_AXIS, [0, 1, 0]);
  });
});

describe("Globe.jsx spin contract", () => {
  const globeSrc = readFileSync(join(root, "src/globe/Globe.jsx"), "utf8");

  it("must use spin module", () => {
    assert.ok(
      globeSrc.includes("./spin.js"),
      "Globe.jsx must delegate spin policy to src/globe/spin.js",
    );
  });

  it("drives spin from the simulation clock (freezes on pause, scales with speed)", () => {
    // Spin angle is derived from elapsed simulated days, not a fixed per-frame step,
    // so the globe stops when the sim is paused and turns faster at higher time-speed.
    assert.ok(globeSrc.includes("SPIN_RAD_PER_SIM_DAY"), "spin scaled by sim-time");
    assert.ok(
      globeSrc.includes("tickGlobeFrame(") && globeSrc.includes("spinAngle"),
      "must pass a sim-time-derived angle into tickGlobeFrame",
    );
  });
});

describe("globe engine shader contract", () => {
  const shaderSrc = readFileSync(join(root, "src/globe/engine.js"), "utf8");

  it("map UV uses fib lattice lat/lng (cobe contract)", () => {
    assert.ok(shaderSrc.includes("clamp(fib.y"), "lat from fib.y");
    assert.ok(shaderSrc.includes("0.5 - lat / 3.141593"), "correct map V");
    assert.ok(!shaderSrc.match(/asin\(clamp\(surface\.y/), "must not use surface.y for map lat");
  });
});

describe("geo.js map UV contract", () => {
  const geoSrc = readFileSync(join(root, "src/globe/geo.js"), "utf8");

  it("latLngToMapUV uses 0.5 - lat/π for V", () => {
    assert.ok(geoSrc.includes("0.5 - latRad / PI"));
  });
});
