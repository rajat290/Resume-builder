export const emptyResume = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: ""
  },
  skills: [],
  experience: [],
  projects: [],
  education: []
};

export const createSkill = () => ({
  name: "",
  level: "Intermediate"
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

export const templateOptions = [
  { id: "classic", label: "Classic ATS" },
  { id: "sidebar", label: "Sidebar Focus" },
  { id: "compact", label: "Compact Recruiter" },
  { id: "executive", label: "Executive Clean" }
];
