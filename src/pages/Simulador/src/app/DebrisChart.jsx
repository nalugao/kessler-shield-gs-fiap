import { useMemo } from "react";
import { criticalThreshold } from "../sim/project.js";
import {
  PRIMARY,
  xOfYear,
  makeLogY,
  logBounds,
  logTicks,
  linePath,
  gapPath,
  gapLabelPos,
  Playhead,
  XAxis,
  plotDims,
} from "./chartUtils.jsx";

export default function DebrisChart({ sim }) {
  const { display, startYear, horizonYears, deployYear, fleets } = sim;
  const rows = display?.history ?? [];
  const nowYear = display?.year ?? startYear;
  const c = display?.live?.systemCriticality ?? 0;
  const frame = PRIMARY;
  const threshold = criticalThreshold();

  const xFn = (year) => xOfYear(year, startYear, horizonYears, frame);

  const { yMin, yMax } = useMemo(() => {
    const vals = [threshold];
    for (const r of rows) vals.push(r.high, r.ghost_high);
    return logBounds(vals, 500);
  }, [rows, threshold]);

  const yFn = useMemo(() => makeLogY(yMin, yMax, frame), [yMin, yMax]);
  const { plotW, plotH } = plotDims(frame);
  const ticks = logTicks(yMin, yMax);
  const thresholdY = yFn(threshold);
  const showUnusable = c >= 1.15 && fleets === 0;

  const gap = useMemo(
    () => (fleets > 0 ? gapPath(rows, "high", "ghost_high", xFn, yFn) : ""),
    [rows, fleets, yMin, yMax, startYear, horizonYears],
  );
  const gapLabel = useMemo(
    () => (fleets > 0 ? gapLabelPos(rows, "high", "ghost_high", xFn, yFn) : null),
    [rows, fleets, yMin, yMax, startYear, horizonYears],
  );

  const last = rows.length ? rows[rows.length - 1] : null;
  const diverged = gapLabel != null;
  const highD = display?.live?.shells?.find((s) => s.id === "high")?.D;

  return (
    <div className="overlay-chart overlay-chart-primary">
      <div className="overlay-chart-primary-head">
        <div>
          <p className="overlay-chart-title">Detritos na órbita</p>
          <p className="overlay-chart-hint">900 km — o lixo que não sai sozinho</p>
        </div>
        <div className="overlay-legends">
          <span className="leg leg-ghost">sem intervenção</span>
          {fleets > 0 && <span className="leg leg-live">com suas frotas</span>}
        </div>
      </div>

      <svg viewBox={`0 0 ${frame.w} ${frame.h}`} className="chart-svg chart-primary-svg">
        <rect
          x={frame.pad.left}
          y={frame.pad.top}
          width={plotW}
          height={Math.max(0, thresholdY - frame.pad.top)}
          className="zone-runaway"
        />
        {showUnusable && (
          <text
            x={frame.pad.left + plotW * 0.55}
            y={frame.pad.top + 22}
            className="canvas-label label-unusable"
          >
            órbita intransitável
          </text>
        )}

        {ticks.map((t) => (
          <g key={t.v}>
            <line
              x1={frame.pad.left}
              x2={frame.w - frame.pad.right}
              y1={yFn(t.v)}
              y2={yFn(t.v)}
              className="grid"
            />
            <text x={frame.pad.left - 8} y={yFn(t.v) + 4} className="ax-label" textAnchor="end">
              {t.label}
            </text>
          </g>
        ))}

        <line
          x1={frame.pad.left}
          x2={frame.w - frame.pad.right}
          y1={thresholdY}
          y2={thresholdY}
          className="threshold"
        />
        <text x={frame.pad.left + 4} y={thresholdY - 6} className="canvas-label label-threshold">
          sem volta
        </text>

        {gap && <path d={gap} className="gap-fill" />}

        {rows.length > 1 && (
          <path d={linePath(rows, "ghost_high", xFn, yFn)} className="line-ghost line-ghost-bold" />
        )}
        {rows.length > 1 && fleets > 0 && (
          <path d={linePath(rows, "high", xFn, yFn)} className="line-saving" />
        )}

        {last && (
          <text
            x={xFn(last.year) - 10}
            y={yFn(last.ghost_high) - 8}
            className="canvas-label label-cascade"
            textAnchor="end"
          >
            cascata
          </text>
        )}

        {diverged && last && (
          <text
            x={xFn(last.year) - 8}
            y={yFn(last.high) + 16}
            className="canvas-label label-stable"
            textAnchor="end"
          >
            estabilizado
          </text>
        )}

        {gapLabel && (
          <text x={gapLabel.x} y={gapLabel.y} className="canvas-label label-gap">
            catástrofe evitada
          </text>
        )}

        {deployYear != null && (
          <g>
            <line
              x1={xFn(deployYear)}
              x2={xFn(deployYear)}
              y1={frame.pad.top}
              y2={frame.pad.top + plotH}
              className="deploy-line"
            />
            <text x={xFn(deployYear) + 5} y={frame.pad.top + 12} className="canvas-label label-deploy">
              frota implantada
            </text>
          </g>
        )}

        {highD != null && (
          <circle cx={xFn(nowYear)} cy={yFn(highD)} r="4" className="now-dot" />
        )}
        <Playhead
          x={xFn(nowYear)}
          yTop={frame.pad.top}
          yBot={frame.pad.top + plotH}
          nowYear={nowYear}
          frame={frame}
        />
        <XAxis startYear={startYear} horizonYears={horizonYears} frame={frame} />
      </svg>
    </div>
  );
}
