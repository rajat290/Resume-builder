import { useMemo, useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import RichTextField from "./RichTextField";
import {
  createEducation,
  createExperience,
  createProject,
  createSkillGroup,
  createSkillItem
} from "../utils/resumeHelpers";

const personalFields = [
  ["fullName", "Full name", false],
  ["title", "Professional title", true],
  ["email", "Email", false],
  ["phone", "Phone", false],
  ["location", "Location", false],
  ["website", "Website", false],
  ["linkedin", "LinkedIn", false]
];

const sectionDefaults = {
  personal: true,
  skills: true,
  experience: true,
  projects: false,
  education: false
};

const sectionConfig = [
  {
    key: "personal",
    title: "Personal Information",
    description: "Add contact details and a short introduction."
  },
  {
    key: "skills",
    title: "Skills",
    description: "Organize skills by category like Frontend, Backend, Cloud, or Tools."
  },
  {
    key: "experience",
    title: "Experience",
    description: "Add work history with impact bullets. Rich formatting is supported in each bullet."
  },
  {
    key: "projects",
    title: "Projects",
    description: "Add project highlights with links, stack, and styled descriptions."
  },
  {
    key: "education",
    title: "Education",
    description: "Add academic details and optional notes."
  }
];

export default function ResumeEditor({
  resume,
  setResume,
  mode = "desktop",
  openSection,
  onSectionChange,
  onSectionSave
}) {
  const [localOpenSections, setLocalOpenSections] = useState(sectionDefaults);
  const isMobileMode = mode === "mobile";

  const isSectionOpen = (section) =>
    isMobileMode ? openSection === section : Boolean(localOpenSections[section]);

  const toggleSection = (section) => {
    if (isMobileMode) {
      onSectionChange?.(openSection === section ? null : section);
      return;
    }

    setLocalOpenSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  };

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

  const addSkillGroup = () => {
    setResume((current) => ({
      ...current,
      skills: [...current.skills, createSkillGroup()]
    }));
  };

  const updateSkillGroup = (groupIndex, field, value) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.map((group, index) =>
        index === groupIndex ? { ...group, [field]: value } : group
      )
    }));
  };

  const addSkillToGroup = (groupIndex) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.map((group, index) =>
        index === groupIndex
          ? { ...group, items: [...group.items, createSkillItem()] }
          : group
      )
    }));
  };

  const updateSkillItem = (groupIndex, skillIndex, field, value) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.map((item, innerIndex) =>
                innerIndex === skillIndex ? { ...item, [field]: value } : item
              )
            }
          : group
      )
    }));
  };

  const removeSkillItem = (groupIndex, skillIndex) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.filter((_, innerIndex) => innerIndex !== skillIndex)
            }
          : group
      )
    }));
  };

  const removeSkillGroup = (groupIndex) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.filter((_, index) => index !== groupIndex)
    }));
  };

  const groupedSkillCount = useMemo(
    () => resume.skills.reduce((count, group) => count + group.items.length, 0),
    [resume.skills]
  );

  const cardClass = isMobileMode ? "space-y-4" : "space-y-6";
  const sectionGridClass = isMobileMode ? "grid gap-4" : "grid gap-4 md:grid-cols-2";
  const stackActionClass = isMobileMode ? "mt-4 grid gap-3" : "mt-4 flex gap-3";
  const saveButtonClass =
    "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800";
  const renderSectionSave = (section, label) => (
    <div className="mt-4 flex justify-end">
      <button
        type="button"
        className={saveButtonClass}
        onClick={() => onSectionSave?.(section, label)}
      >
        Save {label}
      </button>
    </div>
  );

  return (
    <div className={cardClass}>
      <CollapsibleCard
        title={sectionConfig[0].title}
        description={sectionConfig[0].description}
        isOpen={isSectionOpen("personal")}
        onToggle={() => toggleSection("personal")}
      >
        <div className={sectionGridClass}>
          {personalFields.map(([field, label, richText]) => (
            <div key={field} className={!isMobileMode && field === "title" ? "md:col-span-2" : ""}>
              {richText ? (
                <RichTextField
                  label={label}
                  multiline={false}
                  value={resume.personalInfo[field]}
                  onChange={(value) => updatePersonalInfo(field, value)}
                />
              ) : (
                <>
                  <label className="field-label">{label}</label>
                  <input
                    className="field-input"
                    placeholder={label}
                    value={resume.personalInfo[field]}
                    onChange={(event) => updatePersonalInfo(field, event.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <RichTextField
            label="Professional Summary"
            value={resume.personalInfo.summary}
            onChange={(value) => updatePersonalInfo("summary", value)}
            rows={isMobileMode ? 4 : 5}
          />
        </div>
        {renderSectionSave("personal", "Personal Info")}
      </CollapsibleCard>

      <CollapsibleCard
        title={sectionConfig[1].title}
        description={sectionConfig[1].description}
        isOpen={isSectionOpen("skills")}
        onToggle={() => toggleSection("skills")}
        actions={
          <button type="button" className="pill-button" onClick={addSkillGroup}>
            + Add category
          </button>
        }
      >
        <p className="mb-4 text-sm text-slate-500">
          {resume.skills.length} categories, {groupedSkillCount} skills total
        </p>
        <div className="space-y-4">
          {resume.skills.map((group, groupIndex) => (
            <div key={`${group.category}-${groupIndex}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className={isMobileMode ? "mb-4 grid gap-3" : "mb-4 grid gap-3 md:grid-cols-[1fr_auto]"}>
                <input
                  className="field-input"
                  placeholder="Category name"
                  value={group.category}
                  onChange={(event) =>
                    updateSkillGroup(groupIndex, "category", event.target.value)
                  }
                />
                <button
                  type="button"
                  className="pill-button"
                  onClick={() => removeSkillGroup(groupIndex)}
                >
                  Remove category
                </button>
              </div>
              <div className="space-y-3">
                {group.items.map((skill, skillIndex) => (
                  <div
                    key={`${skill.name}-${skillIndex}`}
                    className={isMobileMode ? "grid gap-3" : "grid gap-3 md:grid-cols-[1.3fr_1fr_auto]"}
                  >
                    <input
                      className="field-input"
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(event) =>
                        updateSkillItem(groupIndex, skillIndex, "name", event.target.value)
                      }
                    />
                    <select
                      className="field-input"
                      value={skill.level}
                      onChange={(event) =>
                        updateSkillItem(groupIndex, skillIndex, "level", event.target.value)
                      }
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => removeSkillItem(groupIndex, skillIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="pill-button mt-4"
                onClick={() => addSkillToGroup(groupIndex)}
              >
                + Add skill
              </button>
            </div>
          ))}
        </div>
        {renderSectionSave("skills", "Skills")}
      </CollapsibleCard>

      <CollapsibleCard
        title={sectionConfig[2].title}
        description={sectionConfig[2].description}
        isOpen={isSectionOpen("experience")}
        onToggle={() => toggleSection("experience")}
        actions={
          <button type="button" className="pill-button" onClick={() => addItem("experience", createExperience)}>
            + Add experience
          </button>
        }
      >
        <div className="space-y-4">
          {resume.experience.map((experience, index) => (
            <div key={`${experience.company}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className={isMobileMode ? "mb-3 grid gap-3" : "mb-3 grid gap-3 md:grid-cols-2"}>
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
                  <div key={`${achievementIndex}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <RichTextField
                      label={`Impact bullet ${achievementIndex + 1}`}
                      value={achievement}
                      onChange={(value) => updateAchievement(index, achievementIndex, value)}
                      rows={3}
                    />
                    <button
                      type="button"
                      className="pill-button mt-3"
                      onClick={() => removeAchievement(index, achievementIndex)}
                    >
                      Remove bullet
                    </button>
                  </div>
                ))}
              </div>

              <div className={stackActionClass}>
                <button type="button" className="pill-button" onClick={() => addAchievement(index)}>
                  + Add bullet
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
        </div>
        {renderSectionSave("experience", "Experience")}
      </CollapsibleCard>

      <CollapsibleCard
        title={sectionConfig[3].title}
        description={sectionConfig[3].description}
        isOpen={isSectionOpen("projects")}
        onToggle={() => toggleSection("projects")}
        actions={
          <button type="button" className="pill-button" onClick={() => addItem("projects", createProject)}>
            + Add project
          </button>
        }
      >
        <div className="space-y-4">
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
              <input
                className="field-input"
                placeholder="Date (e.g. Dec 2023 - Feb 2024)"
                value={project.date}
                onChange={(event) =>
                  updateListItem("projects", index, "date", event.target.value)
                }
              />
              <RichTextField
                label="Project description"
                value={project.description}
                onChange={(value) => updateListItem("projects", index, "description", value)}
                rows={4}
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
        </div>
        {renderSectionSave("projects", "Projects")}
      </CollapsibleCard>

      <CollapsibleCard
        title={sectionConfig[4].title}
        description={sectionConfig[4].description}
        isOpen={isSectionOpen("education")}
        onToggle={() => toggleSection("education")}
        actions={
          <button type="button" className="pill-button" onClick={() => addItem("education", createEducation)}>
            + Add education
          </button>
        }
      >
        <div className="space-y-4">
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
              <div className={isMobileMode ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}>
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
              <RichTextField
                label="Additional details"
                value={education.details}
                onChange={(value) => updateListItem("education", index, "details", value)}
                rows={4}
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
        </div>
        {renderSectionSave("education", "Education")}
      </CollapsibleCard>
    </div>
  );
}
