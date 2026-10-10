"use client";

import React, { useState, useEffect } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { getSorcererForGoal } from "@/lib/sorcerer";
import { Sparkles, MessageSquare, BookOpen, ShieldAlert, Award, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SorcererCompanion() {
  const { goal, roadmap, nodeStatus, nodeStars, setSorcererDialogueOpen, sorcererDialogueOpen } = useQuestStore();
  const sorcerer = getSorcererForGoal(goal);

  // Dynamic speech bubble quotes based on progress
  const [currentQuote, setCurrentQuote] = useState("");
  const [speechVisible, setSpeechVisible] = useState(true);

  // Compute completed count
  const completedCount = Object.values(nodeStatus).filter(
    (s) => s === "completed" || s === "known"
  ).length;

  useEffect(() => {
    if (completedCount === 0) {
      setCurrentQuote(
        "Welcome apprentice! I am your industry guide. Click Level 1 on the trail to begin your first qualifying trial!"
      );
    } else if (completedCount < 5) {
      setCurrentQuote(
        "Great momentum! In production, solid fundamentals separate true engineers from tutorial copycats."
      );
    } else if (completedCount < 12) {
      setCurrentQuote(
        "You're in the deep systems territory now! Remember: understand trade-offs before writing code."
      );
    } else {
      setCurrentQuote(
        "You are approaching the Dream Job Apex! Soon you will stand before the hiring council as a verified pro!"
      );
    }
  }, [completedCount, goal]);

  return (
    <>
      {/* Floating Sorcerer Avatar Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Dynamic Speech Bubble */}
        <AnimatePresence>
          {speechVisible && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-auto max-w-xs sm:max-w-sm p-3.5 rounded-2xl bg-slate-900/95 border border-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.3)] backdrop-blur-md relative"
            >
              <button
                onClick={() => setSpeechVisible(false)}
                className="absolute top-2 right-2 text-slate-500 hover:text-white p-0.5 rounded-md"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{sorcerer.avatarIcon}</span>
                <span className="text-[11px] font-bold text-sky-300 truncate">
                  {sorcerer.name}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  PRO MENTOR
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed pr-3">
                &ldquo;{currentQuote}&rdquo;
              </p>

              <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 truncate max-w-[170px]">
                  {sorcerer.title}
                </span>
                <button
                  onClick={() => setSorcererDialogueOpen(true)}
                  className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 underline cursor-pointer"
                >
                  Consult Mentor <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Triangle Tail */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r border-b border-sky-400/50 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sorcerer Button Trigger */}
        <button
          type="button"
          onClick={() => setSorcererDialogueOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-2.5 p-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] border border-white/20 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Open Sorcerer Mentorship"
        >
          <div className="relative w-10 h-10 rounded-full bg-slate-950/80 border border-amber-400/60 flex items-center justify-center text-xl shrink-0 group-hover:rotate-12 transition-transform">
            <span>{sorcerer.avatarIcon}</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Career Sorcerer</span>
            </div>
            <div className="text-xs font-bold text-white truncate max-w-[130px]">
              {sorcerer.name}
            </div>
          </div>
        </button>
      </div>

      {/* Sorcerer Sanctum Dialog Modal */}
      <AnimatePresence>
        {sorcererDialogueOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-slate-900 border-2 border-sky-400/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(56,189,248,0.3)] max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSorcererDialogueOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close mentor modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sorcerer Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 border border-sky-300 flex items-center justify-center text-3xl shadow-xl shrink-0">
                  {sorcerer.avatarIcon}
                </div>
                <div className="space-y-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      Working Professional Guide
                    </span>
                    <span className="text-xs text-amber-400 font-mono font-semibold">
                      {sorcerer.yearsExp} Years in Industry
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{sorcerer.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {sorcerer.title} • <span className="text-sky-300">{sorcerer.company}</span>
                  </p>
                </div>
              </div>

              {/* Bio & Greeting Quote */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-6">
                &ldquo;{sorcerer.greeting}&rdquo;
              </div>

              {/* Tabs / Sections */}
              <div className="space-y-6">
                {/* War Stories */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Real-World Production War Stories (Lessons From The Trenches)</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {sorcerer.warStories.map((story, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5"
                      >
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-amber-400">⚡</span>
                          <span>{story.title}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{story.lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resume Secrets */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Insider Resume & Portfolio Secrets</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <ul className="space-y-2">
                      {sorcerer.resumeSecrets.map((secret, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{secret}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interview Golden Strategy */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Hiring Bar Interview Wisdom</span>
                  </h4>
                  <div className="space-y-2">
                    {sorcerer.interviewTips.map((tip, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1"
                      >
                        <div className="text-xs font-semibold text-slate-200">
                          Q: &ldquo;{tip.question}&rdquo;
                        </div>
                        <div className="text-xs text-sky-300 font-mono mt-1">
                          Mentor Strategy: {tip.answerStrategy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setSorcererDialogueOpen(false)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-sky-500/25"
                >
                  Return to Route with Renewed Wisdom
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
