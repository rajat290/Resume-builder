import CollapsibleCard from "./CollapsibleCard";

export default function JobMatchPanel({
  jobDescription,
  onJobDescriptionChange,
  keywords,
  onAnalyze,
  onTransform,
  onApplyTransformation,
  transformationResult,
  isAnalyzing,
  isTransforming,
  isOpen,
  onToggle
}) {
  return (
    <CollapsibleCard
      title="Job Description Analyzer"
      description="Paste a role description to analyze keywords or generate a fully rewritten, job-tailored version of the resume."
      isOpen={isOpen}
      onToggle={onToggle}
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="pill-button"
            onClick={onAnalyze}
            disabled={isAnalyzing || isTransforming}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onTransform}
            disabled={isAnalyzing || isTransforming}
          >
            {isTransforming ? "Rewriting..." : "Full AI Rewrite"}
          </button>
        </div>
      }
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

      {transformationResult && (
        <div className="mt-6 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="field-label !mb-1">AI Transformation Review</p>
              <p className="text-sm text-slate-500">
                Provider:{" "}
                <span className="font-semibold text-slate-700">
                  {transformationResult.provider === "openai"
                    ? "OpenAI"
                    : "Fallback mode"}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={onApplyTransformation}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Apply rewritten resume
            </button>
          </div>

          {transformationResult.error && (
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              AI was unavailable, so the app generated a structured fallback rewrite instead.
            </div>
          )}

          <div>
            <p className="field-label">What Changed</p>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
              {transformationResult.changeSummary?.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="field-label">Missing Requirements</p>
              {transformationResult.missingRequirements?.length ? (
                <div className="flex flex-wrap gap-2">
                  {transformationResult.missingRequirements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No obvious gaps were found from the extracted keywords.
                </p>
              )}
            </div>
            <div>
              <p className="field-label">Truthfulness Check</p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                {transformationResult.truthfulnessCheck?.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
}
