// video loading + playback

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { VideoMeta } from '@/lib/ascii/types'

export function useVideoDecoder() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [meta, setMeta] = useState<VideoMeta | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const urlRef = useRef<string | null>(null)

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
    }
  }, [])

  const loadFile = useCallback(async (file: File) => {
    setError(null)

    // cleanup previous
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    if (videoRef.current) videoRef.current.pause()

    try {
      const video = document.createElement('video')
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.crossOrigin = 'anonymous'

      const url = URL.createObjectURL(file)
      urlRef.current = url
      video.src = url

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve()
        video.onerror = () => reject(new Error('failed to load video — unsupported format?'))
        // timeout for really broken files
        setTimeout(() => reject(new Error('video load timed out')), 15000)
      })

      videoRef.current = video
      setMeta({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      })

      // track time updates
      video.ontimeupdate = () => setCurrentTime(video.currentTime)

      // autoplay
      await video.play()
      setIsPlaying(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error loading video')
    }
  }, [])

  const play = useCallback(() => {
    videoRef.current?.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlayback = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const resetVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.ontimeupdate = null
      videoRef.current.src = ''
      videoRef.current = null
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setMeta(null)
    setIsPlaying(false)
    setError(null)
    setCurrentTime(0)
  }, [])

  return {
    videoEl: videoRef.current,
    meta,
    isPlaying,
    error,
    currentTime,
    loadFile,
    play,
    pause,
    togglePlayback,
    seek,
    resetVideo,
  }
}
