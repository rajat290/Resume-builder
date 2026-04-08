import {
  hasEducationContent,
  hasExperienceContent,
  hasProjectContent,
  hasSkillContent,
  hasText
} from "../utils/resumeHelpers";
import { renderRichText } from "../utils/richText.jsx";

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <div className="flex flex-col items-center">
        <h2 className="resume-heading-font text-[13px] font-bold uppercase tracking-[0.1em] text-[#0047AB]">
          {title}
        </h2>
        <div className="mt-1 h-[1px] w-full bg-[#0047AB]" />
      </div>
      <div className="mt-2 text-[11px] leading-snug text-black">{children}</div>
    </section>
  );
}

export default function ProfessionalUniversalTemplate({ resume }) {
  const { personalInfo, skills, experience, projects, education } = resume;

  return (
    <div className="resume-page bg-white px-10 pt-4 pb-10 text-black shadow-lg">
      <header className="flex flex-col items-center text-center">
        <h1 className="resume-heading-font text-[24px] font-bold uppercase tracking-tight text-black">
          {personalInfo.fullName}
        </h1>
        {hasText(personalInfo.title) && (
          <p className="mt-1 text-[12px] font-bold text-black">{personalInfo.title}</p>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-x-2 text-[11px] text-black">
          {hasText(personalInfo.phone) && <span>{personalInfo.phone}</span>}
          {hasText(personalInfo.email) && (
            <>
              <span className="text-gray-400">|</span>
              <span>{personalInfo.email}</span>
            </>
          )}
          {hasText(personalInfo.website) && (
            <>
              <span className="text-gray-400">|</span>
              <a href={personalInfo.website} className="hover:underline">Portfolio</a>
            </>
          )}
          {hasText(personalInfo.linkedin) && (
            <>
              <span className="text-gray-400">|</span>
              <a href={personalInfo.linkedin} className="hover:underline">LinkedIn</a>
            </>
          )}
          {personalInfo.github && (
             <>
              <span className="text-gray-400">|</span>
              <a href={personalInfo.github} className="hover:underline">GitHub</a>
            </>
          )}
          {hasText(personalInfo.location) && (
            <>
              <span className="text-gray-400">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
        </div>
      </header>

      {hasText(personalInfo.summary) && (
        <Section title="Professional Summary">
          <p className="text-justify">{renderRichText(personalInfo.summary, "universal-summary")}</p>
        </Section>
      )}

      {hasSkillContent(skills) && (
        <Section title="Technical Skills">
          <div className="space-y-1">
            {skills
              .filter((group) => group.items?.some((item) => hasText(item.name)))
              .map((group, groupIndex) => (
                <p key={groupIndex}>
                  <span className="font-bold">{group.category}: </span>
                  {group.items.filter((item) => hasText(item.name)).map((item) => item.name).join(", ")}
                </p>
              ))}
          </div>
        </Section>
      )}

      {hasExperienceContent(experience) && (
        <Section title="Professional Experience">
          <div className="space-y-4">
            {experience
              .filter((exp) => hasText(exp.role) || hasText(exp.company))
              .map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[11.5px] font-bold text-[#0047AB]">
                      {renderRichText(exp.role, `universal-role-${index}`)}
                    </h3>
                    <span className="text-[11px] font-bold">
                      {exp.startDate} {exp.startDate && exp.endDate ? " - " : ""} {exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className="text-[11px] font-bold">
                      {renderRichText(exp.company, `universal-company-${index}`)}
                    </p>
                    <span className="text-[11px] font-bold">{exp.location}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 space-y-0.5">
                      {exp.achievements
                        .filter(hasText)
                        .map((achievement, i) => (
                          <li key={i}>{renderRichText(achievement, `universal-exp-${index}-${i}`)}</li>
                        ))}
                    </ul>
                  )}
                  {hasText(exp.technologies) && (
                    <p className="mt-1 text-[11px]">
                      <span className="font-bold italic underline">Technologies Used: </span>
                      <span className="italic underline">{exp.technologies}</span>
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Section>
      )}

      {hasProjectContent(projects) && (
        <Section title="Projects">
          <div className="space-y-3">
            {projects
              .filter((proj) => hasText(proj.name))
              .map((proj, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[11.5px] font-bold text-[#0047AB]">
                        {renderRichText(proj.name, `universal-project-${index}`)}
                      </h3>
                      {hasText(proj.link) && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline">
                          {proj.link}
                        </a>
                      )}
                    </div>
                    {hasText(proj.date) && (
                      <span className="text-[11px] font-bold whitespace-nowrap ml-4">
                        {proj.date}
                      </span>
                    )}
                  </div>
                  {hasText(proj.stack) && (
                    <p className="text-[10px] font-semibold text-gray-700 mt-0.5">
                      {proj.stack}
                    </p>
                  )}
                  {hasText(proj.description) && (
                    <div className="mt-1 text-justify">
                      {renderRichText(proj.description, `universal-proj-desc-${index}`)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Section>
      )}

      {hasEducationContent(education) && (
        <Section title="Education">
          <div className="space-y-2">
            {education
              .filter((edu) => hasText(edu.institution))
              .map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <p className="flex-1">
                    <span className="font-bold text-[#0047AB]">{edu.degree}</span>
                    <span className="mx-2">|</span>
                    <span className="font-bold">{edu.startDate} - {edu.endDate}</span>
                    <span className="mx-2">|</span>
                    <span>{edu.institution}</span>
                  </p>
                </div>
              ))}
          </div>
        </Section>
      )}
    </div>
  );
}
