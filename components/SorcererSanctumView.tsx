"use client";

import React, { useState } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { getSorcererForGoal, SORCERER_PROFILES, SorcererProfile } from "@/lib/sorcerer";
import { ThemedViewBackground } from "./ThemedViewBackground";
import {
  Sparkles,
  ShieldAlert,
  BookOpen,
  Send,
  MessageSquare,
  Swords,
  CheckCircle2,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

export function SorcererSanctumView() {
  const {
    goal,
    roadmap,
    nodeStatus,
    setActiveHubTab,
    setActiveChallengeNodeId,
  } = useQuestStore();

  const [scrollY, setScrollY] = useState(0);

  const defaultSorcerer = getSorcererForGoal(goal);
  const [selectedSorcererKey, setSelectedSorcererKey] = useState<string>(
    defaultSorcerer.domainId || "climate"
  );

  const sorcerer: SorcererProfile =
    SORCERER_PROFILES[selectedSorcererKey] || defaultSorcerer;

  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "sorcerer" | "student"; text: string }>
  >([
    {
      sender: "sorcerer",
      text: sorcerer.greeting,
    },
  ]);
  const [customQuestion, setCustomQuestion] = useState("");

  const nextAvailableNode = roadmap.nodes.find(
    (n) => nodeStatus[n.id] === "available" || nodeStatus[n.id] === "in_progress"
  );

  const handleSwitchSorcerer = (key: string) => {
    setSelectedSorcererKey(key);
    const nextSorc = SORCERER_PROFILES[key];
    if (nextSorc) {
      setChatHistory([{ sender: "sorcerer", text: nextSorc.greeting }]);
    }
  };

  const handleAskPreset = (prompt: string, response: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: "student", text: prompt },
      { sender: "sorcerer", text: response },
    ]);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const q = customQuestion.trim();
    if (!q) return;

    let reply = `As ${sorcerer.title} at ${sorcerer.company} (${sorcerer.yearsExp} yrs exp), here is my candid advice on "${q}": Focus on shipping one production-grade project that solves a real bottleneck, document your architectural trade-offs clearly in the README, and practice explaining failure modes out loud.`;

    const lower = q.toLowerCase();
    if (lower.includes("resume") || lower.includes("cv") || lower.includes("portfolio")) {
      reply = `${sorcerer.resumeSecrets[0]} Also, make sure your GitHub pinned repos have live demo links and clear architecture diagrams—hiring managers spend less than 45 seconds on an initial scan!`;
    } else if (lower.includes("interview") || lower.includes("hire") || lower.includes("question")) {
      reply = `In our hiring bar at ${sorcerer.company}, ${sorcerer.interviewTips[0]?.answerStrategy || "we test for real debugging intuition and trade-off clarity over rote memorization."}`;
    } else if (lower.includes("salary") || lower.includes("pay") || lower.includes("offer")) {
      reply = `Engineers who can demonstrate end-to-end ownership—from clean data contracts to production observability—consistently command top-tier equity and base compensation. Complete your Saga Stages to prove that mastery!`;
    }

    setChatHistory((prev) => [
      ...prev,
      { sender: "student", text: q },
      { sender: "sorcerer", text: reply },
    ]);
    setCustomQuestion("");
  };

  return (
    <div
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      className="relative w-full h-full overflow-y-auto p-4 sm:p-8"
    >
      {/* Dynamic Arcane Spellbook & Rotating Mandala Background */}
      <ThemedViewBackground variant="sorcerer" scrollY={scrollY} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8 pb-20">
        {/* Top Council Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/85 backdrop-blur-xl border border-purple-400/40 p-4 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>The Council of Working-Pro Sorcerers:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(SORCERER_PROFILES).map(([key, prof]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSwitchSorcerer(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  selectedSorcererKey === key
                    ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 shadow-lg"
                    : "bg-slate-950/90 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{prof.avatarIcon}</span>
                <span>{prof.name.split(" ")[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Mentor Hero & Interactive Chat Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 Cols: Humanized Working-Pro Profile Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border-2 border-sky-400/50 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-fuchsia-600 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-2xl shrink-0">
                  {sorcerer.avatarIcon}
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <UserCheck className="w-3 h-3" /> Verified Industry Mentor
                  </span>
                  <h2 className="text-2xl font-black text-white">{sorcerer.name}</h2>
                  <p className="text-xs font-bold text-sky-300">{sorcerer.title}</p>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {sorcerer.company} • {sorcerer.yearsExp} Yrs Exp
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/75 p-4 rounded-2xl border border-slate-800">
                {sorcerer.bio}
              </p>

              {/* Action Button to Launch Next Qualifying Level with Mentor */}
              {nextAvailableNode && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-400/50 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase text-amber-300">
                    Next Qualifying Trial Ready:
                  </div>
                  <div className="text-sm font-black text-white">
                    {nextAvailableNode.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveHubTab("saga");
                      setActiveChallengeNodeId(nextAvailableNode.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Train & Qualify This Level Now</span>
                  </button>
                </div>
              )}

              {/* Resume Secrets */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Insider Resume & Hiring Secrets</span>
                </h3>
                <div className="space-y-2">
                  {sorcerer.resumeSecrets.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-2 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Interactive Mentor Chat + Production War Stories */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Interactive Dialogue Box */}
            <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-purple-400/40 flex flex-col h-[460px] shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    1-on-1 Mentorship Session with {sorcerer.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  ● ONLINE
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.sender === "student" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "student"
                          ? "bg-sky-500 text-slate-950 font-semibold rounded-br-none"
                          : "bg-slate-950/90 border border-sky-500/40 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.sender === "sorcerer" && (
                        <div className="font-bold text-sky-400 mb-1 flex items-center gap-1">
                          <span>{sorcerer.avatarIcon}</span>
                          <span>{sorcerer.name}</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Question Prompts */}
              <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-800/80">
                {sorcerer.mentorDialogues.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAskPreset(d.prompt, d.response)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-sky-300 border border-slate-700 transition cursor-pointer"
                  >
                    💬 {d.prompt}
                  </button>
                ))}
              </div>

              {/* Custom Question Input */}
              <form onSubmit={handleAskCustom} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={`Ask ${sorcerer.name} anything about interviews, resume, or production...`}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>

            {/* Real-World Production War Stories */}
            <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-amber-400/40 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Real-World War Stories from {sorcerer.company}</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {sorcerer.warStories.map((story, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="text-amber-400">⚡</span>
                      <span>{story.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{story.lesson}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
