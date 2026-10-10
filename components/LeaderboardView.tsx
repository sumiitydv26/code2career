"use client";

import React, { useState, useMemo } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { INITIAL_LEADERBOARD, LeaderboardEntry, getSorcererForGoal } from "@/lib/sorcerer";
import { STUDENT_QUEST_PRESETS } from "@/lib/mock";
import { calculateLevel, calculateRank } from "@/lib/game";
import { ThemedViewBackground } from "./ThemedViewBackground";
import {
  Trophy,
  Star,
  Sparkles,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

export function LeaderboardView() {
  const {
    playerName,
    setPlayerName,
    goal,
    xp,
    nodeStars,
    nodeStatus,
    streak,
    setRoadmap,
    setActiveHubTab,
  } = useQuestStore();

  const [scrollY, setScrollY] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const userStars = Object.values(nodeStars).reduce((a, b) => a + b, 0);
  const userCleared = Object.values(nodeStatus).filter(
    (s) => s === "completed" || s === "known"
  ).length;

  const currentSorcerer = getSorcererForGoal(goal);

  const combinedLeaderboard = useMemo(() => {
    const userEntry: LeaderboardEntry = {
      id: "current-user",
      studentName: playerName || "You (Apprentice)",
      avatar: "🧙‍♂️",
      university: "Your Quest Academy",
      careerGoal: goal,
      domainId: (currentSorcerer.domainId as LeaderboardEntry["domainId"]) || "climate",
      xp: xp,
      stars: userStars,
      levelsCleared: userCleared,
      streak: streak.count,
      isCurrentUser: true,
    };

    const list = [...INITIAL_LEADERBOARD, userEntry];
    const filtered =
      selectedDomain === "all"
        ? list
        : list.filter((item) => item.domainId === selectedDomain);

    return filtered.sort((a, b) => b.xp - a.xp);
  }, [playerName, goal, xp, userStars, userCleared, streak.count, selectedDomain, currentSorcerer.domainId]);

  const careerGoalStandings = useMemo(() => {
    return STUDENT_QUEST_PRESETS.map((preset) => {
      const matchingStudents = combinedLeaderboard.filter(
        (s) => s.domainId === preset.id
      );
      const totalDomainXp = matchingStudents.reduce((sum, s) => sum + s.xp, 0);
      const totalDomainStars = matchingStudents.reduce((sum, s) => sum + s.stars, 0);
      const topChampion = [...matchingStudents].sort((a, b) => b.xp - a.xp)[0];

      return {
        preset,
        totalDomainXp,
        totalDomainStars,
        studentCount: matchingStudents.length,
        topChampion,
      };
    }).sort((a, b) => b.totalDomainXp - a.totalDomainXp);
  }, [combinedLeaderboard]);

  const topThree = combinedLeaderboard.slice(0, 3);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
    setEditingName(false);
  };

  return (
    <div
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      className="relative w-full h-full overflow-y-auto p-4 sm:p-8"
    >
      {/* Dynamic Golden Coliseum & Victory Spotlights Background */}
      <ThemedViewBackground variant="leaderboard" scrollY={scrollY} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8 pb-20">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border-2 border-amber-400/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>Hall of Champions & Career Scoreboard</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Global Student Career Leaderboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                Compare XP, Candy Saga Stars, and Level Mastery across different student career quests. Qualify more levels on the Saga Trail to climb the ranks!
              </p>
            </div>

            {/* Player Identity Card */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-sky-400/50 flex flex-col gap-2 shrink-0 min-w-[240px]">
              <div className="flex items-center justify-between text-[11px] text-sky-400 font-bold uppercase">
                <span>Your Challenger Profile</span>
                <button
                  onClick={() => setEditingName(!editingName)}
                  className="underline hover:text-white cursor-pointer"
                >
                  {editingName ? "Cancel" : "Edit Name"}
                </button>
              </div>

              {editingName ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white flex-1"
                    placeholder="Enter your name..."
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2.5 py-1 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-base font-black text-white flex items-center gap-2">
                  <span>🧙‍♂️ {playerName}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs font-mono pt-1 border-t border-slate-800">
                <span className="text-amber-400 font-bold">{xp} XP</span>
                <span>•</span>
                <span className="text-yellow-300 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {userStars}
                </span>
                <span>•</span>
                <span className="text-emerald-400">{userCleared} Levels</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Scoreboard by Career Goal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Scoreboard by Career Goal (Guild Standings)</span>
            </h3>
            <span className="text-xs text-slate-300">
              Click any career guild to switch or filter
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {careerGoalStandings.map((item, idx) => (
              <div
                key={item.preset.id}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all flex flex-col justify-between ${
                  selectedDomain === item.preset.id
                    ? "bg-slate-900/95 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                    : "bg-slate-900/80 border-slate-700/80 hover:border-amber-400/50 shadow-xl"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{item.preset.studentAvatar}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      Guild #{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white line-clamp-2 leading-snug">
                    {item.preset.studentTagline}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                    {item.preset.roadmap.goal}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Total Guild XP:</span>
                    <span className="text-amber-400 font-bold">{item.totalDomainXp} XP</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Total Stars:</span>
                    <span className="text-yellow-300 font-bold">⭐ {item.totalDomainStars}</span>
                  </div>
                  {item.topChampion && (
                    <div className="text-[10px] text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-500/40 truncate">
                      👑 Top: {item.topChampion.studentName}
                    </div>
                  )}

                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDomain(
                          selectedDomain === item.preset.id ? "all" : item.preset.id
                        )
                      }
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      {selectedDomain === item.preset.id ? "Show All" : "Filter"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRoadmap(item.preset.roadmap);
                        setActiveHubTab("saga");
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-[10px] font-bold text-white flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <span>Play</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {topThree.map((champ, index) => {
            const rankOrder = index + 1;
            const lv = calculateLevel(champ.xp);
            const rankTitle = calculateRank(lv);

            const podiumStyles =
              rankOrder === 1
                ? "border-amber-400 bg-slate-900/90 shadow-[0_0_30px_rgba(245,158,11,0.35)]"
                : rankOrder === 2
                ? "border-slate-300/70 bg-slate-900/85"
                : "border-amber-700/70 bg-slate-900/85";

            return (
              <motion.div
                key={champ.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-3xl border-2 backdrop-blur-xl relative overflow-hidden ${podiumStyles}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center text-2xl shadow-lg">
                      {champ.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white">
                          {champ.studentName}
                        </span>
                        {champ.isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-500 text-slate-950 text-[9px] font-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300">{champ.university}</p>
                    </div>
                  </div>

                  <div className="text-2xl font-black">
                    {rankOrder === 1 ? "🥇" : rankOrder === 2 ? "🥈" : "🥉"}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-sky-300 font-medium line-clamp-1 mb-3">
                  🎯 {champ.careerGoal}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                    <div className="text-[10px] text-slate-400">SCORE</div>
                    <div className="text-xs font-bold text-amber-400">{champ.xp} XP</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                    <div className="text-[10px] text-slate-400">STARS</div>
                    <div className="text-xs font-bold text-yellow-300">⭐ {champ.stars}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/75 border border-slate-800">
                    <div className="text-[10px] text-slate-400">RANK</div>
                    <div className="text-xs font-bold text-emerald-400">
                      Lv.{lv} {rankTitle}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section 3: Filter Bar & Complete Rankings Table */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filter by Career Path:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All Careers (Global)" },
                { id: "climate", label: "🌱 Climate Tech" },
                { id: "ai", label: "🤖 Multimodal AI" },
                { id: "cyber", label: "🛡️ Cybersecurity" },
                { id: "fintech", label: "💎 Fintech" },
                { id: "robotics", label: "🚀 Robotics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedDomain(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDomain === tab.id
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-400/30 bg-slate-900/85 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/90 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Student Challenger</th>
                    <th className="py-3.5 px-4">Desired Career Goal</th>
                    <th className="py-3.5 px-4 text-center">Level & Title</th>
                    <th className="py-3.5 px-4 text-center">Saga Stars</th>
                    <th className="py-3.5 px-4 text-center">Streak</th>
                    <th className="py-3.5 px-4 text-right">Total Score (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {combinedLeaderboard.map((row, idx) => {
                    const lv = calculateLevel(row.xp);
                    const rk = calculateRank(lv);

                    return (
                      <tr
                        key={row.id}
                        className={`transition ${
                          row.isCurrentUser
                            ? "bg-sky-500/20 border-l-4 border-l-sky-400"
                            : "hover:bg-slate-800/50"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-black text-sm">
                          {idx === 0 ? (
                            <span className="text-amber-400">#1 🥇</span>
                          ) : idx === 1 ? (
                            <span className="text-slate-300">#2 🥈</span>
                          ) : idx === 2 ? (
                            <span className="text-amber-600">#3 🥉</span>
                          ) : (
                            <span className="text-slate-400">#{idx + 1}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{row.avatar}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{row.studentName}</span>
                                {row.isCurrentUser && (
                                  <span className="px-1.5 py-0.5 rounded bg-sky-400 text-slate-950 text-[9px] font-black">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{row.university}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-medium">
                            {row.careerGoal}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold">
                            Lv.{lv} • {rk}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-yellow-300">
                          ⭐ {row.stars} ({row.levelsCleared} lvls)
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-amber-400">
                          🔥 {row.streak}d
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-amber-400">
                          {row.xp.toLocaleString()} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
