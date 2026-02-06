// edge detection: sobel, canny, laplacian
// all operate on a luma grid and return an edge magnitude grid (0..255)

import type { EdgeMode } from './types'

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v
}

export function detectEdges(
  luma: Float32Array,
  cols: number,
  rows: number,
  mode: EdgeMode,
  strength: number,   // 0..100
  threshold: number,  // 0..255
): Float32Array {
  const s = strength / 100

  if (mode === 'sobel') return sobel(luma, cols, rows, s, threshold)
  if (mode === 'laplacian') return laplacian(luma, cols, rows, s, threshold)
  if (mode === 'canny') return canny(luma, cols, rows, s, threshold)
  return new Float32Array(luma.length) // off
}

// blend edge result into original luma
export function blendEdges(
  luma: Float32Array,
  edges: Float32Array,
  blendPct: number, // 0..100
): void {
  const t = blendPct / 100
  for (let i = 0; i < luma.length; i++) {
    luma[i] = luma[i] * (1 - t) + edges[i] * t
  }
}

// helper: get pixel with bounds check
function px(luma: Float32Array, cols: number, rows: number, x: number, y: number): number {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return 0
  return luma[y * cols + x]
}

function sobel(
  luma: Float32Array, cols: number, rows: number,
  strength: number, threshold: number,
): Float32Array {
  const out = new Float32Array(luma.length)
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      // sobel 3x3 kernels
      const gx =
        -px(luma, cols, rows, x - 1, y - 1) + px(luma, cols, rows, x + 1, y - 1)
        - 2 * px(luma, cols, rows, x - 1, y) + 2 * px(luma, cols, rows, x + 1, y)
        - px(luma, cols, rows, x - 1, y + 1) + px(luma, cols, rows, x + 1, y + 1)
      const gy =
        -px(luma, cols, rows, x - 1, y - 1) - 2 * px(luma, cols, rows, x, y - 1) - px(luma, cols, rows, x + 1, y - 1)
        + px(luma, cols, rows, x - 1, y + 1) + 2 * px(luma, cols, rows, x, y + 1) + px(luma, cols, rows, x + 1, y + 1)
      let mag = Math.sqrt(gx * gx + gy * gy) * strength
      if (mag < threshold) mag = 0
      out[y * cols + x] = clamp(mag)
    }
  }
  return out
}

function laplacian(
  luma: Float32Array, cols: number, rows: number,
  strength: number, threshold: number,
): Float32Array {
  // 3x3 laplacian kernel: [0,1,0],[1,-4,1],[0,1,0]
  const out = new Float32Array(luma.length)
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const v =
        px(luma, cols, rows, x, y - 1) +
        px(luma, cols, rows, x - 1, y) +
        px(luma, cols, rows, x + 1, y) +
        px(luma, cols, rows, x, y + 1) -
        4 * px(luma, cols, rows, x, y)
      let mag = Math.abs(v) * strength
      if (mag < threshold) mag = 0
      out[y * cols + x] = clamp(mag)
    }
  }
  return out
}

function canny(
  luma: Float32Array, cols: number, rows: number,
  strength: number, threshold: number,
): Float32Array {
  // simplified canny: gaussian blur -> sobel -> non-max suppression -> threshold
  const blurred = gaussianBlur3x3(luma, cols, rows)
  const { magnitude, angle } = sobelWithAngle(blurred, cols, rows)

  // non-maximum suppression
  const suppressed = new Float32Array(magnitude.length)
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const i = y * cols + x
      const a = angle[i]
      const m = magnitude[i]

      // quantize angle to 0, 45, 90, 135
      let n1 = 0, n2 = 0
      if ((a >= -22.5 && a < 22.5) || a >= 157.5 || a < -157.5) {
        n1 = magnitude[i - 1] || 0
        n2 = magnitude[i + 1] || 0
      } else if ((a >= 22.5 && a < 67.5) || (a >= -157.5 && a < -112.5)) {
        n1 = magnitude[i - cols + 1] || 0
        n2 = magnitude[i + cols - 1] || 0
      } else if ((a >= 67.5 && a < 112.5) || (a >= -112.5 && a < -67.5)) {
        n1 = magnitude[i - cols] || 0
        n2 = magnitude[i + cols] || 0
      } else {
        n1 = magnitude[i - cols - 1] || 0
        n2 = magnitude[i + cols + 1] || 0
      }

      suppressed[i] = (m >= n1 && m >= n2) ? m : 0
    }
  }

  // double threshold
  const high = threshold
  const low = threshold * 0.4
  const out = new Float32Array(suppressed.length)
  for (let i = 0; i < suppressed.length; i++) {
    const v = suppressed[i] * strength
    if (v >= high) out[i] = clamp(v)
    else if (v >= low) out[i] = clamp(v * 0.5) // weak edge
    // else 0
  }
  return out
}

// tiny 3x3 gaussian blur for canny preprocessing
function gaussianBlur3x3(luma: Float32Array, cols: number, rows: number): Float32Array {
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1]
  const kSum = 16
  const out = new Float32Array(luma.length)
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      let sum = 0
      let ki = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += luma[(y + dy) * cols + (x + dx)] * kernel[ki++]
        }
      }
      out[y * cols + x] = sum / kSum
    }
  }
  return out
}

// sobel that also returns angle (for canny nms)
function sobelWithAngle(
  luma: Float32Array, cols: number, rows: number,
): { magnitude: Float32Array; angle: Float32Array } {
  const magnitude = new Float32Array(luma.length)
  const angle = new Float32Array(luma.length)
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const i = y * cols + x
      const gx =
        -luma[i - cols - 1] + luma[i - cols + 1]
        - 2 * luma[i - 1] + 2 * luma[i + 1]
        - luma[i + cols - 1] + luma[i + cols + 1]
      const gy =
        -luma[i - cols - 1] - 2 * luma[i - cols] - luma[i - cols + 1]
        + luma[i + cols - 1] + 2 * luma[i + cols] + luma[i + cols + 1]
      magnitude[i] = Math.sqrt(gx * gx + gy * gy)
      angle[i] = Math.atan2(gy, gx) * (180 / Math.PI)
    }
  }
  return { magnitude, angle }
}
