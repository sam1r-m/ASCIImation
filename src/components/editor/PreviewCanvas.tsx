'use client'

import { useRef, useEffect } from 'react'
import { StatsHud } from './StatsHud'

interface PreviewCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hasVideo: boolean
}

export function PreviewCanvas({ canvasRef, hasVideo }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // keep canvas sized to container
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [canvasRef])

  return (
    <div ref={containerRef} className="relative flex-1 min-h-0 bg-[#0a0a0f] rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-zinc-600 text-sm">load a video to get started</p>
        </div>
      )}
      <StatsHud />
      {/* debug watermark */}
      <span className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-700/40 select-none pointer-events-none">
        powered by canvas + ascii
      </span>
    </div>
  )
}
