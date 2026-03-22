import {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
} from "./AtsTemplateParts";

export default function AtsSerifTemplate({ resume }) {
  return (
    <div className="resume-page bg-white px-10 py-8 font-serif text-black">
      <PlainHeader personalInfo={resume.personalInfo} serif />
      <PlainSection title="Summary">
        <PlainSummary summary={resume.personalInfo.summary} />
      </PlainSection>
      <PlainSection title="Technical Skills">
        <PlainSkills skills={resume.skills} inline />
      </PlainSection>
      <PlainSection title="Professional Experience">
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
