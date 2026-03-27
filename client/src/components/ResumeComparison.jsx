import { ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { templateMap } from "./ResumePreview";

function PreviewSurface({ title, subtitle, badgeClassName, badgeText, Template, resume }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white/70 p-3 shadow-sm sm:p-4">
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
  selectedTemplate
}) {
  const Template = templateMap[selectedTemplate] ?? templateMap.classic;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel sm:p-4">
      <div className="mb-4 flex flex-col gap-3 rounded-[1.5rem] bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Side-By-Side Rewrite Review
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            Compare the original resume with the AI rewritten version
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Both previews use the same template so the difference is only the content.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          <ArrowRightLeft size={14} />
          Before vs After
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-2">
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

      <div className="mt-4 rounded-[1.5rem] bg-white/75 p-4">
        <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
          <p>
            Review tone, summary, skills emphasis, and bullet language side by side
            before applying the rewritten version to your editor.
          </p>
        </div>
      </div>
    </div>
  );
}
