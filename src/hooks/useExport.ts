// export hook: ties together frame collection + gif/webm encoding

'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/store/settings'
import { exportGif } from '@/lib/export/gif'
import { exportWebm, canExportWebm } from '@/lib/export/video'
import type { AsciiFrame } from '@/lib/ascii/types'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
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

      downloadBlob(blob, 'ascii-mator.gif')
    } catch (err) {
      console.error('gif export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  const doExportWebm = useCallback(async () => {
    if (store.isExporting) return
    if (!canExportWebm()) {
      console.error('webm export not supported in this browser')
      return
    }
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

      downloadBlob(blob, 'ascii-mator.webm')
    } catch (err) {
      console.error('webm export failed:', err)
    } finally {
      store.setExporting(false)
    }
  }, [collectFrames, store])

  return { doExportGif, doExportWebm, canWebm: canExportWebm }
}
