'use client'

import { useEffect, useRef } from 'react'

const CHARSET = ' .:-=+*#'
const COLS = 80
const ROWS = 30
const TARGET_FPS = 16

// gradient: dark gray → darker ascii blues (stays in blue range, not too bright)
const BLUE_GRADIENT = [
  { r: 18, g: 18, b: 24 },        // 0    dark gray
  { r: 2, g: 56, b: 98 },         // 0.25 #023862
  { r: 2, g: 74, b: 130 },        // 0.5  #024a82
  { r: 3, g: 93, b: 163 },        // 0.75 #035da3
  { r: 22, g: 95, b: 158 },       // 1    slightly darker #1c6dac
]

function colorForNorm(norm: number, rowFade: number): string {
  const i = norm * (BLUE_GRADIENT.length - 1)
  const lo = Math.floor(Math.min(i, BLUE_GRADIENT.length - 2))
  const hi = lo + 1
  const t = Math.min(1, i - lo)
  const c = BLUE_GRADIENT[lo]
  const d = BLUE_GRADIENT[hi]
  const r = Math.round(c.r + (d.r - c.r) * t)
  const g = Math.round(c.g + (d.g - c.g) * t)
  const b = Math.round(c.b + (d.b - c.b) * t)
  const baseAlpha = 0.42 + norm * 0.42
  const a = baseAlpha * rowFade
  return `rgba(${r},${g},${b},${a})`
}

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const cellW = w / COLS
      const cellH = h / ROWS
      const fontSize = Math.min(cellW, cellH) * 0.92

      ctx.font = `600 ${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const t = frame * 0.055

      for (let y = 0; y < ROWS; y++) {
        const rowNorm = y / (ROWS - 1)
        const rowFade = 1 - rowNorm * 0.82
        for (let x = 0; x < COLS; x++) {
          const nx = x * 0.06
          const ny = y * 0.1

          const v1 = Math.sin(nx * 1.2 + t) * Math.cos(ny * 0.8 + t * 0.7)
          const v2 = Math.sin(nx * 0.5 - t * 0.3 + ny * 0.7) * 0.6
          const v3 = Math.cos((nx + ny) * 0.4 + t * 0.2) * 0.4

          const val = (v1 + v2 + v3) / 2
          const norm = Math.max(0, Math.min(1, (val + 1) / 2))
          const charIdx = Math.floor(norm * (CHARSET.length - 1))
          const ch = CHARSET[charIdx]

          if (ch !== ' ') {
            ctx.fillStyle = colorForNorm(norm, rowFade)
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.65,
        imageRendering: 'crisp-edges',
      }}
      aria-hidden="true"
    />
  )
}
