import {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
} from "./AtsTemplateParts";

export default function AtsCompactTemplate({ resume }) {
  return (
    <div className="resume-page bg-white px-9 py-7 font-sans text-black">
      <PlainHeader personalInfo={resume.personalInfo} centered />
      <PlainSection title="Professional Summary">
        <PlainSummary summary={resume.personalInfo.summary} />
      </PlainSection>
      <PlainSection title="Skills">
        <PlainSkills skills={resume.skills} />
      </PlainSection>
      <PlainSection title="Work Experience">
        <PlainExperience experience={resume.experience} tight />
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
