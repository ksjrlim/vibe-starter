import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

// 5x5 grid puzzle
// Solution:
// B E A T S
// E X I T S
// A U D I O
// R U L E S
// S L E E P
// Let's verify Down:
// B E A R S (1-Down: Grizzly and polar creatures)
// E X U U L (wait, let's make an exact valid mini crossword!)
// 1. T I M E S
// 2. I M A G E
// 3. M A P L E
// 4. E G G E D
// 5. S E E D S
// Let's check Down:
// 1-D: T I M E S (Matches 1-A!)
// 2-D: I M A G E
// 3-D: M A P L E
// 4-D: E G G E D
// 5-D: S E E D S
// Perfect symmetric word square!

const SOLUTION = [
  ['T', 'I', 'M', 'E', 'S'],
  ['I', 'M', 'A', 'G', 'E'],
  ['M', 'A', 'P', 'L', 'E'],
  ['E', 'G', 'G', 'E', 'D'],
  ['S', 'E', 'E', 'D', 'S'],
];

const CLUES_ACROSS = [
  { num: 1, clue: 'New York newspaper featured on this page' },
  { num: 6, clue: 'Photograph or visual representation' },
  { num: 7, clue: 'Syrup-producing tree on Canada’s flag' },
  { num: 8, clue: 'Incited or urged on (with "on")' },
  { num: 9, clue: 'Sunflower snacks or garden starters' },
];

const CLUES_DOWN = [
  { num: 1, clue: 'Historic clock tower measurement' },
  { num: 2, clue: 'Mental picture or portrait' },
  { num: 3, clue: 'Tree known for vibrant autumn foliage' },
  { num: 4, clue: 'Encouraged to act recklessly (with "on")' },
  { num: 5, clue: 'Kernels planted in spring soil' },
];

export const MiniCrossword: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && !isSolved) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isSolved]);

  const checkSolution = (currentGrid: string[][]) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (currentGrid[r][c].toUpperCase() !== SOLUTION[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    if (char && !/^[A-Z]$/.test(char)) return;

    const newGrid = grid.map((row, rowIdx) =>
      row.map((cell, colIdx) => (rowIdx === r && colIdx === c ? char : cell))
    );
    setGrid(newGrid);

    if (char && c < 4) {
      setSelectedCell([r, c + 1]);
    } else if (char && c === 4 && r < 4) {
      setSelectedCell([r + 1, 0]);
    }

    if (checkSolution(newGrid)) {
      setIsSolved(true);
      setTimerActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Backspace' && !grid[r][c] && c > 0) {
      setSelectedCell([r, c - 1]);
    } else if (e.key === 'ArrowRight' && c < 4) {
      setSelectedCell([r, c + 1]);
    } else if (e.key === 'ArrowLeft' && c > 0) {
      setSelectedCell([r, c - 1]);
    } else if (e.key === 'ArrowDown' && r < 4) {
      setSelectedCell([r + 1, c]);
    } else if (e.key === 'ArrowUp' && r > 0) {
      setSelectedCell([r - 1, c]);
    }
  };

  const handleReveal = () => {
    setGrid(SOLUTION);
    setIsSolved(true);
    setTimerActive(false);
  };

  const handleReset = () => {
    setGrid([
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ]);
    setSelectedCell([0, 0]);
    setSeconds(0);
    setIsSolved(false);
    setTimerActive(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="bg-white border border-[#121212] p-4 rounded my-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2] mb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#326891] font-nyt-sans block">
            NYT Games
          </span>
          <h3 className="font-nyt-headline font-bold text-[17px] text-black">
            The Mini Crossword
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[12px] font-mono font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
            {formatTime(seconds)}
          </div>
          <button
            onClick={handleReset}
            title="Reset Grid"
            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isSolved && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[12px] font-nyt-sans flex items-center justify-between mb-3 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Puzzle Complete!</span> Finished in {formatTime(seconds)}.
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-emerald-900 underline cursor-pointer"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Grid and Clues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* 5x5 Crossword Board */}
        <div className="flex justify-center">
          <div className="grid grid-cols-5 gap-0.5 bg-black p-0.5 w-[220px] h-[220px]">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selectedCell[0] === r && selectedCell[1] === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => setSelectedCell([r, c])}
                    className={`relative bg-white flex items-center justify-center font-bold text-[18px] font-nyt-sans select-none cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-100 ring-2 ring-blue-500 z-10' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Clue numbering */}
                    {(r === 0 && c === 0 && <span className="absolute top-0.5 left-0.5 text-[8px] text-gray-400 font-sans leading-none">1</span>)}
                    {(r === 1 && c === 0 && <span className="absolute top-0.5 left-0.5 text-[8px] text-gray-400 font-sans leading-none">6</span>)}
                    {(r === 2 && c === 0 && <span className="absolute top-0.5 left-0.5 text-[8px] text-gray-400 font-sans leading-none">7</span>)}
                    {(r === 3 && c === 0 && <span className="absolute top-0.5 left-0.5 text-[8px] text-gray-400 font-sans leading-none">8</span>)}
                    {(r === 4 && c === 0 && <span className="absolute top-0.5 left-0.5 text-[8px] text-gray-400 font-sans leading-none">9</span>)}

                    <input
                      type="text"
                      maxLength={1}
                      value={cell}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className="w-full h-full text-center font-bold text-[18px] uppercase bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues Pane */}
        <div className="space-y-3 text-[11.5px] font-nyt-sans">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-0.5 mb-1.5 text-[10px]">
              Across
            </h4>
            <div className="space-y-1">
              {CLUES_ACROSS.map((clue) => (
                <div key={clue.num} className="leading-tight">
                  <span className="font-bold text-black mr-1">{clue.num}.</span>
                  <span className="text-gray-700">{clue.clue}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-0.5 mb-1.5 text-[10px]">
              Down
            </h4>
            <div className="space-y-1">
              {CLUES_DOWN.map((clue) => (
                <div key={clue.num} className="leading-tight">
                  <span className="font-bold text-black mr-1">{clue.num}.</span>
                  <span className="text-gray-700">{clue.clue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-[10.5px]">
            <button
              onClick={handleReveal}
              className="text-[#326891] hover:underline font-semibold cursor-pointer"
            >
              Reveal Puzzle
            </button>
            <span className="text-gray-400">Edited by Joel Fagliano</span>
          </div>
        </div>
      </div>
    </div>
  );
};
