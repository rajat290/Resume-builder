import CollapsibleCard from "../CollapsibleCard";
import ResumeEditor from "../ResumeEditor";
import ResumeImportPanel from "../ResumeImportPanel";

export default function MobileEditTab({
  resume,
  setResume,
  jobDescription,
  onJobDescriptionChange,
  openSection,
  onSectionChange,
  resumeUploadRef,
  onImportComplete,
  onFileImportStateChange
}) {
  return (
    <div className="space-y-4">
      <ResumeImportPanel
        isOpen={openSection === "import"}
        onToggle={() => onSectionChange(openSection === "import" ? null : "import")}
        onImportComplete={onImportComplete}
        externalFileInputRef={resumeUploadRef}
        onFileImportStateChange={onFileImportStateChange}
      />

      <CollapsibleCard
        title="Job Description"
        description="Paste the target role so AI can optimize toward the right requirements."
        isOpen={openSection === "jd"}
        onToggle={() => onSectionChange(openSection === "jd" ? null : "jd")}
      >
        <label className="field-label">Target job description</label>
        <textarea
          className="field-textarea"
          placeholder="Paste the full job description for better keyword matching."
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
        />
        <p className="mt-2 text-xs text-slate-400">
          The more complete the JD, the better the optimization and rewrite quality.
        </p>
      </CollapsibleCard>

      <ResumeEditor
        resume={resume}
        setResume={setResume}
        mode="mobile"
        openSection={openSection}
        onSectionChange={onSectionChange}
      />
    </div>
  );
}
