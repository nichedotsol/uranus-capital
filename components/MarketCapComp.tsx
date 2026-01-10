'use client';

import { useState } from "react";
import { Search, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import { searchCrypto } from "@/app/actions";
import { URANUS_SUPPLY } from "@/lib/constants";
import type { CryptoSearchResult } from "@/lib/types";

interface MarketCapCompProps {
  currentUranusMC: number;
}

export default function MarketCapComp({ currentUranusMC }: MarketCapCompProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CryptoSearchResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!query) return;

    setLoading(true);
    setError("");
    setData(null);

    const result = await searchCrypto(query);

    if (result.error) {
      setError(result.error);
    } else {
      setData(result);
    }
    setLoading(false);
  };

  const formatMoney = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="glass-card p-8 flex-1 flex flex-col">
        
        {/* ADDED: text-center */}
        <h3 className="text-lg font-medium text-white mb-2 text-center">
          Comparison Tool
        </h3>
        {/* ADDED: text-center */}
        <p className="text-sm text-[#a1a1aa] mb-6 leading-relaxed text-center">
          View the price of Uranus when its market cap reaches the current market cap of a specific coin.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#a1a1aa] group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (e.g. PEPE, WIF)"
              aria-label="Search cryptocurrency to compare market cap"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-[#a1a1aa]/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query}
            aria-label="Compare cryptocurrency market cap"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 disabled:opacity-50 px-4 py-2 rounded-xl font-medium transition-all disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Compare"}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {data && data.success && data.marketCap && data.symbol && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Comparison Logic */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 {data.thumb && <img src={data.thumb} className="w-8 h-8 rounded-full" alt="coin" />}
                 <div className="text-left"> {/* Added text-left to keep inner content aligned */}
                   <div className="font-bold text-white leading-none">{data.symbol}</div>
                   <div className="text-xs text-[#a1a1aa] mt-1">MC: {formatMoney(data.marketCap)}</div>
                 </div>
               </div>

               <ArrowRight className="text-[#a1a1aa] w-5 h-5" />
               
               <div className="text-right">
                 <div className="font-bold text-white leading-none">$URANUS</div>
                 <div className="text-xs text-emerald-400 mt-1 font-mono">
                   {formatPrice(data.marketCap / URANUS_SUPPLY)}
                 </div>
               </div>
            </div>

            {/* The Multiplier Badge */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center flex items-center justify-between">
              <span className="text-sm text-[#a1a1aa] font-medium uppercase tracking-wider">
                Potential Upside
              </span>
              <span className="text-xl font-bold text-white flex items-center gap-1">
                 <TrendingUp className="w-5 h-5 text-emerald-400" />
                 {(data.marketCap / currentUranusMC).toLocaleString(undefined, {maximumFractionDigits: 1})}x
              </span>
            </div>

          </div>
        )}
        
        {/* Placeholder */}
        {!data && !error && (
          <div className="flex-1 flex items-center justify-center opacity-20">
             <TrendingUp className="w-24 h-24 text-white" />
          </div>
        )}

      </div>
    </div>
  );
}
