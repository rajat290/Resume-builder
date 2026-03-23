import CollapsibleCard from "./CollapsibleCard";

export default function JobMatchPanel({
  jobDescription,
  onJobDescriptionChange,
  keywords,
  isOpen,
  onToggle
}) {
  return (
    <CollapsibleCard
      title="Job Description Analyzer"
      description="Paste a role description to reprioritize skills, projects, and experience."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <label className="field-label">Target Job Description</label>
      <textarea
        className="field-textarea"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(event) => onJobDescriptionChange(event.target.value)}
      />

      <div className="mt-5">
        <p className="field-label">Extracted Keywords</p>
        <div className="flex flex-wrap gap-2">
          {keywords.length ? (
            keywords.map((item) => (
              <span
                key={item.keyword}
                className="rounded-full bg-mist px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink"
              >
                {item.keyword}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Run optimization to see role-specific keywords.
            </p>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
}
