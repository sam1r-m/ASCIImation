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
  const isBidirectional = min < 0
  const valuePercent = ((value - min) / (max - min)) * 100
  const centerPercent = ((0 - min) / (max - min)) * 100
  const blueStart = Math.min(centerPercent, valuePercent)
  const blueEnd = Math.max(centerPercent, valuePercent)

  const style = isBidirectional
    ? { ['--blue-start' as string]: `${blueStart}%`, ['--blue-end' as string]: `${blueEnd}%` }
    : { ['--value-percent' as string]: `${valuePercent}%` }

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
        className={`w-full ${isBidirectional ? 'range-bidirectional' : 'range-unidirectional'}`}
        style={style}
        aria-label={label}
      />
    </div>
  )
}
