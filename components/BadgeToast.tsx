"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import { Badge } from "@/lib/game";

interface BadgeToastProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeToast({ badge, onClose }: BadgeToastProps) {
  useEffect(() => {
    if (badge) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 max-w-sm w-full bg-slate-900/95 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] rounded-2xl p-4 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {badge.icon || <Award className="w-6 h-6 text-amber-400" />}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <span>Achievement Unlocked!</span>
              </div>
              <h4 className="font-bold text-white text-base truncate mt-0.5">{badge.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{badge.description}</p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Close achievement notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
