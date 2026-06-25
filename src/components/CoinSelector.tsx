'use client'

import type { CoinMarket } from '@/types/coin'

interface Props {
  coins: CoinMarket[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function CoinSelector({ coins, selectedId, onSelect }: Props) {
  return (
    <select
      value={selectedId}
      onChange={(e) => onSelect(e.target.value)}
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {coins.map((coin) => (
        <option key={coin.id} value={coin.id}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </option>
      ))}
    </select>
  )
}
