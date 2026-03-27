const scoreTone = (score) => {
  if (score >= 85) {
    return {
      ring: "border-emerald-200",
      pill: "bg-emerald-50 text-emerald-700",
      text: "Strong"
    };
  }

  if (score >= 70) {
    return {
      ring: "border-sky-200",
      pill: "bg-sky-50 text-sky-700",
      text: "Good"
    };
  }

  return {
    ring: "border-amber-200",
    pill: "bg-amber-50 text-amber-700",
    text: "Needs work"
  };
};

export default function ResumeScoreCard({ scoreData }) {
  const tone = scoreTone(scoreData.overall);

  return (
    <section className={`rounded-[2rem] border ${tone.ring} bg-white/90 p-5 shadow-panel backdrop-blur md:p-6`}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
            Resume Score
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-slate-100 bg-slate-50">
              <span className="text-3xl font-bold text-slate-950">{scoreData.overall}</span>
            </div>
            <div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${tone.pill}`}>
                {tone.text}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Your score combines ATS structure, keyword alignment, impact, and recruiter readability.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
          {scoreData.breakdown.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{item.score}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Matched Keywords
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scoreData.matchedKeywords.length ? (
              scoreData.matchedKeywords.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-emerald-800/80">Run analysis to populate matched terms.</p>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Missing Keywords
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scoreData.missingKeywords.length ? (
              scoreData.missingKeywords.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-amber-800/80">No obvious missing terms detected yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-slate-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Overused Terms
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scoreData.overusedKeywords.length ? (
              scoreData.overusedKeywords.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No major repetition issues found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
