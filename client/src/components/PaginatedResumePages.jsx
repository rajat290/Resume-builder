import { useLayoutEffect, useState } from "react";

const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_TOP_MM = 10;
const PAGE_MARGIN_BOTTOM_MM = 10;
const PAGE_HEIGHT_PX = (PAGE_HEIGHT_MM / 25.4) * 96;
const PAGE_CONTENT_HEIGHT_PX =
  ((PAGE_HEIGHT_MM - PAGE_MARGIN_TOP_MM - PAGE_MARGIN_BOTTOM_MM) / 25.4) * 96;

export default function PaginatedResumePages({
  Template,
  resume,
  resumeRef,
  spacingDensity,
  fontStyle,
  showPageLabels = true
}) {
  const [pageCount, setPageCount] = useState(1);

  useLayoutEffect(() => {
    if (!resumeRef?.current) {
      return undefined;
    }

    const updatePageCount = () => {
      const contentHeight = resumeRef.current?.scrollHeight || 0;
      // Subtract a small buffer (2px) to prevent "ghost" extra pages 
      // from sub-pixel rendering or rounding errors.
      setPageCount(Math.max(1, Math.ceil((contentHeight - 2) / PAGE_CONTENT_HEIGHT_PX)));
    };

    updatePageCount();

    const observer = new ResizeObserver(updatePageCount);
    observer.observe(resumeRef.current);
    window.addEventListener("resize", updatePageCount);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePageCount);
    };
  }, [resume, resumeRef, spacingDensity, fontStyle]);

  return (
    <>
      <div className="resume-measure-shell" aria-hidden="true">
        <div
          ref={resumeRef}
          className={`resume-density-${spacingDensity} inline-block bg-white`}
          style={fontStyle}
        >
          <Template resume={resume} />
        </div>
      </div>

      <div className="flex min-w-[210mm] flex-col gap-4">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div key={`resume-page-${pageIndex}`} className="resume-page-frame">
            {showPageLabels && (
              <div className="resume-page-label">
                Page {pageIndex + 1}
              </div>
            )}
            <div className="resume-page-viewport">
              <div
                className={`resume-density-${spacingDensity} bg-white`}
                style={{
                  ...fontStyle,
                  transform: `translateY(-${pageIndex * PAGE_CONTENT_HEIGHT_PX}px)`
                }}
              >
                <Template resume={resume} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
