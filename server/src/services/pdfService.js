import puppeteer from "puppeteer";

let browserPromise;

function getPrintStyles() {
  return `
    <style>
      @page {
        size: A4;
        margin: 10mm;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #111827;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        font-family: "Segoe UI", Arial, sans-serif;
      }

      .print-shell {
        width: 100%;
        margin: 0 auto;
        background: #ffffff;
      }

      .print-shell .resume-page {
        width: auto !important;
        min-height: auto !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        background: #ffffff !important;
      }

      .print-shell header,
      .print-shell .rounded-2xl,
      .print-shell .rounded-xl,
      .print-shell .rounded-lg {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .print-shell section,
      .print-shell article,
      .print-shell ul,
      .print-shell ol {
        break-inside: auto;
        page-break-inside: auto;
      }

      .print-shell h1,
      .print-shell h2,
      .print-shell h3 {
        break-after: avoid;
        page-break-after: avoid;
      }

      .print-shell ul,
      .print-shell ol {
        margin-top: 0.45rem !important;
        margin-bottom: 0 !important;
      }

      .print-shell li {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .print-shell p,
      .print-shell li {
        orphans: 3;
        widows: 3;
      }

      .print-shell a {
        color: inherit !important;
        text-decoration: none !important;
      }
    </style>
  `;
}

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
  }

  return browserPromise;
}

function buildDocument({ html, styles = "", title = "Resume" }) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${styles}
        ${getPrintStyles()}
      </head>
      <body>
        <main class="print-shell">
          ${html}
        </main>
      </body>
    </html>
  `;
}

export async function createResumePdf({ html, styles, title }) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(buildDocument({ html, styles, title }), {
      waitUntil: ["load", "domcontentloaded", "networkidle0"]
    });

    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
