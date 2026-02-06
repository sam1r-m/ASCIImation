// hooks up frame collection to the different export formats

'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/store/settings'
import { exportGif } from '@/lib/export/gif'
import { exportWebm, exportMp4, canExportWebm, canExportMp4 } from '@/lib/export/video'
import { exportHtml } from '@/lib/export/html'
import type { AsciiFrame } from '@/lib/ascii/types'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  downloadBlob(blob, filename)
}

export function useExport(
  collectFrames: (duration: number, fps: number) => Promise<AsciiFrame[]>,
) {
  const store = useEditorStore()

  const doExportGif = useCallback(async () => {
    if (store.isExporting) return
    store.setExporting(true, 0)

    try {
      const frames = await collectFrames(
        store.exportDuration || 999,
        store.exportFps,
      )
      if (frames.length === 0) throw new Error('no frames collected')

      const blob = await exportGif({
        frames,
        fps: store.exportFps,
        colorEnabled: store.colorEnabled,
        onProgress: (pct) => store.setExporting(true, 50 + pct * 0.5),
      })

      downloadBlob(blob, 'ascii-mation.gif')
    } catch (err) {
      console.error('gif export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  const doExportWebm = useCallback(async () => {
    if (store.isExporting) return
    if (!canExportWebm()) return
    store.setExporting(true, 0)

    try {
      const frames = await collectFrames(
        store.exportDuration || 999,
        store.exportFps,
      )
      if (frames.length === 0) throw new Error('no frames collected')

      const blob = await exportWebm({
        frames,
        fps: store.exportFps,
        colorEnabled: store.colorEnabled,
        onProgress: (pct) => store.setExporting(true, 50 + pct * 0.5),
      })

      downloadBlob(blob, 'ascii-mation.webm')
    } catch (err) {
      console.error('webm export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  const doExportMp4 = useCallback(async () => {
    if (store.isExporting) return
    if (!canExportMp4()) return
    store.setExporting(true, 0)

    try {
      const frames = await collectFrames(
        store.exportDuration || 999,
        store.exportFps,
      )
      if (frames.length === 0) throw new Error('no frames collected')

      const blob = await exportMp4({
        frames,
        fps: store.exportFps,
        colorEnabled: store.colorEnabled,
        onProgress: (pct) => store.setExporting(true, 50 + pct * 0.5),
      })

      downloadBlob(blob, 'ascii-mation.mp4')
    } catch (err) {
      console.error('mp4 export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  const doExportHtml = useCallback(async () => {
    if (store.isExporting) return
    store.setExporting(true, 0)

    try {
      const frames = await collectFrames(
        store.exportDuration || 999,
        store.exportFps,
      )
      if (frames.length === 0) throw new Error('no frames collected')

      store.setExporting(true, 80)

      const { framesJs, animationHtml } = exportHtml({
        frames,
        fps: store.exportFps,
      })

      // download both files with a small gap so the browser doesn't block the second one
      downloadText(framesJs, 'frames.js')
      await new Promise(r => setTimeout(r, 300))
      downloadText(animationHtml, 'animation.html')
    } catch (err) {
      console.error('html export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  return {
    doExportGif,
    doExportWebm,
    doExportMp4,
    doExportHtml,
    canWebm: canExportWebm,
    canMp4: canExportMp4,
  }
}
