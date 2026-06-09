import { useCallback, useEffect, useRef, useState } from "react";
import { createGlobe } from "./engine.js";
import { createDebrisLayer } from "./debris.js";
import { createUfoLayer } from "./ufo.js";
import { tickGlobeFrame, SPIN_RAD_PER_SIM_DAY } from "./spin.js";
import { initialOrientation } from "./view.js";
import { SHELLS } from "../sim/scenarios.js";
import {
  projectToBall,
  quatMultiply,
  quatNormalize,
  quatToMat3,
  trackballDelta,
} from "./quat.js";

const UFO_FIRST_YEAR = 2027;
const UFO_MONTH = 6; // July
const UFO_DAY = 2;
const UFO_DURATION_DAYS = 60;

function latestUfoEventYear(dateMs) {
  const d = new Date(dateMs);
  const year = d.getUTCFullYear();
  if (year < UFO_FIRST_YEAR) return null;
  let eventYear = UFO_FIRST_YEAR + Math.floor((year - UFO_FIRST_YEAR) / 4) * 4;
  if (dateMs < Date.UTC(eventYear, UFO_MONTH, UFO_DAY)) eventYear -= 4;
  return eventYear >= UFO_FIRST_YEAR ? eventYear : null;
}

function pointerOnCanvas(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}

export default function Globe({ onFrame, frameRef }) {
  const canvasRef = useRef(null);
  const orientationRef = useRef(initialOrientation());
  const lastSimDaysRef = useRef(0);
  const lastBallRef = useRef(null);
  const ufoPlayedYearRef = useRef(null);
  const ufoStartDaysRef = useRef(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const onPointerMove = useCallback((event) => {
    if (!draggingRef.current || lastBallRef.current === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const [x, y] = pointerOnCanvas(event, canvas);
    const ball = projectToBall(x, y, canvas.offsetWidth, canvas.offsetHeight);
    const delta = trackballDelta(lastBallRef.current, ball);
    if (delta) {
      orientationRef.current = quatNormalize(
        quatMultiply(delta, orientationRef.current),
      );
    }
    lastBallRef.current = ball;
  }, []);

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
    lastBallRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe = null;
    let debris = null;
    let ufo = null;
    let cancelled = false;
    let unsubscribe = null;

    const boot = () => {
      if (cancelled) return;
      if (!canvas.offsetWidth) {
        requestAnimationFrame(boot);
        return;
      }
      orientationRef.current = initialOrientation();
      try {
        globe = createGlobe(canvas, {
          // Slightly smaller globe leaves annular room for the proportional debris
          // shells to separate (see OUTER_RADIUS in debris.js).
          scale: 0.79,
          // Fallback only — the shared loop passes the matrix in explicitly so the
          // spin advances exactly once per frame and both passes share it.
          getRotationMat3: () => quatToMat3(orientationRef.current),
        });
      } catch (err) {
        console.error("globe init failed:", err);
        return;
      }
      // The debris layer is an enhancement — never let it take the globe down.
      try {
        debris = createDebrisLayer(globe.gl, {
          shells: SHELLS,
          scale: globe.scale,
          dpr: globe.devicePixelRatio,
        });
      } catch (err) {
        console.error("debris layer init failed (globe still renders):", err);
        debris = null;
      }
      try {
        ufo = createUfoLayer(globe.gl, {
          scale: globe.scale,
        });
      } catch (err) {
        console.error("ufo layer init failed (globe still renders):", err);
        ufo = null;
      }
      // Render on the shared simulation clock. Spin and debris orbits advance with
      // simulated time — so pausing freezes the globe and higher speed accelerates it.
      unsubscribe = onFrame(() => {
        const frame = frameRef?.current;
        // smooth per-frame clock (not the chunky stepped days) → 60fps-smooth motion
        const simDays = frame ? (frame.visualDays ?? frame.days) : 0;
        let dDays = simDays - lastSimDaysRef.current;
        if (dDays < 0) {
          dDays = 0; // a reset rewound the clock
          ufoPlayedYearRef.current = null;
          ufoStartDaysRef.current = null;
        }
        lastSimDaysRef.current = simDays;

        const spinAngle = dDays * SPIN_RAD_PER_SIM_DAY;
        const { mat, orientation } = tickGlobeFrame(
          orientationRef.current,
          false, // keep auto-spinning even while the user drags
          spinAngle,
        );
        orientationRef.current = orientation;
        const drew = globe.frame(mat);
        if (drew && debris) {
          try {
            debris.render(mat, frame, simDays / 365.25); // sim-years time base
          } catch (err) {
            console.error("debris render failed; disabling debris:", err);
            debris = null;
          }
        }
        if (drew && ufo && frame?.dateMs) {
          const eventYear = latestUfoEventYear(frame.dateMs);
          if (eventYear === null) {
            ufoPlayedYearRef.current = null;
            ufoStartDaysRef.current = null;
          } else if (ufoPlayedYearRef.current !== eventYear) {
            ufoPlayedYearRef.current = eventYear;
            ufoStartDaysRef.current = simDays;
          }

          if (ufoStartDaysRef.current !== null) {
            const phase = (simDays - ufoStartDaysRef.current) / UFO_DURATION_DAYS;
            if (phase <= 1) {
              ufo.render(mat, phase);
            } else {
              ufoStartDaysRef.current = null;
            }
          }
        }
      });
    };

    boot();
    return () => {
      cancelled = true;
      unsubscribe?.();
      debris?.destroy();
      ufo?.destroy();
      globe?.destroy();
    };
  }, [onFrame, frameRef]);

  function onPointerDown(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    lastBallRef.current = projectToBall(
      ...pointerOnCanvas(event, canvas),
      canvas.offsetWidth,
      canvas.offsetHeight,
    );
    draggingRef.current = true;
    setDragging(true);
  }

  return (
    <canvas
      ref={canvasRef}
      className={dragging ? "dragging" : undefined}
      onPointerDown={onPointerDown}
    />
  );
}
