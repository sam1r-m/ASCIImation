'use client'

import { useEffect, useRef } from 'react'

const CHARSET = ' .:-=+*#'
const COLS = 80
const ROWS = 30
const TARGET_FPS = 10

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let lastTime = 0
    let frame = 0
    const interval = 1000 / TARGET_FPS

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (time: number) => {
      if (time - lastTime < interval) {
        animId = requestAnimationFrame(draw)
        return
      }
      lastTime = time
      frame++

      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const cellW = width / COLS
      const cellH = height / ROWS
      const fontSize = Math.min(cellW, cellH) * 0.8

      ctx.font = `${fontSize}px monospace`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const t = frame * 0.015

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const nx = x * 0.06
          const ny = y * 0.1

          // layered sine waves → organic movement
          const v1 = Math.sin(nx * 1.2 + t) * Math.cos(ny * 0.8 + t * 0.7)
          const v2 = Math.sin(nx * 0.5 - t * 0.3 + ny * 0.7) * 0.6
          const v3 = Math.cos((nx + ny) * 0.4 + t * 0.2) * 0.4

          const val = (v1 + v2 + v3) / 2
          const norm = Math.max(0, Math.min(1, (val + 1) / 2))
          const charIdx = Math.floor(norm * (CHARSET.length - 1))
          const ch = CHARSET[charIdx]

          if (ch !== ' ') {
            ctx.fillText(ch, x * cellW + cellW / 2, y * cellH + cellH / 2)
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.12,
        filter: 'blur(0.7px)',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  )
}
