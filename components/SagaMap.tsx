"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuestStore } from "@/store/useQuestStore";
import { DynamicCodingBackground } from "./DynamicCodingBackground";
import {
  Star,
  Lock,
  Check,
  Crown,
  Flag,
  Mountain,
  Terminal,
  Cpu,
  Database,
  Cloud,
  Sparkles,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";

export function SagaMap() {
  const {
    roadmap,
    nodeStatus,
    nodeStars,
    setActiveChallengeNodeId,
    setSelectedNodeId,
  } = useQuestStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const activePinRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [currentBiomeIdx, setCurrentBiomeIdx] = useState(0);

  const nodes = roadmap.nodes;
  const totalNodes = nodes.length;

  const biomes = [
    {
      name: "Zone 1: Emerald Syntax Valley",
      subtitle: "Core Foundations & Type Alchemy",
      badge: "border-emerald-400/60 bg-emerald-950/80 text-emerald-300",
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      name: "Zone 2: Cyan Telemetry Archipelago",
      subtitle: "Data Pipelines & Spatial Streams",
      badge: "border-sky-400/60 bg-sky-950/80 text-sky-300",
      icon: <Database className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      name: "Zone 3: Amethyst Cloud Citadel",
      subtitle: "Distributed Systems & Cluster Scale",
      badge: "border-purple-400/60 bg-purple-950/80 text-purple-300",
      icon: <Cloud className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      name: "Zone 4: Golden Apex Cosmos",
      subtitle: "Dream Career Boss Summit",
      badge: "border-amber-400/70 bg-amber-950/80 text-amber-300",
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  // Auto-scroll to current active node on mount or roadmap change
  useEffect(() => {
    if (activePinRef.current && containerRef.current) {
      setTimeout(() => {
        activePinRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [roadmap.goal]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    const maxScroll = e.currentTarget.scrollHeight - e.currentTarget.clientHeight;
    setScrollY(top);

    if (maxScroll > 0) {
      const ratioFromBottom = 1 - top / maxScroll;
      if (ratioFromBottom > 0.78) setCurrentBiomeIdx(3);
      else if (ratioFromBottom > 0.5) setCurrentBiomeIdx(2);
      else if (ratioFromBottom > 0.25) setCurrentBiomeIdx(1);
      else setCurrentBiomeIdx(0);
    }
  };

  // Generate serpentine horizontal positions (% of width) for each level
  const getCoordinates = (index: number) => {
    const wave = Math.sin(index * 0.9) * 30;
    return 50 + wave; // 20% to 80%
  };

  const activeNodeIndex = nodes.findIndex(
    (n) => nodeStatus[n.id] === "available" || nodeStatus[n.id] === "in_progress"
  );

  const activeBiome = biomes[currentBiomeIdx] || biomes[0];

  const scrollToActivePin = () => {
    activePinRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative w-full h-full overflow-y-auto select-none scroll-smooth"
    >
      {/* Floating Biome Radar & Quick-Scroll Compass (Fixed on left of viewport) */}
      <div className="sticky top-4 left-4 z-30 pl-4 pt-2 pointer-events-none flex items-start justify-between pr-4">
        <div
          className={`pointer-events-auto inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${activeBiome.badge}`}
        >
          <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/10">
            {activeBiome.icon}
          </div>
          <div>
            <div className="text-xs font-black tracking-wide">{activeBiome.name}</div>
            <div className="text-[10px] opacity-80 font-mono">{activeBiome.subtitle}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToActivePin}
          className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-sky-400/60 text-sky-300 text-xs font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md cursor-pointer transition"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Locate My Hero</span>
        </button>
      </div>

      {/* Main Tall Scrolling World Container */}
      <div className="relative w-full min-h-[2350px] overflow-hidden -mt-14">
        {/* Dynamic Parallax Gamified Coding Background */}
        <DynamicCodingBackground scrollY={scrollY} />

        {/* Foreground Winding Candy-Circuit Road & Stepping Stones */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-28 min-h-[2350px] flex flex-col-reverse justify-start">
          {/* SVG 3D Candy-Circuit Winding Road */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              <filter id="roadGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {nodes.map((_, i) => {
              if (i === 0) return null;
              const x1 = `${getCoordinates(i - 1)}%`;
              const y1 = `${100 - ((i - 1) / (totalNodes - 1)) * 88 - 6}%`;
              const x2 = `${getCoordinates(i)}%`;
              const y2 = `${100 - (i / (totalNodes - 1)) * 88 - 6}%`;

              const isPassed =
                (nodeStatus[nodes[i - 1].id] === "completed" ||
                  nodeStatus[nodes[i - 1].id] === "known") &&
                (nodeStatus[nodes[i].id] === "completed" ||
                  nodeStatus[nodes[i].id] === "known");

              const isCurrentSegment = i - 1 === activeNodeIndex || i === activeNodeIndex;

              return (
                <g key={`road-seg-${i}`}>
                  {/* 1. Wide Outer Cyber-Road Curb / Glow */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isPassed
                        ? "rgba(245, 158, 11, 0.55)"
                        : isCurrentSegment
                        ? "rgba(56, 189, 248, 0.5)"
                        : "rgba(51, 65, 85, 0.55)"
                    }
                    strokeWidth="34"
                    strokeLinecap="round"
                    filter={isPassed || isCurrentSegment ? "url(#roadGlow)" : undefined}
                  />

                  {/* 2. Inner Asphalt / Circuit Track Bed */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#090d1a"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />

                  {/* 3. Center Glowing Candy / Energy Lane */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isPassed
                        ? "#fbbf24"
                        : isCurrentSegment
                        ? "#38bdf8"
                        : "#475569"
                    }
                    strokeWidth={isPassed ? "6" : "4"}
                    strokeDasharray={isPassed ? "none" : "10,10"}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Trailhead Start Portal at Bottom */}
          <div className="text-center pb-8 pt-6 relative z-10">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400/70 text-xs font-black text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <Flag className="w-4 h-4 text-emerald-400" />
              <span>TRAILHEAD GATE • APPRENTICESHIP BEGINS</span>
            </div>
          </div>

          {/* Level Stepping Stones (Ordered 0 at bottom to totalNodes - 1 at top) */}
          {nodes.map((node, index) => {
            const levelNum = index + 1;
            const status = nodeStatus[node.id] || "locked";
            const stars = nodeStars[node.id] || 0;
            const isBoss = node.type === "boss";
            const isActive = index === activeNodeIndex;
            const isCompleted = status === "completed" || status === "known";
            const isAvailable = status === "available" || status === "in_progress";
            const isLocked = status === "locked";

            const xPos = getCoordinates(index);
            const isStageCheckpoint = index % 4 === 0 && index > 0;
            const stageIdx = Math.min(3, Math.floor(index / 4));

            const handleClick = () => {
              if (isAvailable || isCompleted) {
                setActiveChallengeNodeId(node.id);
              } else {
                setSelectedNodeId(node.id);
              }
            };

            return (
              <div
                key={node.id}
                className="relative w-full my-5 flex flex-col items-center z-10"
              >
                {/* Stage Biome Archway Checkpoint */}
                {isStageCheckpoint && (
                  <div className="w-full my-5 flex items-center justify-center gap-3">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
                    <div className="px-5 py-2 rounded-2xl bg-slate-950/95 border-2 border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.3)] text-xs font-black text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      <span>{biomes[stageIdx]?.name || `Stage ${stageIdx + 1}`}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        🎁 Bonus Chest
                      </span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
                  </div>
                )}

                {/* Positioned Node Pin Container */}
                <div
                  style={{ marginLeft: `${(xPos - 50) * 1.55}%` }}
                  className="relative flex flex-col items-center transition-transform hover:scale-110 active:scale-95 duration-200"
                  ref={isActive ? activePinRef : undefined}
                >
                  {/* 3D Bouncing Player Avatar Pin for Current Level */}
                  {isActive && (
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: [-16, -6, -16] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                      className="absolute -top-16 flex flex-col items-center z-30 pointer-events-none"
                    >
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-[0_0_20px_rgba(56,189,248,0.9)] border-2 border-white flex items-center gap-1">
                        <span>🧙‍♂️ YOU ARE HERE</span>
                      </div>
                      <div className="w-3.5 h-3.5 bg-sky-300 transform rotate-45 -mt-1.5 border-r border-b border-white" />
                    </motion.div>
                  )}

                  {/* Glowing 3D Pedestal Ring under the button */}
                  <div
                    className={`absolute top-12 w-24 h-8 rounded-full blur-md -z-10 ${
                      isBoss
                        ? "bg-fuchsia-500/60 w-32 h-12"
                        : isCompleted
                        ? "bg-amber-400/50"
                        : isAvailable
                        ? "bg-sky-400/60"
                        : "bg-slate-950/80"
                    }`}
                  />

                  {/* Candy Crush 3D Jeweled Stepping Button */}
                  <button
                    type="button"
                    onClick={handleClick}
                    className={`relative group flex items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none border-b-[6px] ${
                      isBoss
                        ? "w-24 h-24 shadow-[0_0_45px_rgba(236,72,153,0.85)]"
                        : "w-16 h-16 sm:w-20 sm:h-20"
                    } ${
                      isBoss
                        ? "bg-gradient-to-b from-fuchsia-400 via-pink-600 to-rose-800 border-4 border-yellow-300 text-white"
                        : isCompleted
                        ? "bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-700 border-4 border-yellow-100 shadow-[0_0_30px_rgba(245,158,11,0.65)] text-slate-950"
                        : isAvailable
                        ? "bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-700 border-4 border-white shadow-[0_0_35px_rgba(56,189,248,0.85)] animate-pulse text-slate-950"
                        : "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border-4 border-slate-500/80 text-slate-300 shadow-xl"
                    }`}
                    aria-label={`Level ${levelNum}: ${node.title}`}
                  >
                    {/* Glossy Candy Top Shine */}
                    <div className="absolute top-1.5 left-3 right-3 h-4 rounded-full bg-white/45 blur-[0.5px] pointer-events-none" />

                    {/* Level Number or Icon */}
                    <div className="flex flex-col items-center justify-center font-black">
                      {isBoss ? (
                        <Crown className="w-10 h-10 text-yellow-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-bounce" />
                      ) : isCompleted ? (
                        <Check className="w-8 h-8 stroke-[3.5] text-slate-950 drop-shadow" />
                      ) : isLocked ? (
                        <div className="flex flex-col items-center">
                          <Lock className="w-5 h-5 text-slate-300" />
                          <span className="text-[10px] font-mono font-bold text-slate-300 mt-0.5">
                            Lv.{levelNum}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl sm:text-2xl font-black text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
                          {levelNum}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* 3-Star Rack under Level Pin */}
                  <div className="flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700 shadow-lg">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= stars
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.9)]"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* High-Contrast Title Pill Card */}
                  <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/90 backdrop-blur-md shadow-xl max-w-[180px] sm:max-w-[210px] text-center">
                    <span className="text-[11px] sm:text-xs font-extrabold text-white line-clamp-1 block">
                      {node.title}
                    </span>
                    <div className="text-[10px] text-sky-300 font-mono font-bold">
                      +{node.xp} XP • {node.estHours}h
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summit Citadel Apex at Top */}
          <div className="text-center pt-6 pb-8 relative z-10">
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-3xl bg-gradient-to-r from-amber-500/30 via-fuchsia-500/30 to-sky-500/30 border-2 border-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.45)] backdrop-blur-md">
              <Crown className="w-6 h-6 text-amber-300" />
              <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                THE DREAM JOB APEX CITADEL: {roadmap.goal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
