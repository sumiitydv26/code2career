"use client";

import React, { useState, useMemo } from "react";
import { STUDENT_QUEST_PRESETS, CLIMATE_TECH_ROADMAP, CYBERSECURITY_ROADMAP } from "@/lib/mock";
import { getSorcererForGoal } from "@/lib/sorcerer";
import { Roadmap } from "@/lib/schema";
import { useQuestStore } from "@/store/useQuestStore";
import { GitCompare, Sparkles, CheckCircle2, ArrowRight, Clock, Zap } from "lucide-react";
import { ThemedViewBackground } from "./ThemedViewBackground";

export function CompareArenaView() {
  const { setRoadmap, setActiveHubTab } = useQuestStore();
  const [scrollY, setScrollY] = useState(0);

  const [roadmapA, setRoadmapA] = useState<Roadmap>(CLIMATE_TECH_ROADMAP);
  const [roadmapB, setRoadmapB] = useState<Roadmap>(CYBERSECURITY_ROADMAP);

  const overlapTitles = useMemo(() => {
    const normalize = (t: string) =>
      t
        .toLowerCase()
        .replace(/project:|role:/g, "")
        .replace(/[^a-z0-9]/g, "");

    const setA = new Set(roadmapA.nodes.map((n) => normalize(n.title)));
    const shared = new Set<string>();

    roadmapB.nodes.forEach((n) => {
      const normB = normalize(n.title);
      for (const normA of setA) {
        if (
          normA === normB ||
          (normA.length > 6 && normB.includes(normA)) ||
          (normB.length > 6 && normA.includes(normB))
        ) {
          shared.add(normB);
          break;
        }
      }
    });

    return shared;
  }, [roadmapA, roadmapB]);

  const isNodeShared = (title: string) => {
    const norm = title
      .toLowerCase()
      .replace(/project:|role:/g, "")
      .replace(/[^a-z0-9]/g, "");
    for (const s of overlapTitles) {
      if (norm === s || norm.includes(s) || s.includes(norm)) return true;
    }
    return false;
  };

  const mentorA = getSorcererForGoal(roadmapA.goal);
  const mentorB = getSorcererForGoal(roadmapB.goal);

  const xpA = roadmapA.nodes.reduce((s, n) => s + n.xp, 0);
  const xpB = roadmapB.nodes.reduce((s, n) => s + n.xp, 0);
  const hoursA = roadmapA.nodes.reduce((s, n) => s + n.estHours, 0);
  const hoursB = roadmapB.nodes.reduce((s, n) => s + n.estHours, 0);

  return (
    <div
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      className="relative w-full h-full overflow-y-auto bg-transparent p-4 sm:p-8 scroll-smooth"
    >
      <ThemedViewBackground variant="compare" scrollY={scrollY} />
      <div className="relative z-10 max-w-6xl mx-auto space-y-8 pb-20">
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border-2 border-indigo-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <GitCompare className="w-4 h-4" />
              <span>Dual Career Comparison Arena</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Compare Two Career Roadmaps Side-by-Side
            </h2>
            <p className="text-xs text-slate-300">
              Discover transferable skills, compare XP & time investments, and see how different student paths overlap.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center shrink-0">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              Transferable Skill Overlap
            </div>
            <div className="text-xl font-black text-white font-mono">
              {overlapTitles.size} Shared Milestones
            </div>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column A */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Career Path A
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRoadmap(roadmapA);
                    setActiveHubTab("saga");
                  }}
                  className="px-3 py-1 rounded-xl bg-sky-500 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Play Path A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {STUDENT_QUEST_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setRoadmapA(p.roadmap)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      roadmapA.goal === p.roadmap.goal
                        ? "bg-sky-400 text-slate-950"
                        : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {p.studentAvatar} {p.studentName}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-black text-white">{roadmapA.goal}</div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{mentorA.avatarIcon} {mentorA.name}</span>
                  <span className="text-amber-400 font-bold">{xpA} XP • {hoursA}h</span>
                </div>
              </div>
            </div>

            {/* Nodes List A */}
            <div className="space-y-2">
              {roadmapA.nodes.map((node, i) => {
                const shared = isNodeShared(node.title);
                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      shared
                        ? "bg-emerald-950/25 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-[11px] font-black text-sky-400">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{node.title}</span>
                      </div>
                      {shared && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                          Shared Skill ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 pl-8 text-[11px] text-slate-400 font-mono">
                      <span className="uppercase">{node.type}</span>
                      <span>•</span>
                      <span>{node.estHours}h</span>
                      <span>•</span>
                      <span className="text-amber-400">+{node.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-fuchsia-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-fuchsia-400">
                  Career Path B
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRoadmap(roadmapB);
                    setActiveHubTab("saga");
                  }}
                  className="px-3 py-1 rounded-xl bg-fuchsia-500 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Play Path B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {STUDENT_QUEST_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setRoadmapB(p.roadmap)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      roadmapB.goal === p.roadmap.goal
                        ? "bg-fuchsia-400 text-slate-950"
                        : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {p.studentAvatar} {p.studentName}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-black text-white">{roadmapB.goal}</div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{mentorB.avatarIcon} {mentorB.name}</span>
                  <span className="text-amber-400 font-bold">{xpB} XP • {hoursB}h</span>
                </div>
              </div>
            </div>

            {/* Nodes List B */}
            <div className="space-y-2">
              {roadmapB.nodes.map((node, i) => {
                const shared = isNodeShared(node.title);
                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      shared
                        ? "bg-emerald-950/25 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-[11px] font-black text-fuchsia-400">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{node.title}</span>
                      </div>
                      {shared && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                          Shared Skill ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 pl-8 text-[11px] text-slate-400 font-mono">
                      <span className="uppercase">{node.type}</span>
                      <span>•</span>
                      <span>{node.estHours}h</span>
                      <span>•</span>
                      <span className="text-amber-400">+{node.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
