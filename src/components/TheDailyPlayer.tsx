import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Headphones, RotateCcw, FastForward, Volume2 } from 'lucide-react';

export const TheDailyPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(14); // percentage
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.3 * speed));
      }, 400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
  };

  return (
    <div className="bg-[#121212] text-white p-3.5 rounded-lg my-4 shadow-sm border border-[#2a2a2a]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="text-[11px] font-black uppercase tracking-widest text-red-500 font-nyt-sans">
            The Daily
          </span>
          <span className="text-[10px] text-gray-400 font-nyt-sans">• 28 MIN</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-nyt-sans">
          <Headphones className="w-3.5 h-3.5 text-gray-400" />
          <span>Hosted by Michael Barbaro</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-nyt-headline font-bold text-[15px] sm:text-[16px] text-white leading-snug mb-2.5">
        The Departures Reshaping the White House
      </h3>

      {/* Progress Bar & Audio Waves */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1 h-3 justify-between px-1">
          {[40, 75, 30, 90, 60, 20, 85, 45, 100, 70, 50, 30, 80, 95, 60, 40, 70, 85, 50, 30].map(
            (val, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-red-500' : 'bg-gray-600'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, Math.round(val * 0.85))}%` : '20%',
                }}
              />
            )
          )}
        </div>

        <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white text-black rounded text-[11px] font-bold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen Now</span>
              </>
            )}
          </button>

          <button
            onClick={() => setProgress(Math.max(0, progress - 10))}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-mono">
            {Math.floor((progress / 100) * 28)}:14 / 28:00
          </span>
          <button
            onClick={cycleSpeed}
            className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-gray-300 bg-[#242424] border border-[#3a3a3a] rounded hover:text-white transition-colors cursor-pointer"
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};
