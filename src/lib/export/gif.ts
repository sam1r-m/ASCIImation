// gif export using gifenc

import { GIFEncoder, quantize, applyPalette } from 'gifenc'
import type { AsciiFrame } from '@/lib/ascii/types'
import { renderFrame } from '@/lib/ascii/renderer'

export interface GifExportOptions {
  frames: AsciiFrame[]
  fps: number
  colorEnabled: boolean
  width?: number
  height?: number
  onProgress?: (pct: number) => void
}

export async function exportGif(opts: GifExportOptions): Promise<Blob> {
  const { frames, fps, colorEnabled, onProgress } = opts
  if (frames.length === 0) throw new Error('no frames to export')

  // figure out export dimensions from first frame
  const first = frames[0]
  const exportW = opts.width || Math.min(first.cols * 8, 1200)
  const exportH = opts.height || Math.min(first.rows * 8, 900)

  const canvas = document.createElement('canvas')
  canvas.width = exportW
  canvas.height = exportH
  const ctx = canvas.getContext('2d')!

  const gif = GIFEncoder()
  const delay = Math.round(1000 / fps)

  for (let i = 0; i < frames.length; i++) {
    renderFrame(ctx, frames[i], colorEnabled)
    const imageData = ctx.getImageData(0, 0, exportW, exportH)
    const palette = quantize(imageData.data, 256)
    const indexed = applyPalette(imageData.data, palette)
    gif.writeFrame(indexed, exportW, exportH, { palette, delay })

    onProgress?.(((i + 1) / frames.length) * 100)

    // yield to keep ui responsive
    if (i % 5 === 0) await new Promise(r => setTimeout(r, 0))
  }

  gif.finish()
  const bytes = gif.bytes()
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'image/gif' })
}
