import {
  EducationBlock,
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader,
  SkillsList
} from "./TemplateParts";
import {
  hasEducationContent,
  hasExperienceContent,
  hasProjectContent,
  hasSkillContent
} from "../utils/resumeHelpers";

export default function CompactTemplate({ resume }) {
  return (
    <div className="resume-page resume-body-font bg-white p-8">
      <ResumeHeader personalInfo={resume.personalInfo} centered />
      {hasSkillContent(resume.skills) && (
        <section className="mt-8">
          <h2 className="section-title text-center">Core Skills</h2>
          <SkillsList skills={resume.skills} compact />
        </section>
      )}
      <div className="mt-8 grid gap-8">
        {hasExperienceContent(resume.experience) && (
          <section>
            <h2 className="section-title">Experience</h2>
            <ExperienceBlock experience={resume.experience} />
          </section>
        )}
        {hasProjectContent(resume.projects) && (
          <section>
            <h2 className="section-title">Projects</h2>
            <ProjectBlock projects={resume.projects} />
          </section>
        )}
        {hasEducationContent(resume.education) && (
          <section>
            <h2 className="section-title">Education</h2>
            <EducationBlock education={resume.education} />
          </section>
        )}
      </div>
    </div>
  );
}
