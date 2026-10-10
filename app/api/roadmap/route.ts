import { NextRequest, NextResponse } from "next/server";
import { RoadmapSchema } from "@/lib/schema";
import { getRoadmapForGoal, CLIMATE_TECH_ROADMAP } from "@/lib/mock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { goal, hoursPerWeek = 10, months = 6, knownSkills = [] } = body;

    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      // Artificial delay (~1.2s) to simulate realistic AI generation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const matchedRoadmap = getRoadmapForGoal(goal || CLIMATE_TECH_ROADMAP.goal);

      const validated = RoadmapSchema.safeParse(matchedRoadmap);
      if (!validated.success) {
        console.error("Roadmap mock validation error:", validated.error.issues);
        return NextResponse.json(
          { error: "Internal roadmap validation failed", issues: validated.error.issues },
          { status: 500 }
        );
      }

      return NextResponse.json(validated.data);
    }

    // =========================================================================
    // TODO: call LLM here
    // Plug in your chosen AI provider (e.g. Google Gemini / OpenAI / Anthropic)
    // =========================================================================

    return NextResponse.json(getRoadmapForGoal(goal || CLIMATE_TECH_ROADMAP.goal));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate career roadmap";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
