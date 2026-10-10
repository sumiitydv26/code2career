"use client";

import React, { useState } from "react";
import { InterviewQuestion, RoadmapNode } from "@/lib/schema";
import { useQuestStore } from "@/store/useQuestStore";
import { Swords, Eye, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Trophy, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface BossFightQuizProps {
  node: RoadmapNode;
  questions: InterviewQuestion[];
}

export function BossFightQuiz({ node, questions }: BossFightQuizProps) {
  const { recordQuizVictory } = useQuestStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<Array<"nailed" | "partly" | "missed">>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
        <Swords className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-300">No Boss Fight Questions</h4>
        <p className="text-xs text-slate-500">This node does not have active interview trials configured.</p>
      </div>
    );
  }

  const currQ = questions[currentIdx];

  const handleRate = (rating: "nailed" | "partly" | "missed") => {
    const nextRatings = [...ratings, rating];
    setRatings(nextRatings);
    setRevealed(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate bonus XP
      let bonus = 0;
      nextRatings.forEach((r) => {
        if (r === "nailed") bonus += 50;
        if (r === "partly") bonus += 25;
      });

      recordQuizVictory(node.id, bonus);
      setQuizFinished(true);

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion && bonus > 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setRevealed(false);
    setRatings([]);
    setQuizFinished(false);
  };

  // Result Summary
  if (quizFinished) {
    const nailedCount = ratings.filter((r) => r === "nailed").length;
    const partlyCount = ratings.filter((r) => r === "partly").length;
    const missedCount = ratings.filter((r) => r === "missed").length;
    const totalBonus = nailedCount * 50 + partlyCount * 25;

    return (
      <div className="space-y-6 animate-fade-in p-2">
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-400/50 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Boss Fight Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">You tested your practical mastery against real interview challenges.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="text-xs text-emerald-400 font-semibold">Nailed It</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{nailedCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="text-xs text-amber-400 font-semibold">Partly</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{partlyCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="text-xs text-rose-400 font-semibold">Missed</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{missedCount}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-amber-300 font-mono font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Bonus Awarded: +{totalBonus} XP</span>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Boss Fight</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-1">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Trial Question {currentIdx + 1} of {questions.length}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
          {currQ.difficulty}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i === currentIdx
                ? "bg-rose-500"
                : i < currentIdx
                ? "bg-emerald-500"
                : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          {currQ.question}
        </div>

        {/* Ideal Answer Hint */}
        {revealed ? (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-xs text-indigo-200 space-y-1.5 animate-fade-in">
            <div className="font-semibold text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ideal Answer Key / Rubric:</span>
            </div>
            <p className="leading-relaxed text-slate-300">{currQ.idealAnswerHint}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/70 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Reveal Ideal Answer Key</span>
          </button>
        )}
      </div>

      {/* Rating Buttons */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-slate-400 text-center uppercase tracking-wider">
          Rate your answer accuracy:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleRate("nailed")}
            className="py-3 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex flex-col items-center gap-1 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Nailed it</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">+50 XP</span>
          </button>

          <button
            type="button"
            onClick={() => handleRate("partly")}
            className="py-3 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs flex flex-col items-center gap-1 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Partly</span>
            <span className="text-[10px] text-amber-400/80 font-mono">+25 XP</span>
          </button>

          <button
            type="button"
            onClick={() => handleRate("missed")}
            className="py-3 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold text-xs flex flex-col items-center gap-1 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Missed</span>
            <span className="text-[10px] text-rose-400/80 font-mono">0 XP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
