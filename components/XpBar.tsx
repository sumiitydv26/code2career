import React from "react";
import { getLevelProgress, calculateRank } from "@/lib/game";
import { Shield, Sparkles } from "lucide-react";

interface XpBarProps {
  xp: number;
}

export function XpBar({ xp }: XpBarProps) {
  const { currentLevel, nextLevelXp, levelXpStart, progressPercent } = getLevelProgress(xp);
  const rank = calculateRank(currentLevel);

  const rankColor =
    currentLevel >= 7
      ? "from-amber-400 to-rose-500 border-amber-400/60 text-amber-200"
      : currentLevel >= 5
      ? "from-purple-400 to-indigo-500 border-purple-400/60 text-purple-200"
      : currentLevel >= 3
      ? "from-sky-400 to-blue-500 border-sky-400/60 text-sky-200"
      : "from-emerald-400 to-teal-500 border-emerald-400/60 text-emerald-200";

  return (
    <div className="flex items-center gap-3 w-full max-w-xs sm:max-w-sm">
      {/* Rank / Level Badge */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-gradient-to-r ${rankColor} bg-opacity-10 backdrop-blur shrink-0 shadow-sm`}
        title={`Rank: ${rank} (Level ${currentLevel})`}
      >
        <Shield className="w-3.5 h-3.5" aria-hidden="true" />
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold font-mono">Lv.{currentLevel}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 hidden sm:inline">
            {rank}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span className="text-white font-semibold">{xp}</span> XP
          </span>
          <span className="text-[10px] text-slate-500">
            Next: {nextLevelXp} XP
          </span>
        </div>
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Level progress: ${progressPercent}%`}
          />
        </div>
      </div>
    </div>
  );
}
