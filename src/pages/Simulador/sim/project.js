/**
 * Forward-integrate deterministic reference trajectories to the horizon. The chart
 * draws two static "fates" — no intervention (R=0) and an adequate fleet — that frame
 * the live run, so the intervention-vs-inaction tension is always on screen. Pure and
 * deterministic (collision sampling is cosmetic and never touches N), so the same
 * inputs always give the same curves.
 */
import { createKesslerModel, nStar } from "./kessler.js";
import {
  SHELLS,
  STEP_DAYS,
  HORIZON_YEARS,
  HIGH_SHELL_INDEX,
  REMOVAL_CEILING,
  removalVector,
} from "./scenarios.js";

/**
 * @param {number} highRemoval  constant removal on the High band (objects/year)
 * @param {{ sampleYears?: number }} [opts]
 * @returns {{year:number, high:number, total:number, criticality:number}[]}
 */
export function projectTrajectory(highRemoval, { sampleYears = 1 } = {}) {
  const m = createKesslerModel({ shells: SHELLS, seed: 1 });
  const removal = removalVector(highRemoval);
  const totalSteps = Math.round((HORIZON_YEARS * 365.25) / STEP_DAYS);
  const sampleEvery = Math.max(1, Math.round((sampleYears * 365.25) / STEP_DAYS));
  const out = [];
  for (let i = 0; i <= totalSteps; i++) {
    if (i % sampleEvery === 0 || i === totalSteps) {
      const snap = m.snapshot();
      out.push({
        year: snap.year,
        high: snap.shells[HIGH_SHELL_INDEX].D, // critical-band debris (the cascade)
        total: snap.totalN,
        criticality: snap.systemCriticality,
      });
    }
    m.step(STEP_DAYS, removal);
  }
  return out;
}

/** The Kessler threshold N* for the critical band — the unstable equilibrium above
 *  which, left alone, collisions outrun atmospheric drag. */
export function criticalThreshold() {
  return nStar(SHELLS[HIGH_SHELL_INDEX]);
}

/**
 * The TRUE point of no return: the critical-band debris level past which fragment
 * generation (αD²) exceeds the maximum effective removal (REMOVAL_CEILING) plus drag,
 * so no fleet — however large — can bring it back. Root of αD² − D/τ − ceiling = 0.
 */
export function pointOfNoReturnDebris() {
  const s = SHELLS[HIGH_SHELL_INDEX];
  const disc = 1 / (s.tau * s.tau) + 4 * s.alpha * REMOVAL_CEILING;
  return (1 / s.tau + Math.sqrt(disc)) / (2 * s.alpha);
}

/** First year the no-intervention curve passes `factor`×N* — committed collapse. */
export function pointOfNoReturnYear(noActionRows, factor = 2) {
  const level = criticalThreshold() * factor;
  const hit = noActionRows.find((r) => r.high >= level);
  return hit ? hit.year : null;
}
