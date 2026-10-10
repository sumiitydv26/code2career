"use client";

import React from "react";

export type BackgroundVariantType = "sorcerer" | "forge" | "leaderboard" | "compare" | "graph";

interface ThemedViewBackgroundProps {
  variant: BackgroundVariantType;
  scrollY?: number;
  panX?: number;
  panY?: number;
  zoom?: number;
}

export function ThemedViewBackground({
  variant,
  scrollY = 0,
  panX = 0,
  panY = 0,
  zoom = 1,
}: ThemedViewBackgroundProps) {
  // 1. SORCERER MENTOR SANCTUM: Cyber-Arcane Observatory & Rotating Spell Mandalas
  if (variant === "sorcerer") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Mystic Arcane Nebula Base */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 18% 22%, rgba(168, 85, 247, 0.28) 0%, rgba(99, 102, 241, 0.16) 35%, transparent 65%),
              radial-gradient(circle at 82% 75%, rgba(56, 189, 248, 0.26) 0%, rgba(14, 165, 233, 0.14) 35%, transparent 65%),
              radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 60%),
              linear-gradient(160deg, #160c2e 0%, #0e1736 50%, #190e2e 100%)
            `,
          }}
        />

        {/* Parallax Arcane Sacred Geometry Grid */}
        <div
          className="absolute -inset-40 opacity-30"
          style={{
            transform: `translateY(${-scrollY * 0.25}px)`,
            backgroundImage: `
              radial-gradient(rgba(168, 85, 247, 0.45) 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Giant Rotating & Parallax-Scrolling Spell Circles (SVG) */}
        <svg
          className="absolute top-12 left-8 w-[460px] h-[460px] opacity-25"
          style={{
            transform: `translateY(${-scrollY * 0.35}px) rotate(${scrollY * 0.15}deg)`,
          }}
          viewBox="0 0 400 400"
        >
          <circle cx="200" cy="200" r="180" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="12 8" />
          <circle cx="200" cy="200" r="145" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <polygon points="200,30 347,285 53,285" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
          <polygon points="200,370 347,115 53,115" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
          <circle cx="200" cy="200" r="90" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
        </svg>

        <svg
          className="absolute bottom-10 right-10 w-[500px] h-[500px] opacity-25"
          style={{
            transform: `translateY(${-scrollY * 0.2}px) rotate(${-scrollY * 0.12}deg)`,
          }}
          viewBox="0 0 400 400"
        >
          <circle cx="200" cy="200" r="175" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="15 10" />
          <rect x="75" y="75" width="250" height="250" fill="none" stroke="#a855f7" strokeWidth="1.5" transform="rotate(45 200 200)" />
          <rect x="75" y="75" width="250" height="250" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="#fbbf24" strokeWidth="2" />
        </svg>

        {/* Floating Grimoire Code Spell Scrolls */}
        {[
          {
            title: "SPELL I: IDEMPOTENT ALCHEMY",
            code: "const lock = await acquireDistributedLock(txId);\nif (lock.alreadyProcessed) return cachedReceipt;",
            x: "3%",
            y: 180,
            speed: 0.45,
            color: "border-purple-400/40 bg-purple-950/50 text-purple-200",
          },
          {
            title: "SPELL II: NEURAL ATTENTION WARD",
            code: "scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\nweights = F.softmax(scores, dim=-1)",
            x: "76%",
            y: 360,
            speed: 0.35,
            color: "border-sky-400/40 bg-sky-950/50 text-sky-200",
          },
          {
            title: "SPELL III: ZERO-TRUST AEGIS",
            code: "verifyMTLS({ spiffeId: peer.cert.uri, policy: 'STRICT_ENFORCE' });",
            x: "4%",
            y: 620,
            speed: 0.55,
            color: "border-amber-400/40 bg-amber-950/50 text-amber-200",
          },
        ].map((scroll, idx) => (
          <div
            key={idx}
            style={{
              top: `${scroll.y}px`,
              left: scroll.x,
              transform: `translateY(${-scrollY * scroll.speed}px)`,
            }}
            className={`hidden xl:block absolute w-60 p-3 rounded-2xl border backdrop-blur-md shadow-2xl ${scroll.color}`}
          >
            <div className="text-[9px] font-mono font-black uppercase tracking-wider mb-1 opacity-80">
              📜 {scroll.title}
            </div>
            <pre className="text-[10px] font-mono whitespace-pre-wrap leading-tight opacity-85">
              {scroll.code}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  // 2. LAUNCH CAREER QUESTS (QUEST FORGE): Cyber-Smithy & Hexagonal Blueprint Nexus
  if (variant === "forge") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Molten Gold, Emerald & Plasma Forge Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 35%, transparent 65%),
              radial-gradient(circle at 15% 70%, rgba(245, 158, 11, 0.25) 0%, rgba(234, 88, 12, 0.14) 35%, transparent 65%),
              radial-gradient(circle at 85% 65%, rgba(236, 72, 153, 0.24) 0%, rgba(168, 85, 247, 0.14) 35%, transparent 65%),
              linear-gradient(180deg, #09222c 0%, #111833 55%, #211224 100%)
            `,
          }}
        />

        {/* Parallax Blueprint CAD Grid */}
        <div
          className="absolute -inset-40 opacity-35"
          style={{
            transform: `translateY(${-scrollY * 0.3}px)`,
            backgroundImage: `
              linear-gradient(to right, rgba(16, 185, 129, 0.16) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.16) 1px, transparent 1px),
              linear-gradient(to right, rgba(56, 189, 248, 0.06) 11px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 11px, transparent 1px)
            `,
            backgroundSize: "88px 88px, 88px 88px, 22px 22px, 22px 22px",
          }}
        />

        {/* Dimensional Career Portal Rings */}
        <div
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
          className="absolute inset-0"
        >
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] rounded-full border-2 border-emerald-400/20 bg-emerald-500/5 blur-xl" />
          <div className="absolute top-[520px] left-[10%] w-[360px] h-[360px] rounded-full border border-amber-400/25 bg-amber-500/10 blur-2xl" />
          <div className="absolute top-[540px] right-[10%] w-[360px] h-[360px] rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 blur-2xl" />
        </div>

        {/* Floating Career Architecture Schematics */}
        {[
          { tag: "FORGE_SPEC // CLIMATE_GRID", val: "Nodes: 18 | XP: 4,880", x: "3%", y: 140, speed: 0.4 },
          { tag: "FORGE_SPEC // MULTIMODAL_AI", val: "GPUs: H100x64 | vLLM", x: "80%", y: 220, speed: 0.5 },
          { tag: "FORGE_SPEC // ZERO_TRUST_SEC", val: "mTLS + eBPF Kernel", x: "2%", y: 580, speed: 0.35 },
          { tag: "FORGE_SPEC // HFT_LEDGER", val: "10,000 TPS ACID Core", x: "81%", y: 660, speed: 0.45 },
        ].map((spec, i) => (
          <div
            key={i}
            style={{
              top: `${spec.y}px`,
              left: spec.x,
              transform: `translateY(${-scrollY * spec.speed}px)`,
            }}
            className="hidden xl:block absolute px-3.5 py-2.5 rounded-xl border border-emerald-400/40 bg-slate-950/75 text-emerald-300 font-mono text-[10px] shadow-lg backdrop-blur-md"
          >
            <div className="font-bold text-amber-300">{spec.tag}</div>
            <div className="text-slate-300 mt-0.5">{spec.val}</div>
          </div>
        ))}
      </div>
    );
  }

  // 3. LEADERBOARD (HALL OF CHAMPIONS): Golden Coliseum & Victory Spotlights
  if (variant === "leaderboard") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Royal Gold, Crimson & Stadium Night Sky */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 10%, rgba(251, 191, 36, 0.32) 0%, rgba(245, 158, 11, 0.16) 35%, transparent 65%),
              radial-gradient(circle at 12% 55%, rgba(56, 189, 248, 0.22) 0%, transparent 55%),
              radial-gradient(circle at 88% 55%, rgba(236, 72, 153, 0.22) 0%, transparent 55%),
              linear-gradient(180deg, #261808 0%, #16132b 50%, #0b1829 100%)
            `,
          }}
        />

        {/* Diagonal Coliseum Spotlight Beams */}
        <div
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute -top-20 left-1/4 w-32 h-[900px] bg-gradient-to-b from-amber-300/35 to-transparent transform -rotate-25 blur-2xl" />
          <div className="absolute -top-20 right-1/4 w-32 h-[900px] bg-gradient-to-b from-amber-300/35 to-transparent transform rotate-25 blur-2xl" />
        </div>

        {/* Golden Diamond Trophy Matrix (Parallax) */}
        <div
          className="absolute -inset-40 opacity-30"
          style={{
            transform: `translateY(${-scrollY * 0.28}px)`,
            backgroundImage: `
              radial-gradient(rgba(251, 191, 36, 0.5) 2px, transparent 2px),
              linear-gradient(45deg, rgba(245, 158, 11, 0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(245, 158, 11, 0.1) 25%, transparent 25%)
            `,
            backgroundSize: "52px 52px",
          }}
        />

        {/* Floating Victory Ticker Badges */}
        {[
          { text: "🏆 TOP GUILD: CLIMATE TECH (4,800 XP)", x: "3%", y: 180, speed: 0.45 },
          { text: "🔥 LONGEST STREAK: PRIYA PATEL (19d)", x: "77%", y: 260, speed: 0.35 },
          { text: "⭐ 54/54 PERFECT STARS REWARD: +1,000 XP", x: "4%", y: 540, speed: 0.5 },
          { text: "👑 RANK 7+ UNLOCKS HIREABLE STATUS", x: "78%", y: 640, speed: 0.4 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              top: `${b.y}px`,
              left: b.x,
              transform: `translateY(${-scrollY * b.speed}px)`,
            }}
            className="hidden xl:block absolute px-3.5 py-2 rounded-full border border-amber-400/50 bg-amber-950/70 text-amber-200 font-mono text-[10px] font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            {b.text}
          </div>
        ))}
      </div>
    );
  }

  // 4. COMPARE PATHS ARENA: Split-Spectrum Quantum Synapse (Left Cyan vs Right Fuchsia + Center Emerald Overlap)
  if (variant === "compare") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Dual Spectrum Gradient: Left Sky-Blue, Center Emerald Overlap, Right Fuchsia */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 18% 45%, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.14) 38%, transparent 68%),
              radial-gradient(circle at 82% 45%, rgba(236, 72, 153, 0.28) 0%, rgba(168, 85, 247, 0.14) 38%, transparent 68%),
              radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.22) 0%, transparent 55%),
              linear-gradient(90deg, #072235 0%, #092624 50%, #290c26 100%)
            `,
          }}
        />

        {/* Interlocking Quantum Wave Grid (Parallax) */}
        <div
          className="absolute -inset-40 opacity-30"
          style={{
            transform: `translateY(${-scrollY * 0.25}px)`,
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(236, 72, 153, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Center Convergence Venn Rings SVG */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[460px] opacity-25"
          style={{
            transform: `translate(-50%, calc(-50% + ${-scrollY * 0.2}px))`,
          }}
          viewBox="0 0 760 460"
        >
          <circle cx="270" cy="230" r="190" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="10 6" />
          <circle cx="490" cy="230" r="190" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="10 6" />
          <ellipse cx="380" cy="230" rx="85" ry="155" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 5. SKILL TREE GRAPH: Deep-Space Neural Constellation (Reacts to Pan X/Y & Zoom!)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at calc(30% + ${panX * 0.04}px) calc(35% + ${panY * 0.04}px), rgba(56, 189, 248, 0.26) 0%, transparent 55%),
            radial-gradient(circle at calc(75% + ${panX * 0.04}px) calc(65% + ${panY * 0.04}px), rgba(236, 72, 153, 0.24) 0%, transparent 55%),
            radial-gradient(circle at calc(50% + ${panX * 0.02}px) calc(20% + ${panY * 0.02}px), rgba(168, 85, 247, 0.22) 0%, transparent 50%),
            linear-gradient(135deg, #09152b 0%, #12102e 50%, #091e26 100%)
          `,
        }}
      />

      {/* Pan-Reactive Neural Starfield */}
      <div
        className="absolute -inset-[400px] opacity-35"
        style={{
          transform: `translate(${panX * 0.25}px, ${panY * 0.25}px) scale(${0.85 + zoom * 0.15})`,
          backgroundImage: `
            radial-gradient(rgba(56, 189, 248, 0.65) 1.5px, transparent 1.5px),
            radial-gradient(rgba(251, 191, 36, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px, 96px 96px",
          backgroundPosition: "0 0, 32px 32px",
        }}
      />
    </div>
  );
}
