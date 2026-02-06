'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export function HeroCard() {
  const router = useRouter()
  const [exiting, setExiting] = useState(false)

  const handleOpen = () => {
    setExiting(true)
    setTimeout(() => router.push('/editor'), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={
        exiting
          ? { opacity: 0, scale: 0.92, y: -20 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{ duration: exiting ? 0.35 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-12 md:p-16 max-w-lg w-full text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
        ascii-mator
      </h1>
      <p className="text-zinc-400 text-lg mb-10">
        turn video into ascii motion.
      </p>
      <button
        onClick={handleOpen}
        disabled={exiting}
        className="
          px-8 py-3 rounded-full bg-white text-neutral-950 font-semibold text-sm
          hover:bg-zinc-200 active:scale-95 transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        open editor
      </button>
      <div className="mt-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          github
        </a>
      </div>
    </motion.div>
  )
}
