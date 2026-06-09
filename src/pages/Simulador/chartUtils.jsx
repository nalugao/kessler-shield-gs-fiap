/** Shared SVG helpers for overlay charts. */

export const COMPACT = {
  w: 320,
  h: 150,
  pad: { left: 44, right: 12, top: 28, bottom: 22 },
};

export const PRIMARY = {
  w: 920,
  h: 220,
  pad: { left: 52, right: 24, top: 36, bottom: 30 },
};

export function plotDims(frame) {
  return {
    plotW: frame.w - frame.pad.left - frame.pad.right,
    plotH: frame.h - frame.pad.top - frame.pad.bottom,
  };
}

export function xOfYear(year, startYear, horizonYears, frame) {
  const { plotW } = plotDims(frame);
  const t = Math.max(0, Math.min(1, (year - startYear) / horizonYears));
  return frame.pad.left + t * plotW;
}

export function makeLinearY(min, max, frame) {
  const { plotH } = plotDims(frame);
  const span = max - min || 1;
  return (v) =>
    frame.pad.top + (1 - (Math.max(min, Math.min(max, v)) - min) / span) * plotH;
}

export function makeLogY(yMin, yMax, frame) {
  const logMin = Math.log10(yMin);
  const logMax = Math.log10(yMax);
  const span = logMax - logMin || 1;
  const { plotH } = plotDims(frame);
  return (v) => {
    const c = Math.max(yMin, Math.min(yMax, v));
    return frame.pad.top + (1 - (Math.log10(c) - logMin) / span) * plotH;
  };
}

export function logBounds(values, floor = 1) {
  let hi = floor;
  for (const v of values) {
    if (v != null && isFinite(v) && v > hi) hi = v;
  }
  const logHi = Math.ceil(Math.log10(hi * 1.2));
  const logLo = Math.floor(Math.log10(Math.max(floor, hi * 0.002)));
  return { yMin: Math.pow(10, logLo), yMax: Math.pow(10, logHi) };
}

export function linearBounds(values, { min = 0, pad = 0.12 } = {}) {
  let hi = min;
  for (const v of values) {
    if (v != null && isFinite(v) && v > hi) hi = v;
  }
  return { yMin: min, yMax: hi <= min ? min + 1 : hi * (1 + pad) };
}

export function logTicks(yMin, yMax) {
  const lo = Math.floor(Math.log10(yMin));
  const hi = Math.ceil(Math.log10(yMax));
  const ticks = [];
  for (let e = lo; e <= hi; e++) {
    const v = Math.pow(10, e);
    if (v >= yMin * 0.99 && v <= yMax * 1.01) {
      ticks.push({
        v,
        label: v >= 1e6 ? v / 1e6 + "M" : v >= 1e3 ? v / 1e3 + "k" : String(Math.round(v)),
      });
    }
  }
  return ticks;
}

/** Accessor: a string key or a (row) => number function. */
export const val = (row, key) => (typeof key === "function" ? key(row) : row[key]);

export function linePath(rows, key, xFn, yFn) {
  let d = "";
  for (let i = 0; i < rows.length; i++) {
    const v = val(rows[i], key);
    if (v == null || !isFinite(v)) continue;
    d += (d ? "L" : "M") + xFn(rows[i].year).toFixed(1) + " " + yFn(v).toFixed(1);
  }
  return d;
}

/** Filled area from the curve down to a baseline (for cumulative-growth charts). */
export function areaPath(rows, key, xFn, yFn, baseY) {
  const pts = [];
  for (let i = 0; i < rows.length; i++) {
    const v = val(rows[i], key);
    if (v == null || !isFinite(v)) continue;
    pts.push(`${xFn(rows[i].year).toFixed(1)} ${yFn(v).toFixed(1)}`);
  }
  if (pts.length < 2) return "";
  const x0 = xFn(rows[0].year).toFixed(1);
  const xN = xFn(rows[rows.length - 1].year).toFixed(1);
  return `M${x0} ${baseY.toFixed(1)}L` + pts.join("L") + `L${xN} ${baseY.toFixed(1)}Z`;
}

export function fmtCount(n) {
  if (!isFinite(n)) return "∞";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return Math.round(n).toString();
}

/** US$ figure, Portuguese short scale (bi / tri). */
export function fmtUSD(n) {
  if (!isFinite(n)) return "—";
  if (n >= 1e12) return "US$ " + (n / 1e12).toFixed(1) + " tri";
  if (n >= 1e9) return "US$ " + (n / 1e9).toFixed(0) + " bi";
  if (n >= 1e6) return "US$ " + (n / 1e6).toFixed(0) + " mi";
  return "US$ " + Math.round(n / 1e6) + " mi";
}

/** Compact money label for axis ticks. */
export function fmtMoneyTick(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(0) + "tri";
  if (n >= 1e9) return (n / 1e9).toFixed(0) + "bi";
  return (n / 1e6).toFixed(0) + "mi";
}

export function gapPath(rows, liveKey, ghostKey, xFn, yFn, minGap = 80) {
  if (rows.length < 2) return "";
  let start = 0;
  for (let i = 0; i < rows.length; i++) {
    const g = rows[i][ghostKey];
    const l = rows[i][liveKey];
    if (g != null && l != null && g - l > minGap) {
      start = i;
      break;
    }
  }
  const slice = rows.slice(start);
  if (slice.length < 2) return "";
  const top = slice.map((r) => `${xFn(r.year).toFixed(1)} ${yFn(val(r, ghostKey)).toFixed(1)}`);
  const bot = slice
    .slice()
    .reverse()
    .map((r) => `${xFn(r.year).toFixed(1)} ${yFn(val(r, liveKey)).toFixed(1)}`);
  return "M" + top.join("L") + "L" + bot.join("L") + "Z";
}

export function gapLabelPos(rows, liveKey, ghostKey, xFn, yFn, minGap = 80) {
  if (rows.length < 4) return null;
  const i = Math.min(rows.length - 1, Math.floor(rows.length * 0.7));
  const r = rows[i];
  if (!r || val(r, ghostKey) - val(r, liveKey) < minGap) return null;
  return { x: xFn(r.year), y: (yFn(val(r, ghostKey)) + yFn(val(r, liveKey))) / 2 };
}

export function Playhead({ x, yTop, yBot, nowYear, frame }) {
  return (
    <g>
      <line x1={x} x2={x} y1={yTop} y2={yBot} className="now-line" />
      <text x={x} y={frame.h - 6} className="ax-label now-year" textAnchor="middle">
        {Math.floor(nowYear)}
      </text>
    </g>
  );
}

export function XAxis({ startYear, horizonYears, frame }) {
  return (
    <>
      <text x={frame.pad.left} y={frame.h - 6} className="ax-label">
        {startYear}
      </text>
      <text x={frame.w - frame.pad.right} y={frame.h - 6} className="ax-label" textAnchor="end">
        {startYear + horizonYears}
      </text>
    </>
  );
}
