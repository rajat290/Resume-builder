import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import JobMatchPanel from "./components/JobMatchPanel";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import TopBar from "./components/TopBar";
import { emptyResume } from "./utils/resumeHelpers";

const API_URL = "http://localhost:4000/api";

export default function App() {
  const [resume, setResume] = useState(emptyResume);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch(`${API_URL}/resume`);
        const data = await response.json();
        setResume(data);
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
      setResume(data.optimizedResume);
    } catch (error) {
      console.error("Failed to optimize resume", error);
    } finally {
      setIsOptimizing(false);
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(198,107,61,0.12),_transparent_35%),linear-gradient(180deg,_#f7f3eb_0%,_#eef3f7_56%,_#e3ebf3_100%)] px-4 py-6 text-ink md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <TopBar
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onOptimize={handleOptimize}
          onDownload={handleDownload}
          isOptimizing={isOptimizing}
        />

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <JobMatchPanel
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              keywords={keywords}
            />
            <ResumeEditor resume={resume} setResume={setResume} />
          </div>

          <ResumePreview
            resume={resume}
            selectedTemplate={selectedTemplate}
            resumeRef={resumeRef}
          />
        </div>
      </div>
    </main>
  );
}
