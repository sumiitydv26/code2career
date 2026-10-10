import { Roadmap, NodeDetail, RoadmapNode, RoadmapSchema, NodeDetailSchema } from "./schema";

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

async function requestWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      // Wait 1s and retry once
      await new Promise((r) => setTimeout(r, 1000));
      return await fn();
    }
    throw error;
  }
}

export interface GenerateRoadmapPayload {
  goal: string;
  hoursPerWeek?: number;
  months?: number;
  knownSkills?: string[];
}

export async function generateRoadmap(payload: GenerateRoadmapPayload): Promise<Roadmap> {
  return requestWithRetry(async () => {
    const res = await fetchWithTimeout("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeoutMs: 30000,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to generate roadmap (HTTP ${res.status})`);
    }

    const json = await res.json();
    const validated = RoadmapSchema.safeParse(json);
    if (!validated.success) {
      console.error("Roadmap validation issues:", validated.error.issues);
      throw new Error(`Invalid roadmap data received: ${validated.error.issues[0]?.message || "Validation failed"}`);
    }

    return validated.data;
  }, 1);
}

export interface FetchNodeDetailPayload {
  goal: string;
  node: RoadmapNode;
}

export async function fetchNodeDetail(payload: FetchNodeDetailPayload): Promise<NodeDetail> {
  return requestWithRetry(async () => {
    const res = await fetchWithTimeout("/api/node-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeoutMs: 30000,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to fetch node advice (HTTP ${res.status})`);
    }

    const json = await res.json();
    const validated = NodeDetailSchema.safeParse(json);
    if (!validated.success) {
      console.error("NodeDetail validation issues:", validated.error.issues);
      throw new Error(`Invalid node advice data received: ${validated.error.issues[0]?.message || "Validation failed"}`);
    }

    return validated.data;
  }, 1);
}
