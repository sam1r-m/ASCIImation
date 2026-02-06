'use client'

import type { VideoMeta } from '@/lib/ascii/types'

interface InputSectionProps {
  meta: VideoMeta
  isPlaying: boolean
  currentTime: number
  onTogglePlayback: () => void
  onSeek: (time: number) => void
}

export function InputSection({
  meta, isPlaying, currentTime, onTogglePlayback, onSeek,
}: InputSectionProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-500">
        <span>{meta.width}×{meta.height}</span>
        <span>{meta.duration.toFixed(1)}s</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlayback}
          className="glass-button px-3 py-1 text-xs rounded-full text-zinc-300 transition-all duration-150 active:scale-95"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <input
          type="range"
          min={0}
          max={meta.duration}
          step={0.05}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="flex-1"
          aria-label="Seek"
        />
        <span className="text-xs font-mono text-zinc-500 tabular-nums w-10 text-right">
          {currentTime.toFixed(1)}s
        </span>
      </div>
    </div>
  )
}
