import ResumeScoreCard from "../ResumeScoreCard";
import SuggestionCards from "../SuggestionCards";

export default function MobileScoreTab({
  scoreData,
  suggestionCards,
  transformationResult,
  onSuggestionAction,
  onKeywordTap
}) {
  return (
    <div className="space-y-5">
      <ResumeScoreCard scoreData={scoreData} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Missing Keywords
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tap a keyword to jump into a fix flow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {scoreData.missingKeywords.length ? (
            scoreData.missingKeywords.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onKeywordTap(item)}
                className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700"
              >
                {item}
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">No major missing keywords detected.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Smart Suggestions
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Treat these like tasks from your AI assistant.
          </p>
        </div>
        <SuggestionCards
          suggestions={suggestionCards}
          onPrimaryAction={onSuggestionAction}
          hasTransformation={Boolean(transformationResult)}
        />
      </section>
    </div>
  );
}
