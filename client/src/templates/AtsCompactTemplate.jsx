import {
  PlainEducation,
  PlainExperience,
  PlainHeader,
  PlainProjects,
  PlainSection,
  PlainSkills,
  PlainSummary
} from "./AtsTemplateParts";
import { hasEducationContent, hasExperienceContent, hasProjectContent, hasSkillContent, hasText } from "../utils/resumeHelpers";

export default function AtsCompactTemplate({ resume }) {
  return (
    <div className="resume-page bg-white px-9 py-7 font-sans text-black">
      <PlainHeader personalInfo={resume.personalInfo} centered />
      {hasText(resume.personalInfo.summary) && (
        <PlainSection title="Professional Summary">
          <PlainSummary summary={resume.personalInfo.summary} />
        </PlainSection>
      )}
      {hasSkillContent(resume.skills) && (
        <PlainSection title="Skills">
          <PlainSkills skills={resume.skills} />
        </PlainSection>
      )}
      {hasExperienceContent(resume.experience) && (
        <PlainSection title="Work Experience">
          <PlainExperience experience={resume.experience} tight />
        </PlainSection>
      )}
      {hasProjectContent(resume.projects) && (
        <PlainSection title="Projects">
          <PlainProjects projects={resume.projects} />
        </PlainSection>
      )}
      {hasEducationContent(resume.education) && (
        <PlainSection title="Education">
          <PlainEducation education={resume.education} />
        </PlainSection>
      )}
    </div>
  );
}
