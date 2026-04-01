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
  onFileImportStateChange,
  onConnectionError,
  onSectionSave,
  onSaveJobDescription
}) {
  return (
    <div className="space-y-4">
      <ResumeImportPanel
        isOpen={openSection === "import"}
        onToggle={() => onSectionChange(openSection === "import" ? null : "import")}
        onImportComplete={onImportComplete}
        externalFileInputRef={resumeUploadRef}
        onFileImportStateChange={onFileImportStateChange}
        onConnectionError={onConnectionError}
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
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onSaveJobDescription}
          >
            Save Job Description
          </button>
        </div>
      </CollapsibleCard>

      <ResumeEditor
        resume={resume}
        setResume={setResume}
        mode="mobile"
        openSection={openSection}
        onSectionChange={onSectionChange}
        onSectionSave={onSectionSave}
      />
    </div>
  );
}
