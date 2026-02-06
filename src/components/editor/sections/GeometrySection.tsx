'use client'

import { useEditorStore } from '@/store/settings'
import { Slider } from '@/components/ui/Slider'

export function GeometrySection() {
  const { cols, fpsCap, set } = useEditorStore()

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
        label="FPS Cap"
        value={fpsCap}
        min={1}
        max={60}
        onChange={(v) => set('fpsCap', v)}
      />
    </div>
  )
}
