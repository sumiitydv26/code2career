"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Code,
  Briefcase,
  FolderGit2,
  Award,
  Crown,
  CheckCircle2,
  Clock,
  Zap,
  Lock,
  Star,
  BookMarked,
} from "lucide-react";
import { RoadmapNode, NodeType } from "@/lib/schema";
import { NodeStatus } from "@/lib/game";
import { useQuestStore } from "@/store/useQuestStore";

function getNodeIcon(type: NodeType) {
  switch (type) {
    case "boss":
      return <Crown className="w-5 h-5 text-amber-300" />;
    case "role":
      return <Briefcase className="w-4 h-4 text-purple-400" />;
    case "project":
      return <FolderGit2 className="w-4 h-4 text-emerald-400" />;
    case "certification":
      return <Award className="w-4 h-4 text-indigo-400" />;
    case "skill":
    default:
      return <Code className="w-4 h-4 text-sky-400" />;
  }
}

interface SkillNodeProps {
  data: {
    node: RoadmapNode;
  };
  selected?: boolean;
}

export const SkillNode = React.memo(function SkillNode({ data, selected }: SkillNodeProps) {
  const { node } = data;
  const { nodeStatus, setSelectedNodeId } = useQuestStore();
  const status: NodeStatus = nodeStatus[node.id] || "locked";
  const isBoss = node.type === "boss";

  // Determine appearance based on status
  let containerClasses = "bg-slate-900 border-slate-750 text-white shadow-lg";
  let statusBadge = null;

  switch (status) {
    case "locked":
      containerClasses =
        "bg-slate-950/80 border-slate-800/80 text-slate-400 backdrop-blur-sm opacity-75 hover:opacity-90";
      statusBadge = (
        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
          <Lock className="w-3 h-3" /> Locked
        </span>
      );
      break;

    case "available":
      containerClasses =
        "bg-slate-900 border-sky-400/80 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] animate-pulse-glow";
      statusBadge = (
        <span className="flex items-center gap-1 text-[10px] text-sky-400 font-semibold font-mono">
          <Zap className="w-3 h-3 text-sky-400" /> Available
        </span>
      );
      break;

    case "in_progress":
      containerClasses =
        "bg-slate-900 border-indigo-400 text-white shadow-[0_0_18px_rgba(129,140,248,0.3)] ring-2 ring-indigo-400/30";
      statusBadge = (
        <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold font-mono">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping mr-0.5" />
          Active
        </span>
      );
      break;

    case "completed":
      containerClasses =
        "bg-slate-900 border-amber-400 text-white shadow-[0_0_22px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50";
      statusBadge = (
        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold font-mono">
          <CheckCircle2 className="w-3 h-3 text-amber-400" /> Complete
        </span>
      );
      break;

    case "known":
      containerClasses =
        "bg-slate-900/90 border-teal-500/70 text-slate-200 shadow-[0_0_15px_rgba(20,184,166,0.25)]";
      statusBadge = (
        <span className="flex items-center gap-1 text-[10px] text-teal-400 font-mono">
          <BookMarked className="w-3 h-3" /> Known
        </span>
      );
      break;
  }

  if (isBoss) {
    containerClasses = `${containerClasses} border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(236,72,153,0.45)] ${
      status === "available" || status === "in_progress" ? "animate-boss-glow" : ""
    }`;
  }

  if (selected) {
    containerClasses += " ring-2 ring-sky-300 ring-offset-2 ring-offset-slate-950";
  }

  const handleClick = () => {
    setSelectedNodeId(node.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedNodeId(node.id);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${node.title}, ${node.type}, status: ${status}, ${node.xp} XP`}
      className={`relative rounded-2xl border p-3.5 transition-all cursor-pointer focus:outline-none select-none ${
        isBoss ? "w-[320px] min-h-[150px]" : "w-[260px] min-h-[125px]"
      } ${containerClasses}`}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-300 -left-1.5"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-300 -right-1.5"
      />

      {/* Top row: Type icon + status badge + XP */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isBoss ? "bg-fuchsia-950/80 border border-fuchsia-500/50" : "bg-slate-800/80"
            }`}
          >
            {getNodeIcon(node.type)}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            {node.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {statusBadge}
          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              status === "completed"
                ? "bg-amber-500/20 text-amber-300"
                : status === "known"
                ? "bg-teal-500/20 text-teal-300"
                : "bg-slate-800 text-sky-300"
            }`}
          >
            +{status === "known" ? Math.round(node.xp * 0.5) : node.xp} XP
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold line-clamp-2 leading-snug mb-2 ${
          isBoss ? "text-base font-bold text-white" : "text-sm text-slate-100"
        } ${status === "locked" ? "text-slate-400" : ""}`}
      >
        {node.title}
      </h3>

      {/* Footer: Hours + Difficulty stars */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60 mt-auto">
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{node.estHours}h</span>
        </div>

        {/* Difficulty Stars */}
        <div className="flex items-center gap-0.5" title={`Difficulty: ${node.difficulty}/5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-2.5 h-2.5 ${
                star <= node.difficulty
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
