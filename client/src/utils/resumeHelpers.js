const defaultPersonalInfo = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  summary: ""
};

const safeString = (value) => (typeof value === "string" ? value : "");

export const stripRichText = (value = "") =>
  safeString(value).replace(/\[(\/)?(b|i|u|color(?::#[0-9a-fA-F]{3,6})?)\]/g, "");

export const hasText = (value = "") => stripRichText(value).trim().length > 0;

export const createSkillItem = () => ({
  name: "",
  level: "Intermediate"
});

export const createSkillGroup = () => ({
  category: "New Category",
  items: [createSkillItem()]
});

export const createExperience = () => ({
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  achievements: [""]
});

export const createProject = () => ({
  name: "",
  stack: "",
  link: "",
  description: ""
});

export const createEducation = () => ({
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
  details: ""
});

export const emptyResume = {
  personalInfo: defaultPersonalInfo,
  skills: [createSkillGroup()],
  experience: [],
  projects: [],
  education: []
};

const normalizeSkillGroups = (skills = []) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    return [];
  }

  if (skills.some((group) => Array.isArray(group?.items))) {
    return skills.map((group) => ({
      category: safeString(group.category) || "Skills",
      items: Array.isArray(group.items)
        ? group.items.map((item) => ({
            name: safeString(item?.name),
            level: safeString(item?.level) || "Intermediate"
          }))
        : []
    }));
  }

  return [
    {
      category: "Core Skills",
      items: skills.map((item) => ({
        name: safeString(item?.name),
        level: safeString(item?.level) || "Intermediate"
      }))
    }
  ];
};

export const normalizeResumeData = (resume = {}) => ({
  personalInfo: {
    ...defaultPersonalInfo,
    ...resume.personalInfo
  },
  skills: normalizeSkillGroups(resume.skills),
  experience: Array.isArray(resume.experience)
    ? resume.experience.map((item) => ({
        company: safeString(item?.company),
        role: safeString(item?.role),
        startDate: safeString(item?.startDate),
        endDate: safeString(item?.endDate),
        achievements: Array.isArray(item?.achievements)
          ? item.achievements.map((achievement) => safeString(achievement))
          : []
      }))
    : [],
  projects: Array.isArray(resume.projects)
    ? resume.projects.map((item) => ({
        name: safeString(item?.name),
        stack: safeString(item?.stack),
        link: safeString(item?.link),
        description: safeString(item?.description)
      }))
    : [],
  education: Array.isArray(resume.education)
    ? resume.education.map((item) => ({
        institution: safeString(item?.institution),
        degree: safeString(item?.degree),
        startDate: safeString(item?.startDate),
        endDate: safeString(item?.endDate),
        details: safeString(item?.details)
      }))
    : []
});

export const hasSkillContent = (skills = []) =>
  skills.some(
    (group) =>
      hasText(group.category) ||
      group.items?.some((item) => hasText(item.name) || hasText(item.level))
  );

export const hasExperienceContent = (experience = []) =>
  experience.some(
    (item) =>
      hasText(item.company) ||
      hasText(item.role) ||
      hasText(item.startDate) ||
      hasText(item.endDate) ||
      item.achievements?.some((achievement) => hasText(achievement))
  );

export const hasProjectContent = (projects = []) =>
  projects.some(
    (item) =>
      hasText(item.name) ||
      hasText(item.stack) ||
      hasText(item.link) ||
      hasText(item.description)
  );

export const hasEducationContent = (education = []) =>
  education.some(
    (item) =>
      hasText(item.institution) ||
      hasText(item.degree) ||
      hasText(item.startDate) ||
      hasText(item.endDate) ||
      hasText(item.details)
  );

export const templateOptions = [
  { id: "classic", label: "Classic ATS" },
  { id: "sidebar", label: "Sidebar Focus" },
  { id: "compact", label: "Compact Recruiter" },
  { id: "executive", label: "Executive Clean" },
  { id: "ats-minimal", label: "ATS Minimal" },
  { id: "ats-compact", label: "ATS Compact" },
  { id: "ats-serif", label: "ATS Serif" },
  { id: "ats-detailed", label: "ATS Detailed" }
];

export const densityOptions = [
  { id: "compact", label: "Compact" },
  { id: "standard", label: "Standard" },
  { id: "comfortable", label: "Comfortable" }
];
