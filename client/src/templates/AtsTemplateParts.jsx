function PlainSection({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-black pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
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
      <h1 className={`${headingFont} text-[28px] font-bold uppercase tracking-[0.12em] text-black`}>
        {personalInfo.fullName}
      </h1>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-black">
        {personalInfo.title}
      </p>
      <p className="mt-3 text-[13px] leading-6 text-black">
        {[
          personalInfo.email,
          personalInfo.phone,
          personalInfo.location,
          personalInfo.website,
          personalInfo.linkedin
        ]
          .filter(Boolean)
          .join(" | ")}
      </p>
    </header>
  );
}

function PlainSummary({ summary }) {
  return <p className="text-[13px] leading-6 text-black">{summary}</p>;
}

function PlainSkills({ skills, inline = false }) {
  if (inline) {
    return (
      <p className="text-[13px] leading-6 text-black">
        {skills.map((skill) => skill.name).filter(Boolean).join(", ")}
      </p>
    );
  }

  return (
    <ul className="grid gap-1 text-[13px] text-black sm:grid-cols-2">
      {skills.map((skill, index) => (
        <li key={`${skill.name}-${index}`}>• {skill.name}</li>
      ))}
    </ul>
  );
}

function PlainExperience({ experience, tight = false }) {
  return (
    <div className={tight ? "space-y-4" : "space-y-5"}>
      {experience.map((item, index) => (
        <article key={`${item.company}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-black">{item.role}</h3>
              <p className="text-[13px] font-semibold text-black">{item.company}</p>
            </div>
            <p className="text-[12px] text-black">
              {item.startDate} - {item.endDate}
            </p>
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-6 text-black">
            {item.achievements.filter(Boolean).map((achievement, achievementIndex) => (
              <li key={`${achievementIndex}-${index}`}>{achievement}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function PlainProjects({ projects }) {
  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <article key={`${project.name}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-black">{project.name}</h3>
              <p className="text-[13px] text-black">{project.stack}</p>
            </div>
            {project.link && <p className="text-[12px] text-black">{project.link}</p>}
          </div>
          <p className="mt-1 text-[13px] leading-6 text-black">{project.description}</p>
        </article>
      ))}
    </div>
  );
}

function PlainEducation({ education }) {
  return (
    <div className="space-y-4">
      {education.map((item, index) => (
        <article key={`${item.institution}-${index}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-black">{item.degree}</h3>
              <p className="text-[13px] text-black">{item.institution}</p>
            </div>
            <p className="text-[12px] text-black">
              {item.startDate} - {item.endDate}
            </p>
          </div>
          <p className="mt-1 text-[13px] leading-6 text-black">{item.details}</p>
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
