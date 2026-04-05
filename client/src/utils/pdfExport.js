import { apiFetch } from "./api";
import { getFontStack } from "./resumeHelpers";

function collectDocumentStyles() {
  return Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join("\n");
}

function buildFontStyleBlock({ headingFont, bodyFont }) {
  return `
    <style>
      :root {
        --resume-font-heading: ${getFontStack(headingFont, "merriweather")};
        --resume-font-body: ${getFontStack(bodyFont, "inter")};
      }
    </style>
  `;
}

export async function exportResumeAsPdf({ node, fileName, headingFont, bodyFont }) {
  if (!node) {
    throw new Error("Resume preview is not ready.");
  }

  const response = await apiFetch("/pdf/resume", {
    method: "POST",
    body: JSON.stringify({
      html: node.outerHTML,
      styles: collectDocumentStyles() + buildFontStyleBlock({ headingFont, bodyFont }),
      fileName: fileName || "resume"
    })
  });

  if (!response.ok) {
    let message = "Could not generate PDF.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch (_error) {
      message = "Could not generate PDF.";
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${fileName || "resume"}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
