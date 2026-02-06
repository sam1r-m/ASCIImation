// core types for the ascii pipeline

export interface AsciiFrame {
  lines: string[]       // one string per row of characters
  colors: Uint8Array    // flat rgb: [r,g,b, r,g,b, ...] length = cols*rows*3
  cols: number
  rows: number
}

export type DitherMode = 'none' | 'floyd-steinberg' | 'bayer' | 'atkinson'
export type EdgeMode = 'off' | 'sobel' | 'canny' | 'laplacian'
export type CharsetId = 'detailed' | 'standard' | 'blocks' | 'binary' | 'minimal' | 'dense' | 'custom'

export interface PipelineConfig {
  cols: number
  brightness: number     // -100..100
  contrast: number       // -100..100
  gamma: number          // 0.1..3.0
  invert: boolean
  blur: number           // 0..10
  charset: string        // the actual character gradient string
  dither: DitherMode
  edgeMode: EdgeMode
  edgeStrength: number   // 0..100
  edgeThreshold: number  // 0..255
  edgeBlend: number      // 0..100 (% of edge vs luma)
  colorEnabled: boolean
  paletteMode: boolean
  paletteSize: number    // 4, 8, 16
}

export interface VideoMeta {
  width: number
  height: number
  duration: number
}

export interface RenderStats {
  renderMs: number
  fps: number
  sourceWidth: number
  sourceHeight: number
  gridCols: number
  gridRows: number
}
