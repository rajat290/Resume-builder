import {
  EducationBlock,
  ExperienceBlock,
  ProjectBlock,
  ResumeHeader,
  SkillsList
} from "./TemplateParts";

export default function ExecutiveTemplate({ resume }) {
  return (
    <div className="resume-page bg-paper p-10">
      <div className="border-b-4 border-accent pb-6">
        <ResumeHeader personalInfo={resume.personalInfo} />
      </div>
      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="section-title">Career Highlights</h2>
          <ExperienceBlock experience={resume.experience} />
        </section>
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="section-title">Selected Projects</h2>
            <ProjectBlock projects={resume.projects} />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="section-title">Technical Skills</h2>
              <SkillsList skills={resume.skills} />
            </div>
            <div>
              <h2 className="section-title">Education</h2>
              <EducationBlock education={resume.education} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
