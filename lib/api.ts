import { Roadmap, NodeDetail, RoadmapNode, RoadmapSchema, NodeDetailSchema } from "./schema";
import { getRoadmapForGoal, CLIMATE_TECH_ROADMAP, getMockNodeDetail } from "./mock";

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

async function fetchWithTimeout(url: string, options: FetchWithTimeoutOptions = {}): Promise<Response> {
  const { timeoutMs = 30000, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface GenerateRoadmapPayload {
  goal: string;
  hoursPerWeek?: number;
  months?: number;
  knownSkills?: string[];
}

export async function generateRoadmap(payload: GenerateRoadmapPayload): Promise<Roadmap> {
  try {
    const res = await fetchWithTimeout("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeoutMs: 8000,
    });

    if (res.ok) {
      const json = await res.json();
      const validated = RoadmapSchema.safeParse(json);
      if (validated.success) {
        return validated.data;
      }
    }
  } catch {
    // Static hosting (GitHub Pages) fallback below
  }

  // Fallback for static deployments (e.g. GitHub Pages)
  await new Promise((resolve) => setTimeout(resolve, 900));
  const fallback = getRoadmapForGoal(payload.goal || CLIMATE_TECH_ROADMAP.goal);
  return RoadmapSchema.parse(fallback);
}

export interface FetchNodeDetailPayload {
  goal: string;
  node: RoadmapNode;
}

export async function fetchNodeDetail(payload: FetchNodeDetailPayload): Promise<NodeDetail> {
  try {
    const res = await fetchWithTimeout("/api/node-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeoutMs: 8000,
    });

    if (res.ok) {
      const json = await res.json();
      const validated = NodeDetailSchema.safeParse(json);
      if (validated.success) {
        return validated.data;
      }
    }
  } catch {
    // Static hosting (GitHub Pages) fallback below
  }

  // Fallback for static deployments (e.g. GitHub Pages)
  await new Promise((resolve) => setTimeout(resolve, 800));
  const fallback = getMockNodeDetail(payload.node.id, payload.node.title, payload.goal);
  return NodeDetailSchema.parse(fallback);
}

