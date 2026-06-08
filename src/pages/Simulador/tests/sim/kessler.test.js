import test from "node:test";
import assert from "node:assert/strict";
import {
  createKesslerModel,
  criticality,
  nStar,
  collisionRate,
  effectiveX,
  derivative,
  rk4Step,
  launchRate,
  samplePoisson,
  mulberry32,
  daysToYears,
} from "../../src/sim/kessler.js";
import { SHELLS, removalVector, HIGH_SHELL_INDEX, STEP_DAYS } from "../../src/sim/scenarios.js";

const approx = (a, b, tol, msg) =>
  assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} expected ${b}, got ${a} (tol ${tol})`);

test("launchRate ramps from L0 to Lmax, monotonically", () => {
  const s = { L0: 10, Lmax: 100, growthYears: 20 };
  approx(launchRate(s, 0), 10, 1e-9, "at t=0");
  approx(launchRate(s, 1e6), 100, 1e-6, "as t→∞");
  assert.ok(launchRate(s, 30) > launchRate(s, 10), "monotonic");
});

test("effectiveX = D + κS, and criticality C = ατX (= 1 at X = N*)", () => {
  const s = { alpha: 9.5e-6, tau: 35, kappa: 0.25 };
  approx(effectiveX(s, 200, 3000), 3000 + 0.25 * 200, 1e-9);
  approx(criticality(s, 0, nStar(s)), 1, 1e-12, "C at X=N*");
  approx(collisionRate(s, 0, 100), s.alpha * 1e4, 1e-12);
});

test("derivative: two populations, collisions, retirement, abandonment", () => {
  // one shell: α=1e-3, τ=10, Top=4, κ=0.5, fDeorbit=0.5
  const shells = [
    { id: "x", alpha: 1e-3, tau: 10, Top: 4, kappa: 0.5, fDeorbit: 0.5, couple: 0 },
  ];
  const state = [10, 20]; // S=10, D=20
  const out = new Float64Array(2);
  derivative(shells, state, [5], [0], out);
  // X = 20 + 0.5·10 = 25 ; prod = 1e-3·625 = 0.625 ; retire = 10/4 = 2.5
  // satColl = 0.5·1e-3·10·25 = 0.125
  // dS = 5 − 2.5 − 0.125 = 2.375
  // dD = 0.625 + 0.5·2.5 − 20/10 = 0.625 + 1.25 − 2 = −0.125
  approx(out[0], 2.375, 1e-12, "dS");
  approx(out[1], -0.125, 1e-12, "dD");
});

test("derivative: fragments rain down from the shell above (couple)", () => {
  const shells = [
    { id: "lo", alpha: 0, tau: 10, Top: 99, kappa: 0, fDeorbit: 1, couple: 0 },
    { id: "hi", alpha: 1e-3, tau: 99, Top: 99, kappa: 0, fDeorbit: 1, couple: 0.4 },
  ];
  // state [S_lo, S_hi, D_lo, D_hi]
  const state = [0, 0, 0, 100];
  const out = new Float64Array(4);
  derivative(shells, state, [0, 0], [0, 0], out);
  // prod_hi = 1e-3·100² = 10 ; fromAbove for lo = 0.4·10 = 4 ; lo has no own source/drag(D=0)
  approx(out[2], 4, 1e-12, "debris raining into the lower shell");
});

test("RK4 pure debris decay matches analytic e^(−t/τ)", () => {
  const m = createKesslerModel({
    shells: [{ id: "d", name: "d", altitudeKm: 0, alpha: 0, tau: 10, Top: 1e9, L0: 0, Lmax: 0, kappa: 0, fDeorbit: 0, couple: 0, S0: 0, D0: 1000 }],
  });
  const steps = Math.round((10 * 365.25) / 7);
  for (let i = 0; i < steps; i++) m.step(7);
  const expected = 1000 * Math.exp(-daysToYears(m.days) / 10);
  approx(m.snapshot().shells[0].D, expected, expected * 0.005, "decayed debris");
});

test("active sats approach the steady state L·Top", () => {
  // no collisions, clean disposal: dS/dt = L − S/Top ⇒ S → L·Top
  const m = createKesslerModel({
    shells: [{ id: "s", name: "s", altitudeKm: 0, alpha: 0, tau: 1, Top: 5, L0: 100, Lmax: 100, kappa: 0, fDeorbit: 1, couple: 0, S0: 0, D0: 0 }],
  });
  for (let i = 0; i < 4000; i++) m.step(7);
  approx(m.snapshot().shells[0].S, 500, 5, "S → L·Top = 500");
});

test("launch boom: active sats grow over time, then total climbs", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  const start = m.snapshot();
  let peakS = start.totalS;
  const steps = Math.round((60 * 365.25) / 7);
  for (let i = 0; i < steps; i++) {
    m.step(7);
    peakS = Math.max(peakS, m.snapshot().totalS);
  }
  assert.ok(peakS > start.totalS * 1.8, `sats should boom (peak ${peakS} vs ${start.totalS})`);
});

test("no removal cascades; a modest fleet (R≥6) stabilizes the High band", () => {
  const cascade = createKesslerModel({ shells: SHELLS, seed: 1 });
  const fleet = createKesslerModel({ shells: SHELLS, seed: 1 });
  const steps = Math.round((100 * 365.25) / 7);
  for (let i = 0; i < steps; i++) {
    cascade.step(7);
    fleet.step(7, removalVector(1800));
  }
  const cH = cascade.snapshot().shells[HIGH_SHELL_INDEX];
  const fH = fleet.snapshot().shells[HIGH_SHELL_INDEX];
  assert.ok(cH.criticality > 3, `cascade C=${cH.criticality}`);
  assert.ok(fH.criticality < 1, `fleet C=${fH.criticality}`);
});

test("debris is capped and never negative under extreme removal", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  for (let i = 0; i < 1500; i++) m.step(7, removalVector(1e6));
  for (const sh of m.snapshot().shells) {
    assert.ok(sh.D >= 0 && sh.S >= 0 && isFinite(sh.N), `${sh.id}`);
  }
  const cap = createKesslerModel({ shells: SHELLS, seed: 1 });
  for (let i = 0; i < 6000; i++) cap.step(7);
  cap.shells.forEach((s, i) => {
    if (s.capD != null) assert.ok(cap.snapshot().shells[i].D <= s.capD + 1e-6, `${s.id} over cap`);
  });
});

test("rejects injected state with the wrong vector length", () => {
  assert.throws(
    () => createKesslerModel({ shells: SHELLS, state: [1, 2, 3] }),
    /invalid Kessler state length/,
  );
});

test("non-positive RK4 step is a no-op copy", () => {
  const shells = [{ id: "x", alpha: 1e-3, tau: 10, Top: 4, kappa: 0.5, fDeorbit: 0.5, couple: 0 }];
  const state = new Float64Array([10, 20]);
  const next = rk4Step(shells, state, [5], [0], 0);
  assert.notEqual(next, state);
  assert.deepEqual(Array.from(next), Array.from(state));
});

test("clone is independent of its parent", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  for (let i = 0; i < 100; i++) m.step(7);
  const ghost = m.clone();
  const before = Array.from(m.state);
  const beforeSnap = m.snapshot();
  const cloneSnap = ghost.snapshot();
  approx(cloneSnap.days, beforeSnap.days, 1e-12, "clone days");
  approx(cloneSnap.totalLaunched, beforeSnap.totalLaunched, 1e-9, "clone launched total");
  approx(cloneSnap.totalLost, beforeSnap.totalLost, 1e-9, "clone lost total");
  approx(cloneSnap.financialLoss, beforeSnap.financialLoss, 1e-3, "clone financial loss");
  for (let i = 0; i < 100; i++) ghost.step(7, removalVector(1800));
  assert.deepEqual(Array.from(m.state), before, "clone must not touch parent");
});

test("production one-day step stays finite over the full horizon", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  const steps = Math.round((100 * 365.25) / STEP_DAYS);
  for (let i = 0; i < steps; i++) m.step(STEP_DAYS);
  const snap = m.snapshot();
  assert.ok(Number.isFinite(snap.totalN), "total population finite");
  assert.ok(Number.isFinite(snap.financialLoss), "financial loss finite");
  for (const sh of snap.shells) {
    assert.ok(sh.D >= 0 && sh.S >= 0 && Number.isFinite(sh.N), `${sh.id} finite`);
  }
});

test("deep runaway collapses practical orbital access", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  const steps = Math.round((70 * 365.25) / STEP_DAYS);
  for (let i = 0; i < steps; i++) m.step(STEP_DAYS);
  const snap = m.snapshot();
  assert.ok(snap.systemCriticality > 100, "scenario should be deeply runaway");
  assert.ok(snap.totalS < 1000, `active satellites should collapse, got ${snap.totalS}`);
});

test("snapshot: totals add up, systemCriticality is the max", () => {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  for (let i = 0; i < 800; i++) m.step(7);
  const snap = m.snapshot();
  approx(snap.totalN, snap.totalS + snap.totalD, 1e-6, "N = S + D");
  approx(
    snap.totalS,
    snap.shells.reduce((a, s) => a + s.S, 0),
    1e-6,
    "totalS",
  );
  approx(snap.systemCriticality, Math.max(...snap.shells.map((s) => s.criticality)), 1e-12, "max C");
});

test("Poisson sampling is seed-deterministic and unbiased", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 100; i++) assert.equal(samplePoisson(5, a), samplePoisson(5, b));
  const rng = mulberry32(7);
  let sum = 0;
  for (let i = 0; i < 20000; i++) sum += samplePoisson(12, rng);
  approx(sum / 20000, 12, 0.3, "mean ≈ λ");
});
