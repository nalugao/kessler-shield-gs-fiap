/**
 * Calibrated two-population scenario, grounded in real-world-ish magnitudes (2026):
 *   ~9,000 active satellites, ~19,000 tracked debris objects — both climbing.
 *
 * Three altitude bands, low → high; rates per year. Each tracks active satellites (S)
 * and debris (D).
 *
 *   - Low LEO (~450 km):  the megaconstellation belt — ~6k sats today, booming toward
 *                         tens of thousands; drag clears debris in a couple of years.
 *   - Mid LEO (~700 km):  moderate traffic; catches fragments raining from above.
 *   - High LEO (~900 km): the dangerous band — long drag time, poor disposal. Starts
 *                         *subcritical* (C₀ ≈ 0.65, stable today), but the launch boom
 *                         and abandoned end-of-life satellites fill it past the Kessler
 *                         threshold around mid-century, then it runs away. The igniter.
 *
 * Nothing is preordained: in 2026 the system is stable. The cascade is a future we
 * walk into — and a modest removal fleet (~R* ≈ 200 objects/yr) keeps us out of it.
 */

export const DEFAULT_START_MS = Date.UTC(2026, 0, 1);

/** @type {import("./kessler.js").Shell[]} */
export const SHELLS = [
  {
    id: "leo",
    name: "LEO baixo",
    altitudeKm: 450,
    tau: 2, // drag clears debris in ~2 years
    alpha: 1.0e-7,
    Top: 5,
    L0: 800,
    Lmax: 4000, // megaconstellation boom
    growthYears: 14,
    fDeorbit: 0.95, // low orbits deorbit responsibly
    kappa: 0.1,
    couple: 0,
    S0: 6000,
    D0: 150,
    capD: 3.0e7,
  },
  {
    id: "mid",
    name: "LEO médio",
    altitudeKm: 700,
    tau: 20,
    alpha: 1.2e-6,
    Top: 8,
    L0: 150,
    Lmax: 600,
    growthYears: 18,
    fDeorbit: 0.6,
    kappa: 0.2,
    couple: 0.2,
    S0: 2000,
    D0: 2400,
    capD: 3.0e7,
  },
  {
    id: "high",
    name: "LEO alto",
    altitudeKm: 900,
    tau: 42,
    alpha: 1.35e-6, // C₀ = α τ X₀ ≈ 0.75 (subcritical today)
    Top: 10,
    L0: 80,
    Lmax: 2000, // traffic floods the band fast
    growthYears: 8,
    fDeorbit: 0.25, // poor disposal up high — abandoned sats become debris
    kappa: 0.25,
    couple: 0.3,
    S0: 900,
    D0: 13000,
    capD: 3.0e7,
  },
];

export const HIGH_SHELL_INDEX = SHELLS.findIndex((s) => s.id === "high");
if (HIGH_SHELL_INDEX < 0) {
  throw new Error('SHELLS must include a shell with id "high"');
}

/** Fixed integration step. */
export const STEP_DAYS = 1;

/** Nominal removal capacity per deployed fleet (objects/year). */
export const FLEET_CAPACITY = 220;

/**
 * Hard ceiling on *effective* removal, no matter how many fleets you deploy. You
 * cannot find, rendezvous with and de-orbit unlimited objects — and once a dense
 * fragment cloud forms, collisions create debris faster than any fleet can clear it.
 * This is what makes the point of no return real: past it, generation outpaces the
 * ceiling and no number of fleets brings it back.
 */
export const REMOVAL_CEILING = 3000;

/** Effective removal (objects/year) for a fleet count — saturates at the ceiling. */
export function effectiveRemoval(fleets) {
  return REMOVAL_CEILING * (1 - Math.exp((-fleets * FLEET_CAPACITY) / REMOVAL_CEILING));
}

/** Demo horizon — simulated years the story covers. */
export const HORIZON_YEARS = 100;

/** Per-shell debris removal vector (the fleet only targets the High band). */
export function removalVector(highRemoval) {
  return SHELLS.map((s) => (s.id === "high" ? highRemoval : 0));
}

/** Reference removal levels. */
export const SCENARIOS = {
  cascade: { label: "Sem ação", highRemoval: 0 },
  mitigated: { label: "Com frotas", highRemoval: 1000 },
};
