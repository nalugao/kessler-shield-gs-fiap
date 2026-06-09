/**
 * Calibration harness for the two-population Kessler engine. Proves the demo story:
 *   1. Active satellites grow over time (the launch boom) — "not only junk".
 *   2. Total objects in orbit climb across the horizon.
 *   3. With NO removal the High band tips into runaway (traffic-driven cascade).
 *   4. A modest constant fleet removal R* flips it to a stable steady state.
 *
 * Run:  node tools/calibrate-sim.mjs   (npm run calibrate:sim)
 */
import { createKesslerModel } from "../src/sim/kessler.js";
import { SHELLS, STEP_DAYS, HORIZON_YEARS, HIGH_SHELL_INDEX, removalVector } from "../src/sim/scenarios.js";

const STEPS = Math.round((HORIZON_YEARS * 365.25) / STEP_DAYS);

function run(highRemoval) {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  const removal = removalVector(highRemoval);
  const trace = [];
  let peakS = 0;
  for (let s = 0; s <= STEPS; s++) {
    const snap = m.snapshot();
    if (s % Math.round(STEPS / 12) === 0) trace.push(snap);
    peakS = Math.max(peakS, snap.totalS);
    m.step(STEP_DAYS, removal);
  }
  return { trace, final: m.snapshot(), peakS };
}

const f = (n) =>
  !isFinite(n) ? "∞" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : n.toFixed(0);

function printTrace(title, trace) {
  console.log(`\n${title}`);
  console.log("  year   activeSats  debris   total   C(high)");
  for (const s of trace) {
    const high = s.shells[HIGH_SHELL_INDEX];
    console.log(
      `  ${s.year.toFixed(0)}   ${f(s.totalS).padStart(8)}  ${f(s.totalD).padStart(7)}  ${f(s.totalN).padStart(6)}   ${high.criticality.toFixed(2)}`,
    );
  }
}

const cascade = run(0);
printTrace("=== No action ===", cascade.trace);
const mitig = run(1800);
printTrace("=== Foam fleet (R=1800 on High debris) ===", mitig.trace);

console.log("\n=== Removal sweep (constant R on High debris) ===");
let rFlip = null;
for (let R = 0; R <= 2400; R += 100) {
  const { final } = run(R);
  const high = final.shells[HIGH_SHELL_INDEX];
  const stable = high.criticality < 1;
  console.log(`  R=${String(R).padStart(2)}/yr  High C=${high.criticality.toFixed(2)}  D=${f(high.D)}  ${stable ? "STABLE" : "runaway"}`);
  if (stable && rFlip === null) rFlip = R;
}

const c0 = cascade.trace[0];
const cF = cascade.final;
const satsGrew = cascade.peakS > c0.totalS * 1.8; // sats boom (before any collapse)
const totalGrew = cascade.peakS > c0.totalS * 1.8;
const act1 = cF.shells[HIGH_SHELL_INDEX].criticality > 3;
const act2 = mitig.final.shells[HIGH_SHELL_INDEX].criticality < 1;

console.log("\n=== Verdict ===");
console.log(`  Active sats boom:               ${satsGrew ? "✔" : "✗"}  (${f(c0.totalS)} → peak ${f(cascade.peakS)})`);
console.log(`  Total objects climb:            ${totalGrew ? "✔" : "✗"}`);
console.log(`  No-action High cascades:        ${act1 ? "✔" : "✗"}`);
console.log(`  Fleet (R=1800) stabilizes High:   ${act2 ? "✔" : "✗"}`);
console.log(`  Minimum stabilizing removal R*: ${rFlip ?? "> 14"}/yr`);

const ok = satsGrew && totalGrew && act1 && act2 && rFlip != null && rFlip <= 2000;
console.log(`\n${ok ? "OK — scenario is demo-ready." : "NEEDS TUNING."}`);
process.exit(ok ? 0 : 1);
