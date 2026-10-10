import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Roadmap, RoadmapNode, NodeDetail } from "@/lib/schema";
import {
  NodeStatus,
  StreakState,
  Badge,
  INITIAL_BADGES,
  resolveNodeStatuses,
  recordStreakActivity,
  isAnyPhaseFullyCleared,
  mergeRoadmapProgress,
} from "@/lib/game";
import { CLIMATE_TECH_ROADMAP } from "@/lib/mock";

export type HubTab = "saga" | "sorcerer" | "forge" | "leaderboard" | "compare" | "graph";

export interface Constraints {
  hoursPerWeek: number;
  months: number;
}

export interface CareerScoreRecord {
  goal: string;
  xp: number;
  stars: number;
  levelsCleared: number;
}

export interface QuestState {
  playerName: string;
  goal: string;
  roadmap: Roadmap;
  nodeStatus: Record<string, NodeStatus>;
  nodeStars: Record<string, number>; // 0 to 3 stars per level
  nodeDetailsCache: Record<string, NodeDetail>;
  xp: number;
  streak: StreakState;
  badges: Badge[];
  constraints: Constraints;
  careerScores: Record<string, CareerScoreRecord>;

  // Unified Interface Navigation
  activeHubTab: HubTab;
  selectedNodeId: string | null;
  activeChallengeNodeId: string | null;
  sorcererDialogueOpen: boolean;
  viewMode: "saga" | "graph";
  activeTab: "advice" | "boss_fight";
  completedQuizzesCount: number;
  showVictoryModal: boolean;
  toastBadge: Badge | null;

  // Actions
  setPlayerName: (name: string) => void;
  setActiveHubTab: (tab: HubTab) => void;
  setGoal: (goal: string) => void;
  setRoadmap: (roadmap: Roadmap) => void;
  setConstraints: (constraints: Partial<Constraints>) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setActiveChallengeNodeId: (nodeId: string | null) => void;
  setSorcererDialogueOpen: (open: boolean) => void;
  setViewMode: (mode: "saga" | "graph") => void;
  setActiveTab: (tab: "advice" | "boss_fight") => void;
  cacheNodeDetail: (detail: NodeDetail) => void;
  clearToastBadge: () => void;
  closeVictoryModal: () => void;

  startNode: (nodeId: string) => void;
  markCompleted: (nodeId: string) => void;
  completeLevelChallenge: (nodeId: string, stars: number) => void;
  toggleKnown: (nodeId: string) => void;
  recordQuizVictory: (nodeId: string, bonusXp: number) => void;
  replanRoadmap: (newRoadmap: Roadmap) => void;
  resetQuest: () => void;
}

function buildInitialStatuses(nodes: RoadmapNode[]): Record<string, NodeStatus> {
  const map: Record<string, NodeStatus> = {};
  for (const node of nodes) {
    map[node.id] = node.prerequisites.length === 0 ? "available" : "locked";
  }
  return resolveNodeStatuses(nodes, map);
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      playerName: "You (Rising Apprentice)",
      goal: CLIMATE_TECH_ROADMAP.goal,
      roadmap: CLIMATE_TECH_ROADMAP,
      nodeStatus: buildInitialStatuses(CLIMATE_TECH_ROADMAP.nodes),
      nodeStars: {},
      nodeDetailsCache: {},
      xp: 350,
      streak: { count: 3, lastActiveDate: new Date().toISOString().split("T")[0] },
      badges: INITIAL_BADGES,
      constraints: { hoursPerWeek: 12, months: 6 },
      careerScores: {},

      activeHubTab: "saga",
      selectedNodeId: null,
      activeChallengeNodeId: null,
      sorcererDialogueOpen: false,
      viewMode: "saga",
      activeTab: "advice",
      completedQuizzesCount: 0,
      showVictoryModal: false,
      toastBadge: null,

      setPlayerName: (name: string) => set({ playerName: name }),

      setActiveHubTab: (tab: HubTab) => set({ activeHubTab: tab }),

      setGoal: (goal: string) => set({ goal }),

      setRoadmap: (roadmap: Roadmap) => {
        set({
          roadmap,
          goal: roadmap.goal,
          nodeStatus: buildInitialStatuses(roadmap.nodes),
          nodeStars: {},
          nodeDetailsCache: {},
          selectedNodeId: null,
          activeChallengeNodeId: null,
          showVictoryModal: false,
          activeHubTab: "saga",
        });
      },

      setConstraints: (c) => set((s) => ({ constraints: { ...s.constraints, ...c } })),

      setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

      setActiveChallengeNodeId: (nodeId) => set({ activeChallengeNodeId: nodeId }),

      setSorcererDialogueOpen: (open) => set({ sorcererDialogueOpen: open }),

      setViewMode: (mode) =>
        set({
          viewMode: mode,
          activeHubTab: mode === "graph" ? "graph" : "saga",
        }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      cacheNodeDetail: (detail) =>
        set((s) => ({
          nodeDetailsCache: { ...s.nodeDetailsCache, [detail.nodeId]: detail },
        })),

      clearToastBadge: () => set({ toastBadge: null }),

      closeVictoryModal: () => set({ showVictoryModal: false }),

      startNode: (nodeId) => {
        const { nodeStatus, roadmap } = get();
        if (nodeStatus[nodeId] === "available") {
          const next = { ...nodeStatus, [nodeId]: "in_progress" as NodeStatus };
          set({ nodeStatus: resolveNodeStatuses(roadmap.nodes, next) });
        }
      },

      completeLevelChallenge: (nodeId: string, stars: number) => {
        const { nodeStatus, nodeStars, roadmap, xp, streak, badges, goal, careerScores } = get();
        const node = roadmap.nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const nextStatus = resolveNodeStatuses(roadmap.nodes, {
          ...nodeStatus,
          [nodeId]: "completed",
        });

        const earnedStars = Math.max(stars, nodeStars[nodeId] || 0);
        const nextStarsMap = { ...nodeStars, [nodeId]: earnedStars };
        const starBonusXp = stars === 3 ? 150 : stars === 2 ? 75 : 25;
        const addedXp = node.xp + starBonusXp;
        const newXp = xp + addedXp;
        const newStreak = recordStreakActivity(streak);

        const totalStarsNow = Object.values(nextStarsMap).reduce((a, b) => a + b, 0);
        const clearedNow = Object.values(nextStatus).filter(
          (s) => s === "completed" || s === "known"
        ).length;

        const now = new Date().toISOString();
        let newToastBadge: Badge | null = null;
        const isBossVictory = node.type === "boss";

        const updatedBadges = badges.map((b) => {
          if (b.id === "first_step" && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          if (b.id === "on_fire" && newStreak.count >= 3 && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          if (b.id === "dream_job_unlocked" && node.type === "boss" && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          return b;
        });

        if (isAnyPhaseFullyCleared(roadmap, nextStatus)) {
          const phaseBadge = updatedBadges.find((b) => b.id === "phase_clear");
          if (phaseBadge && !phaseBadge.unlockedAt) {
            phaseBadge.unlockedAt = now;
            newToastBadge = phaseBadge;
          }
        }

        set({
          nodeStatus: nextStatus,
          nodeStars: nextStarsMap,
          xp: newXp,
          streak: newStreak,
          badges: updatedBadges,
          careerScores: {
            ...careerScores,
            [goal]: {
              goal,
              xp: newXp,
              stars: totalStarsNow,
              levelsCleared: clearedNow,
            },
          },
          toastBadge: newToastBadge || get().toastBadge,
          showVictoryModal: isBossVictory ? true : get().showVictoryModal,
          activeChallengeNodeId: null,
        });
      },

      markCompleted: (nodeId) => {
        const { nodeStatus, roadmap, xp, streak, badges, nodeStars, goal, careerScores } = get();
        const node = roadmap.nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const currentSt = nodeStatus[nodeId];
        if (currentSt === "completed") return;

        const nextStatus = resolveNodeStatuses(roadmap.nodes, {
          ...nodeStatus,
          [nodeId]: "completed",
        });

        const nextStarsMap = { ...nodeStars, [nodeId]: nodeStars[nodeId] || 3 };
        const addedXp = currentSt === "known" ? Math.round(node.xp * 0.5) : node.xp;
        const newXp = xp + addedXp;
        const newStreak = recordStreakActivity(streak);

        const totalStarsNow = Object.values(nextStarsMap).reduce((a, b) => a + b, 0);
        const clearedNow = Object.values(nextStatus).filter(
          (s) => s === "completed" || s === "known"
        ).length;

        const now = new Date().toISOString();
        let newToastBadge: Badge | null = null;
        const isBossVictory = node.type === "boss";

        const updatedBadges = badges.map((b) => {
          if (b.id === "first_step" && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          if (b.id === "on_fire" && newStreak.count >= 3 && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          if (b.id === "dream_job_unlocked" && node.type === "boss" && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          return b;
        });

        if (isAnyPhaseFullyCleared(roadmap, nextStatus)) {
          const phaseBadge = updatedBadges.find((b) => b.id === "phase_clear");
          if (phaseBadge && !phaseBadge.unlockedAt) {
            phaseBadge.unlockedAt = now;
            newToastBadge = phaseBadge;
          }
        }

        set({
          nodeStatus: nextStatus,
          nodeStars: nextStarsMap,
          xp: newXp,
          streak: newStreak,
          badges: updatedBadges,
          careerScores: {
            ...careerScores,
            [goal]: {
              goal,
              xp: newXp,
              stars: totalStarsNow,
              levelsCleared: clearedNow,
            },
          },
          toastBadge: newToastBadge || get().toastBadge,
          showVictoryModal: isBossVictory ? true : get().showVictoryModal,
        });
      },

      toggleKnown: (nodeId) => {
        const { nodeStatus, roadmap, xp, nodeStars } = get();
        const node = roadmap.nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const isCurrentlyKnown = nodeStatus[nodeId] === "known";
        const nextMap: Record<string, NodeStatus> = { ...nodeStatus };
        let newXp = xp;

        if (isCurrentlyKnown) {
          nextMap[nodeId] = node.prerequisites.length === 0 ? "available" : "locked";
          newXp = Math.max(0, xp - Math.round(node.xp * 0.5));
        } else {
          nextMap[nodeId] = "known";
          newXp = xp + Math.round(node.xp * 0.5);
        }

        set({
          nodeStatus: resolveNodeStatuses(roadmap.nodes, nextMap),
          nodeStars: { ...nodeStars, [nodeId]: isCurrentlyKnown ? 0 : 2 },
          xp: newXp,
        });
      },

      recordQuizVictory: (nodeId, bonusXp) => {
        const { xp, badges, completedQuizzesCount } = get();
        const nextCount = completedQuizzesCount + 1;
        const now = new Date().toISOString();
        let newToastBadge: Badge | null = null;

        const updatedBadges = badges.map((b) => {
          if (b.id === "polyglot_interviewer" && nextCount >= 3 && !b.unlockedAt) {
            newToastBadge = { ...b, unlockedAt: now };
            return newToastBadge;
          }
          return b;
        });

        set({
          xp: xp + bonusXp,
          completedQuizzesCount: nextCount,
          badges: updatedBadges,
          toastBadge: newToastBadge || get().toastBadge,
        });
      },

      replanRoadmap: (newRoadmap: Roadmap) => {
        const { roadmap, nodeStatus } = get();
        const mergedStatuses = mergeRoadmapProgress(roadmap.nodes, nodeStatus, newRoadmap);
        set({
          roadmap: newRoadmap,
          goal: newRoadmap.goal,
          nodeStatus: mergedStatuses,
          selectedNodeId: null,
          activeChallengeNodeId: null,
        });
      },

      resetQuest: () => {
        const { roadmap } = get();
        set({
          nodeStatus: buildInitialStatuses(roadmap.nodes),
          nodeStars: {},
          xp: 0,
          streak: { count: 0, lastActiveDate: null },
          badges: INITIAL_BADGES,
          selectedNodeId: null,
          activeChallengeNodeId: null,
          nodeDetailsCache: {},
          completedQuizzesCount: 0,
          showVictoryModal: false,
          toastBadge: null,
        });
      },
    }),
    {
      name: "career_quest_store_v3",
    }
  )
);
