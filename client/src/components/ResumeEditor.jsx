import {
  createEducation,
  createExperience,
  createProject,
  createSkill
} from "../utils/resumeHelpers";

const personalFields = [
  ["fullName", "Full name"],
  ["title", "Professional title"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["website", "Website"],
  ["linkedin", "LinkedIn"]
];

function ArraySection({ title, actionLabel, onAdd, children }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        <button type="button" className="pill-button" onClick={onAdd}>
          {actionLabel}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function ResumeEditor({ resume, setResume }) {
  const updatePersonalInfo = (field, value) => {
    setResume((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value
      }
    }));
  };

  const updateListItem = (section, index, field, value) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section, factory) => {
    setResume((current) => ({
      ...current,
      [section]: [...current[section], factory()]
    }));
  };

  const removeItem = (section, index) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const updateAchievement = (experienceIndex, achievementIndex, value) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((item, index) =>
        index === experienceIndex
          ? {
              ...item,
              achievements: item.achievements.map((achievement, innerIndex) =>
                innerIndex === achievementIndex ? value : achievement
              )
            }
          : item
      )
    }));
  };

  const addAchievement = (experienceIndex) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((item, index) =>
        index === experienceIndex
          ? {
              ...item,
              achievements: [...item.achievements, ""]
            }
          : item
      )
    }));
  };

  const removeAchievement = (experienceIndex, achievementIndex) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((item, index) =>
        index === experienceIndex
          ? {
              ...item,
              achievements: item.achievements.filter(
                (_, innerIndex) => innerIndex !== achievementIndex
              )
            }
          : item
      )
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
        <h2 className="mb-4 font-display text-2xl text-ink">Personal Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {personalFields.map(([field, label]) => (
            <div key={field}>
              <label className="field-label">{label}</label>
              <input
                className="field-input"
                value={resume.personalInfo[field]}
                onChange={(event) => updatePersonalInfo(field, event.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="field-label">Professional Summary</label>
          <textarea
            className="field-textarea"
            value={resume.personalInfo.summary}
            onChange={(event) => updatePersonalInfo("summary", event.target.value)}
          />
        </div>
      </section>

      <ArraySection
        title="Skills"
        actionLabel="Add skill"
        onAdd={() => addItem("skills", createSkill)}
      >
        {resume.skills.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1.4fr_1fr_auto]"
          >
            <input
              className="field-input"
              placeholder="Skill"
              value={skill.name}
              onChange={(event) =>
                updateListItem("skills", index, "name", event.target.value)
              }
            />
            <select
              className="field-input"
              value={skill.level}
              onChange={(event) =>
                updateListItem("skills", index, "level", event.target.value)
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button
              type="button"
              className="pill-button"
              onClick={() => removeItem("skills", index)}
            >
              Remove
            </button>
          </div>
        ))}
      </ArraySection>

      <ArraySection
        title="Experience"
        actionLabel="Add experience"
        onAdd={() => addItem("experience", createExperience)}
      >
        {resume.experience.map((experience, index) => (
          <div key={`${experience.company}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 grid gap-3 md:grid-cols-2">
              <input
                className="field-input"
                placeholder="Company"
                value={experience.company}
                onChange={(event) =>
                  updateListItem("experience", index, "company", event.target.value)
                }
              />
              <input
                className="field-input"
                placeholder="Role"
                value={experience.role}
                onChange={(event) =>
                  updateListItem("experience", index, "role", event.target.value)
                }
              />
              <input
                className="field-input"
                placeholder="Start date"
                value={experience.startDate}
                onChange={(event) =>
                  updateListItem("experience", index, "startDate", event.target.value)
                }
              />
              <input
                className="field-input"
                placeholder="End date"
                value={experience.endDate}
                onChange={(event) =>
                  updateListItem("experience", index, "endDate", event.target.value)
                }
              />
            </div>

            <div className="space-y-3">
              {experience.achievements.map((achievement, achievementIndex) => (
                <div
                  key={`${achievementIndex}-${index}`}
                  className="grid gap-3 md:grid-cols-[1fr_auto]"
                >
                  <input
                    className="field-input"
                    placeholder="Impact bullet"
                    value={achievement}
                    onChange={(event) =>
                      updateAchievement(index, achievementIndex, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="pill-button"
                    onClick={() => removeAchievement(index, achievementIndex)}
                  >
                    Remove bullet
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="pill-button"
                onClick={() => addAchievement(index)}
              >
                Add bullet
              </button>
              <button
                type="button"
                className="pill-button"
                onClick={() => removeItem("experience", index)}
              >
                Remove experience
              </button>
            </div>
          </div>
        ))}
      </ArraySection>

      <ArraySection
        title="Projects"
        actionLabel="Add project"
        onAdd={() => addItem("projects", createProject)}
      >
        {resume.projects.map((project, index) => (
          <div key={`${project.name}-${index}`} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <input
              className="field-input"
              placeholder="Project name"
              value={project.name}
              onChange={(event) =>
                updateListItem("projects", index, "name", event.target.value)
              }
            />
            <input
              className="field-input"
              placeholder="Tech stack"
              value={project.stack}
              onChange={(event) =>
                updateListItem("projects", index, "stack", event.target.value)
              }
            />
            <input
              className="field-input"
              placeholder="Project link"
              value={project.link}
              onChange={(event) =>
                updateListItem("projects", index, "link", event.target.value)
              }
            />
            <textarea
              className="field-textarea"
              placeholder="Project description"
              value={project.description}
              onChange={(event) =>
                updateListItem("projects", index, "description", event.target.value)
              }
            />
            <button
              type="button"
              className="pill-button w-fit"
              onClick={() => removeItem("projects", index)}
            >
              Remove project
            </button>
          </div>
        ))}
      </ArraySection>

      <ArraySection
        title="Education"
        actionLabel="Add education"
        onAdd={() => addItem("education", createEducation)}
      >
        {resume.education.map((education, index) => (
          <div key={`${education.institution}-${index}`} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <input
              className="field-input"
              placeholder="Institution"
              value={education.institution}
              onChange={(event) =>
                updateListItem("education", index, "institution", event.target.value)
              }
            />
            <input
              className="field-input"
              placeholder="Degree"
              value={education.degree}
              onChange={(event) =>
                updateListItem("education", index, "degree", event.target.value)
              }
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="field-input"
                placeholder="Start year"
                value={education.startDate}
                onChange={(event) =>
                  updateListItem("education", index, "startDate", event.target.value)
                }
              />
              <input
                className="field-input"
                placeholder="End year"
                value={education.endDate}
                onChange={(event) =>
                  updateListItem("education", index, "endDate", event.target.value)
                }
              />
            </div>
            <textarea
              className="field-textarea"
              placeholder="Additional details"
              value={education.details}
              onChange={(event) =>
                updateListItem("education", index, "details", event.target.value)
              }
            />
            <button
              type="button"
              className="pill-button w-fit"
              onClick={() => removeItem("education", index)}
            >
              Remove education
            </button>
          </div>
        ))}
      </ArraySection>
    </div>
  );
}
