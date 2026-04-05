import { Download, Sparkles, Upload, UserCircle2 } from "lucide-react";
import { densityOptions, fontOptions, templateOptions } from "../utils/resumeHelpers";

export default function TopBar({
  selectedTemplate,
  onTemplateChange,
  spacingDensity,
  onSpacingDensityChange,
  headingFont,
  bodyFont,
  onHeadingFontChange,
  onBodyFontChange,
  onOptimize,
  onDownload,
  onUploadResume,
  isOptimizing,
  isUploading,
  currentUser,
  onSignOut,
  onOpenProfile
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-paper/95 p-5 shadow-panel backdrop-blur md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Smart Resume Builder
          </p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl lg:text-[2.35rem]">
            Build one master resume, customize for every role.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Edit, optimize, and export resumes from desktop or mobile with a cleaner
            step-by-step workflow.
          </p>
          {currentUser && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {currentUser.mode === "demo" ? "Demo Mode" : "Google Connected"}
              </span>
              <span className="text-sm text-slate-500">{currentUser.name}</span>
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                >
                  <UserCircle2 size={16} />
                  Profile
                </button>
              )}
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-sm font-semibold text-slate-600 transition hover:text-sky-700"
                >
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[1120px] xl:grid-cols-[minmax(180px,220px)_minmax(160px,200px)_minmax(170px,210px)_minmax(170px,210px)_1fr_1fr_1fr]">
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
          <button
            type="button"
            onClick={onOptimize}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Sparkles size={16} />
            {isOptimizing ? "Optimizing..." : "Optimize for job"}
          </button>
          <button
            type="button"
            onClick={onUploadResume}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <Upload size={16} />
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Print note: if the browser still shows a date or title in the PDF header/footer, turn off `Headers and footers` in the print dialog.
      </p>
    </div>
  );
}
