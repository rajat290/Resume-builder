import {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
} from "./AtsTemplateParts";

export default function AtsDetailedTemplate({ resume }) {
  return (
    <div className="resume-page bg-white px-10 py-8 font-sans text-black">
      <div className="border border-black px-6 py-5">
        <PlainHeader personalInfo={resume.personalInfo} />
      </div>
      <PlainSection title="Summary">
        <PlainSummary summary={resume.personalInfo.summary} />
      </PlainSection>
      <PlainSection title="Core Skills">
        <PlainSkills skills={resume.skills} />
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
