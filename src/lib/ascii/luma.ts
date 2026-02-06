// brightness, contrast, gamma, invert adjustments on a luma grid

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

export function applyAdjustments(
  luma: Float32Array,
  brightness: number,
  contrast: number,
  gamma: number,
  invert: boolean,
): void {
  // contrast factor: maps -100..100 to the standard formula range
  const c = (contrast / 100) * 255
  const factor = (259 * (c + 255)) / (255 * (259 - c))

  // gamma: precompute inverse
  const invGamma = 1 / gamma

  for (let i = 0; i < luma.length; i++) {
    let v = luma[i]

    // invert first so contrast/brightness operate on inverted signal
    if (invert) v = 255 - v

    // contrast + brightness
    v = factor * (v - 128) + 128 + (brightness / 100) * 255

    // gamma correction
    v = clamp(v, 0, 255)
    v = 255 * Math.pow(v / 255, invGamma)

    luma[i] = clamp(v, 0, 255)
  }
}
