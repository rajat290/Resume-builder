export const resumeSeed = {
  personalInfo: {
    fullName: "Vikas Sharma",
    title: "Full Stack Developer",
    email: "vikas@example.com",
    phone: "+91 98765 43210",
    location: "Kolkata, India",
    website: "https://portfolio.example.com",
    linkedin: "https://linkedin.com/in/vikas",
    summary:
      "Full stack developer focused on building fast, ATS-friendly web products with clean user experiences and measurable impact."
  },
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React", level: "Advanced" },
        { name: "Tailwind CSS", level: "Advanced" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: "Advanced" },
        { name: "Express.js", level: "Advanced" },
        { name: "MongoDB", level: "Intermediate" }
      ]
    },
    {
      category: "Other",
      items: [{ name: "REST APIs", level: "Advanced" }]
    }
  ],
  experience: [
    {
      company: "TechNova Labs",
      role: "Software Engineer",
      startDate: "2023-01",
      endDate: "Present",
      achievements: [
        "Built recruiter-facing dashboards in React that reduced manual resume screening time by 35%.",
        "Created Node.js APIs for structured profile ingestion and search with clean JSON contracts."
      ]
    }
  ],
  projects: [
    {
      name: "ATS Resume Builder",
      stack: "React, Tailwind CSS, Node.js",
      link: "https://github.com/example/resume-builder",
      description:
        "Created a resume customization workflow with real-time preview, PDF export, and job-specific section prioritization."
    },
    {
      name: "Skill Match Analyzer",
      stack: "JavaScript, Express",
      link: "",
      description:
        "Developed a keyword extraction tool that scores resume alignment against job descriptions and highlights missing skills."
    }
  ],
  education: [
    {
      institution: "Tech University",
      degree: "B.Tech in Computer Science",
      startDate: "2019",
      endDate: "2023",
      details: "Focused on software engineering, data structures, and web systems."
    }
  ]
};
