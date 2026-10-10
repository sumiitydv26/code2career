import { Roadmap, RoadmapNode } from "./schema";

export type NodeStatus = "locked" | "available" | "in_progress" | "completed" | "known";

export interface StreakState {
  count: number;
  lastActiveDate: string | null; // ISO YYYY-MM-DD
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export const INITIAL_BADGES: Badge[] = [
  { id: "first_step", name: "First Step", description: "Completed your first skill node", icon: "🌱", unlockedAt: null },
  { id: "phase_clear", name: "Phase Clear", description: "Mastered all nodes in an entire phase", icon: "⭐", unlockedAt: null },
  { id: "polyglot_interviewer", name: "Polyglot Interviewer", description: "Conquered 3 boss-fight quizzes", icon: "🎙️", unlockedAt: null },
  { id: "on_fire", name: "On Fire", description: "Achieved a 3-day quest streak", icon: "🔥", unlockedAt: null },
  { id: "dream_job_unlocked", name: "Dream Job Unlocked", description: "Completed the ultimate Boss node!", icon: "👑", unlockedAt: null },
];

/**
 * Calculates current player level based on XP:
 * level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculates Rank title based on level:
 * 1-2 Novice, 3-4 Apprentice, 5-6 Builder, 7+ Hireable
 */
export function calculateRank(level: number): string {
  if (level <= 2) return "Novice";
  if (level <= 4) return "Apprentice";
  if (level <= 6) return "Builder";
  return "Hireable";
}

/**
 * Calculates current level XP boundaries for progress bars.
 */
export function getLevelProgress(xp: number): {
  currentLevel: number;
  nextLevelXp: number;
  levelXpStart: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(xp);
  const levelXpStart = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  const span = nextLevelXp - levelXpStart;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((xp - levelXpStart) / span) * 100)));

  return { currentLevel, nextLevelXp, levelXpStart, progressPercent };
}

/**
 * Dependency resolution:
 * A node is "available" if EVERY prerequisite is completed or known.
 * Un-marking or re-locking properly cascades to dependents.
 */
export function resolveNodeStatuses(
  nodes: RoadmapNode[],
  currentStatusMap: Record<string, NodeStatus>
): Record<string, NodeStatus> {
  const nextStatus: Record<string, NodeStatus> = { ...currentStatusMap };

  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      const existing = nextStatus[node.id];
      const isFinished = existing === "completed" || existing === "known";
      if (isFinished) continue;

      const allPrereqsMet = node.prerequisites.every((prereqId) => {
        const pStatus = nextStatus[prereqId];
        return pStatus === "completed" || pStatus === "known";
      });

      if (allPrereqsMet) {
        if (existing === "locked" || !existing) {
          nextStatus[node.id] = "available";
          changed = true;
        }
      } else {
        if (existing !== "locked") {
          nextStatus[node.id] = "locked";
          changed = true;
        }
      }
    }
  }

  return nextStatus;
}

/**
 * Computes remaining hours and estimated weeks.
 */
export function calculateRemainingWork(
  nodes: RoadmapNode[],
  statusMap: Record<string, NodeStatus>,
  hoursPerWeek: number = 10
): { remainingHours: number; remainingWeeks: number; completionPercent: number } {
  let remainingHours = 0;
  let totalHours = 0;
  let finishedCount = 0;

  for (const node of nodes) {
    totalHours += node.estHours;
    const st = statusMap[node.id];
    if (st === "completed" || st === "known") {
      finishedCount++;
    } else {
      remainingHours += node.estHours;
    }
  }

  const completionPercent = nodes.length > 0 ? Math.round((finishedCount / nodes.length) * 100) : 0;
  const safeHoursPerWeek = Math.max(1, hoursPerWeek);
  const remainingWeeks = Math.ceil(remainingHours / safeHoursPerWeek);

  return { remainingHours, remainingWeeks, completionPercent };
}

/**
 * Updates streak when an activity is completed on a new day.
 */
export function recordStreakActivity(currentStreak: StreakState): StreakState {
  const today = new Date().toISOString().split("T")[0];
  if (!currentStreak.lastActiveDate) {
    return { count: 1, lastActiveDate: today };
  }
  if (currentStreak.lastActiveDate === today) {
    return currentStreak;
  }

  const lastDate = new Date(currentStreak.lastActiveDate);
  const currDate = new Date(today);
  const diffTime = currDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return { count: currentStreak.count + 1, lastActiveDate: today };
  } else {
    // Missed a day
    return { count: 1, lastActiveDate: today };
  }
}

/**
 * Checks if all nodes in any phase are completed or known.
 */
export function isAnyPhaseFullyCleared(
  roadmap: Roadmap,
  statusMap: Record<string, NodeStatus>
): boolean {
  for (const phase of roadmap.phases) {
    const phaseNodes = roadmap.nodes.filter((n) => n.phaseId === phase.id);
    if (phaseNodes.length === 0) continue;
    const allCleared = phaseNodes.every((n) => {
      const st = statusMap[n.id];
      return st === "completed" || st === "known";
    });
    if (allCleared) return true;
  }
  return false;
}

/**
 * Re-plan merger: merges new roadmap nodes with existing progress by matching normalized titles.
 */
export function mergeRoadmapProgress(
  oldNodes: RoadmapNode[],
  oldStatuses: Record<string, NodeStatus>,
  newRoadmap: Roadmap
): Record<string, NodeStatus> {
  const titleToOldStatus = new Map<string, NodeStatus>();
  for (const oldNode of oldNodes) {
    const st = oldStatuses[oldNode.id];
    if (st) {
      titleToOldStatus.set(oldNode.title.trim().toLowerCase(), st);
    }
  }

  const mergedStatuses: Record<string, NodeStatus> = {};
  for (const newNode of newRoadmap.nodes) {
    const matched = titleToOldStatus.get(newNode.title.trim().toLowerCase());
    if (matched) {
      mergedStatuses[newNode.id] = matched;
    } else {
      mergedStatuses[newNode.id] = newNode.prerequisites.length === 0 ? "available" : "locked";
    }
  }

  return resolveNodeStatuses(newRoadmap.nodes, mergedStatuses);
}
