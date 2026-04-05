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

export default function AtsDetailedTemplate({ resume }) {
  return (
    <div className="resume-page resume-body-font bg-white px-10 py-8 text-black">
      <div className="border border-black px-6 py-5">
        <PlainHeader personalInfo={resume.personalInfo} />
      </div>
      {hasText(resume.personalInfo.summary) && (
        <PlainSection title="Summary">
          <PlainSummary summary={resume.personalInfo.summary} />
        </PlainSection>
      )}
      {hasSkillContent(resume.skills) && (
        <PlainSection title="Core Skills">
          <PlainSkills skills={resume.skills} />
        </PlainSection>
      )}
      {hasExperienceContent(resume.experience) && (
        <PlainSection title="Work Experience">
          <PlainExperience experience={resume.experience} />
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
