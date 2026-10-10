"use client";

import React, { useState } from "react";
import { useQuestStore, HubTab } from "@/store/useQuestStore";
import { XpBar } from "./XpBar";
import { StreakBadge } from "./StreakBadge";
import { ExportButton } from "./ExportButton";
import { STUDENT_QUEST_PRESETS } from "@/lib/mock";
import { getSorcererForGoal } from "@/lib/sorcerer";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Star,
  Map as MapIcon,
  GitFork,
  Trophy,
  GitCompare,
  Rocket,
} from "lucide-react";

export function HudBar() {
  const {
    goal,
    roadmap,
    nodeStars,
    xp,
    streak,
    activeHubTab,
    setActiveHubTab,
    setRoadmap,
    resetQuest,
  } = useQuestStore();

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const sorcerer = getSorcererForGoal(goal);
  const totalEarnedStars = Object.values(nodeStars).reduce((sum, s) => sum + s, 0);
  const maxPossibleStars = roadmap.nodes.length * 3;

  const navButtons: Array<{
    id: HubTab;
    label: string;
    emoji: string;
    activeGradient: string;
  }> = [
    {
      id: "saga",
      label: "Candy Saga Route",
      emoji: "🗺️",
      activeGradient: "from-amber-400 via-yellow-500 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]",
    },
    {
      id: "sorcerer",
      label: "Sorcerer Mentor",
      emoji: sorcerer.avatarIcon,
      activeGradient: "from-sky-400 via-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.5)]",
    },
    {
      id: "forge",
      label: "Launch Career Quests",
      emoji: "🎯",
      activeGradient: "from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      emoji: "🏆",
      activeGradient: "from-yellow-300 via-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    },
    {
      id: "compare",
      label: "Compare Paths",
      emoji: "⚖️",
      activeGradient: "from-fuchsia-400 via-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]",
    },
    {
      id: "graph",
      label: "Skill Tree",
      emoji: "🕸️",
      activeGradient: "from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Row 1: Brand, Quick Student Career Switcher Pills, and Player Stats */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Left: Brand & Active Career Goal */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setActiveHubTab("saga")}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
                Career Quest All-In-One Arena
              </span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                Guide: {sorcerer.name}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[220px] sm:max-w-md">
              {goal}
            </h1>
          </div>
        </div>

        {/* Center Quick Student Career Switcher Pills */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-2">
            Student Paths:
          </span>
          {STUDENT_QUEST_PRESETS.map((preset) => {
            const isSelected = preset.roadmap.goal.toLowerCase() === goal.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setRoadmap(preset.roadmap)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-sky-500 text-slate-950 font-black shadow"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                title={`Switch to ${preset.studentName}: ${preset.roadmap.goal}`}
              >
                <span>{preset.studentAvatar}</span>
                <span>{preset.studentName.split("'")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right: XP Bar, Stars, Streak, Reset */}
        <div className="flex items-center gap-2.5 ml-auto">
          <XpBar xp={xp} />

          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 font-mono text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            title={`${totalEarnedStars} of ${maxPossibleStars} Candy Saga Stars Earned`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>
              {totalEarnedStars}/{maxPossibleStars}
            </span>
          </div>

          <StreakBadge count={streak.count} />

          {showConfirmReset ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  resetQuest();
                  setShowConfirmReset(false);
                }}
                className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition"
              title="Reset Current Quest Progress"
              aria-label="Reset Current Quest Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Gamified 3D Command Deck Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {navButtons.map((btn) => {
            const isActive = activeHubTab === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveHubTab(btn.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black tracking-wide transition-all transform active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer border-2 ${
                  isActive
                    ? `bg-gradient-to-r ${btn.activeGradient} border-white/60 scale-[1.02]`
                    : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600"
                }`}
              >
                <span className="text-base leading-none">{btn.emoji}</span>
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ExportButton
            targetId={activeHubTab === "graph" ? "roadmap-flow-container" : "unified-stage-container"}
            fileName={`${goal.replace(/\s+/g, "-").toLowerCase()}-quest.png`}
          />
        </div>
      </div>
    </header>
  );
}
