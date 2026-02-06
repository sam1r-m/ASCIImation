// webm + mp4 export via captureStream + MediaRecorder

import type { AsciiFrame } from '@/lib/ascii/types'
import { renderFrame } from '@/lib/ascii/renderer'

export interface VideoExportOptions {
  frames: AsciiFrame[]
  fps: number
  colorEnabled: boolean
  width?: number
  height?: number
  onProgress?: (pct: number) => void
}

// webm support check
export function canExportWebm(): boolean {
  if (typeof MediaRecorder === 'undefined') return false
  return MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ||
    MediaRecorder.isTypeSupported('video/webm; codecs=vp8') ||
    MediaRecorder.isTypeSupported('video/webm')
}

function getWebmMimeType(): string {
  if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9'))
    return 'video/webm; codecs=vp9'
  if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8'))
    return 'video/webm; codecs=vp8'
  return 'video/webm'
}

// mp4 support check
export function canExportMp4(): boolean {
  if (typeof MediaRecorder === 'undefined') return false
  return MediaRecorder.isTypeSupported('video/mp4; codecs=avc1') ||
    MediaRecorder.isTypeSupported('video/mp4')
}

function getMp4MimeType(): string {
  if (MediaRecorder.isTypeSupported('video/mp4; codecs=avc1'))
    return 'video/mp4; codecs=avc1'
  return 'video/mp4'
}

// shared recording logic for both webm and mp4
async function recordFrames(
  opts: VideoExportOptions,
  mimeType: string,
  blobType: string,
): Promise<Blob> {
  const { frames, fps, colorEnabled, onProgress } = opts
  if (frames.length === 0) throw new Error('no frames to export')

  const first = frames[0]
  const exportW = opts.width || Math.min(first.cols * 8, 1920)
  const exportH = opts.height || Math.min(first.rows * 8, 1080)

  const canvas = document.createElement('canvas')
  canvas.width = exportW
  canvas.height = exportH
  const ctx = canvas.getContext('2d')!

  const stream = canvas.captureStream(0)
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  })

  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: blobType }))
    recorder.onerror = () => reject(new Error('recording failed'))
  })

  recorder.start()
  const frameDuration = 1000 / fps

  for (let i = 0; i < frames.length; i++) {
    renderFrame(ctx, frames[i], colorEnabled)

    // push frame to stream
    const track = stream.getVideoTracks()[0]
    if (track && 'requestFrame' in track) {
      ;(track as unknown as { requestFrame(): void }).requestFrame()
    }

    onProgress?.(((i + 1) / frames.length) * 100)
    await new Promise(r => setTimeout(r, frameDuration))
  }

  recorder.stop()
  return done
}

export async function exportWebm(opts: VideoExportOptions): Promise<Blob> {
  return recordFrames(opts, getWebmMimeType(), 'video/webm')
}

export async function exportMp4(opts: VideoExportOptions): Promise<Blob> {
  return recordFrames(opts, getMp4MimeType(), 'video/mp4')
}
