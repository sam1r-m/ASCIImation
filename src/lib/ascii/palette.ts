// median-cut color quantization for retro palette mode

interface ColorBox {
  colors: [number, number, number][]
}

// quantize the per-cell colors to a limited palette in-place
export function quantizeColors(
  colors: Uint8Array,
  cellCount: number,
  paletteSize: number,
): void {
  // collect unique-ish colors
  const allColors: [number, number, number][] = []
  for (let i = 0; i < cellCount; i++) {
    allColors.push([colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]])
  }

  // median cut to get palette
  const palette = medianCut(allColors, paletteSize)

  // snap each cell to nearest palette color
  for (let i = 0; i < cellCount; i++) {
    const r = colors[i * 3]
    const g = colors[i * 3 + 1]
    const b = colors[i * 3 + 2]
    const nearest = findNearest(r, g, b, palette)
    colors[i * 3] = nearest[0]
    colors[i * 3 + 1] = nearest[1]
    colors[i * 3 + 2] = nearest[2]
  }
}

function medianCut(
  colors: [number, number, number][],
  targetSize: number,
): [number, number, number][] {
  if (colors.length === 0) return [[0, 0, 0]]

  let boxes: ColorBox[] = [{ colors: [...colors] }]

  while (boxes.length < targetSize) {
    // find box with largest range
    let maxRange = -1
    let maxIdx = 0
    let splitChannel = 0

    for (let bi = 0; bi < boxes.length; bi++) {
      const box = boxes[bi]
      if (box.colors.length < 2) continue

      for (let ch = 0; ch < 3; ch++) {
        let lo = 255, hi = 0
        for (const c of box.colors) {
          if (c[ch] < lo) lo = c[ch]
          if (c[ch] > hi) hi = c[ch]
        }
        const range = hi - lo
        if (range > maxRange) {
          maxRange = range
          maxIdx = bi
          splitChannel = ch
        }
      }
    }

    if (maxRange <= 0) break

    // split the box at median
    const box = boxes[maxIdx]
    box.colors.sort((a, b) => a[splitChannel] - b[splitChannel])
    const mid = Math.floor(box.colors.length / 2)
    boxes.splice(maxIdx, 1, {
      colors: box.colors.slice(0, mid),
    }, {
      colors: box.colors.slice(mid),
    })
  }

  // average each box to get palette color
  return boxes.map(box => {
    let r = 0, g = 0, b = 0
    for (const c of box.colors) {
      r += c[0]; g += c[1]; b += c[2]
    }
    const n = box.colors.length || 1
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)] as [number, number, number]
  })
}

function findNearest(
  r: number, g: number, b: number,
  palette: [number, number, number][],
): [number, number, number] {
  let best = palette[0]
  let bestDist = Infinity
  for (const c of palette) {
    const dr = r - c[0], dg = g - c[1], db = b - c[2]
    const dist = dr * dr + dg * dg + db * db
    if (dist < bestDist) {
      bestDist = dist
      best = c
    }
  }
  return best
}
