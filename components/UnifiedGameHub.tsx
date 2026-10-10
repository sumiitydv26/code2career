"use client";

import React from "react";
import { HudBar } from "./HudBar";
import { SagaMap } from "./SagaMap";
import { RoadmapCanvas } from "./RoadmapCanvas";
import { SidePanel } from "./SidePanel";
import { SorcererCompanion } from "./SorcererCompanion";
import { SorcererSanctumView } from "./SorcererSanctumView";
import { QuestForgeView } from "./QuestForgeView";
import { LeaderboardView } from "./LeaderboardView";
import { CompareArenaView } from "./CompareArenaView";
import { LevelChallengeModal } from "./LevelChallengeModal";
import { BadgeToast } from "./BadgeToast";
import { BossVictoryModal } from "./BossVictoryModal";
import { useQuestStore } from "@/store/useQuestStore";

export function UnifiedGameHub() {
  const {
    roadmap,
    xp,
    activeHubTab,
    toastBadge,
    clearToastBadge,
    showVictoryModal,
    closeVictoryModal,
  } = useQuestStore();

  const bossNode = roadmap.nodes.find((n) => n.type === "boss");

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden bg-[#0b0f19]">
      {/* Top Gamified HUD & 3D Arcade Navigation Deck */}
      <HudBar />

      {/* Main Unified Stage */}
      <main
        id="unified-stage-container"
        className="relative flex-1 w-full h-[calc(100vh-115px)] overflow-hidden"
      >
        {activeHubTab === "saga" && <SagaMap />}
        {activeHubTab === "sorcerer" && <SorcererSanctumView />}
        {activeHubTab === "forge" && <QuestForgeView />}
        {activeHubTab === "leaderboard" && <LeaderboardView />}
        {activeHubTab === "compare" && <CompareArenaView />}
        {activeHubTab === "graph" && <RoadmapCanvas />}

        {/* Collapsible Node Detail Side Panel / Bottom Sheet */}
        <SidePanel />

        {/* Floating Sorcerer Companion (shown on Map/Graph views for instant mentorship) */}
        {(activeHubTab === "saga" || activeHubTab === "graph") && <SorcererCompanion />}

        {/* Level Qualifying Challenge Modal (Candy Crush Level Trials) */}
        <LevelChallengeModal />
      </main>

      {/* Achievement Unlocked Toast */}
      <BadgeToast badge={toastBadge} onClose={clearToastBadge} />

      {/* Fullscreen Boss Victory Celebration Modal */}
      <BossVictoryModal
        isOpen={showVictoryModal}
        onClose={closeVictoryModal}
        bossTitle={bossNode?.title || "Dream Career Master"}
        totalXp={xp}
      />
    </div>
  );
}
