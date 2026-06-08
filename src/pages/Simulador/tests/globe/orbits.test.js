import test from "node:test";
import assert from "node:assert/strict";
import {
  radiusForAltitude,
  orbitPosition,
  projectToView,
  isOccluded,
  ndcXY,
  activeFromN,
  depthFactor,
} from "../../src/globe/orbits.js";
import { quatToMat3 } from "../../src/globe/quat.js";

const len = (v) => Math.hypot(v[0], v[1], v[2]);
const approx = (a, b, tol, msg) =>
  assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} expected ${b}, got ${a}`);

test("radiusForAltitude is above the surface and ordered by altitude", () => {
  assert.ok(radiusForAltitude(450) > 1);
  assert.ok(radiusForAltitude(900) > radiusForAltitude(450));
  approx(radiusForAltitude(6371), 2, 1e-9, "one Earth radius up ⇒ radius 2");
});

test("orbitPosition keeps the orbit radius for any time / element set", () => {
  const el = { radius: 1.1, incl: 0.9, node: 2.1, phase0: 0.3, omega: 0.7 };
  for (const t of [0, 0.5, 1, 3.3, 10]) {
    approx(len(orbitPosition(el, t)), 1.1, 1e-12, `|g| at t=${t}`);
  }
});

test("zero-inclination orbit stays in the equatorial (z=0) plane", () => {
  const el = { radius: 1.2, incl: 0, node: 1.0, phase0: 0.4, omega: 1.3 };
  for (const t of [0, 1, 2]) approx(orbitPosition(el, t)[2], 0, 1e-12, "z");
});

test("a polar orbit (incl=90°, node=0) sweeps through the pole", () => {
  // node=0 keeps the plane in x–z; at θ=90° the point is at +Z (north pole · radius).
  const el = { radius: 1.0, incl: Math.PI / 2, node: 0, phase0: Math.PI / 2, omega: 1 };
  const g = orbitPosition(el, 0);
  approx(g[2], 1.0, 1e-12, "reaches the pole");
});

test("projectToView equals uRot·g and preserves length (orthonormal)", () => {
  const m = quatToMat3([0.1, 0.5, -0.3, 0.8]); // arbitrary orientation (normalized inside)
  const g = orbitPosition({ radius: 1.13, incl: 1.0, node: 0.5, phase0: 0.2, omega: 1 }, 1.7);
  const v = projectToView(m, g);
  approx(len(v), len(g), 1e-6, "rotation preserves length");
});

test("projectToView with a 90°-about-Z rotation maps +X → +Y", () => {
  // Rotation of globe by +90° about Z (column-major): [cos,sin,0, -sin,cos,0, 0,0,1]
  const m = new Float32Array([0, 1, 0, -1, 0, 0, 0, 0, 1]);
  const v = projectToView(m, [1, 0, 0]);
  approx(v[0], 0, 1e-7, "x");
  approx(v[1], 1, 1e-7, "y");
});

test("occlusion: behind the Earth is hidden, front and limb are visible", () => {
  assert.equal(isOccluded([0, 0, -1.1]), true, "directly behind");
  assert.equal(isOccluded([0, 0, 1.1]), false, "directly in front");
  assert.equal(isOccluded([1.1, 0, 0]), false, "beyond the limb (rho>1)");
  assert.equal(isOccluded([0.3, 0, 0.99]), false, "just in front within silhouette");
  assert.equal(isOccluded([0.3, 0, -0.99]), true, "just behind within silhouette");
});

test("ndcXY applies the 0.8·uScale screen factor", () => {
  assert.deepEqual(ndcXY([0.5, -0.25, 0.9], 1.02), [0.8 * 1.02 * 0.5, 0.8 * 1.02 * -0.25]);
});

test("activeFromN is 0 at N=0, monotonic, and saturates below the pool", () => {
  const pool = 1000;
  const scale = 3000;
  assert.equal(activeFromN(0, pool, scale), 0);
  let prev = -1;
  for (const N of [100, 1000, 3000, 10000, 1e6]) {
    const c = activeFromN(N, pool, scale);
    assert.ok(c >= prev, `monotonic at N=${N}`);
    assert.ok(c <= pool, `never exceeds pool at N=${N}`);
    prev = c;
  }
  assert.ok(activeFromN(1e9, pool, scale) >= pool - 1, "saturates to ~pool");
});

test("depthFactor is ~1 at the near point and ~0 at the far point", () => {
  approx(depthFactor([0, 0, 1.1], 1.1), 1, 1e-9, "near");
  approx(depthFactor([0, 0, -1.1], 1.1), 0, 1e-9, "far");
  approx(depthFactor([1.1, 0, 0], 1.1), 0.5, 1e-9, "limb");
});
