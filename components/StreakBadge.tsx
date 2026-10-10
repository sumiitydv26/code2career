import React from "react";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  const isActive = count > 0;

  return (
    <div
      title={isActive ? `${count}-day study streak! Keep the momentum burning.` : "Start completing nodes to ignite your study streak!"}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
        isActive
          ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          : "bg-slate-800/60 border-slate-750 text-slate-400"
      }`}
    >
      <Flame
        className={`w-4 h-4 ${
          isActive ? "text-amber-400 fill-amber-400/30 animate-pulse" : "text-slate-500"
        }`}
        aria-hidden="true"
      />
      <span>
        {count} {count === 1 ? "day streak" : "days streak"}
      </span>
    </div>
  );
}
