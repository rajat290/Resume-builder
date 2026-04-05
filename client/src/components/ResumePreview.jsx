import ClassicTemplate from "../templates/ClassicTemplate";
import CompactTemplate from "../templates/CompactTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import SidebarTemplate from "../templates/SidebarTemplate";
import AtsCompactTemplate from "../templates/AtsCompactTemplate";
import AtsDetailedTemplate from "../templates/AtsDetailedTemplate";
import AtsMinimalTemplate from "../templates/AtsMinimalTemplate";
import AtsSerifTemplate from "../templates/AtsSerifTemplate";

export const templateMap = {
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  compact: CompactTemplate,
  executive: ExecutiveTemplate,
  "ats-minimal": AtsMinimalTemplate,
  "ats-compact": AtsCompactTemplate,
  "ats-serif": AtsSerifTemplate,
  "ats-detailed": AtsDetailedTemplate
};

export default function ResumePreview({
  resume,
  selectedTemplate,
  resumeRef,
  spacingDensity = "standard"
}) {
  const Template = templateMap[selectedTemplate] ?? ClassicTemplate;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel sm:p-4 lg:sticky lg:top-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Live Preview
          </p>
          <p className="text-sm text-slate-500">Scroll horizontally on smaller screens.</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white/70 p-2 sm:p-3">
        <div
          ref={resumeRef}
          className={`resume-density-${spacingDensity} mx-auto min-w-[210mm] overflow-hidden rounded-xl bg-white shadow-sm`}
        >
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}
