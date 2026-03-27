import { ArrowLeftRight } from "lucide-react";
import { templateMap } from "../ResumePreview";

export default function MobileCompareTab({
  originalResume,
  rewrittenResume,
  selectedTemplate,
  compareMode,
  onCompareModeChange,
  transformationResult
}) {
  const Template = templateMap[selectedTemplate] ?? templateMap.classic;
  const shownResume = compareMode === "before" ? originalResume : rewrittenResume;

  if (!shownResume) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-panel">
        Run a rewrite to unlock the comparison view.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ArrowLeftRight size={16} />
          Before vs After
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onCompareModeChange("before")}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              compareMode === "before"
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => onCompareModeChange("after")}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              compareMode === "after"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            After
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Improvement Summary
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          {transformationResult?.changeSummary?.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel">
        <div className="overflow-x-auto rounded-xl bg-white/70 p-2">
          <div className="mx-auto min-w-[210mm] overflow-hidden rounded-xl bg-white shadow-sm">
            <Template resume={shownResume} />
          </div>
        </div>
      </div>
    </div>
  );
}
