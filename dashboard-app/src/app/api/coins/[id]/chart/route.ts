import { NextResponse } from 'next/server'
import type { ChartDataPoint } from '@/types/coin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'ID da moeda é obrigatório' },
      { status: 400 },
    )
  }

  const baseUrl = process.env.COINGECKO_API_URL ?? 'https://api.coingecko.com/api/v3'
  const url = `${baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=7`

  let res: Response
  try {
    res = await fetch(url)
  } catch {
    return NextResponse.json(
      { error: 'BAD_GATEWAY', message: 'Não foi possível conectar à API externa' },
      { status: 502 },
    )
  }

  if (!res.ok) {
    if (res.status === 429) {
      return NextResponse.json(
        { error: 'RATE_LIMITED', message: 'Serviço temporariamente indisponível' },
        { status: 503 },
      )
    }
    return NextResponse.json(
      { error: 'BAD_GATEWAY', message: 'Erro ao buscar dados externos' },
      { status: 502 },
    )
  }

  const raw: { prices: [number, number][] } = await res.json()

  const chart: ChartDataPoint[] = raw.prices.map(([timestamp, price]) => ({
    timestamp,
    date: new Date(timestamp).toISOString(),
    price: Math.round(price * 100) / 100,
  }))

  return NextResponse.json(chart)
}
