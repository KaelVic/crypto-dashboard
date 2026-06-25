'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { ChartDataPoint } from '@/types/coin'
import { formatPrice, formatShortDate } from '@/lib/formatters'

interface Props {
  data: ChartDataPoint[]
  coinName: string
  loading?: boolean
  periodLabel?: string
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ChartDataPoint }[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm shadow-lg">
      <p className="text-gray-400">{new Date(point.date).toLocaleDateString('pt-BR')}</p>
      <p className="font-semibold text-white">{formatPrice(point.price)}</p>
    </div>
  )
}

export default function PriceChart({ data, coinName, loading = false, periodLabel }: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Preço — {coinName}{periodLabel ? ` — Últimos ${periodLabel}` : ''}</h3>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
          <p className="animate-pulse text-sm text-gray-500">Carregando gráfico...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
          <p className="text-sm text-gray-500">Nenhum dado disponível</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.4} />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={90}
              hide={false}
              className="hidden sm:block"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
