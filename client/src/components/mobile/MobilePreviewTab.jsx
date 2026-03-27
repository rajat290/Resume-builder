import { useMemo } from "react";
import { templateMap } from "../ResumePreview";
import { templateOptions } from "../../utils/resumeHelpers";

export default function MobilePreviewTab({
  resume,
  selectedTemplate,
  onTemplateChange,
  previewMode,
  onPreviewModeChange,
  resumeRef
}) {
  const templateId = previewMode === "ats" ? "ats-minimal" : selectedTemplate;
  const Template = useMemo(
    () => templateMap[templateId] ?? templateMap.classic,
    [templateId]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-panel">
        <div className="grid gap-3">
          <select
            className="field-input"
            value={selectedTemplate}
            onChange={(event) => onTemplateChange(event.target.value)}
          >
            {templateOptions.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onPreviewModeChange("ats")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                previewMode === "ats"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              ATS View
            </button>
            <button
              type="button"
              onClick={() => onPreviewModeChange("styled")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                previewMode === "styled"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Styled View
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel">
        <div className="overflow-x-auto rounded-xl bg-white/70 p-2">
          <div ref={resumeRef} className="mx-auto min-w-[210mm] overflow-hidden rounded-xl bg-white shadow-sm">
            <Template resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
