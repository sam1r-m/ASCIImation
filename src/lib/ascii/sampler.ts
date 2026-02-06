// downsample image data and extract per-cell luma + rgb

const FONT_ASPECT = 0.55 // chars are taller than wide

export function computeRows(
  sourceWidth: number,
  sourceHeight: number,
  cols: number,
): number {
  return Math.max(1, Math.round((sourceHeight / sourceWidth) * cols * FONT_ASPECT))
}

// extract luma (bt.601) and color from already-downsampled imagedata
// expects imagedata where each pixel = one cell
export function extractCells(
  data: Uint8ClampedArray,
  count: number,
): { luma: Float32Array; colors: Uint8Array } {
  const luma = new Float32Array(count)
  const colors = new Uint8Array(count * 3)

  for (let i = 0; i < count; i++) {
    const pi = i * 4
    const r = data[pi]
    const g = data[pi + 1]
    const b = data[pi + 2]
    luma[i] = 0.299 * r + 0.587 * g + 0.114 * b
    colors[i * 3] = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b
  }

  return { luma, colors }
}
