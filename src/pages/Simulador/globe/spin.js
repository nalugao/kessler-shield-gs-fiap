/**
 * Auto-spin policy for the globe. Pure functions — testable without React/WebGL.
 */
import {
  quatFromAxisAngle,
  quatMultiply,
  quatNormalize,
  quatToMat3,
} from "./quat.js";

/** Radians applied each frame around view +Y when not dragging. */
export const SPIN_SPEED = 0.003;

/** Earth spin, in radians per simulated day. The globe turns in lock-step with the
 *  simulation clock, so it freezes on pause and whirls faster at higher time-speed. */
export const SPIN_RAD_PER_SIM_DAY = 0.003;

/** View-space spin axis (screen vertical / north-up tangent at center). */
export const SPIN_AXIS = /** @type {const} */ ([0, 1, 0]);

/**
 * Advance orientation by one auto-spin step. Spins on every call unless dragging.
 * The spin magnitude is the angle for this frame — the caller scales it by how much
 * simulated time elapsed, so the globe freezes when the sim is paused and turns
 * faster as the time-speed rises. Defaults to SPIN_SPEED for callers (and tests)
 * that just want a fixed ambient step.
 * @param {import("./quat.js").Quat} orientation
 * @param {boolean} dragging
 * @param {number} [angle]  spin angle this frame (radians)
 * @returns {import("./quat.js").Quat}
 */
export function stepAutoSpin(orientation, dragging, angle = SPIN_SPEED) {
  if (dragging || angle === 0) {
    return orientation;
  }
  return quatNormalize(
    quatMultiply(
      quatFromAxisAngle(SPIN_AXIS, -angle),
      orientation,
    ),
  );
}

/**
 * One render-frame tick: matrix for this frame, orientation advanced for the next.
 * @param {import("./quat.js").Quat} orientation
 * @param {boolean} dragging
 * @param {number} [angle]  spin angle this frame (radians)
 */
export function tickGlobeFrame(orientation, dragging, angle = SPIN_SPEED) {
  const mat = quatToMat3(orientation);
  const next = stepAutoSpin(orientation, dragging, angle);
  return { mat, orientation: next };
}
