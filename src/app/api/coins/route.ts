import { NextResponse } from 'next/server'
import type { CoinMarket } from '@/types/coin'

export async function GET() {
  const baseUrl = process.env.COINGECKO_API_URL ?? 'https://api.coingecko.com/api/v3'
  const url =
    `${baseUrl}/coins/markets` +
    `?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`

  const apiKey = process.env.COINGECKO_API_KEY
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  if (apiKey) {
    headers['x-cg-demo-api-key'] = apiKey
  }

  let res: Response
  try {
    res = await fetch(url, { headers })
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

  const raw: unknown[] = await res.json()

  const coins: CoinMarket[] = raw.map((item: any) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    image: item.image,
    currentPrice: item.current_price,
    priceChange24h: item.price_change_24h,
    priceChangePercentage24h: item.price_change_percentage_24h,
    marketCap: item.market_cap,
    totalVolume: item.total_volume,
    rank: item.market_cap_rank,
    lastUpdated: item.last_updated,
  }))

  return NextResponse.json(coins)
}
