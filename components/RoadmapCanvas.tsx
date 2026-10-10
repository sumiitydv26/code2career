"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuestStore } from "@/store/useQuestStore";
import { computeDagreLayout } from "@/lib/layout";
import { SkillNode } from "./SkillNode";
import { Target, Compass } from "lucide-react";
import { ThemedViewBackground } from "./ThemedViewBackground";

const nodeTypes = {
  skillNode: SkillNode,
};

function FlowInner() {
  const { roadmap, nodeStatus, setSelectedNodeId } = useQuestStore();
  const { fitView, setCenter } = useReactFlow();
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  // Compute Dagre layout
  const { initialNodes, initialEdges } = useMemo(() => {
    const layout = computeDagreLayout(roadmap);
    return { initialNodes: layout.nodes, initialEdges: layout.edges };
  }, [roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes layout whenever roadmap updates
  useEffect(() => {
    const layout = computeDagreLayout(roadmap);
    setNodes(layout.nodes);
    setEdges(layout.edges);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 600 });
    }, 100);
  }, [roadmap, setNodes, setEdges, fitView]);

  // Dynamically restyle edges based on source and target completion
  useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const sourceStatus = nodeStatus[edge.source];
        const targetStatus = nodeStatus[edge.target];

        const isCompleteConnection =
          (sourceStatus === "completed" || sourceStatus === "known") &&
          (targetStatus === "completed" || targetStatus === "known");

        const isTargetLocked = targetStatus === "locked";

        if (isCompleteConnection) {
          return {
            ...edge,
            animated: true,
            style: {
              stroke: "#f59e0b", // Gold glow
              strokeWidth: 3,
              filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))",
            },
          };
        }

        if (isTargetLocked) {
          return {
            ...edge,
            animated: false,
            style: {
              stroke: "#334155", // Dim dashed
              strokeWidth: 1.5,
              strokeDasharray: "4,4",
            },
          };
        }

        return {
          ...edge,
          animated: true,
          style: {
            stroke: "#38bdf8", // Sky blue active
            strokeWidth: 2,
            filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))",
          },
        };
      })
    );
  }, [nodeStatus, setEdges]);

  // Focus next available node
  const handleFocusNextAvailable = useCallback(() => {
    const nextAvailableNode = roadmap.nodes.find(
      (n) => nodeStatus[n.id] === "available" || nodeStatus[n.id] === "in_progress"
    );

    if (nextAvailableNode) {
      setSelectedNodeId(nextAvailableNode.id);
      const rfNode = nodes.find((n) => n.id === nextAvailableNode.id);
      if (rfNode) {
        setCenter(rfNode.position.x + 130, rfNode.position.y + 70, {
          zoom: 1.1,
          duration: 800,
        });
      }
    }
  }, [roadmap, nodeStatus, nodes, setSelectedNodeId, setCenter]);

  // Phase legend badges
  const phaseColors = ["border-sky-500/40 text-sky-400", "border-indigo-500/40 text-indigo-400", "border-purple-500/40 text-purple-400", "border-fuchsia-500/40 text-fuchsia-400"];

  return (
    <div id="roadmap-flow-container" className="relative w-full h-full bg-transparent overflow-hidden">
      <ThemedViewBackground
        variant="graph"
        panX={viewport.x}
        panY={viewport.y}
        zoom={viewport.zoom}
      />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleFocusNextAvailable}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)] text-sky-300 text-xs font-semibold backdrop-blur-md transition focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Focus Next Available Node</span>
        </button>

        <button
          type="button"
          onClick={() => fitView({ padding: 0.2, duration: 500 })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium backdrop-blur-md transition focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Phase Legends Footer */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Phases:
        </span>
        {roadmap.phases.map((phase, idx) => (
          <span
            key={phase.id}
            className={`text-[11px] px-2 py-0.5 rounded-md border bg-slate-900/90 font-medium ${
              phaseColors[idx % phaseColors.length]
            }`}
          >
            {phase.name}
          </span>
        ))}
      </div>

      {/* React Flow Component */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onMove={(_, vp) => setViewport(vp)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent relative z-10"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.5}
          color="#38bdf822"
        />
        <Controls className="!bg-slate-900/90 !border-slate-800 !rounded-xl !shadow-xl [&>button]:!bg-slate-900 [&>button]:!border-slate-800 [&>button]:!text-slate-200" />
        <MiniMap
          nodeColor={(n) => {
            const st = nodeStatus[n.id];
            if (st === "completed") return "#f59e0b";
            if (st === "known") return "#14b8a6";
            if (st === "in_progress") return "#818cf8";
            if (st === "available") return "#38bdf8";
            return "#334155";
          }}
          maskColor="rgba(11, 15, 25, 0.8)"
          className="!bg-slate-950/90 !border-slate-800 !rounded-xl hidden sm:block"
        />
      </ReactFlow>
    </div>
  );
}

export function RoadmapCanvas() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
