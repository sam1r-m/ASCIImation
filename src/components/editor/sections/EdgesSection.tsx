'use client'

import { useEditorStore } from '@/store/settings'
import { Select } from '@/components/ui/Select'
import { Slider } from '@/components/ui/Slider'
import type { EdgeMode } from '@/lib/ascii/types'

const EDGE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'sobel', label: 'Sobel' },
  { value: 'canny', label: 'Canny' },
  { value: 'laplacian', label: 'Laplacian' },
]

export function EdgesSection() {
  const { edgeMode, edgeStrength, edgeThreshold, edgeBlend, set } = useEditorStore()

  return (
    <div className="space-y-3">
      <Select
        label="Edge detection"
        value={edgeMode}
        options={EDGE_OPTIONS}
        onChange={(v) => set('edgeMode', v as EdgeMode)}
      />

      {edgeMode !== 'off' && (
        <>
          <Slider
            label="Strength"
            value={edgeStrength}
            min={0}
            max={100}
            onChange={(v) => set('edgeStrength', v)}
          />
          <Slider
            label="Threshold"
            value={edgeThreshold}
            min={0}
            max={255}
            onChange={(v) => set('edgeThreshold', v)}
          />
          <Slider
            label="Edge / luma blend"
            value={edgeBlend}
            min={0}
            max={100}
            onChange={(v) => set('edgeBlend', v)}
            suffix="%"
          />
        </>
      )}
    </div>
  )
}
