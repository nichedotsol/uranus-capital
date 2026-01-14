"use client";
import type { EscrowLock } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface EscrowDashboardProps {
  locks: EscrowLock[];
}

export default function EscrowDashboard({ locks }: EscrowDashboardProps) {
  if (!locks || locks.length === 0) {
    return (
      <div className="glass-card p-8">
        <h3 className="text-lg font-medium text-white mb-4">LOCKED URANUS</h3>
        <p className="text-sm text-[#a1a1aa]">No escrow locks currently active.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 md:p-8">
      <h3 className="text-lg font-medium text-white mb-4 md:mb-6 text-center md:text-left">LOCKED URANUS</h3>
      
      {/* Desktop: Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 pb-4 mb-4 border-b border-white/10">
            <div className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium">
              Acquisition Date
            </div>
            <div className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium">
              Amount
            </div>
            <div className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium">
              Jupiter Lock
            </div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {locks.map((lock, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 last:border-b-0"
              >
                {/* Acquisition Date */}
                <div className="text-sm font-mono text-white">
                  {format(new Date(lock.date + 'T00:00:00'), "MMM d, yyyy")}
                </div>

                {/* Amount */}
                <div className="text-sm font-mono text-white">
                  {lock.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} Ʉ
                </div>

                {/* Jupiter Lock */}
                <div>
                  <a
                    href={`https://orbmarkets.io/tx/${lock.jupiterLock}?advanced=true&tab=summary`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#70E3F8] hover:text-[#70E3F8]/80 transition-colors group"
                  >
                    <span className="font-mono">
                      {lock.jupiterLock.slice(0, 8)}...{lock.jupiterLock.slice(-8)}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="md:hidden space-y-4">
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {locks.map((lock, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-3"
            >
              {/* Acquisition Date */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium mb-1">
                  Acquisition Date
                </p>
                <p className="text-sm font-mono text-white">
                  {format(new Date(lock.date + 'T00:00:00'), "MMM d, yyyy")}
                </p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium mb-1">
                  Amount
                </p>
                <p className="text-sm font-mono text-white">
                  {lock.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} Ʉ
                </p>
              </div>

              {/* Jupiter Lock */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium mb-1">
                  Jupiter Lock
                </p>
                <a
                  href={`https://orbmarkets.io/tx/${lock.jupiterLock}?advanced=true&tab=summary`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#70E3F8] hover:text-[#70E3F8]/80 transition-colors group break-all"
                >
                  <span className="font-mono">
                    {lock.jupiterLock.slice(0, 12)}...{lock.jupiterLock.slice(-12)}
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
