import {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
} from "./AtsTemplateParts";

export default function AtsMinimalTemplate({ resume }) {
  return (
    <div className="resume-page bg-white px-10 py-8 font-sans text-black">
      <PlainHeader personalInfo={resume.personalInfo} />
      <PlainSection title="Professional Summary">
        <PlainSummary summary={resume.personalInfo.summary} />
      </PlainSection>
      <PlainSection title="Skills">
        <PlainSkills skills={resume.skills} inline />
      </PlainSection>
      <PlainSection title="Work Experience">
        <PlainExperience experience={resume.experience} />
      </PlainSection>
      <PlainSection title="Projects">
        <PlainProjects projects={resume.projects} />
      </PlainSection>
      <PlainSection title="Education">
        <PlainEducation education={resume.education} />
      </PlainSection>
    </div>
  );
}
