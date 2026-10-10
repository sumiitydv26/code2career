"use client";

import React, { useEffect, useState } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { fetchNodeDetail } from "@/lib/api";
import { DetailSkeleton } from "./Skeletons";
import { NodeDetailView } from "./NodeDetailView";
import { BossFightQuiz } from "./BossFightQuiz";
import { ErrorState } from "./ErrorState";
import {
  X,
  Play,
  CheckCircle2,
  BookMarked,
  Sparkles,
  Swords,
  Lock,
  Clock,
  Zap,
} from "lucide-react";
import { NodeStatus } from "@/lib/game";

export function SidePanel() {
  const {
    roadmap,
    goal,
    selectedNodeId,
    setSelectedNodeId,
    nodeStatus,
    startNode,
    markCompleted,
    toggleKnown,
    nodeDetailsCache,
    cacheNodeDetail,
    activeTab,
    setActiveTab,
  } = useQuestStore();

  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  const node = roadmap.nodes.find((n) => n.id === selectedNodeId);
  const status: NodeStatus = selectedNodeId ? nodeStatus[selectedNodeId] || "locked" : "locked";

  // Escape key closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNodeId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedNodeId]);

  // Auto-fetch advice on node open if not cached
  useEffect(() => {
    if (!node) return;

    if (nodeDetailsCache[node.id]) {
      setLoadingAdvice(false);
      setAdviceError(null);
      return;
    }

    let isMounted = true;
    setLoadingAdvice(true);
    setAdviceError(null);

    fetchNodeDetail({ goal, node })
      .then((detail) => {
        if (isMounted) {
          cacheNodeDetail(detail);
          setLoadingAdvice(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load advice";
          setAdviceError(msg);
          setLoadingAdvice(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [node, goal, nodeDetailsCache, cacheNodeDetail]);

  if (!node) return null;

  const cachedDetail = nodeDetailsCache[node.id];
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isKnown = status === "known";
  const isInProgress = status === "in_progress";

  // Check which prerequisites are missing if locked
  const missingPrereqs = isLocked
    ? node.prerequisites
        .map((pId) => roadmap.nodes.find((n) => n.id === pId))
        .filter((p) => {
          if (!p) return false;
          const s = nodeStatus[p.id];
          return s !== "completed" && s !== "known";
        })
    : [];

  return (
    <aside
      role="region"
      aria-label="Node detail panel"
      className="fixed inset-x-0 bottom-0 top-auto md:top-16 md:bottom-0 md:left-auto md:right-0 md:w-[450px] lg:w-[480px] max-h-[85vh] md:max-h-none z-40 bg-slate-950/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                {node.type}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> {node.estHours}h
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-mono font-bold">
                +{node.xp} XP
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{node.title}</h2>
          </div>

          <button
            onClick={() => setSelectedNodeId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{node.description}</p>

        {/* Missing Prerequisites Warning */}
        {isLocked && missingPrereqs.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Prerequisites Required:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 pl-1">
              {missingPrereqs.map((p) => (
                <li key={p?.id}>{p?.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          {!isCompleted && !isKnown && (
            <button
              type="button"
              onClick={() => startNode(node.id)}
              disabled={isLocked || isInProgress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isInProgress ? "In Progress" : "Start Skill"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => markCompleted(node.id)}
            disabled={isLocked}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              isCompleted
                ? "bg-amber-400 text-slate-950 font-bold"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? "Completed ✓" : "Mark Complete"}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleKnown(node.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              isKnown
                ? "bg-teal-500/20 border-teal-400 text-teal-300"
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>{isKnown ? "Already Known (Active)" : "I already know this"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 px-5 shrink-0 bg-slate-950/40">
        <button
          type="button"
          onClick={() => setActiveTab("advice")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "advice"
              ? "border-sky-400 text-sky-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Actionable Advice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("boss_fight")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "boss_fight"
              ? "border-rose-400 text-rose-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Boss Fight Quiz</span>
        </button>
      </div>

      {/* Body Content with Scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === "advice" ? (
          <div>
            {loadingAdvice ? (
              <DetailSkeleton />
            ) : adviceError ? (
              <ErrorState
                title="Could not retrieve advice"
                message={adviceError}
                onRetry={() => {
                  setAdviceError(null);
                  setLoadingAdvice(true);
                  fetchNodeDetail({ goal, node })
                    .then((detail) => {
                      cacheNodeDetail(detail);
                      setLoadingAdvice(false);
                    })
                    .catch((err) => {
                      setAdviceError(err.message || "Failed");
                      setLoadingAdvice(false);
                    });
                }}
              />
            ) : cachedDetail ? (
              <NodeDetailView detail={cachedDetail} />
            ) : null}
          </div>
        ) : (
          <div>
            {cachedDetail?.interviewQuestions ? (
              <BossFightQuiz node={node} questions={cachedDetail.interviewQuestions} />
            ) : loadingAdvice ? (
              <DetailSkeleton />
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Loading trial challenges...
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
