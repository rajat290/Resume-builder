import {
  EducationBlock,
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader,
  SkillsList
} from "./TemplateParts";

export default function CompactTemplate({ resume }) {
  return (
    <div className="resume-page bg-white p-8">
      <ResumeHeader personalInfo={resume.personalInfo} centered />
      <section className="mt-8">
        <h2 className="section-title text-center">Core Skills</h2>
        <SkillsList skills={resume.skills} compact />
      </section>
      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="section-title">Experience</h2>
          <ExperienceBlock experience={resume.experience} />
        </section>
        <section>
          <h2 className="section-title">Projects</h2>
          <ProjectBlock projects={resume.projects} />
        </section>
        <section>
          <h2 className="section-title">Education</h2>
          <EducationBlock education={resume.education} />
        </section>
      </div>
    </div>
  );
}
