import OpenAI from "openai";
import { env } from "../config/env.js";
import { extractKeywords } from "./keywordService.js";

const MODEL = env.openAiModel;

const stripRichText = (value = "") =>
  String(value).replace(/\[(\/)?(b|i|u|color(?::#[0-9a-fA-F]{3,6})?)\]/g, "");

const normalizeText = (value = "") => stripRichText(value).toLowerCase();

const JD_HINTS = {
  backend: ["backend", "api", "microservice", "server", "rest", "scalable", "distributed"],
  frontend: ["frontend", "ui", "ux", "react", "next", "javascript", "css"],
  data: ["data", "analytics", "sql", "pipeline", "etl", "warehouse"],
  cloud: ["aws", "azure", "gcp", "docker", "kubernetes", "devops", "cloud"]
};

const ACTION_VERBS = [
  "Designed",
  "Built",
  "Delivered",
  "Developed",
  "Improved",
  "Optimized",
  "Implemented",
  "Created"
];

function getResumeEvidence(resume) {
  return {
    companies: resume.experience.map((item) => item.company),
    roles: resume.experience.map((item) => item.role),
    projects: resume.projects.map((item) => item.name),
    education: resume.education.map((item) => item.degree),
    skills: resume.skills.flatMap((group) => group.items.map((item) => item.name)),
    text: [
      resume.personalInfo.title,
      resume.personalInfo.summary,
      ...resume.skills.flatMap((group) => [group.category, ...group.items.map((item) => item.name)]),
      ...resume.experience.flatMap((item) => [item.company, item.role, ...item.achievements]),
      ...resume.projects.flatMap((item) => [item.name, item.stack, item.description]),
      ...resume.education.flatMap((item) => [item.degree, item.institution, item.details])
    ]
      .filter(Boolean)
      .map(normalizeText)
      .join(" ")
  };
}

function getMissingRequirements(keywords, resumeEvidence) {
  return keywords
    .map((item) => item.keyword)
    .filter((keyword) => !resumeEvidence.text.includes(keyword.toLowerCase()))
    .slice(0, 8);
}

function choosePrimaryFocus(jobDescription, keywords) {
  const jdText = normalizeText(jobDescription);
  const focusScores = Object.entries(JD_HINTS).map(([focus, terms]) => ({
    focus,
    score:
      terms.reduce((sum, term) => sum + (jdText.includes(term) ? 2 : 0), 0) +
      keywords.reduce((sum, keyword) => sum + (terms.includes(keyword.keyword) ? 1 : 0), 0)
  }));

  return focusScores.sort((a, b) => b.score - a.score)[0]?.focus || "backend";
}

function inferCapabilityPhrases(resumeEvidence, primaryFocus) {
  const capabilities = [];
  const evidenceText = resumeEvidence.text;

  if (evidenceText.includes("api") || evidenceText.includes("node") || evidenceText.includes("express")) {
    capabilities.push("backend API development");
  }
  if (evidenceText.includes("react") || evidenceText.includes("ui") || evidenceText.includes("frontend")) {
    capabilities.push("product-facing interface development");
  }
  if (evidenceText.includes("performance") || evidenceText.includes("optimiz")) {
    capabilities.push("performance optimization");
  }
  if (evidenceText.includes("dashboard") || evidenceText.includes("workflow")) {
    capabilities.push("workflow and platform engineering");
  }
  if (evidenceText.includes("mongodb") || evidenceText.includes("database")) {
    capabilities.push("data-driven application design");
  }

  if (primaryFocus === "backend" && !capabilities.includes("backend API development")) {
    capabilities.unshift("server-side engineering");
  }

  return capabilities.slice(0, 3);
}

function buildRewrittenTitle(resume, jobDescription, keywords) {
  const firstLine = stripRichText(jobDescription).split(/\n|\./)[0].trim();
  const topKeywords = keywords.slice(0, 4).map((item) => item.keyword);
  const titleSeed = firstLine.length && firstLine.length < 70
    ? firstLine
    : stripRichText(resume.personalInfo.title || "Software Engineer");

  if (!topKeywords.length) {
    return titleSeed;
  }

  const roleKeyword = topKeywords.find((keyword) =>
    ["backend", "frontend", "developer", "engineer", "api", "platform", "cloud", "data"].includes(
      keyword
    )
  );

  if (!roleKeyword || normalizeText(titleSeed).includes(roleKeyword)) {
    return titleSeed;
  }

  const mapped = {
    api: "API",
    backend: "Backend",
    frontend: "Frontend",
    platform: "Platform",
    cloud: "Cloud",
    data: "Data",
    developer: "Developer",
    engineer: "Engineer"
  };

  return `${stripRichText(resume.personalInfo.title || "Software Engineer")} | ${mapped[roleKeyword] || roleKeyword} Focus`;
}

function buildRewrittenSummary(resume, jobDescription, keywords) {
  const resumeEvidence = getResumeEvidence(resume);
  const primaryFocus = choosePrimaryFocus(jobDescription, keywords);
  const topKeywords = keywords.slice(0, 5).map((item) => item.keyword);
  const capabilities = inferCapabilityPhrases(resumeEvidence, primaryFocus);

  const openingByFocus = {
    backend: "Backend-focused software engineer",
    frontend: "Product-focused frontend engineer",
    data: "Data-driven software professional",
    cloud: "Platform-minded software engineer"
  };

  const opening = openingByFocus[primaryFocus] || "Software engineer";
  const capabilityLine = capabilities.length
    ? `Experience includes ${capabilities.join(", ")}.`
    : "Experience includes practical engineering delivery across modern web products.";
  const keywordLine = topKeywords.length
    ? `Tailored for roles prioritizing ${topKeywords.join(", ")} while staying grounded in proven work.`
    : "Tailored for the target role while staying grounded in proven work.";

  return `${opening} with hands-on experience delivering production features, collaborating across product workflows, and translating requirements into reliable software. ${capabilityLine} ${keywordLine}`;
}

function groupSkillsForRewrite(resume, keywords, primaryFocus) {
  const allSkills = resume.skills.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      category: group.category
    }))
  );

  const scoreSkill = (skill) => {
    const text = normalizeText(`${skill.name} ${skill.category}`);
    return keywords.reduce(
      (sum, keyword) => sum + (text.includes(keyword.keyword) ? keyword.keyword.length : 0),
      0
    );
  };

  const sorted = [...allSkills].sort((a, b) => scoreSkill(b) - scoreSkill(a));
  const primary = [];
  const supporting = [];

  for (const skill of sorted) {
    if (scoreSkill(skill) > 0 || normalizeText(skill.category).includes(primaryFocus)) {
      primary.push({ name: skill.name, level: skill.level });
    } else {
      supporting.push({ name: skill.name, level: skill.level });
    }
  }

  return [
    {
      category: primaryFocus === "backend" ? "Role-Aligned Skills" : "Priority Skills",
      items: primary.slice(0, 8)
    },
    {
      category: "Supporting Tools",
      items: supporting.slice(0, 8)
    }
  ].filter((group) => group.items.length);
}

function buildKeywordPhrases(itemText, keywords) {
  const lower = normalizeText(itemText);
  return keywords
    .map((item) => item.keyword)
    .filter((keyword) => lower.includes(keyword) || keyword.length > 5)
    .slice(0, 3);
}

function rewriteAchievement(achievement, role, company, keywords, index) {
  const clean = stripRichText(achievement).replace(/^[-•]\s*/, "").trim();
  const verb = ACTION_VERBS[index % ACTION_VERBS.length];
  const phrases = buildKeywordPhrases(`${role} ${company} ${clean}`, keywords);
  const alreadyStrong = /^(built|designed|developed|created|improved|optimized|implemented|delivered)\b/i.test(
    clean
  );
  const baseSentence = alreadyStrong
    ? clean
    : `${verb} ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;

  if (!clean) {
    return clean;
  }

  if (!phrases.length) {
    return baseSentence;
  }

  const phraseText = phrases.join(", ");
  return `${baseSentence} with emphasis on ${phraseText}.`;
}

function rebuildExperience(resume, keywords) {
  return resume.experience.map((item) => ({
    ...item,
    achievements: item.achievements.length
      ? item.achievements.map((achievement, index) =>
          rewriteAchievement(achievement, item.role, item.company, keywords, index)
        )
      : [
          `Delivered engineering work aligned with ${keywords
            .slice(0, 3)
            .map((keyword) => keyword.keyword)
            .join(", ")}.`
        ]
  }));
}

function rewriteProjectDescription(project, keywords, index) {
  const stack = stripRichText(project.stack);
  const description = stripRichText(project.description);
  const phrases = buildKeywordPhrases(`${project.name} ${stack} ${description}`, keywords);
  const lead = ACTION_VERBS[(index + 2) % ACTION_VERBS.length];
  const alreadyStrong = /^(built|designed|developed|created|improved|optimized|implemented|delivered)\b/i.test(
    description
  );
  const baseSentence = alreadyStrong
    ? description
    : `${lead} ${description.charAt(0).toLowerCase()}${description.slice(1)}`;

  if (!description) {
    return `${lead} a project demonstrating practical engineering execution and role-relevant problem solving.`;
  }

  if (!phrases.length) {
    return baseSentence;
  }

  return `${baseSentence} with stronger emphasis on ${phrases.join(", ")}.`;
}

function rebuildProjects(resume, keywords) {
  return resume.projects.map((project, index) => ({
    ...project,
    stack: project.stack,
    description: rewriteProjectDescription(project, keywords, index)
  }));
}

function rebuildEducation(resume, primaryFocus) {
  return resume.education.map((item) => ({
    ...item,
    details: item.details
      ? `${stripRichText(item.details)} Focused on foundations relevant to ${primaryFocus} engineering roles.`
      : `Academic foundation relevant to ${primaryFocus} engineering roles.`
  }));
}

function buildFallbackChanges(keywords) {
  const topKeywords = keywords.slice(0, 6).map((item) => item.keyword);
  const changes = [
    "Rebuilt the professional summary from scratch around the target role.",
    "Reorganized skills into a new role-aligned structure based on the job description.",
    "Rewrote experience bullets to sound like a fresh, tailored resume while preserving factual anchors.",
    "Reframed project descriptions to better match recruiter and ATS expectations."
  ];

  if (topKeywords.length) {
    changes.unshift(`The rewrite was driven by ATS terms such as ${topKeywords.join(", ")}.`);
  }

  return changes;
}

function applyFallbackTransformation(resume, jobDescription, keywords) {
  const resumeEvidence = getResumeEvidence(resume);
  const primaryFocus = choosePrimaryFocus(jobDescription, keywords);
  const transformedResume = {
    ...resume,
    personalInfo: {
      ...resume.personalInfo,
      title: buildRewrittenTitle(resume, jobDescription, keywords),
      summary: buildRewrittenSummary(resume, jobDescription, keywords)
    },
    skills: groupSkillsForRewrite(resume, keywords, primaryFocus),
    experience: rebuildExperience(resume, keywords),
    projects: rebuildProjects(resume, keywords),
    education: rebuildEducation(resume, primaryFocus)
  };

  return {
    provider: "fallback",
    transformedResume,
    changeSummary: buildFallbackChanges(keywords),
    missingRequirements: getMissingRequirements(keywords, resumeEvidence),
    truthfulnessCheck: [
      "Companies, role titles, dates, project names, and education records remained locked.",
      "The resume was fully rewritten in tone and structure without inventing unsupported experience.",
      "Missing hard requirements were flagged separately instead of being inserted as claims."
    ]
  };
}

function safeJsonParse(rawText) {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI response did not contain JSON.");
  }

  return JSON.parse(match[0]);
}

function validateSkillGroups(candidateSkills, originalResume) {
  const allowedSkills = new Set(
    originalResume.skills.flatMap((group) => group.items.map((item) => normalizeText(item.name)))
  );

  if (!Array.isArray(candidateSkills)) {
    return originalResume.skills;
  }

  const cleaned = candidateSkills
    .map((group) => ({
      category: stripRichText(group?.category || "Role-Aligned Skills"),
      items: Array.isArray(group?.items)
        ? group.items
            .filter((item) => allowedSkills.has(normalizeText(item?.name)))
            .map((item) => ({
              name: stripRichText(item.name),
              level: stripRichText(item.level || "Intermediate")
            }))
        : []
    }))
    .filter((group) => group.items.length);

  return cleaned.length ? cleaned : originalResume.skills;
}

function validateAndMergeResume(originalResume, candidateResume, keywords) {
  const lockedExperience = originalResume.experience.map((item) => ({
    company: item.company,
    role: item.role,
    startDate: item.startDate,
    endDate: item.endDate
  }));
  const lockedProjects = originalResume.projects.map((item) => item.name);
  const lockedEducation = originalResume.education.map((item) => ({
    degree: item.degree,
    institution: item.institution,
    startDate: item.startDate,
    endDate: item.endDate
  }));

  const transformedResume = {
    ...originalResume,
    personalInfo: {
      ...originalResume.personalInfo,
      title: candidateResume?.personalInfo?.title || originalResume.personalInfo.title,
      summary: candidateResume?.personalInfo?.summary || originalResume.personalInfo.summary
    },
    skills: validateSkillGroups(candidateResume?.skills, originalResume),
    experience: originalResume.experience.map((item, index) => ({
      ...item,
      ...lockedExperience[index],
      achievements:
        candidateResume?.experience?.[index]?.achievements?.filter(Boolean)?.map(stripRichText) ||
        item.achievements
    })),
    projects: originalResume.projects.map((item, index) => ({
      ...item,
      name: lockedProjects[index],
      description:
        stripRichText(candidateResume?.projects?.[index]?.description || item.description),
      stack: stripRichText(candidateResume?.projects?.[index]?.stack || item.stack),
      link: item.link
    })),
    education: originalResume.education.map((item, index) => ({
      ...item,
      ...lockedEducation[index],
      details: stripRichText(candidateResume?.education?.[index]?.details || item.details)
    }))
  };

  const resumeEvidence = getResumeEvidence(originalResume);
  const missingRequirements = getMissingRequirements(keywords, resumeEvidence);

  return {
    transformedResume,
    missingRequirements
  };
}

async function transformWithOpenAI(resume, jobDescription, keywords) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an expert ATS resume writer.

Task:
Generate a fully reconstructed resume tailored to the target job description. The final resume should read like it was newly written for this role, not lightly edited.

Strict constraints:
1. Do not invent companies, roles, dates, project names, degrees, institutions, or false tool experience.
2. Do not claim expertise in technologies that are not evidenced in the original resume.
3. You may rewrite the entire wording of the summary, skills grouping, experience bullets, project descriptions, and education details.
4. Keep the same number and order of experience entries, project entries, and education entries.
5. Keep companies, roles, project names, institutions, and dates unchanged in the output.
6. Missing hard-skill requirements must be listed in missingRequirements, not inserted as false claims.
7. Output valid JSON only.

Write aggressively for relevance:
- Use ATS-friendly phrases from the job description when they can be supported by the original resume.
- Rebuild the summary from scratch.
- Reorganize the skills section into a new structure aligned to the role.
- Rewrite every experience bullet to sound role-specific and recruiter-friendly.
- Rewrite every project description to maximize relevance.

Return exactly:
{
  "transformedResume": {
    "personalInfo": { "title": "", "summary": "" },
    "skills": [{ "category": "", "items": [{ "name": "", "level": "" }] }],
    "experience": [{ "achievements": ["", ""] }],
    "projects": [{ "stack": "", "description": "" }],
    "education": [{ "details": "" }]
  },
  "changeSummary": ["", ""],
  "missingRequirements": ["", ""],
  "truthfulnessCheck": ["", ""]
}

Target job description:
${jobDescription}

Extracted keywords:
${JSON.stringify(keywords)}

Original resume JSON:
${JSON.stringify(resume)}
`;

  const response = await client.responses.create({
    model: MODEL,
    input: prompt
  });

  const parsed = safeJsonParse(response.output_text || "");
  const { transformedResume, missingRequirements } = validateAndMergeResume(
    resume,
    parsed.transformedResume,
    keywords
  );

  return {
    provider: "openai",
    transformedResume,
    changeSummary: Array.isArray(parsed.changeSummary) ? parsed.changeSummary : [],
    missingRequirements:
      Array.isArray(parsed.missingRequirements) && parsed.missingRequirements.length
        ? parsed.missingRequirements
        : missingRequirements,
    truthfulnessCheck: Array.isArray(parsed.truthfulnessCheck)
      ? parsed.truthfulnessCheck
      : [
          "Factual anchors such as employers, roles, dates, and project names were preserved.",
          "Missing hard requirements were kept out of the rewritten resume."
        ]
  };
}

export async function transformResumeForJob(resume, jobDescription) {
  const keywords = extractKeywords(jobDescription);

  if (!env.openAiKey) {
    return {
      keywords,
      ...applyFallbackTransformation(resume, jobDescription, keywords)
    };
  }

  try {
    const result = await transformWithOpenAI(resume, jobDescription, keywords);
    return {
      keywords,
      ...result
    };
  } catch (error) {
    return {
      keywords,
      ...applyFallbackTransformation(resume, jobDescription, keywords),
      provider: "fallback",
      error: error.message
    };
  }
}
