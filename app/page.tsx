import StrategyChart from "@/components/StrategyChart";
import MarketCapComp from "@/components/MarketCapComp";
import Ticker from "@/components/Ticker";
import { TREASURY_BUYS, getCombinedChartData } from "@/lib/uranus-data";
import { URANUS_SUPPLY, URANUS_CA } from "@/lib/constants";
import type { DexScreenerPair } from "@/lib/types";
import { ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";
import Image from "next/image";

// Fetch Live Price
async function getLivePrice(): Promise<DexScreenerPair | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${URANUS_CA}`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.pairs?.[0] || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function Home() {
  const pairData = await getLivePrice();
  const chartData = await getCombinedChartData(); 

  // Calculate Live Stats
  const currentPrice = pairData?.priceUsd ? parseFloat(pairData.priceUsd) : 0;
  // Calculate Market Cap: Price * Supply
  const calculatedMarketCap = currentPrice * URANUS_SUPPLY;
  
  // Portfolio calculations - explicitly handle empty acquisitions
  const hasAcquisitions = TREASURY_BUYS.length > 0;
  const totalHeld = hasAcquisitions ? TREASURY_BUYS.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const totalCost = hasAcquisitions ? TREASURY_BUYS.reduce((acc, curr) => acc + (curr.amount * curr.price), 0) : 0;
  const avgEntry = hasAcquisitions && totalHeld > 0 ? totalCost / totalHeld : 0;
  const currentValue = hasAcquisitions ? totalHeld * currentPrice : 0;
  const multiplier = hasAcquisitions && avgEntry > 0 ? currentPrice / avgEntry : 0;

  return (
    <div className="relative min-h-screen font-sans text-white">
      
      {/* --- FIXED BOTTOM RIGHT X LINK --- */}
      <div className="fixed bottom-8 right-8 z-50">
        <a 
          href="https://x.com/Uranus_Capital" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Follow Uranus Capital on X (Twitter)"
          className="group flex items-center justify-end"
        >
          {/* Tooltip (Slides in from right) */}
          <span className="mr-3 px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10">
            follow on x
          </span>

          {/* Icon */}
          <div className="bg-zinc-900/80 p-3 rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all duration-300 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </a>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 p-6 md:p-12 max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* HERO SECTION */}
        <header className="relative py-6 md:py-10 flex flex-col md:flex-row justify-between items-end">
          <div className="relative">
            <div className="relative w-full max-w-[400px] md:max-w-[500px] h-auto -ml-2">
              <Image 
                src="/uranuscap2.png"
                alt="Uranus Capital Logo"
                width={500}
                height={125} 
                className="object-contain"
                priority
                aria-label="Uranus Capital"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Price Block */}
            <div className="text-right">
              <div className="text-sm text-[#a1a1aa] font-medium uppercase tracking-wider">Live Price</div>
              {currentPrice > 0 ? (
                <div className="text-2xl font-mono text-white">Ʉ = ${currentPrice.toFixed(6)}</div>
              ) : (
                <div className="text-2xl font-mono text-zinc-500 animate-pulse">Loading...</div>
              )}
            </div>

            {/* Arrow Indicator */}
            <div className={`p-3 rounded-full border glass-card flex items-center justify-center ${(pairData?.priceChange?.h24 ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(pairData?.priceChange?.h24 ?? 0) >= 0 ? (
                <ArrowUpRight className="w-6 h-6" />
              ) : (
                <ArrowUpRight className="w-6 h-6 rotate-180" />
              )}
            </div>
          </div>
        </header>

        {/* TICKER */}
        <Ticker />

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* MAIN CHART */}
          <div className="lg:col-span-8 glass-card p-8 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Uranus Capital Acquisitions</h3>
                  <p className="text-sm text-[#a1a1aa]">URANUS Price</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[400px]">
              {chartData && chartData.length > 0 ? (
                <StrategyChart data={chartData} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <p className="text-sm">Loading chart data...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STATS COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Portfolio Card */}
            <div className="glass-card p-8 relative overflow-hidden group flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <DollarSign className="w-24 h-24 text-white" strokeWidth={1} />
              </div>
              <p className="text-[#a1a1aa] font-medium uppercase tracking-wider mb-2">Portfolio</p>
              <h2 className="text-5xl font-semibold text-white tracking-tight">
                ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h2>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a1a1aa]">
                <span className="text-white font-medium">{totalHeld.toLocaleString()} Ʉ</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-full">
                <p className="text-[#a1a1aa] font-medium uppercase tracking-wider mb-2">Performance</p>
                <div className="flex items-baseline justify-center gap-2">
                  <h2 className={`text-6xl font-semibold tracking-tight ${multiplier >= 1 ? 'text-white' : 'text-red-400'}`}>
                    {multiplier.toFixed(2)}x
                  </h2>
                  <span className="text-lg text-[#a1a1aa]">ROI</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 w-full">
                  <p className="text-sm text-[#a1a1aa] mb-1">Average Entry Price</p>
                  <p className="text-xl font-mono text-white">${avgEntry.toFixed(6)}</p>
                </div>
              </div>
            </div>

            {/* Interactive Market Cap Calculator */}
            <div className="flex-1 text-center">
               <MarketCapComp currentUranusMC={calculatedMarketCap} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
