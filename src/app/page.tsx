'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { AsciiBackground } from '@/components/landing/AsciiBackground'
import { HeroCard } from '@/components/landing/HeroCard'

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black">
      <div className="absolute inset-0 z-[1] vignette" />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        className="absolute inset-0 z-[2]"
      >
        <AsciiBackground />
      </motion.div>
      <div className="absolute inset-0 z-[3] noise-overlay" />
      <HeroCard />
    </main>
  )
}
