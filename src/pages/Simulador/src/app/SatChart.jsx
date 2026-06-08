import { useMemo } from "react";
import {
  COMPACT,
  xOfYear,
  makeLinearY,
  linearBounds,
  linePath,
  fmtCount,
  Playhead,
  XAxis,
  plotDims,
} from "./chartUtils.jsx";

export default function SatChart({ sim }) {
  const { display, startYear, horizonYears } = sim;
  const rows = display?.history ?? [];
  const nowYear = display?.year ?? startYear;
  const frame = COMPACT;

  const { yMin, yMax } = useMemo(() => {
    const vals = rows.map((r) => r.totalS);
    return linearBounds(vals);
  }, [rows]);

  const yFn = useMemo(() => makeLinearY(yMin, yMax, frame), [yMin, yMax]);
  const xFn = (year) => xOfYear(year, startYear, horizonYears, frame);
  const { plotH } = plotDims(frame);
  const nowS = display?.live?.totalS;

  return (
    <div className="overlay-chart overlay-chart-compact">
      <p className="overlay-chart-title">Satélites ativos</p>
      <p className="overlay-chart-hint">A órbita enche</p>
      <svg viewBox={`0 0 ${frame.w} ${frame.h}`} className="chart-svg">
        <line
          x1={frame.pad.left}
          x2={frame.w - frame.pad.right}
          y1={yFn(0)}
          y2={yFn(0)}
          className="grid"
        />
        <text x={frame.pad.left - 6} y={yFn(yMax) + 4} className="ax-label" textAnchor="end">
          {fmtCount(yMax)}
        </text>
        {rows.length > 1 && (
          <path d={linePath(rows, "totalS", xFn, yFn)} className="line-sat" />
        )}
        {nowS != null && (
          <circle cx={xFn(nowYear)} cy={yFn(nowS)} r="3.5" className="now-dot" />
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
