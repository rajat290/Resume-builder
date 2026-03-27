import { AlertTriangle, RefreshCcw, Server } from "lucide-react";

export default function ConnectionBanner({ status, onRetry, isRetrying }) {
  if (status !== "offline") {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50/90 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-white p-2 text-amber-600 shadow-sm">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Backend disconnected
            </p>
            <h2 className="mt-1 text-base font-semibold text-slate-950">
              Resume data is available locally, but live services are offline.
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900/80">
              Start the backend server with <span className="font-semibold text-amber-900">npm run dev</span> to
              load saved resumes, imports, AI optimization, and authenticated activity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:border-amber-400 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? <Server size={16} /> : <RefreshCcw size={16} />}
          {isRetrying ? "Checking..." : "Retry connection"}
        </button>
      </div>
    </section>
  );
}
