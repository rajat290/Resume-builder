import { BarChart3, FilePenLine, Eye, GitCompareArrows } from "lucide-react";

const tabs = [
  { id: "edit", label: "Edit", icon: FilePenLine },
  { id: "score", label: "Score", icon: BarChart3 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "compare", label: "Compare", icon: GitCompareArrows }
];

export default function MobileBottomTabs({ activeTab, onChange, compareEnabled }) {
  return (
    <nav className="mobile-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        const disabled = tab.id === "compare" && !compareEnabled;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`mobile-tab-button ${
              active ? "bg-sky-50 text-sky-700" : "text-slate-400"
            } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
