const tierConfig = {
  "fix-now": {
    label: "Fix Now",
    wrapper: "border-amber-200 bg-amber-50/70",
    pill: "bg-amber-100 text-amber-700"
  },
  recommended: {
    label: "Recommended",
    wrapper: "border-sky-200 bg-sky-50/70",
    pill: "bg-sky-100 text-sky-700"
  },
  optional: {
    label: "Optional",
    wrapper: "border-slate-200 bg-slate-50/90",
    pill: "bg-white text-slate-600"
  }
};

export default function SuggestionCards({
  suggestions,
  onPrimaryAction,
  hasTransformation
}) {
  const grouped = {
    "fix-now": suggestions.filter((item) => item.tier === "fix-now"),
    recommended: suggestions.filter((item) => item.tier === "recommended"),
    optional: suggestions.filter((item) => item.tier === "optional")
  };

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([tier, items]) => {
        if (!items.length) {
          return null;
        }

        const config = tierConfig[tier];

        return (
          <div key={tier}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="field-label !mb-0">{config.label}</p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${config.pill}`}>
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[1.5rem] border p-4 ${config.wrapper}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                          {item.impact} impact
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPrimaryAction(item)}
                      className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {hasTransformation ? item.actionLabel : item.actionLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
