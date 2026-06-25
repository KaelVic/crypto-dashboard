'use client'

import type { CoinMarket } from '@/types/coin'
import { formatPrice, formatPercentage, formatMarketCap } from '@/lib/formatters'

interface Props {
  coins: CoinMarket[]
  onSelectCoin: (id: string) => void
  selectedCoinId: string
}

export default function CoinTable({ coins, onSelectCoin, selectedCoinId }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-white">Top 10 Criptomoedas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-800 text-left text-xs text-gray-400">
              <th className="px-4 py-3 font-medium sm:px-6">#</th>
              <th className="px-4 py-3 font-medium sm:px-6">Moeda</th>
              <th className="px-4 py-3 font-medium sm:px-6">Preço</th>
              <th className="px-4 py-3 font-medium sm:px-6">24h</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell sm:px-6">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const isSelected = coin.id === selectedCoinId
              const isPositive = coin.priceChangePercentage24h >= 0

              return (
                <tr
                  key={coin.id}
                  onClick={() => onSelectCoin(coin.id)}
                  className={[
                    'cursor-pointer border-t border-gray-800/60 transition-colors',
                    isSelected
                      ? 'border-l-2 border-l-emerald-500 bg-gray-800/70'
                      : 'hover:bg-gray-800/50',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 text-gray-400 sm:px-6">{coin.rank}</td>
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      <img
                        src={coin.image}
                        width={24}
                        height={24}
                        alt={coin.name}
                        className="rounded-full"
                      />
                      <span className="font-medium text-white">{coin.name}</span>
                      <span className="text-gray-400">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white sm:px-6">{formatPrice(coin.currentPrice)}</td>
                  <td
                    className={[
                      'px-4 py-3 sm:px-6',
                      isPositive ? 'text-emerald-400' : 'text-red-400',
                    ].join(' ')}
                  >
                    {formatPercentage(coin.priceChangePercentage24h)}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-300 md:table-cell sm:px-6">
                    {formatMarketCap(coin.marketCap)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
