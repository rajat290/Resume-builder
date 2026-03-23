import { Download, Sparkles, Upload } from "lucide-react";
import { templateOptions } from "../utils/resumeHelpers";

export default function TopBar({
  selectedTemplate,
  onTemplateChange,
  onOptimize,
  onDownload,
  onUploadResume,
  isOptimizing,
  isUploading,
  currentUser,
  onSignOut
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
        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[640px] xl:grid-cols-[minmax(180px,220px)_1fr_1fr_1fr]">
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
    </div>
  );
}
