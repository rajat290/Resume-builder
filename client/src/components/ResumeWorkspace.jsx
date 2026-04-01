import { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import ConnectionBanner from "./ConnectionBanner";
import JobMatchPanel from "./JobMatchPanel";
import ProfilePanel from "./ProfilePanel";
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
import { apiFetch, checkApiHealth, isApiConnectionError } from "../utils/api";

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
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isRetryingBackend, setIsRetryingBackend] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [isComparePageOpen, setIsComparePageOpen] = useState(false);
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

  const addActivity = (title, description) => {
    setActivityLog((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        description,
        timestamp: new Date().toISOString()
      },
      ...current
    ]);
  };

  const handleApiError = (error, fallbackMessage) => {
    if (isApiConnectionError(error)) {
      setBackendStatus("offline");
      setToast({
        message: "Backend offline. Start the server and retry.",
        type: "warning"
      });
      return;
    }

    if (fallbackMessage) {
      setToast({ message: fallbackMessage, type: "warning" });
    }
  };

  const loadResume = async () => {
    try {
      const response = await apiFetch("/resume");
      const data = await response.json();
      setResume(normalizeResumeData(data));
      setBackendStatus("online");
      addActivity(
        "Resume synced",
        currentUser?.mode === "demo"
          ? "Loaded the starter workspace for your current session."
          : "Loaded your latest saved resume from the backend."
      );
      return true;
    } catch (error) {
      console.error("Failed to load resume", error);
      if (isApiConnectionError(error)) {
        setBackendStatus("offline");
      }
      return false;
    }
  };

  const retryBackendConnection = async () => {
    setIsRetryingBackend(true);

    try {
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        throw new Error("Backend health check failed.");
      }

      setBackendStatus("online");
      const loaded = await loadResume();
      setToast({
        message: loaded ? "Backend reconnected" : "Backend reachable",
        type: "success"
      });
    } catch (error) {
      console.error("Backend retry failed", error);
      setBackendStatus("offline");
      setToast({
        message: "Backend still offline. Run npm run dev and try again.",
        type: "warning"
      });
    } finally {
      setIsRetryingBackend(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  useEffect(() => {
    addActivity(
      "Workspace opened",
      currentUser?.mode === "demo"
        ? "Demo mode is active. You can explore the full product without signing in."
        : "Authenticated workspace is ready for resume editing and optimization."
    );
  }, [currentUser?.mode]);

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId;

    const persistResume = async () => {
      try {
        setSaveState("saving");
        await apiFetch("/resume", {
          method: "PUT",
          body: JSON.stringify(resume),
          signal: controller.signal
        });
        setBackendStatus("online");
        setSaveState("saved");
        timeoutId = window.setTimeout(() => setSaveState("idle"), 2000);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to persist resume", error);
          if (isApiConnectionError(error)) {
            setBackendStatus("offline");
            setToast({
              message: "Changes saved locally. Backend sync will resume when the server is back.",
              type: "warning"
            });
          }
          setSaveState("idle");
        }
      }
    };

    if (resume.personalInfo.fullName && backendStatus !== "offline") {
      persistResume();
    }

    return () => {
      controller.abort();
      if (timeoutId) {
      window.clearTimeout(timeoutId);
      }
    };
  }, [backendStatus, resume]);

  useEffect(() => {
    addActivity("Template updated", `Switched preview format to ${selectedTemplate}.`);
  }, [selectedTemplate]);

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
      const response = await apiFetch("/resume/analyze", {
        method: "POST",
        body: JSON.stringify({
          jobDescription,
          resume
        })
      });

      const data = await response.json();
      setKeywords(data.keywords);
      setResume(normalizeResumeData(data.optimizedResume));
      setBackendStatus("online");
      addActivity(
        "Resume optimized",
        `Updated keyword targeting for the current job description and refreshed the score to ${buildResumeScore(
          normalizeResumeData(data.optimizedResume),
          data.keywords
        ).overall}.`
      );
      setToast({ message: "Resume optimized", type: "success" });
    } catch (error) {
      console.error("Failed to optimize resume", error);
      handleApiError(error, "Optimization failed");
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
      const response = await apiFetch("/resume/transform", {
        method: "POST",
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
      setBackendStatus("online");
      setCompareMode("after");
      setMobileTab("compare");
      setIsComparePageOpen(true);
      addActivity(
        "AI rewrite generated",
        "Created a rewritten version aligned to the target role and opened the compare view."
      );
      setToast({ message: "AI rewrite ready", type: "success" });
    } catch (error) {
      console.error("Failed to transform resume", error);
      handleApiError(error, "Rewrite failed");
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

    addActivity("Resume downloaded", "Exported the current resume preview as a PDF.");
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
    setIsComparePageOpen(false);
    addActivity(
      "Resume imported",
      "Imported an existing resume into the editor for faster customization."
    );
    setToast({ message: "Resume imported", type: "success" });
  };

  const handleApplyTransformation = () => {
    if (!transformationResult?.transformedResume) {
      return;
    }

    setResume(normalizeResumeData(transformationResult.transformedResume));
    setMobileTab("preview");
    setIsComparePageOpen(false);
    addActivity(
      "Rewrite applied",
      "Accepted the rewritten resume and moved it into the live preview."
    );
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

  const previewResume = resume;

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

  const handleSectionSave = (_sectionKey, label) => {
    setSaveState("saved");
    setToast({ message: `${label} saved`, type: "success" });
    addActivity(`${label} saved`, `Updated the ${label.toLowerCase()} section in the editor.`);
    window.setTimeout(() => setSaveState("idle"), 1800);
  };

  const handleSaveJobDescription = () => {
    setSaveState("saved");
    setToast({ message: "Job description saved", type: "success" });
    addActivity(
      "Job description saved",
      "Saved the current target role description for scoring and AI rewrite."
    );
    window.setTimeout(() => setSaveState("idle"), 1800);
  };

  if (isComparePageOpen && transformationResult?.transformedResume && comparisonSourceResume) {
    return (
      <>
        <MobileToastHost toast={toast} />
        <ProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          activityLog={activityLog}
          scoreData={scoreData}
          selectedTemplate={selectedTemplate}
          onSignOut={onSignOut}
        />
        <ResumeComparison
          originalResume={comparisonSourceResume}
          rewrittenResume={normalizeResumeData(transformationResult.transformedResume)}
          selectedTemplate={selectedTemplate}
          onBackToEditor={() => {
            setIsComparePageOpen(false);
            setMobileTab("edit");
          }}
          onApplyTransformation={handleApplyTransformation}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#f5faff_0%,_#eef4fb_50%,_#e7eef8_100%)] px-4 py-5 text-ink md:px-6 lg:px-8">
      <MobileToastHost toast={toast} />
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        activityLog={activityLog}
        scoreData={scoreData}
        selectedTemplate={selectedTemplate}
        onSignOut={onSignOut}
      />

      <div className="mx-auto hidden max-w-[1600px] space-y-6 lg:block">
        <ConnectionBanner
          status={backendStatus}
          onRetry={retryBackendConnection}
          isRetrying={isRetryingBackend}
        />
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
          onOpenProfile={() => setIsProfileOpen(true)}
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
              onConnectionError={(error) => handleApiError(error)}
            />
            <JobMatchPanel
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              keywords={keywords}
              onAnalyze={handleOptimize}
              onTransform={handleTransform}
              onApplyTransformation={handleApplyTransformation}
              onSaveJobDescription={handleSaveJobDescription}
              transformationResult={transformationResult}
              suggestionCards={suggestionCards}
              onSuggestionAction={handleSuggestionAction}
              isAnalyzing={isOptimizing}
              isTransforming={isTransforming}
              isOpen={leftPanels.analyzer}
              onToggle={() => toggleLeftPanel("analyzer")}
            />
            <ResumeEditor
              resume={resume}
              setResume={setResume}
              onSectionSave={handleSectionSave}
            />
          </div>

          <div>
            <ResumePreview
              resume={resume}
              selectedTemplate={selectedTemplate}
              resumeRef={resumeRef}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileHeader
          title={mobileTitleMap[mobileTab]}
          subtitle={jobDescription.trim() ? "Target role loaded" : "Add a job description to optimize"}
          saveState={saveState}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileOpen(true)}
          onSignOut={onSignOut}
        />

        <div className="mobile-content">
          <ConnectionBanner
            status={backendStatus}
            onRetry={retryBackendConnection}
            isRetrying={isRetryingBackend}
          />

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
              onConnectionError={(error) => handleApiError(error)}
              onSectionSave={handleSectionSave}
              onSaveJobDescription={handleSaveJobDescription}
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
