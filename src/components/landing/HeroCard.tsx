'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

// box-drawing ascii art for the hero
const ASCII_TITLE = [
  '╔═╗ ╔═╗ ╔═╗  ╦   ╦      ╔╦╗ ╔═╗ ╔╦╗  ╦  ╔═╗ ╔╗╔',
  '╠═╣ ╚═╗ ║    ║   ║   ─  ║║║ ╠═╣  ║   ║  ║ ║ ║║║',
  '╩ ╩ ╚═╝ ╚═╝  ╩   ╩      ╩ ╩ ╩ ╩  ╩   ╩  ╚═╝ ╝╚╝',
].join('\n')

export function HeroCard() {
  const router = useRouter()
  const [exiting, setExiting] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleOpen = () => {
    setExiting(true)
    setTimeout(() => router.push('/editor'), shouldReduceMotion ? 0 : 450)
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={
        exiting
          ? { opacity: 0, scale: 0.96, y: -10 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : exiting ? 0.4 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 flex flex-col items-center text-center px-6"
    >
      {/* ascii art */}
      <motion.pre
        animate={shouldReduceMotion ? {} : { opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="font-mono text-[9px] sm:text-[11px] md:text-sm leading-tight text-white select-none mb-8"
        style={{ opacity: 0.3 }}
      >
        {ASCII_TITLE}
      </motion.pre>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
        ascii-mation
      </h1>

      <p className="text-zinc-400 text-base md:text-lg tracking-[0.08em] mb-12">
        real-time video → ascii
      </p>

      {/* cta */}
      <motion.button
        onClick={handleOpen}
        disabled={exiting}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98, y: 1 }}
        className="
          glass-button-primary px-10 py-3.5 rounded-full font-medium text-sm text-white
          transition-shadow duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <span className="relative z-10">open editor</span>
      </motion.button>

      <div className="mt-10">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-[0.15em] uppercase"
        >
          github
        </a>
      </div>
    </motion.div>
  )
}
