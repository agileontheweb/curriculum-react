import { forwardRef } from 'react';
import { HiOutlineBuildingOffice2, HiOutlineCommandLine } from "react-icons/hi2";

const ExperienceContent = forwardRef(({ experience }, ref) => {
  if (!experience) return null;

  return (
    <div className="content-section">
      <div ref={ref} className="experience-card">
        <span className="experience-year-label">{experience.year}</span>
        <h2 className="experience-title">{experience.title}</h2>
        <div className="flex items-center gap-2 mt-2 opacity-80">
          <HiOutlineBuildingOffice2 className="text-sky-500 w-5 h-5" />
          <p className="experience-company !mt-0">{experience.company}</p>
        </div>
        <div className="experience-divider"></div>
        <p className="experience-description">{experience.description}</p>
        <div className="skills-container">
          {experience.skills.map(skill => (
            <span key={skill} className="skill-badge flex items-center gap-1.5">
              <HiOutlineCommandLine className="text-sky-400/70" />
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ExperienceContent;