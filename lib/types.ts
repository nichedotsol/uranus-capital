// Type definitions for Uranus Capital

export interface TreasuryBuy {
  date: string;
  amount: number;
  price: number;
  note: string;
}

export interface DexScreenerPair {
  pairAddress?: string;
  priceUsd?: string;
  priceChange?: {
    h24?: number;
  };
}

export interface CryptoSearchResult {
  success?: boolean;
  error?: string;
  name?: string;
  symbol?: string;
  thumb?: string;
  marketCap?: number;
  currentPrice?: number;
}

export interface ChartDataPoint {
  date: string;
  marketPrice: number;
  buyPrice: number | null;
  amount: number | null;
  acquisitionAmount?: number; // Y position on chart (same as marketPrice for markers on line)
  acquisitionAmountValue?: number; // Actual amount acquired (for tooltip)
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export interface StockMarketCap {
  symbol: string;
  name: string;
  marketCap: number;
}
