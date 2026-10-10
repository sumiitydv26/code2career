import { NextRequest, NextResponse } from "next/server";
import { NodeDetailSchema } from "@/lib/schema";
import { getMockNodeDetail } from "@/lib/mock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { goal, node } = body;

    if (!node || !node.id) {
      return NextResponse.json({ error: "Missing required node payload" }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      // Artificial delay (~1.5s) to simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockDetail = getMockNodeDetail(node.id, node.title, goal);
      const validated = NodeDetailSchema.safeParse(mockDetail);

      if (!validated.success) {
        console.error("NodeDetail validation error:", validated.error.issues);
        return NextResponse.json(
          { error: "Internal node detail validation failed", issues: validated.error.issues },
          { status: 500 }
        );
      }

      return NextResponse.json(validated.data);
    }

    // =========================================================================
    // TODO: call LLM here
    // Plug in your chosen AI provider (e.g. Google Gemini / OpenAI / Anthropic)
    // 1. Send system instructions with NodeDetailSchema JSON structure.
    // 2. Prompt with: goal: "${goal}", node: ${JSON.stringify(node)}.
    // 3. Receive JSON response containing:
    //    - whyItMatters (high-impact context)
    //    - weekendProject { title, description, deliverables: string[] }
    //    - resources [{ title, kind, searchHint }] (render searchHint as "Search: ...", never invented URLs)
    //    - interviewQuestions [{ question, difficulty, idealAnswerHint }]
    // 4. Validate output with NodeDetailSchema.parse(rawJson).
    // 5. Return validated NodeDetail.
    // =========================================================================

    const fallback = getMockNodeDetail(node.id, node.title, goal);
    return NextResponse.json(fallback);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch node advice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
