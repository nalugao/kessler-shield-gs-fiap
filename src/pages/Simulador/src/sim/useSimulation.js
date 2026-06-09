import { useCallback, useEffect, useRef, useState } from "react";
import { createKesslerModel, DAYS_PER_YEAR } from "./kessler.js";
import {
  SHELLS,
  STEP_DAYS,
  HORIZON_YEARS,
  DEFAULT_START_MS,
  FLEET_CAPACITY,
  effectiveRemoval,
  removalVector,
} from "./scenarios.js";
import { planSteps } from "./clock.js";

/** Cap on deployable fleets (plenty past the stabilizing threshold). */
const MAX_FLEETS = 99; // effectively unlimited — deploy as many as you want

/** How often the throttled React snapshot (HUD/charts) updates. The globe reads
 *  the live ref every frame instead and never waits on React. */
const DISPLAY_INTERVAL_MS = 100; // ~10 Hz
/** Chart sampling — fine enough that the curves read smooth, not stepped. */
const HISTORY_STEP_DAYS = 30;
const MAX_HISTORY = 1300;
/** Clamp a single frame's real dt so returning to a backgrounded tab doesn't jump. */
const MAX_REAL_DT_S = 0.1;

/** Speed presets in simulated years per real second. */
export const SPEED_PRESETS = [
  { label: "1×", yearsPerSecond: 0.027 }, // ~10 sim-days per real second
  { label: "2×", yearsPerSecond: 0.1 },
  { label: "4×", yearsPerSecond: 0.35 },
  { label: "8×", yearsPerSecond: 1.0 },
];
const DEFAULT_SPEED_INDEX = 0; // start at 1×

function makeModels(startDateMs, seed) {
  return {
    live: createKesslerModel({ shells: SHELLS, startDateMs, seed }),
    ghost: createKesslerModel({ shells: SHELLS, startDateMs, seed }),
  };
}

/** A history row: live trajectory plus the no-intervention "ghost" for charts. */
function historyRow(liveSnap, ghostSnap) {
  const row = {
    year: liveSnap.year,
    days: liveSnap.days,
    total: liveSnap.totalN,
    criticality: liveSnap.systemCriticality,
    ghostTotal: ghostSnap.totalN,
    ghostCriticality: ghostSnap.systemCriticality,
    totalS: liveSnap.totalS,
    ghostTotalS: ghostSnap.totalS,
    totalLaunched: liveSnap.totalLaunched,
    totalLost: liveSnap.totalLost,
    financialLoss: liveSnap.financialLoss,
  };
  for (let i = 0; i < liveSnap.shells.length; i++) {
    const s = liveSnap.shells[i];
    const g = ghostSnap.shells[i];
    row[s.id] = s.D;
    row[`${s.id}S`] = s.S;
    row[`${s.id}Crit`] = s.criticality;
    row[`${s.id}Coll`] = s.collisionRate;
    row[`ghost_${s.id}`] = g.D;
    row[`ghost_${s.id}Crit`] = g.criticality;
    row[`ghost_${s.id}Coll`] = g.collisionRate;
  }
  return row;
}

/** The per-frame object the globe and HUD read. Cheap to rebuild each tick. */
function buildFrame(live, ghost, events, playing, speed, removal, fleets) {
  const liveSnap = live.snapshot();
  const ghostSnap = ghost.snapshot();
  return {
    days: liveSnap.days,
    year: liveSnap.year,
    dateMs: liveSnap.dateMs,
    live: liveSnap,
    ghost: ghostSnap,
    events,
    playing,
    speed,
    removal,
    fleets,
  };
}

function currentRowUnlessDuplicate(history, row) {
  const last = history[history.length - 1];
  return last && last.days === row.days ? null : row;
}

/**
 * The single source of timing for the whole app. Owns the fixed-timestep clock,
 * the live + ghost engines, a live per-frame ref, a throttled React snapshot, a
 * downsampled history buffer for charts, and the playback controls.
 *
 * @param {{ startDateMs?: number, seed?: number, autoStop?: boolean }} [config]
 */
export function useSimulation(config = {}) {
  const startDateMs = config.startDateMs ?? DEFAULT_START_MS;
  const seed = config.seed ?? 1;
  const autoStop = config.autoStop ?? true;
  const startYear = new Date(startDateMs).getUTCFullYear();

  // --- UI state (drives controls; never read inside the rAF loop) ---
  const [playing, setPlaying] = useState(true);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const [fleets, setFleets] = useState(0);
  const [deployYear, setDeployYear] = useState(null);
  const [display, setDisplay] = useState(null);

  // --- loop-owned mutable state (refs, to avoid re-renders / stale closures) ---
  const playingRef = useRef(playing);
  const speedRef = useRef(SPEED_PRESETS[speedIndex]);
  const fleetsRef = useRef(0);
  const removalRef = useRef(0); // high-band removal = fleets × FLEET_CAPACITY
  const modelsRef = useRef(null);
  const accRef = useRef(0);
  const visualDaysRef = useRef(0); // smooth, per-frame sim-clock for globe motion (no step chunking)
  const lastTimeRef = useRef(null);
  const lastHistoryDayRef = useRef(0);
  const lastDisplayRef = useRef(0);
  const historyRef = useRef([]);
  const frameRef = useRef(null);
  const subscribersRef = useRef(new Set());
  const rafRef = useRef(0);

  const pushDisplay = useCallback((frame, now) => {
    lastDisplayRef.current = now;
    setDisplay({
      days: frame.days,
      year: frame.year,
      dateMs: frame.dateMs,
      live: frame.live,
      ghost: frame.ghost,
      playing: frame.playing,
      history: historyRef.current.slice(),
      // current values as a history-shaped row, so charts reach "now" (the dot)
      liveRow: currentRowUnlessDuplicate(historyRef.current, historyRow(frame.live, frame.ghost)),
    });
  }, []);

  /** Rebuild both engines from t0 and clear all derived buffers. */
  const reset = useCallback(() => {
    const models = makeModels(startDateMs, seed);
    modelsRef.current = models;
    accRef.current = 0;
    visualDaysRef.current = 0;
    lastTimeRef.current = null;
    lastHistoryDayRef.current = 0;
    historyRef.current = [historyRow(models.live.snapshot(), models.ghost.snapshot())];
    fleetsRef.current = 0;
    removalRef.current = 0;
    const frame = buildFrame(
      models.live,
      models.ghost,
      new Array(SHELLS.length).fill(0),
      true,
      speedRef.current,
      removalRef.current,
      fleetsRef.current,
    );
    frame.visualDays = 0;
    frameRef.current = frame;
    setPlaying(true);
    playingRef.current = true;
    setFleets(0);
    setDeployYear(null);
    pushDisplay(frame, performance.now());
  }, [startDateMs, seed, pushDisplay]);

  // keep refs in sync with control state
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    speedRef.current = SPEED_PRESETS[speedIndex];
  }, [speedIndex]);
  useEffect(() => {
    fleetsRef.current = fleets;
    removalRef.current = effectiveRemoval(fleets);
  }, [fleets]);

  // --- master loop ---
  useEffect(() => {
    if (!modelsRef.current) reset();

    const tick = (now) => {
      const { live, ghost } = modelsRef.current;
      const last = lastTimeRef.current ?? now;
      lastTimeRef.current = now;
      const realDt = Math.min((now - last) / 1000, MAX_REAL_DT_S);

      const events = new Array(SHELLS.length).fill(0);
      if (playingRef.current) {
        const advanceDays = realDt * speedRef.current.yearsPerSecond * DAYS_PER_YEAR;
        const { steps, remainder } = planSteps(accRef.current, advanceDays, STEP_DAYS);
        accRef.current = remainder;
        const liveR = removalVector(removalRef.current);
        const ghostR = removalVector(0); // counterfactual: never intervenes

        for (let i = 0; i < steps; i++) {
          live.step(STEP_DAYS, liveR);
          ghost.step(STEP_DAYS, ghostR);
          const ev = live.sampleCollisions(STEP_DAYS);
          for (let j = 0; j < events.length; j++) events[j] += ev[j] ?? 0;
          if (live.days - lastHistoryDayRef.current >= HISTORY_STEP_DAYS) {
            lastHistoryDayRef.current = live.days;
            const buf = historyRef.current;
            buf.push(historyRow(live.snapshot(), ghost.snapshot()));
            if (buf.length > MAX_HISTORY) buf.shift();
          }
        }
        visualDaysRef.current = live.days + remainder; // assign after stepping so animation never rewinds

        if (autoStop && live.year >= startYear + HORIZON_YEARS) {
          playingRef.current = false;
          setPlaying(false);
        }
      }

      const frame = buildFrame(
        live,
        ghost,
        events,
        playingRef.current,
        speedRef.current,
        removalRef.current,
        fleetsRef.current,
      );
      frame.visualDays = visualDaysRef.current;
      frameRef.current = frame;
      subscribersRef.current.forEach((cb) => cb(frame));

      if (now - lastDisplayRef.current >= DISPLAY_INTERVAL_MS) pushDisplay(frame, now);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- controls (stable identities) ---
  const onFrame = useCallback((cb) => {
    subscribersRef.current.add(cb);
    return () => subscribersRef.current.delete(cb);
  }, []);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const cycleSpeed = useCallback(
    () => setSpeedIndex((i) => (i + 1) % SPEED_PRESETS.length),
    [],
  );
  // Deploy/recall act on the live timeline immediately (removalRef is read each
  // frame), so the trajectory bends from "now" — no rebuild, no rewind.
  const deployFleet = useCallback(() => {
    setFleets((f) => {
      const next = Math.min(MAX_FLEETS, f + 1);
      fleetsRef.current = next;
      removalRef.current = effectiveRemoval(next);
      if (f === 0 && modelsRef.current) {
        setDeployYear(modelsRef.current.live.snapshot().year);
      }
      return next;
    });
  }, []);
  const recallFleet = useCallback(() => {
    setFleets((f) => {
      const next = Math.max(0, f - 1);
      fleetsRef.current = next;
      removalRef.current = effectiveRemoval(next);
      if (next === 0) setDeployYear(null);
      return next;
    });
  }, []);

  return {
    // read by globe (stable identities — won't re-trigger effects)
    frameRef,
    onFrame,
    // throttled snapshot for HUD/charts
    display,
    // control state
    playing,
    speedIndex,
    speedLabel: SPEED_PRESETS[speedIndex].label,
    fleets,
    deployYear,
    removal: effectiveRemoval(fleets),
    maxFleets: MAX_FLEETS,
    fleetCapacity: FLEET_CAPACITY,
    startYear,
    horizonYears: HORIZON_YEARS,
    // control actions
    controls: {
      toggle,
      cycleSpeed,
      setSpeedIndex,
      deployFleet,
      recallFleet,
      reset,
    },
  };
}
