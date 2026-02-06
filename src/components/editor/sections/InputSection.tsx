'use client'

import type { VideoMeta } from '@/lib/ascii/types'

interface InputSectionProps {
  onFileSelect: (file: File) => void
  meta: VideoMeta | null
  error: string | null
  isPlaying: boolean
  currentTime: number
  onTogglePlayback: () => void
  onSeek: (time: number) => void
}

export function InputSection({
  onFileSelect, meta, error, isPlaying, currentTime, onTogglePlayback, onSeek,
}: InputSectionProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">upload video</span>
        <input
          type="file"
          accept="video/*"
          onChange={handleFile}
          className="block w-full text-xs text-zinc-400
            file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0
            file:text-xs file:font-medium file:bg-white/10 file:text-zinc-200
            file:cursor-pointer file:transition-colors file:hover:bg-white/15
            cursor-pointer"
        />
      </label>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {meta && (
        <>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-500">
            <span>{meta.width}×{meta.height}</span>
            <span>{meta.duration.toFixed(1)}s</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlayback}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/5 text-zinc-300 hover:bg-white/10 transition-all active:scale-95"
            >
              {isPlaying ? '⏸ pause' : '▶ play'}
            </button>
            <input
              type="range"
              min={0}
              max={meta.duration}
              step={0.05}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="flex-1"
              aria-label="seek"
            />
            <span className="text-xs font-mono text-zinc-500 tabular-nums w-10 text-right">
              {currentTime.toFixed(1)}s
            </span>
          </div>
        </>
      )}
    </div>
  )
}
