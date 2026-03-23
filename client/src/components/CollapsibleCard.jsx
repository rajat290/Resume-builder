import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleCard({
  title,
  description,
  children,
  defaultOpen = true,
  isOpen,
  onToggle,
  actions
}) {
  const open = typeof isOpen === "boolean" ? isOpen : defaultOpen;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-accent hover:text-accent"
            onClick={onToggle}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      {open && <div className="mt-5">{children}</div>}
    </section>
  );
}
