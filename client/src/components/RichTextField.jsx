import { useRef } from "react";
import { Bold, Italic, PaintBucket, Underline } from "lucide-react";
import { applyTagToSelection } from "../utils/richText.jsx";

const ACTIONS = [
  { id: "bold", icon: Bold },
  { id: "italic", icon: Italic },
  { id: "underline", icon: Underline }
];

export default function RichTextField({
  label,
  value,
  onChange,
  placeholder,
  multiline = true,
  rows = 4
}) {
  const inputRef = useRef(null);

  const applyFormat = (format, color) => {
    const element = inputRef.current;
    if (!element) {
      return;
    }

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? selectionStart;

    const result = applyTagToSelection(value, selectionStart, selectionEnd, format, color);
    onChange(result.value);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(result.selectionStart, result.selectionEnd);
      }
    });
  };

  const sharedProps = {
    ref: inputRef,
    value,
    placeholder,
    onChange: (event) => onChange(event.target.value)
  };

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-accent hover:text-accent"
              onClick={() => applyFormat(action.id)}
            >
              <Icon size={14} />
              {action.id}
            </button>
          );
        })}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-accent hover:text-accent">
          <PaintBucket size={14} />
          Color
          <input
            type="color"
            className="h-5 w-5 rounded-full border-0 bg-transparent p-0"
            defaultValue="#000000"
            onChange={(event) => applyFormat("color", event.target.value)}
          />
        </label>
      </div>
      {multiline ? (
        <textarea {...sharedProps} rows={rows} className="field-textarea" />
      ) : (
        <input {...sharedProps} className="field-input" />
      )}
      <p className="mt-2 text-xs text-slate-400">
        Select text and use the controls to apply formatting in the preview.
      </p>
    </div>
  );
}
