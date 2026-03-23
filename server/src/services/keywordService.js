const COMMON_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
  "will",
  "you",
  "your"
]);

const KNOWN_KEYWORDS = [
  "react",
  "next",
  "jquery",
  "node.js",
  "node",
  "express",
  "laravel",
  "mongodb",
  "javascript",
  "typescript",
  "tailwind",
  "css",
  "html",
  "rest",
  "api",
  "aws",
  "docker",
  "frontend",
  "backend",
  "full stack",
  "agile",
  "testing"
];

const stripRichText = (value = "") =>
  String(value).replace(/\[(\/)?(b|i|u|color(?::#[0-9a-fA-F]{3,6})?)\]/g, "");

export function extractKeywords(jobDescription = "") {
  const normalized = jobDescription.toLowerCase();
  const explicitMatches = KNOWN_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword)
  );

  const tokenMatches = normalized
    .replace(/[^a-z0-9+\-.#\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !COMMON_STOP_WORDS.has(token));

  return [...new Set([...explicitMatches, ...tokenMatches])]
    .map((keyword) => ({
      keyword,
      score:
        explicitMatches.includes(keyword) ? 3 : 1 + Math.min(keyword.length / 10, 1)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

export function optimizeResume(resume, keywords = []) {
  const keywordList = keywords.map((item) => item.keyword.toLowerCase());
  const scoreText = (text = "") =>
    keywordList.reduce(
      (score, keyword) =>
        score + (stripRichText(text).toLowerCase().includes(keyword) ? keyword.length : 0),
      0
    );

  const sortedSkills = [...resume.skills]
    .map((group) => ({
      ...group,
      items: [...group.items].sort(
        (a, b) => scoreText(b.name) - scoreText(a.name) || a.name.localeCompare(b.name)
      )
    }))
    .sort((a, b) => {
      const scoreGroup = (group) =>
        group.items.reduce((sum, item) => sum + scoreText(item.name), 0) + scoreText(group.category);
      return scoreGroup(b) - scoreGroup(a);
    });

  return {
    ...resume,
    skills: sortedSkills,
    projects: [...resume.projects].sort(
      (a, b) =>
        scoreText(`${b.name} ${b.stack} ${b.description}`) -
        scoreText(`${a.name} ${a.stack} ${a.description}`)
    ),
    experience: [...resume.experience].sort(
      (a, b) =>
        scoreText(`${b.role} ${b.company} ${b.achievements.join(" ")}`) -
        scoreText(`${a.role} ${a.company} ${a.achievements.join(" ")}`)
    )
  };
}
