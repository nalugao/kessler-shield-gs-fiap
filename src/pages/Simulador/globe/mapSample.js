/**
 * Load world-map.png (256×128 grayscale) and sample at equirectangular UV.
 * Used by calibration and unit tests — single source for map assertions.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const mapPath = join(root, "public/world-map.png");

/** @typedef {{ w: number, h: number, data: Uint8Array }} GrayMap */

/** @returns {GrayMap} */
export function loadWorldMap() {
  const out = execFileSync(
    "python3",
    [
      "-c",
      `from PIL import Image; import sys
im = Image.open(sys.argv[1]).convert("L")
w, h = im.size
sys.stdout.buffer.write(w.to_bytes(4, "big") + h.to_bytes(4, "big") + bytes(im.getdata()))`,
      mapPath,
    ],
    { encoding: "buffer" },
  );
  const w = out.readUInt32BE(0);
  const h = out.readUInt32BE(4);
  return { w, h, data: out.subarray(8) };
}

/**
 * Sample map at normalized UV. Matches WebGL with UNPACK_FLIP_Y_WEBGL=false
 * (image row 0 / north pole → texture v=0).
 * @param {GrayMap} map
 * @param {number} u
 * @param {number} v
 */
export function sampleMap(map, u, v) {
  const x = Math.max(0, Math.min(map.w - 1, Math.round(u * (map.w - 1))));
  const y = Math.max(0, Math.min(map.h - 1, Math.round(v * (map.h - 1))));
  return map.data[y * map.w + x];
}

/** @param {GrayMap} map @param {number} u @param {number} v @param {number} [radiusPx=8] */
export function sampleMapNeighborhood(map, u, v, radiusPx = 8) {
  let best = 0;
  const cx = Math.round(u * (map.w - 1));
  const cy = Math.round(v * (map.h - 1));
  for (let dy = -radiusPx; dy <= radiusPx; dy++) {
    for (let dx = -radiusPx; dx <= radiusPx; dx++) {
      const x = Math.max(0, Math.min(map.w - 1, cx + dx));
      const y = Math.max(0, Math.min(map.h - 1, cy + dy));
      best = Math.max(best, map.data[y * map.w + x]);
    }
  }
  return best;
}

export const MAP_LAND_THRESHOLD = 128;
