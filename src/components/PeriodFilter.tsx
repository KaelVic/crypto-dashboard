'use client'

const PERIODS = [
  { label: '24h', value: '1' },
  { label: '7d', value: '7' },
  { label: '30d', value: '30' },
  { label: '90d', value: '90' },
  { label: '1A', value: '365' },
]

interface Props {
  selected: string
  onSelect: (days: string) => void
}

export default function PeriodFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={[
            'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            value === selected
              ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
              : 'border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
