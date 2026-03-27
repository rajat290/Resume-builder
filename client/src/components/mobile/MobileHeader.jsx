export default function MobileHeader({ title, subtitle, saveState }) {
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
      <div className="text-right">
        <p className="text-xs font-medium text-slate-500">{saveLabel}</p>
      </div>
    </header>
  );
}
