import React from "react";
import { NodeDetail, ResourceItem } from "@/lib/schema";
import { Lightbulb, Hammer, Search, BookOpen, Video, FileText, Code2, CheckCircle } from "lucide-react";

interface NodeDetailViewProps {
  detail: NodeDetail;
}

function getResourceIcon(kind: ResourceItem["kind"]) {
  switch (kind) {
    case "docs":
      return <FileText className="w-4 h-4 text-sky-400" />;
    case "video":
      return <Video className="w-4 h-4 text-rose-400" />;
    case "repo":
      return <Code2 className="w-4 h-4 text-emerald-400" />;
    case "book":
    case "course":
    default:
      return <BookOpen className="w-4 h-4 text-amber-400" />;
  }
}

export function NodeDetailView({ detail }: NodeDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Why It Matters */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Strategic Importance</span>
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          {detail.whyItMatters}
        </p>
      </div>

      {/* Weekend Project Card */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Hammer className="w-4 h-4 text-emerald-400" />
          <span>Weekend Portfolio Project</span>
        </h4>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <div>
            <h5 className="font-semibold text-emerald-300 text-sm">
              {detail.weekendProject.title}
            </h5>
            <p className="text-xs text-slate-300 mt-1 leading-normal">
              {detail.weekendProject.description}
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Tangible Deliverables:
            </span>
            <ul className="space-y-1">
              {detail.weekendProject.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-4 h-4 text-sky-400" />
          <span>Targeted Search Directives</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {detail.resources.map((res, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {getResourceIcon(res.kind)}
                  <span className="text-xs font-semibold text-white truncate">
                    {res.title}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                  {res.kind}
                </span>
              </div>
              <p className="text-[11px] font-mono text-sky-400/90 pl-6">
                Search: {res.searchHint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
