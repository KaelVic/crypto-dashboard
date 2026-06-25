import { NextResponse } from 'next/server'
import type { ChartDataPoint } from '@/types/coin'

const VALID_DAYS = ['1', '7', '30', '90', '365'] as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'ID da moeda é obrigatório' },
      { status: 400 },
    )
  }

  const { searchParams } = new URL(request.url)
  const days = searchParams.get('days') || '7'

  if (!VALID_DAYS.includes(days as (typeof VALID_DAYS)[number])) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Período inválido. Use: 1, 7, 30, 90 ou 365' },
      { status: 400 },
    )
  }

  const baseUrl = process.env.COINGECKO_API_URL ?? 'https://api.coingecko.com/api/v3'
  const url = `${baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=${days}`

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
