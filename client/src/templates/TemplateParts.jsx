export function ResumeHeader({ personalInfo, centered = false, accent = "text-accent" }) {
  return (
    <header className={centered ? "text-center" : ""}>
      <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.18em] text-ink">
        {personalInfo.fullName}
      </h1>
      <p className={`mt-2 text-sm font-semibold uppercase tracking-[0.25em] ${accent}`}>
        {personalInfo.title}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <span>{personalInfo.email}</span>
        <span>{personalInfo.phone}</span>
        <span>{personalInfo.location}</span>
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">{personalInfo.summary}</p>
    </header>
  );
}

export function SkillsList({ skills, compact = false }) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2"}>
      {skills.map((skill, index) => (
        <div
          key={`${skill.name}-${index}`}
          className={
            compact
              ? "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
              : "flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
          }
        >
          <span>{skill.name}</span>
          {!compact && <span className="text-xs uppercase text-slate-400">{skill.level}</span>}
        </div>
      ))}
    </div>
  );
}

export function ExperienceBlock({ experience }) {
  return (
    <div className="space-y-4">
      {experience.map((item, index) => (
        <article key={`${item.company}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.role}</h3>
              <p className="text-sm font-medium text-slate-600">{item.company}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {item.startDate} - {item.endDate}
            </p>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {item.achievements.filter(Boolean).map((achievement, achievementIndex) => (
              <li key={`${achievementIndex}-${index}`}>{achievement}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function ProjectBlock({ projects }) {
  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <article key={`${project.name}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{project.name}</h3>
              <p className="text-sm text-slate-500">{project.stack}</p>
            </div>
            {project.link && (
              <a className="text-xs uppercase tracking-[0.16em] text-accent" href={project.link}>
                View
              </a>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p>
        </article>
      ))}
    </div>
  );
}

export function EducationBlock({ education }) {
  return (
    <div className="space-y-4">
      {education.map((item, index) => (
        <article key={`${item.institution}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.degree}</h3>
              <p className="text-sm text-slate-600">{item.institution}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {item.startDate} - {item.endDate}
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.details}</p>
        </article>
      ))}
    </div>
  );
}
