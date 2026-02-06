'use client'

import { useEditorStore } from '@/store/settings'

export function StatsHud() {
  const stats = useEditorStore((s) => s.stats)

  if (!stats.sourceWidth) return null

  return (
    <div className="absolute bottom-3 right-3">
      <div className="glass-badge rounded-xl px-3 py-2 text-xs font-mono text-zinc-500/80 space-y-0.5 text-right select-none">
        <div>{stats.sourceWidth}×{stats.sourceHeight} → {stats.gridCols}×{stats.gridRows}</div>
        <div>{stats.fps} fps · {stats.renderMs}ms</div>
      </div>
    </div>
  )
}
