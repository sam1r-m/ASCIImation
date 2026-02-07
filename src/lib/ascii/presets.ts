// preset configurations for quick setup

import type { CharsetId, DitherMode, EdgeMode } from './types'

export interface PresetConfig {
  label: string
  cols: number
  brightness: number
  contrast: number
  gamma: number
  invert: boolean
  blur: number
  charsetId: CharsetId
  customCharset: string
  dither: DitherMode
  edgeMode: EdgeMode
  edgeStrength: number
  edgeThreshold: number
  edgeBlend: number
  colorEnabled: boolean
  paletteMode: boolean
  paletteSize: number
}

export const PRESETS: Record<string, PresetConfig> = {
  brutalMono: {
    label: 'Brutal Mono',
    cols: 120,
    brightness: 0,
    contrast: 30,
    gamma: 1.0,
    invert: false,
    blur: 0,
    charsetId: 'standard',
    customCharset: '',
    dither: 'none',
    edgeMode: 'off',
    edgeStrength: 50,
    edgeThreshold: 30,
    edgeBlend: 50,
    colorEnabled: false,
    paletteMode: false,
    paletteSize: 8,
  },
  retroColor: {
    label: 'Retro Color',
    cols: 100,
    brightness: 0,
    contrast: 10,
    gamma: 1.0,
    invert: false,
    blur: 0,
    charsetId: 'blocks',
    customCharset: '',
    dither: 'bayer',
    edgeMode: 'off',
    edgeStrength: 50,
    edgeThreshold: 30,
    edgeBlend: 50,
    colorEnabled: true,
    paletteMode: true,
    paletteSize: 8,
  },
  highContrast: {
    label: 'High Contrast',
    cols: 120,
    brightness: 10,
    contrast: 60,
    gamma: 0.8,
    invert: false,
    blur: 0,
    charsetId: 'detailed',
    customCharset: '',
    dither: 'floyd-steinberg',
    edgeMode: 'off',
    edgeStrength: 50,
    edgeThreshold: 30,
    edgeBlend: 50,
    colorEnabled: false,
    paletteMode: false,
    paletteSize: 8,
  },
  denseCharset: {
    label: 'Dense',
    cols: 180,
    brightness: 0,
    contrast: 20,
    gamma: 1.0,
    invert: false,
    blur: 0,
    charsetId: 'detailed',
    customCharset: '',
    dither: 'none',
    edgeMode: 'off',
    edgeStrength: 50,
    edgeThreshold: 30,
    edgeBlend: 50,
    colorEnabled: false,
    paletteMode: false,
    paletteSize: 8,
  },
  softDither: {
    label: 'Soft Dither',
    cols: 100,
    brightness: 5,
    contrast: -10,
    gamma: 1.2,
    invert: false,
    blur: 1,
    charsetId: 'standard',
    customCharset: '',
    dither: 'atkinson',
    edgeMode: 'off',
    edgeStrength: 50,
    edgeThreshold: 30,
    edgeBlend: 50,
    colorEnabled: false,
    paletteMode: false,
    paletteSize: 8,
  },
  edgeGlow: {
    label: 'Edge Glow',
    cols: 120,
    brightness: 0,
    contrast: 20,
    gamma: 1.0,
    invert: true,
    blur: 0,
    charsetId: 'standard',
    customCharset: '',
    dither: 'none',
    edgeMode: 'sobel',
    edgeStrength: 80,
    edgeThreshold: 20,
    edgeBlend: 70,
    colorEnabled: false,
    paletteMode: false,
    paletteSize: 8,
  },
}

// bounded random preset for the "Randomize" button
export function randomPreset(): PresetConfig {
  const charsets: CharsetId[] = ['detailed', 'standard', 'blocks', 'minimal', 'dense']
  const dithers: DitherMode[] = ['none', 'floyd-steinberg', 'bayer', 'atkinson']

  return {
    label: 'Random',
    cols: 80 + Math.floor(Math.random() * 100),
    brightness: Math.floor(Math.random() * 30 - 15),
    contrast: Math.floor(Math.random() * 50 - 10),
    gamma: 0.7 + Math.random() * 0.8,
    invert: Math.random() > 0.75,
    blur: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
    charsetId: charsets[Math.floor(Math.random() * charsets.length)],
    customCharset: '',
    dither: dithers[Math.floor(Math.random() * dithers.length)],
    edgeMode: Math.random() > 0.7 ? 'sobel' : 'off',
    edgeStrength: 30 + Math.floor(Math.random() * 50),
    edgeThreshold: 10 + Math.floor(Math.random() * 40),
    edgeBlend: 30 + Math.floor(Math.random() * 50),
    colorEnabled: Math.random() > 0.5,
    paletteMode: Math.random() > 0.6,
    paletteSize: [4, 8, 16][Math.floor(Math.random() * 3)],
  }
}
