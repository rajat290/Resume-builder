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

export default function ClassicTemplate({ resume }) {
  return (
    <div className="resume-page bg-white p-10">
      <ResumeHeader personalInfo={resume.personalInfo} />
      {hasSkillContent(resume.skills) && (
        <section className="mt-8">
          <h2 className="section-title">Skills</h2>
          <SkillsList skills={resume.skills} />
        </section>
      )}
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
      {hasEducationContent(resume.education) && (
        <section className="mt-8">
          <h2 className="section-title">Education</h2>
          <EducationBlock education={resume.education} />
        </section>
      )}
    </div>
  );
}
