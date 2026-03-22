import {
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader
} from "./TemplateParts";

export default function SidebarTemplate({ resume }) {
  return (
    <div className="resume-page grid grid-cols-[0.8fr_1.6fr] bg-white">
      <aside className="bg-ink p-8 text-white">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Skills
        </h2>
        <div className="space-y-2">
          {resume.skills.map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="rounded-xl bg-white/10 px-3 py-2">
              <p className="text-sm font-medium">{skill.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">{skill.level}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((item, index) => (
              <article key={`${item.institution}-${index}`}>
                <h3 className="text-sm font-semibold text-white">{item.degree}</h3>
                <p className="text-sm text-slate-300">{item.institution}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {item.startDate} - {item.endDate}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.details}</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
      <main className="p-10">
        <ResumeHeader personalInfo={resume.personalInfo} accent="text-ink" />
        <section className="mt-8">
          <h2 className="section-title">Experience</h2>
          <ExperienceBlock experience={resume.experience} />
        </section>
        <section className="mt-8">
          <h2 className="section-title">Projects</h2>
          <ProjectBlock projects={resume.projects} />
        </section>
      </main>
    </div>
  );
}
