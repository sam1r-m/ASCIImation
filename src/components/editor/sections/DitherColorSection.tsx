'use client'

import { useEditorStore } from '@/store/settings'
import { Select } from '@/components/ui/Select'
import { Slider } from '@/components/ui/Slider'
import type { DitherMode } from '@/lib/ascii/types'

const DITHER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
  { value: 'bayer', label: 'Bayer (Ordered)' },
  { value: 'atkinson', label: 'Atkinson' },
]

const PALETTE_OPTIONS = [
  { value: '4', label: '4 colors' },
  { value: '8', label: '8 colors' },
  { value: '16', label: '16 colors' },
]

export function DitherColorSection() {
  const { dither, colorEnabled, paletteMode, paletteSize, set } = useEditorStore()

  return (
    <div className="space-y-3">
      <Select
        label="Dithering"
        value={dither}
        options={DITHER_OPTIONS}
        onChange={(v) => set('dither', v as DitherMode)}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Color Mode</span>
        <button
          onClick={() => set('colorEnabled', !colorEnabled)}
          className={`
            w-9 h-5 rounded-full transition-colors duration-200 relative
            ${colorEnabled ? 'bg-white/30' : 'bg-white/10'}
          `}
          role="switch"
          aria-checked={colorEnabled}
          aria-label="Color Mode"
        >
          <span className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200
            ${colorEnabled ? 'translate-x-4' : 'translate-x-0.5'}
          `} />
        </button>
      </div>

      {colorEnabled && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Palette Mode</span>
            <button
              onClick={() => set('paletteMode', !paletteMode)}
              className={`
                w-9 h-5 rounded-full transition-colors duration-200 relative
                ${paletteMode ? 'bg-white/30' : 'bg-white/10'}
              `}
              role="switch"
              aria-checked={paletteMode}
              aria-label="Palette Mode"
            >
              <span className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200
                ${paletteMode ? 'translate-x-4' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          {paletteMode && (
            <Select
              label="Palette Size"
              value={String(paletteSize)}
              options={PALETTE_OPTIONS}
              onChange={(v) => set('paletteSize', Number(v))}
            />
          )}
        </>
      )}
    </div>
  )
}
