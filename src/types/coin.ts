export interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCap: number
  totalVolume: number
  rank: number
  lastUpdated: string
}

export interface ChartDataPoint {
  timestamp: number
  date: string
  price: number
}

export interface ApiError {
  error: string
  message: string
}
