'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useVideoDecoder } from '@/hooks/useVideoDecoder'
import { useAsciiPipeline } from '@/hooks/useAsciiPipeline'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/settings'
import { canExportWebm, canExportMp4 } from '@/lib/export/video'
import { ControlPanel } from './ControlPanel'
import { PreviewCanvas } from './PreviewCanvas'
import { ConfirmModal } from './ConfirmModal'

export function EditorShell() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [showResetModal, setShowResetModal] = useState(false)
  const [sampleVideoError, setSampleVideoError] = useState<string | null>(null)
  // Resolve only on client to avoid hydration mismatch (MediaRecorder is undefined on server)
  const [exportCapabilities, setExportCapabilities] = useState({ canWebm: false, canMp4: false })
  useEffect(() => {
    setExportCapabilities({ canWebm: canExportWebm(), canMp4: canExportMp4() })
  }, [])

  const {
    videoEl, meta, isPlaying, error, currentTime,
    loadFile, togglePlayback, seek, resetVideo,
  } = useVideoDecoder()

  const { collectFrames } = useAsciiPipeline(videoEl, canvasRef)
  const { doExportGif, doExportWebm, doExportMp4, doExportHtml } = useExport(collectFrames)
  const storeReset = useEditorStore((s) => s.reset)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    // let the user re-select the same file
    e.target.value = ''
  }, [loadFile])

  const handleLoadSampleVideo = useCallback(async () => {
    setSampleVideoError(null)
    try {
      const res = await fetch('/mandelbrot_fractal_zoom.mp4')
      if (!res.ok) throw new Error('Couldn’t load sample video')
      const blob = await res.blob()
      const file = new File([blob], 'mandelbrot_fractal_zoom.mp4', { type: 'video/mp4' })
      await loadFile(file)
    } catch (err) {
      setSampleVideoError(err instanceof Error ? err.message : 'Couldn’t load sample video')
    }
  }, [loadFile])

  const handleRestart = useCallback(() => {
    resetVideo()
    storeReset()
    setShowResetModal(false)
    // wipe the canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [resetVideo, storeReset])

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex gap-4 h-screen p-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* top right controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
          {error && (
            <span className="text-xs text-red-400">{error}</span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-button-primary w-[7rem] py-2.5 rounded-full text-sm font-medium text-white transition-all duration-150 hover:-translate-y-px active:translate-y-px"
          >
            <span className="relative z-10">Load Video</span>
          </button>
          {meta && (
            <button
              onClick={() => setShowResetModal(true)}
              className="glass-button w-[7rem] py-2.5 rounded-full text-sm font-medium text-zinc-400 transition-all duration-150 hover:-translate-y-px active:translate-y-px"
            >
              Start Over
            </button>
          )}
        </div>

        <ControlPanel
          meta={meta}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTogglePlayback={togglePlayback}
          onSeek={seek}
          onExportGif={doExportGif}
          onExportWebm={doExportWebm}
          onExportMp4={doExportMp4}
          onExportHtml={doExportHtml}
          canWebm={exportCapabilities.canWebm}
          canMp4={exportCapabilities.canMp4}
        />
        <PreviewCanvas
          canvasRef={canvasRef}
          hasVideo={!!videoEl}
          onTrySampleVideo={handleLoadSampleVideo}
          sampleVideoError={sampleVideoError}
        />
      </motion.div>

      {/* reset modal */}
      <ConfirmModal
        open={showResetModal}
        title="Start Over?"
        description="This will clear the current video and settings."
        confirmLabel="Start Over"
        cancelLabel="Cancel"
        onConfirm={handleRestart}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  )
}
