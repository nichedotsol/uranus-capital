'use server'

import type { CryptoSearchResult } from "@/lib/types";

export async function searchCrypto(query: string): Promise<CryptoSearchResult> {
  if (!query) return { error: "Please enter a coin name" };

  // --- CONFIGURATION ---
  const API_KEY = process.env.COINGECKO_API_KEY;
  
  if (!API_KEY) {
    return { error: "CoinGecko API key not configured" };
  } 
  
  // PRO API CONFIGURATION
  // 1. Base URL must be 'pro-api'
  const BASE_URL = "https://pro-api.coingecko.com/api/v3";
  // 2. Auth Parameter for Pro is 'x_cg_pro_api_key'
  const AUTH_PARAM = `x_cg_pro_api_key=${API_KEY}`;
  
  const HEADERS = {
    "User-Agent": "MarketAlpha/1.0",
    "Accept": "application/json"
  };
  // ---------------------

  try {
    // 1. SEARCH: Find the Coin ID
    // Use the Pro Base URL + Pro Auth Param
    const searchUrl = `${BASE_URL}/search?query=${encodeURIComponent(query)}&${AUTH_PARAM}`;
    
    const searchRes = await fetch(searchUrl, { 
      headers: HEADERS,
      cache: 'no-store' 
    });
    
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error(`Search API Error (${searchRes.status}):`, errText);
      
      // Specific handling for common Pro API key errors
      if (searchRes.status === 401 || searchRes.status === 403) {
        return { error: "Invalid Pro API Key or Plan (401/403)" };
      }
      return { error: `Search failed: ${searchRes.status}` };
    }
    
    const searchData = await searchRes.json();

    if (!searchData.coins || searchData.coins.length === 0) {
      return { error: "Coin not found" };
    }

    // Take the best match
    const bestMatch = searchData.coins[0];
    const coinId = bestMatch.id;

    // 2. PRICE: Get Market Cap & Price using the ID
    const priceUrl = `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&${AUTH_PARAM}`;
    
    const priceRes = await fetch(priceUrl, { 
      headers: HEADERS,
      cache: 'no-store' 
    });

    if (!priceRes.ok) {
      console.error(`Price API Error (${priceRes.status}):`, await priceRes.text());
      return { error: `Price fetch failed: ${priceRes.status}` };
    }

    const priceData = await priceRes.json();

    // Validate we actually got data for this specific ID
    if (!priceData[coinId]) {
      return { error: "Market cap data unavailable" };
    }

    // 3. Return Clean Data
    return {
      success: true,
      name: bestMatch.name,
      symbol: bestMatch.symbol,
      thumb: bestMatch.thumb,
      marketCap: priceData[coinId].usd_market_cap,
      currentPrice: priceData[coinId].usd
    };

  } catch (e) {
    console.error("Server Action Exception:", e);
    return { error: "Connection failed. Please try again." };
  }
}
