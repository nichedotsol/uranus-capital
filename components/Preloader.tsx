"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [cleanup, setCleanup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 1. Wait a moment at 100%, then trigger the slide up animation
          setTimeout(() => setComplete(true), 250);
          
          // 2. Remove the component entirely from the DOM after animation finishes
          setTimeout(() => setCleanup(true), 1200); 
          return 100;
        }
        
        // Random jump to simulate processing data chunks
        const jump = Math.floor(Math.random() * 15) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 120); // Speed of the counter

    return () => clearInterval(interval);
  }, []);

  // If the animation is totally done, don't render anything
  if (cleanup) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center font-mono text-[#70E3F8] overflow-hidden transition-all duration-700
      ${complete ? "animate-slide-up" : ""}`}
    >
      {/* Background Texture inside the loader */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 bg-[length:40px_40px]" />
      
      {/* Massive Counter */}
      <div className="relative z-10 flex flex-col items-start select-none">
        <div className="text-[25vw] leading-[0.8] font-black tracking-tighter text-white mix-blend-difference">
          {count}
        </div>
        
        <div className="flex justify-between w-full mt-4 px-2">
            <span className="text-xs uppercase tracking-widest opacity-70 animate-pulse">System Boot</span>
            <span className="text-xs uppercase tracking-widest opacity-70">Ver 2.0</span>
        </div>
      </div>
    </div>
  );
}
