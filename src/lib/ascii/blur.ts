// simple box blur on a luma grid. fast enough for real-time preview.

export function applyBlur(
  luma: Float32Array,
  cols: number,
  rows: number,
  radius: number,
): void {
  if (radius < 1) return
  const r = Math.round(radius)

  // two-pass box blur (horizontal then vertical) for speed
  const tmp = new Float32Array(luma.length)

  // horizontal pass
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0
      let count = 0
      for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx
        if (nx >= 0 && nx < cols) {
          sum += luma[y * cols + nx]
          count++
        }
      }
      tmp[y * cols + x] = sum / count
    }
  }

  // vertical pass
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let sum = 0
      let count = 0
      for (let dy = -r; dy <= r; dy++) {
        const ny = y + dy
        if (ny >= 0 && ny < rows) {
          sum += tmp[ny * cols + x]
          count++
        }
      }
      luma[y * cols + x] = sum / count
    }
  }
}
