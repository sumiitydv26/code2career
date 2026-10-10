"use client";

import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
  targetId: string;
  fileName?: string;
}

export function ExportButton({ targetId, fileName = "career-quest-roadmap.png" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const node = document.getElementById(targetId);
    if (!node) {
      console.error(`Export target #${targetId} not found`);
      return;
    }

    try {
      setIsExporting(true);
      const dataUrl = await toPng(node, {
        backgroundColor: "#0b0f19",
        cacheBust: true,
        pixelRatio: 2, // Hi-DPI crystal clear PNG
      });

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
      title="Export Roadmap as high-resolution PNG image"
      aria-label="Export roadmap image"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export PNG</span>
        </>
      )}
    </button>
  );
}
