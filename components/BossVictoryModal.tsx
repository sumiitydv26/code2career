"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Sparkles, X, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

interface BossVictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bossTitle: string;
  totalXp: number;
}

export function BossVictoryModal({
  isOpen,
  onClose,
  bossTitle,
  totalXp,
}: BossVictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        // Fire confetti cannons
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#f59e0b", "#ec4899", "#10b981", "#a855f7"],
        });

        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 300);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 shadow-[0_0_80px_rgba(245,158,11,0.4)] text-center overflow-hidden"
        >
          {/* Background decorative glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close victory modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trophy Header */}
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-full blur-xl opacity-80 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center shadow-xl border border-yellow-200">
              <Crown className="w-10 h-10 text-slate-950" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quest Conquered</span>
            </div>
            <h2 id="victory-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              Dream Job Unlocked!
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              You defeated the final boss and mastered every prerequisite to become:
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 font-semibold text-sky-300 text-base sm:text-lg">
              {bossTitle}
            </div>
          </div>

          {/* Total XP Score */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6 flex justify-around items-center">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Earned XP</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{totalXp} XP</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Status</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Hireable</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Continue Questing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
