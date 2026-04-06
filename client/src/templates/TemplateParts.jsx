import {
  hasEducationContent,
  hasExperienceContent,
  hasProjectContent,
  hasSkillContent,
  hasText
} from "../utils/resumeHelpers";
import { renderRichText } from "../utils/richText.jsx";

export function ResumeHeader({ personalInfo, centered = false, accent = "text-accent" }) {
  return (
    <header className={centered ? "text-center" : ""}>
      {hasText(personalInfo.fullName) && (
        <h1 className="text-4xl font-semibold uppercase tracking-[0.18em] text-ink resume-heading-font">
          {renderRichText(personalInfo.fullName, "fullName")}
        </h1>
      )}
      {hasText(personalInfo.title) && (
        <p className={`mt-2 text-sm font-semibold uppercase tracking-[0.25em] ${accent}`}>
          {renderRichText(personalInfo.title, "title")}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        {hasText(personalInfo.email) && <span>{personalInfo.email}</span>}
        {hasText(personalInfo.phone) && <span>{personalInfo.phone}</span>}
        {hasText(personalInfo.location) && <span>{personalInfo.location}</span>}
        {hasText(personalInfo.website) && <span>{personalInfo.website}</span>}
        {hasText(personalInfo.linkedin) && <span>{personalInfo.linkedin}</span>}
      </div>
      {hasText(personalInfo.summary) && (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          {renderRichText(personalInfo.summary, "summary")}
        </p>
      )}
    </header>
  );
}

export function SkillsList({ skills, compact = false, dark = false }) {
  if (!hasSkillContent(skills)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {skills
        .filter((group) => hasText(group.category) || group.items?.some((item) => hasText(item.name)))
        .map((group, groupIndex) => (
          <div key={`${group.category}-${groupIndex}`}>
            {hasText(group.category) && (
              <h3
                className={`resume-heading-font mb-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                  dark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {group.category}
              </h3>
            )}
            <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2"}>
              {group.items
                ?.filter((item) => hasText(item.name))
                .map((skill, index) => (
                  <div
                    key={`${skill.name}-${index}`}
                    className={
                      compact
                        ? `rounded-full px-3 py-1.5 text-xs font-semibold ${
                            dark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"
                          }`
                        : `flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                            dark ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700"
                          }`
                    }
                  >
                    <span>{renderRichText(skill.name, `skill-${groupIndex}-${index}`)}</span>
                    {!compact && hasText(skill.level) && (
                      <span className={`text-xs uppercase ${dark ? "text-slate-300" : "text-slate-400"}`}>
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export function ExperienceBlock({ experience, dark = false }) {
  if (!hasExperienceContent(experience)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {experience
        .filter(
          (item) =>
            hasText(item.role) ||
            hasText(item.company) ||
            hasText(item.startDate) ||
            hasText(item.endDate) ||
            item.achievements?.some((achievement) => hasText(achievement))
        )
        .map((item, index) => (
          <article key={`${item.company}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(item.role) && (
                  <h3 className={`resume-heading-font text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>
                    {renderRichText(item.role, `role-${index}`)}
                  </h3>
                )}
                {hasText(item.company) && (
                  <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>
                    {renderRichText(item.company, `company-${index}`)}
                  </p>
                )}
              </div>
              {(hasText(item.startDate) || hasText(item.endDate)) && (
                <p className={`text-xs uppercase tracking-[0.16em] ${dark ? "text-slate-400" : "text-slate-400"}`}>
                  {item.startDate}
                  {item.startDate && item.endDate ? " - " : ""}
                  {item.endDate}
                </p>
              )}
            </div>
            {item.achievements?.some((achievement) => hasText(achievement)) && (
              <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-6 ${dark ? "text-slate-200" : "text-slate-700"}`}>
                {item.achievements
                  .filter((achievement) => hasText(achievement))
                  .map((achievement, achievementIndex) => (
                    <li key={`${achievementIndex}-${index}`}>
                      {renderRichText(achievement, `achievement-${index}-${achievementIndex}`)}
                    </li>
                  ))}
              </ul>
            )}
          </article>
        ))}
    </div>
  );
}

export function ProjectBlock({ projects, dark = false }) {
  if (!hasProjectContent(projects)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {projects
        .filter(
          (project) =>
            hasText(project.name) ||
            hasText(project.stack) ||
            hasText(project.link) ||
            hasText(project.description)
        )
        .map((project, index) => (
          <article key={`${project.name}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(project.name) && (
                  <h3 className={`resume-heading-font text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>
                    {renderRichText(project.name, `project-name-${index}`)}
                  </h3>
                )}
                {hasText(project.stack) && (
                  <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>
                    {renderRichText(project.stack, `project-stack-${index}`)}
                  </p>
                )}
              </div>
              {hasText(project.link) && (
                <a
                  className={`text-xs uppercase tracking-[0.16em] ${dark ? "text-slate-200" : "text-accent"}`}
                  href={project.link}
                >
                  View
                </a>
              )}
            </div>
            {hasText(project.description) && (
              <div className={`mt-2 text-sm leading-6 ${dark ? "text-slate-200" : "text-slate-700"}`}>
                {renderRichText(project.description, `project-description-${index}`)}
              </div>
            )}
          </article>
        ))}
    </div>
  );
}

export function EducationBlock({ education, dark = false }) {
  if (!hasEducationContent(education)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {education
        .filter(
          (item) =>
            hasText(item.degree) ||
            hasText(item.institution) ||
            hasText(item.startDate) ||
            hasText(item.endDate) ||
            hasText(item.details)
        )
        .map((item, index) => (
          <article key={`${item.institution}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(item.degree) && (
                  <h3 className={`resume-heading-font text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>
                    {renderRichText(item.degree, `degree-${index}`)}
                  </h3>
                )}
                {hasText(item.institution) && (
                  <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                    {renderRichText(item.institution, `institution-${index}`)}
                  </p>
                )}
              </div>
              {(hasText(item.startDate) || hasText(item.endDate)) && (
                <p className={`text-xs uppercase tracking-[0.16em] ${dark ? "text-slate-400" : "text-slate-400"}`}>
                  {item.startDate}
                  {item.startDate && item.endDate ? " - " : ""}
                  {item.endDate}
                </p>
              )}
            </div>
            {hasText(item.details) && (
              <p className={`mt-2 text-sm leading-6 ${dark ? "text-slate-200" : "text-slate-700"}`}>
                {renderRichText(item.details, `education-details-${index}`)}
              </p>
            )}
          </article>
        ))}
    </div>
  );
}
