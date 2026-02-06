'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
          onClick={onCancel}
        >
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-modal p-8 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="relative z-10 text-lg font-semibold text-white mb-2">
              {title}
            </h2>
            <p className="relative z-10 text-sm text-zinc-400 mb-8">
              {description}
            </p>
            <div className="relative z-10 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="glass-button px-5 py-2 rounded-xl text-sm text-zinc-300 transition-all duration-150 hover:-translate-y-px active:translate-y-px"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="glass-button-primary px-5 py-2 rounded-xl text-sm font-medium text-white transition-all duration-150 hover:-translate-y-px active:translate-y-px"
              >
                <span className="relative z-10">{confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
