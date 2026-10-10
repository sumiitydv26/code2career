"use client";

import React from "react";

interface DynamicCodingBackgroundProps {
  scrollY: number;
}

const FLOATING_CODE_SHARDS = [
  {
    code: "type CarbonTon = number & { readonly __brand: 'CO2e' };",
    badge: "TypeScript Strict",
    top: 1850,
    left: "6%",
    color: "border-emerald-400/50 bg-emerald-950/60 text-emerald-200 shadow-emerald-500/20",
    speed: 0.35,
  },
  {
    code: "export default async function GridDashboard() {\n  const telemetry = await fetchNOAAGrid();\n  return <LiveMap data={telemetry} />;\n}",
    badge: "React Server Component",
    top: 1620,
    left: "68%",
    color: "border-sky-400/50 bg-sky-950/60 text-sky-200 shadow-sky-500/20",
    speed: 0.45,
  },
  {
    code: "SELECT time_bucket('5 minutes', ts) AS bucket,\n       AVG(solar_mw) FROM inverter_stream\nGROUP BY bucket ORDER BY bucket DESC;",
    badge: "TimescaleDB Telemetry",
    top: 1320,
    left: "5%",
    color: "border-cyan-400/50 bg-cyan-950/60 text-cyan-200 shadow-cyan-500/20",
    speed: 0.3,
  },
  {
    code: "SELECT ST_Area(ST_Transform(roof_geom, 3857))\nFROM solar_parcels WHERE irradiance > 1400;",
    badge: "PostGIS Spatial SQL",
    top: 1080,
    left: "66%",
    color: "border-indigo-400/50 bg-indigo-950/60 text-indigo-200 shadow-indigo-500/20",
    speed: 0.5,
  },
  {
    code: "await kafkaProducer.send({\n  topic: 'grid-frequency-events',\n  messages: [{ key: inverterId, value: payload }]\n});",
    badge: "Kafka Event Stream",
    top: 780,
    left: "7%",
    color: "border-purple-400/50 bg-purple-950/60 text-purple-200 shadow-purple-500/20",
    speed: 0.4,
  },
  {
    code: "apiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 12\n  strategy: RollingUpdate",
    badge: "Kubernetes Cluster",
    top: 520,
    left: "67%",
    color: "border-fuchsia-400/50 bg-fuchsia-950/60 text-fuchsia-200 shadow-fuchsia-500/20",
    speed: 0.35,
  },
  {
    code: "const offer = await verifyCandidate({\n  level: 'Hireable',\n  stars: 54,\n  role: 'Dream Career Unlocked'\n});",
    badge: "Apex Boss Citadel",
    top: 220,
    left: "8%",
    color: "border-amber-400/60 bg-amber-950/60 text-amber-200 shadow-amber-500/30",
    speed: 0.25,
  },
];

const SYNTAX_RUNES = [
  { symbol: "</>", x: "14%", y: 1950, color: "text-emerald-400/40", speed: 0.6 },
  { symbol: "{ }", x: "84%", y: 1780, color: "text-sky-400/40", speed: 0.5 },
  { symbol: "async", x: "20%", y: 1500, color: "text-cyan-400/35", speed: 0.7 },
  { symbol: "0x7F", x: "80%", y: 1250, color: "text-indigo-400/40", speed: 0.55 },
  { symbol: "λ =>", x: "12%", y: 960, color: "text-purple-400/40", speed: 0.65 },
  { symbol: "SQL", x: "86%", y: 680, color: "text-fuchsia-400/40", speed: 0.5 },
  { symbol: "👑", x: "18%", y: 380, color: "text-amber-400/45", speed: 0.4 },
];

export function DynamicCodingBackground({ scrollY }: DynamicCodingBackgroundProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Multi-Zone Vibrant Gamified Sky & Biome Gradient (Scrolls naturally with container) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 50% 8%, rgba(245, 158, 11, 0.28) 0%, rgba(236, 72, 153, 0.18) 25%, transparent 55%),
            radial-gradient(circle at 80% 35%, rgba(168, 85, 247, 0.24) 0%, rgba(99, 102, 241, 0.15) 30%, transparent 60%),
            radial-gradient(circle at 20% 62%, rgba(56, 189, 248, 0.24) 0%, rgba(6, 182, 212, 0.16) 30%, transparent 60%),
            radial-gradient(circle at 50% 88%, rgba(16, 185, 129, 0.26) 0%, rgba(20, 184, 166, 0.15) 35%, transparent 65%),
            linear-gradient(180deg, #1a103c 0%, #15193b 28%, #0c223d 58%, #0a292e 85%, #071c24 100%)
          `,
        }}
      />

      {/* 2. Parallax Cyber-Circuit Grid Overlay (Shifts at 0.3x scrollY) */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          transform: `translateY(${scrollY * 0.25}px)`,
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* 3. Secondary Hex / Dot Matrix Layer (Shifts at -0.15x scrollY for depth) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          transform: `translateY(${-scrollY * 0.15}px)`,
          backgroundImage: `radial-gradient(rgba(251, 191, 36, 0.35) 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 4. Giant Glowing Cyber-Moons & Biome Portals (Parallax 0.2x) */}
      <div
        style={{ transform: `translateY(${scrollY * 0.18}px)` }}
        className="absolute inset-0"
      >
        {/* Top Summit Golden Sun */}
        <div className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-b from-amber-400/20 via-fuchsia-500/15 to-transparent blur-3xl" />

        {/* Stage 3 Cloud Citadel Nebula */}
        <div className="absolute top-[600px] right-[8%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-purple-500/25 via-indigo-500/15 to-transparent blur-2xl" />

        {/* Stage 2 Telemetry Cyber-Ring */}
        <div className="absolute top-[1150px] left-[6%] w-[420px] h-[420px] rounded-full border border-sky-400/20 bg-gradient-to-br from-sky-500/15 to-cyan-500/5 blur-xl" />

        {/* Stage 1 Emerald Valley Glow */}
        <div className="absolute top-[1700px] left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-full bg-gradient-to-t from-emerald-500/25 via-teal-500/15 to-transparent blur-3xl" />
      </div>

      {/* 5. Isometric Circuit Mountains & Server Towers SVG Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        viewBox="0 0 1200 2200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cyberLine" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Left & Right Circuit Traces running up the world */}
        <path
          d="M 80 2200 L 80 1800 L 160 1720 L 160 1300 L 90 1220 L 90 750 L 180 660 L 180 200"
          fill="none"
          stroke="url(#cyberLine)"
          strokeWidth="3"
          strokeDasharray="12 6"
        />
        <path
          d="M 1120 2200 L 1120 1750 L 1040 1670 L 1040 1200 L 1110 1120 L 1110 650 L 1020 560 L 1020 150"
          fill="none"
          stroke="url(#cyberLine)"
          strokeWidth="3"
          strokeDasharray="12 6"
        />

        {/* Circuit Nodes */}
        {[300, 660, 1120, 1450, 1750, 2000].map((cy, idx) => (
          <g key={idx}>
            <circle cx="120" cy={cy} r="8" fill="#38bdf8" opacity="0.6" />
            <circle cx="1080" cy={cy - 80} r="8" fill="#10b981" opacity="0.6" />
          </g>
        ))}
      </svg>

      {/* 6. Floating Parallax Holographic Code Terminals (Move dynamically as you scroll!) */}
      {FLOATING_CODE_SHARDS.map((shard, idx) => (
        <div
          key={idx}
          style={{
            top: `${shard.top}px`,
            left: shard.left,
            transform: `translateY(${-scrollY * shard.speed * 0.45}px)`,
          }}
          className={`hidden lg:block absolute w-64 p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-transform duration-75 ${shard.color}`}
        >
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-85">
              {shard.badge}
            </span>
          </div>
          <pre className="text-[10px] font-mono leading-relaxed overflow-x-hidden whitespace-pre-wrap opacity-90">
            {shard.code}
          </pre>
        </div>
      ))}

      {/* 7. Floating Syntax Runes (Parallax) */}
      {SYNTAX_RUNES.map((rune, i) => (
        <div
          key={i}
          style={{
            top: `${rune.y}px`,
            left: rune.x,
            transform: `translateY(${-scrollY * rune.speed * 0.5}px)`,
          }}
          className={`absolute font-mono font-black text-2xl sm:text-4xl ${rune.color}`}
        >
          {rune.symbol}
        </div>
      ))}
    </div>
  );
}
