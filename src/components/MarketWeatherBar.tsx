import React from 'react';
import { TrendingUp, TrendingDown, Sun, Cloud, DollarSign } from 'lucide-react';

export const MarketWeatherBar: React.FC = () => {
  return (
    <div className="w-full bg-[#f9f9f9] border-b border-[#e2e2e2] px-3.5 py-1 text-[10.5px] font-nyt-sans flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none text-gray-600">
      {/* Financial Tickers */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-black">S&P 500</span>
          <span className="text-emerald-700 font-mono font-medium flex items-center">
            <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
            +0.42%
          </span>
        </div>

        <span className="text-gray-300">•</span>

        <div className="flex items-center gap-1">
          <span className="font-bold text-black">Nasdaq</span>
          <span className="text-emerald-700 font-mono font-medium flex items-center">
            <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
            +0.68%
          </span>
        </div>

        <span className="text-gray-300">•</span>

        <div className="flex items-center gap-1">
          <span className="font-bold text-black">Crude Oil</span>
          <span className="text-red-700 font-mono font-medium flex items-center">
            <TrendingDown className="w-2.5 h-2.5 inline mr-0.5" />
            $78.40 (-0.8%)
          </span>
        </div>

        <span className="text-gray-300">•</span>

        <div className="flex items-center gap-1">
          <span className="font-bold text-black">10-Yr</span>
          <span className="font-mono text-gray-700 font-medium">4.12%</span>
        </div>
      </div>

      {/* Local Weather */}
      <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-gray-200">
        <Sun className="w-3 h-3 text-amber-500" />
        <span className="font-medium text-black">New York, NY 64°F</span>
        <span className="text-gray-400">Sunny</span>
      </div>
    </div>
  );
};
