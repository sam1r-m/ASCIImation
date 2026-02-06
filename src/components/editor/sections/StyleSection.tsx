'use client'

import { useEditorStore } from '@/store/settings'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import type { CharsetId } from '@/lib/ascii/types'

const CHARSET_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'binary', label: 'Binary' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'dense', label: 'Dense' },
  { value: 'custom', label: 'Custom...' },
]

export function StyleSection() {
  const {
    charsetId, customCharset, brightness, contrast, gamma, invert, blur, set,
  } = useEditorStore()

  return (
    <div className="space-y-3">
      <Select
        label="Charset"
        value={charsetId}
        options={CHARSET_OPTIONS}
        onChange={(v) => set('charsetId', v as CharsetId)}
      />

      {charsetId === 'custom' && (
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Custom Chars (dark → light)</label>
          <input
            type="text"
            value={customCharset}
            onChange={(e) => set('customCharset', e.target.value)}
            placeholder="@%#*+=-:. "
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-200 font-mono outline-none focus:border-white/20 transition-colors"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Invert</span>
        <button
          onClick={() => set('invert', !invert)}
          className={`
            w-9 h-5 rounded-full transition-colors duration-200 relative
            ${invert ? 'bg-white/30' : 'bg-white/10'}
          `}
          role="switch"
          aria-checked={invert}
          aria-label="Invert"
        >
          <span className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200
            ${invert ? 'translate-x-4' : 'translate-x-0.5'}
          `} />
        </button>
      </div>

      <Slider
        label="Brightness"
        value={brightness}
        min={-100}
        max={100}
        onChange={(v) => set('brightness', v)}
      />
      <Slider
        label="Contrast"
        value={contrast}
        min={-100}
        max={100}
        onChange={(v) => set('contrast', v)}
      />
      <Slider
        label="Gamma"
        value={gamma}
        min={0.1}
        max={3}
        step={0.1}
        onChange={(v) => set('gamma', v)}
      />
      <Slider
        label="Blur"
        value={blur}
        min={0}
        max={10}
        onChange={(v) => set('blur', v)}
      />
    </div>
  )
}
