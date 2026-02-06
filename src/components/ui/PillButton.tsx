'use client'

interface PillButtonProps {
  label: string
  active?: boolean
  onClick: () => void
  className?: string
}

export function PillButton({ label, active = false, onClick, className = '' }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 text-xs rounded-full transition-all duration-150 font-medium
        ${active
          ? 'bg-white/12 text-white border border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
          : 'bg-white/5 text-zinc-400 border border-white/6 hover:bg-white/10 hover:text-zinc-200'
        }
        active:scale-95
        ${className}
      `}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
