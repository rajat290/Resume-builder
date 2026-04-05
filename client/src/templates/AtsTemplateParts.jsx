import {
  hasEducationContent,
  hasExperienceContent,
  hasProjectContent,
  hasSkillContent,
  hasText
} from "../utils/resumeHelpers";
import { renderRichText } from "../utils/richText.jsx";

function PlainSection({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="resume-heading-font border-b border-black pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PlainHeader({ personalInfo, serif = false, centered = false }) {
  const containerClass = centered ? "text-center" : "";
  const headingFont = serif ? "font-serif" : "font-sans";

  return (
    <header className={containerClass}>
      {hasText(personalInfo.fullName) && (
        <h1 className={`${headingFont} resume-heading-font text-[28px] font-bold uppercase tracking-[0.12em] text-black`}>
          {renderRichText(personalInfo.fullName, "ats-full-name")}
        </h1>
      )}
      {hasText(personalInfo.title) && (
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-black">
          {renderRichText(personalInfo.title, "ats-title")}
        </p>
      )}
      <p className="mt-3 text-[13px] leading-6 text-black">
        {[
          personalInfo.email,
          personalInfo.phone,
          personalInfo.location,
          personalInfo.website,
          personalInfo.linkedin
        ]
          .filter(hasText)
          .join(" | ")}
      </p>
    </header>
  );
}

function PlainSummary({ summary }) {
  if (!hasText(summary)) {
    return null;
  }

  return <p className="text-[13px] leading-6 text-black">{renderRichText(summary, "ats-summary")}</p>;
}

function PlainSkills({ skills, inline = false }) {
  if (!hasSkillContent(skills)) {
    return null;
  }

  if (inline) {
    return (
      <div className="space-y-2 text-[13px] leading-6 text-black">
        {skills
          .filter((group) => group.items?.some((item) => hasText(item.name)))
          .map((group, groupIndex) => (
            <p key={`${group.category}-${groupIndex}`}>
              {hasText(group.category) && <span className="resume-heading-font font-bold">{group.category}: </span>}
              {group.items.filter((item) => hasText(item.name)).map((item) => item.name).join(", ")}
            </p>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-[13px] text-black">
      {skills
        .filter((group) => group.items?.some((item) => hasText(item.name)))
          .map((group, groupIndex) => (
          <div key={`${group.category}-${groupIndex}`}>
            {hasText(group.category) && <p className="resume-heading-font font-bold">{group.category}</p>}
            <ul className="grid gap-1 sm:grid-cols-2">
              {group.items
                .filter((item) => hasText(item.name))
                .map((skill, index) => (
                  <li key={`${skill.name}-${index}`}>
                    • {skill.name}
                    {hasText(skill.level) ? ` (${skill.level})` : ""}
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

function PlainExperience({ experience, tight = false }) {
  if (!hasExperienceContent(experience)) {
    return null;
  }

  return (
    <div className={tight ? "space-y-4" : "space-y-5"}>
      {experience
        .filter(
          (item) =>
            hasText(item.role) ||
            hasText(item.company) ||
            item.achievements?.some((achievement) => hasText(achievement))
        )
        .map((item, index) => (
          <article key={`${item.company}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(item.role) && (
                  <h3 className="resume-heading-font text-[14px] font-bold text-black">
                    {renderRichText(item.role, `ats-role-${index}`)}
                  </h3>
                )}
                {hasText(item.company) && (
                  <p className="text-[13px] font-semibold text-black">
                    {renderRichText(item.company, `ats-company-${index}`)}
                  </p>
                )}
              </div>
              {(hasText(item.startDate) || hasText(item.endDate)) && (
                <p className="text-[12px] text-black">
                  {item.startDate}
                  {item.startDate && item.endDate ? " - " : ""}
                  {item.endDate}
                </p>
              )}
            </div>
            {item.achievements?.some((achievement) => hasText(achievement)) && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-6 text-black">
                {item.achievements
                  .filter((achievement) => hasText(achievement))
                  .map((achievement, achievementIndex) => (
                    <li key={`${achievementIndex}-${index}`}>
                      {renderRichText(achievement, `ats-achievement-${index}-${achievementIndex}`)}
                    </li>
                  ))}
              </ul>
            )}
          </article>
        ))}
    </div>
  );
}

function PlainProjects({ projects }) {
  if (!hasProjectContent(projects)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {projects
        .filter((project) => hasText(project.name) || hasText(project.description))
        .map((project, index) => (
          <article key={`${project.name}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(project.name) && (
                  <h3 className="resume-heading-font text-[14px] font-bold text-black">
                    {renderRichText(project.name, `ats-project-name-${index}`)}
                  </h3>
                )}
                {hasText(project.stack) && <p className="text-[13px] text-black">{project.stack}</p>}
              </div>
              {hasText(project.link) && <p className="text-[12px] text-black">{project.link}</p>}
            </div>
            {hasText(project.description) && (
              <p className="mt-1 text-[13px] leading-6 text-black">
                {renderRichText(project.description, `ats-project-description-${index}`)}
              </p>
            )}
          </article>
        ))}
    </div>
  );
}

function PlainEducation({ education }) {
  if (!hasEducationContent(education)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {education
        .filter((item) => hasText(item.degree) || hasText(item.institution) || hasText(item.details))
        .map((item, index) => (
          <article key={`${item.institution}-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {hasText(item.degree) && (
                  <h3 className="resume-heading-font text-[14px] font-bold text-black">
                    {renderRichText(item.degree, `ats-degree-${index}`)}
                  </h3>
                )}
                {hasText(item.institution) && <p className="text-[13px] text-black">{item.institution}</p>}
              </div>
              {(hasText(item.startDate) || hasText(item.endDate)) && (
                <p className="text-[12px] text-black">
                  {item.startDate}
                  {item.startDate && item.endDate ? " - " : ""}
                  {item.endDate}
                </p>
              )}
            </div>
            {hasText(item.details) && <p className="mt-1 text-[13px] leading-6 text-black">{item.details}</p>}
          </article>
        ))}
    </div>
  );
}

export {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
};
