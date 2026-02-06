// dithering algorithms: floyd-steinberg, bayer 4x4, atkinson
// operates on a luma Float32Array grid and returns character lines

import type { DitherMode } from './types'

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v
}

// apply dithering and map luma values to charset indices
// returns an array of strings (one per row)
export function applyDitherAndMap(
  luma: Float32Array,
  cols: number,
  rows: number,
  mode: DitherMode,
  charset: string,
): string[] {
  const nLevels = charset.length
  // work on a copy so we can diffuse errors
  const grid = new Float32Array(luma)

  if (mode === 'floyd-steinberg') {
    return floydSteinberg(grid, cols, rows, nLevels, charset)
  }
  if (mode === 'atkinson') {
    return atkinson(grid, cols, rows, nLevels, charset)
  }
  if (mode === 'bayer') {
    return bayer(grid, cols, rows, nLevels, charset)
  }
  // no dithering
  return directMap(grid, cols, rows, nLevels, charset)
}

function directMap(
  grid: Float32Array, cols: number, rows: number,
  nLevels: number, charset: string,
): string[] {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const idx = Math.round((grid[y * cols + x] / 255) * (nLevels - 1))
      line += charset.charAt(idx)
    }
    lines.push(line)
  }
  return lines
}

function floydSteinberg(
  grid: Float32Array, cols: number, rows: number,
  nLevels: number, charset: string,
): string[] {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const level = Math.round((grid[i] / 255) * (nLevels - 1))
      line += charset.charAt(level)

      const quantized = (level / (nLevels - 1)) * 255
      const err = grid[i] - quantized

      // distribute error: right 7/16, bottom-left 3/16, bottom 5/16, bottom-right 1/16
      if (x + 1 < cols)
        grid[i + 1] = clamp(grid[i + 1] + err * (7 / 16))
      if (y + 1 < rows) {
        if (x - 1 >= 0)
          grid[i - 1 + cols] = clamp(grid[i - 1 + cols] + err * (3 / 16))
        grid[i + cols] = clamp(grid[i + cols] + err * (5 / 16))
        if (x + 1 < cols)
          grid[i + 1 + cols] = clamp(grid[i + 1 + cols] + err * (1 / 16))
      }
    }
    lines.push(line)
  }
  return lines
}

function atkinson(
  grid: Float32Array, cols: number, rows: number,
  nLevels: number, charset: string,
): string[] {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const level = Math.round((grid[i] / 255) * (nLevels - 1))
      line += charset.charAt(level)

      const quantized = (level / (nLevels - 1)) * 255
      const diff = (grid[i] - quantized) / 8

      // atkinson distributes error/8 to 6 neighbors
      if (x + 1 < cols) grid[i + 1] = clamp(grid[i + 1] + diff)
      if (x + 2 < cols) grid[i + 2] = clamp(grid[i + 2] + diff)
      if (y + 1 < rows) {
        if (x - 1 >= 0) grid[i - 1 + cols] = clamp(grid[i - 1 + cols] + diff)
        grid[i + cols] = clamp(grid[i + cols] + diff)
        if (x + 1 < cols) grid[i + 1 + cols] = clamp(grid[i + 1 + cols] + diff)
      }
      if (y + 2 < rows) grid[i + cols * 2] = clamp(grid[i + cols * 2] + diff)
    }
    lines.push(line)
  }
  return lines
}

// 4x4 bayer threshold matrix
const BAYER: number[][] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]
const BAYER_SIZE = 4
const BAYER_DIVISOR = BAYER_SIZE * BAYER_SIZE

function bayer(
  grid: Float32Array, cols: number, rows: number,
  nLevels: number, charset: string,
): string[] {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const p = grid[y * cols + x] / 255
      const threshold = (BAYER[y % BAYER_SIZE][x % BAYER_SIZE] + 0.5) / BAYER_DIVISOR
      let v = p + threshold - 0.5
      v = Math.max(0, Math.min(1, v))
      let level = Math.floor(v * nLevels)
      if (level >= nLevels) level = nLevels - 1
      line += charset.charAt(level)
    }
    lines.push(line)
  }
  return lines
}
