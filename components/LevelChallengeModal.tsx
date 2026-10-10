"use client";

import React, { useState } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { getChallengeForNode, getSorcererForGoal } from "@/lib/sorcerer";
import {
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  X,
  Shield,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export function LevelChallengeModal() {
  const {
    roadmap,
    goal,
    activeChallengeNodeId,
    setActiveChallengeNodeId,
    completeLevelChallenge,
    nodeStars,
    setSelectedNodeId,
  } = useQuestStore();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  if (!activeChallengeNodeId) return null;

  const nodeIndex = roadmap.nodes.findIndex((n) => n.id === activeChallengeNodeId);
  const node = roadmap.nodes[nodeIndex];
  if (!node) return null;

  const phase = roadmap.phases.find((p) => p.id === node.phaseId);
  const stageName = phase ? phase.name : `Stage ${Math.floor(nodeIndex / 5) + 1}`;
  const challenge = getChallengeForNode(node.id, nodeIndex + 1, node.title, stageName, goal);
  const sorcerer = getSorcererForGoal(goal);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    challenge.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const totalQuestions = challenge.questions.length;
    let stars = 1;
    if (correctCount === totalQuestions) {
      stars = 3;
    } else if (correctCount >= Math.ceil(totalQuestions / 2)) {
      stars = 2;
    }

    setEarnedStars(stars);
    setChallengeCompleted(true);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: stars === 3 ? 80 : 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#f59e0b", "#10b981", "#ec4899"],
      });
    }
  };

  const handleQualifyAndAdvance = () => {
    completeLevelChallenge(node.id, earnedStars);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setRevealedExplanations({});
    setChallengeCompleted(false);
    setEarnedStars(0);
  };

  const allAnswered = challenge.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveChallengeNodeId(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close challenge"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Header with Candy Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 border border-yellow-200 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shrink-0">
            {challenge.levelNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-400">
                {challenge.stageName}
              </span>
              <span className="text-xs text-sky-400 font-mono">+{node.xp} XP Available</span>
            </div>
            <h3 className="text-xl font-black text-white">{challenge.title}</h3>
          </div>
        </div>

        {/* Results Screen */}
        {challengeCompleted ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-400/50 space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((starIdx) => (
                  <motion.div
                    key={starIdx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: starIdx * 0.2, type: "spring", stiffness: 300 }}
                  >
                    <Star
                      className={`w-12 h-12 ${
                        starIdx <= earnedStars
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                          : "text-slate-700"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">
                  {earnedStars === 3 ? "Level Mastered! 🌟🌟🌟" : "Level Qualified! ⭐"}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  You earned <span className="text-amber-400 font-bold">{earnedStars} Stars</span> and
                  proved your tactical skills for this milestone.
                </p>
              </div>

              {/* Sorcerer Commentary */}
              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 text-left flex items-start gap-3">
                <span className="text-2xl shrink-0">{sorcerer.avatarIcon}</span>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-sky-300">{sorcerer.name} remarks:</div>
                  <p className="text-slate-200 leading-relaxed">
                    {earnedStars === 3
                      ? "Outstanding work apprentice! Your architectural judgment is spot-on. The next milestone on the trail has unlocked!"
                      : "Well fought! You passed the qualifying bar. Review the mentor explanations as you continue up the route."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleQualifyAndAdvance}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <span>Advance Down the Route</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake for 3 Stars</span>
              </button>
            </div>
          </div>
        ) : (
          /* Challenge Questions Screen */
          <div className="space-y-6">
            {/* Sorcerer Briefing Box */}
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/40 flex items-start gap-3 text-xs">
              <span className="text-2xl shrink-0 mt-0.5">{sorcerer.avatarIcon}</span>
              <div className="space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <span>{sorcerer.name}&apos;s Industry Briefing:</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{challenge.sorcererBriefing}</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {challenge.questions.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-amber-400">Question {qIndex + 1}</span>
                      {isAnswered && (
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            isCorrect ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+50 XP)
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Reviewed
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </div>

                    <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      Scenario: {q.scenario}
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const isThisSelected = userChoice === optIndex;
                        let optionStyle =
                          "bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850";

                        if (isAnswered) {
                          if (optIndex === q.correctIndex) {
                            optionStyle = "bg-emerald-950/40 border-emerald-500/80 text-emerald-200";
                          } else if (isThisSelected) {
                            optionStyle = "bg-rose-950/40 border-rose-500/80 text-rose-200";
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            disabled={isAnswered}
                            className={`w-full text-left p-3 rounded-xl border text-xs leading-normal transition flex items-start gap-2.5 ${optionStyle}`}
                          >
                            <span className="font-mono font-bold text-slate-400 shrink-0">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/30 text-xs text-sky-200 space-y-1 animate-fade-in">
                        <div className="font-bold text-sky-300 flex items-center gap-1.5">
                          <span>💡 Sorcerer&apos;s Pro Verdict:</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{q.sorcererExplanation}</p>
                        <p className="text-[11px] text-amber-300/90 font-mono mt-1">
                          Pro-Tip: {q.proTip}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Practical Project Rubric Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Practical Deliverable: {challenge.practicalTask.title}</span>
              </div>
              <p className="text-xs text-slate-300">{challenge.practicalTask.description}</p>
              <div className="space-y-1 pt-1">
                {challenge.practicalTask.rubricPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveChallengeNodeId(null);
                  setSelectedNodeId(node.id);
                }}
                className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Study Resources & Advice</span>
              </button>

              <button
                type="button"
                onClick={calculateResults}
                disabled={!allAnswered}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit & Calculate Stars</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
