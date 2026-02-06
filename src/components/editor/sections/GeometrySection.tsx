'use client'

import { useEditorStore } from '@/store/settings'
import { Slider } from '@/components/ui/Slider'

export function GeometrySection() {
  const { cols, fpsCap, zoom, set } = useEditorStore()

  return (
    <div className="space-y-3">
      <Slider
        label="Columns"
        value={cols}
        min={40}
        max={250}
        onChange={(v) => set('cols', v)}
      />
      <Slider
        label="FPS cap"
        value={fpsCap}
        min={1}
        max={60}
        onChange={(v) => set('fpsCap', v)}
      />
      <Slider
        label="Zoom"
        value={zoom}
        min={0.5}
        max={2}
        step={0.1}
        onChange={(v) => set('zoom', v)}
        suffix="×"
      />
    </div>
  )
}
