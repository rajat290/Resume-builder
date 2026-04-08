import ClassicTemplate from "../templates/ClassicTemplate";
import CompactTemplate from "../templates/CompactTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import SidebarTemplate from "../templates/SidebarTemplate";
import AtsCompactTemplate from "../templates/AtsCompactTemplate";
import AtsDetailedTemplate from "../templates/AtsDetailedTemplate";
import AtsMinimalTemplate from "../templates/AtsMinimalTemplate";
import AtsSerifTemplate from "../templates/AtsSerifTemplate";
import ProfessionalUniversalTemplate from "../templates/ProfessionalUniversalTemplate";
import PaginatedResumePages from "./PaginatedResumePages";
import { getFontStack } from "../utils/resumeHelpers";

export const templateMap = {
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  compact: CompactTemplate,
  executive: ExecutiveTemplate,
  "ats-minimal": AtsMinimalTemplate,
  "ats-compact": AtsCompactTemplate,
  "ats-serif": AtsSerifTemplate,
  "ats-detailed": AtsDetailedTemplate,
  "universal-professional": ProfessionalUniversalTemplate
};

export default function ResumePreview({
  resume,
  selectedTemplate,
  resumeRef,
  spacingDensity = "standard",
  headingFont = "merriweather",
  bodyFont = "inter"
}) {
  const Template = templateMap[selectedTemplate] ?? ClassicTemplate;
  const fontStyle = {
    "--resume-font-heading": getFontStack(headingFont, "merriweather"),
    "--resume-font-body": getFontStack(bodyFont, "inter")
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#dfe7ef] p-3 shadow-panel sm:p-4 lg:sticky lg:top-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Live Preview
          </p>
          <p className="text-sm text-slate-500">Scroll horizontally on smaller screens.</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Multi-page preview
        </div>
      </div>
      <div className="resume-preview-shell overflow-x-auto rounded-xl bg-white/70 p-2 sm:p-3">
        <PaginatedResumePages
          Template={Template}
          resume={resume}
          resumeRef={resumeRef}
          spacingDensity={spacingDensity}
          fontStyle={fontStyle}
        />
      </div>
    </div>
  );
}
