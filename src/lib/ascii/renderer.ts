// render an AsciiFrame to a canvas using fillText

import type { AsciiFrame } from './types'

const CHAR_WIDTH_RATIO = 0.6 // monospace char width ≈ 0.6 * fontSize
const BG_COLOR = '#0a0a0f'
const FG_COLOR = '#d4d4d8'

// cached font metrics
let cachedFontSize = 0
let cachedCharWidth = 0

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  frame: AsciiFrame,
  colorEnabled: boolean,
): void {
  const { width, height } = ctx.canvas
  const { lines, colors, cols, rows } = frame
  if (cols === 0 || rows === 0) return

  // find font size that fits the grid in the canvas
  const fontSize = Math.max(1, Math.floor(
    Math.min(width / (cols * CHAR_WIDTH_RATIO), height / rows)
  ))

  ctx.font = `${fontSize}px "Geist Mono", "Courier New", monospace`
  ctx.textBaseline = 'top'

  // measure actual char width (cache it)
  if (fontSize !== cachedFontSize) {
    cachedCharWidth = ctx.measureText('M').width
    cachedFontSize = fontSize
  }
  const charW = cachedCharWidth
  const lineH = fontSize

  // center grid in canvas
  const gridW = cols * charW
  const gridH = rows * lineH
  const ox = Math.floor((width - gridW) / 2)
  const oy = Math.floor((height - gridH) / 2)

  // clear
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, width, height)

  if (colorEnabled) {
    // per-cell color rendering
    for (let y = 0; y < rows; y++) {
      const line = lines[y]
      for (let x = 0; x < cols; x++) {
        const ci = (y * cols + x) * 3
        ctx.fillStyle = `rgb(${colors[ci]},${colors[ci + 1]},${colors[ci + 2]})`
        ctx.fillText(line[x], ox + x * charW, oy + y * lineH)
      }
    }
  } else {
    // monochrome — one fillText per line (much faster)
    ctx.fillStyle = FG_COLOR
    for (let y = 0; y < rows; y++) {
      ctx.fillText(lines[y], ox, oy + y * lineH)
    }
  }
}

// render for export at a specific resolution
export function renderFrameToCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  frame: AsciiFrame,
  colorEnabled: boolean,
  exportWidth: number,
  exportHeight: number,
): void {
  canvas.width = exportWidth
  canvas.height = exportHeight
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  if (!ctx) return
  renderFrame(ctx, frame, colorEnabled)
}
