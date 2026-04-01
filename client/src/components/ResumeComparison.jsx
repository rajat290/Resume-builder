import { ArrowLeft, ArrowRightLeft, CheckCircle2, FileEdit } from "lucide-react";
import { templateMap } from "./ResumePreview";

function PreviewSurface({ title, subtitle, badgeClassName, badgeText, Template, resume }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <span className={badgeClassName}>{badgeText}</span>
      </div>
      <div className="overflow-x-auto rounded-xl bg-slate-100/80 p-2 sm:p-3">
        <div className="mx-auto min-w-[210mm] overflow-hidden rounded-xl bg-white shadow-sm">
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}

export default function ResumeComparison({
  originalResume,
  rewrittenResume,
  selectedTemplate,
  onBackToEditor,
  onApplyTransformation
}) {
  const Template = templateMap[selectedTemplate] ?? templateMap.classic;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#f5faff_0%,_#eef4fb_50%,_#e7eef8_100%)] px-4 py-5 text-ink md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-panel backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Full Compare View
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
                Review both resumes with full reading space
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Compare the original resume and the rewritten version on a dedicated page, then go back to the editor if you want to refine anything before applying the rewrite.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBackToEditor}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                <ArrowLeft size={16} />
                Back to editor
              </button>
              <button
                type="button"
                onClick={onApplyTransformation}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <FileEdit size={16} />
                Apply rewritten resume
              </button>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
            <ArrowRightLeft size={14} />
            Before vs After
          </div>
        </div>

        <div className="grid gap-5 2xl:grid-cols-2">
          <PreviewSurface
            title="Original Resume"
            subtitle="The version currently stored in the editor."
            badgeText="Current"
            badgeClassName="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
            Template={Template}
            resume={originalResume}
          />
          <PreviewSurface
            title="Rewritten Resume"
            subtitle="The AI-generated version tailored to the target job description."
            badgeText="Rewritten"
            badgeClassName="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700"
            Template={Template}
            resume={rewrittenResume}
          />
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 shadow-sm">
          <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
            <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
            <p>
              Use this view to compare summary changes, skill prioritization, and rewritten experience bullets without the dashboard compressing the reading space.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
