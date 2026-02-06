'use client'

import { type ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`glass rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
