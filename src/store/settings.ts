// editor settings store (zustand + localstorage)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CharsetId, DitherMode, EdgeMode, RenderStats } from '@/lib/ascii/types'

export interface EditorSettings {
  // geometry
  cols: number
  fpsCap: number
  zoom: number

  // style
  charsetId: CharsetId
  customCharset: string
  brightness: number
  contrast: number
  gamma: number
  invert: boolean
  blur: number

  // edges
  edgeMode: EdgeMode
  edgeStrength: number
  edgeThreshold: number
  edgeBlend: number

  // dither + color
  dither: DitherMode
  colorEnabled: boolean
  paletteMode: boolean
  paletteSize: number

  // export
  exportFps: number
  exportDuration: number // max seconds, 0 = full video

  // active preset
  activePreset: string | null
}

export interface EditorStore extends EditorSettings {
  // runtime state (not persisted)
  stats: RenderStats
  isExporting: boolean
  exportProgress: number

  set: <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void
  setMany: (partial: Partial<EditorSettings>) => void
  setStats: (stats: RenderStats) => void
  setExporting: (exporting: boolean, progress?: number) => void
  reset: () => void
}

const defaults: EditorSettings = {
  cols: 120,
  fpsCap: 24,
  zoom: 1,
  charsetId: 'standard',
  customCharset: '',
  brightness: 0,
  contrast: 0,
  gamma: 1.0,
  invert: false,
  blur: 0,
  edgeMode: 'off',
  edgeStrength: 50,
  edgeThreshold: 30,
  edgeBlend: 50,
  dither: 'none',
  colorEnabled: false,
  paletteMode: false,
  paletteSize: 8,
  exportFps: 15,
  exportDuration: 10,
  activePreset: null,
}

const defaultStats: RenderStats = {
  renderMs: 0,
  fps: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  gridCols: 0,
  gridRows: 0,
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...defaults,
      stats: defaultStats,
      isExporting: false,
      exportProgress: 0,

      set: (key, value) => set({ [key]: value, activePreset: null }),
      setMany: (partial) => set({ ...partial }),
      setStats: (stats) => set({ stats }),
      setExporting: (isExporting, exportProgress = 0) =>
        set({ isExporting, exportProgress }),
      reset: () => set({ ...defaults }),
    }),
    {
      name: 'ascii-mation-settings',
      // only persist the settings, not runtime state
      partialize: (state) => {
        const { stats, isExporting, exportProgress, ...settings } = state
        // strip functions too
        const result: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(settings)) {
          if (typeof val !== 'function') result[key] = val
        }
        return result
      },
    },
  ),
)
