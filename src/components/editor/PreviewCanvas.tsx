'use client'

import { useRef, useEffect } from 'react'
import { useEditorStore } from '@/store/settings'
import { StatsHud } from './StatsHud'

interface PreviewCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hasVideo: boolean
}

export function PreviewCanvas({ canvasRef, hasVideo }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.set)

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
          <p className="text-zinc-600 text-sm">Load a video to get started (top right ↗)</p>
        </div>
      )}
      <StatsHud />
      {/* vertical zoom bar — right side, vertically centered */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 w-6">
        <span className="text-[10px] font-mono text-zinc-500/60 select-none pointer-events-none">×</span>
        <div className="glass-badge-interactive rounded-lg h-[132px] flex items-center justify-center py-4">
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom('zoom', Number(e.target.value))}
            className="vertical-range range-unidirectional"
            style={{ ['--value-percent' as string]: `${((zoom - 0.5) / 1.5) * 100}%` }}
            aria-label="Zoom"
          />
        </div>
        <span className="text-[10px] font-mono text-zinc-500/60 tabular-nums select-none">
          {zoom.toFixed(1)}×
        </span>
      </div>
      {/* debug watermark */}
      <span
        className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-700/40 select-none pointer-events-none origin-bottom-left"
        style={{ transform: 'rotate(-90deg)' }}
      >
        © 2026 samir · ascii-mation
      </span>
    </div>
  )
}
