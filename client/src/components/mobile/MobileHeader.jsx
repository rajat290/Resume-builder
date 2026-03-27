import { LogOut, UserCircle2 } from "lucide-react";

export default function MobileHeader({
  title,
  subtitle,
  saveState,
  currentUser,
  onOpenProfile,
  onSignOut
}) {
  const saveLabel =
    saveState === "saving"
      ? "Saving..."
      : saveState === "saved"
        ? "Saved just now"
        : subtitle || "";

  return (
    <header className="mobile-header">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
          Smart Resume Builder
        </p>
        <h1 className="mt-1 text-lg font-semibold text-slate-950">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">{saveLabel}</p>
          {currentUser?.name && (
            <p className="max-w-[110px] truncate text-xs font-semibold text-slate-700">
              {currentUser.name}
            </p>
          )}
        </div>
        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            aria-label="Open profile"
          >
            <UserCircle2 size={18} />
          </button>
        )}
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
