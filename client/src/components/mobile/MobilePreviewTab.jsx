import { useMemo } from "react";
import PaginatedResumePages from "../PaginatedResumePages";
import { templateMap } from "../ResumePreview";
import { densityOptions, fontOptions, getFontStack, templateOptions } from "../../utils/resumeHelpers";

export default function MobilePreviewTab({
  resume,
  selectedTemplate,
  onTemplateChange,
  spacingDensity,
  onSpacingDensityChange,
  headingFont,
  bodyFont,
  onHeadingFontChange,
  onBodyFontChange,
  previewMode,
  onPreviewModeChange,
  resumeRef
}) {
  const templateId = previewMode === "ats" ? "ats-minimal" : selectedTemplate;
  const Template = useMemo(
    () => templateMap[templateId] ?? templateMap.classic,
    [templateId]
  );
  const fontStyle = {
    "--resume-font-heading": getFontStack(headingFont, "merriweather"),
    "--resume-font-body": getFontStack(bodyFont, "inter")
  };

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
          <select
            className="field-input"
            value={spacingDensity}
            onChange={(event) => onSpacingDensityChange(event.target.value)}
          >
            {densityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} spacing
              </option>
            ))}
          </select>
          <select
            className="field-input"
            value={headingFont}
            onChange={(event) => onHeadingFontChange(event.target.value)}
          >
            {fontOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Heading: {option.label}
              </option>
            ))}
          </select>
          <select
            className="field-input"
            value={bodyFont}
            onChange={(event) => onBodyFontChange(event.target.value)}
          >
            {fontOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Body: {option.label}
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
        <p className="mt-3 text-xs leading-5 text-slate-400">
          If the print dialog still shows a date or title, turn off `Headers and footers` before saving the PDF.
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Multi-page preview enabled
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel">
        <div className="resume-preview-shell overflow-x-auto rounded-xl bg-white/70 p-2">
          <PaginatedResumePages
            Template={Template}
            resume={resume}
            resumeRef={resumeRef}
            spacingDensity={spacingDensity}
            fontStyle={fontStyle}
          />
        </div>
      </div>
    </div>
  );
}
