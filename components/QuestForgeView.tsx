"use client";

import React, { useState } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { STUDENT_QUEST_PRESETS } from "@/lib/mock";
import { getSorcererForGoal } from "@/lib/sorcerer";
import { generateRoadmap } from "@/lib/api";
import { ThemedViewBackground } from "./ThemedViewBackground";
import {
  Sparkles,
  Compass,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export function QuestForgeView() {
  const { goal, setRoadmap, setActiveHubTab, constraints, setConstraints } = useQuestStore();

  const [scrollY, setScrollY] = useState(0);
  const [customGoal, setCustomGoal] = useState(goal);
  const [hours, setHours] = useState(constraints.hoursPerWeek || 12);
  const [months, setMonths] = useState(constraints.months || 6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (presetRoadmap: (typeof STUDENT_QUEST_PRESETS)[0]["roadmap"]) => {
    setRoadmap(presetRoadmap);
    setActiveHubTab("saga");
  };

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customGoal.trim();
    if (trimmed.length < 5) {
      setErrorMsg("Please enter a career goal with at least 5 characters.");
      return;
    }
    if (trimmed.length > 150) {
      setErrorMsg("Goal must be under 150 characters.");
      return;
    }

    try {
      setErrorMsg(null);
      setIsGenerating(true);
      setConstraints({ hoursPerWeek: hours, months });
      const res = await generateRoadmap({
        goal: trimmed,
        hoursPerWeek: hours,
        months,
      });
      setRoadmap(res);
      setActiveHubTab("saga");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate custom quest");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      className="relative w-full h-full overflow-y-auto p-4 sm:p-8"
    >
      {/* Dynamic Cyber-Smithy & Hexagonal Blueprint Nexus Background */}
      <ThemedViewBackground variant="forge" scrollY={scrollY} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10 pb-20">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Compass className="w-3.5 h-3.5" />
            <span>Career Quest Forge • Choose Your Destiny</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
            Select a Student Career Path or{" "}
            <span className="bg-gradient-to-r from-amber-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
              Forge Your Own
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-200">
            Every career quest pairs you with a working-professional Sorcerer in that exact industry and builds a Candy Crush-style level trail to hireability.
          </p>
        </div>

        {/* Section 1: 5 Featured Student Career Quests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>5 Featured Student Career Quests (Instant Launch)</span>
            </h3>
            <span className="text-xs text-slate-300">
              Each path includes its own Working-Pro Sorcerer & Saga Levels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STUDENT_QUEST_PRESETS.map((preset, idx) => {
              const isCurrent = preset.roadmap.goal.toLowerCase() === goal.toLowerCase();
              const mentor = getSorcererForGoal(preset.roadmap.goal);
              const totalXp = preset.roadmap.nodes.reduce((s, n) => s + n.xp, 0);
              const totalHours = preset.roadmap.nodes.reduce((s, n) => s + n.estHours, 0);

              return (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-3xl p-5 border-2 flex flex-col justify-between transition-all backdrop-blur-xl ${
                    isCurrent
                      ? "bg-slate-900/90 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)]"
                      : "bg-slate-900/80 border-slate-700/80 hover:border-emerald-400/60 shadow-xl"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Student Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-xl shadow">
                          {preset.studentAvatar}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                            {preset.studentName}
                          </span>
                          <span className="text-xs font-extrabold text-white">
                            {preset.studentTagline}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Goal Title */}
                    <div className="p-3 rounded-2xl bg-slate-950/85 border border-slate-800/90">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        Target Dream Role:
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {preset.roadmap.goal}
                      </div>
                    </div>

                    {/* Assigned Working-Pro Sorcerer */}
                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center gap-3">
                      <span className="text-2xl shrink-0">{mentor.avatarIcon}</span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase text-indigo-300">
                          Assigned Sorcerer Guide:
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {mentor.name}
                        </div>
                        <div className="text-[11px] text-slate-300 truncate">
                          {mentor.title} • {mentor.company}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center font-mono pt-1">
                      <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                        <div className="text-[10px] text-slate-400">LEVELS</div>
                        <div className="text-xs font-bold text-white">
                          {preset.roadmap.nodes.length} Stages
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                        <div className="text-[10px] text-slate-400">REWARD</div>
                        <div className="text-xs font-bold text-amber-400">+{totalXp} XP</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                        <div className="text-[10px] text-slate-400">EST. TIME</div>
                        <div className="text-xs font-bold text-sky-300">{totalHours}h</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset(preset.roadmap)}
                    className={`mt-5 w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                      isCurrent
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950"
                        : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white"
                    }`}
                  >
                    <span>
                      {isCurrent ? "Continue This Saga Trail" : "Launch This Career Quest"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Custom AI Career Goal Generator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Custom AI Career Quest Generator</span>
            </h3>
            <p className="text-xs text-slate-300">
              Have a unique dream job in mind? Enter it below and our AI will craft a custom Candy Saga route and summon a matching industry Sorcerer.
            </p>
          </div>

          <form onSubmit={handleGenerateCustom} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => {
                  setCustomGoal(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="e.g. Full Stack Developer at a climate tech startup..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Summoning Route...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Custom Saga</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-700 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Weekly Study Pace</span>
                  <span className="text-sky-400 font-mono font-bold">{hours} hrs / week</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Target Horizon</span>
                  <span className="text-amber-400 font-mono font-bold">{months} months</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
