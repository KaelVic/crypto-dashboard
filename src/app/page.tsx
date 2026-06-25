'use client'

import { useEffect, useState } from 'react'
import type { CoinMarket, ChartDataPoint } from '@/types/coin'
import CoinSelector from '@/components/CoinSelector'
import CoinTable from '@/components/CoinTable'
import PriceChart from '@/components/PriceChart'
import PeriodFilter from '@/components/PeriodFilter'

export default function Home() {
  const [coins, setCoins] = useState<CoinMarket[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin')
  const [selectedDays, setSelectedDays] = useState('7')
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInitial() {
      try {
        const [coinsRes, chartRes] = await Promise.all([
          fetch('/api/coins'),
          fetch('/api/coins/bitcoin/chart?days=7'),
        ])

        if (!coinsRes.ok) throw new Error('Falha ao carregar lista de criptomoedas')
        if (!chartRes.ok) throw new Error('Falha ao carregar dados do gráfico')

        const coinsData: CoinMarket[] = await coinsRes.json()
        const chartDataResult: ChartDataPoint[] = await chartRes.json()

        setCoins(coinsData)
        setChartData(chartDataResult)
        if (coinsData.length > 0) {
          setSelectedCoin(coinsData[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
        setChartLoading(false)
      }
    }

    loadInitial()
  }, [])

  async function handleSelectCoin(id: string) {
    setSelectedCoin(id)
    setChartLoading(true)
    try {
      const res = await fetch(`/api/coins/${id}/chart?days=${selectedDays}`)
      if (!res.ok) throw new Error('Falha ao carregar gráfico')
      const data: ChartDataPoint[] = await res.json()
      setChartData(data)
    } catch {
      // chart error non-fatal — keep previous data, clear loading
    } finally {
      setChartLoading(false)
    }
  }

  async function handleSelectDays(days: string) {
    setSelectedDays(days)
    setChartLoading(true)
    try {
      const res = await fetch(`/api/coins/${selectedCoin}/chart?days=${days}`)
      if (!res.ok) throw new Error('Falha ao carregar gráfico')
      const data: ChartDataPoint[] = await res.json()
      setChartData(data)
    } catch {
      // chart error non-fatal — keep previous data, clear loading
    } finally {
      setChartLoading(false)
    }
  }

  const periodLabels: Record<string, string> = { '1': '24h', '7': '7d', '30': '30d', '90': '90d', '365': '1A' }
  const periodLabel = periodLabels[selectedDays] ?? '7d'

  const selectedCoinName = coins.find((c) => c.id === selectedCoin)?.name ?? selectedCoin

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-800 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Crypto Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">Dados de mercado via backend intermediário</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {loading ? (
            <div className="flex flex-col gap-6">
              <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-800" />
              <div className="h-[364px] animate-pulse rounded-xl bg-gray-900" />
              <div className="h-64 animate-pulse rounded-xl bg-gray-900" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-8 text-center">
              <p className="mb-4 text-sm font-medium text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CoinSelector
                  coins={coins}
                  selectedId={selectedCoin}
                  onSelect={handleSelectCoin}
                />
                <PeriodFilter selected={selectedDays} onSelect={handleSelectDays} />
              </div>

              <PriceChart
                data={chartData}
                coinName={selectedCoinName}
                loading={chartLoading}
                periodLabel={periodLabel}
              />

              <CoinTable
                coins={coins}
                onSelectCoin={handleSelectCoin}
                selectedCoinId={selectedCoin}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs text-gray-500">
            Dados fornecidos por{' '}
            <span className="font-medium text-gray-400">CoinGecko</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
