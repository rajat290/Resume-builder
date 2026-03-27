import { hasText, stripRichText } from "./resumeHelpers";

const scoreClamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

const normalize = (value = "") => stripRichText(value).toLowerCase();

function getAllResumeText(resume) {
  return [
    resume.personalInfo.fullName,
    resume.personalInfo.title,
    resume.personalInfo.summary,
    ...resume.skills.flatMap((group) => [group.category, ...group.items.map((item) => item.name)]),
    ...resume.experience.flatMap((item) => [item.company, item.role, ...item.achievements]),
    ...resume.projects.flatMap((item) => [item.name, item.stack, item.description]),
    ...resume.education.flatMap((item) => [item.degree, item.institution, item.details])
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");
}

function getMissingKeywords(resume, keywords = []) {
  const resumeText = getAllResumeText(resume);
  return keywords
    .map((item) => item.keyword)
    .filter((keyword) => !resumeText.includes(keyword.toLowerCase()))
    .slice(0, 8);
}

function getMatchedKeywords(resume, keywords = []) {
  const resumeText = getAllResumeText(resume);
  return keywords
    .map((item) => item.keyword)
    .filter((keyword) => resumeText.includes(keyword.toLowerCase()))
    .slice(0, 8);
}

function getOverusedKeywords(resume, keywords = []) {
  const resumeText = getAllResumeText(resume);
  return keywords
    .map((item) => item.keyword)
    .filter((keyword) => {
      const matches = resumeText.match(new RegExp(keyword, "gi"));
      return matches && matches.length >= 3;
    })
    .slice(0, 5);
}

function scoreAts(resume) {
  let score = 55;

  if (hasText(resume.personalInfo.fullName)) score += 4;
  if (hasText(resume.personalInfo.email)) score += 4;
  if (hasText(resume.personalInfo.phone)) score += 3;
  if (hasText(resume.personalInfo.summary)) score += 8;
  if (resume.skills.some((group) => group.items.some((item) => hasText(item.name)))) score += 8;
  if (resume.experience.some((item) => hasText(item.role) && hasText(item.company))) score += 10;
  if (resume.projects.some((item) => hasText(item.name))) score += 5;
  if (resume.education.some((item) => hasText(item.degree))) score += 3;

  return scoreClamp(score);
}

function scoreKeywords(resume, keywords = []) {
  if (!keywords.length) {
    return 68;
  }

  const matched = getMatchedKeywords(resume, keywords).length;
  const ratio = matched / Math.max(keywords.length, 1);
  return scoreClamp(45 + ratio * 55);
}

function scoreImpact(resume) {
  let score = 40;
  const bullets = resume.experience.flatMap((item) => item.achievements || []);
  const strongBullets = bullets.filter((bullet) =>
    /built|designed|improved|optimized|delivered|implemented|created|increased|reduced/i.test(
      stripRichText(bullet)
    )
  ).length;

  score += Math.min(strongBullets * 8, 30);

  if (hasText(resume.personalInfo.summary)) score += 8;
  if (resume.projects.some((item) => hasText(item.description))) score += 10;

  return scoreClamp(score);
}

function scoreReadability(resume) {
  let score = 50;

  if (hasText(resume.personalInfo.summary)) score += 10;
  if (resume.skills.length > 0) score += 8;
  if (resume.experience.length > 0) score += 12;
  if (resume.projects.length > 0) score += 8;
  if (resume.education.length > 0) score += 4;

  const tooLongSummary = stripRichText(resume.personalInfo.summary).length > 320;
  if (tooLongSummary) score -= 10;

  return scoreClamp(score);
}

export function buildResumeScore(resume, keywords = []) {
  const ats = scoreAts(resume);
  const keywordScore = scoreKeywords(resume, keywords);
  const impact = scoreImpact(resume);
  const readability = scoreReadability(resume);
  const overall = scoreClamp((ats + keywordScore + impact + readability) / 4);

  return {
    overall,
    breakdown: [
      {
        id: "ats",
        label: "ATS",
        score: ats,
        description: "Structure and completeness for parser-friendly resumes."
      },
      {
        id: "keywords",
        label: "Keywords",
        score: keywordScore,
        description: "How well your resume reflects the target job language."
      },
      {
        id: "impact",
        label: "Impact",
        score: impact,
        description: "Strength of your bullets, summary, and measurable positioning."
      },
      {
        id: "readability",
        label: "Readability",
        score: readability,
        description: "How easy the content feels for recruiters to scan quickly."
      }
    ],
    matchedKeywords: getMatchedKeywords(resume, keywords),
    missingKeywords: getMissingKeywords(resume, keywords),
    overusedKeywords: getOverusedKeywords(resume, keywords)
  };
}

export function buildSuggestionCards({
  resume,
  keywords = [],
  scoreData,
  transformationResult
}) {
  const cards = [];

  if (scoreData.missingKeywords.length) {
    cards.push({
      id: "missing-keywords",
      tier: "fix-now",
      title: `Add ${scoreData.missingKeywords.length} missing role keywords`,
      description: "These terms appear in the job description but are weak or missing in your resume.",
      impact: "High",
      actionLabel: transformationResult ? "Review rewritten match" : "Run AI rewrite"
    });
  }

  const summary = stripRichText(resume.personalInfo.summary);
  if (!hasText(summary) || summary.length < 90) {
    cards.push({
      id: "summary",
      tier: "recommended",
      title: "Strengthen your summary",
      description: "A stronger opening can improve recruiter clarity in the first few seconds.",
      impact: "Medium",
      actionLabel: transformationResult ? "Use rewritten summary" : "Rewrite summary"
    });
  }

  const weakBullets = resume.experience
    .flatMap((item) => item.achievements || [])
    .filter((bullet) => !/built|designed|improved|optimized|delivered|implemented|created/i.test(stripRichText(bullet)));

  if (weakBullets.length) {
    cards.push({
      id: "bullets",
      tier: "recommended",
      title: `Improve ${weakBullets.length} weak experience bullet${weakBullets.length > 1 ? "s" : ""}`,
      description: "Use stronger action verbs and job-relevant outcomes to improve impact.",
      impact: "Medium",
      actionLabel: transformationResult ? "Compare before vs after" : "Rewrite bullets"
    });
  }

  if (scoreData.overusedKeywords.length) {
    cards.push({
      id: "overused",
      tier: "optional",
      title: "Reduce repeated wording",
      description: `Repeated terms like ${scoreData.overusedKeywords.join(", ")} can make the resume feel less sharp.`,
      impact: "Low",
      actionLabel: "Polish wording"
    });
  }

  if (!cards.length) {
    cards.push({
      id: "healthy",
      tier: "recommended",
      title: "Your resume is in strong shape",
      description: "Run a full rewrite for a sharper role-specific version before applying.",
      impact: "Medium",
      actionLabel: "Generate rewrite"
    });
  }

  return cards;
}
