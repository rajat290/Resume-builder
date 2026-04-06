import { resumeSeed } from "../data/resumeSeed.js";

const stripFormatting = (value = "") =>
  String(value).replace(/\[(\/)?(b|i|u|color(?::#[0-9a-fA-F]{3,6})?)\]/g, "");

const emptyResume = () => structuredClone(resumeSeed);

function normalizeWhitespace(text = "") {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u2022/g, "-")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitSections(text) {
  const lines = normalizeWhitespace(text).split("\n");
  const sections = {};
  let current = "header";
  sections[current] = [];

  const patterns = [
    { key: "summary", regex: /^(professional\s+summary|summary|profile)$/i },
    { key: "skills", regex: /^(skills|technical\s+skills|core\s+skills)$/i },
    {
      key: "experience",
      regex: /^(experience|work\s+experience|professional\s+experience|employment)$/i
    },
    { key: "projects", regex: /^(projects|project\s+experience)$/i },
    { key: "education", regex: /^(education|academic\s+background)$/i }
  ];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) {
      sections[current].push("");
      continue;
    }

    const matched = patterns.find((pattern) => pattern.regex.test(clean));
    if (matched) {
      current = matched.key;
      sections[current] = sections[current] || [];
      continue;
    }

    sections[current].push(clean);
  }

  return sections;
}

function extractHeader(headerLines) {
  const resume = emptyResume();
  const cleanedLines = headerLines.filter(Boolean);

  if (cleanedLines.length > 0) {
    resume.personalInfo.fullName = cleanedLines[0];
  }

  if (cleanedLines.length > 1 && cleanedLines[1].length < 80) {
    resume.personalInfo.title = cleanedLines[1];
  }

  const merged = cleanedLines.join(" ");
  const emailMatch = merged.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = merged.match(/(\+?\d[\d\s()-]{7,}\d)/);
  const linkedinMatch = merged.match(/https?:\/\/[^\s]*linkedin[^\s]*/i);
  const websiteMatch = merged.match(/https?:\/\/(?![^\s]*linkedin)[^\s]+/i);

  resume.personalInfo.email = emailMatch?.[0] || "";
  resume.personalInfo.phone = phoneMatch?.[0] || "";
  resume.personalInfo.linkedin = linkedinMatch?.[0] || "";
  resume.personalInfo.website = websiteMatch?.[0] || "";

  const locationLine = cleanedLines.find(
    (line) =>
      !line.includes("@") &&
      !line.includes("http") &&
      !/\d{5,}/.test(line) &&
      /,/.test(line)
  );
  if (locationLine) {
    resume.personalInfo.location = locationLine;
  } else {
    const locationSegment = cleanedLines
      .flatMap((line) => line.split("|").map((part) => part.trim()))
      .find(
        (part) =>
          !part.includes("@") &&
          !part.includes("http") &&
          !/\d/.test(part) &&
          /,/.test(part)
      );

    resume.personalInfo.location = locationSegment || "";
  }

  return resume;
}

function parseSkills(lines) {
  const skillGroups = [];
  const content = lines.filter(Boolean);

  if (content.length === 0) {
    return [];
  }

  for (const line of content) {
    if (line.includes(":")) {
      const [category, ...rest] = line.split(":");
      const items = rest
        .join(":")
        .split(/,|•|â€¢|-|\|/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({ name, level: "Intermediate" }));

      skillGroups.push({
        category: category.trim(),
        items
      });
      continue;
    }

    const items = line
      .split(/,|•|â€¢|-|\|/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name, level: "Intermediate" }));

    if (items.length) {
      skillGroups.push({
        category: "Core Skills",
        items
      });
    }
  }

  return skillGroups;
}

function parseBlocks(lines) {
  return lines
    .join("\n")
    .split(/\n{2,}/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((block) => block.length);
}

function isDateLine(line = "") {
  return /present|\d{4}|\bjan\b|\bfeb\b|\bmar\b|\bapr\b|\bmay\b|\bjun\b|\bjul\b|\baug\b|\bsep\b|\boct\b|\bnov\b|\bdec\b/i.test(
    line
  );
}

function isBulletLine(line = "") {
  return /^[-•â€¢*]\s*/.test(line);
}

function looksLikeExperienceHeading(line = "") {
  if (!line || isBulletLine(line) || isDateLine(line)) {
    return false;
  }

  if (/\s+at\s+/i.test(line) || /\s+\|\s+/.test(line)) {
    return true;
  }

  const words = line.trim().split(/\s+/);
  if (words.length < 2 || words.length > 12) {
    return false;
  }

  const uppercaseWords = words.filter((word) => /^[A-Z][a-zA-Z0-9&/().+-]*$/.test(word));
  return uppercaseWords.length >= Math.max(2, Math.ceil(words.length / 2));
}

function parseExperienceBlocks(lines) {
  const blocks = [];
  let currentBlock = [];
  const cleanedLines = lines.map((line) => line.trim());

  const flush = () => {
    if (currentBlock.length) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
  };

  for (let index = 0; index < cleanedLines.length; index += 1) {
    const line = cleanedLines[index];
    if (!line) {
      flush();
      continue;
    }

    const nextLine = cleanedLines[index + 1] || "";
    const nextNextLine = cleanedLines[index + 2] || "";
    const shouldStartNewBlock =
      currentBlock.length > 0 &&
      looksLikeExperienceHeading(line) &&
      currentBlock.some((item) => isDateLine(item) || isBulletLine(item)) &&
      (
        isDateLine(nextLine) ||
        isBulletLine(nextLine) ||
        isDateLine(nextNextLine) ||
        /\s+at\s+/i.test(nextLine) ||
        /\s+\|\s+/.test(nextLine)
      );

    if (shouldStartNewBlock) {
      flush();
    }

    currentBlock.push(line);
  }

  flush();
  return blocks;
}

function parseExperience(lines) {
  return parseExperienceBlocks(lines).map((block) => {
    const [line1 = "", line2 = ""] = block;
    const [role, company] = line1.includes(" at ")
      ? line1.split(/\s+at\s+/i)
      : line1.split(/\s+\|\s+/);

    const dateLine = block.find((line) => isDateLine(line)) || "";
    const remainingLines = block.filter((line) => line !== line1 && line !== dateLine);
    const companyLine =
      company || (remainingLines[0] && !isBulletLine(remainingLines[0]) ? remainingLines[0] : "");
    const achievementLines = remainingLines.filter((line) => line !== companyLine);

    return {
      role: (role || line1).trim(),
      company: companyLine.trim(),
      startDate: dateLine.split("-")[0]?.trim() || "",
      endDate: dateLine.split("-")[1]?.trim() || "",
      achievements: achievementLines.length
        ? achievementLines.map((line) => line.replace(/^[-•â€¢*]\s*/, ""))
        : line2 && line2 !== dateLine && line2 !== companyLine
          ? [line2.replace(/^[-•â€¢*]\s*/, "")]
          : []
    };
  });
}

function parseProjects(lines) {
  return parseBlocks(lines).map((block) => {
    const [name = "", stack = "", description = ""] = block;
    const link = block.find((line) => /^https?:\/\//i.test(line)) || "";
    const contentLines = block.slice(link ? 2 : 1).filter(Boolean);
    const bulletLines = contentLines
      .filter((line) => isBulletLine(line))
      .map((line) => line.replace(/^[-•â€¢Ã¢â‚¬Â¢*]\s*/, "").trim());
    const paragraphLines = contentLines.filter((line) => !isBulletLine(line));
    const finalDescription = bulletLines.length
      ? `${paragraphLines.join(" ")}<ul>${bulletLines
          .map((line) => `<li>${line}</li>`)
          .join("")}</ul>`.trim()
      : contentLines.join(" ");

    return {
      name,
      stack: stack === link ? "" : stack,
      link,
      description: finalDescription
    };
  });
}

function parseEducation(lines) {
  return parseBlocks(lines).map((block) => {
    const [degree = "", institution = "", line3 = ""] = block;
    const dateLine = block.find((line) => /\d{4}/.test(line)) || "";
    const detailLines = block.filter(
      (line) => line !== degree && line !== institution && line !== dateLine
    );

    return {
      degree,
      institution: institution === dateLine ? "" : institution,
      startDate: dateLine.split("-")[0]?.trim() || "",
      endDate: dateLine.split("-")[1]?.trim() || "",
      details: detailLines.join(" ") || (line3 !== dateLine ? line3 : "")
    };
  });
}

export function parseResumeText(text = "") {
  const safeText = normalizeWhitespace(stripFormatting(text));
  if (!safeText) {
    return emptyResume();
  }

  const sections = splitSections(safeText);
  const resume = extractHeader(sections.header || []);

  resume.personalInfo.summary = (sections.summary || []).filter(Boolean).join(" ");
  resume.skills = parseSkills(sections.skills || []);
  resume.experience = parseExperience(sections.experience || []);
  resume.projects = parseProjects(sections.projects || []);
  resume.education = parseEducation(sections.education || []);

  return resume;
}
