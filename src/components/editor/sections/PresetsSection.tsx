'use client'

import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/settings'
import { PRESETS, randomPreset } from '@/lib/ascii/presets'
import { PillButton } from '@/components/ui/PillButton'

const PRESET_IDS = Object.keys(PRESETS) as (keyof typeof PRESETS)[]

export function PresetsSection() {
  const { activePreset, setMany } = useEditorStore()
  const [randomizeAnimating, setRandomizeAnimating] = useState(false)

  const applyPreset = (id: string) => {
    const preset = PRESETS[id as keyof typeof PRESETS]
    if (!preset) return
    const { label, ...config } = preset
    setMany({ ...config, activePreset: id })
  }

  const handleRandomize = useCallback(() => {
    const { label, ...config } = randomPreset()
    setMany({ ...config, activePreset: null })
    setRandomizeAnimating(true)
    setTimeout(() => setRandomizeAnimating(false), 500)
  }, [setMany])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {PRESET_IDS.map((id) => {
          const preset = PRESETS[id]
          return (
            <PillButton
              key={id}
              label={preset.label}
              active={activePreset === id}
              onClick={() => applyPreset(id)}
              className="preset-pill w-full min-h-[36px]"
            />
          )
        })}
        <button
          type="button"
          onClick={handleRandomize}
          className={`col-span-2 randomize-button w-full min-h-[36px] px-3 py-1.5 text-xs rounded-full font-medium bg-white/5 text-zinc-400 border border-white/6 hover:bg-white/10 hover:text-zinc-200 transition-all duration-150 ${
            randomizeAnimating ? 'randomize-button--animating' : ''
          }`}
          title="Randomize settings"
        >
          <span>Randomize</span>
        </button>
      </div>
    </div>
  )
}
