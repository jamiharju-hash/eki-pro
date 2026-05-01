import { coinIds } from './portfolio';

export type CoinGeckoPrice = {
  usd: number;
  usd_24h_change?: number;
  last_updated_at?: number;
};

export type CoinGeckoPriceResponse = Record<string, CoinGeckoPrice>;

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCoinPrices(): Promise<CoinGeckoPriceResponse> {
  const apiKey = process.env.CG_API_KEY;
  if (!apiKey) throw new Error('Missing required environment variable: CG_API_KEY');

  const params = new URLSearchParams({
    ids: coinIds.join(','),
    vs_currencies: 'usd',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
  });

  const response = await fetch(`${COINGECKO_BASE_URL}/simple/price?${params}`, {
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CoinGecko API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<CoinGeckoPriceResponse>;
}
