import { ArrowRight, Chrome, X } from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  onGoogleContinue,
  onDemoContinue,
  isLoading
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
              Start Faster
            </p>
            <h2 className="mt-2 font-display text-3xl text-slate-950">
              Continue in one click
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use Google for the fastest path to your dashboard, or try the product
              first without signing up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="Close authentication modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onGoogleContinue}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Chrome size={18} />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </button>
          <button
            type="button"
            onClick={onDemoContinue}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ArrowRight size={18} />
            Try Demo
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Why this flow works</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            No password friction, faster onboarding, and a direct jump into resume
            customization.
          </p>
        </div>
      </div>
    </div>
  );
}
