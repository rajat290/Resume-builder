import { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import JobMatchPanel from "./JobMatchPanel";
import ResumeComparison from "./ResumeComparison";
import ResumeEditor from "./ResumeEditor";
import ResumeImportPanel from "./ResumeImportPanel";
import ResumePreview from "./ResumePreview";
import ResumeScoreCard from "./ResumeScoreCard";
import TopBar from "./TopBar";
import MobileActionBar from "./mobile/MobileActionBar";
import MobileBottomTabs from "./mobile/MobileBottomTabs";
import MobileCompareTab from "./mobile/MobileCompareTab";
import MobileEditTab from "./mobile/MobileEditTab";
import MobileHeader from "./mobile/MobileHeader";
import MobilePreviewTab from "./mobile/MobilePreviewTab";
import MobileScoreTab from "./mobile/MobileScoreTab";
import MobileToastHost from "./mobile/MobileToastHost";
import { emptyResume, hasText, normalizeResumeData } from "../utils/resumeHelpers";
import { buildResumeScore, buildSuggestionCards } from "../utils/resumeScoring";

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
  const [mobileTab, setMobileTab] = useState("edit");
  const [mobileEditSection, setMobileEditSection] = useState("import");
  const [previewMode, setPreviewMode] = useState("styled");
  const [compareMode, setCompareMode] = useState("after");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [comparisonSourceResume, setComparisonSourceResume] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [toast, setToast] = useState(null);
  const resumeRef = useRef(null);
  const resumeUploadRef = useRef(null);

  const scoreData = useMemo(() => buildResumeScore(resume, keywords), [resume, keywords]);
  const suggestionCards = useMemo(
    () =>
      buildSuggestionCards({
        resume,
        keywords,
        scoreData,
        transformationResult
      }),
    [resume, keywords, scoreData, transformationResult]
  );

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
    let timeoutId;

    const persistResume = async () => {
      try {
        setSaveState("saving");
        await fetch(`${API_URL}/resume`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(resume),
          signal: controller.signal
        });
        setSaveState("saved");
        timeoutId = window.setTimeout(() => setSaveState("idle"), 2000);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to persist resume", error);
          setSaveState("idle");
        }
      }
    };

    if (resume.personalInfo.fullName) {
      persistResume();
    }

    return () => {
      controller.abort();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [resume]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setIsOptimizing(true);
    setMobileTab("score");
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
      setToast({ message: "Resume optimized", type: "success" });
    } catch (error) {
      console.error("Failed to optimize resume", error);
      setToast({ message: "Optimization failed", type: "warning" });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTransform = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setIsTransforming(true);
    setComparisonSourceResume(structuredClone(resume));
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
      setCompareMode("after");
      setMobileTab("compare");
      setToast({ message: "AI rewrite ready", type: "success" });
    } catch (error) {
      console.error("Failed to transform resume", error);
      setToast({ message: "Rewrite failed", type: "warning" });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleDownload = () => {
    if (!resumeRef.current) {
      setMobileTab("preview");
      setToast({ message: "Open preview to download PDF", type: "warning" });
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

    setToast({ message: "Resume downloaded", type: "success" });
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
    setComparisonSourceResume(null);
    setToast({ message: "Resume imported", type: "success" });
  };

  const handleApplyTransformation = () => {
    if (!transformationResult?.transformedResume) {
      return;
    }

    setResume(normalizeResumeData(transformationResult.transformedResume));
    setMobileTab("preview");
    setToast({ message: "Rewritten resume applied", type: "success" });
  };

  const handleSuggestionAction = (suggestion) => {
    if (suggestion.id === "missing-keywords") {
      if (transformationResult) {
        setMobileTab("compare");
        setCompareMode("after");
      } else {
        handleTransform();
      }
      return;
    }

    if (suggestion.id === "summary") {
      setMobileTab("edit");
      setMobileEditSection("personal");
      return;
    }

    if (suggestion.id === "bullets") {
      setMobileTab("edit");
      setMobileEditSection("experience");
      return;
    }

    if (suggestion.id === "overused") {
      setMobileTab("edit");
      setMobileEditSection("projects");
      return;
    }

    if (suggestion.id === "healthy") {
      if (transformationResult) {
        setMobileTab("compare");
      } else {
        handleTransform();
      }
    }
  };

  const handleKeywordTap = () => {
    if (transformationResult) {
      setMobileTab("compare");
      return;
    }

    handleTransform();
  };

  const previewResume = transformationResult?.transformedResume
    ? normalizeResumeData(transformationResult.transformedResume)
    : resume;

  const canDownload =
    hasText(resume.personalInfo.fullName) ||
    resume.experience.length > 0 ||
    resume.projects.length > 0;

  const mobileTitleMap = {
    edit: "Edit Resume",
    score: "Resume Score",
    preview: "Preview Resume",
    compare: "Compare Versions"
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#f5faff_0%,_#eef4fb_50%,_#e7eef8_100%)] px-4 py-5 text-ink md:px-6 lg:px-8">
      <MobileToastHost toast={toast} />

      <div className="mx-auto hidden max-w-[1600px] space-y-6 lg:block">
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

        <ResumeScoreCard scoreData={scoreData} />

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <div className="space-y-6">
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
              suggestionCards={suggestionCards}
              onSuggestionAction={handleSuggestionAction}
              isAnalyzing={isOptimizing}
              isTransforming={isTransforming}
              isOpen={leftPanels.analyzer}
              onToggle={() => toggleLeftPanel("analyzer")}
            />
            <ResumeEditor resume={resume} setResume={setResume} />
          </div>

          <div>
            {transformationResult?.transformedResume && comparisonSourceResume ? (
              <ResumeComparison
                originalResume={comparisonSourceResume}
                rewrittenResume={normalizeResumeData(transformationResult.transformedResume)}
                selectedTemplate={selectedTemplate}
              />
            ) : (
              <ResumePreview
                resume={resume}
                selectedTemplate={selectedTemplate}
                resumeRef={resumeRef}
              />
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileHeader
          title={mobileTitleMap[mobileTab]}
          subtitle={jobDescription.trim() ? "Target role loaded" : "Add a job description to optimize"}
          saveState={saveState}
        />

        <div className="mobile-content">
          {mobileTab === "edit" && (
            <MobileEditTab
              resume={resume}
              setResume={setResume}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              openSection={mobileEditSection}
              onSectionChange={setMobileEditSection}
              resumeUploadRef={resumeUploadRef}
              onImportComplete={handleImportedResume}
              onFileImportStateChange={setIsUploadingResume}
            />
          )}

          {mobileTab === "score" && (
            <MobileScoreTab
              scoreData={scoreData}
              suggestionCards={suggestionCards}
              transformationResult={transformationResult}
              onSuggestionAction={handleSuggestionAction}
              onKeywordTap={handleKeywordTap}
            />
          )}

          {mobileTab === "preview" && (
            <MobilePreviewTab
              resume={previewResume}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              previewMode={previewMode}
              onPreviewModeChange={setPreviewMode}
              resumeRef={resumeRef}
            />
          )}

          {mobileTab === "compare" && (
            <MobileCompareTab
              originalResume={comparisonSourceResume}
              rewrittenResume={
                transformationResult?.transformedResume
                  ? normalizeResumeData(transformationResult.transformedResume)
                  : null
              }
              selectedTemplate={selectedTemplate}
              compareMode={compareMode}
              onCompareModeChange={setCompareMode}
              transformationResult={transformationResult}
            />
          )}
        </div>

        <MobileActionBar
          canOptimize={Boolean(jobDescription.trim())}
          isOptimizing={isOptimizing || isTransforming}
          onOptimize={handleOptimize}
          onDownload={handleDownload}
          canDownload={canDownload}
        />

        <MobileBottomTabs
          activeTab={mobileTab}
          onChange={setMobileTab}
          compareEnabled={Boolean(transformationResult?.transformedResume)}
        />
      </div>
    </main>
  );
}
