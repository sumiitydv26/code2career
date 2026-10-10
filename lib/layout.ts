import dagre from "@dagrejs/dagre";
import { Roadmap } from "./schema";
import { Node as RFNode, Edge as RFEdge } from "@xyflow/react";

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 140;
export const BOSS_WIDTH = 340;
export const BOSS_HEIGHT = 180;

export interface LayoutResult {
  nodes: RFNode[];
  edges: RFEdge[];
}

export function computeDagreLayout(roadmap: Roadmap): LayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR", // Left to Right
    align: "UL",
    nodesep: 80,
    ranksep: 120,
    marginx: 80,
    marginy: 80,
  });

  roadmap.nodes.forEach((node) => {
    const isBoss = node.type === "boss";
    g.setNode(node.id, {
      width: isBoss ? BOSS_WIDTH : NODE_WIDTH,
      height: isBoss ? BOSS_HEIGHT : NODE_HEIGHT,
    });
  });

  roadmap.nodes.forEach((node) => {
    node.prerequisites.forEach((prereqId) => {
      // Guard: only add edge if prerequisite exists in roadmap
      if (roadmap.nodes.some((n) => n.id === prereqId)) {
        g.setEdge(prereqId, node.id);
      }
    });
  });

  dagre.layout(g);

  const rfNodes: RFNode[] = roadmap.nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const isBoss = node.type === "boss";
    const w = isBoss ? BOSS_WIDTH : NODE_WIDTH;
    const h = isBoss ? BOSS_HEIGHT : NODE_HEIGHT;

    return {
      id: node.id,
      type: "skillNode",
      position: {
        x: dagreNode ? dagreNode.x - w / 2 : 0,
        y: dagreNode ? dagreNode.y - h / 2 : 0,
      },
      data: {
        node,
      },
    };
  });

  const rfEdges: RFEdge[] = [];
  roadmap.nodes.forEach((node) => {
    node.prerequisites.forEach((prereqId) => {
      rfEdges.push({
        id: `e-${prereqId}-${node.id}`,
        source: prereqId,
        target: node.id,
        type: "smoothstep",
        animated: true,
        style: {
          strokeWidth: 2,
        },
      });
    });
  });

  return { nodes: rfNodes, edges: rfEdges };
}
