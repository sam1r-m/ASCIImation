// main pipeline: source -> AsciiFrame
// draws source to a work canvas at grid dimensions, then processes

import type { AsciiFrame, PipelineConfig } from './types'
import { computeRows, extractCells } from './sampler'
import { applyAdjustments } from './luma'
import { applyBlur } from './blur'
import { detectEdges, blendEdges } from './edges'
import { applyDitherAndMap } from './dither'
import { quantizeColors } from './palette'

// process a canvas image source (video element, image, etc.) into ascii
export function processSource(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  config: PipelineConfig,
  workCtx: CanvasRenderingContext2D,
): AsciiFrame {
  const { cols } = config
  const rows = computeRows(sourceWidth, sourceHeight, cols)

  // downscale via canvas — browser handles interpolation
  workCtx.canvas.width = cols
  workCtx.canvas.height = rows
  workCtx.drawImage(source, 0, 0, cols, rows)

  const imageData = workCtx.getImageData(0, 0, cols, rows)
  return processImageData(imageData, cols, rows, config)
}

// pure pipeline: already-downsampled imagedata -> ascii frame
export function processImageData(
  imageData: ImageData,
  cols: number,
  rows: number,
  config: PipelineConfig,
): AsciiFrame {
  const totalCells = cols * rows
  const { luma, colors } = extractCells(imageData.data, totalCells)

  // adjustments
  applyAdjustments(luma, config.brightness, config.contrast, config.gamma, config.invert)

  // blur
  if (config.blur > 0) {
    applyBlur(luma, cols, rows, config.blur)
  }

  // edge detection + blend
  if (config.edgeMode !== 'off') {
    const edges = detectEdges(luma, cols, rows, config.edgeMode, config.edgeStrength, config.edgeThreshold)
    blendEdges(luma, edges, config.edgeBlend)
  }

  // dither + character mapping
  const lines = applyDitherAndMap(luma, cols, rows, config.dither, config.charset)

  // palette quantization on colors if needed
  if (config.colorEnabled && config.paletteMode) {
    quantizeColors(colors, totalCells, config.paletteSize)
  }

  return { lines, colors, cols, rows }
}
