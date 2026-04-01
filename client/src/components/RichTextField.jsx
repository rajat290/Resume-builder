import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Color from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  PaintBucket,
  Underline as UnderlineIcon
} from "lucide-react";

const TOOLBAR_ACTIONS = [
  { id: "bold", icon: Bold, label: "Bold" },
  { id: "italic", icon: Italic, label: "Italic" },
  { id: "underline", icon: UnderlineIcon, label: "Underline" },
  { id: "bulletList", icon: List, label: "Bullet list" },
  { id: "orderedList", icon: ListOrdered, label: "Numbered list" }
];

const normalizeHtml = (value = "") => {
  if (!value || value === "<p></p>") {
    return "";
  }
  return value.trim();
};

export default function RichTextField({
  label,
  value,
  onChange,
  placeholder,
  multiline = true,
  rows = 4
}) {
  const minHeightClass = useMemo(() => {
    if (!multiline) {
      return "min-h-[54px]";
    }

    if (rows >= 5) {
      return "min-h-[168px]";
    }

    return "min-h-[132px]";
  }, [multiline, rows]);

  const editor = useEditor({
    extensions: [
      Color,
      TextStyle,
      Underline,
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false
      })
    ],
    content: normalizeHtml(value),
    editorProps: {
      attributes: {
        class: `rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 ${minHeightClass}`
      },
      handleKeyDown: (_view, event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          return true;
        }
        return false;
      }
    },
    onUpdate: ({ editor: nextEditor }) => {
      const nextValue = normalizeHtml(nextEditor.getHTML());
      if (nextValue !== normalizeHtml(value)) {
        onChange(nextValue);
      }
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = normalizeHtml(editor.getHTML());
    const incomingHtml = normalizeHtml(value);

    if (currentHtml !== incomingHtml) {
      editor.commands.setContent(incomingHtml || "<p></p>", false);
    }
  }, [editor, value]);

  const runCommand = (action) => {
    if (!editor) {
      return;
    }

    const chain = editor.chain().focus();
    if (action === "bold") chain.toggleBold().run();
    if (action === "italic") chain.toggleItalic().run();
    if (action === "underline") chain.toggleUnderline().run();
    if (action === "bulletList") chain.toggleBulletList().run();
    if (action === "orderedList") chain.toggleOrderedList().run();
  };

  const applyColor = (color) => {
    if (!editor) {
      return;
    }

    editor.chain().focus().setColor(color || "#0f172a").run();
  };

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {TOOLBAR_ACTIONS.map((action) => {
          const Icon = action.icon;
          const active =
            action.id === "bold"
              ? editor?.isActive("bold")
              : action.id === "italic"
                ? editor?.isActive("italic")
                : action.id === "underline"
                  ? editor?.isActive("underline")
                  : editor?.isActive(action.id);

          return (
            <button
              key={action.id}
              type="button"
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                active
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-600 hover:border-accent hover:text-accent"
              }`}
              onClick={() => runCommand(action.id)}
            >
              <Icon size={14} />
              {action.label}
            </button>
          );
        })}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-accent hover:text-accent">
          <PaintBucket size={14} />
          Color
          <input
            type="color"
            className="h-5 w-5 rounded-full border-0 bg-transparent p-0"
            defaultValue="#0f172a"
            onChange={(event) => applyColor(event.target.value)}
          />
        </label>
      </div>

      <div className="relative">
        {editor && !editor.getText().trim() && placeholder ? (
          <p className="pointer-events-none absolute left-4 top-3 z-10 text-sm text-slate-400">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Rich text editing is now powered by a cleaner document editor for better writing flow.
      </p>
    </div>
  );
}
