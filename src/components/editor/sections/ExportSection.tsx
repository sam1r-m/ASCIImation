'use client'

import { useEditorStore } from '@/store/settings'
import { Slider } from '@/components/ui/Slider'

interface ExportSectionProps {
  onExportGif: () => void
  onExportWebm: () => void
  canWebm: boolean
}

export function ExportSection({ onExportGif, onExportWebm, canWebm }: ExportSectionProps) {
  const { exportFps, exportDuration, isExporting, exportProgress, set } = useEditorStore()

  return (
    <div className="space-y-3">
      <Slider
        label="export fps"
        value={exportFps}
        min={5}
        max={30}
        onChange={(v) => set('exportFps', v)}
      />
      <Slider
        label="max duration"
        value={exportDuration}
        min={1}
        max={30}
        suffix="s"
        onChange={(v) => set('exportDuration', v)}
      />

      <div className="flex gap-2">
        <button
          onClick={onExportGif}
          disabled={isExporting}
          className="flex-1 px-4 py-2 text-xs font-medium rounded-xl bg-white/10 border border-white/10 text-zinc-200 hover:bg-white/15 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          export GIF
        </button>
        <button
          onClick={onExportWebm}
          disabled={isExporting || !canWebm}
          className="flex-1 px-4 py-2 text-xs font-medium rounded-xl bg-white/10 border border-white/10 text-zinc-200 hover:bg-white/15 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title={canWebm ? '' : 'WebM recording not supported in this browser'}
        >
          export WebM
        </button>
      </div>

      {isExporting && (
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/30 rounded-full transition-all duration-200"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 text-center">
            {Math.round(exportProgress)}%
          </p>
        </div>
      )}

      {!canWebm && (
        <p className="text-xs text-zinc-600">
          WebM not available — your browser doesn&apos;t support MediaRecorder with WebM.
          MP4 export isn&apos;t possible client-side without ffmpeg.
        </p>
      )}
    </div>
  )
}
