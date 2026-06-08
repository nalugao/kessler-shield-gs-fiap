import test from "node:test";
import assert from "node:assert/strict";
import { planSteps, MAX_STEPS_PER_FRAME } from "../../src/sim/clock.js";

test("takes whole steps and carries the remainder", () => {
  assert.deepEqual(planSteps(0, 35, 7), { steps: 5, remainder: 0 });
  assert.deepEqual(planSteps(0, 10, 7), { steps: 1, remainder: 3 });
  assert.deepEqual(planSteps(3, 2, 7), { steps: 0, remainder: 5 });
});

test("carried remainder eventually triggers a step", () => {
  let acc = 0;
  let total = 0;
  for (let i = 0; i < 10; i++) {
    const { steps, remainder } = planSteps(acc, 4, 7); // 4 days/frame, 7-day step
    acc = remainder;
    total += steps;
  }
  // 10 frames × 4 days = 40 days ⇒ floor(40/7) = 5 steps total
  assert.equal(total, 5);
});

test("constant advance is frame-rate independent", () => {
  // Same total sim-time delivered in big vs small chunks ⇒ same step count.
  const big = (() => {
    let acc = 0;
    let n = 0;
    for (let i = 0; i < 4; i++) {
      const r = planSteps(acc, 100, 7);
      acc = r.remainder;
      n += r.steps;
    }
    return n;
  })();
  const small = (() => {
    let acc = 0;
    let n = 0;
    for (let i = 0; i < 40; i++) {
      const r = planSteps(acc, 10, 7);
      acc = r.remainder;
      n += r.steps;
    }
    return n;
  })();
  assert.equal(big, small);
  assert.equal(big, Math.floor(400 / 7));
});

test("sheds backlog past the per-frame ceiling", () => {
  const r = planSteps(0, 1e9, 7);
  assert.equal(r.steps, MAX_STEPS_PER_FRAME);
  assert.equal(r.remainder, 0);
});

test("zero step size is a no-op", () => {
  assert.deepEqual(planSteps(5, 100, 0), { steps: 0, remainder: 5 });
});
