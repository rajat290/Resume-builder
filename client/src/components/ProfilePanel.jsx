import { Clock3, FileText, LogOut, Sparkles, UserCircle2 } from "lucide-react";

const formatTimestamp = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

export default function ProfilePanel({
  isOpen,
  onClose,
  currentUser,
  activityLog,
  scoreData,
  selectedTemplate,
  onSignOut
}) {
  if (!isOpen) {
    return null;
  }

  const recentItems = activityLog.slice(0, 6);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/45 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close profile panel"
        className="flex-1 cursor-default"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Account
          </p>
          <div className="mt-4 flex items-start gap-4">
            <div className="rounded-full bg-sky-50 p-3 text-sky-700">
              <UserCircle2 size={30} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-slate-950">
                {currentUser?.name || "Resume Builder User"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {currentUser?.email || "Demo workspace"}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                {currentUser?.mode === "demo" ? "Demo session" : "Authenticated workspace"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Workspace Snapshot
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Resume Score
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{scoreData.overall}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Current Template
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">
                  {selectedTemplate}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock3 size={16} className="text-slate-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Recent Activity
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {recentItems.length ? (
                recentItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <span className="text-xs font-medium text-slate-400">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  Your latest imports, optimizations, rewrites, and downloads will appear here.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Product State
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-sky-50 p-3 text-sky-800">
                <Sparkles size={16} />
                <span className="text-sm font-medium">
                  {currentUser?.mode === "demo"
                    ? "Demo mode is active. Resume changes stay in this browser session."
                    : "Authenticated mode is active. Your saved resume syncs with the backend when online."}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-slate-700">
                <FileText size={16} />
                <span className="text-sm font-medium">
                  Current analysis uses ATS structure, keyword match, impact, and readability scoring.
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Close
            </button>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <LogOut size={16} />
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
