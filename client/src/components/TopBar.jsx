import { Download, Sparkles } from "lucide-react";
import { templateOptions } from "../utils/resumeHelpers";

export default function TopBar({
  selectedTemplate,
  onTemplateChange,
  onOptimize,
  onDownload,
  isOptimizing
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-paper/95 p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Smart Resume Builder
          </p>
          <h1 className="font-display text-3xl text-ink">
            Build one master resume, customize for every role.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="field-input min-w-44"
            value={selectedTemplate}
            onChange={(event) => onTemplateChange(event.target.value)}
          >
            {templateOptions.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onOptimize}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Sparkles size={16} />
            {isOptimizing ? "Optimizing..." : "Optimize for job"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
