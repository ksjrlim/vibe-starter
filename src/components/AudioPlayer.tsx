import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  duration?: string;
  paragraphs?: string[];
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  duration = '5:20',
  paragraphs = [],
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [playbackRate, setPlaybackRate] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5 * playbackRate;
        });
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackRate]);

  const togglePlay = () => {
    // Optionally trigger Web Speech API if user prefers
    if ('speechSynthesis' in window && !isPlaying && paragraphs.length > 0) {
      try {
        window.speechSynthesis.cancel();
        const textToSpeak = paragraphs.slice(0, 3).join(' ');
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = playbackRate;
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback to simulated playback
      }
    } else if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(!isPlaying);
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const restart = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-[#f7f7f7] border border-[#e2e2e2] rounded-md p-3 my-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#326891]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 font-nyt-sans">
            Listen to this article
          </span>
        </div>
        <span className="text-[11px] text-gray-500 font-mono font-medium">
          {isPlaying ? `${Math.floor((progress / 100) * 320)}s / 320s` : duration}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-[#326891] h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] text-white rounded text-[11px] font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Narrator</span>
              </>
            )}
          </button>

          <button
            onClick={restart}
            title="Restart from beginning"
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={cycleRate}
          className="px-2 py-1 text-[11px] font-mono font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
          title="Playback speed"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};
