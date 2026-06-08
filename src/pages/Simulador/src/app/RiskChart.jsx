import { useMemo } from "react";
import {
  COMPACT,
  xOfYear,
  makeLogY,
  logBounds,
  logTicks,
  linePath,
  Playhead,
  XAxis,
  plotDims,
} from "./chartUtils.jsx";

export default function RiskChart({ sim }) {
  const { display, startYear, horizonYears, fleets } = sim;
  const rows = display?.history ?? [];
  const nowYear = display?.year ?? startYear;
  const frame = COMPACT;

  const { yMin, yMax } = useMemo(() => {
    const vals = [];
    for (const r of rows) {
      vals.push(r.highColl);
      if (fleets > 0) vals.push(r.ghost_highColl);
    }
    return logBounds(vals, 0.01);
  }, [rows, fleets]);

  const yFn = useMemo(() => makeLogY(yMin, yMax, frame), [yMin, yMax]);
  const xFn = (year) => xOfYear(year, startYear, horizonYears, frame);
  const { plotH } = plotDims(frame);
  const ticks = logTicks(yMin, yMax);
  const coll = display?.live?.shells?.find((s) => s.id === "high")?.collisionRate;

  return (
    <div className="overlay-chart overlay-chart-compact">
      <p className="overlay-chart-title">Risco de colisão</p>
      <p className="overlay-chart-hint">Colisões geram detritos</p>
      <svg viewBox={`0 0 ${frame.w} ${frame.h}`} className="chart-svg">
        {ticks.map((t) => (
          <g key={t.v}>
            <line
              x1={frame.pad.left}
              x2={frame.w - frame.pad.right}
              y1={yFn(t.v)}
              y2={yFn(t.v)}
              className="grid"
            />
            <text x={frame.pad.left - 6} y={yFn(t.v) + 4} className="ax-label" textAnchor="end">
              {t.label}
            </text>
          </g>
        ))}
        {rows.length > 1 && (
          <path d={linePath(rows, "highColl", xFn, yFn)} className="line-live-risk" />
        )}
        {rows.length > 1 && fleets > 0 && (
          <path d={linePath(rows, "ghost_highColl", xFn, yFn)} className="line-ghost" />
        )}
        {coll != null && (
          <circle cx={xFn(nowYear)} cy={yFn(coll)} r="3.5" className="now-dot" />
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
