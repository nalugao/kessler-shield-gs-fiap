import { useMemo } from "react";
import InfoTip from "./InfoTip.jsx";
import {
  plotDims,
  xOfYear,
  makeLogY,
  makeLinearY,
  logBounds,
  linearBounds,
  logTicks,
  linePath,
  areaPath,
  gapPath,
  fmtCount,
  val,
} from "./chartUtils.jsx";

/** Nicely-spaced linear ticks. */
function linearTicks(min, max, n = 4) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const v = min + ((max - min) * i) / n;
    out.push({ v, label: max <= 12 ? String(+v.toFixed(1)).replace(/\.0$/, "") : fmtCount(v) });
  }
  return out;
}

/**
 * One member of the chart family: a KPI value + a trend on the shared time axis +
 * a one-line conclusion, with a real y-axis (gridlines + ticks). `axisSide` mirrors
 * the axis — left rail labels on the left, right rail on the right.
 */
export default function MiniChart({
  sim,
  title,
  value,
  valueClass = "",
  caption,
  scale = "linear",
  domain,
  series,
  threshold,
  gap,
  axisSide = "left",
  tickFormat,
  info,
  tourId,
  height = 132,
}) {
  const { display, startYear } = sim;
  // append the live "now" point so the curve reaches the leading dot smoothly
  const rows = display ? (display.liveRow ? [...display.history, display.liveRow] : display.history) : [];
  const nowYear = display?.year ?? startYear;
  const domainYears = Math.max(8, nowYear - startYear);

  const right = axisSide === "right";
  const frame = {
    w: 300,
    h: height,
    pad: { left: right ? 14 : 48, right: right ? 48 : 14, top: 14, bottom: 20 },
  };
  const { plotW, plotH } = plotDims(frame);
  const xFn = (year) => xOfYear(year, startYear, domainYears, frame);

  const { yFn, ticks } = useMemo(() => {
    let lo, hi;
    if (domain) {
      lo = domain.min;
      hi = domain.max;
    } else {
      const vals = [];
      for (const r of rows) {
        for (const s of series) vals.push(val(r, s.key));
        if (gap) vals.push(val(r, gap.ghost), val(r, gap.live));
      }
      if (threshold) vals.push(threshold.value);
      const b = scale === "log" ? logBounds(vals, 1) : linearBounds(vals);
      lo = b.yMin;
      hi = b.yMax;
    }
    const fn = scale === "log" ? makeLogY(lo, hi, frame) : makeLinearY(lo, hi, frame);
    let tk = scale === "log" ? logTicks(lo, hi) : linearTicks(lo, hi);
    if (tickFormat) tk = tk.map((t) => ({ v: t.v, label: tickFormat(t.v) }));
    return { yFn: fn, ticks: tk };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, scale, startYear, domainYears, height, domain, axisSide]);

  const baseY = frame.pad.top + plotH;
  const thresholdY = threshold ? yFn(threshold.value) : null;
  const gapD = useMemo(
    () => (gap ? gapPath(rows, gap.live, gap.ghost, xFn, yFn) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, gap, yFn],
  );

  const primary = series[series.length - 1];
  const lastRow = rows.length ? rows[rows.length - 1] : null;
  const lastV = lastRow ? val(lastRow, primary.key) : null;
  const endY = lastV != null && isFinite(lastV) ? yFn(lastV) : null;

  const labelX = right ? frame.w - frame.pad.right + 5 : frame.pad.left - 5;
  const labelAnchor = right ? "start" : "end";

  return (
    <section className={"panel" + (right ? " panel-right" : "")} data-tour-id={tourId}>
      <div className="panel-head">
        <span className="panel-label">
          <span className="panel-title">
            {title}
          </span>
          {info && <InfoTip {...info} />}
        </span>
        <span className={"panel-value " + valueClass}>{value}</span>
      </div>

      <svg viewBox={`0 0 ${frame.w} ${frame.h}`} className="panel-svg">
        {/* y gridlines + ticks */}
        {ticks.map((t) => (
          <g key={t.v}>
            <line x1={frame.pad.left} x2={frame.w - frame.pad.right} y1={yFn(t.v)} y2={yFn(t.v)} className="grid" />
            <text x={labelX} y={yFn(t.v) + 3} className="ax-label" textAnchor={labelAnchor}>
              {t.label}
            </text>
          </g>
        ))}

        {threshold && (
          <>
            <line x1={frame.pad.left} x2={frame.w - frame.pad.right} y1={thresholdY} y2={thresholdY} className="threshold" />
            <text x={right ? frame.w - frame.pad.right : frame.pad.left} y={thresholdY - 4}
              className="cap label-threshold" textAnchor={right ? "end" : "start"}>
              {threshold.label}
            </text>
          </>
        )}

        {gapD && <path d={gapD} className="gap-fill" />}

        {rows.length > 1 &&
          series.map((s, i) =>
            s.kind === "area" ? (
              <path key={i} d={areaPath(rows, s.key, xFn, yFn, baseY)} style={{ fill: s.color, fillOpacity: 0.14, stroke: "none" }} />
            ) : null,
          )}
        {rows.length > 1 &&
          series.map((s, i) => (
            <path key={"l" + i} d={linePath(rows, s.key, xFn, yFn)}
              style={{ fill: "none", stroke: s.color, strokeWidth: s.width ?? 1.5, strokeDasharray: s.dashed ? "3 3" : "none", strokeLinecap: "round", strokeLinejoin: "round" }} />
          ))}

        {endY != null && <circle cx={xFn(nowYear)} cy={endY} r="2.4" style={{ fill: primary.color }} />}
      </svg>

      <p className="panel-cap">{caption}</p>
    </section>
  );
}
