'use client'

import { useEditorStore } from '@/store/settings'
import { Slider } from '@/components/ui/Slider'

interface ExportSectionProps {
  onExportGif: () => void
  onExportWebm: () => void
  onExportMp4: () => void
  onExportHtml: () => void
  canWebm: boolean
  canMp4: boolean
}

export function ExportSection({
  onExportGif, onExportWebm, onExportMp4, onExportHtml, canWebm, canMp4,
}: ExportSectionProps) {
  const { exportFps, exportDuration, isExporting, exportProgress, set } = useEditorStore()

  return (
    <div className="space-y-3">
      <Slider
        label="Export FPS"
        value={exportFps}
        min={5}
        max={30}
        onChange={(v) => set('exportFps', v)}
      />
      <Slider
        label="Max Duration"
        value={exportDuration}
        min={1}
        max={30}
        suffix="s"
        onChange={(v) => set('exportDuration', v)}
      />

      {/* video formats — each uses its format's brand color when you hover over it */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onExportGif}
          disabled={isExporting}
          className="glass-button export-gif px-3 py-2 text-xs font-medium rounded-xl text-zinc-200 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          GIF
        </button>
        <button
          onClick={onExportWebm}
          disabled={isExporting || !canWebm}
          className="glass-button export-webm px-3 py-2 text-xs font-medium rounded-xl text-zinc-200 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title={canWebm ? '' : 'Not supported in this browser'}
        >
          WebM
        </button>
        <button
          onClick={onExportMp4}
          disabled={isExporting || !canMp4}
          className="glass-button export-mp4 px-3 py-2 text-xs font-medium rounded-xl text-zinc-200 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title={canMp4 ? '' : 'Not supported in this browser'}
        >
          MP4
        </button>
        <button
          onClick={onExportHtml}
          disabled={isExporting}
          className="glass-button export-html px-3 py-2 text-xs font-medium rounded-xl text-zinc-200 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Downloads frames.js + animation.html"
        >
          HTML+JS
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

      {(!canWebm || !canMp4) && (
        <p className="text-xs text-zinc-600">
          Some formats need MediaRecorder support -- Greyed out ones aren&apos;t available in your browser. Sorry!
        </p>
      )}
    </div>
  )
}
