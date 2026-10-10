"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, SlidersHorizontal, ArrowRight, Loader2, Compass, AlertCircle } from "lucide-react";
import { useQuestStore } from "@/store/useQuestStore";
import { generateRoadmap } from "@/lib/api";

const EXAMPLE_GOALS = [
  "Full Stack Developer at a climate tech startup",
  "AI Research Engineer working on Large Multimodal Models",
  "Staff Security Engineer at a high-growth Fintech unicorn",
  "Autonomous Robotics Software Lead building humanoid bots",
];

const ROTATING_MESSAGES = [
  "Mapping essential foundation skills...",
  "Synthesizing industry requirements...",
  "Finding stepping-stone roles & projects...",
  "Architecting progression dependencies...",
  "Calibrating XP and milestone difficulties...",
  "Placing the final dream job boss node...",
];

export function GoalForm() {
  const router = useRouter();
  const { goal, setGoal, constraints, setConstraints, setRoadmap } = useQuestStore();

  const [inputVal, setInputVal] = useState(goal);
  const [showLimits, setShowLimits] = useState(false);
  const [hours, setHours] = useState(constraints.hoursPerWeek || 10);
  const [months, setMonths] = useState(constraints.months || 6);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % ROTATING_MESSAGES.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();

    if (!trimmed || trimmed.length < 5) {
      setErrorMsg("Goal must be at least 5 characters (e.g. 'Frontend Engineer at Stripe').");
      return;
    }
    if (trimmed.length > 150) {
      setErrorMsg("Goal is too long (maximum 150 characters).");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStepIdx(0);

    try {
      setGoal(trimmed);
      setConstraints({ hoursPerWeek: hours, months });

      const newRoadmap = await generateRoadmap({
        goal: trimmed,
        hoursPerWeek: hours,
        months,
      });

      setRoadmap(newRoadmap);
      router.push("/roadmap");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate roadmap";
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    setInputVal(chipText);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input box */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          <div className="relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 gap-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Compass className="w-6 h-6 text-sky-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                disabled={isLoading}
                placeholder="e.g. Full Stack Developer at a climate tech startup"
                className="w-full bg-transparent text-white placeholder-slate-400 text-base sm:text-lg focus:outline-none"
                aria-label="Enter your specific dream job goal"
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? "goal-error-msg" : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-98 transition shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span className="whitespace-nowrap">Generate Quest</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation error display */}
        {errorMsg && (
          <div
            id="goal-error-msg"
            role="alert"
            aria-live="assertive"
            className="flex items-center gap-2 text-sm text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl px-4 py-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Rotating Progress Message during generation */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="p-5 rounded-xl border border-sky-500/30 bg-sky-950/20 backdrop-blur text-center space-y-2 animate-pulse"
          >
            <div className="flex items-center justify-center gap-2 text-sky-400 font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{ROTATING_MESSAGES[loadingStepIdx]}</span>
            </div>
            <p className="text-xs text-slate-400">
              Synthesizing RPG skill nodes, prerequisite graphs, and boss challenges...
            </p>
          </div>
        )}

        {/* Example goal chips */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Inspiring Quest Ideas:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_GOALS.map((eg) => (
              <button
                key={eg}
                type="button"
                onClick={() => handleChipClick(eg)}
                disabled={isLoading}
                className="text-xs text-left px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-750 border border-slate-700 hover:border-sky-500/50 text-slate-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {eg}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Limits */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowLimits(!showLimits)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-expanded={showLimits}
          >
            <span className="flex items-center gap-2 font-medium">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              Customize Quest Limits (Time & Pace)
            </span>
            <span className="text-xs text-slate-500">
              {showLimits ? "Hide" : "Show"} ({hours} hrs/wk, {months} mo)
            </span>
          </button>

          {showLimits && (
            <div className="p-4 pt-2 border-t border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Commitment per week</span>
                  <span className="text-sky-400 font-semibold">{hours} hours / week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  aria-label="Commitment hours per week"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2 hrs (Casual)</span>
                  <span>20 hrs (Part-time)</span>
                  <span>40 hrs (Full-time)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Timeframe</span>
                  <span className="text-indigo-400 font-semibold">{months} months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  aria-label="Target timeframe in months"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 month (Sprint)</span>
                  <span>6 months (Standard)</span>
                  <span>24 months (Mastery)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Disclaimer Notice */}
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
          <span>Roadmaps are AI-generated. Verify details before relying on them.</span>
        </p>
      </form>
    </div>
  );
}
