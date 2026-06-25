# 📊 Crypto Dashboard

> Dashboard de mercado cripto que consome a API CoinGecko via backend intermediário — o front nunca chama a API externa diretamente.

![Screenshot do Dashboard](./docs/screenshot.png)

## O Problema

Em muitos projetos, o front chama APIs externas diretamente. Isso expõe chaves, dificulta tratamento de erros, e acopla o front ao formato da API externa. Este projeto resolve com uma camada de backend própria que busca, valida, transforma e serve o dado pronto.

## Arquitetura

```
Browser (React)
      │
      │  fetch /api/coins
      │  fetch /api/coins/bitcoin/chart?days=30
      ▼
Next.js API Routes (backend próprio)
  ├─ Valida parâmetros (whitelist: 1, 7, 30, 90, 365)
  ├─ Trata erros (429 rate limit, 5xx, timeout)
  ├─ Transforma resposta (snake_case → camelCase, campos filtrados)
  └─ Retorna dado pronto
      │
      ▼
CoinGecko API (pública)
```

**O front nunca sabe que a CoinGecko existe.** Ele só conhece `/api/coins` e `/api/coins/[id]/chart`.

## Funcionalidades

- 📈 Gráfico de preço histórico com Recharts (24h, 7d, 30d, 90d, 1 ano)
- 📋 Tabela top 10 criptomoedas com preço, variação 24h e market cap
- 🔄 Seleção de moeda via dropdown ou clique na tabela
- 🎛️ Filtro de período com validação no backend (não no front)
- 🛡️ Tratamento de erros da API externa (rate limit, timeout, HTTP errors)
- 📱 Layout dark, responsivo e mobile-first

## Stack

| Camada | Tecnologia |
|:---|:---|
| Front | Next.js 16 + TypeScript |
| Backend | API Routes (Next.js) |
| Gráfico | Recharts |
| Estilo | Tailwind CSS v4 |
| API externa | CoinGecko |
| Deploy | Vercel |

## Como Rodar Localmente

```bash
git clone https://github.com/SEU_USER/crypto-dashboard.git
cd crypto-dashboard
cp .env.example .env.local
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Deploy (Vercel)

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Na configuração, adicione a variável de ambiente:
   ```
   COINGECKO_API_URL = https://api.coingecko.com/api/v3
   ```
4. Clique em **Deploy**

A Vercel detecta Next.js automaticamente — zero configuração extra. A URL de produção será gerada automaticamente.

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|:---|:---|:---|
| `COINGECKO_API_URL` | URL base da API CoinGecko | `https://api.coingecko.com/api/v3` |

> `.env.local` está no `.gitignore` — nunca sobe para o repositório.

## API Routes

| Rota | Descrição |
|:---|:---|
| `GET /api/coins` | Top 10 por market cap. Campos em camelCase. |
| `GET /api/coins/[id]/chart?days=` | Histórico de preço. `days`: `1`, `7`, `30`, `90`, `365` (default `7`). Fora da whitelist → `400`. |
| `GET /api/health` | Health check do backend. |

## Estrutura do Projeto

```
src/
├── types/
│   └── coin.ts              # Interfaces: CoinMarket, ChartDataPoint, ApiError
├── lib/
│   └── formatters.ts        # Utilitários: formatPrice, formatPercentage, formatMarketCap, formatShortDate
├── components/
│   ├── PriceChart.tsx       # Gráfico de linha Recharts
│   ├── CoinTable.tsx        # Tabela top 10 clicável
│   ├── CoinSelector.tsx     # Dropdown de seleção de moeda
│   └── PeriodFilter.tsx     # Botões de período 24h / 7d / 30d / 90d / 1A
└── app/
    ├── api/
    │   ├── coins/route.ts               # GET /api/coins
    │   ├── coins/[id]/chart/route.ts    # GET /api/coins/[id]/chart?days=
    │   └── health/route.ts              # GET /api/health
    └── page.tsx                         # Dashboard principal
```

## Decisões Técnicas

**Por que backend intermediário e não chamada direta no front?**
Segurança, desacoplamento e tratamento centralizado de erros. O front recebe dados já normalizados — se a CoinGecko mudar o schema, só o backend muda.

**Por que a validação de `days` fica no backend?**
O front não pode ser a única barreira. Qualquer cliente pode chamar `/api/coins/bitcoin/chart?days=999` — o backend rejeita com `400` antes de propagar o erro para a API externa.

**Por que Client Component na `page.tsx` e não Server Component?**
O dashboard depende de estado interativo (moeda selecionada, período, loading). Server Components não têm `useState` — o padrão correto é buscar no servidor apenas o que não precisa de interatividade, e usar Client Component onde há estado.
