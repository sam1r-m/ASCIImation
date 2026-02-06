'use client'

import { useEditorStore } from '@/store/settings'

export function StatsHud() {
  const stats = useEditorStore((s) => s.stats)

  if (!stats.sourceWidth) return null

  return (
    <div className="absolute bottom-3 right-3 text-xs font-mono text-zinc-500/60 space-y-0.5 text-right select-none pointer-events-none">
      <div>{stats.sourceWidth}×{stats.sourceHeight} → {stats.gridCols}×{stats.gridRows}</div>
      <div>{stats.fps} fps · {stats.renderMs}ms</div>
    </div>
  )
}
