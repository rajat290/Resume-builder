import {
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader
} from "./TemplateParts";
import { hasEducationContent, hasExperienceContent, hasProjectContent, hasSkillContent, hasText } from "../utils/resumeHelpers";
import { renderRichText } from "../utils/richText.jsx";

export default function SidebarTemplate({ resume }) {
  return (
    <div className="resume-page resume-body-font grid grid-cols-[0.8fr_1.6fr] bg-white">
      <aside className="bg-ink p-8 text-white">
        {hasSkillContent(resume.skills) && (
          <>
            <h2 className="resume-heading-font mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Skills
            </h2>
            <div className="space-y-4">
              {resume.skills
                .filter((group) => group.items?.some((item) => hasText(item.name)))
                .map((group, groupIndex) => (
                  <div key={`${group.category}-${groupIndex}`}>
                    {hasText(group.category) && (
                      <p className="resume-heading-font mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {group.category}
                      </p>
                    )}
                    <div className="space-y-2">
                      {group.items
                        .filter((item) => hasText(item.name))
                        .map((skill, index) => (
                          <div key={`${skill.name}-${index}`} className="rounded-xl bg-white/10 px-3 py-2">
                            <p className="text-sm font-medium">
                              {renderRichText(skill.name, `sidebar-skill-${groupIndex}-${index}`)}
                            </p>
                            {hasText(skill.level) && (
                              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                                {skill.level}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {hasEducationContent(resume.education) && (
          <div className="mt-8">
            <h2 className="resume-heading-font mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education
                .filter((item) => hasText(item.degree) || hasText(item.institution) || hasText(item.details))
                .map((item, index) => (
                  <article key={`${item.institution}-${index}`}>
                    {hasText(item.degree) && <h3 className="resume-heading-font text-sm font-semibold text-white">{renderRichText(item.degree, `sidebar-degree-${index}`)}</h3>}
                    {hasText(item.institution) && <p className="text-sm text-slate-300">{renderRichText(item.institution, `sidebar-inst-${index}`)}</p>}
                    {(hasText(item.startDate) || hasText(item.endDate)) && (
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        {item.startDate}
                        {item.startDate && item.endDate ? " - " : ""}
                        {item.endDate}
                      </p>
                    )}
                    {hasText(item.details) && (
                      <p className="mt-2 text-sm leading-6 text-slate-300">{renderRichText(item.details, `sidebar-details-${index}`)}</p>
                    )}
                  </article>
                ))}
            </div>
          </div>
        )}
      </aside>
      <main className="p-10">
        <ResumeHeader personalInfo={resume.personalInfo} accent="text-ink" />
        {hasExperienceContent(resume.experience) && (
          <section className="mt-8">
            <h2 className="section-title">Experience</h2>
            <ExperienceBlock experience={resume.experience} />
          </section>
        )}
        {hasProjectContent(resume.projects) && (
          <section className="mt-8">
            <h2 className="section-title">Projects</h2>
            <ProjectBlock projects={resume.projects} />
          </section>
        )}
      </main>
    </div>
  );
}
