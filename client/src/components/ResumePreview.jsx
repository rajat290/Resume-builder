import ClassicTemplate from "../templates/ClassicTemplate";
import CompactTemplate from "../templates/CompactTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import SidebarTemplate from "../templates/SidebarTemplate";

const templateMap = {
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  compact: CompactTemplate,
  executive: ExecutiveTemplate
};

export default function ResumePreview({ resume, selectedTemplate, resumeRef }) {
  const Template = templateMap[selectedTemplate] ?? ClassicTemplate;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#dfe7ef] p-4 shadow-panel lg:sticky lg:top-6">
      <div ref={resumeRef} className="mx-auto overflow-hidden rounded-xl bg-white">
        <Template resume={resume} />
      </div>
    </div>
  );
}
