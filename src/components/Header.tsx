import React from "react";
import { Sparkles, RefreshCw, Compass, BookOpen, User } from "lucide-react";

interface HeaderProps {
  sceneCount: number;
  onReset: () => void;
  settingName: string;
  artStyleName: string;
  characterDesc: string;
  isGameStarted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  sceneCount,
  onReset,
  settingName,
  artStyleName,
  characterDesc,
  isGameStarted,
}) => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-40 select-none">
      {/* Brand logo & status */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 border border-zinc-700 flex items-center justify-center relative text-amber-500">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-zinc-500" />
          <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-zinc-500" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] font-display text-zinc-100 uppercase flex items-center gap-2">
            Odyssey CYOA Engine
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
            {isGameStarted ? `${settingName} / ${artStyleName}` : "Choose-Your-Own-Adventure"}
          </p>
        </div>
      </div>

      {/* Game Details & Active Stats */}
      {isGameStarted && (
        <div className="flex items-center gap-3 ml-auto">
          {/* Turn/Chapter tracker */}
          <div className="bg-zinc-900 border border-zinc-805 px-3 py-1.5 rounded-sm flex items-center gap-2 text-[10px] font-mono">
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500 uppercase">Chapter:</span>
            <span className="text-amber-500 font-bold">{sceneCount}</span>
          </div>

          {/* Reset Switch */}
          <button
            onClick={onReset}
            id="reset_game_btn"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-sm text-[10px] uppercase font-mono font-bold tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>New Journey</span>
          </button>
        </div>
      )}
    </header>
  );
};
