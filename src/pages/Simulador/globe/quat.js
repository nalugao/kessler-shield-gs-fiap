/** @typedef {[number, number, number, number]} Quat */

export function quatFromAxisAngle([ax, ay, az], angle) {
  const half = angle * 0.5;
  const s = Math.sin(half);
  const len = Math.hypot(ax, ay, az) || 1;
  return [
    (ax / len) * s,
    (ay / len) * s,
    (az / len) * s,
    Math.cos(half),
  ];
}

/** @param {Quat} a @param {Quat} b @returns {Quat} */
export function quatMultiply(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

/** @param {Quat} q @returns {Quat} */
export function quatNormalize(q) {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

/**
 * Column-major mat3 for GLSL `ray * uRot` (row-vector on the left).
 * @param {Quat} q
 * @returns {Float32Array}
 */
export function quatToMat3(q) {
  const [x, y, z, w] = quatNormalize(q);
  const r00 = 1 - 2 * (y * y + z * z);
  const r01 = 2 * (x * y - w * z);
  const r02 = 2 * (x * z + w * y);
  const r10 = 2 * (x * y + w * z);
  const r11 = 1 - 2 * (x * x + z * z);
  const r12 = 2 * (y * z - w * x);
  const r20 = 2 * (x * z - w * y);
  const r21 = 2 * (y * z + w * x);
  const r22 = 1 - 2 * (x * x + y * y);
  return new Float32Array([
    r00, r10, r20,
    r01, r11, r21,
    r02, r12, r22,
  ]);
}

/** @param {Float32Array} m column-major mat3 */
export function mat3ToQuat(m) {
  const r00 = m[0];
  const r01 = m[3];
  const r02 = m[6];
  const r10 = m[1];
  const r11 = m[4];
  const r12 = m[7];
  const r20 = m[2];
  const r21 = m[5];
  const r22 = m[8];
  const tr = r00 + r11 + r22;
  let x;
  let y;
  let z;
  let w;
  if (tr > 0) {
    const s = 0.5 / Math.sqrt(tr + 1);
    w = 0.25 / s;
    x = (r21 - r12) * s;
    y = (r02 - r20) * s;
    z = (r10 - r01) * s;
  } else if (r00 > r11 && r00 > r22) {
    const s = 2 * Math.sqrt(1 + r00 - r11 - r22);
    w = (r21 - r12) / s;
    x = 0.25 * s;
    y = (r01 + r10) / s;
    z = (r02 + r20) / s;
  } else if (r11 > r22) {
    const s = 2 * Math.sqrt(1 + r11 - r00 - r22);
    w = (r02 - r20) / s;
    x = (r01 + r10) / s;
    y = 0.25 * s;
    z = (r12 + r21) / s;
  } else {
    const s = 2 * Math.sqrt(1 + r22 - r00 - r11);
    w = (r10 - r01) / s;
    x = (r02 + r20) / s;
    y = (r12 + r21) / s;
    z = 0.25 * s;
  }
  return quatNormalize([x, y, z, w]);
}

export function projectToBall(x, y, width, height) {
  const nx = (2 * x) / width - 1;
  const ny = 1 - (2 * y) / height;
  const len2 = nx * nx + ny * ny;
  if (len2 <= 1) {
    return [nx, ny, Math.sqrt(1 - len2)];
  }
  const inv = 1 / Math.sqrt(len2);
  return [nx * inv, ny * inv, 0];
}

/**
 * Arcball delta quaternion (camera-space rotation applied to orientation).
 * @param {[number,number,number]} from unit ball coords
 * @param {[number,number,number]} to unit ball coords
 * @returns {Quat | null}
 */
export function trackballDelta(from, to) {
  const dot = from[0] * to[0] + from[1] * to[1] + from[2] * to[2];
  const clamped = Math.max(-1, Math.min(1, dot));
  if (clamped >= 0.99999) {
    return null;
  }
  const angle = Math.acos(clamped);
  const axis = [
    from[1] * to[2] - from[2] * to[1],
    from[2] * to[0] - from[0] * to[2],
    from[0] * to[1] - from[1] * to[0],
  ];
  const len = Math.hypot(axis[0], axis[1], axis[2]);
  if (len < 1e-6) {
    return null;
  }
  return quatFromAxisAngle(
    [axis[0] / len, axis[1] / len, axis[2] / len],
    angle,
  );
}
