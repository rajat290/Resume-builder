import {
  EducationBlock,
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader,
  SkillsList
} from "./TemplateParts";

export default function ClassicTemplate({ resume }) {
  return (
    <div className="resume-page bg-white p-10">
      <ResumeHeader personalInfo={resume.personalInfo} />
      <section className="mt-8">
        <h2 className="section-title">Skills</h2>
        <SkillsList skills={resume.skills} />
      </section>
      <section className="mt-8">
        <h2 className="section-title">Experience</h2>
        <ExperienceBlock experience={resume.experience} />
      </section>
      <section className="mt-8">
        <h2 className="section-title">Projects</h2>
        <ProjectBlock projects={resume.projects} />
      </section>
      <section className="mt-8">
        <h2 className="section-title">Education</h2>
        <EducationBlock education={resume.education} />
      </section>
    </div>
  );
}
