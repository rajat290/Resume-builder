import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import JobMatchPanel from "./JobMatchPanel";
import ResumeEditor from "./ResumeEditor";
import ResumeImportPanel from "./ResumeImportPanel";
import ResumePreview from "./ResumePreview";
import TopBar from "./TopBar";
import { emptyResume, normalizeResumeData } from "../utils/resumeHelpers";

const API_URL = "http://localhost:4000/api";

export default function ResumeWorkspace({ currentUser, onSignOut }) {
  const [resume, setResume] = useState(emptyResume);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationResult, setTransformationResult] = useState(null);
  const [leftPanels, setLeftPanels] = useState({
    import: true,
    analyzer: true
  });
  const [mobileView, setMobileView] = useState("editor");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeRef = useRef(null);
  const resumeUploadRef = useRef(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch(`${API_URL}/resume`);
        const data = await response.json();
        setResume(normalizeResumeData(data));
      } catch (error) {
        console.error("Failed to load resume", error);
      }
    };

    loadResume();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const persistResume = async () => {
      try {
        await fetch(`${API_URL}/resume`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(resume),
          signal: controller.signal
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to persist resume", error);
        }
      }
    };

    if (resume.personalInfo.fullName) {
      persistResume();
    }

    return () => controller.abort();
  }, [resume]);

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jobDescription,
          resume
        })
      });

      const data = await response.json();
      setKeywords(data.keywords);
      setResume(normalizeResumeData(data.optimizedResume));
    } catch (error) {
      console.error("Failed to optimize resume", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTransform = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setIsTransforming(true);
    try {
      const response = await fetch(`${API_URL}/resume/transform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jobDescription,
          resume
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Transformation failed");
      }

      setKeywords(data.keywords || []);
      setTransformationResult(data);
    } catch (error) {
      console.error("Failed to transform resume", error);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleDownload = () => {
    if (!resumeRef.current) {
      return;
    }

    html2pdf()
      .set({
        margin: [0, 0, 0, 0],
        filename: `${resume.personalInfo.fullName || "resume"}-${selectedTemplate}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(resumeRef.current)
      .save();
  };

  const toggleLeftPanel = (section) => {
    setLeftPanels((current) => ({
      ...current,
      [section]: !current[section]
    }));
  };

  const handleImportedResume = (importedResume) => {
    setResume(normalizeResumeData(importedResume));
    setTransformationResult(null);
  };

  const handleApplyTransformation = () => {
    if (!transformationResult?.transformedResume) {
      return;
    }

    setResume(normalizeResumeData(transformationResult.transformedResume));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#f5faff_0%,_#eef4fb_50%,_#e7eef8_100%)] px-4 py-5 text-ink md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <TopBar
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onOptimize={handleOptimize}
          onDownload={handleDownload}
          onUploadResume={() => resumeUploadRef.current?.click()}
          isOptimizing={isOptimizing}
          isUploading={isUploadingResume}
          currentUser={currentUser}
          onSignOut={onSignOut}
        />

        <div className="grid gap-3 lg:hidden">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-2 shadow-panel backdrop-blur">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMobileView("editor")}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mobileView === "editor"
                    ? "bg-ink text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setMobileView("preview")}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mobileView === "preview"
                    ? "bg-ink text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <div className={`space-y-6 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
            <ResumeImportPanel
              isOpen={leftPanels.import}
              onToggle={() => toggleLeftPanel("import")}
              onImportComplete={handleImportedResume}
              externalFileInputRef={resumeUploadRef}
              onFileImportStateChange={setIsUploadingResume}
            />
            <JobMatchPanel
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              keywords={keywords}
              onAnalyze={handleOptimize}
              onTransform={handleTransform}
              onApplyTransformation={handleApplyTransformation}
              transformationResult={transformationResult}
              isAnalyzing={isOptimizing}
              isTransforming={isTransforming}
              isOpen={leftPanels.analyzer}
              onToggle={() => toggleLeftPanel("analyzer")}
            />
            <ResumeEditor resume={resume} setResume={setResume} />
          </div>

          <div className={mobileView === "editor" ? "hidden lg:block" : ""}>
            <ResumePreview
              resume={resume}
              selectedTemplate={selectedTemplate}
              resumeRef={resumeRef}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
