/**
 * Pure Kessler-syndrome model — two populations per shell. No React, no WebGL.
 *
 * Real LEO is not just junk: it holds active satellites (operational, maneuverable,
 * and growing fast in the megaconstellation era) and debris (uncontrolled junk). So
 * each altitude band i tracks two populations, with all rates per YEAR:
 *
 *   active sats S_i:
 *     dS_i/dt = L_i(t)              // launches in — and L grows over time (boom)
 *             − S_i / Top_i         // reach end of operational life
 *             − κ_i α_i S_i X_i     // destroyed in collisions (κ = imperfect avoidance)
 *
 *   debris D_i:33
 *     dD_i/dt = α_i X_i²                       // collision fragments (the cascade engine)
 *             + (1 − fDeorbit_i) · S_i/Top_i   // abandoned end-of-life sats become junk
 *             + couple_{i+1} · α_{i+1} X_{i+1}²// fragments raining in from the shell above
 *             − D_i / τ_i                      // atmospheric drag (the only natural janitor)
 *             − R_i                            // active removal (the foam fleet)
 *
 * where the effective collidable population is  X_i = D_i + κ_i S_i  (debris always
 * collide; active sats collide at a reduced rate κ because they dodge). Collisions
 * scale with X² — so *traffic itself* drives risk, not only junk. The quadratic
 * source vs. the linear drag sink makes the cascade a genuine bifurcation. The
 * growing launch rate is what tips the critical shell over: catastrophe by economics.
 *
 * Criticality  C_i = α_i τ_i X_i = X_i / N*_i ,  N*_i = 1/(α_i τ_i).
 * C < 1 → drag wins (self-heals); C > 1 → collisions win (runaway). The HUD gauge.
 *
 * @typedef {Object} Shell
 * @property {string} id @property {string} name @property {number} altitudeKm
 * @property {number} tau        debris drag lifetime τ (years)
 * @property {number} alpha      collision coefficient α (per object per year)
 * @property {number} Top        active-sat operational lifetime (years)
 * @property {number} L0         launch rate today (sats/year)
 * @property {number} Lmax       saturated launch rate (mature economy)
 * @property {number} growthYears  e-folding time for launches to approach Lmax
 * @property {number} fDeorbit   fraction of retiring sats that deorbit cleanly [0..1]
 * @property {number} kappa      active-sat collision participation (1 − avoidance) [0..1]
 * @property {number} couple     fraction of collision production seeded into the shell below
 * @property {number} S0 @property {number} D0   initial active sats / debris
 * @property {number} [capD]     saturation cap on debris; default Infinity
 *
 * @typedef {Object} ShellSnapshot
 * @property {string} id @property {string} name @property {number} altitudeKm
 * @property {number} S @property {number} D @property {number} N   active / debris / total
 * @property {number} criticality   C = α τ X
 * @property {number} collisionRate  α X²
 * @property {number} nStar          N* = 1/(α τ)
 * @property {number} launch         current launch rate L(t)
 * @property {number} removal        R applied on the last step
 *
 * @typedef {Object} Snapshot
 * @property {number} days @property {number} dateMs @property {number} year
 * @property {ShellSnapshot[]} shells
 * @property {number} totalN @property {number} totalS @property {number} totalD
 * @property {number} systemCriticality
 */

export const DAYS_PER_YEAR = 365.25;

/** Conservative financial estimates (US$). Blended satellite asset value, and the
 *  annual service revenue underwritten by each active LEO satellite — both kept on
 *  the low side so the headline loss figure stays defensible. */
export const ASSET_VALUE_PER_SAT = 18e6;
export const SERVICE_PER_SAT_YEAR = 0.35e6;

/** @param {number} days */
export const daysToYears = (days) => days / DAYS_PER_YEAR;
/** @param {number} years */
export const yearsToDays = (years) => years * DAYS_PER_YEAR;

/** Launch rate at simulated time t (years): saturating ramp L0 → Lmax. */
export function launchRate(shell, years) {
  const L0 = shell.L0 ?? 0;
  const Lmax = shell.Lmax ?? L0;
  const g = shell.growthYears ?? 20;
  return Lmax - (Lmax - L0) * Math.exp(-Math.max(0, years) / g);
}

/** Effective collidable population X = D + κ S. */
export function effectiveX(shell, S, D) {
  return D + (shell.kappa ?? 0) * S;
}

/** Criticality C = α τ X. C < 1 self-heals, C > 1 runs away. */
export function criticality(shell, S, D) {
  return shell.alpha * shell.tau * effectiveX(shell, S, D);
}

/** Criticality scale N* = 1/(α τ). */
export function nStar(shell) {
  return 1 / (shell.alpha * shell.tau);
}

/** Collision (fragment-producing) rate α X² in events per year. */
export function collisionRate(shell, S, D) {
  const x = effectiveX(shell, S, D);
  return shell.alpha * x * x;
}

/** Operational access collapses once a shell is deeply runaway. */
export function accessFactor(shell, S, D) {
  const c = criticality(shell, S, D);
  if (c <= 2) return 1;
  if (c >= 8) return 0;
  return 1 - (c - 2) / 6;
}

/** A runaway band can deny practical access to the whole LEO corridor. */
function systemAccessFactor(shells, state) {
  const k = shells.length;
  let access = 1;
  for (let i = 0; i < k; i++) {
    access = Math.min(access, accessFactor(shells[i], Math.max(0, state[i]), Math.max(0, state[k + i])));
  }
  return access;
}

/**
 * Derivatives for the flat state vector [S0..S_{k-1}, D0..D_{k-1}] (per year).
 * Launches `L` are precomputed for the current time and held constant across the
 * RK4 substeps (they vary on a decade scale; the step is days — negligible error).
 * @param {Shell[]} shells
 * @param {ArrayLike<number>} state  length 2k
 * @param {ArrayLike<number>} L      per-shell launch rate this step
 * @param {ArrayLike<number>} removal per-shell debris removal R
 * @param {Float64Array} out         length 2k
 */
export function derivative(shells, state, L, removal, out) {
  const k = shells.length;
  const access = systemAccessFactor(shells, state);
  // Clamp debris to its cap when forming αX² — keeps the stiff cascade's substeps
  // bounded (a high cap would otherwise overflow RK4 before the final clamp).
  const dOf = (i) => Math.min(Math.max(0, state[k + i]), shells[i].capD ?? Infinity);
  const prod = new Float64Array(k);
  for (let i = 0; i < k; i++) {
    const x = dOf(i) + (shells[i].kappa ?? 0) * Math.max(0, state[i]);
    prod[i] = shells[i].alpha * x * x;
  }
  for (let i = 0; i < k; i++) {
    const s = shells[i];
    const S = Math.max(0, state[i]);
    const D = dOf(i);
    const x = D + (s.kappa ?? 0) * S;
    const retire = S / s.Top;
    const satColl = (s.kappa ?? 0) * s.alpha * S * x;
    const fromAbove = i + 1 < k ? (shells[i + 1].couple ?? 0) * prod[i + 1] : 0;
    const R = removal[i] ?? 0;
    out[i] = (L[i] ?? 0) * access - retire - satColl; // dS
    out[k + i] = prod[i] + (1 - (s.fDeorbit ?? 0)) * retire + fromAbove - D / s.tau - R; // dD
  }
  return out;
}

/**
 * One RK4 step of the coupled 2k system. S clamped ≥ 0; D clamped to [0, capD].
 * @returns {Float64Array} next state (new array)
 */
export function rk4Step(shells, state, L, removal, dtYears) {
  if (dtYears <= 0) return Float64Array.from(state);
  const k = shells.length;
  const n = 2 * k;
  const k1 = new Float64Array(n);
  const k2 = new Float64Array(n);
  const k3 = new Float64Array(n);
  const k4 = new Float64Array(n);
  const tmp = new Float64Array(n);

  derivative(shells, state, L, removal, k1);
  for (let i = 0; i < n; i++) tmp[i] = state[i] + 0.5 * dtYears * k1[i];
  derivative(shells, tmp, L, removal, k2);
  for (let i = 0; i < n; i++) tmp[i] = state[i] + 0.5 * dtYears * k2[i];
  derivative(shells, tmp, L, removal, k3);
  for (let i = 0; i < n; i++) tmp[i] = state[i] + dtYears * k3[i];
  derivative(shells, tmp, L, removal, k4);

  const next = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const dv = (dtYears / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    let v = Math.max(0, state[i] + dv);
    if (i >= k) {
      const cap = shells[i - k].capD ?? Infinity;
      if (v > cap) v = cap;
    }
    next[i] = v;
  }
  return next;
}

/** Seedable PRNG (mulberry32) for reproducible cosmetic collision sampling. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Poisson sample, mean λ. Knuth for small λ, clamped normal approx for large. */
export function samplePoisson(lambda, rng) {
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const limit = Math.exp(-lambda);
    let count = 0;
    let p = 1;
    do {
      count++;
      p *= rng();
    } while (p > limit);
    return count - 1;
  }
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * g));
}

/**
 * Stateful model. Owns the current (S, D) state and clock; history lives in the
 * caller. Cheap to clone for a parallel counterfactual run.
 * @param {{ shells: Shell[], startDateMs?: number, seed?: number, state?: number[] }} config
 */
export function createKesslerModel(config) {
  const shells = config.shells.map((s) => ({ kappa: 0, couple: 0, fDeorbit: 0, ...s }));
  const k = shells.length;
  const startDateMs = config.startDateMs ?? Date.UTC(2026, 0, 1);
  let rng = mulberry32(config.seed ?? 0x9e3779b9);

  const initial = () => {
    const v = new Float64Array(2 * k);
    for (let i = 0; i < k; i++) {
      v[i] = shells[i].S0 ?? 0;
      v[k + i] = shells[i].D0 ?? 0;
    }
    return v;
  };

  if (config.state && config.state.length !== 2 * k) {
    throw new Error(`invalid Kessler state length: expected ${2 * k}, got ${config.state.length}`);
  }

  let state = config.state ? Float64Array.from(config.state) : initial();
  let days = config.days ?? 0;
  let lastRemoval = config.lastRemoval ? Float64Array.from(config.lastRemoval) : new Float64Array(k);
  let launchedTotal = config.launchedTotal ?? 0; // cumulative satellites launched
  let lostTotal = config.lostTotal ?? 0; // cumulative satellites destroyed in collisions
  let lossTotal = config.lossTotal ?? 0; // cumulative global financial loss (US$)

  const dateMs = () => startDateMs + days * 86400000;
  const year = () => new Date(dateMs()).getUTCFullYear() + dayOfYearFraction(dateMs());

  function step(dtDays, removal = []) {
    const yrs = daysToYears(days);
    const L = new Float64Array(k);
    const r = new Float64Array(k);
    const dtY = daysToYears(dtDays);
    let dLaunch = 0;
    let dLost = 0;
    let totalS = 0;
    let maxC = 0;
    const access = systemAccessFactor(shells, state);
    for (let i = 0; i < k; i++) {
      L[i] = launchRate(shells[i], yrs);
      r[i] = removal[i] ?? 0;
      const S = state[i];
      const x = state[k + i] + (shells[i].kappa ?? 0) * S;
      dLaunch += L[i] * access;
      dLost += (shells[i].kappa ?? 0) * shells[i].alpha * S * x;
      totalS += S;
      const c = shells[i].alpha * shells[i].tau * x;
      if (c > maxC) maxC = c;
    }
    launchedTotal += dLaunch * dtY;
    lostTotal += dLost * dtY;
    // Financial loss: destroyed-satellite assets + LEO services disrupted as the
    // orbit degrades. Conservative blended figures — labelled an estimate in the UI.
    const degraded = Math.max(0, Math.min(1, (maxC - 1) / 3));
    lossTotal += (dLost * ASSET_VALUE_PER_SAT + degraded * SERVICE_PER_SAT_YEAR * totalS) * dtY;
    state = rk4Step(shells, state, L, r, dtY);
    days += dtDays;
    lastRemoval = r;
  }

  function sampleCollisions(dtDays) {
    const dtY = daysToYears(dtDays);
    const events = new Array(k);
    for (let i = 0; i < k; i++) {
      events[i] = samplePoisson(collisionRate(shells[i], state[i], state[k + i]) * dtY, rng);
    }
    return events;
  }

  function snapshot() {
    let totalN = 0;
    let totalS = 0;
    let totalD = 0;
    let systemCriticality = 0;
    const yrs = daysToYears(days);
    const shellSnaps = shells.map((s, i) => {
      const S = state[i];
      const D = state[k + i];
      const c = criticality(s, S, D);
      totalS += S;
      totalD += D;
      totalN += S + D;
      if (c > systemCriticality) systemCriticality = c;
      return {
        id: s.id,
        name: s.name,
        altitudeKm: s.altitudeKm,
        S,
        D,
        N: S + D,
        criticality: c,
        collisionRate: collisionRate(s, S, D),
        nStar: nStar(s),
        launch: launchRate(s, yrs) * systemAccessFactor(shells, state),
        removal: lastRemoval[i],
      };
    });
    return {
      days,
      dateMs: dateMs(),
      year: year(),
      shells: shellSnaps,
      totalN,
      totalS,
      totalD,
      totalLaunched: launchedTotal,
      totalLost: lostTotal,
      financialLoss: lossTotal,
      systemCriticality,
    };
  }

  function reset(seed = config.seed ?? 0x9e3779b9) {
    state = initial();
    days = 0;
    lastRemoval = new Float64Array(k);
    launchedTotal = 0;
    lostTotal = 0;
    lossTotal = 0;
    rng = mulberry32(seed);
  }

  function clone() {
    return createKesslerModel({
      ...config,
      shells,
      state: Array.from(state),
      days,
      lastRemoval: Array.from(lastRemoval),
      launchedTotal,
      lostTotal,
      lossTotal,
    });
  }

  return {
    shells,
    get days() {
      return days;
    },
    get state() {
      return state;
    },
    dateMs,
    year,
    step,
    sampleCollisions,
    snapshot,
    reset,
    clone,
  };
}

function dayOfYearFraction(ms) {
  const d = new Date(ms);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const next = Date.UTC(d.getUTCFullYear() + 1, 0, 1);
  return (ms - start) / (next - start);
}
