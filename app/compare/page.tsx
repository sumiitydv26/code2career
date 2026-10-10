"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompare, Sparkles, Check, Layers, AlertCircle, Loader2 } from "lucide-react";
import { generateRoadmap } from "@/lib/api";
import { Roadmap, RoadmapNode } from "@/lib/schema";
import { CLIMATE_TECH_ROADMAP } from "@/lib/mock";

export default function ComparePage() {
  const [goalA, setGoalA] = useState("Full Stack Developer at a climate tech startup");
  const [goalB, setGoalB] = useState("AI Infrastructure Engineer at an autonomous robotics lab");

  const [roadmapA, setRoadmapA] = useState<Roadmap | null>(CLIMATE_TECH_ROADMAP);
  const [roadmapB, setRoadmapB] = useState<Roadmap | null>(null);

  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  const handleFetchA = async () => {
    if (!goalA.trim()) return;
    try {
      setLoadingA(true);
      setErrorA(null);
      const res = await generateRoadmap({ goal: goalA.trim() });
      setRoadmapA(res);
    } catch (err: unknown) {
      setErrorA(err instanceof Error ? err.message : "Failed to load path A");
    } finally {
      setLoadingA(false);
    }
  };

  const handleFetchB = async () => {
    if (!goalB.trim()) return;
    try {
      setLoadingB(true);
      setErrorB(null);
      const res = await generateRoadmap({ goal: goalB.trim() });
      setRoadmapB(res);
    } catch (err: unknown) {
      setErrorB(err instanceof Error ? err.message : "Failed to load path B");
    } finally {
      setLoadingB(false);
    }
  };

  // Compute overlapping skill titles
  const overlapTitles = React.useMemo(() => {
    if (!roadmapA || !roadmapB) return new Set<string>();

    const normalize = (t: string) =>
      t.toLowerCase().replace(/[^a-z0-9]/g, "");

    const titlesA = new Set(roadmapA.nodes.map((n) => normalize(n.title)));
    const matching = new Set<string>();

    roadmapB.nodes.forEach((n) => {
      const normB = normalize(n.title);
      // Check for substring or exact match
      for (const tA of titlesA) {
        if (tA === normB || (tA.length > 5 && normB.includes(tA)) || (normB.length > 5 && tA.includes(normB))) {
          matching.add(n.title.toLowerCase());
          break;
        }
      }
    });

    return matching;
  }, [roadmapA, roadmapB]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/roadmap"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Back to roadmap"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                <GitCompare className="w-3.5 h-3.5" />
                <span>Roadmap Comparison</span>
              </div>
              <h1 className="text-sm font-bold text-white">Compare Two Career Pathways</h1>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {overlapTitles.size > 0 ? (
              <span className="text-emerald-400 font-bold">
                {overlapTitles.size} Overlapping Skill Foundations Found
              </span>
            ) : (
              "Generate both paths to discover shared skills"
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column A */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Path A Goal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={goalA}
                  onChange={(e) => setGoalA(e.target.value)}
                  placeholder="e.g. Full Stack Developer..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleFetchA}
                  disabled={loadingA}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loadingA ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {errorA && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {errorA}
              </div>
            )}

            {roadmapA && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-white truncate max-w-[200px]">{roadmapA.goal}</span>
                  <span className="font-mono text-sky-400">{roadmapA.nodes.length} Nodes</span>
                </div>

                <div className="space-y-2">
                  {roadmapA.nodes.map((node) => {
                    const isOverlap = overlapTitles.has(node.title.toLowerCase());
                    return (
                      <div
                        key={node.id}
                        className={`p-3 rounded-xl border transition ${
                          isOverlap
                            ? "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                            : "bg-slate-950/50 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-semibold ${isOverlap ? "text-emerald-300" : "text-slate-200"}`}>
                            {node.title}
                          </span>
                          {isOverlap && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                              Shared Skill ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                          <span className="capitalize">{node.type}</span>
                          <span>•</span>
                          <span>{node.estHours}h</span>
                          <span>•</span>
                          <span>+{node.xp} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Column B */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider block">
                Path B Goal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={goalB}
                  onChange={(e) => setGoalB(e.target.value)}
                  placeholder="e.g. AI Infrastructure Engineer..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                />
                <button
                  type="button"
                  onClick={handleFetchB}
                  disabled={loadingB}
                  className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loadingB ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {errorB && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {errorB}
              </div>
            )}

            {!roadmapB && !loadingB && (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2 text-slate-500">
                <Layers className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Click Generate on Path B to see the comparative breakdown</p>
              </div>
            )}

            {roadmapB && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-white truncate max-w-[200px]">{roadmapB.goal}</span>
                  <span className="font-mono text-fuchsia-400">{roadmapB.nodes.length} Nodes</span>
                </div>

                <div className="space-y-2">
                  {roadmapB.nodes.map((node) => {
                    const isOverlap = overlapTitles.has(node.title.toLowerCase());
                    return (
                      <div
                        key={node.id}
                        className={`p-3 rounded-xl border transition ${
                          isOverlap
                            ? "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                            : "bg-slate-950/50 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-semibold ${isOverlap ? "text-emerald-300" : "text-slate-200"}`}>
                            {node.title}
                          </span>
                          {isOverlap && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                              Shared Skill ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                          <span className="capitalize">{node.type}</span>
                          <span>•</span>
                          <span>{node.estHours}h</span>
                          <span>•</span>
                          <span>+{node.xp} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
