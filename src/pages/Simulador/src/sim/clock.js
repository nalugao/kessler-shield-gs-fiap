/**
 * Fixed-timestep accumulator math. Pure — no React, no rAF — so the loop's timing
 * policy is unit-testable on its own.
 *
 * The render loop runs at the display's refresh rate; the physics must not. Each
 * frame we convert real elapsed time into simulated days, add it to a carry-over
 * accumulator, and take as many whole `stepDays` RK4 steps as fit. The leftover is
 * carried to the next frame, so physics advances at a constant rate regardless of
 * frame rate (the classic decoupled game loop).
 */

/** Hard ceiling on steps per frame, so a tab that was backgrounded for minutes
 *  doesn't try to integrate years of physics in a single catch-up frame. */
export const MAX_STEPS_PER_FRAME = 480;

/**
 * @param {number} accumulatorDays  carried-over sim-days from the previous frame
 * @param {number} advanceDays      sim-days this frame wants to advance (realDt × speed)
 * @param {number} stepDays         fixed integration step
 * @param {number} [maxSteps]
 * @returns {{ steps: number, remainder: number }}
 */
export function planSteps(accumulatorDays, advanceDays, stepDays, maxSteps = MAX_STEPS_PER_FRAME) {
  if (stepDays <= 0) return { steps: 0, remainder: accumulatorDays };
  const acc = accumulatorDays + advanceDays;
  let steps = Math.floor(acc / stepDays);
  if (steps <= 0) return { steps: 0, remainder: acc };
  if (steps > maxSteps) {
    // Shed the backlog after a stall rather than fast-forwarding wildly.
    return { steps: maxSteps, remainder: 0 };
  }
  return { steps, remainder: acc - steps * stepDays };
}
