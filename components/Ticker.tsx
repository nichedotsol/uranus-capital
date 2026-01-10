'use client';

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { CryptoPrice } from "@/lib/types";

export default function Ticker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async (retryCount = 0) => {
    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      setError(false);
      // Create abort controller for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Use a more reliable endpoint with better error handling
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,zcash&order=market_cap_desc&per_page=4",
        {
          signal: controller.signal,
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setPrices(data);
        setLoading(false);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Failed to fetch ticker prices", error);
      setError(true);
      setLoading(false);
      
      // Retry logic: retry up to 2 times with exponential backoff
      if (retryCount < 2) {
        setTimeout(() => {
          fetchPrices(retryCount + 1);
        }, Math.pow(2, retryCount) * 5000); // 5s, 10s delays
      }
    } finally {
      // Ensure timeout is cleared
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  useEffect(() => {
    // 1. Fetch immediately on mount
    fetchPrices();

    // 2. Set interval for 5 minutes (more reasonable than 12 hours)
    const interval = setInterval(() => fetchPrices(), 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  // Loading state
  if (loading && prices.length === 0) {
    return (
      <div className="w-full overflow-hidden relative glass-card py-3">
        <div className="flex items-center justify-center h-6 text-zinc-500 text-sm animate-pulse">
          Loading Market Data...
        </div>
      </div>
    );
  }

  // Error state with fallback data
  if (error && prices.length === 0) {
    return (
      <div className="w-full overflow-hidden relative glass-card py-3">
        <div className="flex items-center justify-center h-6 text-zinc-500 text-sm">
          Market data temporarily unavailable
        </div>
      </div>
    );
  }

  // If no prices, don't render
  if (prices.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative glass-card py-3">
      <div className="flex animate-ticker whitespace-nowrap w-max">
        {/* We repeat the list multiple times to ensure seamless infinite scrolling */}
        {[...Array(10)].map((_, loopIndex) => (
          <div key={loopIndex} className="flex items-center gap-12 mx-4">
            {prices.map((coin) => (
              <div key={`${loopIndex}-${coin.id}`} className="flex items-center gap-3">
                {/* Symbol */}
                <span className="text-zinc-400 font-bold text-sm uppercase tracking-wider">
                  {coin.symbol}
                </span>

                {/* Price */}
                <span className="text-white font-medium text-sm">
                  {formatPrice(coin.current_price)}
                </span>

                {/* % Change */}
                <span className={`flex items-center gap-1 text-xs ${getChangeColor(coin.price_change_percentage_24h)}`}>
                  {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>

                {/* Separator */}
                <span className="text-white/10 ml-6">///</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
