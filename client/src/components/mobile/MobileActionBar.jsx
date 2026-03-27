export default function MobileActionBar({
  canOptimize,
  isOptimizing,
  onOptimize,
  onDownload,
  canDownload
}) {
  return (
    <div className="mobile-action-bar">
      <button
        type="button"
        onClick={onOptimize}
        disabled={!canOptimize || isOptimizing}
        className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isOptimizing ? "Optimizing..." : "Optimize Resume"}
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={!canDownload}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download PDF
      </button>
    </div>
  );
}
