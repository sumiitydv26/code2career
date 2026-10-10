import React from "react";

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading node advice">
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-5/6" />
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
        <div className="h-5 bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-2/3" />
          <div className="h-3 bg-slate-800 rounded w-4/5" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 gap-2">
          <div className="h-12 bg-slate-850 rounded-lg border border-slate-800" />
          <div className="h-12 bg-slate-850 rounded-lg border border-slate-800" />
          <div className="h-12 bg-slate-850 rounded-lg border border-slate-800" />
        </div>
      </div>
    </div>
  );
}
