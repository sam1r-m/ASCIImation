'use client'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}

export function Slider({
  label, value, min, max, step = 1, onChange, suffix = '',
}: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-500 font-mono tabular-nums">
          {Number.isInteger(step) ? value : value.toFixed(1)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  )
}
