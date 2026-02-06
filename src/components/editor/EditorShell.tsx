'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useVideoDecoder } from '@/hooks/useVideoDecoder'
import { useAsciiPipeline } from '@/hooks/useAsciiPipeline'
import { useExport } from '@/hooks/useExport'
import { canExportWebm } from '@/lib/export/video'
import { ControlPanel } from './ControlPanel'
import { PreviewCanvas } from './PreviewCanvas'

export function EditorShell() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    videoEl, meta, isPlaying, error, currentTime,
    loadFile, togglePlayback, seek,
  } = useVideoDecoder()

  const { collectFrames } = useAsciiPipeline(videoEl, canvasRef)
  const { doExportGif, doExportWebm } = useExport(collectFrames)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 h-screen p-4"
    >
      <ControlPanel
        onFileSelect={loadFile}
        meta={meta}
        videoError={error}
        isPlaying={isPlaying}
        currentTime={currentTime}
        onTogglePlayback={togglePlayback}
        onSeek={seek}
        onExportGif={doExportGif}
        onExportWebm={doExportWebm}
        canWebm={canExportWebm()}
      />
      <PreviewCanvas canvasRef={canvasRef} hasVideo={!!videoEl} />
    </motion.div>
  )
}
