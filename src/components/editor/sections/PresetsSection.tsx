'use client'

import { useEditorStore } from '@/store/settings'
import { PRESETS, randomPreset } from '@/lib/ascii/presets'
import { PillButton } from '@/components/ui/PillButton'

export function PresetsSection() {
  const { activePreset, setMany } = useEditorStore()

  const applyPreset = (id: string) => {
    const preset = PRESETS[id]
    if (!preset) return
    const { label, ...config } = preset
    setMany({ ...config, activePreset: id })
  }

  const handleRandomize = () => {
    const { label, ...config } = randomPreset()
    setMany({ ...config, activePreset: 'random' })
  }

  const handleReset = () => {
    if (activePreset && PRESETS[activePreset]) {
      applyPreset(activePreset)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(PRESETS).map(([id, preset]) => (
          <PillButton
            key={id}
            label={preset.label}
            active={activePreset === id}
            onClick={() => applyPreset(id)}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-all active:scale-95"
          title="randomize settings"
        >
          🎲 random
        </button>
        {activePreset && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-all active:scale-95"
          >
            reset
          </button>
        )}
      </div>
    </div>
  )
}
