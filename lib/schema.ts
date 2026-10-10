import { z } from "zod";

export const PhaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
});

export const NodeTypeSchema = z.enum([
  "skill",
  "role",
  "project",
  "certification",
  "boss",
]);

export const RoadmapNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: NodeTypeSchema,
  phaseId: z.string().min(1),
  description: z.string(),
  estHours: z.number().nonnegative(),
  xp: z.number().positive(),
  difficulty: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  prerequisites: z.array(z.string()),
});

export const RoadmapSchema = z
  .object({
    goal: z.string().min(3),
    summary: z.string(),
    totalWeeks: z.number().positive(),
    phases: z.array(PhaseSchema).min(1),
    nodes: z.array(RoadmapNodeSchema).min(1),
  })
  .superRefine((data, ctx) => {
    // Rule 1: Exactly one "boss" node
    const bossNodes = data.nodes.filter((n) => n.type === "boss");
    if (bossNodes.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Roadmap must contain exactly one boss node, found ${bossNodes.length}.`,
        path: ["nodes"],
      });
      return;
    }

    const bossNode = bossNodes[0];

    // Rule 2: Boss node must have no dependents
    const bossDependents = data.nodes.filter((n) =>
      n.prerequisites.includes(bossNode.id)
    );
    if (bossDependents.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Boss node "${bossNode.title}" cannot be a prerequisite for other nodes.`,
        path: ["nodes"],
      });
    }

    // Rule 3: Every node must be reachable from at least one root node
    const roots = data.nodes.filter((n) => n.prerequisites.length === 0);
    if (roots.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Roadmap must have at least one root node with no prerequisites.",
        path: ["nodes"],
      });
      return;
    }

    const reachable = new Set<string>();
    const queue = roots.map((r) => r.id);
    queue.forEach((id) => reachable.add(id));

    // Adjacency list: prereq -> dependents
    const adj = new Map<string, string[]>();
    data.nodes.forEach((n) => {
      n.prerequisites.forEach((pId) => {
        if (!adj.has(pId)) adj.set(pId, []);
        adj.get(pId)!.push(n.id);
      });
    });

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const children = adj.get(curr) || [];
      for (const childId of children) {
        if (!reachable.has(childId)) {
          reachable.add(childId);
          queue.push(childId);
        }
      }
    }

    const unreachableNodes = data.nodes.filter((n) => !reachable.has(n.id));
    if (unreachableNodes.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Nodes not reachable from roots: ${unreachableNodes.map((n) => n.title).join(", ")}`,
        path: ["nodes"],
      });
    }
  });

export const ResourceKindSchema = z.enum(["course", "docs", "repo", "book", "video"]);

export const NodeDetailSchema = z.object({
  nodeId: z.string().min(1),
  whyItMatters: z.string().min(1),
  weekendProject: z.object({
    title: z.string().min(1),
    description: z.string(),
    deliverables: z.array(z.string()).min(1),
  }),
  resources: z.array(
    z.object({
      title: z.string().min(1),
      kind: ResourceKindSchema,
      searchHint: z.string().min(1),
    })
  ),
  interviewQuestions: z.array(
    z.object({
      question: z.string().min(1),
      difficulty: z.enum(["easy", "medium", "hard"]),
      idealAnswerHint: z.string().min(1),
    })
  ),
});

export type Phase = z.infer<typeof PhaseSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
export type RoadmapNode = z.infer<typeof RoadmapNodeSchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;
export type ResourceKind = z.infer<typeof ResourceKindSchema>;
export type NodeDetail = z.infer<typeof NodeDetailSchema>;
export type InterviewQuestion = z.infer<typeof NodeDetailSchema>["interviewQuestions"][number];
export type ResourceItem = z.infer<typeof NodeDetailSchema>["resources"][number];
