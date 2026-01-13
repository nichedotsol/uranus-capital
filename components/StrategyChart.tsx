"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, Legend
} from "recharts";
import { format } from "date-fns";
import type { ChartDataPoint } from "@/lib/types";

interface StrategyChartProps {
  data: ChartDataPoint[];
}

export default function StrategyChart({ data }: StrategyChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <p className="text-sm">Chart data unavailable</p>
          <p className="text-xs mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Debug: Log data points with acquisitions
  const acquisitionPoints = data.filter(d => d.acquisitionAmount !== undefined && d.acquisitionAmountValue !== undefined);
  if (acquisitionPoints.length > 0) {
    console.log('Acquisition points found:', acquisitionPoints);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.2)" 
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(str) => {
             try { return format(new Date(str), "MMM yyyy") } catch { return "" }
          }}
          minTickGap={60}
        />
        
        {/* Single Y-Axis for Price */}
        <YAxis 
          stroke="rgba(255,255,255,0.2)" 
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => {
            if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
            return `$${val.toFixed(4)}`;
          }}
          width={80}
          label={{ value: 'URANUS Price', angle: -90, position: 'insideLeft', fill: '#a1a1aa', style: { fontSize: 11 } }}
        />
        
        <Tooltip
          contentStyle={{ 
            backgroundColor: "#09090b", 
            borderColor: "rgba(255,255,255,0.1)", 
            color: "#fff",
            borderRadius: "12px",
            padding: "12px"
          }}
          itemStyle={{ color: "#fff", fontSize: 12 }}
          formatter={(value: any, name: string, props: any) => {
            if (name === "marketPrice") return [`$${Number(value).toFixed(6)}`, "URANUS Price"];
            if (name === "acquisitionAmount") {
              const amount = props.payload?.acquisitionAmountValue;
              return amount ? [`${Number(amount).toLocaleString()} Ʉ`, "Acquired"] : null;
            }
            return [value, name];
          }}
          labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: 20, paddingBottom: 10, color: "#ffffff" }}
          iconType="line"
          align="right"
          verticalAlign="bottom"
          formatter={(value) => {
            if (value === "marketPrice") return "URANUS PRICE";
            if (value === "acquisitionAmount") return "URANUS CAPITAL ACQUISITIONS";
            return value.toUpperCase();
          }}
          iconSize={16}
        />
        
        {/* URANUS Price Line - White */}
        <Line 
          type="monotone" 
          dataKey="marketPrice" 
          stroke="#ffffff"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6, fill: "#ffffff", stroke: "#000", strokeWidth: 2 }}
          name="marketPrice"
        />
        
        {/* Acquisition Markers - Cyan circles on the price line */}
        <Scatter 
          dataKey="acquisitionAmount" 
          fill="#70E3F8"
          name="acquisitionAmount"
          shape={((props: any) => {
            // Debug: Log when shape function is called
            console.log('Scatter shape called:', {
              cx: props.cx,
              cy: props.cy,
              payload: props.payload,
              hasValue: !!props.payload?.acquisitionAmountValue
            });
            
            // Only render if there's an acquisition
            if (!props.payload?.acquisitionAmountValue) {
              return null;
            }
            
            // Ensure we have valid coordinates
            if (props.cx == null || props.cy == null) {
              console.warn('Scatter: Missing coordinates', props);
              return null;
            }
            
            return (
              <g>
                <circle 
                  cx={props.cx} 
                  cy={props.cy} 
                  r={7} 
                  fill="#70E3F8" 
                  stroke="#000" 
                  strokeWidth={1.5}
                />
              </g>
            );
          }) as any}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
