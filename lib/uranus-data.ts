// lib/uranus-data.ts

import { URANUS_CA } from "./constants";
import type { TreasuryBuy, StockMarketCap, ChartDataPoint } from "./types";
import acquisitionsData from "../data/acquisitions.json";

// Load acquisitions from JSON file (easy to edit)
export const TREASURY_BUYS: TreasuryBuy[] = acquisitionsData as TreasuryBuy[];

// 1. HELPER: Fetch Real-Time Market Caps (FMP API)
export async function getStockMarketCaps(): Promise<StockMarketCap[]> {
  // Use environment variable for API key
  const apiKey = process.env.FMP_API_KEY || process.env.NEXT_PUBLIC_FMP_KEY;
  
  const FALLBACK: StockMarketCap[] = [
    { symbol: "MSTR", name: "MicroStrategy", marketCap: 85000000000 },
    { symbol: "TSLA", name: "Tesla", marketCap: 800000000000 },
    { symbol: "AAPL", name: "Apple", marketCap: 3000000000000 },
  ];

  if (!apiKey) return FALLBACK;

  try {
    const url = `https://financialmodelingprep.com/stable/quote?symbol=MSTR,TSLA,AAPL&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error("FMP API Failed");
    
    const data = await res.json();
    
    if (!data || !Array.isArray(data)) return FALLBACK;

    return [
      { 
        symbol: "MSTR", 
        name: "MicroStrategy", 
        marketCap: data.find((d: any) => d.symbol === "MSTR")?.marketCap || FALLBACK[0].marketCap 
      },
      { 
        symbol: "TSLA", 
        name: "Tesla", 
        marketCap: data.find((d: any) => d.symbol === "TSLA")?.marketCap || FALLBACK[1].marketCap 
      },
      { 
        symbol: "AAPL", 
        name: "Apple", 
        marketCap: data.find((d: any) => d.symbol === "AAPL")?.marketCap || FALLBACK[2].marketCap 
      },
    ];
  } catch (e) {
    console.error("Stock API Error:", e);
    return FALLBACK;
  }
}

// 2. HELPER: Fetch Crypto Chart (GeckoTerminal + DexScreener)
export async function getCombinedChartData(): Promise<ChartDataPoint[]> {
  try {
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${URANUS_CA}`, { next: { revalidate: 3600 } });
    const dexData = await dexRes.json();
    const pairAddress = dexData.pairs?.[0]?.pairAddress;

    if (!pairAddress) throw new Error("No pool found");

    const geckoRes = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${pairAddress}/ohlcv/day?limit=365`, { next: { revalidate: 3600 } });
    const geckoData = await geckoRes.json();
    const candles = geckoData.data?.attributes?.ohlcv_list || [];

    const formattedData: ChartDataPoint[] = candles.map((candle: number[]) => {
      const dateStr = new Date(candle[0] * 1000).toISOString().split('T')[0];
      const buyRecord = TREASURY_BUYS.find(b => b.date === dateStr);
      const marketPrice = candle[4];

      return {
        date: dateStr,
        marketPrice: marketPrice,
        buyPrice: buyRecord ? buyRecord.price : null,
        amount: buyRecord ? buyRecord.amount : null,
        // For scatter markers: use marketPrice as Y value so markers appear on the price line
        // Store the amount separately for tooltip display
        acquisitionAmount: buyRecord ? marketPrice : undefined,
        acquisitionAmountValue: buyRecord ? buyRecord.amount : undefined,
      };
    }).reverse();

    return formattedData;
  } catch (e) {
    console.error("Chart Data Error:", e);
    // Fallback: create chart data from acquisitions only
    return TREASURY_BUYS.map(b => ({ 
      date: b.date, 
      marketPrice: b.price, 
      buyPrice: b.price,
      amount: b.amount,
      acquisitionAmount: b.price, // Y position (on the line)
      acquisitionAmountValue: b.amount // Actual amount for tooltip
    }));
  }
}
