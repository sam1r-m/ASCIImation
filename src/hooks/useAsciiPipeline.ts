// main render loop: video frame -> pipeline -> canvas

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { processSource } from '@/lib/ascii/pipeline'
import { renderFrame } from '@/lib/ascii/renderer'
import { getCharset } from '@/lib/ascii/charsets'
import { computeRows } from '@/lib/ascii/sampler'
import { useEditorStore } from '@/store/settings'
import type { AsciiFrame, PipelineConfig } from '@/lib/ascii/types'

export function useAsciiPipeline(
  videoEl: HTMLVideoElement | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const settingsRef = useRef(useEditorStore.getState())
  const framesRef = useRef<AsciiFrame[]>([]) // cached frames for export
  const workCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // keep settings ref in sync without restarting the loop
  useEffect(() => {
    return useEditorStore.subscribe((state) => {
      settingsRef.current = state
    })
  }, [])

  // main render loop
  useEffect(() => {
    if (!videoEl || !canvasRef.current) return

    // create offscreen work canvas for downsampling
    if (!workCanvasRef.current) {
      workCanvasRef.current = document.createElement('canvas')
    }
    const workCtx = workCanvasRef.current.getContext('2d', { willReadFrequently: true })
    if (!workCtx) return

    let running = true
    let lastFrameTime = 0
    let frameCount = 0
    let fpsTimer = performance.now()

    const loop = (timestamp: number) => {
      if (!running) return

      const s = settingsRef.current
      const frameDuration = 1000 / s.fpsCap

      if (timestamp - lastFrameTime >= frameDuration) {
        const canvas = canvasRef.current
        if (canvas && videoEl.readyState >= 2) {
          const start = performance.now()

          // build config from current settings
          const config: PipelineConfig = {
            cols: s.cols,
            brightness: s.brightness,
            contrast: s.contrast,
            gamma: s.gamma,
            invert: s.invert,
            blur: s.blur,
            charset: getCharset(s.charsetId, s.customCharset),
            dither: s.dither,
            edgeMode: s.edgeMode,
            edgeStrength: s.edgeStrength,
            edgeThreshold: s.edgeThreshold,
            edgeBlend: s.edgeBlend,
            colorEnabled: s.colorEnabled,
            paletteMode: s.paletteMode,
            paletteSize: s.paletteSize,
          }

          const frame = processSource(
            videoEl,
            videoEl.videoWidth,
            videoEl.videoHeight,
            config,
            workCtx,
          )

          // resize display canvas to match container
          const rect = canvas.getBoundingClientRect()
          const dpr = window.devicePixelRatio || 1
          canvas.width = Math.floor(rect.width * dpr)
          canvas.height = Math.floor(rect.height * dpr)

          const displayCtx = canvas.getContext('2d')
          if (displayCtx) {
            renderFrame(displayCtx, frame, s.colorEnabled)
          }

          const renderMs = performance.now() - start
          frameCount++

          // update fps every second
          const elapsed = performance.now() - fpsTimer
          if (elapsed >= 1000) {
            const rows = computeRows(videoEl.videoWidth, videoEl.videoHeight, s.cols)
            s.setStats({
              renderMs: Math.round(renderMs * 10) / 10,
              fps: Math.round((frameCount / elapsed) * 1000),
              sourceWidth: videoEl.videoWidth,
              sourceHeight: videoEl.videoHeight,
              gridCols: s.cols,
              gridRows: rows,
            })
            frameCount = 0
            fpsTimer = performance.now()
          }
        }
        lastFrameTime = timestamp
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
    return () => { running = false }
  }, [videoEl, canvasRef])

  // collect frames for export (processes the entire video by seeking)
  const collectFrames = useCallback(async (
    duration: number,
    fps: number,
  ): Promise<AsciiFrame[]> => {
    if (!videoEl || !workCanvasRef.current) return []
    const workCtx = workCanvasRef.current.getContext('2d', { willReadFrequently: true })
    if (!workCtx) return []

    const s = settingsRef.current
    const config: PipelineConfig = {
      cols: s.cols,
      brightness: s.brightness,
      contrast: s.contrast,
      gamma: s.gamma,
      invert: s.invert,
      blur: s.blur,
      charset: getCharset(s.charsetId, s.customCharset),
      dither: s.dither,
      edgeMode: s.edgeMode,
      edgeStrength: s.edgeStrength,
      edgeThreshold: s.edgeThreshold,
      edgeBlend: s.edgeBlend,
      colorEnabled: s.colorEnabled,
      paletteMode: s.paletteMode,
      paletteSize: s.paletteSize,
    }

    const wasPlaying = !videoEl.paused
    videoEl.pause()

    const maxTime = Math.min(duration, videoEl.duration)
    const frameDuration = 1 / fps
    const frames: AsciiFrame[] = []

    for (let t = 0; t < maxTime; t += frameDuration) {
      videoEl.currentTime = t
      await new Promise<void>(resolve => {
        videoEl.onseeked = () => resolve()
      })

      const frame = processSource(
        videoEl,
        videoEl.videoWidth,
        videoEl.videoHeight,
        config,
        workCtx,
      )
      frames.push(frame)

      // update export progress
      s.setExporting(true, (t / maxTime) * 50) // first 50% is frame collection

      // yield to ui
      if (frames.length % 3 === 0) await new Promise(r => setTimeout(r, 0))
    }

    if (wasPlaying) videoEl.play()
    framesRef.current = frames
    return frames
  }, [videoEl])

  return { collectFrames, framesRef }
}
