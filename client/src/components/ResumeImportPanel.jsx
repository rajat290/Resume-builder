import { useRef, useState } from "react";
import CollapsibleCard from "./CollapsibleCard";

const API_URL = "http://localhost:4000/api";

export default function ResumeImportPanel({
  isOpen,
  onToggle,
  onImportComplete,
  externalFileInputRef,
  onFileImportStateChange
}) {
  const [pastedText, setPastedText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const registerFileRef = (node) => {
    fileInputRef.current = node;
    if (externalFileInputRef) {
      externalFileInputRef.current = node;
    }
  };

  const importFromText = async () => {
    if (!pastedText.trim()) {
      setMessage("Paste some resume text first.");
      return;
    }

    setIsImporting(true);
    onFileImportStateChange?.(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/import/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: pastedText })
      });

      const data = await response.json();
      onImportComplete(data.parsedResume);
      setMessage("Resume text imported into the editor.");
    } catch (error) {
      setMessage("Could not import the pasted resume text.");
    } finally {
      setIsImporting(false);
      onFileImportStateChange?.(false);
    }
  };

  const importFromFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsImporting(true);
    onFileImportStateChange?.(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_URL}/import/file`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Import failed");
      }

      onImportComplete(data.parsedResume);
      setMessage("Resume file imported into the editor.");
    } catch (error) {
      setMessage(error.message || "Could not import the uploaded file.");
    } finally {
      setIsImporting(false);
      onFileImportStateChange?.(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <CollapsibleCard
      title="Resume Import"
      description="Paste resume text or upload a .txt, .docx, or .pdf file to prefill the editor."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <input
        ref={registerFileRef}
        type="file"
        accept=".txt,.docx,.pdf"
        className="hidden"
        onChange={importFromFile}
      />
      <label className="field-label">Paste Resume Text</label>
      <textarea
        className="field-textarea"
        rows={8}
        placeholder="Paste an existing resume here and we will try to map it into the form."
        value={pastedText}
        onChange={(event) => setPastedText(event.target.value)}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={importFromText}
          disabled={isImporting}
        >
          {isImporting ? "Importing..." : "Import pasted text"}
        </button>
        <button
          type="button"
          className="pill-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
        >
          Upload from device
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-slate-500">{message}</p>}
      <p className="mt-2 text-xs text-slate-400">
        Parsing is best-effort, especially for PDFs. Review the imported data after loading it.
      </p>
    </CollapsibleCard>
  );
}
